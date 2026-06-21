# PrestigeOS Command Center

Working local-first operations MVP for the Pascucci Prestige command center.

## Run Locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite.

## What This Prototype Covers

- Branded staff application shell using `design.md`.
- Pascucci Prestige logo asset in the sidebar.
- Role-aware navigation for staff modules.
- Today dashboard with operational timeline, attention queue, readiness, fleet status, and reservation workspace preview.
- Searchable, selectable fleet records with editable rates, status, copy, and new-vehicle intake.
- Customer and lead intake with new-profile creation, staged approval progress, and iPad-ready workflow.
- Reservation creation and controlled lifecycle transitions.
- Assignable operations tasks with working status movement.
- Guided inspection progress with persistent photo-zone completion.
- Browser persistence through `localStorage`, shaped so a Supabase-backed data layer can replace it later.
- Square and payment actions intentionally deferred.

## Current State

This is a functional local-first MVP with invitation-only Supabase authentication, a secured operational schema, and private storage. Module data is still being migrated from browser persistence to shared Supabase records. Server-side availability enforcement, complete audit persistence, and payment/signature integrations are not connected yet.

## Hosted Command Center

- Production PWA: https://pascucci-prestige-console.netlify.app/command
- Supabase Auth is invitation-only.
- Operational tables, private document storage, inspection media storage, and RLS are provisioned.
- The current UI workflows remain local-first while each module is migrated onto the normalized Supabase tables.
- Square and payment actions remain deferred.
