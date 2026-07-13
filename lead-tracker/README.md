# Lead Tracker

A super-light coordination app for a lead-testing contractor. Handles the one thing general
field-service tools don't: a job where the **landlord pays** but the **tenant is scheduled and
messaged**. Onboarding → status pipeline → tenant SMS (Twilio) → Cal.com booking link → invoice checkbox.

**It does not generate compliance reports** — your XRF analyzer software already does that. This app
links to the finished report and owns the coordination around it.

## Stack
- Node + Express (one dependency)
- JSON file storage (`data.json`) — zero database to set up
- Vanilla HTML/CSS/JS frontend, modern UI, light + dark

## Run locally
```bash
cd lead-tracker
npm install
npm start        # http://localhost:3000
```

## Deploy on Railway
1. New project → **Deploy from repo** → point the root directory at `lead-tracker/`.
2. Railway auto-detects Node and runs `npm start`. It sets `PORT` for you.
3. **Persistence:** the JSON file lives on the container's disk, which resets on redeploy.
   For real use, add a **Railway Volume** mounted at e.g. `/data` and set `DATA_FILE=/data/data.json`,
   or swap the storage in `db.js` for Postgres.

## Connect your tools (Settings tab)
- **Cal.com** — paste your public booking URL (e.g. `https://cal.com/your-team/lead-test`).
  The app builds a per-project link prefilled with the address + tenant, and can text it to the tenant.
- **Twilio** — Account SID, Auth token, and a From number enable live two-way SMS.
  Until connected, messages are stored but not sent (so you can demo the flow first).
  For production SMS in the US you must register **A2P 10DLC** in Twilio.

## Environment variables
| Var | Default | Purpose |
|-----|---------|---------|
| `PORT` | 3000 | HTTP port (Railway sets this) |
| `DATA_FILE` | `./data.json` | Where the JSON store lives (point at a volume in prod) |

Twilio and Cal.com credentials are saved through the Settings UI into the data store, not env vars.
