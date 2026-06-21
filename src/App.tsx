import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Command,
  CreditCard,
  Eye,
  FileWarning,
  GaugeCircle,
  Image,
  MapPin,
  Menu,
  Plus,
  ReceiptText,
  Search,
  Shield,
  Signature,
  SlidersHorizontal,
  Store,
  X,
} from "lucide-react";
import logoUrl from "./assets/pp-logo-grad.png";
import {
  attentionQueue,
  auditEvents,
  clientIntakeProfiles,
  comparisonPairs,
  fleetManagerBlueprint,
  fleetManagerVehicles,
  intakePaymentBlueprint,
  intakeProfileRequirements,
  inspectionFoundation,
  inspectionMetrics,
  inspectionQueue,
  inspectionZones,
  ipadIntakeSteps,
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

  if (moduleId === "customers" || moduleId === "leads") {
    return <ClientIntakeCommandCenter moduleId={moduleId} />;
  }

  if (moduleId === "finance") {
    return <SquareFinanceCommandCenter />;
  }

  if (moduleId === "operations" || moduleId === "inspections") {
    if (moduleId === "inspections") {
      return <InspectionCommandCenter />;
    }

    return (
      <StandardLayout
        left={<TaskBoard inspection={false} />}
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

function InspectionCommandCenter() {
  const activeInspection = inspectionQueue[0];
  const reviewInspection = inspectionQueue.find((item) => item.damageReview === "Possible change");

  return (
    <div className="inspection-layout">
      <section className="inspection-brief">
        <div>
          <span className="eyebrow">Vehicle condition inspections</span>
          <h2>Guided capture, customer acknowledgment, and return comparison in one controlled workflow.</h2>
          <p>
            Checkout and return inspections stay connected to the reservation, vehicle, customer, report version,
            and manager review status.
          </p>
        </div>
        <div className="inspection-quick-actions" aria-label="Inspection actions">
          <button className="primary-action">
            <Image size={17} />
            <span>Begin checkout</span>
          </button>
          <button className="secondary-action">
            <SlidersHorizontal size={17} />
            <span>Compare return</span>
          </button>
          <button className="secondary-action">
            <Signature size={17} />
            <span>Acknowledge</span>
          </button>
        </div>
      </section>

      <section className="inspection-metrics" aria-label="Inspection overview">
        {inspectionMetrics.map((metric) => (
          <article className="inspection-metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </article>
        ))}
      </section>

      <section className="panel inspection-queue-panel">
        <PanelHeader title="Inspection Queue" action="Filter" />
        <div className="inspection-queue">
          {inspectionQueue.map((item) => (
            <article className="inspection-row" key={item.id}>
              <div>
                <span className="mini-label">{item.id} · {item.type}</span>
                <h3>{item.vehicle}</h3>
                <p>{item.customer} · {item.reservation} · Assigned to {item.assignedTo}</p>
              </div>
              <div className="inspection-row-status">
                <StatusPill label={item.status} />
                <StatusPill label={item.damageReview} />
              </div>
              <div className="photo-progress">
                <span>{item.completedPhotos} of {item.requiredPhotos} photos</span>
                <div>
                  <i style={{ width: `${(item.completedPhotos / item.requiredPhotos) * 100}%` }} />
                </div>
                <small>Due {item.due}</small>
              </div>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel guided-panel">
        <PanelHeader title="Guided Mobile Capture" action="Template" />
        <div className="inspection-context">
          <div>
            <span className="mini-label">{activeInspection.reservation}</span>
            <h3>{activeInspection.vehicle}</h3>
            <p>Checkout inspection: {activeInspection.completedPhotos} of {activeInspection.requiredPhotos} required photos complete</p>
          </div>
          <StatusPill label={activeInspection.status} />
        </div>
        <div className="zone-list">
          {inspectionZones.map((zone, index) => (
            <article className={cx("zone-row", zone.complete && "complete", zone.quality === "Needs retake" && "warning")} key={zone.code}>
              <span>{index + 1}</span>
              <div>
                <strong>{zone.label}</strong>
                <p>{zone.group} · {zone.required ? "Required" : "Optional"} · {zone.quality}</p>
              </div>
              <button aria-label={`${zone.complete ? "Review" : "Capture"} ${zone.label}`}>
                {zone.complete ? <Eye size={16} /> : <Image size={16} />}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="panel comparison-panel">
        <PanelHeader title="Return Comparison Review" action="Full screen" />
        <div className="comparison-workspace">
          <div className="comparison-canvas" aria-label="Before and after image comparison placeholder">
            <div>
              <span>Checkout</span>
              <strong>Passenger rear wheel</strong>
            </div>
            <div className="slider-line">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <span>Return</span>
              <strong>Possible rim mark</strong>
            </div>
          </div>
          <div className="comparison-actions">
            <button className="secondary-action">No change</button>
            <button className="secondary-action">Flag possible damage</button>
            <button className="primary-action">Manager decision</button>
          </div>
        </div>
        <div className="comparison-list">
          {comparisonPairs.map((pair) => (
            <article key={pair.zone}>
              <div>
                <strong>{pair.zone}</strong>
                <span>{pair.checkoutTime} to {pair.returnTime}</span>
              </div>
              <StatusPill label={pair.status} />
              <p>{pair.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel acknowledgment-panel">
        <PanelHeader title="Acknowledgment and Reports" action="Generate" />
        <div className="report-stack">
          <article>
            <Signature size={18} />
            <div>
              <strong>Customer acknowledgment</strong>
              <p>Secure review link or in-person signature locks to the exact customer-facing inspection snapshot.</p>
            </div>
            <StatusPill label="Awaiting acknowledgment" />
          </article>
          <article>
            <FileWarning size={18} />
            <div>
              <strong>Internal condition report</strong>
              <p>Includes private notes, audit references, review decisions, holds, and operational actions.</p>
            </div>
            <StatusPill label="Ready" />
          </article>
          <article>
            <Shield size={18} />
            <div>
              <strong>Customer-safe report</strong>
              <p>Shows approved condition details only, with internal notes and review data excluded.</p>
            </div>
            <StatusPill label="Ready" />
          </article>
        </div>
      </section>

      <section className="panel foundation-panel">
        <PanelHeader title="Production Foundation" action={reviewInspection?.id ?? "MVP"} />
        <div className="foundation-list">
          {inspectionFoundation.map((item) => (
            <article key={item}>
              <GaugeCircle size={17} />
              <span>{item}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
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
  const activeVehicle = fleetManagerVehicles[0];
  const publishedCount = fleetManagerVehicles.filter((vehicle) => vehicle.status === "Published").length;
  const totalPhotos = fleetManagerVehicles.reduce((sum, vehicle) => sum + vehicle.photoCount, 0);
  const totalCapacity = fleetManagerVehicles.reduce((sum, vehicle) => sum + vehicle.maxPhotos, 0);

  return (
    <section className="fleet-manager">
      <div className="fleet-manager-hero">
        <div>
          <span className="eyebrow">Fleet Manager</span>
          <h2>One controlled vehicle record for the website, reservations, and operations.</h2>
          <p>
            This workspace is the staging point for new vehicles: upload media, define pricing,
            complete specs, and decide when a vehicle is safe to publish.
          </p>
        </div>
        <div className="fleet-manager-actions">
          <button className="primary-action">
            <Plus size={17} />
            <span>Add vehicle</span>
          </button>
          <button className="secondary-action">
            <Image size={17} />
            <span>Upload photos</span>
          </button>
        </div>
      </div>

      <div className="fleet-manager-metrics" aria-label="Fleet manager summary">
        <article>
          <span>Published</span>
          <strong>{publishedCount}</strong>
          <p>{fleetManagerVehicles.length} vehicle records staged</p>
        </article>
        <article>
          <span>Photo library</span>
          <strong>{totalPhotos}/{totalCapacity}</strong>
          <p>Up to 12 public photos per vehicle</p>
        </article>
        <article>
          <span>Media gaps</span>
          <strong>{fleetManagerVehicles.reduce((sum, vehicle) => sum + vehicle.missingShots.length, 0)}</strong>
          <p>Interior, detail, and feature shots to capture</p>
        </article>
      </div>

      <div className="fleet-manager-grid">
        <section className="panel fleet-record-panel">
          <PanelHeader title="Vehicle Records" action="Draft queue" />
          <div className="fleet-record-list">
            {fleetManagerVehicles.map((vehicle) => (
              <article className="fleet-record-card" key={vehicle.id}>
                <img src={vehicle.heroImage} alt="" />
                <div>
                  <span className="mini-label">{vehicle.category} · {vehicle.displaySlot}</span>
                  <h3>{vehicle.name}</h3>
                  <p>{vehicle.publicLine}</p>
                  <div className="fleet-record-tags">
                    <StatusPill label={vehicle.status} />
                    <span>{vehicle.dailyRate} / day</span>
                    <span>{vehicle.hourlyRate} / hour</span>
                  </div>
                </div>
                <div className="photo-capacity">
                  <span>{vehicle.photoCount} of {vehicle.maxPhotos} photos</span>
                  <div>
                    <i style={{ width: `${(vehicle.photoCount / vehicle.maxPhotos) * 100}%` }} />
                  </div>
                  <small>{vehicle.nextAction}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel fleet-editor-panel">
          <PanelHeader title="Editor Preview" action="Autosaved draft" />
          <div className="fleet-editor-preview">
            <img src={activeVehicle.heroImage} alt="" />
            <div>
              <span className="mini-label">{activeVehicle.category}</span>
              <h3>{activeVehicle.name}</h3>
              <p>{activeVehicle.publicLine}</p>
            </div>
          </div>
          <div className="fleet-editor-fields">
            {[
              ["Daily rate", activeVehicle.dailyRate],
              ["Hourly rate", activeVehicle.hourlyRate],
              ["Passengers", activeVehicle.passengers],
              ["Drivetrain", activeVehicle.drivetrain],
              ["Transmission", activeVehicle.transmission],
              ["Engine", activeVehicle.engine],
              ["Power", activeVehicle.power],
            ].map(([label, value]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </article>
            ))}
          </div>
          <div className="fleet-highlight-editor">
            <span className="mini-label">Public highlights</span>
            {activeVehicle.highlights.map((highlight) => (
              <p key={highlight}><Check size={14} /> {highlight}</p>
            ))}
          </div>
        </section>

        <section className="panel media-plan-panel">
          <PanelHeader title="12-Photo Media Plan" action="Manage gallery" />
          <div className="media-slot-grid">
            {Array.from({ length: activeVehicle.maxPhotos }, (_, index) => {
              const filled = index < activeVehicle.photoCount;
              const label = activeVehicle.requiredShots[index] ?? activeVehicle.missingShots[index - activeVehicle.requiredShots.length] ?? "Optional feature shot";

              return (
                <article className={cx("media-slot", filled && "filled")} key={`${activeVehicle.id}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {filled ? (
                    <img
                      src={activeVehicle.photos[index] ?? activeVehicle.heroImage}
                      alt={`${activeVehicle.name} ${label.toLowerCase()}`}
                    />
                  ) : <Image size={18} />}
                  <strong>{label}</strong>
                  <small>{filled ? "Ready" : "Needed"}</small>
                </article>
              );
            })}
          </div>
        </section>

        <section className="panel fleet-blueprint-panel">
          <PanelHeader title="Backend Blueprint" action="Next build step" />
          <div className="foundation-list">
            {fleetManagerBlueprint.map((item) => (
              <article key={item}>
                <GaugeCircle size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
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

function ClientIntakeCommandCenter({ moduleId }: { moduleId: "customers" | "leads" }) {
  const activeProfile = clientIntakeProfiles[0];
  const paymentReadyCount = clientIntakeProfiles.filter((profile) => profile.stage === "Payment ready" || profile.stage === "Approved").length;
  const averageCompleteness = Math.round(
    clientIntakeProfiles.reduce((sum, profile) => sum + profile.profileCompleteness, 0) / clientIntakeProfiles.length,
  );

  return (
    <section className="client-intake">
      <div className="client-intake-hero">
        <div>
          <span className="eyebrow">{moduleId === "leads" ? "Lead Intake" : "Client Profiles"}</span>
          <h2>Capture renters once, approve them carefully, and reuse the profile for future rentals.</h2>
          <p>
            The MVP creates a clean path for website inquiries, concierge entries, and an iPad intake experience.
            Payment details are secured through Square, while the command center stores only safe references.
          </p>
        </div>
        <div className="client-intake-actions">
          <button className="primary-action">
            <Plus size={17} />
            <span>Start intake</span>
          </button>
          <button className="secondary-action">
            <Shield size={17} />
            <span>Send setup link</span>
          </button>
        </div>
      </div>

      <div className="client-intake-metrics" aria-label="Client intake summary">
        <article>
          <span>Profiles</span>
          <strong>{clientIntakeProfiles.length}</strong>
          <p>Active renter records in review</p>
        </article>
        <article>
          <span>Payment ready</span>
          <strong>{paymentReadyCount}</strong>
          <p>Reusable Square payment references on file</p>
        </article>
        <article>
          <span>Average readiness</span>
          <strong>{averageCompleteness}%</strong>
          <p>Profile, documents, consent, and payment setup</p>
        </article>
      </div>

      <div className="client-intake-grid">
        <section className="panel intake-profile-panel">
          <PanelHeader title="Intake Queue" action="Filter" />
          <div className="intake-profile-list">
            {clientIntakeProfiles.map((profile) => (
              <article className="intake-profile-card" key={profile.id}>
                <div>
                  <span className="mini-label">{profile.id} · {profile.source}</span>
                  <h3>{profile.name}</h3>
                  <p>{profile.preferredVehicle} · {profile.tripWindow}</p>
                  <div className="intake-profile-tags">
                    <StatusPill label={profile.stage} />
                    <span>{profile.paymentStatus}</span>
                  </div>
                </div>
                <div className="profile-completeness">
                  <span>{profile.profileCompleteness}% complete</span>
                  <div>
                    <i style={{ width: `${profile.profileCompleteness}%` }} />
                  </div>
                  <small>{profile.nextAction}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel intake-editor-panel">
          <PanelHeader title="Profile + Payment Preference" action="Autosaved draft" />
          <div className="intake-editor-summary">
            <span className="mini-label">{activeProfile.id}</span>
            <h3>{activeProfile.name}</h3>
            <p>{activeProfile.preferredVehicle} · {activeProfile.tripWindow}</p>
          </div>
          <div className="payment-reference-card">
            <Shield size={20} />
            <div>
              <span>Payment preference</span>
              <strong>{activeProfile.savedPayment}</strong>
              <p>{activeProfile.squareCustomer} · {activeProfile.paymentStatus}</p>
            </div>
          </div>
          <div className="intake-requirement-list">
            {intakeProfileRequirements.map((requirement) => (
              <article key={requirement}>
                <Check size={14} />
                <span>{requirement}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel ipad-intake-panel">
          <PanelHeader title="iPad Intake Flow" action="Kiosk mode" />
          <div className="ipad-frame">
            <span className="mini-label">Renter-facing mode</span>
            <h3>Welcome to Pascucci Prestige</h3>
            <p>Private intake for approved rentals. A concierge reviews every profile before reservation payment.</p>
            <div className="ipad-step-list">
              {ipadIntakeSteps.map((step, index) => (
                <article key={step.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{step.label}</strong>
                    <p>{step.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="panel payment-blueprint-panel">
          <PanelHeader title="Square Payments Blueprint" action="Server step" />
          <div className="foundation-list">
            {intakePaymentBlueprint.map((item) => (
              <article key={item}>
                <GaugeCircle size={17} />
                <span>{item}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

type InsuranceChoice = "none" | "gap" | "full";
type HandoffChoice = "pickup" | "delivery";
type CollectionChoice = "terminal" | "remote";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

function SquareFinanceCommandCenter() {
  const [handoff, setHandoff] = useState<HandoffChoice>("delivery");
  const [insurance, setInsurance] = useState<InsuranceChoice>("gap");
  const [collection, setCollection] = useState<CollectionChoice>("terminal");
  const [rentalCharge, setRentalCharge] = useState(2400);
  const [insurancePremium, setInsurancePremium] = useState(185);
  const [paymentState, setPaymentState] = useState("Draft");

  const deliveryFee = handoff === "delivery" ? 50 : 0;
  const approvedInsurancePremium = insurance === "none" ? 0 : Math.max(0, insurancePremium);
  const chargeNow = Math.max(0, rentalCharge) + deliveryFee + approvedInsurancePremium;
  const securityDeposit = 500;

  const chooseInsurance = (choice: InsuranceChoice) => {
    setInsurance(choice);
    if (choice === "none") setInsurancePremium(0);
  };

  const preparePayment = () => {
    setPaymentState(collection === "terminal" ? "Ready for Square Terminal" : "Square payment request ready");
  };

  return (
    <div className="square-finance">
      <section className="square-finance-hero">
        <div>
          <span className="eyebrow">Square payments</span>
          <h2>Build the rental charge, protect the vehicle, and collect in person or remotely.</h2>
          <p>
            Rental charges, delivery, insurance, and the refundable security authorization remain separate and
            traceable from reservation through closeout.
          </p>
        </div>
        <div className="square-status-card">
          <span>Reservation</span>
          <strong>PP-R-2026-00042</strong>
          <p>Avery Stone · Lamborghini Urus</p>
          <StatusPill label={paymentState} />
        </div>
      </section>

      <div className="square-finance-grid">
        <section className="panel payment-composer">
          <PanelHeader title="Payment Builder" action="Autosaved" />

          <div className="payment-section">
            <div className="payment-section-heading">
              <ReceiptText size={18} />
              <div>
                <strong>Rental charge</strong>
                <span>Approved reservation amount before add-ons</span>
              </div>
            </div>
            <label className="money-input">
              <span>$</span>
              <input
                aria-label="Rental charge"
                min="0"
                onChange={(event) => setRentalCharge(Number(event.target.value))}
                type="number"
                value={rentalCharge}
              />
            </label>
          </div>

          <div className="payment-section">
            <div className="payment-section-heading">
              <MapPin size={18} />
              <div>
                <strong>Vehicle handoff</strong>
                <span>Delivery adds a fixed $50 concierge fee</span>
              </div>
            </div>
            <div className="choice-grid two">
              <button className={cx("choice-card", handoff === "pickup" && "selected")} onClick={() => setHandoff("pickup")}>
                <Store size={19} />
                <strong>Pick up in person</strong>
                <span>No delivery fee</span>
              </button>
              <button className={cx("choice-card", handoff === "delivery" && "selected")} onClick={() => setHandoff("delivery")}>
                <MapPin size={19} />
                <strong>Concierge delivery</strong>
                <span>+$50</span>
              </button>
            </div>
          </div>

          <div className="payment-section">
            <div className="payment-section-heading">
              <Shield size={18} />
              <div>
                <strong>Insurance coverage</strong>
                <span>Select the approved protection path for this rental</span>
              </div>
            </div>
            <div className="choice-grid three insurance-choices">
              <button className={cx("choice-card", insurance === "none" && "selected")} onClick={() => chooseInsurance("none")}>
                <strong>Renter coverage</strong>
                <span>Verified as sufficient</span>
              </button>
              <button className={cx("choice-card", insurance === "gap" && "selected")} onClick={() => chooseInsurance("gap")}>
                <strong>Gap package</strong>
                <span>Covers the verified shortfall</span>
              </button>
              <button className={cx("choice-card", insurance === "full" && "selected")} onClick={() => chooseInsurance("full")}>
                <strong>Full package</strong>
                <span>Complete rental protection</span>
              </button>
            </div>
            {insurance !== "none" && (
              <label className="premium-input">
                <span>Approved insurance premium</span>
                <div className="money-input">
                  <span>$</span>
                  <input
                    aria-label="Approved insurance premium"
                    min="0"
                    onChange={(event) => setInsurancePremium(Number(event.target.value))}
                    type="number"
                    value={insurancePremium}
                  />
                </div>
                <small>Entered after coverage eligibility and carrier pricing are confirmed.</small>
              </label>
            )}
          </div>
        </section>

        <aside className="panel payment-summary-panel">
          <PanelHeader title="Collection Summary" action="Square" />
          <div className="summary-lines">
            <div><span>Rental charge</span><strong>{money.format(Math.max(0, rentalCharge))}</strong></div>
            <div><span>Delivery</span><strong>{deliveryFee ? money.format(deliveryFee) : "Included"}</strong></div>
            <div>
              <span>{insurance === "full" ? "Full insurance package" : insurance === "gap" ? "Gap insurance package" : "Renter insurance"}</span>
              <strong>{approvedInsurancePremium ? money.format(approvedInsurancePremium) : "Verified"}</strong>
            </div>
          </div>
          <div className="charge-total">
            <span>Charge now</span>
            <strong>{money.format(chargeNow)}</strong>
          </div>
          <div className="deposit-callout">
            <Shield size={20} />
            <div>
              <span>Refundable security authorization</span>
              <strong>{money.format(securityDeposit)}</strong>
              <p>Held separately in Square and released after return review unless an approved charge is captured.</p>
            </div>
          </div>
          <div className="total-exposure">
            <span>Card authorization at handoff</span>
            <strong>{money.format(chargeNow + securityDeposit)}</strong>
            <small>{money.format(chargeNow)} charge + {money.format(securityDeposit)} refundable hold</small>
          </div>

          <div className="collection-method">
            <span className="mini-label">How will the renter pay?</span>
            <div className="choice-grid two">
              <button className={cx("choice-card compact", collection === "terminal" && "selected")} onClick={() => setCollection("terminal")}>
                <CreditCard size={18} />
                <strong>In person</strong>
                <span>Square Terminal</span>
              </button>
              <button className={cx("choice-card compact", collection === "remote" && "selected")} onClick={() => setCollection("remote")}>
                <ReceiptText size={18} />
                <strong>Remote</strong>
                <span>Payment request</span>
              </button>
            </div>
          </div>

          <button className="primary-action payment-ready-action" onClick={preparePayment}>
            <CreditCard size={17} />
            <span>{collection === "terminal" ? "Send to Square Terminal" : "Create Square payment request"}</span>
          </button>
          <p className="payment-disclaimer">
            Insurance selections require documented eligibility and approved policy terms before collection.
          </p>
        </aside>
      </div>
    </div>
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
