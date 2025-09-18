'use client'

import { useLanguage } from './components/providers/language-provider'
import { ThemeToggle } from './components/ui/theme-toggle'
import { LanguageToggle } from './components/ui/language-toggle'

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-foreground/20 bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">
              HSAFA
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t('homepage.title')}
            </h1>
            <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto">
              {t('homepage.subtitle')}
            </p>
            <p className="text-lg text-foreground/70 mb-12 max-w-2xl mx-auto">
              {t('homepage.description')}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
                {t('homepage.get_started')}
              </button>
              <button className="border border-foreground/30 text-foreground hover:bg-foreground/5 font-semibold py-3 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/30 focus:ring-offset-2">
                {t('homepage.learn_more')}
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-lg border border-foreground/20 bg-background">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Fast Performance
              </h3>
              <p className="text-foreground/80">
                Built with Next.js 15 and optimized for lightning-fast loading times.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-foreground/20 bg-background">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Theme Support
              </h3>
              <p className="text-foreground/80">
                Seamless dark and light mode switching with system preference detection.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-foreground/20 bg-background">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Multilingual
              </h3>
              <p className="text-foreground/80">
                Full Arabic and English support with RTL layout handling.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Built with Modern Technologies
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'next-themes'].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-foreground/5 text-foreground rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/20 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-foreground/80">
            <p>&copy; 2024 HSAFA. Built with Next.js and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
