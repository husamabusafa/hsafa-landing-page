"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const nav = {
  system: {
    title: "Hsafa system",
    items: [
      { href: "/docs/system/overview", label: "Overview" },
      { href: "/docs/system/architecture", label: "Architecture" },
      { href: "/docs/system/nodes", label: "System Nodes" },
      { href: "/docs/system/deployment", label: "Deployment" },
    ],
  },
  sdk: {
    title: "Hsafa SDK",
    items: [
      { href: "/docs/sdk/getting-started", label: "Getting Started" },
      { href: "/docs/sdk/installation", label: "Installation" },
      { href: "/docs/sdk/auth", label: "Authentication" },
      { href: "/docs/sdk/examples", label: "Examples" },
    ],
  },
};

export function DocsSidebar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return nav;
    const q = query.toLowerCase();
    return {
      system: {
        ...nav.system,
        items: nav.system.items.filter((i) => i.label.toLowerCase().includes(q)),
      },
      sdk: {
        ...nav.sdk,
        items: nav.sdk.items.filter((i) => i.label.toLowerCase().includes(q)),
      },
    };
  }, [query]);

  const Panel = ({ title, items }: { title: string; items: { href: string; label: string }[] }) => (
    <nav className="rounded-[20px] ring-1 ring-border/50 bg-muted/60 backdrop-blur-xl p-3 sm:p-4 shadow-xl">
      <h2 className="px-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground">{title}</h2>
      <ul className="mt-2 space-y-1">
        {items.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-foreground/10 text-foreground ring-1 ring-foreground/15"
                    : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <aside className="space-y-4 lg:sticky lg:top-24 self-start">
      {/* Search input */}
      <div className="rounded-[20px] ring-1 ring-border/50 bg-muted/60 backdrop-blur-xl p-3 sm:p-4 shadow-xl">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs..."
            className="w-full rounded-lg border border-transparent bg-background/70 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-foreground/20"
            aria-label="Search docs"
          />
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      {filtered.system.items.length > 0 && (
        <Panel title={filtered.system.title} items={filtered.system.items} />
      )}
      {filtered.sdk.items.length > 0 && (
        <Panel title={filtered.sdk.title} items={filtered.sdk.items} />
      )}
    </aside>
  );
}
