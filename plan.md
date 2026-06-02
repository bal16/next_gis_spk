# **Frontend Execution Plan: DSS Building Maintenance**

## **1\. Tech Stack Strategy**

We are choosing stability and data integrity over "hype".

- **Framework:** **Next.js 14+ (App Router)**.
  - _Why:_ Seamless separation of Public (Static/ISR) and Admin (Dynamic) pages. Built-in routing prevents "white screen" SPGH hell.
- **Language:** **TypeScript**.
  - _Why:_ You have a strict OpenAPI spec. We will generate types directly from it. No guessing what details contains.
- **State Management:** **TanStack Query (React Query) v5**.
  - _Why:_ The DSS data is "Server State", not "Client State". We need caching, background refetching, and easy "Pull to Refresh" logic without bloated Redux reducers.
- **Styling:** **Tailwind CSS** \+ **shadcn/ui**.
  - _Why:_ Pre-built accessible components (Data Tables, Forms, Dialogs) speed up development by 300%.
- **Maps:** **MapLibreGL** (OSS version of Mapbox GL).
  - _Why:_ Essential for visualizing the latitude/longitude of buildings.
- **Forms:** **React Hook Form** \+ **Zod**.
  - _Why:_ We need strict validation for the Assessment inputs before sending to the API.

## **2\. Sitemap & Routing `Structure**

### **A. Public Zone (No Auth)**

- `/` **(Landing / Dashboard)**
  - **Visual:**
    - Full Screen Interactive `Map (Pins of buildings`).
    - Searchable and Filterable "Priority" list
      - Mobile: Dock
      - Desktop: Floating Sidebar on left
  - **Data:** Fetch `GET dss/results.`
  - **Action:** Click a building on the map \-\> details of building on popup card.

### **B. Authentication**

- `/login`
  - **Form:** Email, Password.
  - **Action:** `POST /auth/login` \-\> Store JWT in HTTP-only cookie (via Server Action) or LocalStorage (if simple client-side).
- `/register`
  - **Form:** Username, Email, Password, **Invite Code**.
  - **Action:** `POST /auth/register`.

### **C. Admin Dashboard (Protected `/admin/*`)**

- **layout.tsx:**
  - Sidebar navigation
  - User Profile dropdown
  - Logout button.
- `/admin/dashboard`

  Overview (Quick stats: `Total Buildings`, `Last Run Date`).

- `/admin/buildings` **(Building Management)**
  - **Table:** List all buildings.

    Columns: `Code`, `Name`, `Lat/Long`, `Actions` (Edit/Delete).

  - **Action:** "Add Building" (Modal).

- `/admin/assessments` **(Scoring Interface)**
  - **List:** Buildings showing simple status (`"Assessed"` vs `"Pending"`).
  - **Sub-page:** `/admin/assessments/[buildingId]`
    - **Form:** The critical input form for C1, C2 (Structure, Arch, mep), C3, C4.
    - **Validation:** Ensure inputs are within range (e.g., 1-3).
- `/admin/dss` **(The Engine Room)**
  - **Tabs:**
    1. **Runner:** Big `"Calculate Now"` button. Shows progress/toast on success.
    2. **Weights:** Form to edit C1-C4 weights (`PUT /dss/weights`). Total must be `100` validation (in BE we use 1.0).
    3. **History:** List of past runs (`GET /dss/runs`). Click to view Snapshot.
- `/admin/dss/history/[runId]` **(Report View)**
  - **View:** Read-only version of the Landing Page, but populated with _historical_ data from the snapshot.

## **3\. Core Features & Component Breakdown**

### **Feature 1: The "Live" Map (Public)**

- **Component:** BuildingMap.tsx
- **Logic:**
  - Take RankingResult\[\] as props.
  - Render markers at lat/long.
  - **Color Coding:** Red (Rank 1-3), Yellow (Rank 4-10), Green (Safe). _This visualizes urgency immediately._
  - **Popup:** Shows Building Name and Total Score.

### **Feature 2: The Assessment Form (Admin)**

- **Component:** AssessmentForm.tsx
- **Inputs:**
  - age (Number input)
  - structure, architecture, mep (Select/Radio: 1=Good to 5=Bad)
  - utility, damage (Select/Radio)
- **UX Critical:** Display the _meaning_ of the scale (e.g., "3 \- Severe Damage") next to the radio button so the admin doesn't have to memorize the rubric.

### **Feature 3: The Weight Configurator (Admin)**

- **Component:** WeightAdjuster.tsx
- **UX:** 4 Sliders or Number Inputs.
- **Validation:** Real-time sum check. Show a red error message if Sum \!== 1.0. Disable the "Save" button until valid.

### **Feature 4: The Kill Switch Guard (Auth)**

- **Logic:** On the Register page, if the API returns 403 Registration Closed, display a friendly but firm message: _"Admin registration is currently locked by system policy."_ Do not let them retry endlessly.

## **4\. Implementation Phase Plan**

### Phase 1: The Public Face (Value First)

1. Setup Next.js \+ Tailwind \+ Leaflet.
2. Create api/client.ts (Axios instance).
3. Build the Public Dashboard (/). Mock the API response initially to perfect the UI.
4. **Milestone:** You can show the client a working map of their buildings.

### Phase 2: The Gatekeeper (Auth)

1. Build Login/Register forms.
2. Implement AuthProvider (Context).
3. Create ProtectedLayout wrapper for /admin.
4. **Milestone:** Secure access established.

### Phase 3: Data Entry (CRUD)

1. Build Building Management (Table \+ Add/Edit Modals).
2. Build Assessment Form (The most data-heavy part).
3. **Milestone:** Admins can populate the database.

### Phase 4: The Brain (DSS)

1. Build Weight Configurator.
2. Implement the "Calculate" trigger button.
3. Build the History/Snapshot view.
4. **Milestone:** The system actually makes decisions.

## **5\. Critical "Gotchas" (Don't Ignore)**

1. **Mobile Input:** The maintenance staff might check structure while walking around the building. Ensure AssessmentForm.tsx is mobile-responsive (large touch targets for radio buttons).
2. **Snapshot Consistency:** When viewing a _History Snapshot_, do NOT use the "Live Map" component if the Live Map fetches from /dss/results. You must pass the _historical_ data into the map component. Reusability is key here.
3. **Type Safety:** Generate your types from [OpenApi.yaml](OpenApi.yaml). (**MAYBE USED**)
   - _Command:_ `npx openapi-typescript ./OpenApi.yaml -o ./src/types/api.d.ts`
   - _Benefit:_ If the backend changes lastScore to score, your build will fail immediately, preventing runtime bugs.
