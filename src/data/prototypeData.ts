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
  { label: "Departures", value: "4", detail: "2 awaiting final readiness", tone: "warning" },
  { label: "Returns", value: "3", detail: "1 inspection incomplete", tone: "pending" },
  { label: "Open leads", value: "12", detail: "5 new since yesterday", tone: "complete" },
  { label: "Blocked vehicles", value: "2", detail: "maintenance or incident hold", tone: "blocked" },
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

export const timelineEvents = [
  {
    time: "8:30 AM",
    activity: "Delivery",
    vehicle: "Lamborghini Urus",
    customer: "Avery Stone",
    location: "Hotel Emma",
    owner: "Theresa",
    status: "Operations warning",
  },
  {
    time: "10:00 AM",
    activity: "Return",
    vehicle: "Mercedes G63",
    customer: "Miles Carter",
    location: "SAT private arrivals",
    owner: "Dan",
    status: "On track",
  },
  {
    time: "1:15 PM",
    activity: "Prep",
    vehicle: "Porsche 911 Carrera",
    customer: "Natalie Reyes",
    location: "North showroom",
    owner: "Rosie",
    status: "Needs documents",
  },
  {
    time: "4:00 PM",
    activity: "Delivery",
    vehicle: "Range Rover Autobiography",
    customer: "Bennett Group",
    location: "Pearl District",
    owner: "Contract driver",
    status: "Ready",
  },
];

export const attentionQueue = [
  { label: "Insurance document expires before return", entity: "PP-R-2026-00042", severity: "Blocked" },
  { label: "Delivery assignment has no confirmed driver", entity: "Urus at Hotel Emma", severity: "Warning" },
  { label: "Agreement viewed but not signed", entity: "Natalie Reyes", severity: "Pending" },
  { label: "Return inspection photos unsynced", entity: "G63 return", severity: "Warning" },
  { label: "Security authorization release due", entity: "PP-R-2026-00037", severity: "Finance" },
];

export const vehicles = [
  { name: "Lamborghini Urus", plate: "PP-URUS", status: "Staged", next: "Delivery 8:30 AM", revenue: "$4,850", readiness: 91 },
  { name: "Mercedes G63", plate: "PP-G63", status: "Active rental", next: "Return 10:00 AM", revenue: "$3,200", readiness: 84 },
  { name: "Porsche 911 Carrera", plate: "PP-911", status: "Preparing", next: "Inspection 12:45 PM", revenue: "$2,775", readiness: 67 },
  { name: "Range Rover Autobiography", plate: "PP-RR", status: "Ready", next: "Delivery 4:00 PM", revenue: "$2,150", readiness: 96 },
];

export const reservations = [
  { id: "PP-R-2026-00042", customer: "Avery Stone", vehicle: "Lamborghini Urus", status: "Pending approval", total: "$4,850", dates: "Jun 8-11", issue: "Document blocked" },
  { id: "PP-R-2026-00043", customer: "Bennett Group", vehicle: "Range Rover Autobiography", status: "Confirmed", total: "$2,150", dates: "Jun 8-9", issue: "Ready" },
  { id: "PP-R-2026-00044", customer: "Natalie Reyes", vehicle: "Porsche 911 Carrera", status: "Quote accepted", total: "$2,775", dates: "Jun 9-12", issue: "Agreement pending" },
];

export const tasks = [
  { title: "Confirm hotel delivery contact", type: "Delivery", due: "7:45 AM", assignee: "Theresa", status: "In progress" },
  { title: "Review updated insurance card", type: "Document review", due: "9:00 AM", assignee: "Rosie", status: "Blocked" },
  { title: "Capture return mileage and dashboard", type: "Inspection", due: "10:15 AM", assignee: "Dan", status: "Open" },
  { title: "Prep Range Rover accessories kit", type: "Vehicle prep", due: "2:30 PM", assignee: "Mark Motors", status: "Open" },
];

export const auditEvents = [
  { action: "Role assigned", actor: "Jerry", entity: "Theresa", time: "7:11 AM" },
  { action: "Override approved", actor: "Jerry", entity: "PP-R-2026-00042", time: "7:34 AM" },
  { action: "Status transition", actor: "Dan", entity: "PP-R-2026-00043", time: "8:02 AM" },
];

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
