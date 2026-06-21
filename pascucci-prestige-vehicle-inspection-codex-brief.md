# Pascucci Prestige
## Vehicle Inspection & Damage Comparison Module
### Codex Project Brief

**Project:** Pascucci Prestige Operations Platform  
**Module:** Vehicle Condition Inspections  
**Priority:** High  
**Initial release:** Guided photographic inspection and manual before/after comparison  
**Future release:** AI-assisted possible-damage detection  

---

## 1. Project Objective

Add a vehicle inspection module to the Pascucci Prestige operations app that allows authorized staff to:

1. Complete a standardized photographic inspection before a vehicle is released.
2. Document pre-existing vehicle damage.
3. Capture a customer acknowledgment of the vehicle’s starting condition.
4. Repeat the inspection when the vehicle is returned.
5. Compare matching before-and-after photographs.
6. Flag, annotate, review, and resolve possible new damage.
7. Generate a permanent vehicle condition report tied to the vehicle, reservation, and customer.
8. Create follow-up maintenance, claim, or damage-review records when necessary.

The system should create a reliable visual history for every vehicle while keeping the workflow fast enough for real-world rental operations.

---

## 2. Product Principles

Build the module around the following principles:

- **Guided, not improvised:** Require consistent photo angles and inspection steps.
- **Mobile first:** Staff will primarily complete inspections on a phone or tablet.
- **Evidence preservation:** Original photographs must remain unchanged.
- **Human-reviewed:** The app may flag possible changes, but staff must make final decisions.
- **Reservation connected:** Every rental inspection must be attached to a vehicle and reservation.
- **Customer transparent:** Customers should be able to review and acknowledge starting-condition documentation.
- **Operationally useful:** Confirmed damage should connect to vehicle holds, maintenance, claims, estimates, and customer communication.
- **Luxury experience:** The interface should feel polished, calm, concierge-oriented, and consistent with the Pascucci Prestige brand.

---

## 3. Existing-App Integration

Implement this feature inside the existing Pascucci Prestige application and follow the project’s current:

- Framework and routing conventions
- Authentication system
- Database patterns
- Component library
- Styling system
- Form validation patterns
- Error handling
- Audit logging
- Deployment process

Do not rebuild existing reservations, customers, users, or vehicles. Extend the current models and relationships.

When an implementation detail is not already established, prefer:

- TypeScript
- Reusable service and repository layers
- Schema validation
- Private object storage
- Row-level or role-based access controls
- Mobile-responsive components
- Progressive Web App compatibility
- Background-safe/resumable image uploads where practical

If the current project uses Supabase, use Supabase Postgres, Auth, Storage, Row Level Security, and server-side functions where appropriate. Otherwise, adapt these requirements to the existing backend.

---

## 4. User Roles and Permissions

### Administrator

Can:

- View all inspections
- Configure required inspection zones
- Reopen or void an inspection
- Review audit logs
- Manage retention settings
- Export inspection packages
- Confirm damage decisions
- Create or close claims and maintenance holds

### Manager

Can:

- Start and complete inspections
- Review before/after comparisons
- Confirm or dismiss possible damage
- Add damage estimates and notes
- Place a vehicle on hold
- Generate reports
- Request customer follow-up

### Operations Staff

Can:

- Start assigned inspections
- Capture required photos
- Record mileage, fuel/charge, cleanliness, and damage
- Submit an inspection for review
- View inspections for assigned reservations

Cannot:

- Delete original photographs
- Remove audit history
- Finalize customer charges unless separately authorized

### Customer

Through a secure, limited-access review link or in-person signature screen, can:

- Review the pre-rental condition report
- Review disclosed pre-existing damage
- Acknowledge the vehicle’s starting condition
- Receive a copy of the signed report

Customer access must not expose internal notes, other reservations, administrative controls, or unrelated vehicle records.

---

## 5. Inspection Types and Statuses

### Inspection Types

- `checkout`
- `return`
- `interim`
- `maintenance`
- `inventory`

The initial user interface should emphasize checkout and return inspections.

### Inspection Statuses

- `draft`
- `in_progress`
- `awaiting_customer_acknowledgment`
- `submitted`
- `under_review`
- `completed`
- `voided`

### Damage Review Statuses

- `not_required`
- `pending`
- `possible_change`
- `confirmed_new_damage`
- `pre_existing`
- `dismissed`
- `resolved`

---

## 6. Primary User Workflows

## 6.1 Checkout Inspection

1. Staff opens a reservation.
2. Staff selects **Begin Checkout Inspection**.
3. The app loads:
   - Vehicle
   - Customer
   - Reservation dates
   - Assigned employee
   - Existing unresolved damage
   - Most recent completed vehicle inspection
4. Staff records:
   - Odometer
   - Fuel percentage or EV charge percentage
   - Exterior cleanliness
   - Interior cleanliness
   - Warning lights
   - Tire or windshield concerns
   - General notes
5. The app guides staff through all required photo zones.
6. Staff marks any visible pre-existing damage.
7. The app validates that required fields and images are complete.
8. Staff submits the inspection.
9. Customer reviews the inspection and acknowledges it.
10. The completed report is locked and attached to the reservation.

The vehicle checkout process should not be marked complete until all required inspection items are satisfied or an authorized manager records an override reason.

## 6.2 Return Inspection

1. Staff opens the active reservation.
2. Staff selects **Begin Return Inspection**.
3. The app loads the checkout inspection and required photo zones.
4. Staff records return mileage, fuel/charge, cleanliness, warning lights, and notes.
5. For each photo zone, the app displays a thumbnail of the corresponding checkout image to help recreate the angle.
6. Staff captures return images.
7. The app presents paired before-and-after images.
8. Staff can:
   - Mark no change
   - Flag possible damage
   - Annotate an area
   - Add written notes
   - Request manager review
9. A manager confirms, dismisses, or reclassifies each flag.
10. The return inspection is completed.
11. If new damage is confirmed, the app may:
   - Place the vehicle on an operational hold
   - Create a maintenance item
   - Create a claim or damage case
   - Add estimate documents
   - Prepare a customer communication
   - Preserve an exportable evidence package

## 6.3 Customer Acknowledgment

Support both:

- In-person acknowledgment on a staff device
- Remote acknowledgment through a secure, expiring link

Capture:

- Customer name
- Signature or typed acknowledgment
- Checkbox confirming review
- Date and time
- IP address for remote acknowledgment when legally appropriate
- User agent
- Acknowledgment language version
- Report version or immutable snapshot identifier

The acknowledgment must be attached to the exact inspection version the customer reviewed.

---

## 7. Required Photo Zones

Create configurable inspection templates. Seed the first template with the following zones.

### Exterior Overview

1. Front straight-on
2. Rear straight-on
3. Driver side
4. Passenger side
5. Front driver-side three-quarter
6. Front passenger-side three-quarter
7. Rear driver-side three-quarter
8. Rear passenger-side three-quarter

### Wheels and Tires

9. Front driver wheel
10. Front passenger wheel
11. Rear driver wheel
12. Rear passenger wheel

### Glass, Lighting, and Body Details

13. Windshield
14. Front fascia and lower splitter
15. Rear fascia and diffuser
16. Driver-side rocker panel
17. Passenger-side rocker panel
18. Roof or convertible-top condition

### Interior

19. Driver cockpit and dashboard
20. Odometer and warning-light display
21. Front seats
22. Rear seats, when applicable
23. Center console
24. Cargo area or trunk
25. Door panels and high-contact interior surfaces

### Additional

26. Fuel gauge or EV charge display
27. Key/fob set
28. Included accessories
29. Existing high-risk damage close-ups
30. Optional freeform photo

Administrators must be able to make zones required, optional, hidden by vehicle type, or vehicle-specific.

---

## 8. Guided Camera Experience

Build a mobile-first camera workflow with:

- Rear camera as the preferred default
- Camera permission handling
- File-upload fallback when direct camera access is unavailable
- Visual framing overlay for each required angle
- Example silhouette or prior photo thumbnail
- Orientation guidance
- Retake option
- Blur/quality warning
- Low-light warning when detectable
- Upload progress
- Offline or interrupted-upload recovery where practical
- Clear completed/remaining counter
- Prevention of accidental inspection completion with missing required images

For paired return photos, show the checkout image as:

- A small reference thumbnail
- Optional semi-transparent overlay
- Optional side-by-side guide

Do not permanently alter the original captured image to add an overlay.

---

## 9. Image Handling Requirements

For each photograph:

1. Preserve the original file in private storage.
2. Generate optimized display derivatives or thumbnails.
3. Store a server-generated capture/upload timestamp.
4. Store the device-provided capture timestamp when available.
5. Store image dimensions, file size, MIME type, and orientation.
6. Store optional GPS coordinates only when permission and company policy allow.
7. Associate the image with:
   - Organization
   - Vehicle
   - Reservation
   - Inspection
   - Photo zone
   - Capturing user
8. Generate a cryptographic hash for the original file.
9. Do not overwrite original files.
10. Treat retakes as separate versions and mark which version is active.
11. Record all image additions, replacements, annotations, and review actions in the audit log.
12. Strip or protect unnecessary personal metadata from customer-facing derivatives.
13. Serve images through authenticated access or expiring signed URLs.

Suggested private storage path:

```text
organizations/{organization_id}/vehicles/{vehicle_id}/inspections/{inspection_id}/{photo_zone_code}/{photo_id}/original.{ext}
```

Suggested derivative paths:

```text
.../{photo_id}/thumb.webp
.../{photo_id}/display.webp
```

---

## 10. Damage Documentation

Staff must be able to add a damage marker to a photo.

Each damage observation should include:

- Damage type
- Severity
- Vehicle area
- Photo annotation coordinates
- Description
- Pre-existing or potentially new
- Detected by staff or future AI
- Review status
- Reviewer
- Review date
- Estimated repair cost, optional
- Claim or maintenance reference, optional
- Customer-visible note
- Internal note

### Damage Types

Seed with:

- Scratch
- Dent
- Paint chip
- Cracked glass
- Wheel rash
- Tire damage
- Light damage
- Trim damage
- Interior stain
- Interior tear
- Burn
- Missing item
- Mechanical warning
- Other

### Severity

- Minor
- Moderate
- Major
- Safety critical

A damage marker should be an overlay stored separately from the original image. Store normalized coordinates so annotations remain positioned correctly at different screen sizes.

---

## 11. Before-and-After Comparison Viewer

Create a comparison workspace that pairs checkout and return images by photo zone.

Required modes:

- Side by side
- Swipe slider
- Toggle/flicker between images
- Synchronized zoom and pan
- Annotation overlay
- Full-screen review

Display:

- Photo zone
- Capture dates
- Odometer at each inspection
- Capturing employee
- Existing damage markers
- Return damage markers
- Review status
- Notes

Actions:

- No change
- Flag possible new damage
- Confirm new damage, manager only
- Mark as pre-existing
- Dismiss flag
- Add annotation
- Request another photo
- Escalate to claim or maintenance workflow

Do not label a visual difference as customer-caused damage unless an authorized human makes that determination.

---

## 12. Inspection Dashboard

Add an inspection dashboard with:

- Inspections awaiting completion
- Customer acknowledgments pending
- Return inspections pending review
- Vehicles with possible new damage
- Vehicles currently on damage or maintenance hold
- Recently completed inspections
- Search and filters

Filters should include:

- Vehicle
- Reservation
- Customer
- Inspection type
- Inspection status
- Damage review status
- Date range
- Assigned employee

---

## 13. Vehicle and Reservation UI Additions

### Vehicle Record

Add a **Condition History** tab showing:

- Chronological inspections
- Current known damage
- Resolved damage
- Maintenance holds
- Claims
- Mileage history
- Fuel/charge records
- Inspection reports

### Reservation Record

Add an **Inspections** section showing:

- Checkout inspection status
- Customer acknowledgment status
- Return inspection status
- Damage review status
- Links to reports
- Required staff actions

### Operations Calendar

Display inspection-related alerts:

- Checkout inspection due
- Customer acknowledgment missing
- Return inspection due
- Damage review blocking future reservation
- Vehicle hold affecting upcoming reservation

---

## 14. Suggested Data Model

Adapt names to existing project conventions.

### `inspection_templates`

- `id`
- `organization_id`
- `name`
- `vehicle_type`
- `is_default`
- `is_active`
- `created_at`
- `updated_at`

### `inspection_template_zones`

- `id`
- `template_id`
- `code`
- `label`
- `description`
- `display_order`
- `is_required`
- `example_asset_url`
- `overlay_asset_url`
- `applicable_vehicle_rules`
- `created_at`
- `updated_at`

### `vehicle_inspections`

- `id`
- `organization_id`
- `vehicle_id`
- `reservation_id`, nullable for non-rental inspections
- `template_id`
- `inspection_type`
- `status`
- `damage_review_status`
- `started_by_user_id`
- `submitted_by_user_id`
- `reviewed_by_user_id`
- `started_at`
- `submitted_at`
- `completed_at`
- `odometer`
- `fuel_percent`
- `charge_percent`
- `exterior_cleanliness`
- `interior_cleanliness`
- `warning_lights_present`
- `general_notes`
- `override_reason`
- `version`
- `locked_at`
- `created_at`
- `updated_at`

### `inspection_photos`

- `id`
- `organization_id`
- `inspection_id`
- `template_zone_id`
- `vehicle_id`
- `reservation_id`
- `captured_by_user_id`
- `storage_path_original`
- `storage_path_display`
- `storage_path_thumbnail`
- `mime_type`
- `width`
- `height`
- `file_size`
- `sha256_hash`
- `device_captured_at`
- `server_received_at`
- `latitude`, nullable
- `longitude`, nullable
- `capture_source`
- `quality_status`
- `version_number`
- `is_active`
- `created_at`

### `damage_observations`

- `id`
- `organization_id`
- `vehicle_id`
- `reservation_id`
- `inspection_id`
- `inspection_photo_id`
- `comparison_photo_id`, nullable
- `damage_type`
- `severity`
- `vehicle_area`
- `description`
- `customer_visible_note`
- `internal_note`
- `source`
- `classification`
- `review_status`
- `reviewed_by_user_id`
- `reviewed_at`
- `annotation_data`
- `estimated_cost`
- `maintenance_record_id`, nullable
- `claim_id`, nullable
- `created_by_user_id`
- `created_at`
- `updated_at`

### `inspection_acknowledgments`

- `id`
- `organization_id`
- `inspection_id`
- `reservation_id`
- `customer_id`
- `acknowledgment_method`
- `acknowledgment_text_version`
- `acknowledged_name`
- `signature_storage_path`, nullable
- `acknowledged_at`
- `ip_address`, nullable
- `user_agent`, nullable
- `inspection_snapshot_hash`
- `created_at`

### `inspection_audit_events`

- `id`
- `organization_id`
- `inspection_id`
- `actor_user_id`, nullable
- `actor_type`
- `event_type`
- `entity_type`
- `entity_id`
- `before_data`
- `after_data`
- `created_at`

### Optional Related Tables

Use or extend existing tables for:

- Vehicle holds
- Maintenance records
- Damage claims
- Repair estimates
- Customer communications
- Documents
- Payments or security-deposit adjustments

---

## 15. Business Rules

1. A checkout inspection must belong to a vehicle and active/upcoming reservation.
2. A return inspection should link to the completed checkout inspection for the same reservation.
3. Required photo zones must be completed before submission.
4. Missing required fields must produce clear validation errors.
5. Submitted inspections cannot be casually edited.
6. Corrections after submission must create a new version or audit event.
7. Original images cannot be deleted through the normal UI.
8. Only authorized managers or administrators can void an inspection.
9. A void action requires a reason.
10. Confirmed safety-critical damage automatically places the vehicle on hold.
11. A vehicle hold must warn staff of affected future reservations.
12. Customers can view only approved customer-facing content.
13. Internal notes and AI confidence data must never appear in customer-facing reports unless explicitly approved.
14. AI output, when added, must never automatically create a customer charge.
15. Inspection completion and rental completion must remain separate actions but visibly connected.

---

## 16. Report Generation

Generate a branded PDF condition report for checkout and return inspections.

The report should include:

- Pascucci Prestige branding
- Report ID
- Vehicle details
- VIN, with optional masking on customer copy
- License plate
- Reservation number
- Customer
- Inspection type
- Inspection dates and times
- Odometer
- Fuel or charge
- Required photo grid
- Existing damage summary
- Possible or confirmed return damage summary
- Customer acknowledgment
- Staff and manager review
- Disclaimer that photographs are part of the condition record
- Report version
- Integrity or audit reference

Create two variants:

1. **Internal report:** Includes internal notes, review history, and operational actions.
2. **Customer report:** Includes only approved customer-facing information.

Reports should be regenerated from immutable inspection data and stored as versioned documents.

---

## 17. Notifications and Operational Actions

Support in-app notifications first. Reuse existing email or SMS infrastructure if already available.

Trigger examples:

- Checkout inspection due soon
- Checkout inspection incomplete
- Customer acknowledgment pending
- Return inspection due
- Possible damage awaiting manager review
- Vehicle placed on hold
- Upcoming reservation conflicts with hold
- Damage review completed
- Customer report ready

Do not add a new communications vendor solely for the MVP unless required by the existing architecture.

---

## 18. Phase 2: AI-Assisted Comparison

Do not make AI damage detection a blocker for the MVP.

Design the data model and service boundaries so a later comparison service can:

1. Receive a checkout and return image pair.
2. Normalize size and orientation.
3. Evaluate whether the images are sufficiently comparable.
4. Identify possible changed regions.
5. Return:
   - Possible damage type
   - Bounding box or segmentation coordinates
   - Confidence score
   - Explanation or evidence summary
   - Comparability score
   - Model and prompt version
6. Create a `possible_change` observation.
7. Require human review before confirmation.

### AI Guardrails

- Use language such as **Possible change detected**.
- Never state that the renter caused damage.
- Never automatically charge a customer.
- Never hide low confidence.
- Allow staff to dismiss false positives.
- Store model version and analysis timestamp.
- Keep AI-created annotations separate from human annotations.
- Do not send unnecessary customer or reservation data to an AI service.
- Provide an organization-level switch to disable AI analysis.
- Support manual comparison when AI analysis fails.

### Training-Data Readiness

The MVP should create future-ready labeled data by recording:

- Matched photo zones
- Human-confirmed changes
- Human-dismissed flags
- Damage categories
- Annotation coordinates
- Image quality
- Lighting and comparability issues

---

## 19. Security and Privacy

Implement:

- Private image storage
- Authenticated or short-lived signed image access
- Role-based access
- Organization-level tenant isolation
- Database row-level security when supported
- Audit logging
- Rate limiting on public acknowledgment links
- Expiring, single-purpose customer tokens
- No public enumeration of inspection IDs
- Secure server-side report generation
- Protection against arbitrary file uploads
- MIME type and file-size validation
- Malware scanning hook if available in the current architecture
- Redaction or blurring workflow for faces, documents, or unrelated license plates when needed
- Configurable data-retention policy
- Legal-hold support for claims or disputes

Do not expose storage service credentials or privileged database keys in client-side code.

---

## 20. Performance and Reliability

The mobile workflow should remain usable on inconsistent cellular connections.

Implement where practical:

- Client-side image resizing for display derivatives
- Original upload preservation
- Upload retry
- Progress indication
- Draft autosave
- Resume incomplete inspection
- Idempotent upload and submission requests
- Duplicate-submit protection
- Thumbnail-first loading
- Lazy loading for full-resolution images
- Pagination or virtualization for long vehicle histories

An interrupted upload must not incorrectly mark a photo zone complete.

---

## 21. Accessibility and UX Requirements

- Large touch targets
- High-contrast status indicators
- Do not rely on color alone
- Clear camera permission instructions
- Clear upload failure recovery
- Keyboard-accessible desktop comparison viewer
- Screen-reader labels for controls
- Descriptive validation messages
- Confirmations for destructive or finalizing actions
- Branded visual language consistent with Pascucci Prestige:
  - Premium
  - Minimal
  - Warm metallic/gold accents
  - Strong photography
  - Calm, concierge-style wording

Suggested progress language:

```text
Exterior inspection: 8 of 12 required photos complete
```

Suggested AI language for the future phase:

```text
Possible visual change detected near the passenger-side rear wheel.
Manager review is required.
```

Avoid accusatory language in all interfaces.

---

## 22. MVP Scope

The first production release must include:

- Inspection templates
- Guided mobile photo checklist
- Checkout inspection
- Return inspection
- Required-zone validation
- Odometer and fuel/charge capture
- Condition notes
- Manual damage annotations
- Customer acknowledgment
- Before/after pairing
- Side-by-side and slider comparison
- Manager review
- Vehicle hold integration
- Vehicle condition history
- Reservation inspection status
- Internal and customer PDF reports
- Private image storage
- Audit trail
- Role-based permissions
- Automated tests for critical workflows

---

## 23. Explicit Non-Goals for the MVP

Do not include unless the existing app already provides the capability:

- Fully automated damage liability decisions
- Automatic customer charges
- Automated insurance claim submission
- Repair-shop bidding marketplace
- Drive-through fixed-camera hardware
- Video-based damage detection
- Native iOS or Android application rewrite
- Facial recognition
- Automatic license-plate recognition
- AI-based repair-cost estimates

---

## 24. Acceptance Criteria

### Checkout Inspection

- Staff can start an inspection from a reservation.
- Vehicle and reservation information populate automatically.
- All configured required fields and photo zones are enforced.
- Photos upload privately and remain associated with the correct zone.
- Staff can annotate pre-existing damage.
- Customer can acknowledge the submitted inspection.
- The completed inspection is locked and appears in the vehicle and reservation history.
- A branded PDF can be generated.

### Return Inspection

- Staff can start a return inspection from the same reservation.
- Checkout reference images appear for each matching zone.
- Return images pair with the correct checkout images.
- Staff can compare images using at least side-by-side and slider views.
- Staff can flag possible new damage.
- A manager can confirm, dismiss, or reclassify each flag.
- Confirmed safety-critical damage places the vehicle on hold.
- The completed return report appears in vehicle history.

### Security

- Unauthorized users cannot access inspection records or images.
- Customer links expose only the intended report.
- Public links expire.
- Privileged keys are never exposed to the browser.
- Original files cannot be overwritten through the standard interface.
- Material changes are present in the audit log.

### Reliability

- A failed image upload produces a visible error and retry option.
- An incomplete upload does not count as a completed photo zone.
- Draft inspections can be resumed.
- Duplicate submissions do not create duplicate inspections.
- Reports reference the correct inspection version.

---

## 25. Testing Requirements

Add:

### Unit Tests

- Inspection completion validation
- Photo-zone requirement rules
- Damage-status transitions
- Permission checks
- Customer-visible content filtering
- Vehicle-hold trigger logic
- Signed-token expiration
- Report data mapping

### Integration Tests

- Create checkout inspection
- Upload and associate images
- Submit inspection
- Record customer acknowledgment
- Create return inspection
- Pair photos
- Flag and review damage
- Place vehicle on hold
- Generate reports

### End-to-End Tests

At minimum:

1. Operations employee completes a checkout inspection.
2. Customer acknowledges the report.
3. Employee completes the return inspection.
4. Manager reviews a possible damage flag.
5. Confirmed damage places the vehicle on hold.
6. Administrator views the full audit history.

Test mobile viewport behavior and camera/file-upload fallback.

---

## 26. Seed and Demo Data

Create seed/demo records for:

- Maserati MC20
- Lamborghini Urus
- Mercedes-Benz G 63
- Ferrari 296

Include:

- One upcoming reservation
- One active rental
- One completed rental with no damage
- One completed rental with a possible wheel-rash review
- Example checkout and return inspection records
- Example unresolved pre-existing damage
- Example vehicle hold

Use placeholder/demo images only. Do not commit copyrighted or customer-identifying photographs without permission.

---

## 27. Implementation Sequence

Implement in this order:

### Milestone 1: Foundation

- Database migrations
- Types and validation schemas
- Storage configuration
- Permissions and policies
- Inspection template seed data
- Service layer

### Milestone 2: Checkout Workflow

- Reservation entry point
- Inspection form
- Guided photo capture
- Draft saving
- Required-zone validation
- Damage annotations
- Submission

### Milestone 3: Customer Acknowledgment and Reports

- Secure review link
- Signature or typed acknowledgment
- Customer report
- Internal report
- Version locking

### Milestone 4: Return and Comparison

- Return workflow
- Checkout photo references
- Paired-image viewer
- Damage review
- Manager decisions
- Vehicle hold

### Milestone 5: Operations Integration

- Dashboard
- Vehicle condition history
- Reservation status
- Calendar alerts
- Notifications
- Claims and maintenance handoff

### Milestone 6: Hardening

- Audit review
- Mobile optimization
- Upload recovery
- Accessibility
- Automated testing
- Security testing
- Documentation

---

## 28. Required Codex Deliverables

Codex should produce:

1. Database migrations
2. Storage bucket and access-policy setup
3. New types and schemas
4. Backend services or API routes
5. Mobile inspection UI
6. Comparison viewer
7. Damage annotation component
8. Customer acknowledgment flow
9. PDF report generation
10. Vehicle and reservation integrations
11. Inspection dashboard
12. Permission and audit implementation
13. Seed data
14. Unit, integration, and end-to-end tests
15. Documentation covering:
    - Setup
    - Environment variables
    - Storage configuration
    - Permissions
    - Report generation
    - Testing
    - Future AI integration points

---

## 29. Codex Working Instructions

Before making changes:

1. Inspect the current repository structure.
2. Identify the existing stack, database, authentication, storage, UI system, and testing tools.
3. Locate the current vehicle, customer, reservation, maintenance, claim, document, and user models.
4. Reuse existing patterns and components.
5. Summarize the planned files, migrations, and architecture before implementing.
6. Do not remove or rename existing functionality unless required and documented.
7. Keep migrations reversible where practical.
8. Add feature flags when introducing incomplete integrations.
9. Use typed interfaces throughout.
10. Avoid placeholder logic in production paths.

During implementation:

- Work milestone by milestone.
- Keep the app in a runnable state.
- Run type checking, linting, and tests after each milestone.
- Fix regressions before proceeding.
- Document assumptions.
- Use realistic empty, loading, offline, permission-denied, and error states.
- Prefer small reusable components over a single oversized inspection component.

At completion, provide:

- Summary of implemented functionality
- Files changed
- Database changes
- Environment variables
- Security policies
- Test results
- Known limitations
- Recommended next milestone
- Instructions for enabling the feature in staging

---

## 30. Definition of Done

The module is complete when a Pascucci Prestige employee can open a reservation on a phone, complete a guided checkout inspection, obtain customer acknowledgment, complete a paired return inspection, manually review possible damage, place the vehicle on hold when appropriate, and generate a defensible condition report without leaving the Pascucci Prestige operations app.
