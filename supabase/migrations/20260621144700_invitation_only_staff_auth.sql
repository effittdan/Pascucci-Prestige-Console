create table public.staff_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null default 'concierge'
    check (role in ('owner_admin', 'operations_manager', 'concierge', 'finance', 'driver')),
  invited_by uuid references auth.users(id),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, email)
);

alter table public.staff_invites enable row level security;

create policy staff_invites_owner_select on public.staff_invites
for select to authenticated
using (
  organization_id = (select private.current_organization_id())
  and (select private.current_staff_role()) = 'owner_admin'
);

create policy staff_invites_owner_insert on public.staff_invites
for insert to authenticated
with check (
  organization_id = (select private.current_organization_id())
  and (select private.current_staff_role()) = 'owner_admin'
);

create policy staff_invites_owner_update on public.staff_invites
for update to authenticated
using (
  organization_id = (select private.current_organization_id())
  and (select private.current_staff_role()) = 'owner_admin'
)
with check (organization_id = (select private.current_organization_id()));

create policy staff_invites_owner_delete on public.staff_invites
for delete to authenticated
using (
  organization_id = (select private.current_organization_id())
  and (select private.current_staff_role()) = 'owner_admin'
);

grant select, insert, update, delete on public.staff_invites to authenticated;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  matched_invite public.staff_invites%rowtype;
begin
  select * into matched_invite
  from public.staff_invites
  where lower(email) = lower(new.email)
    and accepted_at is null
  order by created_at
  limit 1;

  if matched_invite.id is null then
    raise exception 'This email has not been invited to the Pascucci Prestige Command Center.';
  end if;

  insert into public.profiles (id, organization_id, full_name, email, role)
  values (
    new.id,
    matched_invite.organization_id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    matched_invite.role
  );

  update public.staff_invites
  set accepted_at = now()
  where id = matched_invite.id;

  return new;
end;
$$;

create index staff_invites_organization_idx on public.staff_invites (organization_id);
create index staff_invites_invited_by_idx on public.staff_invites (invited_by);
