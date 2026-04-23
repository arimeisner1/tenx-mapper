"use client";

import { useState, useMemo, type DragEvent } from "react";
import { Search, Plus, ChevronDown, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const COLOR_OPTIONS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
];

export function SoftwareLibrary({ catalog, collapsed, onToggle }: SoftwareLibraryProps) {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customColor, setCustomColor] = useState("#8b5cf6");

  const filtered = useMemo(() => {
    if (!search.trim()) return catalog;
    const q = search.toLowerCase();
    return catalog.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
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
    const nodeData = {
      type: "softwareNode",
      label: entry.name,
      logoUrl: entry.logoUrl,
      category: entry.category,
      color: entry.defaultColor,
      subtitle: entry.category,
    };
    e.dataTransfer.setData("application/tenx-node", JSON.stringify(nodeData));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragStartCustom = (e: DragEvent) => {
    if (!customName.trim()) return;
    const nodeData = {
      type: "customNode",
      label: customName.trim(),
      color: customColor,
      subtitle: "Custom",
    };
    e.dataTransfer.setData("application/tenx-node", JSON.stringify(nodeData));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleAddCustom = () => {
    setShowCustomForm(true);
  };

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

  return (
    <div className="absolute left-0 top-0 z-10 h-full w-[280px] bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Software Library
        </h3>
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Add Custom */}
      <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
        {!showCustomForm ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={handleAddCustom}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Custom Tool
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Tool name"
              className="h-7 text-xs"
              autoFocus
            />
            <div className="flex items-center gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCustomColor(c)}
                  className={cn(
                    "w-5 h-5 rounded-full transition-transform",
                    customColor === c && "ring-2 ring-offset-1 ring-neutral-400 scale-110"
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
                  "flex-1 text-center text-xs py-1 rounded border cursor-grab active:cursor-grabbing",
                  customName.trim()
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-transparent"
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
                className="px-2 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Catalog List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, entries]) => {
            const isExpanded = expandedCategories.has(category) || search.trim().length > 0;
            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                  {category}
                  <span className="ml-auto text-neutral-400 dark:text-neutral-500 normal-case">
                    {entries.length}
                  </span>
                </button>
                {isExpanded && (
                  <div className="pb-1">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, entry)}
                        className="flex items-center gap-2.5 px-4 py-1.5 mx-2 rounded-md cursor-grab active:cursor-grabbing hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        {entry.logoUrl ? (
                          <img
                            src={entry.logoUrl}
                            alt={entry.name}
                            className="w-6 h-6 rounded object-contain bg-neutral-50 dark:bg-neutral-700 p-0.5"
                          />
                        ) : (
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ backgroundColor: entry.defaultColor }}
                          >
                            {entry.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                          {entry.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        {Object.keys(grouped).length === 0 && (
          <p className="px-4 py-8 text-sm text-neutral-400 text-center">
            No tools found
          </p>
        )}
      </div>
    </div>
  );
}
