create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.organizations (name, slug)
values ('Pascucci Prestige', 'pascucci-prestige')
on conflict (slug) do nothing;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'concierge'
    check (role in ('owner_admin', 'operations_manager', 'concierge', 'finance', 'driver')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select organization_id
  from public.profiles
  where id = (select auth.uid()) and active = true
$$;

create or replace function private.current_staff_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.profiles
  where id = (select auth.uid()) and active = true
$$;

grant execute on function private.current_organization_id() to authenticated;
grant execute on function private.current_staff_role() to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_organization_id uuid;
  requested_role text;
begin
  select id into target_organization_id
  from public.organizations
  where slug = coalesce(new.raw_app_meta_data ->> 'organization_slug', 'pascucci-prestige');

  requested_role := coalesce(new.raw_app_meta_data ->> 'staff_role', 'concierge');
  if requested_role not in ('owner_admin', 'operations_manager', 'concierge', 'finance', 'driver') then
    requested_role := 'concierge';
  end if;

  insert into public.profiles (id, organization_id, full_name, email, role)
  values (
    new.id,
    target_organization_id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    requested_role
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_number text not null,
  legal_name text not null,
  preferred_name text,
  email text,
  phone text,
  preferred_contact text,
  status text not null default 'prospect'
    check (status in ('prospect', 'pending_review', 'approved', 'vip', 'restricted', 'do_not_rent', 'inactive')),
  tier text,
  source text,
  preferred_vehicle text,
  preferred_delivery_location text,
  service_notes text,
  profile_completeness integer not null default 0 check (profile_completeness between 0 and 100),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, customer_number)
);

create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  legal_name text not null,
  relationship text,
  email text,
  phone text,
  date_of_birth date,
  license_jurisdiction text,
  license_expiration date,
  insurance_status text,
  identity_status text,
  approval_status text not null default 'not_started'
    check (approval_status in ('not_started', 'documents_requested', 'under_review', 'approved', 'rejected', 'expired', 'suspended')),
  review_notes text,
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  unit_number text not null,
  name text not null,
  category text,
  plate text,
  vin text,
  operational_status text not null default 'available'
    check (operational_status in ('available', 'reserved', 'preparing', 'staged', 'active_rental', 'maintenance', 'incident_hold', 'inactive')),
  publication_status text not null default 'draft'
    check (publication_status in ('published', 'draft', 'needs_media', 'hidden')),
  daily_rate numeric(12,2),
  hourly_rate numeric(12,2),
  passengers integer,
  drivetrain text,
  transmission text,
  engine text,
  power text,
  public_line text,
  hero_image_path text,
  photo_count integer not null default 0,
  readiness integer not null default 0 check (readiness between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, unit_number)
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  reservation_number text not null,
  customer_id uuid not null references public.customers(id),
  vehicle_id uuid references public.vehicles(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'America/Chicago',
  status text not null default 'draft'
    check (status in ('draft', 'pending_customer', 'pending_review', 'tentative_hold', 'approved', 'confirmed', 'preparation', 'ready_for_departure', 'active', 'return_pending', 'returned', 'closeout_review', 'completed', 'cancelled', 'no_show')),
  approval_status text not null default 'pending',
  estimated_total numeric(12,2),
  final_total numeric(12,2),
  delivery_location text,
  assigned_concierge uuid references auth.users(id),
  assigned_driver uuid references auth.users(id),
  readiness jsonb not null default '{"customer":"pending","drivers":"pending","documents":"pending","agreement":"pending","payment":"deferred","vehicle":"pending","operations":"pending"}'::jsonb,
  internal_notes text,
  customer_instructions text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservation_dates_valid check (ends_at > starts_at),
  unique (organization_id, reservation_number)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text,
  task_type text not null,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'blocked', 'completed', 'cancelled')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  due_at timestamptz,
  assigned_to uuid references auth.users(id),
  customer_id uuid references public.customers(id) on delete set null,
  reservation_id uuid references public.reservations(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  completed_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_number text not null,
  reservation_id uuid references public.reservations(id) on delete set null,
  vehicle_id uuid not null references public.vehicles(id),
  customer_id uuid references public.customers(id) on delete set null,
  inspection_type text not null check (inspection_type in ('checkout', 'return', 'inventory', 'incident')),
  status text not null default 'draft'
    check (status in ('draft', 'in_progress', 'awaiting_acknowledgment', 'under_review', 'completed', 'void')),
  damage_review text not null default 'not_required'
    check (damage_review in ('not_required', 'pending', 'possible_change', 'confirmed_new_damage', 'dismissed')),
  assigned_to uuid references auth.users(id),
  due_at timestamptz,
  required_photos integer not null default 0,
  completed_photos integer not null default 0,
  starting_mileage integer,
  ending_mileage integer,
  fuel_level text,
  customer_acknowledged_at timestamptz,
  internal_notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, inspection_number)
);

create table public.inspection_zones (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  inspection_id uuid not null references public.inspections(id) on delete cascade,
  zone_code text not null,
  label text not null,
  zone_group text,
  required boolean not null default true,
  complete boolean not null default false,
  quality text not null default 'missing'
    check (quality in ('ready', 'needs_retake', 'reference_only', 'missing')),
  media_path text,
  notes text,
  captured_at timestamptz,
  captured_by uuid references auth.users(id),
  unique (inspection_id, zone_code)
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index customers_org_status_idx on public.customers (organization_id, status);
create index vehicles_org_status_idx on public.vehicles (organization_id, operational_status);
create index reservations_org_dates_idx on public.reservations (organization_id, starts_at, ends_at);
create index reservations_vehicle_dates_idx on public.reservations (vehicle_id, starts_at, ends_at);
create index tasks_org_due_idx on public.tasks (organization_id, due_at);
create index inspections_org_due_idx on public.inspections (organization_id, due_at);
create index audit_events_org_created_idx on public.audit_events (organization_id, created_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger organizations_set_updated_at before update on public.organizations
for each row execute function private.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function private.set_updated_at();
create trigger customers_set_updated_at before update on public.customers
for each row execute function private.set_updated_at();
create trigger drivers_set_updated_at before update on public.drivers
for each row execute function private.set_updated_at();
create trigger vehicles_set_updated_at before update on public.vehicles
for each row execute function private.set_updated_at();
create trigger reservations_set_updated_at before update on public.reservations
for each row execute function private.set_updated_at();
create trigger tasks_set_updated_at before update on public.tasks
for each row execute function private.set_updated_at();
create trigger inspections_set_updated_at before update on public.inspections
for each row execute function private.set_updated_at();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.drivers enable row level security;
alter table public.vehicles enable row level security;
alter table public.reservations enable row level security;
alter table public.tasks enable row level security;
alter table public.inspections enable row level security;
alter table public.inspection_zones enable row level security;
alter table public.audit_events enable row level security;

create policy organizations_select on public.organizations
for select to authenticated
using (id = (select private.current_organization_id()));

create policy profiles_select on public.profiles
for select to authenticated
using (organization_id = (select private.current_organization_id()));
create policy profiles_update on public.profiles
for update to authenticated
using (
  organization_id = (select private.current_organization_id())
  and (id = (select auth.uid()) or (select private.current_staff_role()) = 'owner_admin')
)
with check (organization_id = (select private.current_organization_id()));

create policy customers_staff_access on public.customers
for all to authenticated
using (organization_id = (select private.current_organization_id()))
with check (organization_id = (select private.current_organization_id()));
create policy drivers_staff_access on public.drivers
for all to authenticated
using (organization_id = (select private.current_organization_id()))
with check (organization_id = (select private.current_organization_id()));
create policy vehicles_staff_access on public.vehicles
for all to authenticated
using (organization_id = (select private.current_organization_id()))
with check (organization_id = (select private.current_organization_id()));
create policy reservations_staff_access on public.reservations
for all to authenticated
using (organization_id = (select private.current_organization_id()))
with check (organization_id = (select private.current_organization_id()));
create policy tasks_staff_access on public.tasks
for all to authenticated
using (organization_id = (select private.current_organization_id()))
with check (organization_id = (select private.current_organization_id()));
create policy inspections_staff_access on public.inspections
for all to authenticated
using (organization_id = (select private.current_organization_id()))
with check (organization_id = (select private.current_organization_id()));
create policy inspection_zones_staff_access on public.inspection_zones
for all to authenticated
using (organization_id = (select private.current_organization_id()))
with check (organization_id = (select private.current_organization_id()));
create policy audit_events_select on public.audit_events
for select to authenticated
using (organization_id = (select private.current_organization_id()));
create policy audit_events_insert on public.audit_events
for insert to authenticated
with check (organization_id = (select private.current_organization_id()));

revoke all on all tables in schema public from anon;
grant select on public.organizations to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.customers to authenticated;
grant select, insert, update, delete on public.drivers to authenticated;
grant select, insert, update, delete on public.vehicles to authenticated;
grant select, insert, update, delete on public.reservations to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
grant select, insert, update, delete on public.inspections to authenticated;
grant select, insert, update, delete on public.inspection_zones to authenticated;
grant select, insert on public.audit_events to authenticated;
grant usage, select on sequence public.audit_events_id_seq to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('customer-documents', 'customer-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']),
  ('inspection-media', 'inspection-media', false, 20971520, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy staff_read_private_storage on storage.objects
for select to authenticated
using (
  bucket_id in ('customer-documents', 'inspection-media')
  and (storage.foldername(name))[1] = (select private.current_organization_id())::text
);

create policy staff_upload_private_storage on storage.objects
for insert to authenticated
with check (
  bucket_id in ('customer-documents', 'inspection-media')
  and (storage.foldername(name))[1] = (select private.current_organization_id())::text
);

create policy staff_update_private_storage on storage.objects
for update to authenticated
using (
  bucket_id in ('customer-documents', 'inspection-media')
  and (storage.foldername(name))[1] = (select private.current_organization_id())::text
)
with check (
  bucket_id in ('customer-documents', 'inspection-media')
  and (storage.foldername(name))[1] = (select private.current_organization_id())::text
);

create policy staff_delete_private_storage on storage.objects
for delete to authenticated
using (
  bucket_id in ('customer-documents', 'inspection-media')
  and (storage.foldername(name))[1] = (select private.current_organization_id())::text
);
