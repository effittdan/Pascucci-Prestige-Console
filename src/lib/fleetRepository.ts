import type { FleetManagerVehicle } from "../data/prototypeData";
import { fleetManagerVehicles } from "../data/prototypeData";
import { supabase } from "./supabase";

type FleetRow = {
  id: string;
  name: string;
  category: string | null;
  publication_status: "published" | "draft" | "needs_media" | "hidden";
  daily_rate: number | null;
  hourly_rate: number | null;
  passengers: number | null;
  drivetrain: string | null;
  transmission: string | null;
  engine: string | null;
  power: string | null;
  public_line: string | null;
  hero_image_path: string | null;
  photo_count: number;
  metadata: {
    display_slot?: string;
    highlights?: string[];
  } | null;
};

const statusFromDatabase: Record<FleetRow["publication_status"], FleetManagerVehicle["status"]> = {
  published: "Published",
  draft: "Draft",
  needs_media: "Needs media",
  hidden: "Hidden",
};

const statusToDatabase: Record<FleetManagerVehicle["status"], FleetRow["publication_status"]> = {
  Published: "published",
  Draft: "draft",
  "Needs media": "needs_media",
  Hidden: "hidden",
};

function money(value: number | null) {
  return value === null
    ? "$0"
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function templateFor(name: string) {
  return fleetManagerVehicles.find((vehicle) => vehicle.name === name) ?? fleetManagerVehicles[0];
}

function mapFleetRow(row: FleetRow): FleetManagerVehicle {
  const template = templateFor(row.name);
  return {
    ...template,
    id: row.id,
    name: row.name,
    category: row.category ?? template.category,
    status: statusFromDatabase[row.publication_status],
    displaySlot: row.metadata?.display_slot ?? template.displaySlot,
    dailyRate: money(row.daily_rate),
    hourlyRate: money(row.hourly_rate),
    passengers: String(row.passengers ?? template.passengers),
    drivetrain: row.drivetrain ?? template.drivetrain,
    transmission: row.transmission ?? template.transmission,
    engine: row.engine ?? template.engine,
    power: row.power ?? template.power,
    publicLine: row.public_line ?? template.publicLine,
    heroImage: row.hero_image_path ?? template.heroImage,
    photoCount: row.photo_count,
    photos: template.photos,
    highlights: row.metadata?.highlights ?? template.highlights,
    nextAction: row.photo_count >= template.maxPhotos ? "Real photography set complete" : "Complete photography",
  };
}

async function organizationId() {
  if (!supabase) return null;
  const { data, error } = await supabase.from("profiles").select("organization_id").single();
  if (error) throw error;
  return data.organization_id as string;
}

export async function loadFleet() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("vehicles")
    .select("id,name,category,publication_status,daily_rate,hourly_rate,passengers,drivetrain,transmission,engine,power,public_line,hero_image_path,photo_count,metadata")
    .order("name");
  if (error) throw error;
  return (data as FleetRow[]).map(mapFleetRow);
}

export async function saveFleetVehicle(vehicle: FleetManagerVehicle) {
  if (!supabase || !vehicle.id.includes("-")) return;
  const { error } = await supabase
    .from("vehicles")
    .update({
      publication_status: statusToDatabase[vehicle.status],
      daily_rate: Number(vehicle.dailyRate.replace(/[^0-9.]/g, "")) || 0,
      hourly_rate: Number(vehicle.hourlyRate.replace(/[^0-9.]/g, "")) || 0,
      public_line: vehicle.publicLine,
      metadata: {
        display_slot: vehicle.displaySlot,
        highlights: vehicle.highlights,
      },
    })
    .eq("id", vehicle.id);
  if (error) throw error;
}

export async function createFleetVehicle(vehicle: FleetManagerVehicle) {
  if (!supabase) return vehicle;
  const orgId = await organizationId();
  if (!orgId) return vehicle;
  const { data, error } = await supabase
    .from("vehicles")
    .insert({
      organization_id: orgId,
      unit_number: `PP-${vehicle.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 6).toUpperCase()}`,
      name: vehicle.name,
      category: vehicle.category,
      operational_status: "available",
      publication_status: statusToDatabase[vehicle.status],
      daily_rate: Number(vehicle.dailyRate.replace(/[^0-9.]/g, "")) || 0,
      hourly_rate: Number(vehicle.hourlyRate.replace(/[^0-9.]/g, "")) || 0,
      passengers: Number(vehicle.passengers) || null,
      drivetrain: vehicle.drivetrain,
      transmission: vehicle.transmission,
      engine: vehicle.engine,
      power: vehicle.power,
      public_line: vehicle.publicLine,
      hero_image_path: vehicle.heroImage,
      photo_count: vehicle.photoCount,
      readiness: 0,
      metadata: { display_slot: vehicle.displaySlot, highlights: vehicle.highlights },
    })
    .select("id,name,category,publication_status,daily_rate,hourly_rate,passengers,drivetrain,transmission,engine,power,public_line,hero_image_path,photo_count,metadata")
    .single();
  if (error) throw error;
  return mapFleetRow(data as FleetRow);
}
