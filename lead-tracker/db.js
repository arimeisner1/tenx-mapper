// Ultra-light JSON persistence. Zero native deps, atomic writes.
// NOTE: On ephemeral hosts (Railway default) this resets on redeploy.
// Attach a persistent volume and point DATA_FILE at it, or swap for Postgres, for production.
import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DATA_FILE = process.env.DATA_FILE || new URL("./data.json", import.meta.url).pathname;

const DEFAULTS = {
  settings: {
    calcomBookingUrl: "", // e.g. https://cal.com/your-team/lead-test
    calcomApiKey: "",
    twilioSid: "",
    twilioToken: "",
    twilioFrom: "",
  },
  projects: [],
};

let cache = null;

function load() {
  if (cache) return cache;
  if (existsSync(DATA_FILE)) {
    try {
      cache = { ...DEFAULTS, ...JSON.parse(readFileSync(DATA_FILE, "utf8")) };
    } catch {
      cache = structuredClone(DEFAULTS);
    }
  } else {
    cache = structuredClone(DEFAULTS);
  }
  return cache;
}

function persist() {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const tmp = `${DATA_FILE}.tmp`;
  writeFileSync(tmp, JSON.stringify(cache, null, 2));
  renameSync(tmp, DATA_FILE); // atomic swap
}

export const db = {
  getSettings() {
    return load().settings;
  },
  saveSettings(patch) {
    const s = load();
    s.settings = { ...s.settings, ...patch };
    persist();
    return s.settings;
  },
  listProjects() {
    return load().projects;
  },
  getProject(id) {
    return load().projects.find((p) => p.id === id) || null;
  },
  addProject(project) {
    load().projects.unshift(project);
    persist();
    return project;
  },
  updateProject(id, patch) {
    const p = this.getProject(id);
    if (!p) return null;
    Object.assign(p, patch);
    persist();
    return p;
  },
  pushMessage(id, message) {
    const p = this.getProject(id);
    if (!p) return null;
    p.messages.push(message);
    persist();
    return message;
  },
};
