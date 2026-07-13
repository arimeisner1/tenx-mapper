import express from "express";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { db } from "./db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

export const STATUSES = ["NEW", "SCHEDULED", "INSPECTED", "REPORT_SENT", "CLOSED"];

// ---- helpers ----------------------------------------------------------------
function newProject(body) {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    address: (body.address || "").trim(),
    unit: (body.unit || "").trim(),
    status: "NEW",
    invoiceSent: false,
    createdAt: now,
    updatedAt: now,
    bookingToken: randomUUID().slice(0, 8),
    landlord: {
      name: (body.landlordName || "").trim(),
      email: (body.landlordEmail || "").trim(),
      phone: (body.landlordPhone || "").trim(),
    },
    tenant: {
      name: (body.tenantName || "").trim(),
      email: (body.tenantEmail || "").trim(),
      phone: (body.tenantPhone || "").trim(),
    },
    messages: [],
  };
}

function bookingLink(project) {
  const base = db.getSettings().calcomBookingUrl;
  if (!base) return "";
  const sep = base.includes("?") ? "&" : "?";
  const parts = [`ref=${project.bookingToken}`];
  if (project.address)
    parts.push(`address=${encodeURIComponent(`${project.address}${project.unit ? " " + project.unit : ""}`)}`);
  if (project.tenant?.name) parts.push(`name=${encodeURIComponent(project.tenant.name)}`);
  if (project.tenant?.email) parts.push(`email=${encodeURIComponent(project.tenant.email)}`);
  return `${base}${sep}${parts.join("&")}`;
}

async function sendSms(to, body) {
  const { twilioSid, twilioToken, twilioFrom } = db.getSettings();
  if (!twilioSid || !twilioToken || !twilioFrom) {
    return { status: "logged", note: "Twilio not connected — message stored only" };
  }
  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
  const params = new URLSearchParams({ To: to, From: twilioFrom, Body: body });
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    const data = await res.json();
    if (!res.ok) return { status: "failed", note: data.message || `Twilio error ${res.status}` };
    return { status: "sent", note: `Twilio SID ${data.sid}` };
  } catch (err) {
    return { status: "failed", note: err.message };
  }
}

// ---- projects ---------------------------------------------------------------
app.get("/api/projects", (_req, res) => {
  res.json(db.listProjects().map((p) => ({ ...p, bookingLink: bookingLink(p) })));
});

app.post("/api/projects", (req, res) => {
  if (!req.body.address?.trim())
    return res.status(400).json({ error: "Property address is required." });
  if (!req.body.landlordName?.trim())
    return res.status(400).json({ error: "A landlord / property-manager name is required." });
  const project = db.addProject(newProject(req.body));
  res.status(201).json({ ...project, bookingLink: bookingLink(project) });
});

app.get("/api/projects/:id", (req, res) => {
  const p = db.getProject(req.params.id);
  if (!p) return res.status(404).json({ error: "Project not found." });
  res.json({ ...p, bookingLink: bookingLink(p) });
});

app.patch("/api/projects/:id", (req, res) => {
  const p = db.getProject(req.params.id);
  if (!p) return res.status(404).json({ error: "Project not found." });
  const patch = {};
  if (req.body.status !== undefined) {
    if (!STATUSES.includes(req.body.status))
      return res.status(400).json({ error: "Unknown status." });
    patch.status = req.body.status;
    if (req.body.status !== "NEW" && !p.scheduledAt && req.body.status === "SCHEDULED")
      patch.scheduledAt = new Date().toISOString();
  }
  if (req.body.invoiceSent !== undefined) patch.invoiceSent = !!req.body.invoiceSent;
  if (req.body.landlord) patch.landlord = { ...p.landlord, ...req.body.landlord };
  if (req.body.tenant) patch.tenant = { ...p.tenant, ...req.body.tenant };
  patch.updatedAt = new Date().toISOString();
  const updated = db.updateProject(p.id, patch);
  res.json({ ...updated, bookingLink: bookingLink(updated) });
});

// ---- messaging --------------------------------------------------------------
app.post("/api/projects/:id/messages", async (req, res) => {
  const p = db.getProject(req.params.id);
  if (!p) return res.status(404).json({ error: "Project not found." });
  const body = (req.body.body || "").trim();
  if (!body) return res.status(400).json({ error: "Message body is empty." });
  const to = req.body.to || p.tenant?.phone;
  if (!to) return res.status(400).json({ error: "No tenant phone number on file." });

  const result = await sendSms(to, body);
  const message = {
    id: randomUUID(),
    direction: "OUTBOUND",
    channel: "SMS",
    to,
    body,
    status: result.status,
    note: result.note,
    at: new Date().toISOString(),
  };
  db.pushMessage(p.id, message);
  db.updateProject(p.id, { updatedAt: message.at });
  res.status(201).json(message);
});

// Convenience: send the booking link to the tenant by SMS.
app.post("/api/projects/:id/send-booking", async (req, res) => {
  const p = db.getProject(req.params.id);
  if (!p) return res.status(404).json({ error: "Project not found." });
  const link = bookingLink(p);
  if (!link) return res.status(400).json({ error: "Add your Cal.com booking URL in Settings first." });
  if (!p.tenant?.phone) return res.status(400).json({ error: "No tenant phone number on file." });
  const body = `Hi${p.tenant.name ? " " + p.tenant.name : ""}, your unit at ${p.address} needs a lead test. Pick a time that works: ${link}`;
  const result = await sendSms(p.tenant.phone, body);
  const message = {
    id: randomUUID(),
    direction: "OUTBOUND",
    channel: "SMS",
    to: p.tenant.phone,
    body,
    status: result.status,
    note: result.note,
    at: new Date().toISOString(),
  };
  db.pushMessage(p.id, message);
  res.status(201).json(message);
});

// ---- settings ---------------------------------------------------------------
app.get("/api/settings", (_req, res) => {
  const s = db.getSettings();
  // never leak secrets to the browser — report only whether each is connected
  res.json({
    calcomBookingUrl: s.calcomBookingUrl,
    calcomConnected: !!s.calcomApiKey,
    twilioFrom: s.twilioFrom,
    twilioConnected: !!(s.twilioSid && s.twilioToken && s.twilioFrom),
  });
});

app.post("/api/settings", (req, res) => {
  const patch = {};
  for (const k of ["calcomBookingUrl", "calcomApiKey", "twilioSid", "twilioToken", "twilioFrom"]) {
    if (req.body[k] !== undefined && req.body[k] !== "") patch[k] = req.body[k].trim();
  }
  db.saveSettings(patch);
  const s = db.getSettings();
  res.json({
    calcomBookingUrl: s.calcomBookingUrl,
    calcomConnected: !!s.calcomApiKey,
    twilioFrom: s.twilioFrom,
    twilioConnected: !!(s.twilioSid && s.twilioToken && s.twilioFrom),
  });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Lead Tracker running on http://localhost:${PORT}`));
}

export default app;
