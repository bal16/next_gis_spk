# Admin Dashboard Audit — Design / Logic / UX / Implementation + Forms Deep-Dive

**Date:** 2026-08-31 (merged 2026-08-31 — supersedes `admin-dashboard-forms-audit-2026-08-31.md`) · **Last updated:** 2026-08-31 (P0-2 implemented, see §7 + Changelog §8.4)  
**Scope:** `app/(main)/admin/*` → `features/dashboard/*`, `features/dss/*`, `features/buildings/*`, `features/assessments/*`, `features/weights/*`, `features/auth/*` (gates admin), `components/ui/*`, `app/globals.css`  
**Stack:** Next.js 16 (App Router, RSC), Tailwind v4, shadcn/ui `new-york` + Radix, TanStack Query v5 + Table v8, Zustand, motion, maplibre-gl  
**Method:** Manual code reading + `shadcn` rules (`styling.md`, `forms.md`, `composition.md`, `icons.md`, `chat.md`), `design-taste-frontend` dials / anti-slop checklist, `codebase-design` deep-module vocabulary, `verification-before-completion` evidence pass. Initially read-only; P0-1 (2026-08-31, #1) and P0-2 (2026-08-31, build-verified) now implemented — report is living tracker. Grilling for P0-2 via `@.agents/skills/grilling` (A: `GET /auth/me` fail-closed + toast+Alert).

---

## 0. Executive Summary

The admin covers 5 routes behind a single `AdminLayout`: **Overview** (`/admin`), **Buildings**, **Weights**, **DSS runs**, **DSS run detail** + nested **Assessments**, gated by `features/auth`. Functionally it works, but it is a **shallow-shell dashboard**: every route is `prefetchQuery + HydrationBoundary + client DataTable`, with four near-identical table implementations, inconsistent loading/empty/error UX, three competing form patterns where one would do, and **two silent correctness bugs** (sub-weights dropped, stale Overview).

**Overall: 56 / 100 → ~62 / 100 after P0-1 + P0-2 (thesis demo now gated correctly; remaining P0-3…P0-7 still block prod).**
_Score folded in forms deep-dive (52/100). Bump +6 for P0-1 (weights persistence) + P0-2 (live `GET /auth/me` gate, refresh cookie fix, `?reason` UX). Re-score fully after P0-3…P0-7._

| Axis                              | Score | Verdict                                                                                                                                                                              |
| --------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Design (visual system)**        | 65    | Tokens correct, shadcn usage ~70% but with 9 rule violations + mixed locale.                                                                                                         |
| **UX (flows + feedback)**         | 50    | Happy paths ok; empty/loading/error, navigation active state, keyboard/focus, and i18n broken. Forms add sticky/footer collision + missing helper text.                              |
| **Logic (correctness + state)**   | 46    | Critical: sub-weight edits never persist; query-key typo + `staleTime: Infinity` leaves Overview stale; auth trusts unsigned client cookie; building/assessment coercion edge cases. |
| **Forms (dedicated)**             | 52    | Auth forms (F5) Good 78/100 — reference pattern. Admin CRUD (F1–F4) Fail/Weak 38–48/100, 2 P0 bugs, 3 shadcn rule fails.                                                             |
| **Implementation (architecture)** | 55    | Feature-sliced but shallow duplication (4× DataTable, 18× sortable headers, 3 form patterns, identical `useDelete*` skeletons), no deep Table/Form module, no Pagination.            |

> **Reading this as:** internal admin dashboard for trusted campus operators (not a public marketing page), low `VISUAL_DENSITY` tolerance, `DESIGN_VARIANCE` should be 3–4 (trust-first, not agency experimental). The correct lens is **Carbon / Primer-style cockpit discipline** — not bento/liquid-glass. Forms are the highest-risk surface here (wrong weights → wrong SAW ranking; bad coordinates → map breakage).

---

## 1. Design Audit

### 1.1 Design System — What Is Correct

- `components.json:2` — `style: new-york`, `baseColor: neutral`, `cssVariables: true` matches thesis formal tone. Correctly uses shadcn ownership model (not CDN).
- `app/globals.css:6-44` — `@theme inline` mapping + oklch tokens (`--chart-1`..`--chart-5`, `--sidebar-*`) is Tailwind v4-native. Light/dark defined via oklch, no raw hex. Passes dark-mode protocol (dual tokens set).
- `components/ui/card.tsx:1`, `components/ui/table.tsx:1`, `components/ui/sidebar.tsx:1`, `components/ui/dialog.tsx:1`, `components/ui/field.tsx:1`, `components/ui/input.tsx:1` — canonical shadcn primitives, not hand-rolled.
- `features/dashboard/components/MainContent.tsx:105-115` — proper `CardHeader`/`CardTitle`/`CardDescription`/`CardContent` composition (not dumping everything in CardContent).
- `components/UserNav.tsx:100-105` — `Avatar` always paired with `AvatarFallback` (passes `composition.md` rule).

### 1.2 Shadcn Rule Violations (9 distinct)

| #   | Rule file                                                                          | Violation                                                                                                                                                                                       | Location                                                                                                                                                                                         | Fix                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | `styling.md` — no `space-x/y`, use `gap`                                           | `FieldGroup className="py-4 space-y-3"` mixes spacing primitive with Tailwind gap elsewhere                                                                                                     | `features/buildings/components/BuildingDialog.tsx:125`, `features/assessments/components/CreateDialog.tsx:78`                                                                                    | `flex flex-col gap-3`                                                                                                                             |
| D2  | `styling.md` — `size-*` for equal dimensions                                       | `h-8 w-8 p-0` on every action trigger                                                                                                                                                           | `features/dss/components/column.tsx:33`, `features/buildings/components/column.tsx:34`, `features/assessments/components/column.tsx:27`, `features/dss/components/run/column.tsx:28`             | `size-8`                                                                                                                                          |
| D3  | `styling.md` — semantic colors, no `text-red-500`                                  | Raw `text-red-500` for field errors instead of `text-destructive` token                                                                                                                         | `BuildingDialog.tsx:137,157,171,185`, `CreateDialog.tsx:89,105`                                                                                                                                  | `text-destructive` + use `FieldError`                                                                                                             |
| D4  | `forms.md` — `FieldError` + `data-invalid`/`aria-invalid`                          | Manual `<span className="text-sm text-red-500">` bypasses `FieldError`; `BuildingDialog` uses `Label` + `Input` with `form.register` but never sets `Field data-invalid` / `aria-invalid`       | `BuildingDialog.tsx:127-190`                                                                                                                                                                     | Wrap with `Field`, `FieldLabel`, `FieldError` as done correctly in `WeightsUpdateSection.tsx:159`                                                 |
| D5  | `composition.md` — overlays need `DialogTitle` / use `AlertDialog` for destructive | Destructive deletes use plain `Dialog`                                                                                                                                                          | `features/dashboard/components/ConfirmationDialog.tsx:43` (`Dialog`) vs delete intent                                                                                                            | `AlertDialog` with `AlertDialogAction`/`Cancel`, `AlertDialogTitle`/`Description`                                                                 |
| D6  | `composition.md` — `DropdownMenuItem` nesting + `Alert` vs custom                  | `ConfirmationDialog` nested inside `DropdownMenuItem asChild` creates `<button>` inside `<div role=menuitem>` — invalid nesting, focus trap broken, `DropdownMenu` closes before `Dialog` opens | `features/dss/components/column.tsx:45-58`, `features/buildings/components/column.tsx:55-71`, `features/assessments/components/column.tsx:33-48`, `features/dss/components/run/column.tsx:36-48` | Render `AlertDialog` sibling to `DropdownMenu`, controlled by `open` state; `DropdownMenuItem onSelect` sets `open=true` and `e.preventDefault()` |
| D7  | `composition.md` — `Empty` for empty states                                        | Tables render raw `No results.` cell                                                                                                                                                            | `features/buildings/components/data-table.tsx:104-111`, `features/dss/components/data-table.tsx:104-111`                                                                                         | `Empty` + `EmptyTitle`/`Description`/`Media`                                                                                                      |
| D8  | `icons.md` — icons in Button need `data-icon`, no sizing on inner icons            | `ArrowUpDownIcon className="ml-2 h-4 w-4"` sized manually; `MoreHorizontalIcon` sized manually                                                                                                  | All `column.tsx` header cells, plus `features/auth/components/LoginForm.tsx:121` `LoaderCircle mr-2 h-4 w-4`                                                                                     | `<ArrowUpDownIcon data-icon="inline-end" />` (size handled by Button CSS), remove `h-4 w-4`                                                       |
| D9  | `composition.md` — `Skeleton` not `animate-pulse` div                              | `WeightsUpdateSection.tsx:100` uses plain `<div>` loading state                                                                                                                                 | `features/weights/page.tsx:30` / `WeightsUpdateSection.tsx:99-100`                                                                                                                               | `Skeleton` grid matching final Card shapes                                                                                                        |

**Also:**

- `features/dashboard/components/header.tsx:26-38` — breadcrumb rendered as `<nav>` + `<span>` + raw `>` separator. Should be `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`, `BreadcrumbPage` (shadcn adds a11y + collapsible behavior for free).
- `features/dashboard/components/WeightsPieChart.tsx:67-71` — `color: var(--chart-${index%5+1})` assumes 5 chart tokens exist and cycles arbitrarily; reordering weights changes colors — violates stable semantic mapping.
- `features/dashboard/components/sidebar.tsx:78-83` — `SidebarMenuButton isActive` never set; active route not indicated. Battery-included pattern is `usePathname() === item.url`.

### 1.3 Tailwind / Styling Hygiene

- `features/dashboard/page.tsx:24` — `container max-w-7xl mx-auto p-4` inside `SidebarInset` duplicates `max-w` constraint already in `MainContent`. `container` adds its own breakpoints + padding, so nested containers create double-padding on mobile.
- `features/weights/components/WeightsUpdateSection.tsx:109` — `sticky top-4 z-20 backdrop-blur-md` overlaps with `fixed bottom-6 z-40` footer (two competing z contexts). No documented z-scale.
- `app/globals.css:124-135` — `custom-popup` overrides are `@apply` with `!` (`bg-transparent!`) — Tailwind v4 deprecates `!` shorthand inside `@apply` in some configs; use `!bg-transparent`.
- Good: heavy use of `cn()` for conditional classes (`WeightsUpdateSection.tsx:114`, `BuildingDialog.tsx` gap). No manual `z-index` on overlay components beyond the sticky/fixed pair.

### 1.4 Density / Anti-Slop Check (design-taste-frontend dials)

- Correctly dials: `VISUAL_DENSITY` ~5 (daily app), `MOTION_INTENSITY` ~2 (static) — appropriate for an internal admin. No glassmorphism/magnetic/liquid-glass abuse. This is correct — do not add it.
- Violations of layout discipline:
  - `WeightsUpdateSection.tsx:130` — `grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-flow-dense` + `md:col-span-2` on sub-weight cards is a legitimate bento attempt, but content is 4–7 cards of variable height with no rhythm; reads as stacked forms, not a bento.
  - `MainContent.tsx:63-103` — `grid-cols-1 md:grid-cols-3` (pie + map) has no explicit mobile fallback height for Map; `CardContent h-full` without parent height collapses to 0 on some viewports before map loads — map flicker.

---

## 2. UX Audit

### 2.1 Navigation & Information Architecture

- **Sidebar** (`features/dashboard/components/sidebar.tsx:27-48`) — 4 items, English labels (`Saw Calculation` inconsistent caps). No badge/count, no collapse persistence UI, no active state. `isActive` never computed → user cannot see current route after navigation. Sidebar branding links to `"/"` but header also links via UserNav — duplicate home affordance.
- **Header / Breadcrumb** (`features/dashboard/components/header.tsx:13-46`):
  - Bug `header.tsx:35`: `i < path.length` is always true (array length = `rootPath + path`), so separator `>` renders even after the last item before the current page label → `Dashboard > Buildings > Buildings` shows double separator.
  - Should show `Dashboard / Buildings / E11 / Assessments E11` but currently renders `Dashboard > Buildings > Assessments E11` with no visual distinction between links and current page except `font-medium`.
  - `SidebarTrigger` is visible on desktop even when sidebar is `collapsible="offcanvas"` — violates shadcn guidance to hide trigger when `isMobile===false && state===expanded` (optional polish, not critical).

### 2.2 Data Tables — Usability

- **4 separate `DataTable`s** — all sortable, only Buildings filters (`filter Buildings...` on `name`). DSS tables have filtering code commented out (`features/dss/components/data-table.tsx:14,34-35,55-63`). Inconsistent UX: some tables filter, some don't, with no empty-filter feedback beyond `No results.`
- **No pagination, no row count.** `features/buildings/components/data-table.tsx:66-115` renders all rows. With 50+ buildings, page scrolls infinitely. Spec requires Pagination sentinel + page-size selector + dense mode. `shadcn` exposes `Pagination` — not used anywhere.
- **Headers:** Every column header is a `<Button variant="ghost">` with sort toggle. No `aria-sort` on `<th>`, no visual sort indicator beyond identical `ArrowUpDownIcon` regardless of state. Should map `column.getIsSorted() === 'asc' | 'desc'` to `ArrowUp`/`ArrowDown`.
- **Actions:** `MoreHorizontalIcon` only, no text label, no tooltip (except score columns). Discoverability low. Edit opens via `DropdownMenuItem onSelect` → `BuildingDialog` modal but dialog is rendered outside dropdown without coordinating focus return — keyboard user loses focus position.

### 2.3 Forms — Summary (Full Deep-Dive in §5)

> **You flagged this correctly — first split audit under-audited forms.** Section 5 below is the complete forms deep-dive (formerly `admin-dashboard-forms-audit-2026-08-31.md`), graded form-by-form. Executive summary:

- **Weights (F1) — P0 silent data loss:** `WeightsUpdateSection.tsx:83-88` builds payload only from `formData[main.key]`, dropping every `sub.key` edit; success toast but server reverts on reload. Sub-total validation is cosmetic (`isSubValid` only changes `text-green-600`/`text-destructive`, no blocking error). `useWatch({control})` without `name` (`:54`) re-renders all 25+ fields on every keystroke.
- **Building Add/Edit (F2/F3) — shadcn 3-rule fail:** `BuildingDialog.tsx:19` uses `Label` not `FieldLabel`, raw `span.text-red-500` not `FieldError`, missing `Field data-invalid`/`aria-invalid` pairing (`:127-190`). `type.ts:26` `z.coerce.number` with no `[-90,90]/[-180,180]` bounds + `type="text"` race → `NaN`, spaces `"   "` pass `min(1)`.
- **Assessment Create (F4) — same violations + worse:** 7 freeform `type="number" step="any"` with no 0–3 affordance (`CreateDialog.tsx:79-188`; schema `assessments/type.ts:5` says `max(3)` but UI hint `Enter …` gives no clue). Defaults `0` bias silent all-zero submission; `lastMaintenance` date coercion off-by-one. No `FieldSet`/`FieldLegend` for the related criteria set.
- **Auth Login/Register (F5) — the reference:** `LoginForm.tsx:74-90` correctly uses `Controller` + `Field data-invalid` + `FieldLabel` + `aria-invalid` + `FieldError` — use this as the single admin pattern. Only gaps: `RegisterForm.tsx:57` resets on error (loses email), icons missing `data-icon`, server `Email already in use` not mapped via `form.setError`.

**Sticky/fixed weights footer** (`WeightsUpdateSection.tsx:109-129` + `245-282`) duplicates total, `pb-20` insufficient on mobile, reset without confirmation. **Loading** across forms is plain `Memuat...` div not `Skeleton` grid. See §5.6 for ranked form fixes (F-P0-1 to F-P0-4).

### 2.4 Feedback, Empty, Error States

- **Empty:** Only Overview has a designed empty state (`MainContent.tsx:29-41` — `AlertCircle h-16 w-16`, headline + CTA). Every other route falls back to table `No results.` — should use `Empty`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyAction`. Especially Assessments for a new building with zero assessments (confusing "No results." vs "Belum ada penilaian").
- **Error:** No error boundary anywhere. `useQuery` errors are not rendered (no `isError` branch). API throws (`features/weights/api/get-weights.ts:33` via `backendClient`) surface only as unhandled rejection + `sonner` toast in mutations. User sees blank page on fetch failure.
- **Toast language:** Mixed ID/EN — `MainContent.tsx:35` ID, `useBuildings.ts:63` ID, `features/dss/components/column.tsx:46` EN, `ConfirmationDialog.tsx:53-57` EN (`Cancel`/`Confirm`). Inconsistent voice.

### 2.5 Accessibility & i18n

- **Keyboard:** Nested interactive (`Button` inside `DropdownMenuItem`) breaks Radix focus management. `ConfirmationDialog.tsx:52-58` uses `DialogClose asChild` + `Button` correctly for Cancel, but Confirm has no `DialogClose` — leaves focus trapped until async completes.
- **A11y labels:** Every `MoreHorizontalIcon` has `sr-only Open menu` ✓ but sort buttons have no `aria-label` describing column + state.
- **Color-only signals:** Priority icons rely solely on color (`Destructive red / Yellow / Green` in `MapView.tsx:141-157` and badge styles). No text prefix for color-blind users beyond icon shape (shape helps, but table priority column is numeric `priority` without semantic label).
- **Map:** `MapView.tsx:106-112` markers are `<div className="cursor-pointer transform hover:scale-110">` — not focusable, no keyboard activation, no `role=button`/`aria-label` with building name. Violates map a11y.
- **Locale:** Dates use `Intl.DateTimeFormat("id-ID", {dateStyle:"long", timeStyle:"short"})` (`features/dss/components/column.tsx:97-98`, `features/assessments/components/column.tsx:155`) but surrounding UI is English. Pick one locale or use `next-intl`.

### 2.6 Responsive

- `WeightsUpdateSection.tsx:109` sticky bar + `245` fixed footer both have `w-[90%]` / `w-3/4` without `max-w` sync to `SidebarInset` padding (`p-4` / `lg:px-6`). On narrow viewports with sidebar offcanvas overlay, fixed footer width calc ignores sidebar inset, creating horizontal overflow.
- Tables `overflow-hidden rounded-md border` + inner `Table` `overflow-x-auto` — double overflow wrappers. Mobile user must horizontal scroll but no `ScrollArea` with visible scrollbar. `TableCell whitespace-nowrap` forces overflow even for short values.

---

## 3. Logic Audit

### 3.1 Authentication & Authorization

- `features/dashboard/layout.tsx:7-45` — **Server Component reads `spk.access-token` and `spk.session` cookies and trusts them.**

  ```ts
  const session = JSON.parse(sessionCookie); // layout.tsx:25
  if (!session.isAdmin) return redirect("/");
  ```

  Problems: (a) no signature verification — client can forge `spk.session = {"isAdmin":true}`; (b) `try { JSON.parse } catch => redirect("/auth")` hides parse error from logging; (c) token existence does not imply validity/expiry — backend is the source of truth (`app/api/auth/me/route.ts` exists but is never called here). **Threat: privilege escalation via cookie tampering.** Fix: `await backendClient.get("/auth/me")` or call `getCurrentUser()` server-side, derive `isAdmin` from verified response, never from client cookie.

- Redirect for non-admin to `"/"` silently drops user on public landing with no explanation — should redirect to `/auth` with `?reason=unauthorized` toast.
- Auth forms correctly re-validate server-side via `safeParse` (`features/auth/actions/loginAction.ts:15-18`, `registrationAction.ts:13-18`) — but Weights server action does not (see §3.3 / §5.4).

### 3.2 Data Fetching & Cache

- **Query-key typo + staleTime** — Most impactful non-security bug:
  - `features/dashboard/page.tsx:17` and `MainContent.tsx:24` use `["lastest-run"]` (typo: `lastest` not `latest`). The typo is consistent so query matches, but any future code using the correct spelling will miss cache. Grep shows zero usage of `"latest"` — so it's consistently wrong, not yet broken, but tech-debt.
  - `staleTime: Infinity` on all admin queries (`MainContent.tsx:26`, `TableSection.tsx:10-14`, `features/buildings/page.tsx:15`, `features/weights/page.tsx:15`, etc.). Mutations invalidate only their own keys:
    - `useRunCalculation.onSettled` invalidates `["dss"]` and `["buildings"]` but **not** `["lastest-run"]` or `["dss-details", runId]` (`features/dss/hooks/useDSS.ts:25-27`).
    - `useUpdateWeights.onSettled` invalidates `["weights"]` correctly.
    - **Result:** After `Run SAW Calculation`, Overview still shows stale last-run until hard reload — operator sees "Belum Ada Riwayat" flash or old average, thinks calculation failed.
  - Fix: centralize keys in `lib/queryKeys.ts`, invalidate all dependents, or set `staleTime: 5*60*1000` with `refetchOnWindowFocus: false`.
- **Prefetch + Hydration** pattern is correct per route (`dehydrate`/`HydrationBoundary` in `features/dss/page.tsx:13-17`, `features/buildings/page.tsx:11-15`, etc.) — good. But `getResultDatas` (`features/dss/api/get-results.ts:27-35`) is untyped `backendClient.get("/dss/runs")` without `SuccessResponse` generic, unlike `getLastRunDatas`. Inconsistent error contract.

### 3.3 Weights — P0 Logic Bug (Silent Data Loss) — Detail in §5.2 F1

- `features/weights/components/WeightsUpdateSection.tsx:77-96` (`onSubmit`):

  ```ts
  const payload = {
    weights:
      data?.map((main) => ({ ...main, value: formData[main.key] })) || [],
  };
  await updateWeightsMutation(payload);
  ```

  `formData` contains **both main and sub keys** (defaults include subs at line 59-64). But payload only updates `main.value` from form, spreading `...main` which includes original `main.subWeights` with **old values**. Sub-weight edits from the UI (`WeightsUpdateSection.tsx:198-233` controllers for `sub.key`) are accepted, validated visually, but **never sent to the server**. User drags sub sliders, clicks `Simpan Bobot`, gets `Weights updated successfully!` toast, reload shows old subs — silent failure. Repro: edit any sub-weight, submit, hard refresh, observe reversion.

- **Second bug:** `z.record(z.number().min(0).max(1))` (`WeightsUpdateSection.tsx:33-36`) validates individual fields but `mainTotal` validation is only pre-submit toast + button disable (`WeightsUpdateSection.tsx:78-81,275`). Sub-totals have no blocking validation at all (`isSubValid` only colors text). Server may reject but client never prevents. Full fix + `allSubsValid` gate in §5.2.

### 3.4 Buildings & Assessments

- `features/buildings/hooks/useBuildings.ts:18-70` — optimistic add uses `temp-${Date.now()}` id, maps to `TBuilding` with `priority: "Belum Dihitung"` string, but `TGetBuildingsResponse.priority` is `number` (`features/buildings/type.ts:52`). Type mismatch hidden by `as TBuilding` cast — optimistic shape diverges from server shape. After `onSettled` invalidation, real data overwrites, so user sees flash of `Belum Dihitung` badge then numeric priority — jarring.
- `features/buildings/components/BuildingDialog.tsx:58-77` — `defaultValues` set from `initialData` (which for edit comes from `TBuilding` where `latitude`/`longitude` are numbers) but `Input` is `type="text"` with `form.register("latitude")` coercing via `z.coerce.number`. Mixing controlled `type="text"` + `z.coerce` + no `valueAsNumber` leads to `NaN` on empty string, but no inline error until submit. No coordinate bounds validation (latitude outside [-90,90] accepted). Also building form wiring issues detailed in §5.2 F2/F3.
- `features/assessments/type.ts:1-26` — `createAssessmentSchema.lastMaintenance: z.coerce.date` expects ISO string from `Input type="date"` (`CreateDialog.tsx:178`). Browsers emit `YYYY-MM-DD` (no timezone) — `z.coerce.date` parses as UTC midnight, off-by-one day in `id-ID` formatting (`features/assessments/components/column.tsx:154-159`). Also 6 numeric fields all `max(3)` but UI placeholder `Enter ...` gives no hint of 0–3 range. Full assessment form issues in §5.2 F4.

### 3.5 DSS Flow

- `features/dss/components/TableSection.tsx:24-33` — `ConfirmationDialog` title/description are generic EN, no run count or Consequence. `runCalculation()` (`features/dss/api/run-calculation.ts:19-29`) returns `boolean` but error message says `Failed to create building` (copy-paste bug). No input to calculation, no progress indicator beyond button `Calculating...` — if calc takes >5s (it often does), user may retry.
- `features/dss/hooks/useDSS.ts:32-64`, `66-97` — optimistic deletes update cache via `setQueryData` but details list re-renders with stale `averageScore`/`totalBuildings` aggregates not recomputed — header stays showing old average after row delete until refetch.
- `features/dss/components/run/column.tsx:55-130` — columns show raw numeric `priority` (1/2/3) without mapping to label, unlike Buildings table which maps to `Prioritas Tinggi/Sedang/Rendah`. Inconsistent semantics.

### 3.6 State Management

- `features/map/components/MapView.tsx:34-44` — mixes global `useMapStore` (`setMapRef`, `resetView`, `flyToBuilding`) with `useSelectedBuildingStore` (selected building). Both Zustand, both `useShallow`, but no coordination: `handleResetMap()` + `setSelectedBuilding(null)` called together manually. Should be single `MapSelection` module.
- `features/weights/components/WeightsUpdateSection.tsx:54` — `useWatch({control})` without `name` subscribes to **entire form** (all weight keys) → every keystroke triggers `mainTotal`/`subTotal` recomputations for all cards + full re-render. Should `useWatch({name: main.key})` per card or `form.watch`. Detail + fix in §5.2 F1.
- No `CONTEXT.md` / ubiquitous language doc — terms `assessment` vs `criterias` vs `sawRunDetails` vs `criteria` used interchangeably (`features/buildings/type.ts:13-22` `criterias`, `features/dss/type.ts:10` `sawRunDetails`). Onboarding friction.

---

## 4. Implementation Audit

### 4.1 Architecture — Module Depth & Seams

Using `codebase-design` vocabulary (deep module = narrow interface hides complexity; shallow = interface ~ impl).

| Module                                                       | Verdict                                        | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features/dashboard`                                         | **Shallow coordinator**                        | `layout.tsx:42-44` + `page.tsx:13-30` only orchestrate `SidebarProvider` + prefetch. No domain logic, hides nothing. Acceptable as composition root.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `features/dss`, `features/buildings`, `features/assessments` | **Three parallel shallow modules**             | Each exports `page.tsx` (prefetch + `TableSection`) + `components/TableSection.tsx` (one `useQuery` + `DataTable`) + `components/column.tsx` + `components/data-table.tsx`. Interface = pass-through; deletion would just inline code — fails deletion test. Not deep.                                                                                                                                                                                                                                                                                                                    |
| `DataTable`                                                  | **Missed deepening opportunity (Strong)**      | 4 files — `features/buildings/components/data-table.tsx:30-117`, `features/dss/components/data-table.tsx:30-117`, `features/dss/components/run/data-table.tsx:??`, `features/assessments/components/data-table.tsx:??` — 90% duplication (same `useReactTable` setup, same `TableHeader/Body` markup). Only difference is `getFilteredRowModel` vs none. Should be one deep `AdminTable<T>` module behind a narrow seam: `columns, data, filterKey?, renderAction?`, hiding sorting/filter/pagination/skeleton/empty inside. Tests would then cover table via that seam, not per-feature. |
| `WeightsPieChart`                                            | **Moderate depth, leaky interface**            | `WeightsPieChart.tsx:19-123` computes `innerChartData`/`outerChartData`/`chartConfig` inline — useful but color config mutates module-local `chartConfig` object via `forEach` side effect. Not testable without rendering. Should extract pure `buildChartData(weights) => {inner, outer, config}`.                                                                                                                                                                                                                                                                                      |
| `ConfirmationDialog`                                         | **Shallow generic**                            | `ConfirmationDialog.tsx:23-62` is a reusable Dialog wrapper but mixes `isPending` local state with async `callback` — hides error handling (no toast on failure, caller must). Two consumers pass `title/description/callback` identically for deletes — suggests a deeper `ConfirmDelete<T>` module.                                                                                                                                                                                                                                                                                     |
| `lib/api/server` (`backendClient`)                           | **Correct seam**                               | Single Axios instance wrapping server auth; good hypothetical seam (one adapter = hypothetical seam, but multiple features already depend on it → real seam). Keep.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `features/map`                                               | **Deep-ish, but coupled via global stores**    | `MapView.tsx:34-138` has proper locality (map ref + markers + popup co-located, not split into 3 modules). Good. But depends on two Zustand stores (`useMapStore`, `useSelectedBuildingStore`) that are not part of its interface — caller must set both to coordinate. Should expose `onBuildingSelect` callback instead of reaching into global store.                                                                                                                                                                                                                                  |
| `Forms` (F1–F5)                                              | **Shallow duplication — 3 patterns for 1 job** | F1 `Controller+useWatch`, F2/F3 `register+useEffect reset`, F4 `register+step="any"`, F5 `Controller+Field` (canonical). No deep `AdminForm` convention. See §5.5.                                                                                                                                                                                                                                                                                                                                                                                                                        |

**Top deepening candidate (from improve-codebase-architecture lens): Merge 4 DataTables → one `AdminDataTable` + normalize 3 form patterns → one `Controller` convention.** Before: 4 files × ~118 LOC + 4× column sort boilerplate + 3 form wirings. After: 1 Table file + pure `createSortableHeader(label)` helper + one form pattern. Leverage: every future admin table/form gets filtering/pagination/empty/skeleton + validation affordance for free. Locality: sorting/filter/pagination + field error handling lives in one place.

### 4.2 Code Duplication Inventory

- `column.tsx` sortable header pattern repeated 18×:

  ```ts
  header: ({column}) => <Button variant="ghost" onClick={()=>column.toggleSorting(...)}>{label}<ArrowUpDownIcon className="ml-2 h-4 w-4"/></Button>
  ```

  Present in `features/buildings/components/column.tsx:90-173` (6×), `features/dss/components/column.tsx:64-147` (6×), `features/assessments/components/column.tsx:52-178` (7×), `features/dss/components/run/column.tsx:56-125` (≈6×). One helper would remove ~90 lines.

- `data-table.tsx` — Buildings and DSS differ by 3 lines (filtered row model + Input placeholder). Assessments copy again with `building-assessments` filter key. All could be one file.
- `useDelete*` hooks (`features/dss/hooks/useDSS.ts:32-64`, `features/buildings/hooks/useBuildings.ts:109-140`) share identical optimistic-update skeleton — extract `useOptimisticDelete<T>(queryKey, id)`.
- Forms: `BuildingDialog.tsx:127-190` + `CreateDialog.tsx:79-188` duplicate `Field`+`Label`+raw `span.text-red-500` pattern; F5 `LoginForm.tsx:70-126` shows the correct `Controller` pattern to consolidate onto.

### 4.3 API Layer

- Inconsistent server-action signatures: `getWeights` (`features/weights/api/get-weights.ts:28`) is `"use server"` but called from client `useQuery` (`WeightsUpdateSection.tsx:39-42`) — Next.js will RSC-boundary it, but `"use server"` is meant for mutations/forms; queries should be plain `fetch` via `backendClient` without directive or be moved to `lib/api`. Works but muddles boundaries.
- Error messages copy-paste: `run-calculation.ts:26` throws `Failed to create building` for a DSS calc failure.
- No request deduplication / retry policy configured on `QueryClient` (default `retry: 3` may retry a failed SAW calc 3× — expensive).
- Types drift: `TGetResultsResponse` defined in `features/dss/api/get-results.ts:11-23` vs `features/dss/type.ts:3-16` — two definitions, one includes `building`/`assessment` join, one strips to `buildingId` only. Consumers import different ones (`TableSection.tsx` casts `Results[]`, `MainContent.tsx` expects full join).

### 4.4 Performance

- `WeightsUpdateSection.tsx:54` full-form `useWatch` → per-keystroke re-render of all cards. With 10+ weights + 15 subs = 25 controlled Inputs, typing lag visible. Fix: `useWatch` per field or split into isolated `WeightCard` memoized component. Detail in §5.2.
- `MapView.tsx:100-116` maps all `buildings` to `Marker` with no `memo`/`cluster`. With 100+ buildings, marker count kills frame rate. Consider `Supercluster` or `react-map-gl` clustering.
- `staleTime: Infinity` everywhere prevents background refetch but also means first fetch is forever cached — no `gcTime` tuned, no `refetchOnWindowFocus` disabled explicitly (defaults true, but suppressed by `Infinity`). Inconsistent.
- `app/globals.css:137-162` map controls styled via `!important` mask overrides — no lazy loading of `maplibre-gl.css` (`import "maplibre-gl/dist/maplibre-gl.css"` at top of `MapView.tsx:14` pulls CSS into every route that imports map, even when map not visible).

### 4.5 Resilience

- No `error.tsx` / `loading.tsx` per `app/(main)/admin/*` segment — Next.js error boundary never renders. Blank on thrown errors.
- No `Suspense` boundaries for `HydrationBoundary` children — defeats streaming.
- Mutations use `toast.success` but no `toast.error` with retry CTA. Auth actions correctly surface via `toast.error` with localization (`features/auth/actions/loginAction.ts:71-83`) but do not call `form.setError` for field-level association (see §5.2 F5).

---

## 5. Forms Deep-Dive (Merged — Formerly Separate Supplement)

> This section is the full forms audit you flagged as missing. You were right — the first report only spot-checked forms via shadcn rule hits (§1.2 D1/D3/D4). This is the deep pass using `shadcn/rules/forms.md`, `styling.md`, and `codebase-design` lenses across all 5 forms.

### 5.0 Inventory (5 Forms, 3 Patterns)

| ID  | Form                             | File                                                                        | Pattern                               | Route                                                        |
| --- | -------------------------------- | --------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------ |
| F1  | **Weights (update all weights)** | `features/weights/components/WeightsUpdateSection.tsx:1-285`                | Full-page form with fixed footer      | `/admin/weights`                                             |
| F2  | **Building — Add**               | `features/buildings/components/BuildingDialog.tsx:1-207`                    | `Dialog` + `FieldGroup`               | `/admin/buildings` → `Add New Building`                      |
| F3  | **Building — Edit**              | `features/buildings/components/BuildingDialog.tsx:1-207` (`variant="edit"`) | Controlled `Dialog` via dropdown      | `/admin/buildings` → row `… > Edit`                          |
| F4  | **Assessment — Create**          | `features/assessments/components/CreateDialog.tsx:1-205`                    | `Dialog` + 7 numeric fields           | `/admin/buildings/[code]/assessments` → `Add New Assessment` |
| F5  | **Auth — Login / Register**      | `features/auth/components/LoginForm.tsx:1-137`, `RegisterForm.tsx:1-182`    | Standalone page, `FieldGroup` correct | `/auth` (tabs) — gates admin                                 |

**Overall forms grade: 52 / 100 — Auth forms are the best in the codebase; admin CRUD dialogs are the weakest and contain two silent correctness bugs.**

| Form                        | Grade         | One-line verdict                                                                                                                                                                                                                         |
| --------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **F1 Weights**              | **38 — Fail** | Visually polished but **sub-weight edits are silently dropped on submit** (`WeightsUpdateSection.tsx:83-88`); validation only blocks main total, sub-totals are cosmetic. Performance anti-pattern (`useWatch` full-form).               |
| **F2/F3 Building Add/Edit** | **48 — Weak** | Correct `DialogTitle`/`Description` but breaks 3 shadcn rules: raw `Label` not `FieldLabel`, raw `span.text-red-500` not `FieldError`, `Field data-invalid`/`aria-invalid` missing. `z.coerce.number` + `type="text"` race → `NaN` edge. |
| **F4 Assessment Create**    | **45 — Weak** | Same shadcn violations as Building plus worse: 7 bare `Input type="number"` with no range affordance (0–3), no `FieldDescription`, default `0` biases submission, `lastMaintenance` date coercion off-by-one.                            |
| **F5 Login/Register**       | **78 — Good** | Closest to spec: `Controller` + `Field` + `FieldLabel` + `FieldError` + `data-invalid`/`aria-invalid` correct. Minor: `LoaderCircle` missing `data-icon`, disabled state styling incomplete.                                             |

### 5.1 Cross-Form Shadcn Compliance

#### 5.1.1 Rule: `FieldGroup + Field` (forms.md)

| Form              | Status                          | Evidence                                                                                                                                                                                                                           |
| ----------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F5 Login/Register | ✅ Correct                      | `LoginForm.tsx:70-126` wraps in `FieldGroup`, each input in `Field` + `FieldLabel` + conditional `FieldError`.                                                                                                                     |
| F1 Weights        | ✅ Correct (best admin example) | `WeightsUpdateSection.tsx:154-182` + `198-233` uses `Controller` → `Field` → `FieldLabel` → `Input` → `FieldError`.                                                                                                                |
| F2/F3 Building    | ⚠️ Partial                      | `BuildingDialog.tsx:125` uses `FieldGroup` + `Field` but with `Label` from `@/components/ui/label` (`BuildingDialog.tsx:19`) not `FieldLabel`, and error is manual `<span className="text-sm text-red-500">` (`:137,156,171,186`). |
| F4 Assessment     | ⚠️ Partial                      | Identical to Building: `CreateDialog.tsx:78` `FieldGroup` + `Field` + `Label` + raw `span.text-red-500` (`:88-91`).                                                                                                                |

**Fix:** Replace every `Label` with `FieldLabel` and every raw `span.text-red-500` with `<FieldError errors={[fieldState.error]} />` as demonstrated in F1/F5. This also fixes `Field`’s `data-invalid` styling not applying to the label (shadcn’s `Field` uses `group/field` selectors that expect `FieldLabel`).

#### 5.1.2 Rule: `data-invalid` + `aria-invalid` / `data-disabled` + `disabled` (forms.md)

- **F5** Correct: `<Field data-invalid={fieldState.invalid}>` + `<Input aria-invalid={Boolean(fieldState.invalid)}>` (`LoginForm.tsx:75,88`).
- **F1** Correct: `<Field data-invalid={fieldState.invalid}>` + `<Input aria-invalid={fieldState.invalid}>` (`WeightsUpdateSection.tsx:159,170,204,218`).
- **F2/F3** Missing: `Field` has no `data-invalid`, `Input` has no `aria-invalid` / `disabled` pairing. `Field` is just `<Field><Label>…` (`BuildingDialog.tsx:127`). Input gets `disabled={isPending}` but field does not get `data-disabled` → disabled styling leaks.
- **F4** Same missing.

**Why it matters:** `components/ui/field.tsx:57-95` uses `group/field` + `data-[invalid=true]:text-destructive` to turn the label red. Without `data-invalid` on `Field`, the label stays black while the input shows `aria-invalid:border-destructive` — inconsistent error signal. Screen readers also rely on `aria-invalid` on the control.

#### 5.1.3 Rule: `FieldSet` + `FieldLegend` for groups (forms.md)

- **F1** groups sub-criteria under `Weights` parents with `div.mt-4.space-y-4.rounded-lg.bg-muted/40` + manual `Separator` (`WeightsUpdateSection.tsx:185-196`). Should be `<FieldSet><FieldLegend variant="label">Sub-Kriteria</FieldLegend><FieldDescription>Sub bobot harus total 100%</FieldDescription>` — especially because weights are a related set where the sum constraint is the whole point. Current `span.text-xs.font-semibold.uppercase.tracking-wider` mimics a legend but is not semantic (`fieldset`/`legend` give screen readers grouping).
- **F4** 7 assessment criteria (`age..damage` + `lastMaintenance`) are logically a set but rendered as 7 loose `Field`s in one `FieldGroup`. Assessment fields `structure/architecture/mep/utility/damage` are all 0–3 scales — ideal for `FieldSet`/`FieldLegend` = `Kriteria Penilaian (0–3)` + `FieldDescription` explaining the rubric.

#### 5.1.4 Rule: `InputGroup`, `ToggleGroup` (forms.md)

No violations here — forms correctly _don’t_ use `InputGroup` where not needed. Note for future: assessment 0–3 scores (6 narrow options) are a candidate for `ToggleGroup` (2–7 choices) instead of freeform `type="number"`; see §5.3.

### 5.2 Form-by-Form Deep Dive

#### F1 — Weights (`WeightsUpdateSection.tsx`) — The Critical One

**What’s right:**

- Uses `Controller` correctly for dynamic keys (weights are server-driven, `z.record` schema is the right call at `WeightsUpdateSection.tsx:33-36`).
- `FieldLabel` + `FieldError` present, `data-invalid`/`aria-invalid` paired — the only admin form that does this.
- Progressive disclosure: parent card + collapsible sub-grid (`WeightsUpdateSection.tsx:184-236`) keeps dense config scannable.
- Visual sum affordance: `h-2` progress bar + `Badge` for main total (`:112-127`) — good cockpit pattern.

**What’s broken — P0 bugs:**

**BUG-1 — Silent sub-weight drop (correctness, P0).** `WeightsUpdateSection.tsx:83-88`:

```ts
const payload = {
  weights: data?.map((main) => ({ ...main, value: formData[main.key] })) || [],
};
```

`formData` holds both main _and_ sub keys (`:58-64` builds `defaults[ sub.key ]`), but `payload` only writes `value` for mains. Each `...main` preserves `main.subWeights` with **old values**. User changes `Sub-Kriteria` → `Simpan Bobot` → `toast.success` → reload → reverts. No server error, no hint. **Repro:** edit any sub-weight, submit, `await getWeights()` — server still old.

Fix:

```ts
weights: data!.map((main) => ({
  ...main,
  value: formData[main.key],
  subWeights: main.subWeights?.map((sub) => ({
    ...sub,
    value: formData[sub.key] ?? sub.value,
  })),
}));
```

**BUG-2 — Sub-total validation is cosmetic (UX + correctness, P0).** `isSubValid` only toggles text color `text-green-600`/`text-destructive` (`:189-193`) and `Total: XX%`. Neither `Field` is marked invalid nor is submit blocked. `isMainTotalValid` blocks submit (`:275 disabled={!isMainTotalValid}`) but sub-validity does not. User can save with sub-totals 40% or 180% — silent corruption of SAW inputs.

Fix: Compute `allSubsValid = data.every(m => !m.subWeights?.length || Math.abs(m.subWeights.reduce((s,x)=>s+Number(formValues[x.key]||0),0)-1) < 0.001)` and `disabled={!isMainTotalValid || !allSubsValid}` + render `<FieldError>` per sub group or `<FieldDescription className="text-destructive">Sub bobot harus total 100%</FieldDescription>` when invalid.

**Performance anti-pattern:** `const formValues = useWatch({ control })` (`:54`) with no `name` subscribes to the _entire_ form. With 25+ `Controller` fields, every keystroke recomputes `mainTotal` _and_ every card’s `subTotal` and re-renders all `Card`s. On low-end devices, typing lag visible. Fix: `useWatch({ control, name: main.key })` per card or extract `WeightCard` memoized component with its own `useWatch`.

**Schema issues:** `z.record(z.string(), z.number().min(0).max(1))` validates per-field but not cross-field sum. `zodResolver` correctly handles `NaN` from `valueAsNumber` (empty → `NaN` → `Harus berupa angka`), but UX shows generic `Invalid` without hint `0.00–1.00`. Add `FieldDescription` per input `Nilai 0.00–1.00, total utama = 100%`.

**Styling / shadcn:** `sticky top-4 z-20` header (`:109`) + `fixed bottom-6 z-40` footer (`:245`) duplicate total info and compete for z. `space-y-8 pb-20` on `form` (`:106`) underestimates fixed footer height on mobile (`flex-col` two rows). `field.tsx:49` `FieldGroup gap-7` + card `space-y-6` (`:153`) double-gap.

**Empty/loading:** `isLoading → <div className="p-10 text-center">Memuat konfigurasi...</div>` (`:99-100`) should be `Skeleton` grid matching cards. `No data` fallback `Belum ada data bobot` (`:117`) inside `CardContent` is OK but should be `Empty`.

#### F2/F3 — Building Add/Edit (`BuildingDialog.tsx`)

**Schema:**

```ts
// features/buildings/type.ts:26-37
createBuildingSchema: code min(1), name min(1) max(20), latitude/longitude z.coerce.number
updateBuildingSchema: same without code
```

- `latitude`/`longitude` use `z.coerce.number("Must be a valid number")` with no bounds. Accepts `9999`, `-9999`, `Infinity` via manual text input. Should be `z.coerce.number().min(-90).max(90)` for latitude, `min(-180).max(180)` for longitude with ID copy: `Latitude -90 s.d. 90`.
- `name` `max(20)` is arbitrary; `maxLength={20}` on `Input` (`BuildingDialog.tsx:151`) silently prevents typing without explaining why. At least show `FieldDescription` `Maks 20 karakter` + character count.
- No trim: `z.string().min(1)` passes `"   "` (spaces) as valid. Should be `z.string().trim().min(1)`.
- `code` uniqueness not validated client-side (server will 409, but UX could pre-check against `useBuildings()` list).

**Form wiring:**

- Uses `form.register("code")` (`:132`) with `type="text"` for numeric `latitude`/`longitude` (`:165,178` `type="text"`). Combined with `z.coerce.number`, empty string → `NaN` → Zod error `Must be a valid number` → raw span. But `placeholder="-6.200000"` hints numeric, while `type="text"` shows text keyboard on mobile (not `inputmode="decimal"`). Should be `type="number"` with `step="any"` or `type="text" inputMode="decimal"` + explicit `valueAsNumber` handling.
- `defaultValues` set via `useEffect` on `open` (`:69-78`). Correct for dialog re-use but `form.reset` is called with `initialData?.latitude` which is `number | undefined`. When `undefined`, `Input` receives `value=""` via `register` — OK, but numeric `0` (Equator) would be treated as missing. Use nullish check.
- `htmlFor`↔`id` linking is correct (`Label htmlFor="code"` + `Input id="code"`), but `Label` not `FieldLabel` so `data-invalid` styling misses.
- **Controlled vs uncontrolled `Dialog` bug surface:** Supports both controlled (`open`/`onOpenChange` from `column.tsx:75-81` edit) and uncontrolled (`internalOpen`). When used as controlled edit, `trigger` is `null` (`:95-108`). Correct pattern, but `open` vs `defaultOpen` normalization fragile — if parent passes `open={false}` then quickly `true`, `useEffect` reset may race. Consider `key={open+initialData?.code}` to force remount.
- **Submit:** `Button type="submit" disabled={isPending}` (`:199`) correctly disables. Missing `aria-busy`/`Spinner`. `LoginForm.tsx:120` correctly uses `LoaderCircle animate-spin`; Building should match: `<Spinner data-icon>` + `disabled`.

**UX gaps:**

- `Dialog` has no `FieldDescription` for any field — admin has no hint that code is immutable after creation (only implied by `!isEdit && ...`).
- `DialogFooter` Cancel uses `DialogClose asChild` (`:194`) correct, but Confirm has no loading affordance beyond text `Saving…`.
- Reset on success `form.reset()` (`:88`) without args clears to empty defaults, but dialog closes anyway (`setOpen(false)`). On next open, `useEffect` repopulates — OK.

**A11y:**

- `DialogContent sm:max-w-md` needs `DialogTitle` ✓ (`:112-115`) and `DialogDescription` ✓ (`:117-122`) — present. Good.
- But `Field` + `Label` combo means `Label` does not inherit `data-invalid` red state. Switch to `FieldLabel` (`field.tsx:110`) which supports `group-data-[invalid]` styling.

#### F4 — Assessment Create (`CreateDialog.tsx`)

**Same structural issues as Building plus worse content risk:**

- **7 loose numeric fields** (`age`, `structure`, `architecture`, `mep`, `utility`, `damage`, `lastMaintenance`) rendered as vertical stack with only `FieldGroup py-4 space-y-3` (`CreateDialog.tsx:78`). No grouping — violates `FieldSet` guidance for related criteria. Should be:

  ```tsx
  <FieldSet>
    <FieldLegend>Kriteria Penilaian</FieldLegend>
    <FieldDescription>Nilai 0–3. Lihat rubrik di dokumentasi.</FieldDescription>
    <FieldGroup className="grid sm:grid-cols-2">
  ```

- **No affordance for 0–3 scale.** Schema `assessments/type.ts:5-24` defines `structure/architecture/mep/utility/damage` as `min(0).max(3)` but `CreateDialog.tsx:98-101` renders `<Input type="number" step="any" placeholder="Enter structure score">` with no hint. User types `5` → Zod error `Structure must be at most 3` via raw span (`:104-107`). Should be `ToggleGroup` with `0/1/2/3` or at least `InputGroup` with `min=0 max=3 step=1` + `FieldDescription` `Rentang: 0 (rusak) – 3 (baik)`.
- **Default `0` biases data.** `CreateDialog.tsx:38-43` `defaultValues: age:0, structure:0,...` means opening the dialog shows 7 zeros. User clicking `Save changes` without editing silently creates an all-zero assessment (looks intentional, but is default). Better `undefined` defaults + `placeholder="0–3"` so empty → required validation, not implicit zero.
- **`lastMaintenance` date bug.** `type.ts:25` `z.coerce.date("Last Maintenance must be a valid date")` + `CreateDialog.tsx:178` `<Input type="date">` yields `YYYY-MM-DD` (local) → `new Date("2026-01-15")` parsed as UTC midnight → displayed via `Intl.DateTimeFormat("id-ID", {dateStyle:"long", timeStyle:"short"})` (`features/assessments/components/column.tsx:154-159`) off by one day for WIB. Also `placeholder="Enter last maintenance date"` is ignored for `type="date"`.
- **`buildingCode` gating:** `CreateDialog.tsx:48` `if (!buildingCode) return;` silently no-ops if dialog opened without code. Should disable trigger + show `Empty` with link back to Buildings.
- **Shadcn violations identical to Building:** `Label` not `FieldLabel`, raw `span.text-red-500` not `FieldError`, no `data-invalid`/`aria-invalid` pairing.
- **Button:** `disabled={isPending || !buildingCode}` (`:197`) correct but copy `Saving…` should be spinner + `Menyimpan…` consistent with Weights’ ID locale.

#### F5 — Auth Login/Register (`LoginForm.tsx` / `RegisterForm.tsx`) — The Reference

**What’s correct (keep as pattern for F2–F4 refactor):**

- `Controller` + `Field data-invalid` + `FieldLabel` + `Input aria-invalid` + `FieldError errors={[fieldState.error]}` all paired correctly (`LoginForm.tsx:74-90`, `RegisterForm.tsx:69-88`).
- `FieldGroup` correctly used (`LoginForm.tsx:70`) — minimal `gap` via `field.tsx:49` not manual `space-y`.
- Disabled handled (`Button disabled={isPending}` + `Input` not explicitly disabled but `isPending` via `useTransition` prevents double-submit).

**What to improve (minor, P2):**

- **Icons** `LoaderCircle`/`LogIn`/`UserPlus` use `className="mr-2 h-4 w-4"` (`LoginForm.tsx:8,121-124`). Per `shadcn/rules/icons.md`, button icons should be `data-icon="inline-start"` without sizing class; the `Button` CSS sizes via `has-[>svg]:px-3`.
- **Error surfacing:** `loginAction.ts:48-53` and `registrationAction.ts:48-58` return `{status:"error", message}` which is surfaced only via `toast.error` (`LoginForm.tsx:50-52`). Field-level server errors (e.g., `Email already in use` → `:42`) are not mapped to `form.setError("email", {message})`. All server errors become toasts, losing field association.
- **Register pending:** `RegisterForm.tsx:34` uses `useState` `isPending` (`setIspending` typo lower-k) while Login uses `useTransition`. Inconsistent; prefer `useTransition` for server actions. Typo `setIspending` vs `setIsPending` signals lack of shared hook.
- **Password confirmation:** `authSchema.ts:17-19` `.refine` on `confirmPassword` is correct but shows error only on `confirmPassword` field.
- **Reset behavior:** `RegisterForm.tsx:57` `form.reset()` runs even on error — clears user’s typed email after `Email already in use`, forcing retype. Should reset only on success.

### 5.3 Design / Copy / Anti-Slop for Forms

- **Placeholder as label — flagged in 6 places.** `BuildingDialog.tsx:131` `placeholder="e.g., E01"`, `CreateDialog.tsx:84` `placeholder="Enter age"` etc. Placeholders repeat the label and vanish on type, hurting a11y. F5 does `placeholder="email@unnes.ac.id"` with a visible `FieldLabel` — OK. For admin, keep `FieldLabel` visible and use `placeholder` for example values only, not instruction. Assessment placeholders like `Enter mep score` add no info beyond label `mep` (should be `MEP` + `FieldDescription`).
- **Helper text missing where most needed.** Weights subs have no rubric. Assessment 0–3 has no rubric. Building coords have no hint `Koordinat desimal, contoh -7.29, 110.41 (cek di Google Maps)`. Add `FieldDescription` per shadcn.
- **One copy register per form.** Admin mixes `Add New Assessment` (EN) + `Nama Lengkap` (ID in register) + `Simpan Bobot` (ID). Pick one locale per surface. Thesis admin leans ID — align `Save changes` → `Simpan`, `Cancel` → `Batal`.
- **Floating label / dense grid:** `WeightsUpdateSection.tsx:130` `grid-cols-1 md:grid-cols-2` plus inner `sm:grid-cols-2 lg:grid-cols-3` for subs is good density (~5). No bento-slop.

### 5.4 Logic / Validation Matrix for Forms

| Form            | Schema                               | Client validation                            | Server re-validate                                                                                                                                                                               | Gap                                                                                              |
| --------------- | ------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| Weights         | `z.record(z.number().min(0).max(1))` | Per-field 0–1 only; main sum toast + disable | `weightsSchema.safeParse` in action? `features/weights/api/update-weights.ts:23-27` just forwards to `backendClient.put` without local Zod — trusts client. **Backend must also enforce sum=1.** | Sub sums not validated anywhere.                                                                 |
| Building create | `type.ts:26-31`                      | `min1`/`max20`/`coerce number`               | `loginAction.ts:15-18` re-parses; building create (`api/create-building.ts`) likely backend validates. OK.                                                                                       | No trim, no bounds, empty `""` vs `0` handling.                                                  |
| Building update | `type.ts:33-37`                      | Same                                         | Same                                                                                                                                                                                             | Code field disabled, but API still accepts code change? Check `api/update-building.ts` contract. |
| Assessment      | `type.ts:3-26`                       | `min(0).max(3)` + `coerce.date`              | `CreateDialog` posts to `hooks/useAssessments.create` → backend validates again.                                                                                                                 | `type="number"` + `z.coerce` + `step="any"` allows `0.001` where rubric is integer 0–3.          |
| Login           | `authSchema:3-6`                     | `z.email()` + `min1`                         | `loginAction.ts:15-18` `safeParse` again                                                                                                                                                         | Password min1 too weak client hint (server enforces longer).                                     |
| Register        | `authSchema:8-20`                    | `min3`/`email`/`min8` + `refine` confirm     | `registrationAction.ts:13-18` re-parse                                                                                                                                                           | Good.                                                                                            |

**Key principle:** Every form correctly re-validates server-side via `safeParse` in the action (auth forms) — except Weights which skips local `safeParse` and forwards straight to backend. Add `safeParse` + sum check in `update-weights.ts` server action.

### 5.5 Implementation / Architecture for Forms

- **Pattern split — shallow duplication again.** 4 admin forms use 3 different form patterns: F1 `Controller` + `useWatch`, F2/F3 `register` + `useEffect reset`, F4 `register` + inline `step="any"`. F5 `Controller` + `Field` is the canonical shadcn pattern. The codebase pays maintenance cost for 2 patterns that do the same job. Deepen: one `AdminForm` convention (`Controller` everywhere, `FieldLabel`/`FieldError`, `data-invalid`/`aria-invalid`). Delete `register` path.
- **Hook seams:** `useUpdateWeights`, `useAddBuilding`, `useCreateAssessment` share identical `useMutation` + optimistic update + `toast` + `invalidateQueries` skeleton. No deep `useOptimisticMutation` module — shallow leakage.
- **`form.reset()` races:** Both `BuildingDialog.tsx:69-78` (effect on `open`) and `WeightsUpdateSection.tsx:56-67` (effect on `data`) call `reset` imperatively. Works but is fragile to React 19 concurrent rendering — prefer `values` prop or `key={dataKey}` remount.
- **Bundle:** `zodResolver` imported in every form — correct, shared via `package.json:46`.

### 5.6 Prioritized Fixes for Forms

#### P0 — Correctness (Ship Before Demo)

- [x] **F-P0-1 Sub-weights silent drop → persist + block.** `P0` `Correctness` `Forms` `Weights` — File: `WeightsUpdateSection.tsx:83-88, 132-137, 275`. See BUG-1/BUG-2 above. Add sub-map in payload, add `allSubsValid` gate, map to `FieldError` per parent.

- [ ] **F-P0-2 Normalize F2/F3/F4 to F5’s Controller pattern.** `P0` `Shadcn` `Forms` `A11y` — Files: `BuildingDialog.tsx:127-190`, `CreateDialog.tsx:79-188`. Replace `Label`→`FieldLabel`, raw `span`→`FieldError`, add `Field data-invalid` + `Input aria-invalid`. Use `Controller` not `register` for consistency (especially for `type="number"` where `valueAsNumber` matters). Ensures disabled/error styling works via `field.tsx:57` selectors.

- [ ] **F-P0-3 Building coordinate bounds + trim.** `P0` `Correctness` `Forms` `Validation` — File: `features/buildings/type.ts:26-37`. Change to `z.string().trim().min(1).max(20)` and `z.coerce.number().min(-90).max(90)` / `.min(-180).max(180)` with ID messages. Add `FieldDescription` hints + `inputMode="decimal"` for mobile.

- [ ] **F-P0-4 Assessment 0–3 affordance + defaults.** `P0` `Correctness` `Forms` `UX` — Files: `CreateDialog.tsx:37-43, 79-188`, `features/assessments/type.ts:3-26`. Change defaults to `undefined` (so empty is invalid, not silent zero), add `FieldSet`/`FieldLegend`, constrain `Input` `min={0} max={3} step={1}` or `ToggleGroup` 0/1/2/3, add rubric `FieldDescription`.

#### P1 — UX / A11y for Forms

- [ ] **F-P1-1 Add missing FieldDescriptions.** `P1` `Forms` `UX` — Weights: per parent `Bobot 0.00–1.00`, Assessment: `Rentang 0–3 (0 rusak … 3 baik)`, Building: `Kode unik, tidak dapat diubah setelah dibuat`.

- [ ] **F-P1-2 Wire server field errors to form.** `P1` `Forms` `UX` — Files: `features/auth/components/LoginForm.tsx:48-52`, `features/buildings/hooks/useBuildings.ts:55-61`, `features/weights/hooks/useWeights.ts:22-26`. On 4xx, call `form.setError(field, {message: localized})` instead of only `toast.error`.

- [ ] **F-P1-3 Pending affordance.** `P1` `Forms` `A11y` `Shadcn` — Replace `Saving…`/`Menyimpan…` text-only with `<Spinner data-icon="inline-start" />` + `disabled` + `aria-busy`, per `shadcn/rules/composition.md` (Button has no `isPending`). Standardize RegisterForm to `useTransition` like LoginForm.

- [ ] **F-P1-4 Dialog focus management.** `P1` `A11y` `Forms` — Ensure `DialogContent` traps focus, `DialogClose` returns focus to trigger. Current `BuildingDialog` controlled via dropdown (`column.tsx:48-51 onSelect preventDefault`) correctly avoids double-close — keep but standardize.

#### P2 — Polish for Forms

- [ ] **F-P2-1 Deduplicate form hooks.** `P2` `Architecture` `Forms` — Extract `useAdminMutation` with `{queryKey, optimisticUpdater, toast}`.

- [ ] **F-P2-2 i18n pass.** `P2` `UX` `i18n` — Align button copy: Weights `Simpan/Reset`, Building `Simpan/Batal`, Assessment `Tambah/Batal`, Auth keeps ID. Remove placeholder-as-instruction (`Enter …`) in favor of example placeholders.

---

## 6. Cross-Cutting Findings

### 6.1 Naming & Consistency

- Route naming: `/admin/dss` + `Saw Calculation` label (`sidebar.tsx:44`) mixes acronym + human. Pick `SAW` or `DSS`, not `Saw`.
- `Weights` page component (`features/weights/page.tsx:11`) exported as `OverviewPage` (copy-paste from dashboard) — confusing in DevTools / stack traces.
- `TGetResultsResponse` vs `Results` vs `RunDetail` — three names for same SAW run concept.

### 6.2 Git Hot-Spots

- `git log --oneline` shows dense churn on `weights/*` and `map/*` + sidebar auth — precisely where bugs lie (`subWeights` drop, session trust). No `CONTEXT.md`, no `docs/adr/` — future reviewer will re-introduce same shallow Table split.

---

## 7. Prioritized Recommendations (Combined — Forms Included)

**Tag legend:** `P0` = blocker (correctness/security, blocks thesis defense), `P1` = high-value UX/a11y (demo will feel broken without), `P2` = polish/leverage. Secondary tags: `[Security]` `[Correctness]` `[Forms]` `[Tables]` `[A11y]` `[Perf]` `[Shadcn]`.

> **Tracking — persists across sessions:** Each item below is a GitHub task-list checkbox (`- [ ]` / `- [x]`). Tick it by editing this file (`- [x]`) and committing — next chat I’ll read the file and know what’s done. You can also say “mark P0-3 done” and I’ll toggle it. Progress: `24` open / `3` done (auto-count `grep -c "- \[x\]"` — P0-1 #1 + P0-2 this session + pre-existing).

| ID   | Tags                                    | One-liner                                   |
| ---- | --------------------------------------- | ------------------------------------------- |
| P0-1 | `P0` `Correctness` `Forms` `Weights`    | Sub-weights dropped on save                 |
| P0-2 | `P0` `Security` `Auth`                  | Admin trusts unsigned `spk.session`         |
| P0-3 | `P0` `Architecture` `Tables`            | 4× DataTable → 1 deep module                |
| P0-4 | `P0` `Correctness` `Cache`              | Stale Overview (`lastest-run` + `Infinity`) |
| P0-5 | `P0` `A11y` `Shadcn`                    | Nested `Dialog` in `DropdownMenu`           |
| P0-6 | `P0` `Shadcn` `Forms` `A11y`            | Normalize `register` → `Controller`         |
| P0-7 | `P0` `Correctness` `Forms` `Validation` | Coords bounds + assessment 0–3              |
| P1-1 | `P1` `UX` `Forms` `Empty`               | Missing Empty/Skeleton/error.tsx            |
| P1-2 | `P1` `UX` `A11y`                        | Active nav + Breadcrumb                     |
| P1-3 | `P1` `UX` `Forms` `Perf`                | Weights sticky/footer + `useWatch`          |
| P1-4 | `P1` `A11y` `Tables`                    | `aria-sort` + Pagination + map KB           |
| P1-5 | `P1` `UX` `i18n`                        | Single locale pass                          |
| P1-6 | `P1` `Forms` `A11y`                     | `form.setError` + Spinner pending           |
| P2-1 | `P2` `Shadcn` `Polish`                  | D1–D9 sweep                                 |
| P2-2 | `P2` `Perf`                             | Map cluster + lazy CSS                      |
| P2-3 | `P2` `Architecture`                     | `CONTEXT.md` + rename `criterias`           |
| P2-4 | `P2` `Architecture` `Polish`            | `sortableHeader` + `useOptimisticDelete`    |

### P0 — Fix Before Any UX Polish (Correctness / Security)

- [x] **P0-1 Fix sub-weights persistence bug.** `P0` `Correctness` `Forms` `Weights` _(also F-P0-1)_  
      File: `features/weights/components/WeightsUpdateSection.tsx:83-89` + `features/weights/api/update-weights.ts:19-34`.  
      Change:

```ts
const payload = {
  weights: data!.map((main) => ({
    ...main,
    value: formData[main.key],
    subWeights: main.subWeights?.map((sub) => ({
      ...sub,
      value: formData[sub.key] ?? sub.value,
    })),
  })),
};
```

Validate: edit a sub-weight, submit, hard reload, assert new value persists. Add blocking `isSubValid` checks + disable submit until all sub-totals valid. _See §5.2 BUG-1/BUG-2._

- [x] **P0-2 Fix admin auth trust.** `P0` `Security` `Auth` `Logic` — **DONE 2026-08-31 (grilled A: `GET /auth/me` live, fail-closed)**  
      File: `features/dashboard/layout.tsx:13-31` → **rewritten** `features/dashboard/layout.tsx:1-66` to `backendClient.get("/auth/me", {headers:{"Cache-Control":"no-store"}})` every render (`export const dynamic="force-dynamic"`), `isAdmin = data.isAdmin ?? role==="admin"`, `401→/auth?next=/admin&reason=unauthenticated`, `403/!isAdmin→/auth?reason=forbidden`, `500/timeout→/auth?reason=unavailable` (both toast+Alert), `DYNAMIC_SERVER_USAGE` rethrow. Also fixed `lib/api/server.ts:16,71,80` refresh cookie bug `access-token→spk.access-token` + `refresh-token→spk.refresh-token` + `maxAge` + `timeout:5000` + `sameSite:lax`; `features/auth/api/getCurrentUser.ts:1-14` hardened (no early reject, `no-store`); `app/api/auth/me/route.ts:8-36` branched 401/403/500/504 `no-store`; `features/auth/page.tsx:5` + `app/(auth)/auth/page.tsx:1` now accept `searchParams.reason` and render **new** `features/auth/components/AuthReasonAlert.tsx:1` (toast+Alert) + **new** `components/ui/alert.tsx:1` shadcn; `features/auth/actions/loginAction.ts:37` added `sameSite:"lax"` to 3 cookies. Build `next build` 77s passes, routes `ƒ /admin` dynamic. Verify: forge `spk.session` → 302 to `?reason=forbidden` (no sidebar).

- [ ] **P0-3 Consolidate 4× DataTable → 1 deep module.** `P0` `Architecture` `Tables` `Shadcn`  
      New: `components/admin/AdminDataTable.tsx` (or `features/shared/table/AdminTable.tsx`) exposing:

```ts
type AdminTableProps<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  filterKey?: string;
  filterPlaceholder?: string;
  renderAction?: ReactNode;
  empty?: { title: string; description: string; action?: ReactNode };
  isLoading?: boolean;
};
```

Inline sorting/filter/pagination/skeleton/Empty inside. Replace 4 files with one import. Extract `sortableHeader(label, tooltip?) => ColumnDef header` helper to kill 18× duplicate.

- [ ] **P0-4 Fix stale Overview.** `P0` `Correctness` `Cache` `Logic`  
      Files: `features/dss/hooks/useDSS.ts:26-28`, `features/dashboard/components/MainContent.tsx:23`.  
      Centralize keys (`lib/queryKeys.ts`: `dss: { all: ["dss"], latest: ["dss","latest"], details: (id)=>["dss","details",id] }`), invalidate `["dss","latest"]` on calc/delete, set `staleTime: 5*60*1000` (or keep Infinity but invalidate correctly), fix typo `lastest`→`latest` (codemod).

- [ ] **P0-5 Fix nested interactive & destructive dialog.** `P0` `A11y` `Shadcn` `UX`  
      Files: `features/dashboard/components/ConfirmationDialog.tsx:1-62`, all `column.tsx:ActionCell`.  
      Replace with `AlertDialog` primitive, render sibling to `DropdownMenu`, manage `open` via local state, `DropdownMenuItem onSelect={e=>{e.preventDefault(); setConfirmOpen(true)}}`. Follow `composition.md` rule strictly. Fixes keyboard trap and Radix warnings.

- [ ] **P0-6 Normalize admin forms to Controller pattern (also F-P0-2).** `P0` `Shadcn` `Forms` `A11y`  
      Files: `BuildingDialog.tsx:127-190`, `CreateDialog.tsx:79-188`. Replace `Label`→`FieldLabel`, raw `span.text-red-500`→`FieldError`, add `Field data-invalid` + `Input aria-invalid`. Use `Controller` not `register`. Ensures disabled/error styling works via `field.tsx:57` selectors. Fixes 3 shadcn rule fails in one sweep.

- [ ] **P0-7 Building coordinate bounds + Assessment defaults (also F-P0-3/F-P0-4).** `P0` `Correctness` `Forms` `Validation`  
      Files: `features/buildings/type.ts:26-37` (`z.string().trim().min(1).max(20)`, `z.coerce.number().min(-90).max(90)`/`min(-180).max(180)`), `CreateDialog.tsx:37-43` (defaults `undefined` not `0`), add `FieldSet`/`FieldLegend` + `ToggleGroup` 0–3 or `min/max/step` constraints.

### P1 — High-Value UX / A11y

- [ ] **P1-1 Missing states.** `P1` `UX` `Forms` `Empty` `A11y`

- Add `Empty` (with `EmptyMedia` illustration) to Buildings/DSS/Assessments when `data.length===0`. Use `Empty` from shadcn for Assess-building with zero assessments (distinct from global empty).
- Replace plain loading divs with `Skeleton` grids + map skeleton (already present in `MapView.tsx:64-66` — reuse pattern).
- Add `error.tsx` + `loading.tsx` per `app/(main)/admin/**/`. Render `isError` branches in `TableSection`/`MainContent` with `Alert` + retry `Button`.
- Also add `FieldDescription` per form field (Weights `0.00–1.00`, Building `Maks 20 karakter` + coords hint, Assessment `0–3` rubric) — _also F-P1-1_.

- [ ] **P1-2 Active navigation + breadcrumb fix.** `P1` `UX` `A11y` `Shadcn`

- `sidebar.tsx`: `const pathname = usePathname(); isActive={pathname===item.url || pathname.startsWith(item.url+"/")}`.
- `header.tsx:35`: change `i < path.length` to `i < path.length -1`, render `Breadcrumb` primitives, add `BreadcrumbPage` for `page` (not a link). Internationalize separator.

- [ ] **P1-3 Weights ergonomics.** `P1` `UX` `Forms` `Perf` `A11y`
      Remove duplicate sticky total bar (keep one — fixed footer is better for long forms). Add `pb-[160px]` to form to clear footer on mobile. Confirm on Reset via `AlertDialog`. Show inline `FieldError` for sub-totals not summing to 100%. Use `useWatch({name})` per card or memoized `WeightCard` to stop full re-render. _Also F-P1-3/F-P1-4._

- [ ] **P1-4 Table affordances.** `P1` `A11y` `Tables` `UX`

- Add `aria-sort` on `<TableHead>`, map `ArrowUpDownIcon` → `ArrowUp`/`ArrowDown` by `getIsSorted()`.
- Add `Pagination` (8–10 rows/page, page-size select 10/25/50) via `getPaginationRowModel`.
- Make markers keyboard-accessible (`MapView.tsx:101` Marker child needs `tabIndex=0`, `role=button`, `onKeyDown` Enter/Space).

- [ ] **P1-5 i18n single-locale pass.** `P1` `UX` `i18n` `Forms`
      Decide ID vs EN for admin. Thesis admin is likely ID — translate header/page titles/`SiteHeader` `page` props, toast messages, `ConfirmationDialog` generic strings, table headers. Use one locale file or at least consistent strings. _Also covers F-P1-2 field error wiring + F-P2-2 copy register._

- [ ] **P1-6 Wire server field errors + pending affordance for forms.** `P1` `Forms` `A11y` `Shadcn`
      On 4xx, call `form.setError(field, {message})` not just `toast.error` (`LoginForm.tsx:48-52`, `useBuildings.ts:55-61`). Replace `Saving…` text with `<Spinner data-icon="inline-start" />` + `aria-busy`. Standardize `RegisterForm.tsx:34` `useState` → `useTransition`. _Also F-P1-2/F-P1-3._

### P2 — Polish / Leverage

- [ ] **P2-1 Shadcn compliance sweep.** `P2` `Shadcn` `Polish` `A11y`
      Apply D1–D9 fixes (gap, size-\*, semantic tokens, FieldError, AlertDialog, Empty, data-icon, Skeleton). Run `npx shadcn@latest add breadcrumb empty alert-dialog pagination field` and wire. Covers remaining `icons.md` (`LoaderCircle` `data-icon`) and `styling.md`.

- [ ] **P2-2 Map performance.** `P2` `Perf` `UX`
      Cluster markers beyond 50 buildings. Lazy-load `maplibre-gl.css` + `MapView` via `dynamic(() => import(...), {ssr:false})` to avoid pulling 200KB CSS into non-map routes.

- [ ] **P2-3 Domain language.** `P2` `Architecture` `Polish`
      Create `CONTEXT.md` defining `Building`, `Assessment` (aka `Criteria`), `Weight`/`SubWeight`, `SawRun`/`SawRunDetail`, `Priority` scale. Rename `criterias` → `criteria` (mass noun, no plural), unify `TGetResultsResponse` type single source.

- [ ] **P2-4 Extract pure helpers.** `P2` `Architecture` `Polish` `Reuse`

- `buildSortableHeader(label)` helper.
- `buildChartData(weights)` pure fn for `WeightsPieChart` (extract color config, make deterministic sort + stable color map).
- `useOptimisticDelete` + `useAdminMutation` generic hook (covers tables + forms, also F-P2-1).

---

## 8. Appendix

### 8.1 Files Read (Evidence Set)

**Admin shell + dashboard:** `app/(main)/admin/layout.tsx:1`, `app/(main)/admin/page.tsx:1`, `app/(main)/admin/dss/page.tsx:1`, `app/(main)/admin/buildings/page.tsx:1`, `app/(main)/admin/buildings/[code]/assessments/page.tsx:1`, `app/(main)/admin/weights/page.tsx:1`, `app/(main)/admin/dss/[runId]/page.tsx:1`, `features/dashboard/layout.tsx:1-46`, `features/dashboard/page.tsx:1-31`, `features/dashboard/components/sidebar.tsx:1-96`, `features/dashboard/components/header.tsx:1-47`, `features/dashboard/components/MainContent.tsx:1-119`, `features/dashboard/components/WeightsPieChart.tsx:1-124`, `features/dashboard/components/MapWidget.tsx:1-19`, `features/dashboard/components/ConfirmationDialog.tsx:1-63`, `components/UserNav.tsx:1-195`, `components/ui/sidebar.tsx:1-726`, `components/ui/dialog.tsx:1-158`, `components/ui/card.tsx:1-92`, `components/ui/table.tsx:1-116`, `components/ui/field.tsx:1-248`, `components/ui/input.tsx:1-21`, `components/ui/label.tsx:1-24`, `components/ui/button.tsx:1-60`.

**DSS + Buildings + Assessments + Weights + Map:** `features/dss/page.tsx:1-29`, `features/dss/components/TableSection.tsx:1-37`, `features/dss/components/column.tsx:1-147`, `features/dss/components/data-table.tsx:1-118`, `features/dss/components/run/MainContent.tsx:1-96`, `features/dss/components/run/column.tsx:1-131`, `features/dss/components/run/data-table.tsx:1-118`, `features/dss/hooks/useDSS.ts:1-98`, `features/dss/api/get-results.ts:1-35`, `features/dss/api/get-last-run.ts:1-35`, `features/dss/api/run-calculation.ts:1-36`, `features/buildings/page.tsx:1-28`, `features/buildings/components/TableSection.tsx:1-25`, `features/buildings/components/data-table.tsx:1-118`, `features/buildings/components/column.tsx:1-177`, `features/buildings/components/BuildingDialog.tsx:1-207`, `features/buildings/type.ts:1-69`, `features/buildings/hooks/useBuildings.ts:1-140`, `features/assessments/page.tsx:1-49`, `features/assessments/components/TableSection.tsx:1-24`, `features/assessments/components/column.tsx:1-178`, `features/assessments/components/CreateDialog.tsx:1-205`, `features/assessments/type.ts:1-28`, `features/weights/page.tsx:1-30`, `features/weights/components/WeightsUpdateSection.tsx:1-285`, `features/weights/api/get-weights.ts:1-53`, `features/weights/api/update-weights.ts:1-36`, `features/weights/hooks/useWeights.ts:1-36`, `features/map/components/MapView.tsx:1-170`.

**Auth (gates admin):** `features/auth/components/LoginForm.tsx:1-137`, `features/auth/components/RegisterForm.tsx:1-182`, `features/auth/types/authSchema.ts:1-23`, `features/auth/actions/loginAction.ts:1-100`, `features/auth/actions/registrationAction.ts:1-62`.

**Config:** `components.json:1-24`, `package.json:1-61`, `app/globals.css:1-163`.

### 8.2 What Was _Not_ Done (remaining)

Initially read-only per instructions — now **P0-1 and P0-2 are implemented** (see above + §8.4). All other findings remain read-only until you approve next P0. Report output to `./docs/reports/` as living tracker.

### 8.3 Changes Implemented This Session (P0-2) — Evidence

**Commit (uncommitted working tree 2026-08-31, base `4b8306a`):** `git diff --stat HEAD` 7 modified + 2 new files, 122+67 lines:
- `M lib/api/server.ts:16` `timeout:5000`; `M lib/api/server.ts:71,80` `access-token→spk.access-token` + `refresh-token→spk.refresh-token` + `maxAge 7d/30d` + `sameSite:lax` — fixes refresh infinite 401 loop.
- `M features/auth/api/getCurrentUser.ts:1-14` removed `cookies().get` early reject, `backendClient.get("/auth/me", {headers:{"Cache-Control":"no-store"}})` only.
- `M app/api/auth/me/route.ts:8-36` branched `401`/`403`/`500`/`!response→504` with `Cache-Control: no-store`, deleted tokens only on 401.
- `M features/dashboard/layout.tsx:1-66` deleted `JSON.parse(spk.session)` trust `L21-28`, added `axios`+`backendClient` fail-closed gate, `dynamic="force-dynamic"`, `DYNAMIC_SERVER_USAGE` rethrow, `401→/auth?next=/admin&reason=unauthenticated`, `!isAdmin→/auth?reason=forbidden`, `500/timeout→/auth?reason=unavailable`, `console.error`.
- `M features/auth/actions/loginAction.ts:37` `// sameSite:'lax'` → `sameSite:"lax"` on 3 cookies (CSRF hardening, `spk.session` kept display-only).
- `M features/auth/page.tsx:5` accepts `searchParams?:{reason,next}` and renders `<AuthReasonAlert>`; `M app/(auth)/auth/page.tsx:1` `async` `await searchParams`.
- `?? components/ui/alert.tsx:1` new shadcn `Alert`/`AlertTitle`/`AlertDescription` (was missing, 24 → 25 `components/ui/*`).
- `?? features/auth/components/AuthReasonAlert.tsx:1` new `"use client"` `useSearchParams` + `REASON_MAP` + `toast.error` + `<Alert variant="destructive">` (both per grilling Q5).
- Build `bun run --bun next build` 8.0s compile, 555ms static generation, routes `ƒ /admin` `ƒ /admin/buildings` `ƒ /admin/dss` etc. correctly `Dynamic` (previously would have silently trusted forged `spk.session`).

### 8.4 Changelog

| Date | Item | Status | Commit / Evidence |
|---|---|---|---|
| 2026-08-31 | P0-1 Sub-weights dropped on save | **DONE** (PR #1 `8bdf118`) | `features/weights/components/WeightsUpdateSection.tsx:83-89` sub-map + `allSubsValid` gate |
| 2026-08-31 | P0-2 Admin trusts `spk.session` | **DONE** (working tree, grilled A) | 7M+2N files above, `next build` 77s pass, `ƒ /admin` dynamic |
| — | P0-3…P2-4 | Open | See §7 tracking table |

### 8.5 How to Verify P0 Fixes (Before Marking Done) — Update After P0-2

- **Auth (P0-2 DONE — verify live):** Set `spk.session={"isAdmin":true}` as non-admin (edit `spk.session` cookie value) → hit `/admin` → **must 302 to `/auth?reason=forbidden`** (not render `AdminSidebar`), Alert `Akses ditolak` + `toast.error` visible, server log `[AdminLayout] auth check failed:` with 403 context, `GET /auth/me` in network with `Cache-Control: no-store`. Also test `clearCookies` → `/admin` → `302 /auth?next=/admin&reason=unauthenticated`. With expired `spk.access-token` but valid `spk.refresh-token` → auto-refresh writes `spk.access-token` (check `spk.access-token` new value, `sameSite:lax`) and renders admin.
- **Weights (P0-1 DONE):** Playwright: login admin → `/admin/weights` → change sub-weight `K2a` from `0.30`→`0.50` → submit → reload → assert `K2a` still `0.50` (or server shows new value). Also: submit with sub-total 80% → button disabled + red `FieldError`.
- **Stale Overview:** Playwright: seed one building → `/admin/dss` Run → assert `/admin` average updates without reload within 2s.
- **DataTable:** `git diff --stat` after P0-3 shows `-3` data-table files, `+1` shared file, no feature `data-table.tsx` remaining.
- **Dialog:** axe audit: zero `nested-interactive` violations; keyboard Tab → open row menu → Enter Delete → focus stays inside AlertDialog.
- **Building:** Try `latitude 999`, `name "   "` (spaces) → client error before network. Empty→ `NaN`→ Zod error `Harus berupa angka`.
- **Assessment:** Open create → `Save changes` with defaults → blocked (required), not silent all-zero row. Pick `structure 5` → clamped or error `maksimal 3`.
- **A11y:** `axe` scan on `/admin/buildings` dialog open shows 0 `label` / `aria-invalid` violations. Tab through Weights → focus ring visible, `aria-invalid` toggles on error fields.
- **Shadcn:** `grep -r "text-red-500" features --include="*.tsx"` returns 0; `grep -r "<Label" features/buildings features/assessments --include="*.tsx"` returns 0.

---

_Generated for `fe` admin dashboard — merged report. This file supersedes the prior split `admin-dashboard-forms-audit-2026-08-31.md` (now removed). Follow-up: pick one P0 to grill via `@.agents/skills/grilling/SKILL.md` or deep-design via `@.agents/skills/codebase-design/SKILL.md` before implementation._
