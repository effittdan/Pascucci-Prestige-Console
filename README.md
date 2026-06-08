# PrestigeOS Prototype

Visual prototype for the Pascucci Prestige operations platform.

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
- Reservation, fleet, operations, inspections, settings, finance, and reporting placeholders shaped around the future product brief.
- Mock data separated in `src/data/prototypeData.ts` so a real Supabase-backed data layer can replace it later.

## Current State

This is a local visual prototype. Authentication, Supabase, Netlify, real storage, RLS, audit persistence, and payment/signature integrations are intentionally not connected yet.
