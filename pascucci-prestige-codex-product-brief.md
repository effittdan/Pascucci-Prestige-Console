# Pascucci Prestige Operations Platform
## Codex Product Brief and MVP Build Specification

**Working product name:** PrestigeOS  
**Document version:** 1.0  
**Prepared:** June 8, 2026  
**Primary deployment:** Netlify  
**Primary backend:** Supabase  
**Application type:** Responsive web application / progressive web app  
**Initial market:** San Antonio, Texas  

---

## 1. Codex Assignment

Build the first production-ready version of a private operations platform for Pascucci Prestige, a high-touch luxury and exotic vehicle rental company.

The application must manage the full rental lifecycle:

1. Capture an inquiry or lead.
2. Create and send a quote.
3. Place a temporary hold on a vehicle.
4. Qualify the customer and approved drivers.
5. Collect required documents.
6. Record payment and agreement status.
7. Confirm the reservation.
8. Prepare and inspect the vehicle.
9. Deliver or release the vehicle.
10. Manage the active rental.
11. Inspect and receive the vehicle.
12. Record additional charges, incidents, maintenance, and final closeout.

This is not intended to be a generic public car-rental marketplace. It is an internal operating system with a controlled customer portal and concierge-style workflow.

### Core build principle

A vehicle is never simply “booked.” Every reservation must move through a controlled state machine, and every vehicle must have a reliable operational status. Calendar availability, customer readiness, vehicle readiness, delivery readiness, and financial readiness are related but separate concepts.

---

## 2. Product Vision

PrestigeOS should give the Pascucci Prestige team one trusted place to answer five questions:

1. What needs attention today?
2. Which vehicles are truly available?
3. Which customers and drivers are approved?
4. What must happen before each vehicle leaves or returns?
5. How is each vehicle and rental performing financially?

The experience should feel closer to a luxury hospitality operations console than a conventional rental counter system.

### Product goals

- Create a single source of truth for customers, vehicles, reservations, documents, tasks, inspections, maintenance, and payments.
- Prevent double bookings and operational conflicts.
- Make daily departures, returns, deliveries, and vehicle preparation visible from one dashboard.
- Reduce manual coordination across email, text messages, paper forms, and spreadsheets.
- Preserve human approval over customers, drivers, vehicles, rates, and exceptions.
- Support mobile inspection and delivery workflows.
- Maintain a complete audit trail for sensitive actions and reservation changes.
- Establish a modular foundation for future customer booking, partner referrals, telematics, accounting, and automated communications.

### Non-goals for the first release

- A public marketplace with instant booking.
- Native iOS or Android applications.
- Automated driving-record or motor-vehicle-record adjudication.
- Automated damage detection using artificial intelligence.
- Telematics, remote unlock, or GPS tracking.
- Full accounting or general ledger functionality.
- Dynamic pricing based on market demand.
- Complex referral commission payouts.
- Multi-company software-as-a-service billing.

---

## 3. Product Strategy

### Release strategy

Build the system in vertical slices rather than creating every database table first and every screen later.

Recommended slice order:

1. Authentication, roles, navigation, and audit logging.
2. Fleet and customer records.
3. Reservation creation and availability controls.
4. Daily operations dashboard and task system.
5. Document readiness and approval workflow.
6. Vehicle check-out and return inspections.
7. Maintenance and vehicle downtime.
8. Customer portal.
9. Payment, e-signature, messaging, and accounting integrations.

### MVP definition

The MVP is complete when an authorized staff user can create a customer, create a vehicle, produce a reservation, verify that no conflict exists, move the reservation through approval and operational statuses, complete mobile departure and return inspections, record a payment status, close the rental, and review an audit history.

External payment, identity, electronic signature, SMS, and accounting providers may initially use adapter interfaces and test-mode implementations. The internal workflow must not depend on a vendor-specific user interface.

---

## 4. Users and Roles

Use role-based access control. Implement roles as data, not hard-coded email addresses.

### Required roles

| Role | Purpose | Typical access |
|---|---|---|
| `owner_admin` | Full company administration | All modules, configuration, finance, approvals, users, audit logs |
| `operations_manager` | Runs daily fleet and reservation activity | Reservations, fleet, customers, tasks, inspections, maintenance, reports |
| `concierge` | Handles inquiries, customers, documents, and delivery coordination | Leads, quotes, reservations, customers, communications, tasks |
| `finance` | Reconciles charges and financial records | Payment records, invoices, refunds, reports, limited customer data |
| `driver` | Completes assigned delivery, pickup, and inspection work | Assigned tasks, trip details, inspection forms, limited customer contact information |
| `maintenance_partner` | Services assigned vehicles | Assigned maintenance work orders only |
| `marketing` | Reviews lead sources and campaign performance | Leads, source attribution, aggregated reports, no identity documents |
| `customer` | Uses the customer portal | Own profile, approved drivers, own documents, own reservations, own messages |

### Initial personnel mapping

This mapping is seed data and must be editable:

| Person / group | Initial role suggestion |
|---|---|
| Jerry | `owner_admin` |
| Dan | `operations_manager` |
| Theresa | `operations_manager` or `concierge` with reporting access |
| Rosie | `concierge` with claims-support permissions |
| Mark Motors users | `maintenance_partner` |
| Contract delivery personnel | `driver` |

### Permission principles

- Deny access by default.
- Enforce permissions in Supabase Row Level Security, not only in the user interface.
- Customers may access only their own records and files.
- Drivers may access only tasks assigned to them and only the minimum customer information necessary to complete the assignment.
- Maintenance partners may access only work orders assigned to their organization.
- Marketing users may not access driver’s licenses, insurance files, payment details, internal risk notes, or incident files.
- Finance users may see transaction records but should not automatically receive access to private driver documents.
- Service-role credentials must never be exposed to the browser.

---

## 5. Information Architecture

### Staff application navigation

1. **Today**
2. **Calendar**
3. **Reservations**
4. **Fleet**
5. **Customers**
6. **Leads & Quotes**
7. **Operations**
8. **Inspections**
9. **Maintenance**
10. **Messages**
11. **Finance**
12. **Reports**
13. **Partners**
14. **Settings**

Hide modules a user cannot access.

### Customer portal navigation

1. **Overview**
2. **Reservations**
3. **Drivers**
4. **Documents**
5. **Payments**
6. **Messages**
7. **Profile**

### Mobile driver navigation

1. **Today’s Assignments**
2. **Assignment Detail**
3. **Departure Inspection**
4. **Delivery Confirmation**
5. **Return Inspection**
6. **Issue Report**

---

## 6. Core Product Modules

## 6.1 Today Dashboard

The Today dashboard is the default staff landing page.

### Required cards

- Departures today
- Returns today
- Deliveries and pickups today
- Vehicles being prepared
- Pending customer approvals
- Missing or expired documents
- Unsigned agreements
- Payments requiring attention
- Overdue rentals
- Open incidents
- Vehicles in maintenance
- Unassigned operational tasks
- New leads awaiting response

### Required views

#### Timeline

A chronological list of today’s operational events.

Each event should show:

- Scheduled time
- Vehicle
- Customer
- Activity type
- Location
- Assigned employee or partner
- Readiness status
- Warning indicators

#### Attention queue

Prioritized issues such as:

- Reservation begins within 24 hours but is not approved.
- Required document is missing or expired.
- Vehicle is not marked ready.
- Delivery task has no assignee.
- Payment authorization is missing.
- Rental is overdue.
- Return inspection is incomplete.
- Vehicle has a blocking maintenance issue.

### Readiness calculation

Display four independent readiness indicators on each upcoming reservation:

1. **Customer ready**
2. **Financially ready**
3. **Vehicle ready**
4. **Operations ready**

Do not collapse these into one Boolean field in the database. Derive the summary status from underlying requirements.

---

## 6.2 Lead and Inquiry Management

### Lead fields

- First name
- Last name
- Email
- Mobile phone
- Preferred contact method
- Requested vehicle or category
- Requested start and end date/time
- Pickup or delivery preference
- Requested location
- Trip or event type
- Number of drivers
- Referral source
- Referral partner
- Notes
- Consent flags
- Assigned staff member
- Lead status
- Created date
- Last contact date
- Next follow-up date

### Lead statuses

- `new`
- `contacted`
- `qualified`
- `quote_sent`
- `nurturing`
- `won`
- `lost`
- `spam`

### Required actions

- Create manually.
- Create from a public inquiry endpoint.
- Assign an owner.
- Add notes and activities.
- Create a quote.
- Convert to a customer.
- Mark won or lost with reason.
- Schedule a follow-up task.

### Lead-source reporting

Track the original and most recent source separately.

Suggested sources:

- Direct website
- Organic search
- Paid search
- Instagram
- Facebook
- Hotel concierge
- Wedding planner
- Corporate partner
- Mark Motors
- Existing customer referral
- Staff referral
- Other

---

## 6.3 Quote Management

A quote is a versioned pricing proposal. It is not a reservation.

### Quote fields

- Quote number
- Lead or customer
- Proposed vehicle
- Optional alternate vehicles
- Rental start and end
- Base rate structure
- Quantity of rental days
- Included mileage
- Excess-mileage rate
- Delivery and pickup fees
- Add-ons
- Discounts
- Taxes
- Security authorization amount
- Total estimate
- Expiration date/time
- Terms summary
- Internal notes
- Customer-facing notes
- Status
- Version number

### Quote statuses

- `draft`
- `sent`
- `viewed`
- `accepted`
- `declined`
- `expired`
- `superseded`
- `converted`

### Quote requirements

- Keep every revision.
- Never silently modify a sent quote.
- A change to price, vehicle, dates, or terms after sending creates a new version.
- An accepted quote may create a reservation draft.
- The reservation stores a price snapshot and must not depend on current vehicle pricing.

---

## 6.4 Customer Relationship Management

### Customer profile

- Legal first, middle, and last name
- Preferred name
- Email
- Mobile phone
- Alternate phone
- Billing address
- Primary residential address
- Preferred contact method
- Preferred vehicle category
- Preferred delivery location
- Customer tier
- Referral source
- Referral partner
- Internal approval status
- Customer-facing notes
- Internal service notes
- Internal risk notes with restricted access
- Tags
- Created date
- Last rental date
- Lifetime rental revenue

### Customer statuses

- `prospect`
- `pending_review`
- `approved`
- `vip`
- `restricted`
- `do_not_rent`
- `inactive`

### Customer activity timeline

Show a unified, chronological timeline of:

- Leads
- Quotes
- Reservations
- Payments
- Documents
- Messages
- Calls or staff notes
- Tasks
- Approvals
- Incidents
- Status changes

Every timeline item must identify who created it and when.

### Authorized drivers

A customer may have one or more drivers.

Driver fields:

- Legal name
- Date of birth
- Relationship to customer
- Mobile phone
- Email
- License jurisdiction
- License number, encrypted or tokenized where appropriate
- License expiration date
- License document file reference
- Insurance status
- Identity verification status
- Driver approval status
- Review notes
- Approved by
- Approval date

Driver approval statuses:

- `not_started`
- `documents_requested`
- `under_review`
- `approved`
- `rejected`
- `expired`
- `suspended`

The system must record the result of a review without exposing sensitive details to unauthorized users.

---

## 6.5 Fleet Management

### Vehicle profile fields

- Internal unit number
- Public display name
- Year
- Make
- Model
- Trim
- VIN
- License plate
- Registration jurisdiction
- Exterior color
- Interior color
- Vehicle category
- Transmission
- Fuel type
- Seating capacity
- Current mileage
- Current fuel or charge percentage
- Current location
- Ownership status
- Acquisition date
- Acquisition cost
- Current estimated value
- Insurance policy reference
- Registration expiration
- Insurance expiration
- Inspection expiration
- Public availability flag
- Active/inactive flag
- Operational status
- Default daily rate
- Default weekend rate
- Default weekly rate
- Included mileage
- Excess-mileage rate
- Default security authorization
- Minimum driver age
- Minimum rental duration
- Preparation buffer before rental
- Turnaround buffer after rental
- Internal notes
- Public description

### Vehicle operational statuses

- `available`
- `soft_hold`
- `reserved`
- `preparation`
- `ready`
- `out_on_rental`
- `return_inspection`
- `cleaning`
- `maintenance`
- `incident_hold`
- `administrative_hold`
- `inactive`

### Important modeling rule

Do not rely on the current vehicle status alone to determine whether a date range is available. Availability must be calculated using:

- Active reservation allocations
- Temporary holds
- Preparation buffers
- Turnaround buffers
- Maintenance blocks
- Incident blocks
- Administrative blocks

### Vehicle media

- Public gallery images
- Internal reference images
- Damage reference images
- Registration documents
- Insurance documents
- Purchase documents
- Service documents

Use separate storage paths and access policies for public and private media.

### Fleet metrics

Calculate:

- Utilization percentage
- Revenue per available day
- Rental revenue
- Number of rental days
- Maintenance cost
- Cleaning cost
- Incident cost
- Downtime
- Average daily rate
- Average rental duration
- Estimated contribution margin

Financial metrics may be approximate in the MVP but must be based on auditable source records.

---

## 6.6 Reservation Management

### Reservation fields

- Reservation number
- Customer
- Primary driver
- Additional drivers
- Assigned vehicle
- Optional vehicle category
- Quote source
- Rental start date/time
- Rental end date/time
- Pickup/delivery type
- Start location
- End location
- Delivery address
- Flight, hotel, venue, or valet notes
- Rate snapshot
- Included mileage
- Excess-mileage rate
- Starting mileage
- Ending mileage
- Security authorization amount
- Deposit amount
- Estimated total
- Final total
- Assigned concierge
- Assigned delivery driver
- Reservation status
- Approval status
- Cancellation reason
- Internal notes
- Customer-facing instructions

### Reservation lifecycle statuses

Use a strict, validated state machine.

- `draft`
- `pending_customer`
- `pending_review`
- `tentative_hold`
- `approved`
- `confirmed`
- `preparation`
- `ready_for_departure`
- `active`
- `return_pending`
- `returned`
- `closeout_review`
- `completed`
- `cancelled`
- `no_show`

### Allowed transition examples

- `draft` to `pending_customer`
- `pending_customer` to `pending_review`
- `pending_review` to `tentative_hold`
- `tentative_hold` to `approved`
- `approved` to `confirmed`
- `confirmed` to `preparation`
- `preparation` to `ready_for_departure`
- `ready_for_departure` to `active`
- `active` to `return_pending`
- `return_pending` to `returned`
- `returned` to `closeout_review`
- `closeout_review` to `completed`

Permit cancellation from appropriate pre-completion states. Require a reason.

### Transition guard examples

A reservation cannot move to `confirmed` unless:

- A customer exists.
- A vehicle is assigned.
- The assigned vehicle has no conflicting allocation.
- Required drivers are approved or an authorized override is recorded.
- Required agreement status is complete or an authorized override is recorded.
- Required payment status is complete or an authorized override is recorded.
- An authorized staff user performs the transition.

A reservation cannot move to `active` unless:

- Departure inspection is complete.
- Starting mileage is recorded.
- Fuel or charge level is recorded.
- Customer handoff is acknowledged.
- Vehicle is not blocked by maintenance or incident status.

A reservation cannot move to `completed` unless:

- Return inspection is complete.
- Ending mileage is recorded.
- Final charges are calculated.
- Open incident handling is resolved or explicitly separated from rental closeout.
- Vehicle disposition is recorded.

### Temporary holds

A hold must include:

- Vehicle
- Start and end
- Hold expiration
- Reason
- Source quote or lead
- Created by
- Released date and reason

Expired holds should release automatically through a scheduled job.

### Extensions

An extension request must:

1. Check vehicle availability for the proposed period.
2. Recalculate price.
3. Verify payment and authorization requirements.
4. Create a reservation change record.
5. Require staff approval unless policy later permits automatic approval.

Never overwrite the original end date without preserving the change history.

---

## 6.7 Availability and Calendar

### Calendar views

- Day agenda
- Week agenda
- Month calendar
- Vehicle timeline
- Delivery and pickup schedule
- Maintenance timeline

### Calendar event types

- Tentative hold
- Confirmed reservation
- Preparation buffer
- Turnaround buffer
- Delivery
- Pickup
- Cleaning
- Maintenance
- Incident hold
- Administrative hold

### Availability API

Create a server-side availability function that accepts:

- Requested start
- Requested end
- Vehicle ID or vehicle category
- Optional reservation ID to exclude during edits

Return:

- Available vehicles
- Conflicting reservations or blocks
- Preparation and turnaround conflicts
- Earliest next availability
- Human-readable conflict reason

### Double-booking prevention

Implement database-level protection wherever practical.

Recommended approach:

- Store all vehicle allocations in a unified `vehicle_allocations` table.
- Use a PostgreSQL range field for the effective blocked period.
- Use an exclusion constraint to prevent overlapping active allocations for the same vehicle.
- Maintain allocation status so cancelled or released records no longer block availability.
- Treat reservation buffers as part of the effective blocked range.

The user interface warning is supplementary. The database must remain the final gatekeeper.

---

## 6.8 Operations and Task Management

### Task fields

- Title
- Description
- Task type
- Related customer
- Related reservation
- Related vehicle
- Related maintenance work order
- Assigned user
- Assigned partner
- Due date/time
- Priority
- Status
- Checklist
- Completion notes
- Created by
- Completed by
- Completed date

### Task types

- Customer follow-up
- Document review
- Vehicle preparation
- Cleaning/detailing
- Delivery
- Pickup
- Inspection
- Fuel/charging
- Maintenance
- Payment follow-up
- Agreement follow-up
- Incident follow-up
- General

### Task statuses

- `open`
- `in_progress`
- `blocked`
- `completed`
- `cancelled`

### Automatic tasks

Create tasks from configurable workflow triggers.

Examples:

- Reservation created: request customer documents.
- Reservation confirmed: create preparation task.
- Delivery selected: create delivery assignment task.
- Return due within 24 hours: create return reminder task.
- Return completed: create cleaning and final review tasks.
- Vehicle mileage crosses service threshold: create maintenance task.
- Driver document expires within 30 days: create review task.

Avoid hard-coding all timing values. Store operational settings in configuration tables.

---

## 6.9 Vehicle Inspections

Inspections must work well on a mobile browser.

### Inspection types

- Pre-rental
- Delivery handoff
- Return
- Maintenance intake
- Maintenance completion
- Incident inspection
- Periodic fleet inspection

### Inspection fields

- Inspection type
- Reservation
- Vehicle
- Inspector
- Date/time
- Location
- Mileage
- Fuel or charge level
- Warning lights
- Tire status
- Windshield status
- Interior status
- Exterior status
- Key count
- Accessories present
- Notes
- Customer acknowledgment
- Staff acknowledgment
- Completion status

### Guided image capture

Support configurable photo slots:

- Front
- Rear
- Driver side
- Passenger side
- Front-left wheel
- Front-right wheel
- Rear-left wheel
- Rear-right wheel
- Windshield
- Dashboard and mileage
- Front interior
- Rear interior
- Fuel or charge indicator
- Keys and accessories
- Additional damage photos

### Damage observations

Each observation should include:

- Vehicle area
- Damage type
- Severity
- Existing or new
- Description
- Images
- Related prior observation, when applicable
- Requires review flag
- Estimated cost, optional
- Resolution status

### Return comparison

On the return inspection, allow the user to view the latest completed pre-rental inspection and its images beside current observations.

Do not claim automated damage matching in the MVP.

### Offline behavior

The PWA should tolerate a temporary connection loss during an inspection.

Minimum requirement:

- Preserve form progress locally.
- Queue metadata until reconnection.
- Clearly indicate unsynced data.
- Do not mark the inspection complete until required uploads and records are confirmed by the server.

Full offline media upload may be deferred if necessary, but the interface must not silently lose work.

---

## 6.10 Documents and Approvals

### Document types

- Driver’s license
- Proof of insurance
- Rental agreement
- Delivery acknowledgment
- Return acknowledgment
- Registration
- Vehicle insurance
- Maintenance estimate
- Maintenance invoice
- Damage estimate
- Incident report
- Payment receipt
- General attachment

### Document metadata

- Document type
- Related customer
- Related driver
- Related reservation
- Related vehicle
- File path
- Original filename
- MIME type
- File size
- Uploading user
- Uploaded date
- Expiration date
- Review status
- Reviewed by
- Reviewed date
- Rejection reason
- Visibility classification

### Review statuses

- `uploaded`
- `under_review`
- `approved`
- `rejected`
- `expired`
- `superseded`

### Visibility classifications

- `public_asset`
- `customer_private`
- `operations_private`
- `finance_private`
- `risk_restricted`

Use private Supabase Storage buckets for sensitive documents and signed URLs for authorized retrieval.

### Approval overrides

Authorized users may override a missing or rejected requirement only if they provide:

- Override reason
- Scope
- Expiration, if applicable
- Approving user
- Approval date/time

Show overrides prominently. Do not treat them as hidden notes.

---

## 6.11 Payment and Charge Records

The application must maintain its own financial ledger of rental-related transactions, even when a payment provider processes the card.

### Transaction types

- Deposit
- Rental payment
- Security authorization
- Authorization release
- Additional charge
- Mileage charge
- Fuel or charging charge
- Cleaning charge
- Damage charge
- Late fee
- Refund
- Chargeback
- Manual adjustment

### Transaction fields

- Reservation
- Customer
- Transaction type
- Amount
- Currency
- Status
- Provider
- Provider reference
- Payment method summary
- Authorization expiration
- Initiated by
- Initiated date
- Settled date
- Failure reason
- Notes

### Transaction statuses

- `draft`
- `pending`
- `authorized`
- `captured`
- `partially_captured`
- `released`
- `failed`
- `refunded`
- `partially_refunded`
- `disputed`
- `cancelled`

### MVP payment approach

- Build a payment-provider adapter interface.
- Support a `manual` provider for initial testing and offline transactions.
- Add Stripe in test mode behind the adapter.
- Never store raw card numbers or CVC values.
- Use provider webhooks as the authoritative source for asynchronous status updates.
- Make webhook handling idempotent.
- Store webhook receipt and processing records.

### Security authorization note

Treat the security authorization separately from rental payment. The user interface must show its amount, status, expected expiration, and any captured amount.

---

## 6.12 Agreements and E-Signature

### Agreement record

- Reservation
- Template version
- Generated document file
- Signature provider
- Provider envelope or request ID
- Sent date
- Viewed date
- Signed date
- Status
- Signed file path
- Audit certificate file path

### Agreement statuses

- `not_generated`
- `draft`
- `sent`
- `viewed`
- `signed`
- `declined`
- `expired`
- `voided`

### MVP approach

- Create a provider-neutral agreement adapter.
- Support an internal placeholder workflow for development.
- Generate a reviewable HTML or PDF representation from reservation data.
- Keep the exact template version and data snapshot used to create the agreement.
- Do not regenerate and replace a signed agreement.

---

## 6.13 Communications

### Communication channels

- Email
- SMS
- Phone-call note
- Internal note
- Customer portal message

### Message record

- Customer
- Reservation
- Direction
- Channel
- Subject
- Body
- Sender
- Recipient
- Provider reference
- Delivery status
- Sent date
- Delivered date
- Failed date
- Error reason
- Visibility

### Automated message triggers

- Inquiry acknowledgment
- Quote sent
- Quote expiration reminder
- Document request
- Agreement request
- Payment request
- Reservation confirmation
- Delivery reminder
- Driver en route
- Return reminder
- Extension response
- Rental receipt
- Review request

### MVP approach

- Implement message templates and a message outbox.
- Support in-app previews.
- Use adapter interfaces for email and SMS.
- Make sending asynchronous and retryable.
- Prevent duplicate sends through idempotency keys.
- Record every send attempt.

---

## 6.14 Delivery and Pickup Dispatch

### Assignment fields

- Reservation
- Assignment type
- Scheduled date/time
- Vehicle
- Customer
- Address
- Location notes
- Flight or hotel information
- Assigned driver
- Backup driver
- Status
- Departure time
- Arrival time
- Completion time
- Proof images
- Customer acknowledgment
- Driver notes

### Assignment statuses

- `unassigned`
- `assigned`
- `accepted`
- `preparing`
- `en_route`
- `arrived`
- `handoff_in_progress`
- `completed`
- `failed`
- `cancelled`

### Dispatch view

Display assignments by date and time with:

- Readiness warnings
- Driver assignment
- Vehicle status
- Customer status
- Address
- Contact controls
- Completion progress

A map integration is optional for the first release. Store latitude and longitude fields so mapping can be added later.

---

## 6.15 Maintenance

### Maintenance work order fields

- Work order number
- Vehicle
- Work type
- Description
- Reported issue
- Odometer
- Vendor
- Scheduled date
- Start date
- Estimated completion date
- Completed date
- Status
- Estimate amount
- Approved amount
- Final amount
- Invoice document
- Warranty status
- Notes
- Blocks availability flag

### Work-order statuses

- `reported`
- `triage`
- `scheduled`
- `awaiting_estimate`
- `awaiting_approval`
- `approved`
- `in_service`
- `quality_check`
- `completed`
- `cancelled`

### Maintenance rules

- A blocking work order creates or updates a vehicle allocation block.
- A maintenance partner sees only assigned work orders.
- Cost approval requires a user with the appropriate permission.
- Completion should record mileage and upload supporting documents.
- A vehicle may require an internal quality check before returning to `available`.

### Preventive maintenance schedules

Support rules based on:

- Mileage
- Date interval
- Vehicle-specific target date
- Registration expiration
- Insurance expiration
- Inspection expiration

---

## 6.16 Incidents and Claims

### Incident fields

- Incident number
- Reservation
- Vehicle
- Customer
- Driver
- Incident type
- Date/time
- Location
- Description
- Police report number
- Injury reported flag
- Vehicle operable flag
- Photos and documents
- Internal owner
- Claim number
- Claim status
- Estimated cost
- Final cost
- Resolution notes

### Incident types

- Collision
- Cosmetic damage
- Mechanical issue
- Tire or wheel damage
- Windshield damage
- Theft
- Towing
- Late or non-return
- Customer complaint
- Other

### Incident statuses

- `reported`
- `under_review`
- `claim_opened`
- `repair_in_progress`
- `awaiting_payment`
- `resolved`
- `closed`

An incident may create a vehicle block and should not be automatically closed when the rental is completed.

---

## 6.17 Reporting

### Required MVP reports

#### Reservation performance

- Reservations by status
- Rental days
- Average rental duration
- Average daily rate
- Cancellation rate
- Extension count

#### Fleet performance

- Utilization by vehicle
- Revenue by vehicle
- Downtime by vehicle
- Maintenance cost by vehicle
- Cleaning cost by vehicle
- Incident count by vehicle

#### Customer and sales

- Leads by source
- Lead-to-quote conversion
- Quote-to-reservation conversion
- Repeat customer rate
- Revenue by referral source
- Revenue by customer tier

#### Operations

- On-time delivery rate
- On-time return rate
- Tasks completed on time
- Reservations with readiness exceptions
- Average turnaround time

#### Finance

- Estimated rental revenue
- Captured payments
- Outstanding balances
- Refunds
- Additional charges
- Security authorizations requiring attention

### Report behavior

- Filter by date range.
- Filter by vehicle, customer, source, and status where appropriate.
- Export filtered results to CSV.
- Display definitions for calculated metrics.
- Use the company timezone for date boundaries.

---

## 7. Customer Portal

The customer portal is controlled and invitation-based in the MVP.

### Customer capabilities

- View reservation summary.
- Review required next steps.
- Manage contact and address information.
- Add an authorized driver.
- Upload requested documents.
- View document review status.
- Review price summary.
- Complete payment actions through the payment provider.
- Review and sign the agreement through the signature provider.
- View delivery or pickup details.
- Send and receive reservation messages.
- Request an extension.
- View receipts and completed reservation history.

### Customer limitations

- Customers cannot mark themselves approved.
- Customers cannot change confirmed vehicle assignments.
- Customers cannot change confirmed dates without submitting a request.
- Customers cannot view internal notes, risk notes, audit logs, partner records, or internal task assignments.
- Customers cannot see other customers or drivers.

### Portal overview screen

Display a step-based readiness experience:

1. Reservation requested
2. Driver information
3. Documents
4. Agreement
5. Payment
6. Confirmation
7. Delivery or pickup

Show clear action labels and avoid exposing internal system terminology.

---

## 8. Core Data Model

Use PostgreSQL through Supabase. Use UUID primary keys unless the existing repository has a different established convention.

### Organization and access

- `organizations`
- `locations`
- `profiles`
- `roles`
- `permissions`
- `profile_roles`
- `partner_organizations`
- `partner_users`

### Sales and customers

- `leads`
- `lead_activities`
- `lead_sources`
- `customers`
- `customer_tags`
- `drivers`
- `driver_reviews`
- `quotes`
- `quote_versions`
- `quote_line_items`

### Fleet

- `vehicles`
- `vehicle_categories`
- `vehicle_locations`
- `vehicle_media`
- `vehicle_status_history`
- `vehicle_allocations`
- `vehicle_rate_rules`
- `vehicle_expiration_records`

### Reservations

- `reservations`
- `reservation_drivers`
- `reservation_line_items`
- `reservation_status_history`
- `reservation_changes`
- `reservation_requirements`
- `reservation_overrides`
- `temporary_holds`

### Operations

- `tasks`
- `task_checklist_items`
- `dispatch_assignments`
- `inspections`
- `inspection_photo_slots`
- `inspection_media`
- `damage_observations`

### Documents and communications

- `documents`
- `document_reviews`
- `agreements`
- `messages`
- `message_templates`
- `message_delivery_attempts`

### Finance

- `transactions`
- `transaction_adjustments`
- `invoices`
- `invoice_line_items`
- `provider_webhook_events`

### Maintenance and incidents

- `maintenance_work_orders`
- `maintenance_events`
- `maintenance_schedules`
- `vendors`
- `incidents`
- `incident_updates`

### Platform support

- `audit_events`
- `app_settings`
- `notification_preferences`
- `background_jobs`
- `integration_connections`

### General schema conventions

Every major business table should include:

- `id`
- `organization_id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

Use soft deletion selectively. Do not soft-delete immutable financial, signed agreement, status history, or audit records. Use archival or void statuses instead.

### Human-readable numbers

Generate separate human-readable identifiers:

- Reservations: `PP-R-YYYY-#####`
- Quotes: `PP-Q-YYYY-#####`
- Incidents: `PP-I-YYYY-#####`
- Maintenance work orders: `PP-M-YYYY-#####`

Generate these server-side and enforce uniqueness.

---

## 9. Audit Logging

### Actions that must be audited

- Authentication and role changes
- Customer approval changes
- Driver approval changes
- Restricted-note access where feasible
- Reservation status transitions
- Vehicle assignment changes
- Date changes
- Rate and discount changes
- Approval overrides
- Payment and refund actions
- Agreement actions
- Document review decisions
- Inspection completion and reopening
- Damage observation changes
- Maintenance cost approvals
- Incident status changes
- Settings changes
- Data exports

### Audit-event fields

- Organization
- Actor
- Actor role
- Action
- Entity type
- Entity ID
- Timestamp
- Before data, sanitized
- After data, sanitized
- Request or correlation ID
- IP address, when available and appropriate
- User agent, when available and appropriate

Never place raw card data, document binary content, secrets, or highly sensitive identity values in audit JSON.

---

## 10. Business Rules

### Timezone

- Store timestamps in UTC.
- Display business dates and times in `America/Chicago` by default.
- Preserve a timezone on reservations and assignments so future destination rentals can be handled correctly.

### Money

- Store amounts in integer cents.
- Store currency code with financial records.
- Do not use floating-point values for money.

### Mileage

- Store mileage as a non-negative integer.
- Ending mileage cannot be lower than starting mileage without an authorized correction.
- Preserve corrections in an audit history.

### Customer approval

- A customer and each required driver have independent statuses.
- Customer approval does not automatically approve every driver.
- An expired required document may invalidate readiness without deleting the prior approval history.

### Vehicle assignment

- A reservation may be created by vehicle category before a specific vehicle is assigned.
- A reservation cannot be confirmed without an assigned vehicle in the MVP.
- Reassignment must check availability and create a change-history record.

### Pricing

- Preserve a reservation pricing snapshot.
- Discounts require a reason.
- Configurable discount thresholds may require owner approval.
- Final closeout may add mileage, fuel, cleaning, late, damage, or manual adjustment items.

### Cancellation

- Preserve the reservation.
- Require a cancellation reason.
- Release future vehicle allocations.
- Keep financial records and refunds separate from reservation status.

### Record immutability

- Do not edit historical status rows.
- Do not overwrite sent quote versions.
- Do not replace signed agreements.
- Do not delete settled transactions.
- Correct errors through explicit adjustment or superseding records.

---

## 11. Technical Architecture

### Existing platform assumptions

- The repository is already connected to Netlify and Supabase.
- Codex must inspect the repository before selecting versions, folder conventions, UI libraries, or package changes.
- Reuse the existing application framework and design system where reasonable.
- Do not perform a major framework upgrade as part of the first feature slice unless the current code cannot be safely extended.

### Preferred architecture

- Next.js with TypeScript
- App Router if already present
- Server Components for read-heavy authenticated screens where practical
- Server Actions or protected route handlers for mutations
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Supabase Row Level Security
- Netlify deployment
- Background jobs or scheduled functions for expirations, reminders, and retries

### Application layers

1. **Presentation:** responsive web interface and PWA shell
2. **Application services:** reservation, availability, approval, inspection, payment, messaging, and reporting services
3. **Domain logic:** status transitions, guard conditions, pricing snapshots, readiness calculations
4. **Persistence:** Supabase database and storage
5. **Integration adapters:** payment, signature, email, SMS, identity, accounting

Keep provider-specific code behind interfaces so a vendor can be replaced without rewriting reservation logic.

### Recommended folder concepts

Adapt to the existing repository rather than forcing this exact structure.

```text
src/
  app/
    (auth)/
    (staff)/
    portal/
    api/
  components/
    ui/
    forms/
    tables/
    calendar/
    inspections/
  features/
    auth/
    customers/
    fleet/
    reservations/
    quotes/
    operations/
    inspections/
    maintenance/
    finance/
  lib/
    supabase/
    permissions/
    validation/
    dates/
    money/
    audit/
  server/
    services/
    repositories/
    integrations/
    jobs/
  types/
```

### Validation

- Validate all external input server-side.
- Use shared schemas for forms and server handlers.
- Return structured field errors.
- Do not trust hidden fields, client-calculated prices, client-supplied roles, or client-supplied approval statuses.

### Error handling

- Use user-safe error messages.
- Log technical detail with correlation IDs.
- Distinguish validation errors, authorization errors, state conflicts, provider errors, and unexpected failures.
- Availability conflicts should return a specific conflict response rather than a generic 500 error.

### Idempotency

Use idempotency keys or equivalent protection for:

- Reservation conversion
- Payment creation and capture
- Webhook processing
- Message sending
- Agreement creation
- Automatic task generation
- Scheduled hold expiration

---

## 12. Security and Privacy

### Required controls

- Supabase Row Level Security on all browser-accessible tables.
- Private storage buckets for sensitive documents.
- Signed URLs with short expirations.
- Service-role usage only in secure server environments.
- Role and permission checks on every mutation.
- Multi-factor authentication capability for staff accounts.
- Session timeout appropriate for internal operations.
- Rate limiting on public inquiry, authentication, upload, and customer-message endpoints.
- File size and MIME-type restrictions.
- Malware-scanning integration point for uploaded documents.
- Secrets stored in environment variables.
- Redaction of sensitive values from logs.
- Audit logs for privileged changes.

### Data minimization

- Store only information necessary for the rental workflow.
- Prefer provider verification results and references over retaining unnecessary identity-verification payloads.
- Restrict driver’s license and insurance access to approved roles.
- Do not expose private Supabase object paths directly when a signed URL is appropriate.

### File-upload rules

- Generate server-controlled paths.
- Do not trust the original filename for storage paths.
- Preserve original filename as metadata only.
- Enforce extension and MIME checks.
- Prevent executable uploads.
- Record checksum when practical.

---

## 13. User Experience and Visual Direction

### Brand behavior

The application should feel refined, calm, and operationally precise.

Avoid:

- Generic rental-counter visuals
- Dense enterprise dashboards with dozens of equal-weight widgets
- Loud success colors everywhere
- Sports-car clichés
- Decorative motion that slows operational work

Prefer:

- Strong typography
- Generous spacing
- High-contrast status labels
- Crisp tables
- Vehicle photography used selectively
- A restrained black, warm white, graphite, and metallic accent palette aligned with the Pascucci Prestige brand guide
- Clear separation between warnings, blocked states, pending work, and completed work

### Responsive priorities

#### Desktop

Optimize for:

- Today dashboard
- Calendar
- Reservation workspace
- Fleet comparison
- Reporting

#### Mobile

Optimize for:

- Assigned tasks
- Customer contact
- Inspection capture
- Delivery and pickup status
- Quick issue reporting

### Accessibility

- Meet WCAG 2.1 AA targets where practical.
- Ensure keyboard navigation for core staff screens.
- Do not communicate status by color alone.
- Provide clear labels and error associations.
- Use readable touch targets on mobile inspection screens.

---

## 14. Required Screens for the First Production Release

### Authentication

- Sign in
- Password reset or magic-link flow
- Unauthorized screen

### Today

- Operational timeline
- Attention queue
- Readiness summary

### Leads and quotes

- Lead list
- Lead detail
- New/edit lead
- Quote builder
- Quote preview
- Quote history

### Customers

- Customer list
- Customer profile
- Driver detail
- Document review
- Activity timeline

### Fleet

- Fleet list
- Vehicle detail
- Vehicle availability
- Vehicle status history
- Vehicle financial summary

### Reservations

- Reservation list
- Reservation create/edit
- Reservation workspace
- Reservation pricing
- Reservation requirements
- Reservation change history

### Calendar

- Vehicle timeline
- Week view
- Maintenance blocks

### Operations

- Task board
- Dispatch board
- Assignment detail

### Inspections

- Inspection start
- Guided photo capture
- Damage observation
- Inspection review
- Return comparison

### Maintenance

- Work-order list
- Work-order detail
- Partner update view

### Finance

- Reservation transactions
- Outstanding items
- Transaction detail

### Reports

- Fleet performance
- Sales funnel
- Operational performance

### Settings

- Users and roles
- Locations
- Reservation rules
- Buffers
- Requirement templates
- Message templates
- Vehicle categories
- Lead sources

### Customer portal

- Portal overview
- Reservation detail
- Driver form
- Document upload
- Payment status
- Agreement status
- Messages

---

## 15. Reservation Workspace Layout

The reservation detail page should be the central workspace.

### Header

- Reservation number
- Status
- Customer
- Vehicle
- Rental dates
- Total estimate
- Assigned owner
- Primary action button based on current state

### Readiness strip

- Customer
- Drivers
- Documents
- Agreement
- Payment
- Vehicle
- Delivery/pickup

Each item should show complete, pending, warning, blocked, or overridden.

### Tabs

1. Overview
2. Customer & Drivers
3. Pricing
4. Documents
5. Payments
6. Agreement
7. Operations
8. Inspections
9. Messages
10. Changes & Audit

### Side panel

- Next required action
- Upcoming tasks
- Internal notes
- Contact controls
- State transition controls

---

## 16. API and Service Boundaries

Create explicit services for critical domain behavior.

### Reservation service

- Create reservation
- Assign vehicle
- Update dates
- Calculate readiness
- Validate transition
- Transition status
- Cancel reservation
- Request extension
- Approve extension

### Availability service

- Search availability
- Create allocation
- Release allocation
- Create maintenance block
- Create incident block
- Explain conflict

### Pricing service

- Calculate quote estimate
- Snapshot reservation pricing
- Calculate extension price
- Calculate closeout

### Approval service

- Review driver
- Review document
- Create override
- Expire approval

### Inspection service

- Create inspection
- Save draft
- Add media
- Add observation
- Complete inspection
- Reopen with permission

### Finance service

- Create transaction
- Create authorization
- Capture transaction
- Record refund
- Process provider webhook

### Messaging service

- Render template
- Queue message
- Send message
- Process delivery callback

### Audit service

- Record privileged action
- Query entity history

Avoid placing domain logic directly in React components.

---

## 17. Background Jobs

Implement a reliable background-job mechanism compatible with the current Netlify and Supabase architecture.

### Required scheduled jobs

- Expire temporary holds.
- Mark expired quotes.
- Flag expiring driver and vehicle documents.
- Generate reservation reminder tasks.
- Generate maintenance-due alerts.
- Retry eligible failed messages.
- Reconcile pending provider events.
- Refresh reporting aggregates if materialized views are used.

### Job requirements

- Idempotent execution
- Run history
- Failure reason
- Retry count
- Last attempted date
- Manual retry capability for authorized users

---

## 18. Seed Data

Provide development seed data for:

### Users

- Owner administrator
- Operations manager
- Concierge
- Driver
- Maintenance partner
- Customer

### Vehicles

Create fictional examples representing:

- Maserati MC20
- Lamborghini Urus
- Mercedes-Benz G 63
- Ferrari 296

Mark all VINs, plates, pricing, and insurance values as fictional.

### Customers and leads

- New inquiry
- Approved repeat customer
- Customer missing documents
- Restricted customer

### Reservations

- Tentative hold
- Confirmed upcoming rental
- Vehicle in preparation
- Active rental
- Return due today
- Completed rental
- Cancelled rental

### Operations

- Delivery task
- Pickup task
- Cleaning task
- Blocking maintenance work order
- Return inspection with one damage observation

Seed data must be clearly isolated from production data.

---

## 19. Testing Requirements

### Unit tests

Prioritize:

- Reservation transition guards
- Availability overlap logic
- Buffer calculations
- Pricing calculations
- Readiness calculation
- Permission helpers
- Transaction status handling

### Integration tests

- Create customer to confirmed reservation workflow
- Database rejection of double booking
- Reservation cancellation releases allocation
- Maintenance block prevents booking
- Customer cannot read another customer’s record
- Driver sees only assigned dispatch work
- Document review changes readiness
- Inspection completion changes operational state
- Webhook processing is idempotent

### End-to-end tests

At minimum:

1. Staff creates a lead and quote.
2. Quote converts to a reservation.
3. Customer uploads a document.
4. Staff approves the document and driver.
5. Staff confirms the reservation.
6. Driver completes departure inspection.
7. Reservation becomes active.
8. Driver completes return inspection.
9. Staff records final charge and completes closeout.

### Security tests

- RLS tests for every role.
- Direct API attempts to update protected statuses.
- Unauthorized private-file access.
- Customer attempts to change price or approval data.
- Partner attempts to access unassigned work orders.

---

## 20. Acceptance Criteria by Epic

## Epic A: Authentication and authorization

- Staff can sign in securely.
- Navigation reflects permissions.
- Server mutations reject unauthorized roles.
- RLS policies prevent cross-role and cross-customer access.
- Admin can invite, deactivate, and assign roles to users.

## Epic B: Fleet

- Staff can create and update vehicles.
- Vehicle detail shows status, bookings, blocks, documents, maintenance, and metrics.
- Status changes are recorded.
- Private and public media use separate access rules.

## Epic C: Customers and drivers

- Staff can create and search customers.
- A customer can have multiple drivers.
- Driver review status and documents are tracked.
- Restricted notes are permission-controlled.
- Customer activity timeline is complete and chronological.

## Epic D: Reservations and availability

- Staff can create a reservation and assign an available vehicle.
- Conflicting vehicle allocations are rejected by the database.
- Buffers affect availability.
- Status transitions obey guard rules.
- Cancellation releases future allocation.
- Changes are historically recorded.

## Epic E: Operations

- Today dashboard shows departures, returns, assignments, and attention items.
- Tasks can be assigned and completed.
- Dispatch assignments have a clear status flow.
- Readiness warnings identify specific missing requirements.

## Epic F: Inspections

- A driver can complete a guided inspection on mobile.
- Required fields and photo slots are validated.
- Draft progress is preserved.
- Return inspection can reference the pre-rental inspection.
- New damage observations can be created and reviewed.

## Epic G: Maintenance

- Staff can create blocking work orders.
- Blocking work orders prevent availability.
- Maintenance partners can update only assigned work.
- Completion can return a vehicle to quality check or available status.

## Epic H: Finance

- Transactions are recorded separately from reservation status.
- Security authorization is visibly separate from rental payment.
- Manual and Stripe test-mode provider paths use the same application interface.
- Webhook processing is idempotent.

## Epic I: Customer portal

- Customer sees only their own records.
- Customer can upload requested documents.
- Customer can see readiness tasks and statuses.
- Customer can submit an extension request.
- Internal notes and operational controls are never exposed.

## Epic J: Audit and reporting

- Privileged actions create audit events.
- Staff can review reservation history.
- Required reports support date filtering and CSV export.

---

## 21. Definition of Done

A feature is not complete until:

- The database migration is included.
- RLS policies are included and tested.
- Server-side validation is included.
- Loading, empty, error, and success states are handled.
- Mobile behavior is verified where applicable.
- Audit events are included for privileged changes.
- Tests cover critical domain behavior.
- Seed data or fixtures support local verification.
- Environment variables are documented.
- No secrets or service-role keys are committed.
- The feature deploys successfully to the Netlify preview environment.
- The README or `/docs` directory is updated.

---

## 22. Implementation Phases

## Phase 0: Repository assessment

Codex must first:

1. Inspect the current repository.
2. Identify the framework, versions, package manager, routes, UI library, Supabase setup, environment conventions, and deployment configuration.
3. Run the current test, lint, type-check, and build commands.
4. Document existing issues separately from new work.
5. Propose the smallest compatible architecture changes.

Deliverable:

- `docs/prestigeos-repository-assessment.md`

## Phase 1: Platform foundation

- Authentication
- Profiles
- Roles and permissions
- Organization and locations
- Staff layout and navigation
- Audit-event foundation
- Shared validation and error handling

## Phase 2: Customers and fleet

- Customer records
- Driver records
- Vehicle records
- Storage buckets and document metadata
- Search and filtering

## Phase 3: Reservations and calendar

- Reservation records
- Vehicle allocations
- Availability service
- Double-booking constraint
- Status history
- Calendar and reservation workspace

## Phase 4: Daily operations

- Today dashboard
- Tasks
- Dispatch assignments
- Readiness calculations
- Automatic task triggers

## Phase 5: Inspections and maintenance

- Mobile inspection flow
- Media capture
- Damage observations
- Maintenance work orders
- Vehicle blocks

## Phase 6: Customer portal

- Invitation-based access
- Portal overview
- Driver and document submission
- Reservation messages
- Extension requests

## Phase 7: Integrations and reporting

- Payment adapter and Stripe test mode
- Agreement adapter
- Email and SMS outbox
- CSV reports
- Scheduled jobs

Each phase must be deployable and usable before beginning the next phase.

---

## 23. Codex Working Rules

1. Do not replace the existing repository wholesale.
2. Inspect before modifying.
3. Keep pull requests and commits logically scoped.
4. Prefer migrations over manual dashboard-only database changes.
5. Never weaken RLS to make a screen work.
6. Never expose the Supabase service-role key to the client.
7. Do not trust client-calculated pricing or readiness.
8. Do not use a UI-only check for vehicle availability.
9. Preserve history rather than overwriting important business records.
10. Ask the codebase what conventions exist before adding new ones.
11. Use feature flags or adapters for incomplete external integrations.
12. Include rollback notes for migrations that alter availability or financial logic.
13. Add concise comments only where logic is not self-explanatory.
14. Keep user-facing language aligned with a high-touch concierge experience.
15. Avoid premature microservices. This should remain a well-structured modular application.

---

## 24. Initial Codex Prompt

Copy the following into Codex after adding this product brief to the repository:

```text
You are working in the existing Pascucci Prestige repository.

Read `docs/pascucci-prestige-codex-product-brief.md` in full. Begin with Phase 0 only.

Your first task is to inspect the repository and create `docs/prestigeos-repository-assessment.md` containing:

1. Current framework and version
2. Package manager
3. Directory and routing structure
4. Existing design system or component library
5. Existing Supabase client, server, auth, database, migration, storage, and RLS setup
6. Existing Netlify configuration
7. Current environment variables, listing names only and never secret values
8. Current lint, test, type-check, and build commands
9. Current test coverage and major technical gaps
10. Existing patterns that should be reused
11. Conflicts between the current repository and the product brief
12. A proposed implementation sequence for Phase 1
13. The exact files you expect to add or modify for the first Phase 1 slice

Run the existing install, lint, type-check, test, and build commands where available. Do not perform a framework upgrade. Do not implement product features yet. Do not expose credentials. Do not disable RLS.

After creating the assessment, summarize the findings and recommend the smallest first vertical slice for approval.
```

---

## 25. Suggested First Vertical Slice After Assessment

After Phase 0, the first implementation slice should be:

### “Staff can sign in and see an authorized application shell”

Include:

- Supabase authentication using existing repository conventions
- `profiles`, `roles`, and `profile_roles`
- Initial permission helper
- RLS policies
- Staff navigation
- Today placeholder page
- Users and roles administration for `owner_admin`
- Audit event for role changes
- Seeded development roles
- Unit and RLS tests

Do not begin reservations before authorization is reliable. A glamorous calendar sitting on weak permissions is a velvet rope tied to a folding chair.

---

## 26. Future Roadmap

### Near-term

- Public request-to-reserve forms
- Referral partner portal
- Corporate accounts
- Configurable pricing packages
- QuickBooks synchronization
- Automated customer reminders
- Review requests

### Mid-term

- Hotel and event-partner booking links
- Loyalty and VIP benefits
- Referral commission tracking
- Telematics and odometer synchronization
- GPS-supported dispatch
- Membership products
- Gift certificates

### Long-term

- Dynamic pricing
- Predictive maintenance
- Automated photo-assisted damage comparison
- AI-assisted concierge responses
- Demand forecasting
- Fleet acquisition and disposition recommendations
- Multi-market operations

---

## 27. Technical Reference Notes

The selected platform direction is compatible with current official guidance:

- Netlify supports modern Next.js features through its OpenNext adapter: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- Supabase Auth can be combined with PostgreSQL Row Level Security for authorization: https://supabase.com/docs/guides/auth
- Supabase Storage access can be governed with Row Level Security policies: https://supabase.com/docs/guides/storage/security/access-control
- Supabase warns that browser-accessible tables require appropriate RLS or equivalent controls: https://supabase.com/docs/guides/api/securing-your-api
- Stripe PaymentIntents support payment lifecycles and separate authorization/capture workflows: https://docs.stripe.com/payments/payment-intents
- Twilio Programmable Messaging can support stateful two-way SMS conversations: https://www.twilio.com/docs/messaging/tutorials/how-to-create-sms-conversations

These references are implementation aids, not permission to bypass repository assessment or current vendor requirements.
