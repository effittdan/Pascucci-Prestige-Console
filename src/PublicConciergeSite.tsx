import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Menu, X } from "lucide-react";

const asset = (path: string) => `/concierge-assets/${path}`;
const contactEmail = "jerry@pascucciprestigerentals.com";
const reservationEmailHref = `mailto:${contactEmail}?subject=Pascucci%20Prestige%20Reservation%20Request`;
const conciergeEmailHref = `mailto:${contactEmail}?subject=Pascucci%20Prestige%20Concierge%20Inquiry`;
const membershipEmailHref = `mailto:${contactEmail}?subject=Prestige%20Premier%20Membership%20Inquiry`;

type RouteKey =
  | "home"
  | "fleet"
  | "concierge"
  | "occasions"
  | "how-it-works"
  | "about"
  | "faq"
  | "contact"
  | "request-reservation";

const navItems: { label: string; route: RouteKey; href: string }[] = [
  { label: "Fleet", route: "fleet", href: "/fleet" },
  { label: "Concierge", route: "concierge", href: "/concierge" },
  { label: "Occasions", route: "occasions", href: "/occasions" },
  { label: "How it works", route: "how-it-works", href: "/how-it-works" },
  { label: "About", route: "about", href: "/about" },
  { label: "FAQ", route: "faq", href: "/faq" },
  { label: "Contact", route: "contact", href: "/contact" },
];

const routeTitles: Record<RouteKey, string> = {
  home: "Pascucci Prestige - Luxury & Exotic Car Rental in San Antonio",
  fleet: "The Fleet - Luxury & Exotic Vehicles | Pascucci Prestige",
  concierge: "Concierge Delivery - Hotel, Airport & Residential | Pascucci Prestige",
  occasions: "Occasions - Weddings, Corporate, Weekends | Pascucci Prestige",
  "how-it-works": "How It Works - Reservation Process | Pascucci Prestige",
  about: "About - Private Automotive Concierge | Pascucci Prestige",
  faq: "FAQ - Luxury Car Rental Questions | Pascucci Prestige",
  contact: "Contact Concierge | Pascucci Prestige",
  "request-reservation": "Request a Reservation | Pascucci Prestige",
};

type FleetCar = {
  name: string;
  category: string;
  line: string;
  price: string;
  specs: string;
  image: string;
  gallery: string[];
  details: { label: string; value: string }[];
  highlights: string[];
};

const fleet: FleetCar[] = [
  {
    name: "McLaren GT",
    category: "Grand Tourer",
    line: "Supercar presence with long-distance composure.",
    price: "$1,099 / day or $250 / hour",
    specs: "2 passengers - RWD - delivery available",
    image: asset("cars/mclaren-gt-real-01.jpg"),
    gallery: [
      asset("cars/mclaren-gt-real-01.jpg"),
      asset("cars/mclaren-gt-real-02.jpg"),
      asset("cars/mclaren-gt-real-03.jpg"),
      asset("cars/mclaren-gt-real-04.jpg"),
      asset("cars/mclaren-gt-real-05.jpg"),
      asset("cars/mclaren-gt-real-06.jpg"),
      asset("cars/mclaren-gt-real-08.jpg"),
      asset("cars/mclaren-gt-real-12.jpg"),
    ],
    details: [
      { label: "Engine", value: "4.0L twin-turbocharged V8" },
      { label: "Transmission", value: "7-speed dual-clutch automatic" },
      { label: "Drivetrain", value: "Rear-wheel drive" },
      { label: "Passengers", value: "2" },
      { label: "Power", value: "612 hp" },
      { label: "Rate", value: "$1,099 per day or $250 per hour" },
      { label: "Best for", value: "Weekend escapes, arrivals, executive occasions" },
    ],
    highlights: ["Grand touring comfort", "Low-slung supercar profile", "Concierge delivery available"],
  },
  {
    name: "Lamborghini Urus",
    category: "Luxury SUV",
    line: "Supercar soul. SUV freedom.",
    price: "$1,199 / day or $300 / hour",
    specs: "5 passengers - AWD - 641 hp",
    image: asset("cars/lamborghini-urus-real-01.jpg"),
    gallery: [
      asset("cars/lamborghini-urus-real-01.jpg"),
      asset("cars/lamborghini-urus-real-04.jpg"),
      asset("cars/lamborghini-urus-real-03.jpg"),
      asset("cars/lamborghini-urus-real-05.jpg"),
      asset("cars/lamborghini-urus-real-06.jpg"),
      asset("cars/lamborghini-urus-real-07.jpg"),
      asset("cars/lamborghini-urus-real-08.jpg"),
      asset("cars/lamborghini-urus-real-09.jpg"),
    ],
    details: [
      { label: "Engine", value: "4.0L twin-turbocharged V8" },
      { label: "Transmission", value: "8-speed automatic" },
      { label: "Drivetrain", value: "All-wheel drive" },
      { label: "Passengers", value: "5" },
      { label: "Power", value: "641 hp" },
      { label: "Rate", value: "$1,199 per day or $300 per hour" },
      { label: "Best for", value: "Group arrivals, weddings, city weekends" },
    ],
    highlights: ["Orange exterior", "Super-SUV performance", "Flexible delivery and pickup"],
  },
  {
    name: "Porsche 911 Cabriolet",
    category: "Convertible",
    line: "Open-air precision with everyday polish.",
    price: "$799 / day or $160 / hour",
    specs: "4 passengers - RWD - open-top touring",
    image: asset("cars/porsche-911-cabriolet-real-01.jpg"),
    gallery: [
      asset("cars/porsche-911-cabriolet-real-01.jpg"),
      asset("cars/porsche-911-cabriolet-real-04.jpg"),
      asset("cars/porsche-911-cabriolet-real-03.jpg"),
      asset("cars/porsche-911-cabriolet-real-02.jpg"),
      asset("cars/porsche-911-cabriolet-real-05.jpg"),
      asset("cars/porsche-911-cabriolet-real-06.jpg"),
      asset("cars/porsche-911-cabriolet-real-07.jpg"),
      asset("cars/porsche-911-cabriolet-real-08.jpg"),
    ],
    details: [
      { label: "Engine", value: "3.0L twin-turbocharged flat-six" },
      { label: "Transmission", value: "8-speed PDK automatic" },
      { label: "Drivetrain", value: "Rear-wheel drive" },
      { label: "Passengers", value: "4" },
      { label: "Power", value: "379 hp" },
      { label: "Roof", value: "Power convertible soft top" },
      { label: "Rate", value: "$799 per day or $160 per hour" },
      { label: "Best for", value: "Coastal drives, date nights, weekend escapes" },
    ],
    highlights: ["Silver cabriolet", "Open-air grand touring", "Availability by request"],
  },
];

const occasions = [
  ["Weddings", "Couture arrivals, getaway moments, and full-day coordination tailored to the ceremony.", "McLaren GT, Lamborghini Urus, Porsche 911"],
  ["Corporate travel", "Quiet movement for executives, visiting partners, and client-facing pickups.", "McLaren GT, Lamborghini Urus, Porsche 911"],
  ["Weekend escapes", "Hill Country, the coast or just a Saturday - your weekend, upgraded.", "Lamborghini Urus, McLaren GT, Porsche 911"],
  ["Birthdays & anniversaries", "Mark the milestone with a vehicle worth remembering.", "Porsche 911, Lamborghini Urus, McLaren GT"],
  ["Photo & video productions", "Curated vehicles delivered to set, with flexible hold windows.", "Our three-vehicle collection"],
  ["Hotel stays & airport arrivals", "Meet your vehicle at the lobby, FBO or terminal.", "Our three-vehicle collection"],
];

const faqs = [
  ["Minimum age", "Renters must be at least 25 years old. Some exotic vehicles may require additional approval."],
  ["Insurance requirements", "Full coverage is required for every reservation. A concierge can help coordinate qualifying coverage."],
  ["Security deposit", "A refundable security deposit is held for the duration of the rental and released after return review."],
  ["Mileage limits", "Mileage allowances vary by vehicle and reservation length. Additional mileage can be arranged in advance."],
  ["Delivery areas", "We deliver throughout San Antonio, greater Bexar County, hotels, residences, venues, SAT, and FBOs."],
  ["Additional drivers", "Every driver must be verified before handoff."],
  ["Cancellation policy", "A concierge confirms cancellation terms before the reservation is finalized."],
];

function resolveRoute(pathname: string): RouteKey {
  const route = pathname.replace(/^\/+/, "") as RouteKey;
  return route && routeTitles[route] ? route : "home";
}

export function PublicConciergeSite() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<FleetCar | null>(null);
  const route = resolveRoute(window.location.pathname);

  useMemo(() => {
    document.title = routeTitles[route];
  }, [route]);

  return (
    <div className="public-site">
      <Header route={route} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {route === "home" && <HomePage onSelectCar={setSelectedCar} />}
      {route === "fleet" && <FleetPage onSelectCar={setSelectedCar} />}
      {route === "concierge" && <ConciergePage />}
      {route === "occasions" && <OccasionsPage />}
      {route === "how-it-works" && <HowItWorksPage />}
      {route === "about" && <AboutPage />}
      {route === "faq" && <FaqPage />}
      {route === "contact" && <ContactPage />}
      {route === "request-reservation" && <ReservationPage />}
      <Footer />
      {selectedCar && <FleetDetailsModal car={selectedCar} onClose={() => setSelectedCar(null)} />}
    </div>
  );
}

function Header({
  route,
  mobileOpen,
  setMobileOpen,
}: {
  route: RouteKey;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  return (
    <header className="public-header">
      <a className="public-logo" href="/" aria-label="Pascucci Prestige home">
        <img src={asset("pascucci-prestige-logo.png")} alt="Pascucci Prestige" />
      </a>
      <nav className="public-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a key={item.route} className={route === item.route ? "active" : undefined} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <a className="nav-reserve" href={reservationEmailHref}>Request reservation</a>
      <button className="mobile-nav-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {mobileOpen && (
        <div className="mobile-nav-panel">
          {navItems.map((item) => (
            <a key={item.route} href={item.href}>{item.label}</a>
          ))}
          <a href={reservationEmailHref}>Request reservation</a>
        </div>
      )}
    </header>
  );
}

function HomePage({ onSelectCar }: { onSelectCar: (car: FleetCar) => void }) {
  return (
    <main>
      <section className="public-hero">
        <img src={asset("cars/mclaren-gt-real-01.jpg")} alt="White McLaren GT photographed in San Antonio" />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="public-kicker">Luxury auto concierge - San Antonio, Texas</span>
          <h1>
            <span>Drive beyond</span>
            <em>ordinary.</em>
          </h1>
          <p>Luxury and exotic vehicle access in San Antonio, delivered with concierge-level service. Your vehicle. Your schedule. Your arrival.</p>
          <div className="hero-actions">
            <a className="button ghost" href="/fleet">View the fleet <ArrowRight size={16} /></a>
            <a className="button primary" href={reservationEmailHref}>Request a reservation</a>
          </div>
        </div>
        <span className="scroll-cue">Scroll</span>
      </section>
      <FleetPreview onSelectCar={onSelectCar} />
      <MembershipPreview />
      <ConciergePromise />
      <ProcessPreview />
      <OccasionPreview />
      <SanAntonioBand />
      <Testimonials />
      <ReserveBand />
    </main>
  );
}

function MembershipPreview() {
  return (
    <section className="membership-preview" aria-labelledby="membership-title">
      <div className="membership-copy">
        <span className="public-kicker">VIP membership</span>
        <p className="membership-edition">Prestige Premier</p>
        <h2 id="membership-title">A standing invitation to drive differently.</h2>
        <p className="membership-intro">
          Reserved for clients who want extraordinary vehicles to be part of the month—not just the occasion.
        </p>
        <div className="membership-benefits">
          <article>
            <strong>5</strong>
            <span>Rental days each month</span>
          </article>
          <article>
            <strong>1,000</strong>
            <span>Miles included monthly</span>
          </article>
          <article>
            <strong>VIP</strong>
            <span>Concierge-led planning</span>
          </article>
        </div>
        <ul>
          <li><Check size={17} />Choose from eligible vehicles in the Pascucci Prestige fleet</li>
          <li><Check size={17} />Coordinate your monthly drives directly with a concierge</li>
          <li><Check size={17} />Enjoy one clear monthly membership rate</li>
        </ul>
        <div className="membership-action">
          <a className="button gold" href={membershipEmailHref}>Request membership details <ArrowRight size={16} /></a>
          <small>Vehicle availability and standard rental requirements apply.</small>
        </div>
      </div>
      <div className="membership-rate">
        <span>Monthly membership</span>
        <strong><sup>$</sup>4,000</strong>
        <p>Five days. One thousand miles. Your next drive already within reach.</p>
        <div aria-hidden="true">PP</div>
      </div>
    </section>
  );
}

function FleetPreview({ onSelectCar }: { onSelectCar: (car: FleetCar) => void }) {
  return (
    <section className="public-section obsidian" id="fleet">
      <SectionTitle kicker="The fleet" title="Curated. Maintained. Ready." action="View full fleet" href="/fleet" />
      <div className="fleet-grid">
        {fleet.slice(0, 3).map((car) => <FleetCard car={car} key={car.name} onSelectCar={onSelectCar} />)}
      </div>
    </section>
  );
}

function FleetCard({ car, onSelectCar }: { car: FleetCar; onSelectCar: (car: FleetCar) => void }) {
  return (
    <article className="fleet-card">
      <button type="button" className="fleet-image" onClick={() => onSelectCar(car)} aria-label={`View details for ${car.name}`}>
        <img src={car.image} alt={`${car.name} - ${car.category}`} />
      </button>
      <div className="fleet-card-body">
        <span>{car.category}</span>
        <h2>{car.name}</h2>
        <strong>{car.price}</strong>
        <p>{car.specs}</p>
        <div className="fleet-card-actions">
          <button type="button" onClick={() => onSelectCar(car)}>View details <ArrowRight size={15} /></button>
          <a href={reservationEmailHref}>Ask about availability</a>
        </div>
      </div>
    </article>
  );
}

function FleetDetailsModal({ car, onClose }: { car: FleetCar; onClose: () => void }) {
  return (
    <div className="fleet-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="fleet-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fleet-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="fleet-modal-close" type="button" onClick={onClose} aria-label="Close vehicle details">
          <X size={18} />
        </button>
        <div className="fleet-modal-copy">
          <span className="public-kicker">{car.category}</span>
          <h2 id="fleet-modal-title">{car.name}</h2>
          <p>{car.line}</p>
          <div className="fleet-modal-highlights">
            {car.highlights.map((highlight) => (
              <span key={highlight}>{highlight}</span>
            ))}
          </div>
        </div>
        <div className="fleet-modal-gallery">
          {car.gallery.map((photo, index) => (
            <figure key={photo}>
              <img src={photo} alt={`${car.name} view ${index + 1}`} />
            </figure>
          ))}
        </div>
        <div className="fleet-modal-details">
          {car.details.map((detail) => (
            <article key={detail.label}>
              <span>{detail.label}</span>
              <strong>{detail.value}</strong>
            </article>
          ))}
        </div>
        <div className="fleet-modal-actions">
          <a className="button primary" href={reservationEmailHref}>Ask about availability</a>
          <button type="button" className="button ghost" onClick={onClose}>Return to fleet</button>
        </div>
      </section>
    </div>
  );
}

function ConciergePromise() {
  return (
    <section className="split-promise">
      <div className="promise-photo">
        <img src={asset("cars/lamborghini-urus-real-06.jpg")} alt="Lamborghini Urus prepared for concierge delivery" />
      </div>
      <div className="promise-copy">
        <span className="public-kicker">The concierge promise</span>
        <h2>Luxury delivered.</h2>
        <p>Hotel, airport, residential and special-event delivery throughout San Antonio. A discreet handoff. A briefed vehicle. A departure on your timeline - not ours.</p>
        <ul>
          <li><Check size={17} />White-glove handoff</li>
          <li><Check size={17} />Flexible scheduling</li>
          <li><Check size={17} />Insurance coordination</li>
          <li><Check size={17} />Vehicle preparation</li>
        </ul>
        <a className="text-link" href="/concierge">Explore concierge services <ArrowRight size={15} /></a>
      </div>
    </section>
  );
}

function ProcessPreview() {
  const steps = [
    ["01", "Choose your vehicle", "Browse the curated fleet and select the right vehicle for the occasion."],
    ["02", "Submit a request", "Share your dates, delivery location and a few driver details."],
    ["03", "Confirm the details", "A concierge confirms availability, pricing, deposit and requirements."],
    ["04", "Receive your vehicle", "We deliver to your hotel, terminal, residence or event - on your time."],
  ];

  return (
    <section className="public-section obsidian">
      <SectionTitle kicker="How it works" title="Reserved in minutes. Delivered with care." action="See the full process" href="/how-it-works" />
      <div className="process-grid">
        {steps.map(([number, title, text]) => (
          <article key={number} className="process-step">
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function OccasionPreview() {
  return (
    <section className="public-section charcoal">
      <SectionTitle kicker="Occasions" title="Built for the moments that matter." action="Browse occasions" href="/occasions" />
      <div className="occasion-grid">
        {occasions.slice(0, 4).map(([title, text]) => (
          <a className="occasion-card" href="/occasions" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
            <span>Learn more <ArrowRight size={14} /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function SanAntonioBand() {
  return (
    <section className="city-band">
      <div>
        <span className="public-kicker">San Antonio, Texas</span>
        <h2>San Antonio, meet your next obsession.</h2>
        <p>From downtown hotels to the Hill Country, the Riverwalk to private estates - our delivery footprint covers the city and beyond.</p>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    ["The Urus arrived at the hotel exactly as promised. Discreet, immaculate, handed off in under a minute. We will use Pascucci again.", "M. Lawson", "Executive client"],
    ["They delivered the McLaren to the chapel, waited quietly, then brought it back at midnight. Felt like a private service, not a rental.", "A. & J. Reyes", "Wedding client"],
    ["Picked us up at the terminal in the Porsche. The weekend started the moment we stepped outside.", "D. Patel", "Weekend escape"],
  ];

  return (
    <section className="public-section obsidian">
      <span className="public-kicker">Client reflections</span>
      <div className="quote-grid">
        {quotes.map(([quote, name, label]) => (
          <blockquote key={name}>
            <p>"{quote}"</p>
            <cite>{name}<span>{label}</span></cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function ReserveBand() {
  return (
    <section className="reserve-band">
      <span className="public-kicker">Reserve</span>
      <h2>Your vehicle. Your schedule. Your arrival.</h2>
      <p>Tell us when, where and which vehicle. A concierge will respond personally to confirm availability and delivery.</p>
      <div>
        <a className="button dark" href={reservationEmailHref}>Request a reservation</a>
        <a className="button outline-dark" href={conciergeEmailHref}>Contact concierge</a>
      </div>
    </section>
  );
}

function FleetPage({ onSelectCar }: { onSelectCar: (car: FleetCar) => void }) {
  return (
    <main className="page-main">
      <PageHero kicker="The fleet" title="Exceptional vehicles, ready on request." text="Each vehicle is privately maintained, detailed before every delivery, and reserved by request to ensure availability." />
      <section className="public-section obsidian tight">
        <div className="fleet-grid full">
          {fleet.map((car) => <FleetCard car={car} key={car.name} onSelectCar={onSelectCar} />)}
        </div>
      </section>
    </main>
  );
}

function ConciergePage() {
  const services = ["Hotel delivery", "Airport delivery", "Residential delivery", "Wedding delivery", "Executive delivery", "Special events"];
  return (
    <main className="page-main">
      <PageHero kicker="Concierge services" title="Your vehicle. Your schedule. Your arrival." text="We do not operate a counter. Every vehicle is delivered, briefed and collected - wherever the day begins and ends." />
      <section className="public-section obsidian tight">
        <div className="service-grid">
          {services.map((service) => <article key={service}><h2>{service}</h2><p>{serviceDescriptions[service]}</p></article>)}
        </div>
        <a className="button primary" href={reservationEmailHref}>Schedule delivery</a>
      </section>
    </main>
  );
}

const serviceDescriptions: Record<string, string> = {
  "Hotel delivery": "Discreet handoff at the porte-cochere of every major San Antonio hotel.",
  "Airport delivery": "Meet at SAT or the FBO with the vehicle ready when you land.",
  "Residential delivery": "Door-to-door coordination at private residences and gated communities.",
  "Wedding delivery": "Couture arrivals, getaway cars, and full-day chauffeur coordination.",
  "Executive delivery": "Quiet, on-schedule transport for executives and visiting partners.",
  "Special events": "Birthdays, anniversaries, premieres and milestones to remember.",
};

function OccasionsPage() {
  return (
    <main className="page-main">
      <PageHero kicker="Occasions" title="Built for the moments that matter." />
      <section className="public-section obsidian tight">
        <div className="occasion-grid page">
          {occasions.map(([title, text, vehicles]) => (
            <a className="occasion-card" href={reservationEmailHref} key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
              <small>{vehicles}</small>
              <span>Request a reservation <ArrowRight size={14} /></span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function HowItWorksPage() {
  return (
    <main className="page-main">
      <PageHero kicker="How it works" title="Reserved in minutes. Delivered with care." />
      <ProcessPreview />
      <section className="public-section charcoal tight">
        <span className="public-kicker">Reassurance</span>
        <h2 className="section-heading">What to expect</h2>
        <div className="service-grid">
          {["Driver verification", "Security deposit", "Insurance", "Delivery coordination", "Return process"].map((item) => (
            <article key={item}><h2>{item}</h2><p>{expectations[item]}</p></article>
          ))}
        </div>
      </section>
    </main>
  );
}

const expectations: Record<string, string> = {
  "Driver verification": "A valid driver license, proof of insurance and a brief verification are required for every reservation.",
  "Security deposit": "A refundable security deposit is held for the duration of the rental and released after vehicle return.",
  Insurance: "Full coverage is required. We can coordinate qualifying coverage where needed.",
  "Delivery coordination": "We confirm delivery time, location and contact details the day before pickup.",
  "Return process": "We coordinate return at the agreed time and location.",
};

function AboutPage() {
  return (
    <main className="page-main">
      <section className="public-section obsidian about-copy">
        <span className="public-kicker">About</span>
        <h1>A private automotive concierge, rooted in San Antonio.</h1>
        <p>Pascucci Prestige was built on a simple idea: extraordinary vehicles deserve an extraordinary experience. No counters. No queues. Every reservation handled personally.</p>
        <p>Our fleet is intentionally small and obsessively maintained. Each vehicle is detailed and inspected before delivery, briefed at handoff, and collected when you are done.</p>
        <p>San Antonio is home - its hotels, neighborhoods, airport and calendar of weddings, premieres and milestones shape how we serve.</p>
        <a className="button primary" href={reservationEmailHref}>Reserve your vehicle</a>
      </section>
    </main>
  );
}

function FaqPage() {
  const [open, setOpen] = useState(0);
  return (
    <main className="page-main">
      <PageHero kicker="FAQ" title="Questions, answered." />
      <section className="public-section obsidian tight">
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article className={open === index ? "open" : undefined} key={question}>
              <button onClick={() => setOpen(open === index ? -1 : index)}>
                {question}
                <ChevronDown size={18} />
              </button>
              {open === index && <p>{answer}</p>}
            </article>
          ))}
        </div>
        <a className="button primary" href={conciergeEmailHref}>Still curious? Contact concierge</a>
      </section>
    </main>
  );
}

function ContactPage() {
  return (
    <main className="page-main">
      <PageHero kicker="Contact" title="Speak with a concierge." text="We respond personally - typically within an hour during business hours. For active reservations, please call directly." />
      <section className="public-section obsidian tight contact-layout">
        <article><span>Service area</span><strong>San Antonio, Texas & greater Bexar County</strong></article>
        <article><span>Email</span><a href={`mailto:${contactEmail}`}>{contactEmail}</a></article>
        <article><span>Direct response</span><a href={reservationEmailHref}>Open reservation request</a></article>
      </section>
      <ReserveBand />
    </main>
  );
}

function ReservationPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <main className="page-main">
      <section className="request-layout">
        <div>
          <span className="public-kicker">Reserve</span>
          <h1>Request a reservation.</h1>
          <p>Share a few details and a concierge will respond personally to confirm availability, pricing, and delivery.</p>
        </div>
        <form className="reservation-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
          {submitted ? (
            <div className="form-confirmation">
              <Check size={28} />
              <h2>Request received.</h2>
              <p>This local rebuild captured the request flow. Backend delivery into the command center is the next connection point.</p>
              <button type="button" onClick={() => setSubmitted(false)}>Enter another request</button>
            </div>
          ) : (
            <>
              <fieldset>
                <legend>About you</legend>
                <label>Full name*<input required name="name" /></label>
                <label>Email*<input required type="email" name="email" /></label>
                <label>Phone*<input required type="tel" name="phone" /></label>
                <label>Preferred contact<select name="contact"><option>Select...</option><option>Phone</option><option>Text</option><option>Email</option></select></label>
              </fieldset>
              <fieldset>
                <legend>The reservation</legend>
                <label>Vehicle of interest<select name="vehicle"><option>Recommend for me</option>{fleet.map((car) => <option key={car.name}>{car.name}</option>)}</select></label>
                <label>Occasion<input name="occasion" placeholder="Wedding, weekend, executive..." /></label>
                <label>Pickup date*<input required type="date" name="pickup" /></label>
                <label>Return date*<input required type="date" name="return" /></label>
                <label>Pickup / delivery location<input name="location" placeholder="Hotel, address, terminal..." /></label>
                <label>Delivery requested?<select name="delivery"><option>Select...</option><option>Yes</option><option>No</option><option>Discuss with concierge</option></select></label>
              </fieldset>
              <fieldset>
                <legend>Driver details</legend>
                <label>Number of drivers<input type="number" min="1" name="drivers" /></label>
                <label>Primary driver age<input type="number" min="21" name="age" /></label>
                <label className="wide">Anything else?<textarea name="message" rows={4} /></label>
                <label className="checkbox wide"><input required type="checkbox" />I understand a concierge will follow up to confirm availability, pricing, deposit and insurance requirements before any reservation is finalized.</label>
              </fieldset>
              <div className="form-actions">
                <button type="submit">Request a reservation</button>
                <a href={conciergeEmailHref}>Contact concierge</a>
              </div>
            </>
          )}
        </form>
      </section>
    </main>
  );
}

function PageHero({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <section className="page-hero">
      <span className="public-kicker">{kicker}</span>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </section>
  );
}

function SectionTitle({ kicker, title, action, href }: { kicker: string; title: string; action?: string; href?: string }) {
  return (
    <div className="section-title">
      <div>
        <span className="public-kicker">{kicker}</span>
        <h2>{title}</h2>
      </div>
      {action && href && <a href={href}>{action} <ArrowRight size={15} /></a>}
    </div>
  );
}

function Footer() {
  return (
    <footer className="public-footer">
      <div>
        <img src={asset("pascucci-prestige-logo.png")} alt="Pascucci Prestige" />
        <p>A private automotive concierge in San Antonio. Curated luxury and exotic vehicles, delivered to your hotel, residence, or arrival terminal.</p>
        <a className="button primary" href={reservationEmailHref}>Request reservation</a>
      </div>
      <div>
        <h2>Explore</h2>
        {navItems.slice(0, 6).map((item) => <a key={item.route} href={item.href}>{item.label}</a>)}
      </div>
      <div>
        <h2>Concierge</h2>
        <p>San Antonio, Texas</p>
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        <a href={conciergeEmailHref}>Contact the concierge team</a>
      </div>
      <small>© 2026 Pascucci Prestige. All rights reserved. Luxury Auto Concierge - San Antonio, TX</small>
    </footer>
  );
}
