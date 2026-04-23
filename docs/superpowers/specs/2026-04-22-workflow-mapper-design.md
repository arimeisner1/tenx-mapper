# Workflow Mapper — Design Spec

**Date:** 2026-04-22
**Status:** Approved
**Deployment:** Railway
**Name:** TenX Mapper (working title)

---

## Overview

A SaaS workflow mapping tool for AI consultants. Users visually map out how software tools connect and interact across a client's tech stack using a drag-and-drop canvas. Each node represents a software tool or custom function, and connections show data/process flow between them.

Primary user: the builder (an AI consultant), with the goal of making it usable as a general SaaS product.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Canvas | React Flow |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL (Railway) |
| ORM | Prisma |
| Auth | NextAuth.js (email/password, expandable to Google OAuth) |
| Real-time | Liveblocks or Yjs (WebSocket collaboration) |
| Export | html-to-image + jsPDF |
| Deployment | Railway |

---

## Data Model

### User
- id, email, password (hashed), name, avatar_url
- created_at, updated_at

### Project
- id, name, description, owner_id (FK -> User)
- archived (boolean)
- created_at, updated_at

### ProjectCollaborator
- id, project_id (FK -> Project), user_id (FK -> User)
- role: "owner" | "editor" | "viewer"

### Workflow
- id, project_id (FK -> Project), name, description
- canvas_data (JSON — React Flow nodes + edges state)
- is_template (boolean)
- share_token (unique string for public link)
- created_at, updated_at

### NodeMetadata
- id, workflow_id (FK -> Workflow), node_id (string, matches React Flow node id)
- name, description, notes (rich text)
- links (JSON array of URLs)
- cost_estimate (string)
- api_endpoint (string)
- status: "active" | "planned" | "deprecated"
- custom_fields (JSON — key-value pairs)

### SoftwareCatalog
- id, name, slug, logo_url
- category: enum (see categories below)
- description, default_color
- Seeded on first deploy, not user-editable

---

## Software Catalog Categories

A comprehensive library of software tools, seeded into the database. Each tool has: name, logo URL, category, default color, description.

**Categories and representative tools:**

1. **AI & ML** — OpenAI, Anthropic, Hugging Face, Replicate, Midjourney, ElevenLabs, Cohere, Stability AI, Google AI, Jasper, Copy.ai, Runway, Whisper, Pinecone, Weaviate, Qdrant, LangChain, CrewAI, AutoGPT, Perplexity, Claude, GPT-4, Gemini, Mistral, Llama, DALL-E, Cursor, v0, Bolt

2. **Automation** — Zapier, Make (Integromat), n8n, Power Automate, IFTTT, Workato, Tray.io, Activepieces, Pipedream, Parabola, Relay.app, Bardeen, Automator

3. **CRM** — Salesforce, HubSpot, Pipedrive, Close, Zoho CRM, Copper, Freshsales, Insightly, Monday CRM, Attio, Folk, Streak

4. **Communication** — Slack, Microsoft Teams, Discord, Twilio, SendGrid, Mailchimp, Intercom, Zendesk, Crisp, Drift, Front, Missive, WhatsApp Business, Telegram Bot

5. **Databases & Storage** — Airtable, Supabase, Firebase, MongoDB, PostgreSQL, MySQL, Snowflake, BigQuery, Amazon S3, Google Sheets, Redis, DynamoDB, PlanetScale, Neon, Turso, Upstash, Cloudflare R2, Notion (as database)

6. **Design** — Figma, Canva, Adobe Creative Cloud, Miro, FigJam, Sketch, InVision, Framer, Webflow, Spline, Rive

7. **Dev Tools** — GitHub, GitLab, Bitbucket, Vercel, Netlify, Railway, Docker, AWS, GCP, Azure, Cloudflare, Render, Fly.io, Heroku, Linear, Sentry, Datadog, LaunchDarkly, Postman, Insomnia

8. **Documents & Knowledge** — Notion, Confluence, Google Docs, Coda, Obsidian, Slite, Gitbook, ReadMe, Almanac, Nuclino

9. **E-commerce** — Shopify, Stripe, Square, WooCommerce, Gumroad, LemonSqueezy, Paddle, BigCommerce, Medusa, Snipcart

10. **Finance & Accounting** — QuickBooks, Xero, Wave, Plaid, Mercury, Brex, Ramp, Wise, PayPal, Bill.com, FreshBooks, Bench

11. **HR & Recruiting** — BambooHR, Gusto, Lever, Greenhouse, Rippling, Deel, Remote, Oyster, Workday, ADP, Lattice, 15Five

12. **Marketing** — Google Ads, Meta Ads, Semrush, Ahrefs, Buffer, Hootsuite, Later, Sprout Social, Mailchimp, ConvertKit, Beehiiv, Substack, Unbounce, Webflow

13. **Project Management** — Asana, Monday, Jira, Linear, ClickUp, Trello, Basecamp, Shortcut, Wrike, Teamwork, Height, Plane

14. **Sales & Outreach** — Apollo, Outreach, SalesLoft, Lemlist, Clay, Instantly, Smartlead, Reply.io, Woodpecker, Snov.io, Hunter, ZoomInfo, Clearbit

15. **Scheduling** — Calendly, Cal.com, Acuity, Doodle, SavvyCal, TidyCal, Reclaim.ai, Clockwise

16. **Security & Compliance** — Okta, Auth0, 1Password, Vanta, Drata, Snyk, CrowdStrike, Cloudflare (security), Clerk, Stytch

17. **Video & Meetings** — Zoom, Google Meet, Loom, Riverside, Descript, Otter.ai, Grain, Fireflies.ai, Vowel, Around, Rewatch

18. **Voice & Phone** — Aircall, Dialpad, RingCentral, Vonage, Twilio Voice, Grasshopper, OpenPhone, JustCall

19. **Forms & Surveys** — Typeform, Tally, Google Forms, SurveyMonkey, Jotform, Formspark, Fillout, Paperform

20. **Analytics** — Google Analytics, Mixpanel, Amplitude, PostHog, Hotjar, FullStory, Heap, Segment, Plausible, Fathom, Pirsch

21. **Customer Success** — Gainsight, ChurnZero, Vitally, Pendo, Totango, Catalyst, Planhat, UserGuiding

---

## Canvas & Node System

### Canvas Features
- Infinite pannable, zoomable workspace (React Flow)
- Snap-to-grid for clean alignment
- Minimap in corner for navigation on large workflows
- Animated connection lines showing flow direction
- Multiple edge styles: straight, curved, step (user-selectable per connection)
- Auto-save with subtle "Saved" indicator

### Node Types

1. **Software Node** — logo + name + subtitle. Color-coded border by category. Pulled from the software catalog or created as custom.
2. **Custom Node** — user-defined icon, name, and color for tools not in the catalog.
3. **Function Node** — smaller node that attaches to a software node to represent specific functions (e.g. "Create Record" under Airtable).
4. **Group Node** — a container node that visually groups other nodes into a phase or subsystem (e.g. "Client Onboarding Flow").

### Software Library Panel (Left Sidebar)
- Search bar at top
- Category accordion (expandable sections)
- Drag from library onto canvas to add a node
- "Add Custom" button for unlisted tools
- Full catalog loaded, searchable

### Detail Panel (Right Sidebar)
- Slides in on node click, hidden by default
- Fields for nodes: name, description, notes (rich text), links/URLs, cost estimate, API endpoint, status (active/planned/deprecated), custom key-value fields
- Fields for connections: label, description, data format notes

---

## Projects & Workflows

### Dashboard (Home Page)
- Project cards in a grid layout
- Each card shows: client name, description, last edited date, workflow count
- Search/filter projects
- "New Project" prominent CTA button
- Recent workflows quick-access section

### Project View
- Lists all workflows within a project
- Create new workflow (blank or from template)
- Archive/delete project

### Templates
- Save any workflow as a template (one-click)
- Template library page to browse saved templates
- "Start from template" option when creating a new workflow
- Pre-built starter templates shipped with the app:
  - "Basic CRM Automation"
  - "AI Content Pipeline"
  - "Client Onboarding"
  - "Customer Support Stack"
  - "Sales Outreach Automation"

---

## Collaboration

- Invite collaborators by email to a project
- Roles: Owner (full control), Editor (can edit workflows), Viewer (read-only)
- Real-time collaboration via WebSocket — multiple cursors, live node edits
- Powered by Liveblocks or Yjs

---

## Sharing & Export

- **Public link** — unique shareable URL per workflow (read-only, no auth required)
- **PNG export** — full canvas capture via html-to-image
- **PDF export** — canvas image + all node metadata as an appendix (jsPDF)
- **Copy link** button on every workflow

---

## UI Design

### Aesthetic
- Clean, modern, professional (Linear meets Figma feel)
- Dark mode and light mode toggle
- Neutral base (grays, whites) with vibrant accent colors per node category
- Smooth micro-animations throughout

### Layout
- **Top bar** — logo, project name breadcrumb, share button, export button, user avatar/menu
- **Left sidebar** — software library (search + category accordion)
- **Center** — canvas (primary workspace, takes most screen space)
- **Right sidebar** — detail panel (slides in on node click)
- **Bottom bar** — minimap toggle, zoom controls, grid snap toggle

### Typography & Spacing
- Inter or Geist font family
- Generous whitespace
- Consistent 4px/8px spacing scale (Tailwind)

### Interactions
- Hover states on all interactive elements
- Drag feedback — subtle shadow lift on dragged nodes
- Toast notifications for saves, exports, shares
- Gentle slide/fade transitions on panels
- Loading skeletons for async content

---

## Deployment

- **Platform:** Railway
- **Services:** Next.js app + PostgreSQL database
- **Git:** New repository, pushed to GitHub, connected to Railway for auto-deploy
- **Environment:** Production environment with env vars for DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
