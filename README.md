# SocietyBuddy

**App:** Interactive residential community & apartment society management app — gate security, maintenance billing, helpdesk/notices, and amenity/household management, with local browser persistence (no backend or database required).

SocietyBuddy simulates a shared household experience: two household members (Member A / Member B) can view and act on the same gate request, notice, or due, with every decision synced instantly and locked once settled — rehearsing the "Live Household Channel" concept for apartment gate approvals.

## Features

- **Gate Access (Live Household Channel)** — A pending visitor/courier/service request is visible to every registered household member at once. Whoever decides first (Approve/Decline) settles it; the decision locks instantly across both members' views, with a 60-second nudge if nobody has responded.
- **Notices** — Society-wide circulars and announcements, with per-member read/acknowledged tracking and the ability to post new notices.
- **Dues** — Maintenance billing with multiple payment methods (UPI, Card, NetBanking), synthetic transaction IDs, and a shared paid/pending status visible to the whole household.
- **Household** — Manage the unit's member profiles, registered vehicles, and daily staff (e.g. housekeeping) entry/exit status.
- **Simulation Control Bar** — Switch the active viewer between Member A and Member B, jump the elapsed-time clock (to trigger the 60s nudge), and reset the flow — all to rehearse the shared-household scenario on a single device.
- **Local persistence** — All state (requests, notices, dues, household data) is saved to `localStorage`, so the prototype survives reloads; a "reset all data" option restores the original fixture.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) for dev server and bundling
- [Tailwind CSS](https://tailwindcss.com/) (`@tailwindcss/vite`)
- [lucide-react](https://lucide.dev/) for icons
- [motion](https://motion.dev/) for animations
- [@google/genai](https://www.npmjs.com/package/@google/genai) — Gemini API integration
- Express + dotenv (server-side scaffolding)

## Project Structure

```
src/
├── App.tsx                      # Tab routing, simulation state, top-level handlers
├── components/
│   ├── GateAccessTab.tsx        # Live household gate-request flow
│   ├── NoticesTab.tsx           # Society notices/circulars
│   ├── DuesTab.tsx              # Maintenance billing and payments
│   ├── HouseholdTab.tsx         # Member profiles, vehicles, daily staff
│   ├── SimulationControlBar.tsx # Member A/B switch, time controls, reset
│   └── ToastContainer.tsx       # In-app notifications
├── data/seedData.ts              # Prototype fixture + localStorage load/save/reset
├── types/society.ts              # Core domain types (requests, members, dues, notices)
└── utils/formatters.ts           # Time/ID formatting helpers
```

## Getting Started

### Prerequisites
- Node.js (18+) and npm

### Install & Run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000` by default.

### Other scripts

| Command           | Description                         |
|--------------------|--------------------------------------|
| `npm run dev`      | Start the Vite dev server            |
| `npm run build`    | Production build                     |
| `npm run preview`  | Preview the production build         |
| `npm run lint`     | Type-check with `tsc --noEmit`       |
| `npm run clean`    | Remove `dist/` and `server.js`       |

### Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable          | Description                                                  |
|--------------------|----------------------------------------------------------------|
| `GEMINI_API_KEY`  | Required for Gemini AI API calls.                              |
| `APP_URL`         | URL where the app is hosted (used for self-referential links). |

## Background

This prototype grew out of a product-discovery exercise on a "backup decision-maker gap": when a gate request goes to every household member but only the first decision counts, nobody has visibility into whether someone else is already acting on it. The Gate Access tab's live, synced, lockable request flow is the resulting concept, built out here alongside the rest of the society-management surface (notices, dues, household).

## License

Not yet specified.
