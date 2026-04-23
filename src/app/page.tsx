import Link from "next/link";
import {
  Workflow,
  BrainCircuit,
  Users,
  LayoutTemplate,
  Download,
  Library,
  FolderPlus,
  MousePointerClick,
  Share2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Workflow,
    title: "Visual Workflow Builder",
    description:
      "Drag-and-drop canvas with 800+ software tools to map any integration.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Analysis",
    description:
      "Claude AI analyzes your workflows and generates implementation plans.",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description:
      "Share workflows with clients via public links for instant feedback.",
  },
  {
    icon: LayoutTemplate,
    title: "Smart Templates",
    description:
      "Save and reuse workflow patterns across projects to move faster.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description:
      "PNG, PDF, and JSON export for presentations, docs, and handoffs.",
  },
  {
    icon: Library,
    title: "Complete Tool Library",
    description:
      "21 categories covering every SaaS tool imaginable, always up to date.",
  },
];

const steps = [
  {
    number: "01",
    icon: FolderPlus,
    title: "Create a Project",
    description: "Organize workflows by client to keep everything tidy.",
  },
  {
    number: "02",
    icon: MousePointerClick,
    title: "Map Your Workflow",
    description: "Drag tools onto the canvas and connect them visually.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Generate & Share",
    description:
      "AI builds the implementation plan — share it with clients instantly.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
        {/* Animated dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Glow accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[120px]"
        />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-32 text-center sm:py-44">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Now with AI workflow analysis
          </span>

          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            TenX Mapper
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            Visually map, plan, and automate software workflows for your
            clients&mdash;all from one powerful canvas.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Start Mapping
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Go to Dashboard
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything you need to deliver workflow projects
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
              From mapping to implementation plans, TenX Mapper gives
              consultants and agencies a single tool for the entire lifecycle.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-slate-100 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-indigo-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              How It Works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Three steps to a polished workflow
            </h2>
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.number} className="relative text-center">
                <span className="text-6xl font-black text-indigo-100 select-none">
                  {s.number}
                </span>
                <div className="mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to map your first workflow?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Jump in and start building — no signup required.
          </p>
          <Link
            href="/dashboard"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-10 py-4 text-base font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-slate-900 py-10 text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 sm:flex-row sm:justify-between">
          <p className="text-sm">
            Built with{" "}
            <span className="font-semibold text-white">TenX Mapper</span>
          </p>
          <nav className="flex gap-6 text-sm">
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
            <Link href="/dashboard" className="transition hover:text-white">
              Templates
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
