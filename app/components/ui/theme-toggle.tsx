'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLanguage } from '../providers/language-provider'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const animateThemeSwitch = (next: 'light' | 'dark') => {
    // Add a temporary class to animate color-related properties
    const root = document.documentElement
    root.classList.add('theme-transition')
    // Switch theme
    setTheme(next)
    // Remove after animation ends
    window.setTimeout(() => {
      root.classList.remove('theme-transition')
    }, 350)
  }

  if (!mounted) {
    return (
      <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-background/40 backdrop-blur transition-all hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 active:scale-95">
        <Sun className="h-4 w-4 text-foreground/80" />
        <span className="sr-only">{t('navigation.toggle_theme')}</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => animateThemeSwitch(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 bg-background/40 backdrop-blur transition-all hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 active:scale-95"
      aria-label={t('navigation.toggle_theme')}
    >
      <span key={resolvedTheme} className="flex items-center justify-center animate-theme-icon">
        {resolvedTheme === 'dark' ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-blue-600" />
        )}
      </span>
      <span className="sr-only">{t('navigation.toggle_theme')}</span>
    </button>
  )
}
