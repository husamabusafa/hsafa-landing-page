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
      className="relative group flex flex-col rounded-3xl border-2 transition-all duration-300 ease-out w-[360px] backdrop-blur-xl bg-card/80 text-card-foreground border-border hover:border-border/80 shadow-xl hover:shadow-2xl"
      style={{ boxShadow: `0 10px 25px rgba(0,0,0,0.08), 0 0 24px ${color}33, 0 0 48px ${color}22` }}
    >
      {/* Corner accents
      <span className="pointer-events-none absolute -top-px left-8 h-[2px] w-20 rounded-full" style={{background: `linear-gradient(90deg, ${color}66, transparent)`}} />
      <span className="pointer-events-none absolute -bottom-px right-8 h-[2px] w-24 rounded-full" style={{background: `linear-gradient(90deg, transparent, ${color}66)`}} /> */}
      {/* Soft color glow behind card */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-[28px] blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
        style={{
          background: `radial-gradient(120px 120px at 20% 0%, ${color}40, transparent 60%), radial-gradient(160px 160px at 80% 100%, ${color}30, transparent 60%)`,
        }}
        aria-hidden
      />
      {/* Handles as circles (UI only) */}
      {!isFirst && (
        <div
          ref={onTopHandleRef}
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-[3px] backdrop-blur-sm z-50"
          style={{ backgroundColor: `${color}99`, borderColor: color, boxShadow: `0 0 8px ${color}aa, 0 0 18px ${color}66, 0 0 36px ${color}44` }}
          aria-hidden
        />
      )}
      {!isLast && (
        <div
          ref={onBottomHandleRef}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-[3px] backdrop-blur-sm z-50"
          style={{ backgroundColor: `${color}99`, borderColor: color, boxShadow: `0 0 8px ${color}aa, 0 0 18px ${color}66, 0 0 36px ${color}44` }}
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
        <div className="w-full h-px bg-border/60 mb-4" />
        <p className="text-sm text-muted-foreground">{node.description}</p>
        {/* Footer chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full border bg-background/60" style={{borderColor: `${color}55`, color}}>
            Configurable
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full border bg-background/60 text-muted-foreground border-border">
            Composable
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-full border bg-background/60 text-muted-foreground border-border">
            Documented
          </span>
        </div>
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
  rowRef,
}: {
  index: number;
  node: DiagramNode;
  total: number;
  setTopHandleRef: (idx: number, el: HTMLDivElement | null) => void;
  setBottomHandleRef: (idx: number, el: HTMLDivElement | null) => void;
  rowRef?: (el: HTMLDivElement | null) => void;
}) {
  const side: "right" | "left" = index % 2 === 0 ? "right" : "left";
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const color = nodeStyles[node.key].color;

  return (
    <div className="relative py-12" ref={rowRef}>

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
              <h4 className="text-xl font-semibold text-foreground">{node.title}</h4>
              <p className="text-sm text-muted-foreground mt-2">{node.description}</p>
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
              <h4 className="text-xl font-semibold text-foreground">{node.title}</h4>
              <p className="text-sm text-muted-foreground mt-2">{node.description}</p>
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
  const nodeSectionRefs = useRef<Record<NodeKey, HTMLDivElement | null>>({} as Record<NodeKey, HTMLDivElement | null>);

  const setTopHandleRef = useCallback((idx: number, el: HTMLDivElement | null) => {
    topHandleRefs.current[idx] = el;
  }, []);
  const setBottomHandleRef = useCallback((idx: number, el: HTMLDivElement | null) => {
    bottomHandleRefs.current[idx] = el;
  }, []);

  const setNodeSectionRef = useCallback((key: NodeKey, el: HTMLDivElement | null) => {
    nodeSectionRefs.current[key] = el;
  }, []);

  const scrollToNode = useCallback((key: NodeKey) => {
    const el = nodeSectionRefs.current[key];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offset = 100; // account for fixed navbar/padding
    const y = window.scrollY + rect.top - offset;
    window.scrollTo({ top: y, behavior: "smooth" });
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
    <main className="min-h-screen bg-background text-foreground transition-colors pt-28 relative overflow-hidden ">
      {/* Hero banner (aligned with home theme) */}
      <div className="relative mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1372px] overflow-hidden rounded-[28px] h-[260px] sm:h-[300px] md:h-[360px]">
        <div className="absolute inset-0">
          <img
            src="/bg1.svg"
            alt=""
            className="h-full w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-background/20 to-transparent" />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6 sm:px-10 md:px-14">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">
              UI Only Diagram
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-black to-black/70">
              System Nodes <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500">Architecture</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg text-black">
              An alternating node layout that visually documents the end-to-end AI pipeline. Smooth, animated, dashed connectors illustrate data flow between steps. This page is purely presentational—no React Flow logic is executed.
            </p>
          </div>
        </div>
      </div>

      {/* Soft glows (match site vibe) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

      {/* Content container */}
      <div className="mt-10 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1372px]">
        <header className="mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border bg-muted/60 text-xs text-muted-foreground border-border ring-1 ring-border/50">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Legend & Flow</span>
          </div>
        </header>

        {/* Legend */}
        <section className="mb-10">
          <div className="rounded-[28px] ring-1 ring-border/50 bg-muted/60 backdrop-blur-xl p-4 md:p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-1.5 w-8 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
              <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Legend</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {diagramNodes.map((n) => {
                const Icon = n.icon;
                const color = nodeStyles[n.key].color;
                return (
                  <div
                    key={`legend-${n.key}`}
                    className="flex items-center gap-3 rounded-xl ring-1 ring-border/50 bg-background/60 p-3 shadow-md cursor-pointer hover:bg-background/80 transition-colors"
                    role="button"
                    tabIndex={0}
                    onClick={() => scrollToNode(n.key)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        scrollToNode(n.key);
                      }
                    }}
                  >
                    <div className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center" style={{backgroundColor: `${color}1a`, color}}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{n.title}</div>
                      <div className="text-[11px] text-muted-foreground">{n.key}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="relative" ref={containerRef}>

          {/* SVG edges overlay */}
          <svg ref={svgRef} className="pointer-events-none absolute inset-0 w-full h-full overflow-visible">
            <defs>
              <filter id="edge-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {edges.map((e, idx) => (
              <g key={idx}>
                {/* Glow stroke */}
                <path
                  d={makePath(e)}
                  fill="none"
                  stroke={e.color}
                  strokeWidth={8}
                  opacity={0.15}
                  filter="url(#edge-glow)"
                />
                {/* Animated dashed stroke */}
                <path
                  d={makePath(e)}
                  fill="none"
                  stroke={e.color}
                  strokeWidth={2}
                  strokeDasharray="6 8"
                  style={{ animation: "dash 1.5s linear infinite" }}
                  opacity={0.85}
                />
                {/* Arrowhead circles at targets for visual clarity */}
                <circle cx={e.x2} cy={e.y2} r={3} fill={e.color} opacity={0.9} />
              </g>
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
              rowRef={(el) => setNodeSectionRef(n.key, el)}
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
