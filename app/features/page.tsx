'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

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
        // tiny threshold to avoid extra renders
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

    // Ensure we compute after the DOM has painted on client-side navigations
    // First tick schedules update, second tick guarantees layout is ready
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

function BoxSection({ src, progress }: { src: string; progress: number }) {
  const scale = 0.80 + progress * 0.20 // 0.90 → 1.00, then back
  const radius = 28 * (1 - progress) // 28 → 0 → 28

  return (
    <div className="sticky top-0 h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          borderRadius: `${radius}px`,
          overflow: 'hidden',
        }}
      >
       
        <Image src={src} alt="" fill sizes="100vw" className="object-cover" priority />
      </div>
    </div>
  )
}

export default function FeaturesPage() {
  const images = ['/bg2.svg', '/bg3.svg', '/bg4.svg', '/bg1.svg']
  const { sectionRefs, progresses } = useScrollProgressForSections(images.length)

  // Ensure we start from top when navigating here client-side
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {images.map((src, idx) => (
        <section
          key={src}
          ref={(el) => { sectionRefs.current[idx] = el; }}
          className="relative min-h-[300vh]"
        >
          <BoxSection src={src} progress={progresses[idx] ?? 0} />
        </section>
      ))}
    </div>
  )
}
