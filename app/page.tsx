"use client";

import Image from "next/image";

import { useLanguage } from "./components/providers/language-provider";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors pt-28">
      <div className="relative mx-auto max-md:h-[50vh]  max-sm:min-h-[400px] max-md:min-h-[600px] md:min-h-[800px] md:h-[calc(100vh-9rem)] w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px] overflow-hidden rounded-[28px]">
        <Image
          src="/bg1.svg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 768px) 100vw, 1800px"
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-background/20 to-transparent" />
        <div className="absolute inset-0 z-20 flex items-start justify-center">
          <div className="mt-8 sm:mt-12 md:mt-16 w-full px-6 sm:px-10 md:px-14">
            <div className="mx-auto max-w-3xl text-center">
              <span
                className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50 animate-fade-in"
                style={{ animationDelay: "50ms" }}
              >
                {t("hero.preview_label")}
              </span>
              <h1
                className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-black to-black/70 animate-fade-up"
                style={{ animationDelay: "120ms" }}
              >
                {t("hero.title")}
              </h1>
              <p
                className="mt-3 text-base sm:text-lg md:text-xl text-black animate-fade-up"
                style={{ animationDelay: "220ms" }}
              >
                {t("hero.subtitle")}
              </p>
            </div>
          </div>
        </div>
        <Image
          src="/agent-flow.png"
          alt="Agent flow"
          priority
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[6%] sm:translate-y-[8%] md:translate-y-[10%] w-auto h-full select-none drop-shadow-2xl shadow-glow z-0 max-h-[calc(100%-12rem)]"
          // sizes="(max-width: 768px) 88vw, (max-width: 1024px) 86vw, 900px"
          width={1200}
          height={800}
        />
      </div>

      {/* Video Section: Title, description, and video box */}
      <section className="mt-16 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px]">
        <div className="mx-auto max-w-3xl text-center px-6 sm:px-10 md:px-14">
          <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">
            Demo
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            See It In Action
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Watch a quick walkthrough highlighting the core flow and capabilities. This short demo shows how everything connects seamlessly.
          </p>
        </div>

        <div className="mt-8 relative w-full rounded-[28px] overflow-hidden ring-1 ring-border/50 shadow-xl bg-muted/60">
          {/* 16:9 responsive container */}
          <div className="relative w-full pt-[56.25%]">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Product demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Section 2: Left image (bg2), right text */}
      <section className="mt-16 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Image column - left on md+, fills half */}
          <div className="relative w-full h-full">
            <div className="order-1 md:order-1 pt-[50px] pl-[50px]">
              <div className="relative h-[350px] w-full rounded-[28px] overflow-hidden ring-1 ring-border/50 shadow-xl">
                <Image
                  src="/bg2.svg"
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            <div className="pb-[50px] pr-[50px] absolute top-0 left-0 w-full h-full ">
              <div className="bg-muted/60 rounded-[28px] p-6  h-[350px] w-full backdrop-blur-xl shadow-xl"></div>
            </div>
          </div>
          {/* Text column - right on md+ */}
          <div className="order-2 md:order-2">
            <div className="px-2 sm:px-4 md:px-8">
              <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">
                Feature
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
                Powerful Left-Aligned Visual
              </h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground">
                Showcase a tall, portrait-style preview while keeping your copy
                aligned on the other half. This layout is perfect for
                emphasizing a single, vertically-oriented element like a phone,
                flow, or panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Right image (bg3), left text */}
      <section className="mt-16 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Text column - left on md+ */}
          <div className="order-2 md:order-1">
            <div className="px-2 sm:px-4 md:px-8">
              <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">
                Feature
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
                Crisp Right-Aligned Visual
              </h2>
              <p className="mt-3 text-base sm:text-lg text-muted-foreground">
                Invert the visual balance by placing the tall image on the right
                and the descriptive content on the left. Great for alternating
                rhythm as users scroll.
              </p>
            </div>
          </div>
          {/* Image column - right on md+, fills half */}
          <div className="relative w-full h-full order-1 md:order-2 pt-[50px] pl-[50px]">
            <div className="relative h-[350px] w-full rounded-[28px] overflow-hidden ring-1 ring-border/50 shadow-xl">
              <Image
                src="/bg3.svg"
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="pb-[50px] pr-[50px] absolute top-0 left-0 w-full h-full ">
              <div className="bg-muted/60 rounded-[28px] p-6  h-[350px] w-full backdrop-blur-xl shadow-2xl"></div>
            </div>
          </div>
        </div>
      </section>
      <div className="relative w-[calc(100%-1.5rem)] h-full pt-[50px] pl-[50px] max-w-[1200px] mx-auto mt-16">
            <div className="relative h-[800px] w-full rounded-[28px] overflow-hidden ring-1 ring-border/50 shadow-xl">
              <Image
                src="/bg4.svg"
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="pb-[50px] pr-[50px] absolute top-0 left-0 w-full h-full ">
              <div className="bg-muted/60 rounded-[28px] p-6  h-[800px] w-full backdrop-blur-xl shadow-2xl"></div>
            </div>
          </div>
      {/* Founder Quote Section */}
      <section className="mt-24 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px]">
        <div className="relative overflow-hidden rounded-[28px] ring-1 ring-border/50 bg-gradient-to-br from-muted/60 via-background/60 to-muted/40 backdrop-blur-xl shadow-2xl">
          {/* Decorative gradient glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative p-8 sm:p-10 md:p-14">
            <figure className="mx-auto max-w-4xl text-center">
              {/* Quote icon */}
              <svg
                aria-hidden="true"
                viewBox="0 0 32 32"
                className="mx-auto h-8 w-8 text-muted-foreground/50"
                fill="currentColor"
              >
                <path d="M12 14c0-4.418 3.582-8 8-8V2C14.268 2 10 6.268 10 12v18h10V14h-8zm-10 0c0-4.418 3.582-8 8-8V2C4.268 2 0 6.268 0 12v18h10V14H2z" />
              </svg>

              <blockquote className="mt-5 text-2xl sm:text-[26px] md:text-3xl leading-relaxed font-medium text-foreground/90">
                “Our mission is to craft agentic experiences that feel effortless, powerful, and beautifully human.”
              </blockquote>

              <figcaption className="mt-8 flex items-center justify-center gap-4">
                <div className="h-12 w-12 rounded-full ring-1 ring-border/50 bg-gradient-to-br from-emerald-400 to-blue-500" />
                <div className="text-left">
                  <div className="text-sm font-semibold">Husam Abu Safa</div>
                  <div className="text-xs text-muted-foreground">Founder & CEO</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="mt-24 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px]">
        <div className="mx-auto max-w-3xl text-center px-6 sm:px-10 md:px-14">
          <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">
            Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Build Faster With Smart Blocks
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Modular primitives designed for real product teams. Clean visuals, smooth motion, and a system you can extend.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            { title: "Agentic Flow", desc: "Compose autonomous steps with clarity and control.", img: "/bg-aurora.svg", href: "/features#flow" },
            { title: "Realtime Preview", desc: "See changes instantly with zero reload mental overhead.", img: "/agent-flow.png", href: "/features#preview" },
            { title: "Beautiful Defaults", desc: "Elegant spacing, gradients, and glass effects out of the box.", img: "/bg-emerald.svg", href: "/features#design" },
          ].map((f, i) => (
            <div key={i} className="relative rounded-[20px] ring-1 ring-border/50 bg-muted/60 backdrop-blur-xl p-5 sm:p-6 shadow-xl overflow-hidden">
              {/* Image */}
              <div className="relative h-40 w-full rounded-[16px] overflow-hidden ring-1 ring-border/50 shadow-md">
                <Image src={f.img} alt={f.title} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
              {/* Content */}
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                <div className="mt-3">
                  <a href={f.href} className="inline-flex items-center gap-1 text-sm font-medium text-foreground/90 hover:text-foreground">
                    Learn more
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
              {/* Soft glow */}
              <div className="pointer-events-none absolute -right-12 -bottom-12 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center">
          <a href="/features" className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium hover:bg-foreground/5">
            More features
          </a>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mt-16 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px]">
        <div className="relative overflow-hidden rounded-[28px] ring-1 ring-border/50 bg-gradient-to-r from-emerald-500/15 via-blue-500/15 to-purple-500/15 backdrop-blur-xl shadow-2xl">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
          </div>
          <div className="relative p-8 sm:p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">Ship delightful agent experiences</h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">Everything you need to design, iterate, and launch with confidence—beautiful defaults included.</p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/download" className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 shadow-sm">
                Get Started
              </a>
              <a href="/docs" className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium hover:bg-foreground/5">
                Read the Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16 mb-10 mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px]">
        <div className="mx-auto max-w-3xl text-center px-6 sm:px-10 md:px-14">
          <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">
            FAQ
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">Answers, at a glance</h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Short and helpful responses to common questions. Need more? Reach out any time.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {[
            {
              q: "Is dark mode supported?",
              a: "Yes. The entire system is designed for class-based dark mode with polished contrast and depth.",
            },
            {
              q: "Can I localize the UI?",
              a: "Language toggling is built-in. Add translations and the interface adapts seamlessly.",
            },
            {
              q: "Is it responsive?",
              a: "Every component scales gracefully—from mobile to ultra-wide displays.",
            },
            {
              q: "How do I get started?",
              a: "Check the docs for quick steps, or download directly and explore the demo flows.",
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
  );
}
