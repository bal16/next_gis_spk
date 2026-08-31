# SPK Prioritas Perawatan Gedung — Fakultas Teknik UNNES (Frontend)

Frontend for **Sistem Pendukung Keputusan (DSS) prioritas perawatan gedung** using **SAW (Simple Additive Weighting)**. Public map + ranking for all users, admin dashboard for weights, buildings, assessments, and SAW runs — built for thesis (`Skripsi`) demo and campus operations.

> Original Next.js template preserved at [`README.nextjs.md`](./README.nextjs.md).

## Stack

- **Next.js 16** (App Router, RSC) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (`@theme inline`, oklch tokens) + **shadcn/ui** `new-york` + **Radix UI**
- **TanStack Query v5** (prefetch + `HydrationBoundary`) + **TanStack Table v8**
- **React Hook Form + Zod** (`@hookform/resolvers`) + **Zustand** + **Axios**
- **MapLibre GL** (`maplibre-gl` + `react-map-gl`) + **Recharts** + **motion** + **sonner** + **next-themes**
- Package manager: **Bun** (`bun.lock`)

## Features

**Public (`/`):**

- Fullscreen MapLibre map with building markers by priority (Tinggi/Sedang/Rendah/Belum Dihitung), popup detail, sidebar ranking + filters, mobile drawer.

**Admin (`/admin`, guarded by `spk.access-token` + `GET /auth/me` gate):**

- **Overview** (`/admin`) — last SAW run snapshot: avg score, `WeightsPieChart` (inner/outer pie), `MapView` priority spread, ranking `AdminDataTable`.
- **Buildings** (`/admin/buildings`) — CRUD (`BuildingDialog` add/edit) + `AdminDataTable` with filter on `name`, priority tooltips, link to assessments.
- **Assessments** (`/admin/buildings/[code]/assessments`) — per-building assessment history, `CreateDialog` with `ToggleGroup` 0–3 + `FieldSet`, date `lastMaintenance`.
- **Weights** (`/admin/weights`) — `WeightsUpdateSection` full-page form: dynamic `z.record` keys, `Controller` + `Field`/`FieldError`/`FieldSet`, `allSubsValid` gate (main + sub totals = 100%), fixed footer, optimistic `useUpdateWeights`.
- **DSS Runs** (`/admin/dss`) — history `AdminDataTable` + `Run SAW Calculation` (`AlertDialog`), **DSS Detail** (`/admin/dss/[runId]`) — same overview + per-run table.
- **Auth** (`/auth`) — `LoginForm` / `RegisterForm` tabs with `Controller` + `FieldGroup`, server actions `loginAction`/`registrationAction`.

## Project Structure

```tree
app/
  (main)/page.tsx            → public map (re-exports features/home)
  (main)/admin/{page,layout} → admin shell (SidebarProvider + SidebarInset)
  (auth)/auth/page.tsx       → login/register
  api/auth/me/route.ts       → proxy to backend GET /auth/me
  globals.css                → @theme inline + oklch + maplibre overrides
components/
  ui/*                       → shadcn primitives (button, card, table, field, dialog, sidebar…)
  admin/AdminDataTable.tsx   → deep shared table (sorting/filter/pagination/empty/skeleton)
  UserNav.tsx, ModeToggle.tsx
features/
  home/                      → MapSection, Sidebar, RankingTable, BuildingPopup
  dashboard/                 → layout + MainContent + sidebar/header/WeightsPieChart
  buildings/                 → type (Zod), api/*, hooks/useBuildings, components/*
  assessments/               → type, api, hooks, CreateDialog
  weights/                   → type, api/get-weights|update-weights, hooks
  dss/                       → api/*, hooks/useDSS, components/TableSection|column
  auth/                      → schemas, api, actions, LoginForm/RegisterForm
  map/                       → MapView + useMap store
lib/
  api/server.ts              → backendClient (axios, httpOnly cookies)
  queryKeys.ts               → canonical keys: dss.latest / dss.details(id) etc.
  config.ts, utils.ts
docs/reports/
  admin-dashboard-audit--2026-08-31.md → living audit (Design/Logic/UX/Forms/Implementation, P0–P2, 669 lines) — gitignored per .gitignore
OpenApi.yaml                 → backend contract (NestJS)
```

## Getting Started

```bash
# 1. Clone & install (Bun)
bun install

# 2. Env — copy and fill
cp .env.example .env.local   # or create .env.local manually
# required:
# NEST_API_URL=http://localhost:3001
# NEXT_PUBLIC_NEST_API_URL=http://localhost:3001
# JWT_SECRET=...

# 3. Run backend (NestJS) on :3001 first, then:
bun run dev        # http://localhost:3000
bun run build      # production build (10–11s)
bun run start
bun run lint
```

## Env

| Var                        | Where  | Notes                                                 |
| -------------------------- | ------ | ----------------------------------------------------- |
| `NEST_API_URL`             | server | backend base URL (server actions via `backendClient`) |
| `NEXT_PUBLIC_NEST_API_URL` | client | same, exposed to browser for `publicClient` if used   |
| `JWT_SECRET`               | server | cookie signing (see `lib/api/server.ts`)              |

`spk.access-token` / `spk.refresh-token` / `spk.session` are `httpOnly` cookies set by `loginAction` after `POST /auth/login`.

## Routes & Access

| Route                                 | Access         | Notes                                                 |
| ------------------------------------- | -------------- | ----------------------------------------------------- |
| `/`                                   | public         | map + ranking, `UserNav adminLink` if `isAdmin`       |
| `/auth`                               | public         | tabs; login redirects `?reason=unauthorized` handling |
| `/admin`                              | `isAdmin` only | `layout.tsx` live `GET /auth/me` gate, fail-closed    |
| `/admin/buildings`                    | `isAdmin`      | filter `name`, pagination 10                          |
| `/admin/buildings/[code]/assessments` | `isAdmin`      | toggle 0–3, FieldSet grouping                         |
| `/admin/weights`                      | `isAdmin`      | sub-weights persisted, `allSubsValid` gate            |
| `/admin/dss`, `/admin/dss/[runId]`    | `isAdmin`      | run + delete (AlertDialog)                            |

## Conventions

- **shadcn:** `FieldGroup + Field + FieldLabel + FieldError` with `data-invalid`/`aria-invalid`; `FieldSet`/`FieldLegend` for groups; `AlertDialog` for destructive; `Empty` for empty; `Skeleton` for loading; `Breadcrumb` for header; icons via `data-icon="inline-start"` no manual `size-4`.
- **Tables:** single `AdminDataTable<T>` — no per-feature `data-table.tsx`; helpers `sortableHeader()`.
- **Forms:** single `Controller` pattern (no `register` mix); `z.string().trim()` + coordinate bounds `[-90,90]/[-180,180]`; assessment `0–3` via `ToggleGroup`.
- **Query keys:** canonical in `lib/queryKeys.ts` — `["dss","latest"]` (not `lastest`), `staleTime` per feature, `Minimal`/`Deletes`/`Infinity` strategy.

## Audit & Docs

- Living audit: `docs/reports/admin-dashboard-audit--2026-08-31.md` (merged Design + Logic + UX + Implementation + Forms deep-dive, P0–P2 with tags `P0 Correctness/ Security/ Forms/ Tables` etc., 8 done / 19 open as of 2026-08-31). Guarded as gitignored — local only unless `!docs/reports/` unignored.
- Original Next.js readme: [`README.nextjs.md`](./README.nextjs.md)

## Deployment

```bash
bun run build   # next build
# Docker (if Dockerfile present)
docker build -t spk-fe .
docker run -p 3000:3000 --env-file .env.local spk-fe
```

Vercel: set `NEST_API_URL` / `NEXT_PUBLIC_NEST_API_URL` in project env, deploy. No `pure black #000` / neon glow defaults per design-taste policy.

## License

Private — thesis project, Fakultas Teknik UNNES. Not for redistribution without author permission.
