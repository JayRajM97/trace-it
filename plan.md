# TraceIt — Product Plan

> Turn your walk into GPS art. Pick a shape, follow the route, share the art.

---

## Vision

A mobile app (iOS + Android) where users generate street-snapped walking routes shaped like letters, animals, or any symbol — then follow turn-by-turn directions and share the result as GPS art on Strava or social media.

Born from an accidental elephant on Strava.

---

## Status

| Area | State |
|---|---|
| Codebase scaffold | ✅ Done |
| Shape library (10 shapes) | ✅ Done |
| Waypoint scaler | ✅ Done |
| OSRM integration | ✅ Done |
| API server (Express) | ✅ Done |
| DB schema (Drizzle/Turso) | ✅ Done |
| Zod types + API client | ✅ Done |
| Mobile screens (all 6) | ✅ Done |
| Fidelity scoring | ✅ Done |
| GPX serializer | ✅ Done |
| Share card (Satori) | ✅ Done |
| Strava OAuth + push | ✅ Done |
| Env setup / run locally | ⏳ Next |
| Real device testing | ⏳ Next |
| App icons + splash | ⏳ Next |

---

## Versions

### v0.1 — Scaffold *(current)*
Full monorepo built. All screens, API routes, DB schema, OSRM integration, share cards, Strava push. Typechecks clean. Not yet tested on device.

### v0.2 — Working on Device *(next)*
- Fill in env vars, point at real OSRM / Turso / Clerk
- Run on simulator + real phone
- Fix runtime bugs from first boot
- Add app icon + splash screen assets
- Verify map renders, location works, OSRM returns real routes

### v0.3 — Navigation Polish
- Auto-advance step when within 20m
- Haptic feedback working
- Map camera follows user
- UserDot pulse animation live
- "Finish early" flow tested

### v0.4 — Share & Export
- GPX export to Files app
- Strava OAuth end-to-end tested
- Share card renders correctly
- Social share sheet opens

### v0.5 — Beta
- Onboarding flow (first-launch)
- Profile screen (my art, stats)
- History screen populated
- Error states handled gracefully
- TestFlight build

### v1.0 — Launch
- App Store submission
- Marketing site / landing page
- Community feed (all art in your area)

---

## Backlog

### High Priority
- [ ] Real device testing — iOS simulator first
- [ ] App icon + splash screen (dark themed)
- [ ] Onboarding screen (first launch)
- [ ] Error boundary UI (not just component)
- [ ] Empty state on History screen
- [ ] Loading skeleton on route generation

### Medium Priority
- [ ] Profile screen — stats (shapes walked, total distance)
- [ ] Fidelity score ring animation on Complete screen
- [ ] Improve shape waypoints — smoother curves
- [ ] More shapes (elephant, dog, pizza, lightning bolt)
- [ ] Custom shape drawing — draw on map, app routes it
- [ ] Multi-user routes (two people, two halves)
- [ ] Fidelity leaderboard per shape

### Low Priority / Post-MVP
- [ ] AI shape suggestions ("what works near me?")
- [ ] Weekly community challenge
- [ ] Neighborhood map of all public art
- [ ] Running mode (higher pace, longer shapes)
- [ ] Strava segment integration
- [ ] Apple Watch companion

---

## Shape Library

| ID | Name | Category | Closed |
|---|---|---|---|
| `letter_a` | Letter A | letter | no |
| `letter_b` | Letter B | letter | no |
| `letter_s` | Letter S | letter | no |
| `heart` | Heart | object | yes |
| `star` | Star | geometric | yes |
| `arrow` | Arrow | object | no |
| `triangle` | Triangle | geometric | yes |
| `circle` | Circle | geometric | yes |
| `fish` | Fish | animal | no |
| `house` | House | object | no |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Mobile | React Native + Expo (Expo Router v4) |
| Maps | react-native-maps |
| Routing | OSRM (public endpoint or self-hosted) |
| Backend | Node.js + Express |
| Auth | Clerk |
| Database | Turso (libSQL) + Drizzle ORM |
| State | TanStack Query + React Context |
| Share cards | Satori + Resvg |
| Strava | OAuth 2.0 + Activities API v3 |

---

## Key Decisions

- **OSRM `trip` not `route`** — handles waypoint ordering flexibility
- **Walk runs entirely on-device** — server only called on generate + complete
- **Fidelity computed client-side** — included in save payload, server stays stateless
- **Dev build required** — `react-native-maps` doesn't run in Expo Go

---

## Ideas Parking Lot

- "Draw your city's skyline" challenge
- Let users name their route before sharing
- Route replay — animate the walk on a map
- Seasonal shapes (Christmas tree, pumpkin)
- Business mode — companies sponsor weekly shape challenges
- NFT mint of your GPS art (lol but also maybe)
