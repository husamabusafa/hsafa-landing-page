'use client'

import Image from "next/image"

import { useLanguage } from "./components/providers/language-provider"


export default function Home() {
  const { t } = useLanguage()
 

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors pt-28">
            <div
              className="relative mx-auto h-[calc(100vh-9rem)] w-[calc(100%-4rem)] max-w-[1800px] overflow-hidden rounded-[28px] "
            
            >
              <Image src="/bg1.svg" alt=""  width={1800} height={1000}  className="object-cover" priority />
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/60 via-background/20 to-transparent" />
              <div className="absolute inset-0 z-20 flex items-start justify-center">
                <div className="mt-16 w-full px-6 sm:px-10 md:px-14">
                  <div className="mx-auto max-w-3xl text-center">
                    <span
                      className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50 animate-fade-in"
                      style={{ animationDelay: '50ms' }}
                    >
                      {t('hero.preview_label')}
                    </span>
                    <h1
                      className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 animate-fade-up"
                      style={{ animationDelay: '120ms' }}
                    >
                      {t('hero.title')}
                    </h1>
                    <p
                      className="mt-3 text-base sm:text-lg md:text-xl text-foreground animate-fade-up"
                      style={{ animationDelay: '220ms' }}
                    >
                      {t('hero.subtitle')}
                    </p>
                  </div>
                </div>
              </div>
              <Image
                src="/agent-flow.png"
                alt="Agent flow"
                width={1200}
                height={800}
                priority
                className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[10%] w-[900px] max-w-[92%] h-auto select-none drop-shadow-2xl shadow-glow z-0"
              />
            </div>

   
    </div>
  )
}

