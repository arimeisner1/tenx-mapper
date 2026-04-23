"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Plus, Trash2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NodeMetadata {
  id?: string;
  nodeId: string;
  name: string;
  description?: string | null;
  notes?: string | null;
  links?: unknown;
  costEstimate?: string | null;
  apiEndpoint?: string | null;
  status?: string;
  customFields?: unknown;
}

interface FormState {
  nodeId: string;
  name: string;
  description: string;
  notes: string;
  links: string[];
  costEstimate: string;
  apiEndpoint: string;
  status: string;
  customFields: Record<string, string>;
}

interface DetailPanelProps {
  workflowId: string;
  selectedNodeId: string | null;
  selectedNodeLabel: string;
  metadata: NodeMetadata | null;
  onClose: () => void;
  onDeleteNode: (nodeId: string) => void;
  onMetadataUpdate: (metadata: NodeMetadata) => void;
}

export function DetailPanel({
  workflowId,
  selectedNodeId,
  selectedNodeLabel,
  metadata,
  onClose,
  onDeleteNode,
  onMetadataUpdate,
}: DetailPanelProps) {
  const [form, setForm] = useState<FormState>({
    nodeId: "",
    name: "",
    description: "",
    notes: "",
    links: [],
    costEstimate: "",
    apiEndpoint: "",
    status: "active",
    customFields: {},
  });
  const [saving, setSaving] = useState(false);
  const [newLink, setNewLink] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  useEffect(() => {
    if (metadata) {
      setForm({
        nodeId: metadata.nodeId,
        name: metadata.name,
        description: metadata.description || "",
        notes: metadata.notes || "",
        links: Array.isArray(metadata.links) ? (metadata.links as string[]) : [],
        costEstimate: metadata.costEstimate || "",
        apiEndpoint: metadata.apiEndpoint || "",
        status: metadata.status || "active",
        customFields:
          typeof metadata.customFields === "object" && metadata.customFields
            ? (metadata.customFields as Record<string, string>)
            : {},
      });
    } else if (selectedNodeId) {
      setForm({
        nodeId: selectedNodeId,
        name: selectedNodeLabel,
        description: "",
        notes: "",
        links: [],
        costEstimate: "",
        apiEndpoint: "",
        status: "active",
        customFields: {},
      });
    }
  }, [metadata, selectedNodeId, selectedNodeLabel]);

  const handleSave = useCallback(async () => {
    if (!selectedNodeId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/metadata`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, nodeId: selectedNodeId }),
      });
      if (res.ok) {
        const updated = await res.json();
        onMetadataUpdate(updated);
      }
    } finally {
      setSaving(false);
    }
  }, [form, selectedNodeId, workflowId, onMetadataUpdate]);

  const addLink = () => {
    if (!newLink.trim()) return;
    setForm((prev) => ({ ...prev, links: [...(prev.links || []), newLink.trim()] }));
    setNewLink("");
  };

  const removeLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index),
    }));
  };

  const addCustomField = () => {
    if (!newFieldKey.trim()) return;
    setForm((prev) => ({
      ...prev,
      customFields: { ...(prev.customFields || {}), [newFieldKey.trim()]: newFieldValue },
    }));
    setNewFieldKey("");
    setNewFieldValue("");
  };

  const removeCustomField = (key: string) => {
    setForm((prev) => {
      const fields = { ...(prev.customFields || {}) };
      delete fields[key];
      return { ...prev, customFields: fields };
    });
  };

  const isOpen = selectedNodeId !== null;

  return (
    <div
      className={cn(
        "absolute right-0 top-0 z-10 h-full w-[360px] bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700 shadow-lg flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          Node Details
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
            Name
          </label>
          <Input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="h-8 text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
            Description
          </label>
          <Input
            value={form.description || ""}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="h-8 text-sm"
            placeholder="Brief description..."
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
            Notes
          </label>
          <textarea
            value={form.notes || ""}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 resize-y"
            placeholder="Additional notes..."
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
            className="w-full h-8 rounded-md border border-input bg-transparent px-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50"
          >
            <option value="active">Active</option>
            <option value="planned">Planned</option>
            <option value="deprecated">Deprecated</option>
          </select>
        </div>

        {/* Cost Estimate */}
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
            Cost Estimate
          </label>
          <Input
            value={form.costEstimate || ""}
            onChange={(e) => setForm((p) => ({ ...p, costEstimate: e.target.value }))}
            className="h-8 text-sm"
            placeholder="e.g. $99/mo"
          />
        </div>

        {/* API Endpoint */}
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
            API Endpoint
          </label>
          <Input
            value={form.apiEndpoint || ""}
            onChange={(e) => setForm((p) => ({ ...p, apiEndpoint: e.target.value }))}
            className="h-8 text-sm"
            placeholder="https://api.example.com"
          />
        </div>

        {/* Links */}
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
            Links
          </label>
          <div className="space-y-1.5">
            {(form.links || []).map((link, i) => (
              <div key={i} className="flex items-center gap-1.5 group">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-xs text-blue-600 dark:text-blue-400 hover:underline truncate"
                >
                  <ExternalLink className="w-3 h-3 inline mr-1" />
                  {link}
                </a>
                <button
                  onClick={() => removeLink(i)}
                  className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex gap-1.5">
              <Input
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
                className="h-7 text-xs flex-1"
                placeholder="https://..."
              />
              <Button variant="outline" size="sm" className="h-7 px-2" onClick={addLink}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Custom Fields */}
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
            Custom Fields
          </label>
          <div className="space-y-1.5">
            {Object.entries(form.customFields || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1.5 group">
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 min-w-[60px]">
                  {key}:
                </span>
                <span className="text-xs text-neutral-700 dark:text-neutral-300 flex-1 truncate">
                  {value}
                </span>
                <button
                  onClick={() => removeCustomField(key)}
                  className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="flex gap-1.5">
              <Input
                value={newFieldKey}
                onChange={(e) => setNewFieldKey(e.target.value)}
                className="h-7 text-xs w-24"
                placeholder="Key"
              />
              <Input
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomField()}
                className="h-7 text-xs flex-1"
                placeholder="Value"
              />
              <Button variant="outline" size="sm" className="h-7 px-2" onClick={addCustomField}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-2">
        <Button onClick={handleSave} disabled={saving} className="w-full" size="sm">
          {saving ? "Saving..." : "Save Details"}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => selectedNodeId && onDeleteNode(selectedNodeId)}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Delete Node
        </Button>
      </div>
    </div>
  );
}
