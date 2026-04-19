# TraceIt — Change Log

---

## v0.1.0 — Initial Scaffold
*2026-04-20*

### Monorepo Setup
- `pnpm-workspace.yaml` with catalog versions
- Root `package.json`, `tsconfig.base.json`, `.gitignore`

### `lib/db`
- Drizzle + libSQL (Turso) setup
- Schema: `users`, `routes`, `strava_tokens`
- `getDb()` singleton with proper TypeScript typing
- `drizzle.config.ts` for migrations

### `lib/api-zod`
- Zod schemas: `LatLng`, `TurnInstruction`, `RouteResponse`
- `GenerateRouteBody`, `SaveRouteBody`, `SavedRoute`
- `ShareResponse`, `StravaConnectResponse`, `StravaPushResponse`

### `lib/api-client-react`
- `apiFetch` with auth token injection
- `configureApi()` to set base URL + token getter
- TanStack Query hooks: `useGenerateRoute`, `useSaveRoute`, `useRoutes`, `useRoute`, `useShareRoute`, `useStravaConnect`, `useStravaPush`

### `artifacts/api-server`
- Express 5 + Clerk auth middleware
- `GET /api/health`
- `POST /api/routes/generate` — scale shape + call OSRM, return polyline
- `GET/POST /api/routes` — list + save completed routes
- `GET /api/routes/:id` — single route
- `POST /api/routes/:id/share` — generate share token
- `GET /api/share/:token` + `/image` — public share + PNG card
- `POST /api/strava/connect` — return OAuth URL
- `GET /api/strava/callback` — exchange code, store tokens
- `POST /api/strava/push` — upload GPX to Strava with auto token refresh
- `POST /api/auth/sync-user` — Clerk webhook upsert
- OSRM client: polyline decoder, trip planning, maneuver mapping
- Satori share card renderer (1200×630 PNG)
- Waypoint scaler (normalized → lat/lng, flat-earth offset)
- 10 hardcoded shapes on server side

### `artifacts/mobile`
- Expo Router v4, dark theme, TypeScript strict
- `metro.config.js` wired to monorepo workspace packages
- `app.json`: scheme `traceit://`, location permissions, react-native-maps plugin

**Constants**
- `colors.ts` — full dark palette
- `shapes.ts` — 10 shapes with normalized waypoints

**Lib (pure utils)**
- `geo.ts` — haversine, bearing, arc-length resampling
- `waypointScaler.ts` — normalized → real lat/lng
- `fidelityScore.ts` — Hausdorff-based 0–1 score
- `gpxSerializer.ts` — walked points → GPX 1.1 XML

**Context**
- `AuthContext` — Clerk auth bridge
- `RouteContext` — walk session state machine (setup → generated → walking → done)

**Hooks**
- `useLocation` — foreground permission + one-shot coords
- `useWatchLocation` — continuous GPS for active walk
- `useNavigation` — step advance logic, 20m arrival threshold, haptics

**Components**
- `Button`, `Card`, `LoadingSpinner`
- `ShapeCard`, `ShapePreview` (react-native-svg)
- `RouteMap` (react-native-maps Polyline + Markers)
- `UserDot` (animated pulse ring)
- `TurnCard` (instruction + bearing arrow)
- `ProgressBar`

**Screens**
- `home` — location, diameter slider, shape picker entry, generate route
- `shape-picker` — 2-col grid, category filter chips
- `route-preview` — full-screen map + stats bottom sheet
- `navigate` — map (60%) + turn card (40%), GPS watch, auto-advance
- `complete` — fidelity score, GPX save, Strava push, social share
- `history` — route cards list, pull-to-refresh

### Fixes Applied During Build
- `lib/db`: properly typed `LibSQLDatabase<Schema>` so relational queries work
- `api-server`: `pinoHttp` named import (pino-http v10)
- `api-server`: `satori` node cast to `any` (no React dep on server)
- `api-server`: all `Date.now()` → `new Date()` for `timestamp_ms` columns
- `api-server`: Express params cast to `string` (avoid `string | string[]`)
- `mobile`: `RouteContext` imports `LatLng` from `geo` not `gpxSerializer`
- `mobile`: `useWatchLocation` rewritten to avoid `never` typed subscription ref
