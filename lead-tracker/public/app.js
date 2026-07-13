const STATUSES = ["NEW", "SCHEDULED", "INSPECTED", "REPORT_SENT", "CLOSED"];
const LABELS = { NEW: "New", SCHEDULED: "Scheduled", INSPECTED: "Inspected", REPORT_SENT: "Report sent", CLOSED: "Closed" };
const DOTS = { NEW: "var(--info)", SCHEDULED: "var(--accent)", INSPECTED: "var(--accent-ink)", REPORT_SENT: "var(--good)", CLOSED: "var(--ink-faint)" };

let projects = [];
let filter = "ALL";
let openId = null;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => (s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function api(path, opts) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...opts });
  const data = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(data?.error || "Request failed");
  return data;
}

function toast(msg, isErr) {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast" + (isErr ? " err" : "");
  setTimeout(() => t.classList.add("hidden"), 2600);
}

// ---- navigation -------------------------------------------------------------
$$(".nav__btn").forEach((b) =>
  b.addEventListener("click", () => {
    $$(".nav__btn").forEach((x) => x.classList.remove("is-active"));
    b.classList.add("is-active");
    const v = b.dataset.view;
    $("#view-dashboard").classList.toggle("hidden", v !== "dashboard");
    $("#view-settings").classList.toggle("hidden", v !== "settings");
    if (v === "settings") loadSettings();
  })
);

// theme
const themeToggle = $("#themeToggle");
themeToggle.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "dark" ? "light" : cur === "light" ? "dark" : (matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", next);
});

// ---- dashboard --------------------------------------------------------------
function tiles() {
  const by = (s) => projects.filter((p) => p.status === s).length;
  const invOut = projects.filter((p) => (p.status === "REPORT_SENT" || p.status === "CLOSED") && !p.invoiceSent).length;
  const data = [
    { label: "Needs scheduling", n: by("NEW"), c: DOTS.NEW },
    { label: "Scheduled", n: by("SCHEDULED"), c: DOTS.SCHEDULED },
    { label: "Awaiting report", n: by("INSPECTED"), c: DOTS.INSPECTED },
    { label: "Report sent", n: by("REPORT_SENT"), c: DOTS.REPORT_SENT },
    { label: "Invoice outstanding", n: invOut, c: "var(--crit)" },
  ];
  $("#tiles").innerHTML = data
    .map((d) => `<div class="tile"><span><span class="dot" style="background:${d.c}"></span>${d.label}</span><b>${d.n}</b></div>`)
    .join("");
}

function filters() {
  const opts = ["ALL", ...STATUSES];
  $("#filters").innerHTML = opts
    .map((o) => `<button class="filter ${filter === o ? "is-active" : ""}" data-filter="${o}">${o === "ALL" ? "All" : LABELS[o]}</button>`)
    .join("");
  $$("#filters .filter").forEach((b) =>
    b.addEventListener("click", () => { filter = b.dataset.filter; render(); })
  );
}

function stepper(status) {
  const idx = STATUSES.indexOf(status);
  const bars = STATUSES.map((s, i) => `<div class="step ${i < idx ? "done" : ""} ${i === idx ? "current" : ""}"></div>`).join("");
  return `<div class="stepper">${bars}</div>`;
}

function prow(p) {
  const inv = p.invoiceSent
    ? `<span class="badge-inv">✓ Invoiced</span>`
    : `<span class="badge-inv off">Invoice pending</span>`;
  return `<div class="prow" data-id="${p.id}">
    <div class="prow__top">
      <div>
        <div class="prow__addr">${esc(p.address)}${p.unit ? " · " + esc(p.unit) : ""}</div>
        <div class="prow__sub">${esc(p.landlord?.name || "—")} → ${esc(p.tenant?.name || "no tenant yet")}</div>
      </div>
      <div class="prow__meta">
        ${inv}
        <span class="pill pill--${p.status}">${LABELS[p.status]}</span>
      </div>
    </div>
    ${stepper(p.status)}
  </div>`;
}

function render() {
  tiles();
  filters();
  const list = filter === "ALL" ? projects : projects.filter((p) => p.status === filter);
  const empty = projects.length === 0;
  $("#emptyState").classList.toggle("hidden", !empty);
  $("#projectList").innerHTML = empty ? "" : list.map(prow).join("");
  $$("#projectList .prow").forEach((el) => el.addEventListener("click", () => openDetail(el.dataset.id)));
}

async function loadProjects() {
  projects = await api("/api/projects");
  render();
}

// ---- detail drawer ----------------------------------------------------------
function contactRow(role, cls, c) {
  const meta = [c?.email, c?.phone].filter(Boolean).join(" · ");
  return `<div class="contact">
    <div><div class="c-name">${esc(c?.name || "—")}</div><div class="c-meta">${esc(meta || "no contact info")}</div></div>
    <span class="role ${cls}">${role}</span>
  </div>`;
}

function detailHTML(p) {
  const statusBtns = STATUSES.map(
    (s) => `<button class="sbtn ${p.status === s ? "active" : ""}" data-status="${s}">${LABELS[s]}</button>`
  ).join("");
  const link = p.bookingLink;
  const linkBlock = link
    ? `<div class="linkbox"><input id="blink" readonly value="${esc(link)}" /><button class="btn btn--sm" id="copyLink">Copy</button><button class="btn btn--sm btn--primary" id="smsLink">Text tenant</button></div>`
    : `<p class="muted" style="font-size:13px;margin:0">Add your Cal.com booking URL in <b>Settings</b> to generate a tenant booking link.</p>`;

  const thread = (p.messages || []).length
    ? p.messages
        .map(
          (m) => `<div class="msg ${m.direction}">${esc(m.body)}
            <div class="m-meta"><span class="m-status ${m.status}">${m.status}</span><span>${new Date(m.at).toLocaleString()}</span></div></div>`
        )
        .join("")
    : `<p class="muted" style="font-size:13px">No messages yet.</p>`;

  return `<div class="dpanel">
    <div class="dhead">
      <div><h2>${esc(p.address)}${p.unit ? " · " + esc(p.unit) : ""}</h2>
        <div class="prow__sub">Opened ${new Date(p.createdAt).toLocaleDateString()}</div></div>
      <button class="icon-btn" data-close>✕</button>
    </div>

    <div class="dblock"><h4>Status</h4>
      ${stepper(p.status)}
      <div class="statusrow" style="margin-top:14px">${statusBtns}</div>
    </div>

    <div class="dblock"><h4>Invoice</h4>
      <label class="checkrow ${p.invoiceSent ? "on" : ""}" id="invToggle">
        <span class="checkbox">✓</span>
        <span>${p.invoiceSent ? "Invoice sent to landlord" : "Mark invoice as sent"}</span>
      </label>
    </div>

    <div class="dblock"><h4>Contacts</h4>
      ${contactRow("Landlord", "ll", p.landlord)}
      ${contactRow("Tenant", "tn", p.tenant)}
    </div>

    <div class="dblock"><h4>Scheduling · Cal.com</h4>${linkBlock}</div>

    <div class="dblock"><h4>Tenant messages · SMS</h4>
      <div class="thread" id="thread">${thread}</div>
      <div class="composer">
        <textarea id="msgBody" placeholder="Message the tenant…"></textarea>
        <button class="btn btn--primary" id="sendMsg">Send</button>
      </div>
    </div>
  </div>`;
}

function openDetail(id) {
  const p = projects.find((x) => x.id === id);
  if (!p) return;
  openId = id;
  $("#detailPanel").innerHTML = detailHTML(p);
  $("#detailDrawer").classList.remove("hidden");
  wireDetail(p);
}

function wireDetail(p) {
  $$("#detailPanel [data-close]").forEach((b) => b.addEventListener("click", closeDetail));
  $$("#detailPanel .sbtn").forEach((b) =>
    b.addEventListener("click", async () => {
      try {
        await patch(p.id, { status: b.dataset.status });
        toast(`Moved to ${LABELS[b.dataset.status]}`);
        reopen();
      } catch (e) { toast(e.message, true); }
    })
  );
  $("#invToggle")?.addEventListener("click", async () => {
    try {
      const cur = projects.find((x) => x.id === p.id);
      await patch(p.id, { invoiceSent: !cur.invoiceSent });
      reopen();
    } catch (e) { toast(e.message, true); }
  });
  $("#copyLink")?.addEventListener("click", () => {
    navigator.clipboard.writeText($("#blink").value).then(() => toast("Booking link copied"));
  });
  $("#smsLink")?.addEventListener("click", async () => {
    try {
      const m = await api(`/api/projects/${p.id}/send-booking`, { method: "POST", body: "{}" });
      toast(m.status === "sent" ? "Booking link texted to tenant" : "Stored (Twilio not connected)");
      await loadProjects();
      reopen();
    } catch (e) { toast(e.message, true); }
  });
  $("#sendMsg")?.addEventListener("click", async () => {
    const body = $("#msgBody").value.trim();
    if (!body) return;
    try {
      const m = await api(`/api/projects/${p.id}/messages`, { method: "POST", body: JSON.stringify({ body }) });
      toast(m.status === "sent" ? "Sent via Twilio" : m.status === "failed" ? "Send failed — check Twilio" : "Stored (Twilio not connected)", m.status === "failed");
      await loadProjects();
      reopen();
    } catch (e) { toast(e.message, true); }
  });
}

async function patch(id, body) {
  await api(`/api/projects/${id}`, { method: "PATCH", body: JSON.stringify(body) });
  await loadProjects();
}
function reopen() { if (openId) openDetail(openId); }
function closeDetail() { openId = null; $("#detailDrawer").classList.add("hidden"); }
$("#detailDrawer").addEventListener("click", (e) => { if (e.target.classList.contains("drawer__scrim")) closeDetail(); });

// ---- new project ------------------------------------------------------------
function openNew() { $("#newProjectModal").classList.remove("hidden"); }
function closeNew() { $("#newProjectModal").classList.add("hidden"); $("#newProjectForm").reset(); }
$("#newProjectBtn").addEventListener("click", openNew);
$$("[data-open-new]").forEach((b) => b.addEventListener("click", openNew));
$$("#newProjectModal [data-close]").forEach((b) => b.addEventListener("click", closeNew));
$("#newProjectForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = Object.fromEntries(new FormData(e.target).entries());
  try {
    await api("/api/projects", { method: "POST", body: JSON.stringify(fd) });
    closeNew();
    toast("Project created");
    await loadProjects();
  } catch (err) { toast(err.message, true); }
});

// ---- settings ---------------------------------------------------------------
async function loadSettings() {
  const s = await api("/api/settings");
  $("#calcomBookingUrl").value = s.calcomBookingUrl || "";
  $("#twilioFrom").value = s.twilioFrom || "";
  $("#calChip").className = "chip" + (s.calcomBookingUrl ? " on" : "");
  $("#calChip").textContent = s.calcomBookingUrl ? "Connected" : "Not connected";
  $("#twilioChip").className = "chip" + (s.twilioConnected ? " on" : "");
  $("#twilioChip").textContent = s.twilioConnected ? "Connected" : "Not connected";
}
$$("[data-save-settings]").forEach((b) =>
  b.addEventListener("click", async () => {
    const body = {
      calcomBookingUrl: $("#calcomBookingUrl").value,
      calcomApiKey: $("#calcomApiKey").value,
      twilioSid: $("#twilioSid").value,
      twilioToken: $("#twilioToken").value,
      twilioFrom: $("#twilioFrom").value,
    };
    try {
      await api("/api/settings", { method: "POST", body: JSON.stringify(body) });
      $("#calcomApiKey").value = ""; $("#twilioSid").value = ""; $("#twilioToken").value = "";
      toast("Settings saved");
      await loadSettings();
      await loadProjects();
    } catch (e) { toast(e.message, true); }
  })
);

document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeNew(); closeDetail(); } });

loadProjects();
