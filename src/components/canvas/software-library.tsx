"use client";

import { useState, useMemo, useRef, type DragEvent, type ReactNode } from "react";
import { Search, Plus, ChevronDown, ChevronRight, X, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CatalogEntry {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  category: string;
  description: string | null;
  defaultColor: string;
}

interface SoftwareLibraryProps {
  catalog: CatalogEntry[];
  collapsed: boolean;
  onToggle: () => void;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const COLOR_OPTIONS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
];

const CATEGORY_COLORS: Record<string, string> = {
  CRM: "#3b82f6",
  "Project Management": "#8b5cf6",
  Communication: "#06b6d4",
  Marketing: "#f97316",
  Finance: "#22c55e",
  Analytics: "#eab308",
  Development: "#6366f1",
  Storage: "#64748b",
  Design: "#ec4899",
  Support: "#14b8a6",
  HR: "#f43f5e",
  Security: "#0ea5e9",
};

function getCategoryColor(category: string): string {
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  // Deterministic color from category name
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_OPTIONS[Math.abs(hash) % COLOR_OPTIONS.length];
}

/* ------------------------------------------------------------------ */
/*  Highlighted text helper                                            */
/* ------------------------------------------------------------------ */

function highlightMatch(text: string, query: string): ReactNode {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-bold text-neutral-900 dark:text-white">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Tool Card                                                          */
/* ------------------------------------------------------------------ */

function ToolCard({
  entry,
  search,
  onDragStart,
}: {
  entry: CatalogEntry;
  search: string;
  onDragStart: (e: DragEvent) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const catColor = getCategoryColor(entry.category);

  return (
    <div
      draggable
      onDragStart={(e) => {
        setDragging(true);
        onDragStart(e);
      }}
      onDragEnd={() => setDragging(false)}
      className={cn(
        "group flex items-center gap-2.5 h-12 px-2.5 rounded-lg bg-white dark:bg-neutral-800",
        "shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
        "cursor-grab active:cursor-grabbing",
        "transition-all duration-150 ease-out",
        "hover:-translate-y-[1px] hover:shadow-[0_3px_8px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_3px_8px_rgba(0,0,0,0.4)]",
        dragging && "scale-[0.95] -rotate-2 opacity-80"
      )}
      style={{
        borderLeft: `3px solid ${catColor}`,
        ...(dragging ? {} : {}),
      }}
      title={entry.description || entry.name}
    >
      {/* Logo */}
      {entry.logoUrl ? (
        <img
          src={entry.logoUrl}
          alt={entry.name}
          className="w-7 h-7 rounded-md object-contain bg-neutral-50 dark:bg-neutral-700 p-0.5 flex-shrink-0"
        />
      ) : (
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: catColor }}
        >
          {entry.name.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Name + Category badge */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200 truncate leading-tight">
          {highlightMatch(entry.name, search)}
        </span>
        <span
          className="inline-flex items-center self-start mt-0.5 px-1.5 py-[1px] rounded-full text-[10px] font-medium leading-tight text-white"
          style={{ backgroundColor: `${catColor}cc` }}
        >
          {entry.category}
        </span>
      </div>

      {/* Drag grip */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity">
        <GripVertical className="w-3.5 h-3.5 text-neutral-400" />
      </div>

      {/* Hover tint overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: `${catColor}0d` }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category Accordion                                                 */
/* ------------------------------------------------------------------ */

function CategorySection({
  category,
  entries,
  totalCount,
  isExpanded,
  onToggle,
  search,
  onDragStart,
}: {
  category: string;
  entries: CatalogEntry[];
  totalCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  search: string;
  onDragStart: (e: DragEvent, entry: CatalogEntry) => void;
}) {
  const catColor = getCategoryColor(category);
  const countLabel =
    search.trim() && entries.length !== totalCount
      ? `${entries.length}/${totalCount}`
      : `${totalCount}`;

  return (
    <div className="mb-1">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform" />
        )}
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: catColor }}
        />
        <span className="uppercase tracking-wide truncate">{category}</span>
        <span
          className="ml-auto flex-shrink-0 px-1.5 py-[1px] rounded-full text-[10px] font-semibold tabular-nums text-white"
          style={{ backgroundColor: `${catColor}99` }}
        >
          {countLabel}
        </span>
      </button>

      {/* Cards */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 px-3 pb-2 pt-0.5">
            {entries.map((entry) => (
              <ToolCard
                key={entry.id}
                entry={entry}
                search={search}
                onDragStart={(e) => onDragStart(e, entry)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function SoftwareLibrary({ catalog, collapsed, onToggle }: SoftwareLibraryProps) {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const entry of catalog) cats.add(entry.category);
    return cats;
  }, [catalog]);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(allCategories);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customColor, setCustomColor] = useState("#8b5cf6");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of catalog) {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    }
    return counts;
  }, [catalog]);

  const filtered = useMemo(() => {
    if (!search.trim()) return catalog;
    const q = search.toLowerCase();
    return catalog.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        c.slug.toLowerCase().includes(q)
    );
  }, [catalog, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, CatalogEntry[]> = {};
    for (const entry of filtered) {
      if (!groups[entry.category]) groups[entry.category] = [];
      groups[entry.category].push(entry);
    }
    return groups;
  }, [filtered]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const onDragStart = (e: DragEvent, entry: CatalogEntry) => {
    e.dataTransfer.setData(
      "application/tenx-node",
      JSON.stringify({
        type: "softwareNode",
        label: entry.name,
        logoUrl: entry.logoUrl,
        category: entry.category,
        color: entry.defaultColor,
        subtitle: "",
      })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragStartCustom = (e: DragEvent) => {
    if (!customName.trim()) return;
    e.dataTransfer.setData(
      "application/tenx-node",
      JSON.stringify({
        type: "customNode",
        label: customName.trim(),
        color: customColor,
        subtitle: "Custom",
      })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  /* ---- Collapsed state ---- */
  if (collapsed) {
    return (
      <div className="absolute left-0 top-0 z-10 h-full">
        <button
          onClick={onToggle}
          className="m-3 p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          title="Open software library"
        >
          <ChevronRight className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
        </button>
      </div>
    );
  }

  /* ---- Expanded state ---- */
  return (
    <div className="absolute left-0 top-0 z-10 h-full w-[300px] bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 flex flex-col shadow-lg">
      {/* ---- Sticky Header ---- */}
      <div className="sticky top-0 z-20 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            Software Library
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 tabular-nums bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full font-medium">
              {catalog.length} tools
            </span>
            <button
              onClick={onToggle}
              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>

        {/* ---- Search ---- */}
        <div className="px-3 pb-2.5">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tools..."
              className="pl-8 pr-8 h-8 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-750"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  searchRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
              >
                <X className="w-3 h-3 text-neutral-400" />
              </button>
            )}
          </div>
          {search.trim() && (
            <p className="text-[11px] text-neutral-400 mt-1.5 px-0.5 tabular-nums">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} across{" "}
              {Object.keys(grouped).length} categor
              {Object.keys(grouped).length !== 1 ? "ies" : "y"}
            </p>
          )}
        </div>
      </div>

      {/* ---- Add Custom Tool ---- */}
      <div className="px-3 py-2.5 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
        {!showCustomForm ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-8 rounded-lg border-dashed border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            onClick={() => setShowCustomForm(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Custom Tool
          </Button>
        ) : (
          <div className="space-y-2.5 animate-in slide-in-from-top-2 duration-200">
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Tool name"
              className="h-8 text-xs rounded-lg"
              autoFocus
            />
            <div className="flex items-center gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCustomColor(c)}
                  className={cn(
                    "w-5 h-5 rounded-full transition-all duration-150",
                    customColor === c
                      ? "ring-2 ring-offset-1 ring-neutral-400 scale-110"
                      : "hover:scale-110"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-1.5">
              <div
                draggable={!!customName.trim()}
                onDragStart={onDragStartCustom}
                className={cn(
                  "flex-1 text-center text-xs py-1.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all font-medium",
                  customName.trim()
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-transparent hover:opacity-90"
                    : "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                )}
              >
                Drag to canvas
              </div>
              <button
                onClick={() => {
                  setShowCustomForm(false);
                  setCustomName("");
                }}
                className="px-3 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---- Category List ---- */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, entries]) => {
            const isExpanded =
              expandedCategories.has(category) || search.trim().length > 0;
            const totalCount = categoryCounts[category] || entries.length;
            return (
              <CategorySection
                key={category}
                category={category}
                entries={entries}
                totalCount={totalCount}
                isExpanded={isExpanded}
                onToggle={() => toggleCategory(category)}
                search={search}
                onDragStart={onDragStart}
              />
            );
          })}

        {/* No results */}
        {Object.keys(grouped).length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <Search className="w-8 h-8 text-neutral-300 dark:text-neutral-600 mb-3" />
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
              No tools found
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-3">
              Try a different search term or add a custom tool.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => {
                setSearch("");
                setShowCustomForm(true);
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Custom Tool
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
