"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Cpu,
  Thermometer,
  MessagesSquare,
  Type,
  ListOrdered,
  Braces,
  Puzzle,
  Play,
  Boxes,
  Wrench,
  ChevronDown,
  FileText,
  Code2,
  Hash,
} from "lucide-react";

// Simple color helpers
const nodeStyles = {
  model: { color: "#6366f1" },
  temperature: { color: "#f59e0b" },
  system_prompt: { color: "#10b981" },
  prompt: { color: "#06b6d4" },
  max_items: { color: "#a855f7" },
  response_structure: { color: "#ef4444" },
  custom_ui_component: { color: "#22c55e" },
  action: { color: "#3b82f6" },
  custom_mcp: { color: "#eab308" },
  mcpTool: { color: "#f97316" },
} as const;

type NodeKey = keyof typeof nodeStyles;

function HandleCircle({ color, position = "top" }: { color: string; position?: "top" | "bottom" }) {
  return (
    <div
      className={`absolute ${position === "top" ? "-top-2" : "-bottom-2"} left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-[3px] shadow-lg backdrop-blur-sm z-50`}
      style={{ backgroundColor: `${color}99`, borderColor: color }}
      aria-hidden
    />
  );
}

function NodeHeader({
  icon: Icon,
  label,
  color,
  expanded,
  setExpanded,
}: {
  icon: React.ComponentType<any>;
  label: string;
  color: string;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) {
  return (
    <div className={`relative flex items-center justify-between p-6 gap-4 pb-4`}>
      <div className="flex items-center gap-4">
        <div
          className="w-12 min-w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border-2 transition-all duration-500"
          style={{
            backgroundColor: `${color}20`,
            color,
            borderColor: `${color}40`,
            boxShadow: `0 20px 40px ${color}20`,
          }}
        >
          <Icon size={24} className="drop-shadow-lg" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{label}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">UI Only</span>
          </div>
        </div>
      </div>
      <button
        className={`transition-all duration-300 transform ${expanded ? "rotate-180 scale-110" : "hover:scale-110"}`}
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
        aria-label={expanded ? "Collapse" : "Expand"}
      >
        <div className={`p-2 rounded-full bg-white/50 dark:bg-zinc-700/50 backdrop-blur-sm`}>
          <ChevronDown size={16} className="text-zinc-500 dark:text-zinc-300" />
        </div>
      </button>
    </div>
  );
}

function ConfigRow({ icon: Icon, title, children }: { icon: React.ComponentType<any>; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-primary flex items-center gap-2">
        <Icon size={16} />
        {title}
      </label>
      {children}
    </div>
  );
}

function CollapsibleNode({
  nodeKey,
  label,
  icon,
  children,
  withBottomHandle = false,
}: {
  nodeKey: NodeKey;
  label: string;
  icon: React.ComponentType<any>;
  children: React.ReactNode;
  withBottomHandle?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = nodeStyles[nodeKey].color;

  return (
    <div
      className={`group relative flex flex-col rounded-3xl border-2 transition-all duration-300 ease-out cursor-pointer w-[360px] backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/60 to-white/80 dark:from-zinc-900/60 dark:via-zinc-800/40 dark:to-zinc-900/60 text-zinc-800 dark:text-zinc-200 border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500 shadow-xl hover:shadow-2xl ${expanded ? "min-h-[380px]" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Handles as circles (UI only) */}
      <HandleCircle color={color} position="top" />
      {withBottomHandle && <HandleCircle color={color} position="bottom" />}

      {/* Animated background */}
      <div className="absolute inset-0 rounded-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-50">
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${color}15 0%, transparent 50%, ${color}10 100%)`,
          }}
        />
      </div>

      {/* Header */}
      <NodeHeader icon={icon} label={label} color={color} expanded={expanded} setExpanded={setExpanded} />

      {/* Body */}
      {expanded && (
        <div className="relative px-6 pb-6 space-y-6" onClick={(e) => e.stopPropagation()}>
          <div className="w-full h-px bg-zinc-200/60 dark:bg-zinc-700/60" />
          {children}

          {/* Configuration Status (UI only) */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold border-2 bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg" />
            Configured (UI Only)
          </div>
        </div>
      )}
    </div>
  );
}

// Individual node UIs (UI-only, no logic)
function ModelNodeUI() {
  return (
    <CollapsibleNode nodeKey="model" label="Model" icon={Cpu}>
      <ConfigRow icon={Hash} title="Provider and Model">
        <div className="grid grid-cols-2 gap-4">
          <select className="h-10 px-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600">
            <option>OpenAI</option>
            <option>Anthropic</option>
            <option>Mistral</option>
          </select>
          <input className="h-10 px-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder="e.g. gpt-4o-mini" />
        </div>
      </ConfigRow>
      <ConfigRow icon={FileText} title="Description">
        <textarea rows={4} className="w-full p-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder="Describe model usage..." />
      </ConfigRow>
    </CollapsibleNode>
  );
}

function TemperatureNodeUI() {
  return (
    <CollapsibleNode nodeKey="temperature" label="Temperature" icon={Thermometer}>
      <ConfigRow icon={Thermometer} title="Sampling Temperature">
        <input type="range" min={0} max={2} step={0.1} defaultValue={0.7} className="w-full" />
        <div className="text-xs text-zinc-500">Controls randomness: lower = deterministic, higher = creative</div>
      </ConfigRow>
    </CollapsibleNode>
  );
}

function SystemPromptNodeUI() {
  return (
    <CollapsibleNode nodeKey="system_prompt" label="System Prompt" icon={MessagesSquare}>
      <ConfigRow icon={FileText} title="System Instructions">
        <textarea rows={6} className="w-full p-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder="You are a helpful assistant..." />
      </ConfigRow>
    </CollapsibleNode>
  );
}

function PromptNodeUI() {
  return (
    <CollapsibleNode nodeKey="prompt" label="Prompt" icon={Type}>
      <ConfigRow icon={FileText} title="User Prompt">
        <textarea rows={5} className="w-full p-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder="Enter the prompt..." />
      </ConfigRow>
    </CollapsibleNode>
  );
}

function MaxItemsNodeUI() {
  return (
    <CollapsibleNode nodeKey="max_items" label="Max Items" icon={ListOrdered}>
      <ConfigRow icon={ListOrdered} title="Maximum Items">
        <input type="number" min={1} defaultValue={5} className="h-10 px-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600 w-32" />
      </ConfigRow>
    </CollapsibleNode>
  );
}

function ResponseStructureNodeUI() {
  return (
    <CollapsibleNode nodeKey="response_structure" label="Response Structure" icon={Braces}>
      <ConfigRow icon={Code2} title="Schema (UI Only)">
        <textarea rows={6} className="w-full font-mono text-sm p-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder="{\n  title: string,\n  items: Array<{ id: string; score: number }>,\n}" />
      </ConfigRow>
    </CollapsibleNode>
  );
}

function CustomUIComponentNodeUI() {
  return (
    <CollapsibleNode nodeKey="custom_ui_component" label="Custom UI Component" icon={Puzzle}>
      <ConfigRow icon={Puzzle} title="Component Name">
        <input className="h-10 px-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder="e.g. RatingStars" />
      </ConfigRow>
      <ConfigRow icon={Code2} title="Props (JSON UI Only)">
        <textarea rows={5} className="w-full font-mono text-sm p-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder='{"color": "#f59e0b", "max": 5}' />
      </ConfigRow>
    </CollapsibleNode>
  );
}

function ActionNodeUI() {
  return (
    <CollapsibleNode nodeKey="action" label="Action" icon={Play}>
      <ConfigRow icon={FileText} title="Title">
        <input className="h-10 px-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600 w-full" placeholder="e.g. Post-process summary" />
      </ConfigRow>
      <ConfigRow icon={FileText} title="Description">
        <textarea rows={4} className="w-full p-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder="Describe what the action does..." />
      </ConfigRow>
      <ConfigRow icon={Code2} title="Schema (UI Only)">
        <textarea rows={4} className="w-full font-mono text-sm p-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder="type Action = { enabled: boolean }" />
      </ConfigRow>
      <div className="flex items-center justify-between p-4 rounded-xl border-2 bg-gradient-to-r from-zinc-50/50 to-white/50 dark:from-zinc-800/50 dark:to-zinc-700/50 border-zinc-200 dark:border-zinc-600">
        <div>
          <div className="font-medium text-sm mb-1">Execution Timing</div>
          <p className="text-xs text-zinc-500">UI only toggle</p>
        </div>
        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-300 dark:bg-zinc-600">
          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
        </button>
      </div>
    </CollapsibleNode>
  );
}

function CustomMCPNodeUI() {
  return (
    <CollapsibleNode nodeKey="custom_mcp" label="Custom MCP" icon={Boxes} withBottomHandle>
      <ConfigRow icon={Boxes} title="Server Name">
        <input className="h-10 px-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600 w-full" placeholder="e.g. my-server" />
      </ConfigRow>
      <ConfigRow icon={Wrench} title="Command">
        <input className="h-10 px-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600 w-full" placeholder="e.g. node server.js" />
      </ConfigRow>
      <ConfigRow icon={Code2} title="Args (UI Only)">
        <textarea rows={4} className="w-full font-mono text-sm p-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder='["--port", "3000"]' />
      </ConfigRow>
    </CollapsibleNode>
  );
}

function MCPToolNodeUI() {
  return (
    <CollapsibleNode nodeKey="mcpTool" label="MCP Tool" icon={Wrench} withBottomHandle>
      <ConfigRow icon={Wrench} title="Tool Name">
        <input className="h-10 px-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600 w-full" placeholder="e.g. search" />
      </ConfigRow>
      <ConfigRow icon={FileText} title="Description">
        <textarea rows={3} className="w-full p-3 rounded-xl border-2 bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-600" placeholder="What this tool does (UI only)" />
      </ConfigRow>
    </CollapsibleNode>
  );
}

// --------------------
// Diagram UI (UI-only)
// --------------------

type DiagramNode = {
  key: NodeKey;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
};

const diagramNodes: DiagramNode[] = [
  {
    key: "model",
    title: "Model",
    description:
      "Choose the AI provider (OpenAI, Anthropic, Google, GROQ, Perplexity, XAI) and the exact model name used for generation. Supports variables mode for provider/model/API key so you can pass values at runtime. Automatically detects the provider from common API key patterns (e.g., sk-ant- → Anthropic, gsk_ → GROQ, pplx- → Perplexity, AIza… → Google, xai/grok → XAI, sk- → OpenAI) and normalizes model names in regular mode. Marked configured once a model and an API key (or variable) are provided.",
    icon: Cpu,
  },
  {
    key: "temperature",
    title: "Temperature",
    description:
      "Controls sampling randomness in the range 0.0–2.0. Lower values produce deterministic, focused answers; higher values produce more diverse, creative outputs. Comes with quick presets: conservative (0.1), balanced (0.7), creative (1.0). Supports variables mode to inject a value like {{TEMPERATURE}} at runtime, with inline validation in regular mode.",
    icon: Thermometer,
  },
  {
    key: "system_prompt",
    title: "System Prompt",
    description:
      "High-level, system-level instructions that shape persona, tone, safety and constraints for all downstream prompts. Includes variables mode, a full-screen editor, and a live character counter (with gentle warnings for very long prompts). Use this to establish role, goals, and guardrails before the user prompt.",
    icon: MessagesSquare,
  },
  {
    key: "prompt",
    title: "Prompt",
    description:
      "Task-specific instruction or user input that the model will respond to, evaluated after the system prompt. Supports variables mode, a full-screen editor, and a live character counter (with hints when the prompt grows long). Keep this concise and focused to pair well with the broader system prompt.",
    icon: Type,
  },
  {
    key: "max_items",
    title: "Max Items",
    description:
      "Upper bound for the number of items to return (e.g., results, messages, chunks). Validated numeric input with a recommended range of 1–8192 and quick presets (1, 5, 10, 25, 50). Also supports variables mode when the limit is provided dynamically.",
    icon: ListOrdered,
  },
  {
    key: "response_structure",
    title: "Response Structure",
    description:
      "Describe the expected shape of the model's output to make downstream parsing and rendering more reliable. Optionally include a Zod schema to communicate types and field constraints to the agent. Also accepts a human-readable title/description for context. UI-only here (no validation is enforced), but useful to standardize responses.",
    icon: Braces,
  },
  {
    key: "custom_ui_component",
    title: "Custom UI Component",
    description:
      "Define a presentational component to render the model's output (e.g., cards, rating stars, lists). Provide a title/description plus JSON props (optionally backed by a Zod schema) to describe how the component should be configured. UI-only here, intended for preview and documentation of the intended UX.",
    icon: Puzzle,
  },
  {
    key: "action",
    title: "Action",
    description:
      "Configure a post-processing step or side-effect to run on the model's output. Supply a title/description and (optionally) a TypeScript/Zod schema for the action's payload. Supports two execution timings: per-token while streaming, or once after completion. In this UI-only diagram it documents intent without executing.",
    icon: Play,
  },
  {
    key: "custom_mcp",
    title: "Custom MCP",
    description:
      "Connect to a Model Context Protocol (MCP) server to discover and use external tools. Choose a preset or set up a custom server with transport (stdio/http/sse), then provide a URL for http/sse or a command/args for stdio. Optional authentication can be supplied. In the full app you can test the connection and spawn tool nodes; some tools can be deactivated. Here it's documented visually with top/bottom handles to indicate integration points.",
    icon: Boxes,
  },
  {
    key: "mcpTool",
    title: "MCP Tool",
    description:
      "Represents a single tool exposed by the MCP server. Shows the tool's name/description and whether it declares an input schema. In the full app tools can be toggled active/inactive, and a special 'More' node aggregates additional tools in a modal. In this UI-only view it communicates available capabilities.",
    icon: Wrench,
  },
];

function CenterHandleDot({ color }: { color: string }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[3px] z-30"
      style={{ backgroundColor: `${color}99`, borderColor: color }}
      aria-hidden
    />
  );
}

function HorizontalConnector({ side }: { side: "left" | "right" }) {
  // Approximate connector from center line to the node card.
  // Tuned to pair with card width ~360px and gap paddings.
  const common = "absolute top-1/2 -translate-y-1/2 h-[2px] bg-zinc-200 dark:bg-zinc-700";
  return side === "right" ? (
    <div className={`${common} left-1/2 right-[420px]`} aria-hidden />
  ) : (
    <div className={`${common} left-[420px] right-1/2`} aria-hidden />
  );
}

function NodeCard({
  node,
  isFirst,
  isLast,
  onTopHandleRef,
  onBottomHandleRef,
}: {
  node: DiagramNode;
  isFirst: boolean;
  isLast: boolean;
  onTopHandleRef?: (el: HTMLDivElement | null) => void;
  onBottomHandleRef?: (el: HTMLDivElement | null) => void;
}) {
  const color = nodeStyles[node.key].color;
  const Icon = node.icon;
  return (
    <div
      className="relative group flex flex-col rounded-3xl border-2 transition-all duration-300 ease-out w-[360px] backdrop-blur-xl bg-gradient-to-br from-white/80 via-white/60 to-white/80 dark:from-zinc-900/60 dark:via-zinc-800/40 dark:to-zinc-900/60 text-zinc-800 dark:text-zinc-200 border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500 shadow-xl hover:shadow-2xl"
    >
      {/* Handles as circles (UI only) */}
      {!isFirst && (
        <div
          ref={onTopHandleRef}
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-[3px] shadow-lg backdrop-blur-sm z-50"
          style={{ backgroundColor: `${color}99`, borderColor: color }}
          aria-hidden
        />
      )}
      {!isLast && (
        <div
          ref={onBottomHandleRef}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-[3px] shadow-lg backdrop-blur-sm z-50"
          style={{ backgroundColor: `${color}99`, borderColor: color }}
          aria-hidden
        />
      )}

      {/* Animated background */}
      <div className="absolute inset-0 rounded-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-50">
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${color}15 0%, transparent 50%, ${color}10 100%)`,
          }}
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 p-6 pb-4">
        <div
          className="w-12 min-w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl border-2"
          style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40`, boxShadow: `0 20px 40px ${color}20` }}
        >
          <Icon size={24} className="drop-shadow-lg" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{node.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">UI Only</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="w-full h-px bg-zinc-200/60 dark:bg-zinc-700/60 mb-4" />
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{node.description}</p>
      </div>
    </div>
  );
}

function DiagramRow({
  index,
  node,
  total,
  setTopHandleRef,
  setBottomHandleRef,
}: {
  index: number;
  node: DiagramNode;
  total: number;
  setTopHandleRef: (idx: number, el: HTMLDivElement | null) => void;
  setBottomHandleRef: (idx: number, el: HTMLDivElement | null) => void;
}) {
  const side: "right" | "left" = index % 2 === 0 ? "right" : "left";
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const color = nodeStyles[node.key].color;

  return (
    <div className="relative py-12">

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left column */}
        <div className={`relative flex ${side === "left" ? "justify-start" : "justify-end"}`}>
          {side === "left" ? (
            <NodeCard
              node={node}
              isFirst={isFirst}
              isLast={isLast}
              onTopHandleRef={(el) => setTopHandleRef(index, el)}
              onBottomHandleRef={(el) => setBottomHandleRef(index, el)}
            />
          ) : (
            <div className="max-w-md md:pr-12">
              <h4 className="text-xl font-semibold">{node.title}</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">{node.description}</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className={`relative flex ${side === "right" ? "justify-end" : "justify-start"}`}>
          {side === "right" ? (
            <NodeCard
              node={node}
              isFirst={isFirst}
              isLast={isLast}
              onTopHandleRef={(el) => setTopHandleRef(index, el)}
              onBottomHandleRef={(el) => setBottomHandleRef(index, el)}
            />
          ) : (
            <div className="max-w-md md:pl-12 text-right md:text-left md:ml-0">
              <h4 className="text-xl font-semibold">{node.title}</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">{node.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const topHandleRefs = useRef<(HTMLDivElement | null)[]>(Array(diagramNodes.length).fill(null));
  const bottomHandleRefs = useRef<(HTMLDivElement | null)[]>(Array(diagramNodes.length).fill(null));

  const setTopHandleRef = useCallback((idx: number, el: HTMLDivElement | null) => {
    topHandleRefs.current[idx] = el;
  }, []);
  const setBottomHandleRef = useCallback((idx: number, el: HTMLDivElement | null) => {
    bottomHandleRefs.current[idx] = el;
  }, []);

  const [edges, setEdges] = useState<Array<{ x1: number; y1: number; x2: number; y2: number; color: string }>>([]);

  const recomputeEdges = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    const next: Array<{ x1: number; y1: number; x2: number; y2: number; color: string }> = [];
    for (let i = 0; i < diagramNodes.length - 1; i++) {
      const src = bottomHandleRefs.current[i];
      const tgt = topHandleRefs.current[i + 1];
      if (!src || !tgt) continue;
      const sr = src.getBoundingClientRect();
      const tr = tgt.getBoundingClientRect();
      const x1 = sr.left + sr.width / 2 - rect.left;
      const y1 = sr.top + sr.height / 2 - rect.top;
      const x2 = tr.left + tr.width / 2 - rect.left;
      const y2 = tr.top + tr.height / 2 - rect.top;
      const color = nodeStyles[diagramNodes[i].key].color;
      next.push({ x1, y1, x2, y2, color });
    }
    setEdges(next);
  }, []);

  useEffect(() => {
    recomputeEdges();
  }, [recomputeEdges]);

  useEffect(() => {
    const onResize = () => recomputeEdges();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    const id = setInterval(recomputeEdges, 300); // fallback for layout transitions
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      clearInterval(id);
    };
  }, [recomputeEdges]);

  const makePath = useCallback((e: { x1: number; y1: number; x2: number; y2: number }) => {
    const { x1, y1, x2, y2 } = e;
    const dy = Math.abs(y2 - y1);
    const dx = Math.abs(x2 - x1);
    
    // Create more pronounced curves by extending control points further
    const curveStrength = Math.max(dy * 0.6, 100); // Minimum curve strength of 100px
    
    // First control point: extend downward from source
    const cp1x = x1;
    const cp1y = y1 + curveStrength;
    
    // Second control point: extend upward from target
    const cp2x = x2;
    const cp2y = y2 - curveStrength;
    
    return `M ${x1},${y1} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
  }, []);

  return (
    <main className="min-h-screen w-full py-12 px-6 md:px-10 lg:px-16 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">System Nodes Diagram (UI Only)</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Alternating node diagram with smooth, dashed, animated edges. No React Flow logic.</p>
        </header>

        <div className="relative" ref={containerRef}>

          {/* SVG edges overlay */}
          <svg ref={svgRef} className="pointer-events-none absolute inset-0 w-full h-full overflow-visible">
            {edges.map((e, idx) => (
              <path
                key={idx}
                d={makePath(e)}
                fill="none"
                stroke={e.color}
                strokeWidth={2}
                strokeDasharray="6 8"
                style={{ animation: "dash 1.5s linear infinite" }}
                opacity={0.8}
              />
            ))}
          </svg>

          {diagramNodes.map((n, i) => (
            <DiagramRow
              key={n.key}
              index={i}
              node={n}
              total={diagramNodes.length}
              setTopHandleRef={setTopHandleRef}
              setBottomHandleRef={setBottomHandleRef}
            />
          ))}
        </div>

        {/* Edge animation keyframes */}
        <style>{`
          @keyframes dash { to { stroke-dashoffset: -28; } }
        `}</style>
      </div>
    </main>
  );
}
