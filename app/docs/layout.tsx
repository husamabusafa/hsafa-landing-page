import type { ReactNode } from "react";
import { DocsSidebar } from "./_components/sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors pt-28">
      <div className="mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px]">
        {/* Top Gradient Header */}
        <div className="relative overflow-hidden rounded-[28px] ring-1 ring-border/50 bg-gradient-to-br from-muted/60 via-background/60 to-muted/40 backdrop-blur-xl shadow-2xl">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">Docs</span>
                <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">Hsafa Documentation</h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">Guides, references, and examples to build with the Hsafa system and SDK.</p>
              </div>
              <div className="hidden sm:block text-sm text-muted-foreground">Last updated: Sep 2025</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]">
          {/* Sidebar */}
          <DocsSidebar />

          {/* Main content frame matching homepage panels */}
          <div className="relative rounded-[28px] ring-1 ring-border/50 bg-muted/60 backdrop-blur-xl p-5 sm:p-6 md:p-8 shadow-2xl min-h-[50vh] overflow-hidden">
            {/* Soft gradient overlay for depth */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            <div className="relative prose prose-neutral max-w-none dark:prose-invert">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
