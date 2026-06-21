import {
  BadgeDollarSign,
  CalendarDays,
  CarFront,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  Home,
  LucideIcon,
  MessagesSquare,
  Settings,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
  Wrench,
} from "lucide-react";

export type Role =
  | "owner_admin"
  | "operations_manager"
  | "concierge"
  | "finance"
  | "driver"
  | "marketing";

export type ReadinessState = "complete" | "pending" | "warning" | "blocked" | "overridden";

export type ModuleId =
  | "today"
  | "calendar"
  | "reservations"
  | "fleet"
  | "customers"
  | "leads"
  | "operations"
  | "inspections"
  | "maintenance"
  | "messages"
  | "finance"
  | "reports"
  | "settings";

export type NavItem = {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  roles: Role[];
};

export const roles: { id: Role; label: string; description: string }[] = [
  {
    id: "owner_admin",
    label: "Owner Admin",
    description: "Full access, approvals, settings, audit, and finance.",
  },
  {
    id: "operations_manager",
    label: "Operations Manager",
    description: "Runs daily fleet, reservations, tasks, and inspections.",
  },
  {
    id: "concierge",
    label: "Concierge",
    description: "Leads, customers, documents, quotes, and coordination.",
  },
  {
    id: "finance",
    label: "Finance",
    description: "Payments, charges, refunds, and financial reports.",
  },
  {
    id: "driver",
    label: "Driver",
    description: "Assigned delivery, pickup, and inspection workflows.",
  },
];

export const navItems: NavItem[] = [
  { id: "today", label: "Today", icon: Home, roles: ["owner_admin", "operations_manager", "concierge", "driver"] },
  { id: "calendar", label: "Calendar", icon: CalendarDays, roles: ["owner_admin", "operations_manager", "concierge"] },
  { id: "reservations", label: "Reservations", icon: ClipboardCheck, roles: ["owner_admin", "operations_manager", "concierge"] },
  { id: "fleet", label: "Fleet", icon: CarFront, roles: ["owner_admin", "operations_manager", "concierge"] },
  { id: "customers", label: "Customers", icon: UsersRound, roles: ["owner_admin", "operations_manager", "concierge"] },
  { id: "leads", label: "Leads & Quotes", icon: UserRoundCheck, roles: ["owner_admin", "operations_manager", "concierge", "marketing"] },
  { id: "operations", label: "Operations", icon: Gauge, roles: ["owner_admin", "operations_manager", "concierge", "driver"] },
  { id: "inspections", label: "Inspections", icon: FileCheck2, roles: ["owner_admin", "operations_manager", "driver"] },
  { id: "maintenance", label: "Maintenance", icon: Wrench, roles: ["owner_admin", "operations_manager"] },
  { id: "messages", label: "Messages", icon: MessagesSquare, roles: ["owner_admin", "operations_manager", "concierge", "driver"] },
  { id: "finance", label: "Finance", icon: BadgeDollarSign, roles: ["owner_admin", "finance"] },
  { id: "reports", label: "Reports", icon: Gauge, roles: ["owner_admin", "operations_manager", "finance"] },
  { id: "settings", label: "Settings", icon: Settings, roles: ["owner_admin"] },
];

export const metricCards = [
  { label: "Fleet vehicles", value: "3", detail: "All vehicle records published", tone: "complete" },
  { label: "Active rentals", value: "0", detail: "No live reservations", tone: "pending" },
  { label: "Customer records", value: "0", detail: "Ready for first intake", tone: "pending" },
  { label: "Open tasks", value: "0", detail: "Operations queue is clear", tone: "complete" },
];

export const readinessItems: { label: string; state: ReadinessState; detail: string }[] = [
  { label: "Customer", state: "complete", detail: "Approved profile" },
  { label: "Drivers", state: "warning", detail: "Secondary driver review due" },
  { label: "Documents", state: "blocked", detail: "Insurance expires today" },
  { label: "Agreement", state: "pending", detail: "Sent, not signed" },
  { label: "Payment", state: "complete", detail: "Authorization active" },
  { label: "Vehicle", state: "complete", detail: "Detailed and staged" },
  { label: "Delivery", state: "overridden", detail: "Owner approved hotel handoff" },
];

export const timelineEvents: Array<{
  time: string;
  activity: string;
  vehicle: string;
  customer: string;
  location: string;
  owner: string;
  status: string;
}> = [];

export const attentionQueue: Array<{ label: string; entity: string; severity: string }> = [];

export const vehicles = [
  { name: "McLaren GT", plate: "PP-MCL", status: "Available", next: "No reservation assigned", readiness: 100 },
  { name: "Lamborghini Urus", plate: "PP-URUS", status: "Available", next: "No reservation assigned", readiness: 100 },
  { name: "Porsche 911 Cabriolet", plate: "PP-911", status: "Available", next: "No reservation assigned", readiness: 100 },
];

export type FleetManagerVehicle = {
  id: string;
  name: string;
  category: string;
  status: "Published" | "Draft" | "Needs media" | "Hidden";
  displaySlot: string;
  dailyRate: string;
  hourlyRate: string;
  passengers: string;
  drivetrain: string;
  transmission: string;
  engine: string;
  power: string;
  heroImage: string;
  photos: string[];
  photoCount: number;
  maxPhotos: number;
  requiredShots: string[];
  missingShots: string[];
  highlights: string[];
  publicLine: string;
  nextAction: string;
};

export const fleetManagerVehicles: FleetManagerVehicle[] = [
  {
    id: "fleet-mclaren-gt",
    name: "McLaren GT",
    category: "Grand Tourer",
    status: "Published",
    displaySlot: "Featured 01",
    dailyRate: "$1,099",
    hourlyRate: "$250",
    passengers: "2",
    drivetrain: "Rear-wheel drive",
    transmission: "7-speed dual-clutch",
    engine: "4.0L twin-turbocharged V8",
    power: "612 hp",
    heroImage: "/concierge-assets/cars/mclaren-gt-real-01.jpg",
    photos: [
      "/concierge-assets/cars/mclaren-gt-real-01.jpg",
      "/concierge-assets/cars/mclaren-gt-real-02.jpg",
      "/concierge-assets/cars/mclaren-gt-real-03.jpg",
      "/concierge-assets/cars/mclaren-gt-real-04.jpg",
      "/concierge-assets/cars/mclaren-gt-real-05.jpg",
      "/concierge-assets/cars/mclaren-gt-real-06.jpg",
      "/concierge-assets/cars/mclaren-gt-real-07.jpg",
      "/concierge-assets/cars/mclaren-gt-real-08.jpg",
      "/concierge-assets/cars/mclaren-gt-real-09.jpg",
      "/concierge-assets/cars/mclaren-gt-real-10.jpg",
      "/concierge-assets/cars/mclaren-gt-real-11.jpg",
      "/concierge-assets/cars/mclaren-gt-real-12.jpg",
    ],
    photoCount: 12,
    maxPhotos: 12,
    requiredShots: [
      "Front three-quarter",
      "Doors-open exterior",
      "Rear three-quarter",
      "Cockpit",
      "Front seats",
      "Rear luggage area",
      "Front luggage area",
      "Wheel detail",
      "Console controls",
      "McLaren badge",
      "Infotainment",
      "Front doors-open view",
    ],
    missingShots: [],
    highlights: ["Grand touring comfort", "Low-slung supercar profile", "Concierge delivery"],
    publicLine: "Supercar presence with long-distance composure.",
    nextAction: "Real photography set complete",
  },
  {
    id: "fleet-lamborghini-urus",
    name: "Lamborghini Urus",
    category: "Luxury SUV",
    status: "Published",
    displaySlot: "Featured 02",
    dailyRate: "$1,199",
    hourlyRate: "$300",
    passengers: "5",
    drivetrain: "All-wheel drive",
    transmission: "8-speed automatic",
    engine: "4.0L twin-turbocharged V8",
    power: "641 hp",
    heroImage: "/concierge-assets/cars/lamborghini-urus-real-01.jpg",
    photos: [
      "/concierge-assets/cars/lamborghini-urus-real-01.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-02.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-03.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-04.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-05.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-06.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-07.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-08.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-09.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-10.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-11.jpg",
      "/concierge-assets/cars/lamborghini-urus-real-12.jpg",
    ],
    photoCount: 12,
    maxPhotos: 12,
    requiredShots: [
      "Front three-quarter",
      "Alternate front three-quarter",
      "Side profile",
      "Rear three-quarter",
      "Cockpit",
      "Front seats",
      "Rear seats",
      "Cargo area",
      "Wheel detail",
      "Lamborghini badge",
      "Door trim",
      "Drive-mode controls",
    ],
    missingShots: [],
    highlights: ["Orange exterior", "Super-SUV performance", "Flexible delivery"],
    publicLine: "Supercar soul. SUV freedom.",
    nextAction: "Real photography set complete",
  },
  {
    id: "fleet-porsche-911-cabriolet",
    name: "Porsche 911 Cabriolet",
    category: "Convertible",
    status: "Published",
    displaySlot: "Featured 03",
    dailyRate: "$799",
    hourlyRate: "$160",
    passengers: "4",
    drivetrain: "Rear-wheel drive",
    transmission: "8-speed PDK",
    engine: "3.0L twin-turbocharged flat-six",
    power: "379 hp",
    heroImage: "/concierge-assets/cars/porsche-911-cabriolet-real-01.jpg",
    photos: [
      "/concierge-assets/cars/porsche-911-cabriolet-real-01.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-02.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-03.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-04.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-05.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-06.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-07.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-08.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-09.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-10.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-11.jpg",
      "/concierge-assets/cars/porsche-911-cabriolet-real-12.jpg",
    ],
    photoCount: 12,
    maxPhotos: 12,
    requiredShots: [
      "Front three-quarter, roof open",
      "Front three-quarter, roof closed",
      "Side profile, roof open",
      "Rear three-quarter, roof open",
      "Cockpit",
      "Front seats",
      "Rear seats",
      "Front luggage area",
      "Wheel detail",
      "Rear spoiler and badge",
      "Center console",
      "Infotainment and drive controls",
    ],
    missingShots: [],
    highlights: ["Silver cabriolet", "Open-air grand touring", "Availability by request"],
    publicLine: "Open-air precision with everyday polish.",
    nextAction: "Real photography set complete",
  },
];

export const fleetManagerBlueprint = [
  "Upload up to 12 public photos per vehicle",
  "Choose one card/hero image",
  "Tag exterior, interior, detail, and feature shots",
  "Set daily and hourly pricing",
  "Publish, draft, hide, or request more media",
  "Feed the public site and future reservation calendar from one vehicle record",
];

export type ClientIntakeStage = "Lead" | "Profile started" | "Documents needed" | "Payment ready" | "Approved";

export type ClientIntakeProfile = {
  id: string;
  name: string;
  stage: ClientIntakeStage;
  source: string;
  preferredVehicle: string;
  tripWindow: string;
  profileCompleteness: number;
  paymentStatus: string;
  squareCustomer: string;
  savedPayment: string;
  nextAction: string;
};

export const clientIntakeProfiles: ClientIntakeProfile[] = [];

export const intakeProfileRequirements = [
  "Contact details and preferred communication",
  "Primary renter identity",
  "Driver license and insurance uploads",
  "Rental purpose, location, and vehicle interest",
  "Internal approval and risk review",
  "Approval status for future rentals",
];

export const intakePaymentBlueprint = [
  "Keep customer intake usable before a payment provider is connected",
  "Add the provider only behind authenticated server functions",
  "Store provider references instead of sensitive payment credentials",
  "Keep security authorization separate from rental charges",
  "Audit every future payment, refund, and authorization event",
];

export const ipadIntakeSteps = [
  { label: "Profile", detail: "Name, phone, email, address, and preferred contact." },
  { label: "Rental", detail: "Vehicle interest, date window, delivery location, and occasion." },
  { label: "Documents", detail: "License, insurance, additional drivers, and approval notes." },
  { label: "Approval", detail: "Concierge review, driver eligibility, insurance, and internal service notes." },
  { label: "Review", detail: "Concierge review before profile becomes approved for reservations." },
];

export const reservations: Array<{
  id: string;
  customer: string;
  vehicle: string;
  status: string;
  total: string;
  dates: string;
  issue: string;
}> = [];

export const tasks: Array<{
  title: string;
  type: string;
  due: string;
  assignee: string;
  status: string;
}> = [];

export const auditEvents: Array<{ action: string; actor: string; entity: string; time: string }> = [];

export const serviceBoundaries = [
  "Reservation service",
  "Availability service",
  "Pricing service",
  "Approval service",
  "Inspection service",
  "Finance service",
  "Audit service",
];

export const securityPrinciples = [
  { icon: ShieldCheck, label: "RLS-first permissions", text: "Every future mutation and record view maps to a role and organization policy." },
  { icon: FileCheck2, label: "Private document handling", text: "Sensitive files are designed for private buckets and signed access." },
  { icon: ClipboardCheck, label: "Audited state changes", text: "Role changes, overrides, payments, and status transitions are modeled as traceable events." },
];

export type InspectionStatus = "Draft" | "In progress" | "Awaiting acknowledgment" | "Under review" | "Completed";

export type DamageReviewStatus = "Not required" | "Pending" | "Possible change" | "Confirmed new damage" | "Dismissed";

export type InspectionQueueItem = {
  id: string;
  reservation: string;
  customer: string;
  vehicle: string;
  type: "Checkout" | "Return" | "Inventory";
  status: InspectionStatus;
  damageReview: DamageReviewStatus;
  due: string;
  assignedTo: string;
  requiredPhotos: number;
  completedPhotos: number;
  note: string;
};

export type InspectionZone = {
  code: string;
  label: string;
  group: string;
  required: boolean;
  complete: boolean;
  quality: "Ready" | "Needs retake" | "Reference only" | "Missing";
};

export type ComparisonPair = {
  zone: string;
  checkoutTime: string;
  returnTime: string;
  status: DamageReviewStatus;
  note: string;
};

export const inspectionMetrics = [
  { label: "Due today", value: "0", detail: "No inspections scheduled" },
  { label: "Photo zones open", value: "0", detail: "No active inspections" },
  { label: "Acknowledgments", value: "0", detail: "Nothing awaiting review" },
  { label: "Manager reviews", value: "0", detail: "No damage flags" },
];

export const inspectionQueue: InspectionQueueItem[] = [];

export const inspectionZones: InspectionZone[] = [
  { code: "front", label: "Front straight-on", group: "Exterior", required: true, complete: true, quality: "Ready" },
  { code: "rear", label: "Rear straight-on", group: "Exterior", required: true, complete: true, quality: "Ready" },
  { code: "driver-side", label: "Driver side", group: "Exterior", required: true, complete: true, quality: "Ready" },
  { code: "passenger-side", label: "Passenger side", group: "Exterior", required: true, complete: true, quality: "Ready" },
  { code: "fd-wheel", label: "Front driver wheel", group: "Wheels", required: true, complete: true, quality: "Reference only" },
  { code: "fp-wheel", label: "Front passenger wheel", group: "Wheels", required: true, complete: true, quality: "Ready" },
  { code: "rd-wheel", label: "Rear driver wheel", group: "Wheels", required: true, complete: false, quality: "Needs retake" },
  { code: "rp-wheel", label: "Rear passenger wheel", group: "Wheels", required: true, complete: false, quality: "Missing" },
  { code: "cockpit", label: "Driver cockpit and dashboard", group: "Interior", required: true, complete: false, quality: "Missing" },
  { code: "odometer", label: "Odometer and warning lights", group: "Interior", required: true, complete: false, quality: "Missing" },
  { code: "keys", label: "Key and accessory set", group: "Additional", required: true, complete: false, quality: "Missing" },
];

export const comparisonPairs: ComparisonPair[] = [
  {
    zone: "Passenger rear wheel",
    checkoutTime: "Jun 8, 8:04 AM",
    returnTime: "Jun 9, 10:18 AM",
    status: "Possible change",
    note: "New outer-rim mark flagged by staff. Manager review required before claim language.",
  },
  {
    zone: "Front fascia and lower splitter",
    checkoutTime: "Jun 8, 8:06 AM",
    returnTime: "Jun 9, 10:21 AM",
    status: "Dismissed",
    note: "Lighting variation only. Existing marker retained on customer-facing report.",
  },
  {
    zone: "Cargo area",
    checkoutTime: "Jun 8, 8:12 AM",
    returnTime: "Jun 9, 10:26 AM",
    status: "Not required",
    note: "No visible change. Accessory kit confirmed.",
  },
];

export const inspectionFoundation = [
  "Private original image storage with signed display URLs",
  "Versioned inspection records locked after submission",
  "Customer-safe report snapshots separate from internal notes",
  "Human-only damage confirmation and charge decisions",
  "Audit events for uploads, retakes, annotations, review, and voids",
  "Future AI comparison boundary returns possible changes only",
];
