import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  Command,
  Download,
  Eye,
  FileWarning,
  GaugeCircle,
  Image,
  Menu,
  Plus,
  Search,
  Shield,
  Signature,
  SlidersHorizontal,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import logoUrl from "./assets/pp-logo-grad.png";
import { createFleetVehicle, loadFleet, saveFleetVehicle } from "./lib/fleetRepository";
import { usePersistentState } from "./usePersistentState";
import {
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
  reservations,
  Role,
  roles,
  securityPrinciples,
  serviceBoundaries,
  tasks,
  vehicles,
} from "./data/prototypeData";
import type {
  ClientIntakeProfile,
  ClientIntakeStage,
  FleetManagerVehicle,
  InspectionQueueItem,
  InspectionZone,
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
  const [globalSearch, setGlobalSearch] = useState("");

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
            <PwaControls />
            <div className="search-control">
              <Search size={16} />
              <input
                aria-label="Search"
                placeholder="Search this module"
                value={globalSearch}
                onChange={(event) => setGlobalSearch(event.target.value)}
              />
            </div>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button
              className="primary-action"
              onClick={() => window.dispatchEvent(new CustomEvent("prestige:new-record", { detail: activeModule }))}
            >
              <Plus size={17} />
              <span>New</span>
            </button>
          </div>
        </header>

        {activeModule === "today" ? <TodayView /> : <ModuleView moduleId={activeModule} role={role} search={globalSearch} />}
      </main>
    </div>
  );
}

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function PwaControls() {
  const [online, setOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleInstall);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleInstall);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <div className="pwa-controls">
      <span className={cx("connection-status", !online && "offline")}>
        {online ? <Wifi size={14} /> : <WifiOff size={14} />}
        {online ? "Online" : "Offline"}
      </span>
      {installPrompt && (
        <button className="install-action" onClick={install}>
          <Download size={15} />
          Install
        </button>
      )}
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
  const todayLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="content-grid">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">{todayLabel}</span>
          <h2>Your launch workspace is clean and ready.</h2>
          <p>
            The three-vehicle fleet is published. Customers, reservations, tasks, and inspections
            will appear here only after your team creates real records.
          </p>
        </div>
        <div className="hero-status">
          <span>Launch status</span>
          <strong>Operational baseline ready</strong>
          <StatusPill label="Clean workspace" />
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

      <section className="panel launch-empty-panel">
        <PanelHeader title="Operations" action="No demo records" />
        <div className="module-empty">
          <Command size={30} />
          <h2>Nothing artificial in the queue.</h2>
          <p>Create the first customer, reservation, task, or inspection when real activity begins.</p>
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
              <strong>Ready</strong>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ModuleView({ moduleId, role, search }: { moduleId: ModuleId; role: Role; search: string }) {
  const meta = moduleTitles[moduleId];

  if (moduleId === "reservations") {
    return (
      <StandardLayout
        left={<ReservationList search={search} />}
        right={<FutureFoundation role={role} />}
      />
    );
  }

  if (moduleId === "fleet") {
    return (
      <StandardLayout
        left={<FleetTable search={search} />}
        right={<FutureFoundation role={role} />}
      />
    );
  }

  if (moduleId === "customers" || moduleId === "leads") {
    return <ClientIntakeCommandCenter moduleId={moduleId} search={search} />;
  }

  if (moduleId === "finance") {
    return <DeferredFinanceView />;
  }

  if (moduleId === "operations" || moduleId === "inspections") {
    if (moduleId === "inspections") {
      return <InspectionCommandCenter search={search} />;
    }

    return (
      <StandardLayout
        left={<TaskBoard inspection={false} search={search} />}
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

function InspectionCommandCenter({ search }: { search: string }) {
  const [queue, setQueue] = usePersistentState<InspectionQueueItem[]>("prestige:launch:inspections", inspectionQueue);
  const [zones, setZones] = usePersistentState<InspectionZone[]>("prestige:launch:inspection-zones", inspectionZones);
  const [activeInspectionId, setActiveInspectionId] = useState(queue[0]?.id ?? "");
  const activeInspection = queue.find((item) => item.id === activeInspectionId) ?? queue[0];
  const reviewInspection = queue.find((item) => item.damageReview === "Possible change");
  const visibleQueue = queue.filter((item) =>
    `${item.id} ${item.vehicle} ${item.customer} ${item.reservation}`.toLowerCase().includes(search.toLowerCase()),
  );

  if (!activeInspection) {
    return (
      <div className="inspection-layout">
        <section className="inspection-brief">
          <div>
            <span className="eyebrow">Vehicle condition inspections</span>
            <h2>Inspection workflows are ready for the first real reservation.</h2>
            <p>No demo inspection records or fictional damage reports are loaded.</p>
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
        <section className="panel launch-empty-panel">
          <div className="module-empty">
            <FileWarning size={30} />
            <h2>No inspections yet</h2>
            <p>Checkout and return inspections will be created from live reservations.</p>
          </div>
        </section>
      </div>
    );
  }

  const toggleZone = (code: string) => {
    const nextZones = zones.map((zone) =>
      zone.code === code
        ? { ...zone, complete: !zone.complete, quality: !zone.complete ? "Ready" as const : "Missing" as const }
        : zone,
    );
    setZones(nextZones);
    const completedPhotos = Math.min(
      activeInspection.requiredPhotos,
      Math.round((nextZones.filter((zone) => zone.complete).length / nextZones.length) * activeInspection.requiredPhotos),
    );
    setQueue(queue.map((item) =>
      item.id === activeInspection.id
        ? { ...item, completedPhotos, status: completedPhotos === item.requiredPhotos ? "Awaiting acknowledgment" : "In progress" }
        : item,
    ));
  };

  const completeInspection = () => {
    setZones(zones.map((zone) => ({ ...zone, complete: true, quality: "Ready" })));
    setQueue(queue.map((item) =>
      item.id === activeInspection.id
        ? { ...item, completedPhotos: item.requiredPhotos, status: "Awaiting acknowledgment", note: "Capture complete. Customer acknowledgment is ready." }
        : item,
    ));
  };

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
          {visibleQueue.map((item) => (
            <article
              className={cx("inspection-row", item.id === activeInspection.id && "selected-record")}
              key={item.id}
              onClick={() => setActiveInspectionId(item.id)}
            >
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
          {zones.map((zone, index) => (
            <article className={cx("zone-row", zone.complete && "complete", zone.quality === "Needs retake" && "warning")} key={zone.code}>
              <span>{index + 1}</span>
              <div>
                <strong>{zone.label}</strong>
                <p>{zone.group} · {zone.required ? "Required" : "Optional"} · {zone.quality}</p>
              </div>
              <button onClick={() => toggleZone(zone.code)} aria-label={`${zone.complete ? "Reset" : "Capture"} ${zone.label}`}>
                {zone.complete ? <Eye size={16} /> : <Image size={16} />}
              </button>
            </article>
          ))}
        </div>
        <button className="primary-action full-width-action" onClick={completeInspection}>
          <Check size={17} />
          Complete required capture
        </button>
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

type ReservationRecord = (typeof reservations)[number];

const reservationTransitions: Record<string, string> = {
  "Quote accepted": "Pending approval",
  "Pending approval": "Confirmed",
  Confirmed: "Preparation",
  Preparation: "Ready for departure",
  "Ready for departure": "Active",
  Active: "Return pending",
  "Return pending": "Completed",
};

function ReservationList({ search }: { search: string }) {
  const [records, setRecords] = usePersistentState<ReservationRecord[]>("prestige:launch:reservations", reservations);
  const [selectedId, setSelectedId] = useState(records[0]?.id ?? "");
  const [showForm, setShowForm] = useState(false);
  const selected = records.find((record) => record.id === selectedId) ?? records[0];
  const visibleRecords = records.filter((record) =>
    `${record.id} ${record.customer} ${record.vehicle} ${record.status}`.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const open = (event: Event) => {
      if ((event as CustomEvent).detail === "reservations") setShowForm(true);
    };
    window.addEventListener("prestige:new-record", open);
    return () => window.removeEventListener("prestige:new-record", open);
  }, []);

  const createReservation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextNumber = String(records.length + 45).padStart(5, "0");
    const next: ReservationRecord = {
      id: `PP-R-2026-${nextNumber}`,
      customer: String(form.get("customer")),
      vehicle: String(form.get("vehicle")),
      status: "Quote accepted",
      total: String(form.get("total")),
      dates: String(form.get("dates")),
      issue: "Readiness review required",
    };
    setRecords([next, ...records]);
    setSelectedId(next.id);
    setShowForm(false);
  };

  const transition = () => {
    if (!selected) return;
    const nextStatus = reservationTransitions[selected.status];
    if (!nextStatus) return;
    setRecords(records.map((record) =>
      record.id === selected.id
        ? { ...record, status: nextStatus, issue: nextStatus === "Confirmed" ? "Ready" : `Moved to ${nextStatus}` }
        : record,
    ));
  };

  return (
    <section className="panel">
      <PanelHeader title="Reservation Pipeline" action="Working records" />
      <div className="record-list">
        {visibleRecords.length === 0 && (
          <div className="module-empty compact-empty">
            <Command size={26} />
            <h2>No reservations yet</h2>
            <p>Create the first reservation after a real customer intake.</p>
          </div>
        )}
        {visibleRecords.map((reservation) => (
          <article
            className={cx("record-card", reservation.id === selected?.id && "selected-record")}
            key={reservation.id}
            onClick={() => setSelectedId(reservation.id)}
          >
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
      {selected && (
        <div className="record-action-bar">
          <div>
            <span className="mini-label">Selected reservation</span>
            <strong>{selected.id} · {selected.status}</strong>
          </div>
          <button className="secondary-action" onClick={() => setShowForm(true)}>New reservation</button>
          <button className="primary-action" onClick={transition} disabled={!reservationTransitions[selected.status]}>
            {reservationTransitions[selected.status] ? `Move to ${reservationTransitions[selected.status]}` : "Lifecycle complete"}
          </button>
        </div>
      )}
      {showForm && (
        <Modal title="Create reservation" onClose={() => setShowForm(false)}>
          <form className="command-form" onSubmit={createReservation}>
            <label>Customer<input name="customer" required placeholder="Customer or company" /></label>
            <label>Vehicle<select name="vehicle">{fleetManagerVehicles.map((vehicle) => <option key={vehicle.id}>{vehicle.name}</option>)}</select></label>
            <label>Rental window<input name="dates" required placeholder="Jun 24-27" /></label>
            <label>Estimated total<input name="total" required placeholder="$3,500" /></label>
            <div className="form-footer">
              <button type="button" className="secondary-action" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="primary-action">Create draft</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

function FleetTable({ search }: { search: string }) {
  const [records, setRecords] = usePersistentState<FleetManagerVehicle[]>("prestige:launch:fleet", fleetManagerVehicles);
  const [activeId, setActiveId] = useState(records[0]?.id ?? "");
  const [showForm, setShowForm] = useState(false);
  const [syncState, setSyncState] = useState("Loading shared fleet");
  const activeVehicle = records.find((vehicle) => vehicle.id === activeId) ?? records[0];
  const visibleRecords = records.filter((vehicle) =>
    `${vehicle.name} ${vehicle.category} ${vehicle.status}`.toLowerCase().includes(search.toLowerCase()),
  );
  const publishedCount = records.filter((vehicle) => vehicle.status === "Published").length;
  const totalPhotos = records.reduce((sum, vehicle) => sum + vehicle.photoCount, 0);
  const totalCapacity = records.reduce((sum, vehicle) => sum + vehicle.maxPhotos, 0);

  useEffect(() => {
    const open = (event: Event) => {
      if ((event as CustomEvent).detail === "fleet") setShowForm(true);
    };
    window.addEventListener("prestige:new-record", open);
    return () => window.removeEventListener("prestige:new-record", open);
  }, []);

  useEffect(() => {
    loadFleet()
      .then((sharedFleet) => {
        if (sharedFleet?.length) {
          setRecords(sharedFleet);
          setActiveId(sharedFleet[0].id);
          setSyncState("Synced with Supabase");
        } else {
          setSyncState("Local fleet");
        }
      })
      .catch(() => setSyncState("Offline copy"));
  }, [setRecords]);

  const updateActive = (patch: Partial<FleetManagerVehicle>) => {
    const updated = { ...activeVehicle, ...patch };
    setRecords(records.map((vehicle) => vehicle.id === activeVehicle.id ? updated : vehicle));
    setSyncState("Saving…");
    saveFleetVehicle(updated)
      .then(() => setSyncState("Synced with Supabase"))
      .catch(() => setSyncState("Saved offline"));
  };

  const addVehicle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    const next: FleetManagerVehicle = {
      ...fleetManagerVehicles[0],
      id: `fleet-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      category: String(form.get("category")),
      status: "Draft",
      displaySlot: "Unassigned",
      dailyRate: String(form.get("dailyRate")),
      hourlyRate: String(form.get("hourlyRate")),
      publicLine: String(form.get("publicLine")),
      heroImage: fleetManagerVehicles[0].heroImage,
      photos: [],
      photoCount: 0,
      missingShots: [...fleetManagerVehicles[0].requiredShots],
      nextAction: "Add photography and complete specifications",
    };
    const created = await createFleetVehicle(next).catch(() => next);
    setRecords([created, ...records]);
    setActiveId(created.id);
    setShowForm(false);
  };

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
          <button className="primary-action" onClick={() => setShowForm(true)}>
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
          <p>{records.length} vehicle records staged</p>
        </article>
        <article>
          <span>Photo library</span>
          <strong>{totalPhotos}/{totalCapacity}</strong>
          <p>Up to 12 public photos per vehicle</p>
        </article>
        <article>
          <span>Media gaps</span>
          <strong>{records.reduce((sum, vehicle) => sum + vehicle.missingShots.length, 0)}</strong>
          <p>Interior, detail, and feature shots to capture</p>
        </article>
      </div>

      <div className="fleet-manager-grid">
        <section className="panel fleet-record-panel">
          <PanelHeader title="Vehicle Records" action="Draft queue" />
          <div className="fleet-record-list">
            {visibleRecords.map((vehicle) => (
              <article
                className={cx("fleet-record-card", vehicle.id === activeVehicle.id && "selected-record")}
                key={vehicle.id}
                onClick={() => setActiveId(vehicle.id)}
              >
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
          <PanelHeader title="Vehicle Editor" action={syncState} />
          <div className="fleet-editor-preview">
            <img src={activeVehicle.heroImage} alt="" />
            <div>
              <span className="mini-label">{activeVehicle.category}</span>
              <h3>{activeVehicle.name}</h3>
              <p>{activeVehicle.publicLine}</p>
            </div>
          </div>
          <div className="fleet-editor-form">
            <label>Status<select value={activeVehicle.status} onChange={(event) => updateActive({ status: event.target.value as FleetManagerVehicle["status"] })}>
              <option>Published</option><option>Draft</option><option>Needs media</option><option>Hidden</option>
            </select></label>
            <label>Daily rate<input value={activeVehicle.dailyRate} onChange={(event) => updateActive({ dailyRate: event.target.value })} /></label>
            <label>Hourly rate<input value={activeVehicle.hourlyRate} onChange={(event) => updateActive({ hourlyRate: event.target.value })} /></label>
            <label>Public line<textarea value={activeVehicle.publicLine} onChange={(event) => updateActive({ publicLine: event.target.value })} /></label>
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
      {showForm && (
        <Modal title="Add fleet vehicle" onClose={() => setShowForm(false)}>
          <form className="command-form" onSubmit={addVehicle}>
            <label>Vehicle name<input name="name" required placeholder="Ferrari 296 GTB" /></label>
            <label>Category<input name="category" required placeholder="Supercar" /></label>
            <label>Daily rate<input name="dailyRate" required placeholder="$1,499" /></label>
            <label>Hourly rate<input name="hourlyRate" required placeholder="$350" /></label>
            <label className="wide">Public line<textarea name="publicLine" required placeholder="A concise, customer-facing description." /></label>
            <div className="form-footer">
              <button type="button" className="secondary-action" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="primary-action">Add draft vehicle</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

type TaskRecord = (typeof tasks)[number];

function TaskBoard({ inspection, search }: { inspection: boolean; search: string }) {
  const [taskRecords, setTaskRecords] = usePersistentState<TaskRecord[]>("prestige:launch:tasks", tasks);
  const [showForm, setShowForm] = useState(false);
  const visibleTasks = taskRecords.filter((task) =>
    `${task.title} ${task.type} ${task.assignee} ${task.status}`.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const open = (event: Event) => {
      if ((event as CustomEvent).detail === "operations") setShowForm(true);
    };
    window.addEventListener("prestige:new-record", open);
    return () => window.removeEventListener("prestige:new-record", open);
  }, []);

  const cycleTask = (task: TaskRecord) => {
    const nextStatus = task.status === "Open" ? "In progress" : task.status === "In progress" ? "Blocked" : "Open";
    setTaskRecords(taskRecords.map((item) => item.title === task.title ? { ...item, status: nextStatus } : item));
  };

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setTaskRecords([...taskRecords, {
      title: String(form.get("title")),
      type: String(form.get("type")),
      due: String(form.get("due")),
      assignee: String(form.get("assignee")),
      status: "Open",
    }]);
    setShowForm(false);
  };

  return (
    <section className="panel">
      <PanelHeader title={inspection ? "Inspection Queue" : "Task Board"} action="Click a task to advance" />
      <div className="task-columns">
        {["Open", "In progress", "Blocked"].map((column) => (
          <div className="task-column" key={column}>
            <span className="mini-label">{column}</span>
            {visibleTasks
              .filter((task) => task.status === column || (column === "Open" && task.status === "Open"))
              .map((task) => (
                <article className="task-card" key={task.title} onClick={() => cycleTask(task)}>
                  <strong>{inspection ? task.type : task.title}</strong>
                  <span>{inspection ? task.title : task.type}</span>
                  <p>{task.assignee} · Due {task.due}</p>
                </article>
              ))}
          </div>
        ))}
      </div>
      {visibleTasks.length === 0 && (
        <div className="module-empty compact-empty">
          <Command size={26} />
          <h2>No operational tasks</h2>
          <p>The task board is ready for real assignments.</p>
        </div>
      )}
      <button className="secondary-action full-width-action" onClick={() => setShowForm(true)}>
        <Plus size={16} /> Add operational task
      </button>
      {showForm && (
        <Modal title="Add operational task" onClose={() => setShowForm(false)}>
          <form className="command-form" onSubmit={addTask}>
            <label className="wide">Task<input name="title" required placeholder="Confirm delivery address" /></label>
            <label>Type<input name="type" required placeholder="Delivery" /></label>
            <label>Assignee<input name="assignee" required placeholder="Theresa" /></label>
            <label>Due<input name="due" required placeholder="3:30 PM" /></label>
            <div className="form-footer">
              <button type="button" className="secondary-action" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="primary-action">Add task</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

const intakeStages: ClientIntakeStage[] = ["Lead", "Profile started", "Documents needed", "Payment ready", "Approved"];

function ClientIntakeCommandCenter({ moduleId, search }: { moduleId: "customers" | "leads"; search: string }) {
  const [profiles, setProfiles] = usePersistentState<ClientIntakeProfile[]>("prestige:launch:customers", clientIntakeProfiles);
  const [activeId, setActiveId] = useState(profiles[0]?.id ?? "");
  const [showForm, setShowForm] = useState(false);
  const activeProfile = profiles.find((profile) => profile.id === activeId) ?? profiles[0];
  const visibleProfiles = profiles.filter((profile) =>
    `${profile.id} ${profile.name} ${profile.preferredVehicle} ${profile.stage}`.toLowerCase().includes(search.toLowerCase()),
  );
  const paymentReadyCount = profiles.filter((profile) => profile.stage === "Payment ready" || profile.stage === "Approved").length;
  const averageCompleteness = profiles.length
    ? Math.round(profiles.reduce((sum, profile) => sum + profile.profileCompleteness, 0) / profiles.length)
    : 0;

  useEffect(() => {
    const open = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail === "customers" || detail === "leads") setShowForm(true);
    };
    window.addEventListener("prestige:new-record", open);
    return () => window.removeEventListener("prestige:new-record", open);
  }, []);

  const advanceProfile = () => {
    if (!activeProfile) return;
    const currentIndex = intakeStages.indexOf(activeProfile.stage);
    const nextStage = intakeStages[Math.min(currentIndex + 1, intakeStages.length - 1)];
    const nextCompleteness = Math.min(100, activeProfile.profileCompleteness + 18);
    setProfiles(profiles.map((profile) =>
      profile.id === activeProfile.id
        ? { ...profile, stage: nextStage, profileCompleteness: nextCompleteness, nextAction: nextStage === "Approved" ? "Ready for reservation creation" : `Complete ${nextStage.toLowerCase()} review` }
        : profile,
    ));
  };

  const addProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: ClientIntakeProfile = {
      id: `CLI-2026-${String(190 + profiles.length).padStart(4, "0")}`,
      name: String(form.get("name")),
      stage: "Lead",
      source: String(form.get("source")),
      preferredVehicle: String(form.get("vehicle")),
      tripWindow: String(form.get("tripWindow")),
      profileCompleteness: 20,
      paymentStatus: "Deferred",
      squareCustomer: "Not configured",
      savedPayment: "Payments deferred",
      nextAction: "Complete contact and driver profile",
    };
    setProfiles([next, ...profiles]);
    setActiveId(next.id);
    setShowForm(false);
  };

  return (
    <section className="client-intake">
      <div className="client-intake-hero">
        <div>
          <span className="eyebrow">{moduleId === "leads" ? "Lead Intake" : "Client Profiles"}</span>
          <h2>Capture renters once, approve them carefully, and reuse the profile for future rentals.</h2>
          <p>
            The MVP creates a clean path for website inquiries, concierge entries, and an iPad intake experience.
            Payment collection is intentionally deferred while fleet, customer, document, and approval operations come online.
          </p>
        </div>
        <div className="client-intake-actions">
          <button className="primary-action" onClick={() => setShowForm(true)}>
            <Plus size={17} />
            <span>Start intake</span>
          </button>
          <button className="secondary-action" onClick={advanceProfile} disabled={!activeProfile}>
            <Shield size={17} />
            <span>Advance selected profile</span>
          </button>
        </div>
      </div>

      <div className="client-intake-metrics" aria-label="Client intake summary">
        <article>
          <span>Profiles</span>
          <strong>{profiles.length}</strong>
          <p>Active renter records in review</p>
        </article>
        <article>
          <span>Payment ready</span>
          <strong>{paymentReadyCount}</strong>
          <p>Profiles ready beyond document review</p>
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
            {visibleProfiles.length === 0 && (
              <div className="module-empty compact-empty">
                <Command size={26} />
                <h2>No customers yet</h2>
                <p>Start the first real intake when a customer inquiry arrives.</p>
              </div>
            )}
            {visibleProfiles.map((profile) => (
              <article
                className={cx("intake-profile-card", profile.id === activeProfile.id && "selected-record")}
                key={profile.id}
                onClick={() => setActiveId(profile.id)}
              >
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
          <PanelHeader title="Profile Review" action="Saved locally" />
          {activeProfile ? (
            <>
              <div className="intake-editor-summary">
                <span className="mini-label">{activeProfile.id}</span>
                <h3>{activeProfile.name}</h3>
                <p>{activeProfile.preferredVehicle} · {activeProfile.tripWindow}</p>
              </div>
              <div className="payment-reference-card">
                <Shield size={20} />
                <div>
                  <span>Integration status</span>
                  <strong>Payments deferred</strong>
                  <p>Customer and approval workflows can proceed without the payment portal.</p>
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
            </>
          ) : (
            <div className="module-empty compact-empty">
              <Shield size={26} />
              <h2>Awaiting first customer</h2>
              <p>New intake details and approval requirements will appear here.</p>
            </div>
          )}
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
          <PanelHeader title="Deferred Payments Boundary" action="Later phase" />
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
      {showForm && (
        <Modal title="Start customer intake" onClose={() => setShowForm(false)}>
          <form className="command-form" onSubmit={addProfile}>
            <label>Customer name<input name="name" required placeholder="First and last name" /></label>
            <label>Source<select name="source"><option>Website inquiry</option><option>iPad showroom intake</option><option>Concierge referral</option><option>Hotel partner</option></select></label>
            <label>Preferred vehicle<select name="vehicle">{fleetManagerVehicles.map((vehicle) => <option key={vehicle.id}>{vehicle.name}</option>)}</select></label>
            <label>Trip window<input name="tripWindow" required placeholder="Jun 28-30" /></label>
            <div className="form-footer">
              <button type="button" className="secondary-action" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="primary-action">Create intake</button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

function DeferredFinanceView() {
  return (
    <section className="panel deferred-finance">
      <span className="eyebrow">Deferred integration</span>
      <h2>Finance and Square are intentionally parked for a later phase.</h2>
      <p>
        Fleet, intake, reservations, operations, and inspections can be built and tested without exposing
        payment actions before the Square account, credentials, staff permissions, and server layer are ready.
      </p>
      <div className="foundation-list">
        {[
          "No live payment or authorization actions are exposed",
          "Reservation lifecycle remains independent from provider setup",
          "Customer records store no payment credentials",
          "The future adapter can connect without rewriting operations",
        ].map((item) => (
          <article key={item}><Shield size={17} /><span>{item}</span></article>
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

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="command-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="command-modal" role="dialog" aria-modal="true" aria-labelledby="command-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <div>
            <span className="mini-label">PrestigeOS workflow</span>
            <h2 id="command-modal-title">{title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
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
