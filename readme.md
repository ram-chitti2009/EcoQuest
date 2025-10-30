# EcoQuest

A comprehensive, modern web app for enhancing your environmental sustainability efforts, and promote sustainable practices.  Sleek and Fluid User Interface, practical features, and a maintainable codebase make it ideal for iterative development. 

---

## Why this project exists

EcoQuest was created act as a liaison between local environmental action and measurable impact. , and then see those actions reflected in leaderboards and dashboards. The code is structured to be readable, testable, maintainable and easy to extend.

---

## Key features

- Community Cleanup map with robust event creation, join/leave, and creator-only deletion.
- Event participant tracking via `event_participants` (realtime-aware through Supabase's realtime API).
- Carbon Tracker: log cycling, recycling (material-specific), and other activities with accurate per-unit formulas.
- Cumulative user statistics stored in `user_statistics` and kept in sync on create/delete.
- Short Form Environmental Content using React Swipeable, and Youtube v3 API.
- Dynamic Visualizations using the Mapbox GL grid cell system to visually represent the user's efforts through a choropleth like system. 
- Historical Comparison of metrics such as cleanliness score, trash density, carbon emissions using two side by side maps. 
- Quest Log enables the users to keep track of their efforts by logging volunteer hours
- LitterLens was implemented using a dynamic User Interface that fosters seamless user experience. 
- LitterLens helps in trash detection, and dynamic AI powered disposal suggestions
- Responsive layout with accessible modals and controls.

---

## Notable design / implementation notes

- Database highlights:
  - `eco_events` — events master table.
  - `event_participants` — links users to events; triggers update participant counts.
  - `carbon_activities` — raw carbon activity records (per-user).
  - `user_statistics` — aggregated metrics (kept in sync post-create/delete).
- Carbon formulas (explicit constants used):
  - Cycling: 0.193 kg CO₂ saved per km.
  - Recycling per 1 kg: aluminum 11.7, paper 0.88, plastic 1.5, glass 0.31, steel 1.5.
- Client-first: most UI state is optimistic and reconciled with authoritative backend reads; Supabase Realtime is used where available for cross-tab sync.

---

## Quick start (development)

1. Install
```bash
npm install

2. Run
npm run dev
