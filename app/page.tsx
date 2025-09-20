'use client'

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { useLanguage } from "./components/providers/language-provider"

const clamp = (value: number, min = 0, max = 1) => {
  return Math.min(Math.max(value, min), max)
}

export default function Home() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      if (!sectionRef.current) {
        rafRef.current = null
        return
      }

      const rect = sectionRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const totalScrollable = rect.height - viewportHeight
      const next = totalScrollable <= 0 ? 0 : clamp(-rect.top / totalScrollable)

      setScrollProgress((prev) => (Math.abs(prev - next) > 0.001 ? next : prev))
      rafRef.current = null
    }

    const handleScroll = () => {
      if (rafRef.current !== null) return
      rafRef.current = window.requestAnimationFrame(updateProgress)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const bgProgress = clamp(scrollProgress * 1.1)
  const bgScale = 0.95 + bgProgress * 0.35
  const bgRadius = Math.max(28 * (1 - bgProgress), 0)
  const heroOpacity = clamp(1 - bgProgress * 2.4)
  const heroTranslateY = bgProgress * 160
  const previewShift = clamp(bgProgress, 0, 1) * 160
  const previewScale = 0.98 + bgProgress * 0.05
  const leftReveal = clamp(bgProgress * 1.25)
  const leftFloatY = (1 - leftReveal) * 90 - 36
  const rightFloatY = (1 - clamp(bgProgress * 1.1)) * 32

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <section ref={sectionRef} className="relative isolate min-h-[200vh] overflow-visible px-4">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 -z-10 flex justify-center">
            <div
              className="mx-auto mt-5 h-[calc(100vh-5rem)] w-[calc(100%-4rem)] max-w-[1800px] overflow-hidden rounded-[28px]"
              style={{
                transform: `scale(${bgScale})`,
                borderRadius: `${bgRadius}px`,
                transformOrigin: "center",
              }}
            >
              <Image src="/bg1.svg" alt="" fill sizes="100vw" className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-foreground/40" />
            </div>
          </div>

          <div className="relative flex h-full flex-col">
            <div className="container mx-auto flex h-full w-full flex-col justify-between px-4 pt-20 pb-16 lg:pt-28 lg:pb-24">
              <div className="mx-auto max-w-3xl text-center animate-fade-in" style={{ animationDelay: "0.05s" }}>
                <h1
                  className="mb-6 text-5xl font-extrabold tracking-tight text-foreground animate-fade-up sm:text-6xl lg:text-7xl"
                  style={{ animationDelay: "0.1s" }}
                >
                  {t("hero.title")}
                </h1>
                <p
                  className="mx-auto mb-10 max-w-3xl text-lg text-foreground/80 animate-fade-up sm:text-xl"
                  style={{ animationDelay: "0.18s" }}
                >
                  {t("hero.subtitle")}
                </p>
                <div
                  className="flex flex-col items-center justify-center gap-4 animate-fade-up sm:flex-row"
                  style={{ animationDelay: "0.26s" }}
                >
                  <a
                    href="#download"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/10 bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_28px_65px_rgba(15,23,42,0.25)] sm:text-base dark:border-foreground/20"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 14 18"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M13.5545 6.1362c-.0997.081-1.8609 1.1196-1.8609 3.429 0 2.6712 2.241 3.6162 2.3081 3.6396-.0103.0576-.356 1.2942-1.1816 2.5542-.7361 1.1088-1.5049 2.2158-2.6744 2.2158-1.16953 0-1.47052-.711-2.82064-.711-1.31572 0-1.78354.7344-2.85332.7344-1.06977 0-1.81621-1.026-2.67444-2.286C.8032 14.2326 0 11.934 0 9.7524c0-3.4992 2.17396-5.355 4.31351-5.355 1.13686 0 2.08452.7812 2.79828.7812.67936 0 1.73882-.828 3.03221-.828.4902 0 2.2513.0468 3.4105 1.7856Zm-4.02453-3.267c.53493-.6642.91323-1.5858.91323-2.5074 0-.1278-.0103-.2574-.0326-.3618-.87031.0342-1.90569.6066-2.53001 1.3644-.49017.5832-.94767 1.5048-.94767 2.439 0 .1404.02236.2808.03268.3258.05504.0108.14447.0234.23391.0234.78083 0 1.7629-.5472 2.33046-1.2834Z" />
                    </svg>
                    {t("hero.cta_primary")}
                  </a>
                  <a
                    href="#download"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/10 bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(15,23,42,0.35)] sm:text-base"
                  >
                    {t("hero.cta_secondary")}
                  </a>
                </div>
              </div>

              <div className="relative mt-12 flex flex-1 items-end justify-center sm:mt-16">
                <div className="pointer-events-none absolute inset-x-6 -bottom-24 -z-10 h-56 rounded-full bg-foreground/10 blur-3xl sm:blur-[120px]" />

                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 md:hidden">
                  <div className="overflow-hidden rounded-[28px] border border-foreground/10 bg-background/80 p-6 text-left shadow-[0_45px_120px_rgba(15,23,42,0.32)] backdrop-blur">
                    <div>
                      <span className="inline-flex items-center rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                        {t("hero.preview_label")}
                      </span>
                      <h3 className="mt-4 text-xl font-semibold text-foreground">
                        {t("hero.feature_card.title")}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                        {t("hero.feature_card.subtitle")}
                      </p>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm font-medium text-foreground">
                      <li className="flex items-center gap-2 text-foreground/85">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-foreground/70" />
                        {t("hero.feature_card.point_one")}
                      </li>
                      <li className="flex items-center gap-2 text-foreground/85">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-foreground/70" />
                        {t("hero.feature_card.point_two")}
                      </li>
                      <li className="flex items-center gap-2 text-foreground/85">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-foreground/70" />
                        {t("hero.feature_card.point_three")}
                      </li>
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-[28px] border border-foreground/10 bg-background/70 shadow-[0_45px_120px_rgba(15,23,42,0.32)] backdrop-blur">
                    <div className="flex items-center justify-between gap-4 border-b border-foreground/10 bg-foreground/[0.04] px-4 py-3 sm:px-6">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                      </div>
                      <span className="hidden text-xs font-medium uppercase tracking-[0.3em] text-foreground/50 sm:block">
                        {t("hero.preview_label")}
                      </span>
                      <div className="h-2 sm:hidden" />
                    </div>
                    <div className="relative aspect-[16/9] bg-foreground/[0.06]">
                      <Image
                        src="/hero-preview.png"
                        alt="Website preview"
                        fill
                        sizes="(min-width: 1024px) 832px, 100vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>

                <div className="relative hidden h-full w-full max-w-6xl md:block">
                  <div
                    className="absolute left-0 top-1/2 w-[320px] overflow-hidden rounded-[28px] border border-foreground/10 bg-background/80 p-6 text-left shadow-[0_45px_120px_rgba(15,23,42,0.32)] backdrop-blur"
                    style={{
                      opacity: leftReveal,
                      transform: `translateY(${leftTranslateY}px)`,
                      pointerEvents: leftReveal > 0.9 ? "auto" : "none",
                    }}
                  >
                    <div>
                      <span className="inline-flex items-center rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                        {t("hero.preview_label")}
                      </span>
                      <h3 className="mt-4 text-xl font-semibold text-foreground">
                        {t("hero.feature_card.title")}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                        {t("hero.feature_card.subtitle")}
                      </p>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm font-medium text-foreground">
                      <li className="flex items-center gap-2 text-foreground/85">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-foreground/70" />
                        {t("hero.feature_card.point_one")}
                      </li>
                      <li className="flex items-center gap-2 text-foreground/85">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-foreground/70" />
                        {t("hero.feature_card.point_two")}
                      </li>
                      <li className="flex items-center gap-2 text-foreground/85">
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-foreground/70" />
                        {t("hero.feature_card.point_three")}
                      </li>
                    </ul>
                  </div>

                  <div className="relative">
                    <div
                      className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-foreground/10 bg-background/70 backdrop-blur"
                      style={{
                        transform: `translateX(${previewShift}px) scale(${previewScale})`,
                        transformOrigin: "center",
                        boxShadow: `0 45px 120px rgba(15, 23, 42, ${0.32 + scrollProgress * 0.08})`,
                      }}
                    >
                      <div className="flex items-center justify-between gap-4 border-b border-foreground/10 bg-foreground/[0.04] px-4 py-3 sm:px-6">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                        </div>
                        <span className="hidden text-xs font-medium uppercase tracking-[0.3em] text-foreground/50 sm:block">
                          {t("hero.preview_label")}
                        </span>
                        <div className="h-2 sm:hidden" />
                      </div>
                      <div className="relative aspect-[16/9] bg-foreground/[0.06]">
                        <Image
                          src="/hero-preview.png"
                          alt="Website preview"
                          fill
                          sizes="(min-width: 1024px) 832px, 100vw"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
