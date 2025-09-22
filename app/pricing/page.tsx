"use client";

import { useLanguage } from "../components/providers/language-provider";

export default function PricingPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background text-foreground pt-28">
      <div className="mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1600px]">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] ring-1 ring-border/50 bg-gradient-to-br from-muted/60 via-background/60 to-muted/40 backdrop-blur-xl shadow-2xl px-6 sm:px-10 md:px-14 py-12">
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">
              {t("navigation.pricing")}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
              Simple pricing to get you started
            </h1>
            <p className="mt-3 text-base sm:text-lg text-muted-foreground">
              Transparent and developer-friendly. Pay nothing while we're in early access.
            </p>
          </div>

          {/* Plan card */}
          <div className="relative mt-10 grid place-items-center">
            <div className="relative w-full max-w-xl rounded-[24px] ring-1 ring-border/50 bg-muted/60 backdrop-blur-xl p-6 sm:p-8 shadow-xl overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-foreground/10 blur-2xl" />

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Free</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Best for trying things out</p>
                </div>
                <span className="inline-flex items-center rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-xs font-medium">
                  Free for now
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-sm text-muted-foreground">per user / month</span>
              </div>

              <ul className="mt-6 space-y-3">
                {[
                  "All core features",
                  "Full dark mode + theme support",
                  "Docs & SDK access",
                  "Community support",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <svg className="mt-0.5 h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center gap-3">
                <a href="/download" className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90">
                  Get Started
                </a>
                <a href="/docs" className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium hover:bg-foreground/5">
                  Read the Docs
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ / Notes */}
        <section className="mt-16 mb-10 mx-auto w-full max-w-[1000px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                q: "Is it really free?",
                a: "Yes, during early access the plan is free. We'll share pricing updates ahead of time.",
              },
              {
                q: "Can I use it commercially?",
                a: "Yes. Use it for personal or commercial projects while we're in early access.",
              },
              {
                q: "What's included?",
                a: "All core features, theme support, SDK & docs access, and community support.",
              },
              {
                q: "Do you offer support?",
                a: "Community support is included now. We'll announce premium options later.",
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-[20px] ring-1 ring-border/50 bg-muted/60 backdrop-blur-xl p-5 sm:p-6 shadow-xl">
                <h3 className="text-base font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
