'use client'

import * as React from 'react'
import { Languages } from 'lucide-react'
import { useLanguage, type Language } from '../providers/language-provider'

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'ar' : 'en'
    setLanguage(newLanguage)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center justify-center gap-2 px-3 h-9 rounded-full border border-foreground/10 bg-background/40 backdrop-blur transition-all hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 active:scale-95"
      aria-label={t('navigation.toggle_language')}
    >
      <Languages className="h-4 w-4 text-foreground/80" />
      <span className="text-sm font-medium text-foreground/80">
        {language === 'en' ? t('language.arabic') : t('language.english')}
      </span>
    </button>
  )
}
