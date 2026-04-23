"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Key,
  FileText,
  Code,
  Zap,
  BookOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AiInteraction {
  id: string;
  type: "analyze" | "generate";
  label: string;
  prompt?: string;
  response: string;
  timestamp: Date;
}

interface AiPanelProps {
  workflowId: string;
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_ACTIONS = [
  {
    id: "analyze",
    label: "Analyze Workflow",
    icon: Search,
    type: "analyze" as const,
    task: undefined,
  },
  {
    id: "implementation-plan",
    label: "Implementation Plan",
    icon: FileText,
    type: "generate" as const,
    task: "implementation-plan",
  },
  {
    id: "api-connections",
    label: "Generate API Code",
    icon: Code,
    type: "generate" as const,
    task: "api-connections",
  },
  {
    id: "automation-scripts",
    label: "Automation Scripts",
    icon: Zap,
    type: "generate" as const,
    task: "automation-scripts",
  },
  {
    id: "documentation",
    label: "Documentation",
    icon: BookOpen,
    type: "generate" as const,
    task: "documentation",
  },
];

export function AiPanel({ workflowId, isOpen, onClose }: AiPanelProps) {
  const [apiKey, setApiKey] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const [customPrompt, setCustomPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [currentLabel, setCurrentLabel] = useState("");

  const [history, setHistory] = useState<AiInteraction[]>([]);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const responseRef = useRef<HTMLDivElement>(null);
  const interactionIdRef = useRef(0);

  // Fetch settings on mount
  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  // Auto-scroll response area
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [currentResponse]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setHasApiKey(data.hasApiKey);
        if (data.anthropicApiKey) {
          setApiKey(data.anthropicApiKey);
        }
      }
    } catch {
      // Silently fail
    }
  };

  const saveApiKey = async () => {
    if (!apiKeyInput.trim()) return;
    setSavingKey(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anthropicApiKey: apiKeyInput.trim() }),
      });
      if (res.ok) {
        setHasApiKey(true);
        setApiKey(
          `${apiKeyInput.trim().slice(0, 7)}${"*".repeat(Math.max(0, apiKeyInput.trim().length - 11))}${apiKeyInput.trim().slice(-4)}`
        );
        setApiKeyInput("");
        setKeySaved(true);
        setTimeout(() => setKeySaved(false), 2000);
      }
    } finally {
      setSavingKey(false);
    }
  };

  const removeApiKey = async () => {
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anthropicApiKey: null }),
      });
      if (res.ok) {
        setHasApiKey(false);
        setApiKey("");
      }
    } catch {
      // Silently fail
    }
  };

  const streamResponse = useCallback(
    async (
      endpoint: string,
      body: Record<string, unknown>,
      label: string
    ) => {
      if (isStreaming) return;

      setIsStreaming(true);
      setCurrentResponse("");
      setCurrentLabel(label);

      const id = `ai-${++interactionIdRef.current}`;
      let fullResponse = "";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const errorMessage =
            errorData?.error || `Request failed (${res.status})`;
          setCurrentResponse(`Error: ${errorMessage}`);
          fullResponse = `Error: ${errorMessage}`;
        } else if (res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value, { stream: true });
            fullResponse += text;
            setCurrentResponse(fullResponse);
          }
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to connect";
        fullResponse = `Error: ${msg}`;
        setCurrentResponse(fullResponse);
      } finally {
        setIsStreaming(false);
        setHistory((prev) => [
          {
            id,
            type: body.task ? "generate" : "analyze",
            label,
            prompt: body.prompt as string | undefined,
            response: fullResponse,
            timestamp: new Date(),
          },
          ...prev,
        ]);
      }
    },
    [isStreaming]
  );

  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[number]) => {
    if (action.type === "analyze") {
      streamResponse(
        "/api/ai/analyze",
        { workflowId },
        action.label
      );
    } else {
      streamResponse(
        "/api/ai/generate",
        { workflowId, task: action.task },
        action.label
      );
    }
  };

  const handleCustomPrompt = () => {
    if (!customPrompt.trim() || isStreaming) return;
    streamResponse(
      "/api/ai/analyze",
      { workflowId, prompt: customPrompt.trim() },
      "Custom Prompt"
    );
    setCustomPrompt("");
  };

  const renderFormattedResponse = (text: string) => {
    // Basic markdown-like formatting
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLanguage = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code block toggle
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${i}`} className="my-2">
              {codeLanguage && (
                <div className="text-[10px] font-mono text-neutral-400 bg-neutral-800 dark:bg-neutral-950 px-3 py-1 rounded-t border border-b-0 border-neutral-700">
                  {codeLanguage}
                </div>
              )}
              <pre
                className={cn(
                  "bg-neutral-800 dark:bg-neutral-950 text-neutral-100 text-xs p-3 overflow-x-auto border border-neutral-700",
                  codeLanguage ? "rounded-b" : "rounded"
                )}
              >
                <code>{codeContent.join("\n")}</code>
              </pre>
            </div>
          );
          codeContent = [];
          codeLanguage = "";
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h4
            key={i}
            className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-3 mb-1"
          >
            {line.slice(4)}
          </h4>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h3
            key={i}
            className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-4 mb-1"
          >
            {line.slice(3)}
          </h3>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h2
            key={i}
            className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-4 mb-2"
          >
            {line.slice(2)}
          </h2>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <div key={i} className="flex gap-1.5 ml-2">
            <span className="text-neutral-400 shrink-0">-</span>
            <span className="text-xs text-neutral-700 dark:text-neutral-300">
              {renderInlineFormatting(line.slice(2))}
            </span>
          </div>
        );
      } else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          elements.push(
            <div key={i} className="flex gap-1.5 ml-2">
              <span className="text-neutral-400 shrink-0 text-xs font-mono">
                {match[1]}.
              </span>
              <span className="text-xs text-neutral-700 dark:text-neutral-300">
                {renderInlineFormatting(match[2])}
              </span>
            </div>
          );
        }
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p
            key={i}
            className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed"
          >
            {renderInlineFormatting(line)}
          </p>
        );
      }
    }

    // Handle unclosed code block
    if (inCodeBlock && codeContent.length > 0) {
      elements.push(
        <pre
          key="code-end"
          className="bg-neutral-800 dark:bg-neutral-950 text-neutral-100 text-xs p-3 rounded overflow-x-auto border border-neutral-700 my-2"
        >
          <code>{codeContent.join("\n")}</code>
        </pre>
      );
    }

    return elements;
  };

  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Bold
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[2]) {
        parts.push(
          <strong key={match.index} className="font-semibold text-neutral-900 dark:text-neutral-100">
            {match[2]}
          </strong>
        );
      } else if (match[3]) {
        parts.push(
          <code
            key={match.index}
            className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-1 py-0.5 rounded text-[11px] font-mono"
          >
            {match[3]}
          </code>
        );
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div
      className={cn(
        "absolute right-0 top-0 z-20 h-full w-[420px] bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700 shadow-lg flex flex-col transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            AI Assistant
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* API Key Section */}
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-1.5 mb-2">
            <Key className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Anthropic API Key
            </span>
          </div>
          {hasApiKey ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 text-xs font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 rounded px-2 py-1.5 truncate">
                {apiKey}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs shrink-0"
                onClick={removeApiKey}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveApiKey()}
                placeholder="sk-ant-..."
                className="h-7 text-xs flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs shrink-0"
                onClick={saveApiKey}
                disabled={savingKey || !apiKeyInput.trim()}
              >
                {savingKey ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : keySaved ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-2">
            Quick Actions
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  disabled={isStreaming || !hasApiKey}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left",
                    "bg-neutral-50 dark:bg-neutral-800 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-400",
                    "text-neutral-700 dark:text-neutral-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-50 dark:disabled:hover:bg-neutral-800"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-2">
            Ask Claude anything about this workflow...
          </span>
          <div className="flex flex-col gap-2">
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomPrompt();
                }
              }}
              placeholder="e.g., How should I handle authentication between these services?"
              className="min-h-[60px] text-xs resize-none"
              disabled={isStreaming || !hasApiKey}
            />
            <Button
              size="sm"
              className="h-7 text-xs self-end"
              onClick={handleCustomPrompt}
              disabled={isStreaming || !customPrompt.trim() || !hasApiKey}
            >
              {isStreaming ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-3 h-3 mr-1.5" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Response Area */}
        {(currentResponse || isStreaming) && (
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                {currentLabel}
              </span>
              {isStreaming && (
                <span className="flex items-center gap-0.5 ml-auto">
                  <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              )}
            </div>
            <div
              ref={responseRef}
              className="max-h-[400px] overflow-y-auto bg-neutral-50 dark:bg-neutral-800/50 rounded-md p-3 space-y-0.5"
            >
              {renderFormattedResponse(currentResponse)}
              {isStreaming && !currentResponse && (
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Thinking...
                </div>
              )}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="px-4 py-3">
            <button
              onClick={() => setHistoryExpanded(!historyExpanded)}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors w-full"
            >
              {historyExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              Previous Responses ({history.length})
            </button>
            {historyExpanded && (
              <div className="mt-2 space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-50 dark:bg-neutral-800/50 rounded-md p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto space-y-0.5">
                      {renderFormattedResponse(item.response)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!hasApiKey && (
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 bg-amber-50 dark:bg-amber-900/20">
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Enter your Anthropic API key above to use AI features. Your key is stored securely and only used to make requests to the Claude API.
          </p>
        </div>
      )}
    </div>
  );
}
