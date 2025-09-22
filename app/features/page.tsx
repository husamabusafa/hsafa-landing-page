'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max)

function useScrollProgressForSections(count: number) {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([])
  const rafRef = useRef<number | null>(null)
  const [progresses, setProgresses] = useState<number[]>(Array(count).fill(0))

  useEffect(() => {
    const update = () => {
      const vh = window.innerHeight
      const next = sectionRefs.current.map((el) => {
        if (!el) return 0
        const rect = el.getBoundingClientRect()
        // Two-viewport section: grow (0→1) over first 100vh, shrink (1→0) over second 100vh
        const p = clamp(-rect.top / vh, 0, 2)
        const mirrored = p <= 1 ? p : 2 - p
        return mirrored
      })
      setProgresses((prev) => {
        let changed = false
        for (let i = 0; i < next.length; i++) if (Math.abs(prev[i] - next[i]) > 0.0005) { changed = true; break }
        return changed ? next : prev
      })
      rafRef.current = null
    }

    const onScrollOrResize = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(update)
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        onScrollOrResize()
      })
    })
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [])

  return { sectionRefs, progresses }
}

function BoxSection({ src, progress, children }: { src: string; progress: number; children?: React.ReactNode }) {
  const scale = 0.86 + progress * 0.14 // 0.86 → 1.00, then back
  const radius = 28 * (1 - progress) // 28 → 0 → 28

  return (
    <div className="sticky top-0 h-screen overflow-hidden">
      <div
        className="absolute inset-0 shadow-2xl"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          borderRadius: `${radius}px`,
          overflow: 'hidden',
        }}
      >
        <Image src={src} alt="" fill sizes="100vw" className="object-cover" priority />
        {/* darken for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        {/* content overlay */}
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  )
}

// Minimal helpers
const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function ArrowImg({ src, x, y, r = 0, scale = 1, opacity = 1 }: { src: string; x: string; y: string; r?: number; scale?: number; opacity?: number }) {
  return (
    <img
      src={src}
      alt=""
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${r}deg) scale(${scale})`,
        opacity,
        filter: 'invert(1)', // turn white for dark bg
        width: '180px',
        height: 'auto',
        pointerEvents: 'none',
      }}
    />
  )
}

function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      className="rounded-2xl p-6 md:p-8 backdrop-blur-md bg-white/10 text-white shadow-xl border border-white/10 max-w-xl"
      style={style}
    >
      {children}
    </div>
  )
}

export default function FeaturesPage() {
  const images = ['/bg2.svg', '/bg3.svg', '/bg4.svg', '/bg1.svg']
  const { sectionRefs, progresses } = useScrollProgressForSections(images.length)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Section 1 — Hero */}
      <section ref={(el) => { sectionRefs.current[0] = el }} className="relative min-h-[300vh]">
        <BoxSection src={images[0]} progress={progresses[0] ?? 0}>
          {(() => {
            const p = progresses[0] ?? 0
            const showTitle = easeInOut(clamp(p * 1.2))
            const showSub = easeInOut(clamp((p - 0.2) * 1.4))
            const arrowO = clamp((p - 0.35) * 2)
            return (
              <div className="absolute inset-0 grid place-items-start justify-center">
                <div className="px-6 text-center">
                  <motion.h1
                    className="text-4xl md:text-6xl font-bold tracking-tight text-white"
                  >
                    Hsafa SDK
                  </motion.h1>
                  <motion.p
                    className="mt-4 text-lg md:text-2xl text-white/80 max-w-2xl mx-auto"
                    style={{
                      opacity: showSub,
                      transform: `translateY(${lerp(24, 0, showSub)}px)`,
                    }}
                  >
                    Scroll to explore features with motion, context, and delightful details.
                  </motion.p>
                </div>
                {/* hand‑drawn arrow appears late */}
                <ArrowImg src="https://www.svgrepo.com/show/147200/arrow-squiggly.svg" x="70%" y="65%" r={-15} scale={1.1}
                  opacity={arrowO} />
              </div>
            )
          })()}
        </BoxSection>
      </section>

      {/* Section 2 — Feature Cards */}
      <section ref={(el) => { sectionRefs.current[1] = el }} className="relative min-h-[300vh]">
        <BoxSection src={images[1]} progress={progresses[1] ?? 0}>
          {(() => {
            const p = progresses[1] ?? 0
            const a = easeInOut(clamp((p - 0.05) * 2))
            const b = easeInOut(clamp((p - 0.2) * 2))
            const c = easeInOut(clamp((p - 0.35) * 2))
            return (
              <div className="absolute inset-0 grid place-items-center px-6">
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full">
                  <GlassCard style={{ opacity: a, transform: `translateY(${lerp(40, 0, a)}px)` }}>
                    <h3 className="text-xl font-semibold">Speed</h3>
                    <p className="mt-2 text-white/80">Optimized rendering and smooth scroll-linked animations via rAF.</p>
                  </GlassCard>
                  <GlassCard style={{ opacity: b, transform: `translateY(${lerp(40, 0, b)}px)` }}>
                    <h3 className="text-xl font-semibold">Clarity</h3>
                    <p className="mt-2 text-white/80">Readable layouts with glass panels over hi‑res imagery.</p>
                  </GlassCard>
                  <GlassCard style={{ opacity: c, transform: `translateY(${lerp(40, 0, c)}px)` }}>
                    <h3 className="text-xl font-semibold">Delight</h3>
                    <p className="mt-2 text-white/80">Hand‑drawn arrows highlight what matters as you scroll.</p>
                  </GlassCard>
                </div>
                <ArrowImg src="https://www.svgrepo.com/show/141203/curved-arrow.svg" x="20%" y="35%" r={-60} scale={1}
                  opacity={clamp((p - 0.15) * 2)} />
              </div>
            )
          })()}
        </BoxSection>
      </section>

      {/* Section 3 — Image + Callouts */}
      <section ref={(el) => { sectionRefs.current[2] = el }} className="relative min-h-[300vh]">
        <BoxSection src={images[2]} progress={progresses[2] ?? 0}>
          {(() => {
            const p = progresses[2] ?? 0
            const imgReveal = easeInOut(clamp(p * 1.2))
            const callout1 = easeInOut(clamp((p - 0.25) * 2))
            const callout2 = easeInOut(clamp((p - 0.4) * 2))
            return (
              <div className="absolute inset-0">
                <motion.div
                  className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                  style={{ width: 'min(520px, 42vw)', opacity: imgReveal, transform: `translate(0, calc(-50% + ${lerp(30, 0, imgReveal)}px))` }}
                >
                  <Image src="/demo-analytics.jpg" alt="Demo" width={1040} height={680} className="object-cover" />
                </motion.div>

                <GlassCard style={{ position: 'absolute', left: '8%', top: '28%', opacity: callout1, transform: `translateY(${lerp(20, 0, callout1)}px)` }}>
                  <div className="text-sm uppercase tracking-widest text-white/70">Insight</div>
                  <div className="mt-1 text-2xl font-semibold">Real‑time metrics</div>
                  <div className="mt-2 text-white/80">Stream updates as users interact—no refresh needed.</div>
                </GlassCard>
                <ArrowImg src="https://www.svgrepo.com/show/100299/arrow-with-scribble.svg" x="40%" y="35%" r={-20} scale={1.1}
                  opacity={clamp((p - 0.3) * 2)} />

                <GlassCard style={{ position: 'absolute', left: '10%', bottom: '18%', opacity: callout2, transform: `translateY(${lerp(20, 0, callout2)}px)` }}>
                  <div className="text-sm uppercase tracking-widest text-white/70">Control</div>
                  <div className="mt-1 text-2xl font-semibold">Composable animations</div>
                  <div className="mt-2 text-white/80">Use a simple progress value to animate anything.</div>
                </GlassCard>
              </div>
            )
          })()}
        </BoxSection>
      </section>

      {/* Section 4 — CTA */}
      <section ref={(el) => { sectionRefs.current[3] = el }} className="relative min-h-[300vh]">
        <BoxSection src={images[3]} progress={progresses[3] ?? 0}>
          {(() => {
            const p = progresses[3] ?? 0
            const title = easeInOut(clamp((p - 0.05) * 1.6))
            const cta = easeInOut(clamp((p - 0.25) * 1.8))
            const arrow = clamp((p - 0.35) * 2)
            return (
              <div className="absolute inset-0 grid place-items-center px-6">
                <motion.div className="text-center max-w-2xl" style={{ opacity: title, transform: `translateY(${lerp(24, 0, title)}px)` }}>
                  <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to ship modern scroll‑tales?</h2>
                  <p className="mt-4 text-white/80 text-lg">Hook into the progress and stage content like a keynote—no heavy libs required.</p>
                </motion.div>
                <motion.div className="mt-8" style={{ opacity: cta, transform: `translateY(${lerp(16, 0, cta)}px)` }}>
                  <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold shadow-lg hover:shadow-xl transition">Get Started</a>
                </motion.div>
                <ArrowImg src="https://www.svgrepo.com/show/123307/left-arrow-hand-drawn-outline.svg" x="52%" y="64%" r={30} scale={1}
                  opacity={arrow} />
              </div>
            )
          })()}
        </BoxSection>
      </section>
    </div>
  )
}
