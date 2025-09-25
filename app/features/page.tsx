'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max)

// Remap a linear 0..1 t to linger longer on the current image and compress the transition.
// transitionWidth controls how much of the segment (0..1) is used for the crossfade at the end.
// e.g., 0.15 means 85% linger, 15% fast transition.
function remapForQuickTransition(t: number, transitionWidth = 0.18) {
  const w = clamp(transitionWidth, 0.01, 0.5)
  if (t <= 1 - w) return 0
  const x = (t - (1 - w)) / w // 0..1 in the transition window
  // smoothstep for a smooth but quick rise
  const s = x * x * (3 - 2 * x)
  return clamp(s, 0, 1)
}

function useScrollProgress(sectionRef: React.RefObject<HTMLDivElement | null>) {
  const rafRef = useRef<number | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      if (!el) { rafRef.current = null; return }
      const vh = window.innerHeight
      const rect = el.getBoundingClientRect()
      const total = Math.max(rect.height - vh, 1)
      const p = clamp(-rect.top / total, 0, 1)
      setProgress((prev) => (Math.abs(prev - p) > 0.0005 ? p : prev))
      rafRef.current = null
    }

    const onScrollOrResize = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(update)
    }

    window.requestAnimationFrame(onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [sectionRef])

  return progress
}

function FeatureBox({ images, progress }: { images: string[]; progress: number }) {
  const n = images.length
  const exact = progress * (n - 1)
  const i = Math.floor(exact)
  const t = exact - i
  // Remap t so opacity stays at current image longer and transitions quickly near the boundary
  const tQuick = remapForQuickTransition(t, 0.28)

  return (
    <div
      className="relative mx-auto h-[calc(100vh-9rem)] w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px] overflow-hidden rounded-[28px]"
    >
      {images.map((src, idx) => {
        let opacity = 0
        if (idx === i) opacity = 1 - tQuick
        else if (idx === i + 1) opacity = tQuick
        return (
          <Image
            key={`${src}-${idx}`}
            src={src}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1800px"

            className="object-cover "
            style={{ opacity }}
            priority={idx <= 1}
          />
        )
      })}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/40 pointer-events-none" />
    </div>
  )
}

// Removed additional UI helpers and arrows to keep a single, consistent box

export default function FeaturesPage() {
  const images = ['/bg2.svg', '/bg3.svg', '/bg4.svg', '/bg1.svg','/bg2.svg', '/bg3.svg', '/bg4.svg', '/bg1.svg']
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const progress = useScrollProgress(sectionRef)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  // Reveal the feature box when it enters the viewport
  const revealRef = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = revealRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true)
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Feature titles for the left navigator (aligned with images)
  const featureTitles = [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    'Feature 4',
    'Feature 5',
    'Feature 6',
    'Feature 7',
    'Feature 8',
  ]

  // Determine currently active feature based on scroll progress
  const activeIndex = Math.round(progress * (images.length - 1))

  // Smoothly scroll to a specific feature segment
  const handleNavClick = (index: number) => {
    const el = sectionRef.current
    if (!el) return
    const totalScrollable = Math.max(el.scrollHeight - window.innerHeight, 1)
    const step = totalScrollable / (images.length - 1)
    const targetTop = el.offsetTop + step * index
    window.scrollTo({ top: targetTop, left: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-28">
      {/* Floating left navigator (hidden on small screens) */}
      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block rounded-2xl bg-background/40 backdrop-blur-md ring-1 ring-border/50 shadow-lg p-2">
        <ul className="flex flex-col gap-2">
          {featureTitles.map((title, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleNavClick(idx)}
                className={
                  `group flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ` +
                  (idx === activeIndex
                    ? 'bg-foreground text-background'
                    : 'bg-foreground/5 text-foreground hover:bg-foreground/10')
                }
                aria-current={idx === activeIndex ? 'true' : 'false'}
                aria-label={`Go to ${title}`}
              >
                <span
                  className={
                    `inline-block h-2 w-2 rounded-full ` +
                    (idx === activeIndex ? 'bg-background' : 'bg-foreground/40 group-hover:bg-foreground')
                  }
                />
                {title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Intro Hero (full-page, glass + glow style) */}
      <section className="relative mx-auto max-md:h-[50vh] max-sm:min-h-[400px] max-md:min-h-[600px] md:min-h-[800px] md:h-[calc(100vh-9rem)] w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px] overflow-hidden rounded-[28px] ring-1 ring-border/50 bg-gradient-to-br from-muted/60 via-background/60 to-muted/40 backdrop-blur-xl shadow-2xl">
        {/* Decorative gradient glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        {/* Centered content (quote-style figure) */}
        <div className="relative p-8 sm:p-10 md:p-14 h-full grid place-items-center">
          <figure className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">
              Features
            </span>

            <h1 className="mt-4 text-4xl sm:text-[40px] md:text-6xl leading-tight font-semibold tracking-tight">
              Explore Our Features
            </h1>
            <p className="mt-3 text-base sm:text-lg md:text-xl text-muted-foreground">
              Discover how our platform streamlines your workflow with powerful automations, intuitive tooling,
              and a delightful developer experience.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <a href="#preview" className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90">
                Preview features
              </a>
              <a href="/docs" className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium hover:bg-foreground/5">
                Read the Docs
              </a>
            </div>
          </figure>

          {/* Scroll-down indicator */}
          <a href="#preview" className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full border border-foreground/15 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition animate-bounce" aria-label="Scroll down">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </a>
        </div>
      </section>

      {/* Scroll-driven Feature Box Section */}
      <div ref={sectionRef} id="preview" className="min-h-[1200vh]">
        <div
          ref={revealRef}
          className={`sticky top-0 h-screen grid place-items-start pt-[90px] transition-all duration-700 ease-out ${
            revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <FeatureBox images={images} progress={progress} />
        </div>
      </div>
    </div>
  )
}
