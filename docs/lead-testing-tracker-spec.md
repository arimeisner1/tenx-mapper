# Lead-Testing Coordination Tracker — Software Specification

**Version:** 1.0 (Draft for review)
**Date:** 2026-07-13
**Status:** Pre-build spec
**Author:** Engineering

---

## 1. Purpose

A lightweight web app for a **private lead-testing / inspection contractor** that closes the one gap no off-the-shelf product fills for them: **coordinating a job where the paying party (landlord / property manager) is not the same person as the scheduling party (tenant / occupant).**

The app owns scheduling, tenant communication, and project status. It **does not** generate compliance reports — the contractor's XRF analyzer software (e.g. Viken HDMS, RMD LPA-1) already produces HUD/EPA-compliant reports. This app links to those finished reports; it does not recreate them.

---

## 2. Background & problem statement

The client previously used general field-service tools (Jobber, Housecall Pro). Both model **one contact per job**, where that contact is simultaneously the *bill-to* and the *message-to* party. Lead testing in rental housing has three parties:

- **Landlord / property manager** — orders the test, pays the invoice.
- **Tenant / occupant** — lives in the unit, must be scheduled with and reminded, and must be notified per EPA/HUD rules.
- **Inspector / crew** — performs the test and files the result.

No cheap off-the-shelf product covers *all* of: landlord/tenant split + tenant two-way messaging + lead compliance records, for a private contractor. This app fills exactly that intersection.

---

## 3. Scope

### 3.1 In scope
- Project (job) tracking with a status pipeline.
- Two-contact model per project (landlord + tenant), each with independent roles.
- Tenant self-scheduling via an integrated booking link (Cal.com).
- Two-way SMS with the tenant, plus transactional email (Twilio + Resend).
- Automated notifications driven by status changes and appointment events.
- A compliance record per project: test outcome, retained report file (uploaded or linked), certification reference, and a message audit trail.
- A dashboard for the contractor's office staff and crew.

### 3.2 Explicitly out of scope
- **Report generation** — handled by the XRF analyzer's own software. The app stores/links the finished PDF.
- **Invoicing / payments** — the landlord is billed through the client's existing accounting flow (or a future integration). The app records *who* is the bill-to party but does not process payment in v1.
- **XRF reading capture** — readings live in the analyzer software; the app references the resulting report, not raw readings.
- **Multi-tenancy / reselling to other firms** — designed *around* but not built in v1 (see §13).

---

## 4. Users & roles

| Role | Who | Capabilities |
|---|---|---|
| **Admin / Office** | Client's office staff | Full CRUD on projects, contacts; sees all jobs; configures message templates; uploads reports. |
| **Inspector / Crew** | Field technician | Sees assigned jobs; updates status; files test outcome; uploads report from the field. |
| **Tenant** | Occupant | No login. Interacts only via a tokenized booking link and SMS/email. |
| **Landlord / PM** | Bill-to party | No login in v1. Receives confirmations and the final report by email. (Optional read-only portal is a future item.) |

Auth in v1: email/password for Admin and Inspector (already scaffolded in the repo via NextAuth). Tenants and landlords are unauthenticated; their access is via signed, expiring links.

---

## 5. Domain concepts

- **Project** — one lead test at one unit/address. The central object; everything hangs off it.
- **Contact** — a person, with a `role` (LANDLORD or TENANT). A project references two contacts.
- **Appointment** — a scheduled visit, created and kept in sync from the booking system.
- **TestRecord** — the compliance outcome for a project: result, report file, cert reference.
- **MessageLog** — an immutable record of every SMS/email sent or received for a project (audit trail; supports the EPA "document all attempts to contact the tenant" requirement and 10-year retention).

---

## 6. Data model

Prisma schema (PostgreSQL). Names are illustrative; adjust to house style.

```prisma
model Project {
  id            String        @id @default(cuid())
  address       String
  unit          String?
  status        ProjectStatus @default(NEW)
  scheduledAt   DateTime?
  landlord      Contact       @relation("Landlord", fields: [landlordId], references: [id])
  landlordId    String
  tenant        Contact?      @relation("Tenant", fields: [tenantId], references: [id])
  tenantId      String?
  assignedTo    User?         @relation(fields: [assignedToId], references: [id])
  assignedToId  String?
  bookingToken  String        @unique          // powers the tenant self-schedule link
  appointments  Appointment[]
  testRecords   TestRecord[]
  messages      MessageLog[]
  notes         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  // FUTURE (multi-tenant): orgId String
}

model Contact {
  id          String       @id @default(cuid())
  name        String
  role        ContactRole
  phone       String?
  email       String?
  smsOptIn    Boolean      @default(false)     // TCPA: must be true before any SMS
  smsOptInAt  DateTime?
  landlordFor Project[]    @relation("Landlord")
  tenantFor   Project[]    @relation("Tenant")
  createdAt   DateTime     @default(now())
}

model Appointment {
  id            String            @id @default(cuid())
  project       Project           @relation(fields: [projectId], references: [id])
  projectId     String
  externalId    String?           @unique      // Cal.com booking id
  startsAt      DateTime
  endsAt        DateTime?
  state         AppointmentState  @default(BOOKED)
  createdAt     DateTime          @default(now())
}

model TestRecord {
  id          String       @id @default(cuid())
  project     Project      @relation(fields: [projectId], references: [id])
  projectId   String
  result      TestResult
  reportUrl   String?                          // link/upload to the XRF software's HUD report
  certRef     String?                          // inspector certification / license ref
  inspectedAt DateTime?
  createdBy   User?        @relation(fields: [createdById], references: [id])
  createdById String?
  createdAt   DateTime     @default(now())
}

model MessageLog {
  id          String          @id @default(cuid())
  project     Project         @relation(fields: [projectId], references: [id])
  projectId   String
  direction   MessageDirection                 // OUTBOUND | INBOUND
  channel     MessageChannel                   // SMS | EMAIL
  toAddress   String
  fromAddress String?
  body        String
  externalId  String?                          // Twilio/Resend message id
  status      String?                          // delivered, failed, etc. (from provider webhook)
  createdAt   DateTime        @default(now())
}

enum ProjectStatus { NEW SCHEDULED INSPECTED REPORT_SENT CLOSED CANCELLED }
enum ContactRole { LANDLORD TENANT }
enum AppointmentState { BOOKED RESCHEDULED CANCELLED COMPLETED }
enum TestResult { LEAD_DETECTED NO_LEAD_DETECTED INCONCLUSIVE }
enum MessageDirection { OUTBOUND INBOUND }
enum MessageChannel { SMS EMAIL }
```

### Relationships
- `Project 1—1 Contact(LANDLORD)` (required) and `Project 1—0..1 Contact(TENANT)` (tenant may be added after the job is created). **This split is the core of the app.**
- `Project 1—n Appointment` — synced from the booking provider.
- `Project 1—n TestRecord` — usually one, but allows re-tests.
- `Project 1—n MessageLog` — full inbound + outbound audit trail.

---

## 7. Functional requirements

### 7.1 Projects
- **F-1** Create a project with address, unit, and a landlord contact (required). Status defaults to `NEW`.
- **F-2** Add or edit a tenant contact on a project at any time.
- **F-3** Assign an inspector to a project.
- **F-4** View a board (kanban) and a list view of all projects, filterable by status, inspector, and date.
- **F-5** Every project has a unique `bookingToken` used to build the tenant scheduling link.

### 7.2 Contacts (two-contact model)
- **F-6** A contact has a role: LANDLORD or TENANT. Messaging and billing target *different* contacts on the same project.
- **F-7** Before any SMS is sent to a tenant, `smsOptIn` must be true. Opt-in is captured at the booking step (see §9). No opt-in → email only.
- **F-8** Contacts are reusable across projects (a landlord with many units is one contact).

### 7.3 Scheduling (Cal.com)
- **F-9** From a project, generate a tenant booking link (Cal.com event type, prefilled with address + `bookingToken`).
- **F-10** Send that link to the tenant via SMS and/or email.
- **F-11** On a Cal.com booking webhook, create an `Appointment`, set `Project.scheduledAt`, and move status `NEW → SCHEDULED`.
- **F-12** On reschedule/cancel webhooks, update the `Appointment` and, if cancelled, revert status to `NEW` and notify office staff.

### 7.4 Messaging (Twilio + Resend)
- **F-13** Send SMS to the tenant via Twilio; log every message in `MessageLog`.
- **F-14** Receive inbound SMS (tenant replies) via a Twilio inbound webhook; attach to the correct project by phone number and log it.
- **F-15** Send transactional email (confirmations, report delivery) via Resend; log it.
- **F-16** Office staff can view the full message thread per project and send a manual message.
- **F-17** Honor SMS STOP/START keywords (auto-managed by Twilio Advanced Opt-Out); reflect opt-out state on the contact.

### 7.5 Status pipeline & automation
- **F-18** Statuses: `NEW → SCHEDULED → INSPECTED → REPORT_SENT → CLOSED` (plus `CANCELLED`).
- **F-19** Status transitions fire the notifications in §9. Transitions are also settable manually by staff.
- **F-20** `INSPECTED` requires a `TestRecord` (result must be filed to advance).
- **F-21** `REPORT_SENT` requires a `reportUrl` on the test record.

### 7.6 Compliance record
- **F-22** File a test outcome (result enum) and inspector cert reference against a project.
- **F-23** Upload or link the finished HUD report PDF (produced by the XRF software). Store in object storage; keep the URL.
- **F-24** Records and message logs are retained for **10 years** (regulatory). No hard-delete of `TestRecord` or `MessageLog`; use soft-delete/archival only.

### 7.7 Dashboard
- **F-25** Summary tiles: jobs by status, jobs needing scheduling, upcoming appointments, jobs awaiting report.
- **F-26** Per-project detail view: contacts (both parties clearly labeled), appointment, status, message thread, compliance record, report link.

---

## 8. Integrations

### 8.1 Cal.com (scheduling)
- **Direction:** outbound link generation + inbound webhooks.
- **Webhooks consumed:** `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`.
- **Endpoint:** `POST /api/webhooks/calcom` — verify signature, match by `bookingToken`/metadata, upsert `Appointment`, transition status.
- **Config:** `CALCOM_API_KEY`, `CALCOM_WEBHOOK_SECRET`, `CALCOM_EVENT_TYPE_ID`.

### 8.2 Twilio (SMS)
- **Direction:** outbound send + inbound receive + delivery status.
- **Endpoints:** `POST /api/webhooks/twilio/inbound` (tenant replies), `POST /api/webhooks/twilio/status` (delivery receipts).
- **Compliance:** A2P 10DLC brand + campaign registration required before production sending. Budget lead time (days–weeks) for approval. Advanced Opt-Out enabled.
- **Config:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_MESSAGING_SERVICE_SID`.

### 8.3 Resend (email)
- **Direction:** outbound transactional email.
- **Endpoint (optional):** `POST /api/webhooks/resend` for delivery/bounce events.
- **Config:** `RESEND_API_KEY`, verified sending domain.

### 8.4 Object storage (reports)
- Report PDFs stored in S3-compatible storage (or Vercel Blob). `reportUrl` persisted on `TestRecord`. Access via signed URLs.

---

## 9. Notification & automation matrix

| Trigger | Recipient | Channel | Content |
|---|---|---|---|
| Project created, tenant added | Tenant | SMS + Email | "Your unit at {address} needs a lead test. Pick a time: {bookingLink}." Captures SMS opt-in. |
| Booking created (webhook) | Tenant | SMS + Email | Confirmation with date/time. |
| Booking created (webhook) | Landlord | Email | "A lead test for {address} is scheduled for {date}." |
| 24h before appointment | Tenant | SMS | Reminder + reschedule link. |
| Morning of appointment | Tenant | SMS | "Your inspector arrives today between {window}." |
| Tenant replies (inbound) | Office | In-app | Logged to thread; staff notified of unread. |
| Status → INSPECTED | Landlord | Email | "The lead test at {address} is complete. Report to follow." |
| Report filed → REPORT_SENT | Landlord + Tenant | Email | Report PDF link. |
| Booking cancelled | Office | In-app / Email | Alert to re-coordinate. |

All messages are templated and editable by Admin. Every send/receipt is written to `MessageLog`.

---

## 10. Non-functional requirements

- **NFR-1 (Compliance retention):** `TestRecord` and `MessageLog` retained ≥10 years; no hard delete.
- **NFR-2 (TCPA/A2P):** No SMS without opt-in; STOP honored; 10DLC registered.
- **NFR-3 (Security):** Signed, expiring tokens for tenant links; webhook signature verification; secrets in env, never in repo; least-privilege API scopes.
- **NFR-4 (Auth):** Staff behind login; role-based access (Admin vs Inspector).
- **NFR-5 (Reliability):** Webhook handlers idempotent (dedupe on `externalId`); provider sends retried with backoff; failed messages surfaced in-app, not silently dropped.
- **NFR-6 (Auditability):** Every outbound/inbound message and every status change is recorded with timestamp and actor.
- **NFR-7 (Privacy):** Tenant PII (phone, email) access restricted to staff; not exposed on the landlord's emails beyond what's necessary.

---

## 11. Technology stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Already scaffolded in this repo. |
| ORM / DB | Prisma + PostgreSQL (Neon) | Repo already uses Prisma. |
| Auth | NextAuth | Already present. |
| Scheduling | Cal.com | Cloud; embed + webhooks. |
| SMS | Twilio | Two-way + 10DLC. |
| Email | Resend | Transactional. |
| Storage | Vercel Blob or S3 | Report PDFs. |
| Hosting | Vercel | Push-to-deploy. |
| UI | Existing component library in repo | Reuse. |

Estimated run cost at low volume: **~$35/mo** plus per-message SMS.

---

## 12. Architecture

```
Staff / Inspector ──▶ Next.js app (dashboard, project board, message thread)
                          │
                          ├─▶ Prisma ──▶ PostgreSQL (projects, contacts, records, logs)
                          ├─▶ Cal.com API      (generate booking links)
                          ├─▶ Twilio API       (send SMS)
                          ├─▶ Resend API       (send email)
                          └─▶ Object storage    (report PDFs)

Inbound webhooks ──▶ /api/webhooks/{calcom,twilio/inbound,twilio/status,resend}
                          └─▶ upsert Appointment / MessageLog, transition status, notify
```

Tenant interacts only through the signed booking link and SMS/email — never logs in.

---

## 13. Multi-firm (SaaS) extension path — not built in v1

Designed so this is an extension, not a rewrite:
- Add an `Org` model; add `orgId` to `Project`, `Contact`, `User`, message templates.
- Scope every query by `orgId`; add org-switching to auth.
- Per-org integration credentials (each firm brings its own Twilio/Cal.com, or you resell under a master account with per-org sub-accounts).
- Per-org branding on tenant links and emails.

Doing single-client first keeps v1 small; the `orgId` seam is the only structural change later.

---

## 14. Build plan / milestones

*Experienced-dev pace; roughly double if learning the stack.*

| Phase | Deliverable |
|---|---|
| **Week 1 — Foundation** | Swap repo schema to this model. Project CRUD, two-contact model, status board, auth roles. |
| **Week 2 — Scheduling** | Cal.com integration: booking link generation, `/api/webhooks/calcom`, appointment sync, status transitions. |
| **Week 3 — Messaging & automation** | Twilio send/receive + Resend, message thread UI, the §9 notification matrix, opt-in handling, message log. |
| **Week 3–4 — Compliance & ship** | Test outcome + report upload/link, retention rules, dashboard tiles, end-to-end test with a real address, deploy. |

**~2.5–3 weeks** to a reliable v1 (no report engine to build). A2P 10DLC registration should be started on day one since approval is the long pole.

---

## 15. Assumptions & open questions

**Assumptions**
1. Single client / single firm for v1.
2. XRF software produces the HUD/EPA report; this app only stores/links it.
3. Invoicing stays in the client's existing accounting flow; app records the bill-to party only.
4. US-based; TCPA/A2P 10DLC applies.

**Open questions for the client**
1. Do they want a **read-only landlord portal**, or is email to the landlord enough for v1? (Assumed: email only.)
2. One Twilio number for all tenants, or per-inspector numbers?
3. Where should report PDFs live — uploaded into the app, or just a link to wherever the XRF software already stores them?
4. Any state-specific lead notification wording that must appear verbatim in tenant messages? (e.g., NY/NJ/MA rules.)
5. Expected monthly job volume (sizes SMS cost and whether manual seams are acceptable).

---

*End of specification.*
