import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Command,
  FileWarning,
  Menu,
  Plus,
  Search,
  Shield,
  X,
} from "lucide-react";
import logoUrl from "./assets/pp-logo-grad.png";
import {
  attentionQueue,
  auditEvents,
  metricCards,
  ModuleId,
  navItems,
  readinessItems,
  reservations,
  Role,
  roles,
  securityPrinciples,
  serviceBoundaries,
  tasks,
  timelineEvents,
  vehicles,
} from "./data/prototypeData";

const moduleTitles: Record<ModuleId, { title: string; kicker: string }> = {
  today: { title: "Today", kicker: "Operational command center" },
  calendar: { title: "Calendar", kicker: "Availability, returns, holds, and maintenance blocks" },
  reservations: { title: "Reservations", kicker: "Controlled lifecycle and readiness" },
  fleet: { title: "Fleet", kicker: "Vehicle status, performance, and preparation" },
  customers: { title: "Customers", kicker: "Profiles, drivers, documents, and approvals" },
  leads: { title: "Leads & Quotes", kicker: "Concierge intake and versioned proposals" },
  operations: { title: "Operations", kicker: "Tasks, dispatch, delivery, and pickup" },
  inspections: { title: "Inspections", kicker: "Mobile-friendly guided capture" },
  maintenance: { title: "Maintenance", kicker: "Work orders, downtime, and vendor activity" },
  messages: { title: "Messages", kicker: "Reservation communication history" },
  finance: { title: "Finance", kicker: "Transactions, authorizations, and closeout" },
  reports: { title: "Reports", kicker: "Fleet, sales, operations, and finance" },
  settings: { title: "Settings", kicker: "Users, roles, rules, templates, and audit" },
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function App() {
  const [role, setRole] = useState<Role>("owner_admin");
  const [activeModule, setActiveModule] = useState<ModuleId>("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleNav = useMemo(
    () => navItems.filter((item) => item.roles.includes(role)),
    [role],
  );

  const activeMeta = moduleTitles[activeModule];

  return (
    <div className="app-shell">
      <aside className={cx("sidebar", sidebarOpen && "sidebar-open")}>
        <div className="brand-lockup">
          <img src={logoUrl} alt="Pascucci Prestige" />
          <div>
            <span>PrestigeOS</span>
            <strong>Luxury Auto Concierge</strong>
          </div>
          <button className="icon-button close-sidebar" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="nav-list" aria-label="Staff modules">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={cx("nav-item", activeModule === item.id && "active")}
                onClick={() => {
                  setActiveModule(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="mini-label">Signed in as</div>
          <RoleSelect role={role} setRole={setRole} />
          <p>{roles.find((item) => item.id === role)?.description}</p>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="page-title">
            <span>{activeMeta.kicker}</span>
            <h1>{activeMeta.title}</h1>
          </div>
          <div className="top-actions">
            <div className="search-control">
              <Search size={16} />
              <input aria-label="Search" placeholder="Search reservations, vehicles" />
            </div>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button className="primary-action">
              <Plus size={17} />
              <span>New</span>
            </button>
          </div>
        </header>

        {activeModule === "today" ? <TodayView /> : <ModuleView moduleId={activeModule} role={role} />}
      </main>
    </div>
  );
}

function RoleSelect({ role, setRole }: { role: Role; setRole: (role: Role) => void }) {
  return (
    <label className="role-select">
      <select value={role} onChange={(event) => setRole(event.target.value as Role)}>
        {roles.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} />
    </label>
  );
}

function TodayView() {
  return (
    <div className="content-grid">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Monday, June 8</span>
          <h2>Exceptional vehicles, controlled movement.</h2>
          <p>
            Four departures, three returns, and one reservation blocked by document readiness.
            The day is manageable, but the Urus handoff needs attention before 8:30 AM.
          </p>
        </div>
        <div className="hero-status">
          <span>Readiness focus</span>
          <strong>PP-R-2026-00042</strong>
          <button>
            Open workspace
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="metric-row">
        {metricCards.map((card) => (
          <article className={cx("metric-card", card.tone)} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel timeline-panel">
        <PanelHeader title="Operational Timeline" action="Dispatch view" />
        <div className="timeline">
          {timelineEvents.map((event) => (
            <article className="timeline-item" key={`${event.time}-${event.vehicle}`}>
              <time>{event.time}</time>
              <div>
                <strong>{event.activity}</strong>
                <span>{event.vehicle}</span>
              </div>
              <div>
                <strong>{event.customer}</strong>
                <span>{event.location}</span>
              </div>
              <div>
                <strong>{event.owner}</strong>
                <StatusPill label={event.status} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel attention-panel">
        <PanelHeader title="Attention Queue" action="Resolve" />
        <div className="attention-list">
          {attentionQueue.map((item) => (
            <article className="attention-item" key={item.label}>
              <FileWarning size={18} />
              <div>
                <strong>{item.label}</strong>
                <span>{item.entity}</span>
              </div>
              <SeverityBadge label={item.severity} />
            </article>
          ))}
        </div>
      </section>

      <section className="panel reservation-workspace">
        <PanelHeader title="Reservation Workspace" action="Transition" />
        <div className="workspace-header">
          <div>
            <span className="mini-label">PP-R-2026-00042</span>
            <h3>Avery Stone · Lamborghini Urus</h3>
          </div>
          <button className="secondary-action">
            Request approval
            <ArrowRight size={15} />
          </button>
        </div>
        <div className="readiness-strip">
          {readinessItems.map((item) => (
            <article className={cx("readiness-item", item.state)} key={item.label}>
              <div className="readiness-dot">
                {item.state === "complete" ? <Check size={13} /> : <Clock3 size={13} />}
              </div>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel fleet-panel">
        <PanelHeader title="Fleet Readiness" action="Fleet" />
        <div className="vehicle-list">
          {vehicles.map((vehicle) => (
            <article className="vehicle-row" key={vehicle.name}>
              <div>
                <strong>{vehicle.name}</strong>
                <span>{vehicle.plate} · {vehicle.next}</span>
              </div>
              <StatusPill label={vehicle.status} />
              <div className="progress-wrap">
                <span>{vehicle.readiness}%</span>
                <div>
                  <i style={{ width: `${vehicle.readiness}%` }} />
                </div>
              </div>
              <strong>{vehicle.revenue}</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ModuleView({ moduleId, role }: { moduleId: ModuleId; role: Role }) {
  const meta = moduleTitles[moduleId];

  if (moduleId === "reservations") {
    return (
      <StandardLayout
        left={<ReservationList />}
        right={<FutureFoundation role={role} />}
      />
    );
  }

  if (moduleId === "fleet") {
    return (
      <StandardLayout
        left={<FleetTable />}
        right={<FutureFoundation role={role} />}
      />
    );
  }

  if (moduleId === "operations" || moduleId === "inspections") {
    return (
      <StandardLayout
        left={<TaskBoard inspection={moduleId === "inspections"} />}
        right={<MobileInspectionCard />}
      />
    );
  }

  if (moduleId === "settings") {
    return (
      <StandardLayout
        left={<RoleMatrix />}
        right={<AuditPanel />}
      />
    );
  }

  return (
    <StandardLayout
      left={
        <section className="panel module-panel">
          <PanelHeader title={meta.title} action="Add record" />
          <div className="module-empty">
            <Command size={30} />
            <h2>{meta.kicker}</h2>
            <p>
              This prototype keeps the module visible so the operating model is clear.
              The first production slice should connect authentication, roles, audit,
              and then grow this module behind the same shell.
            </p>
          </div>
        </section>
      }
      right={<FutureFoundation role={role} />}
    />
  );
}

function StandardLayout({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="standard-layout">
      {left}
      {right}
    </div>
  );
}

function ReservationList() {
  return (
    <section className="panel">
      <PanelHeader title="Reservation Pipeline" action="New reservation" />
      <div className="record-list">
        {reservations.map((reservation) => (
          <article className="record-card" key={reservation.id}>
            <div>
              <span className="mini-label">{reservation.id}</span>
              <h3>{reservation.customer}</h3>
              <p>{reservation.vehicle} · {reservation.dates}</p>
            </div>
            <div>
              <StatusPill label={reservation.status} />
              <strong>{reservation.total}</strong>
              <span>{reservation.issue}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FleetTable() {
  return (
    <section className="panel">
      <PanelHeader title="Fleet Status" action="Add vehicle" />
      <div className="vehicle-list expanded">
        {vehicles.map((vehicle) => (
          <article className="vehicle-row" key={vehicle.name}>
            <div>
              <strong>{vehicle.name}</strong>
              <span>{vehicle.plate} · {vehicle.next}</span>
            </div>
            <StatusPill label={vehicle.status} />
            <div className="progress-wrap">
              <span>{vehicle.readiness}% ready</span>
              <div>
                <i style={{ width: `${vehicle.readiness}%` }} />
              </div>
            </div>
            <strong>{vehicle.revenue}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function TaskBoard({ inspection }: { inspection: boolean }) {
  return (
    <section className="panel">
      <PanelHeader title={inspection ? "Inspection Queue" : "Task Board"} action="Assign" />
      <div className="task-columns">
        {["Open", "In progress", "Blocked"].map((column) => (
          <div className="task-column" key={column}>
            <span className="mini-label">{column}</span>
            {tasks
              .filter((task) => task.status === column || (column === "Open" && task.status === "Open"))
              .map((task) => (
                <article className="task-card" key={task.title}>
                  <strong>{inspection ? task.type : task.title}</strong>
                  <span>{inspection ? task.title : task.type}</span>
                  <p>{task.assignee} · Due {task.due}</p>
                </article>
              ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function RoleMatrix() {
  return (
    <section className="panel">
      <PanelHeader title="Roles and Permissions" action="Invite user" />
      <div className="role-grid">
        {roles.map((item) => (
          <article className="role-card" key={item.id}>
            <Shield size={17} />
            <div>
              <strong>{item.label}</strong>
              <span>{item.description}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AuditPanel() {
  return (
    <section className="panel side-panel">
      <PanelHeader title="Audit Trail" action="Export" />
      {auditEvents.map((event) => (
        <article className="audit-row" key={`${event.action}-${event.time}`}>
          <span>{event.time}</span>
          <strong>{event.action}</strong>
          <p>{event.actor} · {event.entity}</p>
        </article>
      ))}
    </section>
  );
}

function MobileInspectionCard() {
  return (
    <section className="panel side-panel phone-panel">
      <PanelHeader title="Mobile Handoff" action="Preview" />
      <div className="phone-frame">
        <span className="mini-label">Departure inspection</span>
        <h3>Lamborghini Urus</h3>
        <div className="capture-list">
          {["Front", "Driver side", "Dashboard mileage", "Keys and accessories"].map((slot, index) => (
            <div key={slot}>
              <span>{index + 1}</span>
              <strong>{slot}</strong>
              <button>Capture</button>
            </div>
          ))}
        </div>
        <p>Progress is preserved locally until records and uploads confirm on the server.</p>
      </div>
    </section>
  );
}

function FutureFoundation({ role }: { role: Role }) {
  return (
    <section className="panel side-panel">
      <PanelHeader title="Built for the Real System" action={role} />
      <div className="service-list">
        {serviceBoundaries.map((boundary) => (
          <span key={boundary}>{boundary}</span>
        ))}
      </div>
      <div className="security-list">
        {securityPrinciples.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label}>
              <Icon size={18} />
              <div>
                <strong>{item.label}</strong>
                <p>{item.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PanelHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="panel-header">
      <h2>{title}</h2>
      <button>{action}</button>
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const tone = normalized.includes("blocked") || normalized.includes("needs")
    ? "blocked"
    : normalized.includes("warning") || normalized.includes("pending")
      ? "warning"
      : normalized.includes("ready") || normalized.includes("confirmed") || normalized.includes("track")
        ? "complete"
        : "neutral";
  return <span className={cx("status-pill", tone)}>{label}</span>;
}

function SeverityBadge({ label }: { label: string }) {
  return <span className={cx("severity-badge", label.toLowerCase())}>{label}</span>;
}
