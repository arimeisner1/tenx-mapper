"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface ProjectResult {
  id: string;
  name: string;
  description: string | null;
}

interface WorkflowResult {
  id: string;
  name: string;
  description: string | null;
  project: { id: string; name: string };
}

interface ToolResult {
  id: string;
  name: string;
  category: string;
  logoUrl: string | null;
}

interface SearchResults {
  projects: ProjectResult[];
  workflows: WorkflowResult[];
  tools: ToolResult[];
}

type FlatItem =
  | { type: "project"; data: ProjectResult }
  | { type: "workflow"; data: WorkflowResult }
  | { type: "tool"; data: ToolResult };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    workflows: [],
    tools: [],
  });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Build flat list for keyboard navigation
  const flatItems: FlatItem[] = [];
  for (const p of results.projects) flatItems.push({ type: "project", data: p });
  for (const w of results.workflows) flatItems.push({ type: "workflow", data: w });
  for (const t of results.tools) flatItems.push({ type: "tool", data: t });

  // Open/close with Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setResults({ projects: [], workflows: [], tools: [] });
      setActiveIndex(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], workflows: [], tools: [] });
      setActiveIndex(0);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        );
        if (res.ok) {
          const data: SearchResults = await res.json();
          setResults(data);
          setActiveIndex(0);
        }
      } catch {
        // silently ignore fetch errors
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const active = listRef.current.querySelector(
        `[data-index="${activeIndex}"]`
      );
      active?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleSelect = useCallback(
    (item: FlatItem) => {
      setOpen(false);
      if (item.type === "project") {
        router.push(`/project/${item.data.id}`);
      } else if (item.type === "workflow") {
        router.push(`/workflow/${item.data.id}`);
      } else {
        // Copy tool name to clipboard
        navigator.clipboard.writeText(item.data.name).catch(() => {});
      }
    },
    [router]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatItems[activeIndex]) {
        handleSelect(flatItems[activeIndex]);
      }
    }
  }

  if (!open) return null;

  const hasResults = flatItems.length > 0;
  const hasQuery = query.trim().length > 0;

  // Determine group start indices for rendering headers
  let idx = 0;
  const projectStart = 0;
  const workflowStart = results.projects.length;
  const toolStart = results.projects.length + results.workflows.length;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === overlayRef.current) setOpen(false);
      }}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <svg
            className="h-5 w-5 shrink-0 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search projects, workflows, tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {loading && (
            <svg
              className="h-4 w-4 animate-spin text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {!hasQuery && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              Type to search across projects, workflows, and tools...
            </p>
          )}

          {hasQuery && !hasResults && !loading && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </p>
          )}

          {/* Projects */}
          {results.projects.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Projects
              </div>
              {results.projects.map((project, i) => {
                idx = projectStart + i;
                return (
                  <button
                    key={project.id}
                    data-index={idx}
                    onClick={() =>
                      handleSelect({ type: "project", data: project })
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      activeIndex === idx
                        ? "bg-primary/10 text-foreground"
                        : "text-card-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                        />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{project.name}</div>
                      {project.description && (
                        <div className="truncate text-xs text-muted-foreground">
                          {project.description}
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-500">
                      Project
                    </span>
                  </button>
                );
              })}
            </>
          )}

          {/* Workflows */}
          {results.workflows.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                Workflows
              </div>
              {results.workflows.map((workflow, i) => {
                idx = workflowStart + i;
                return (
                  <button
                    key={workflow.id}
                    data-index={idx}
                    onClick={() =>
                      handleSelect({ type: "workflow", data: workflow })
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      activeIndex === idx
                        ? "bg-primary/10 text-foreground"
                        : "text-card-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-violet-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                        />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{workflow.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {workflow.project.name}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-500">
                      Workflow
                    </span>
                  </button>
                );
              })}
            </>
          )}

          {/* Tools */}
          {results.tools.length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                Software Tools
              </div>
              {results.tools.map((tool, i) => {
                idx = toolStart + i;
                return (
                  <button
                    key={tool.id}
                    data-index={idx}
                    onClick={() =>
                      handleSelect({ type: "tool", data: tool })
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      activeIndex === idx
                        ? "bg-primary/10 text-foreground"
                        : "text-card-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"
                        />
                      </svg>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{tool.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {tool.category}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                      Tool
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer hints */}
        {hasResults && (
          <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                &uarr;
              </kbd>
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                &darr;
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                &crarr;
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                esc
              </kbd>
              close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
