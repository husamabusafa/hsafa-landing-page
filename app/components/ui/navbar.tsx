"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../providers/language-provider";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  return (
 
        <header
          className={`sticky lg:-mb-22 -mb-20  top-2 z-50  flex  max-w-[1672px] mx-auto w-[calc(100%-3.5rem)]  py-1 items-center justify-between rounded-xl  px-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:rounded-2xl lg:py-3 lg:pr-2
            border ${scrolled ? "border-foreground/15 shadow-sm" : "border-transparent"}
            backdrop-blur-sm supports-[backdrop-filter]:bg-background/60
            ${scrolled ? "bg-background/70" : "bg-background/40"}
            transition-[box-shadow,background-color,border-color,transform] duration-300`}
          style={{
            // optional CSS var consumers
            // @ts-expect-error css var
            "--navbar-height": "72px",
          }}
        >
          {/* Left: Logo */}
          <Link
            aria-label="Homepage"
            href="/"
            className="relative flex w-fit items-center gap-2 overflow-hidden lg:px-3"
          >
            {/* Swap logos based on theme */}
            <span className="relative -ml-0.5 h-10 w-20 lg:-ml-4 lg:mr-px lg:h-10 lg:w-24">
              <Image
                src="/hsafa-logo-dark.svg"
                alt="HSAFA logo"
                height={40}
                width={240}
                className="block site-logo "
                priority
              />
            </span>
          </Link>

          {/* Center: Nav links (desktop) */}
          <nav className="col-start-2 hidden items-center justify-center lg:flex">
            <ul className="flex items-center gap-4 px-2 text-sm font-medium text-foreground/80 xl:gap-6">
              <li>
                <Link
                  href="/features"
                  className="rounded-md p-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {t('navigation.features')}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="rounded-md p-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {t('navigation.pricing')}
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="rounded-md p-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {t('navigation.docs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/system_nodes"
                  className="rounded-md p-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  hsafa nodes
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="rounded-md p-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right: Actions */}
          <div className="col-start-3 hidden w-full items-center justify-end gap-2 lg:flex">
            <ThemeToggle />
            <LanguageToggle />
            <Link
              href="/download"
              className="relative inline-flex items-center justify-center whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:opacity-90 hover:shadow-sm"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="h-3.5 w-3.5 -translate-y-px"
                  fill="currentColor"
                  viewBox="0 0 14 18"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M13.5545 6.1362c-.0997.081-1.8609 1.1196-1.8609 3.429 0 2.6712 2.241 3.6162 2.3081 3.6396-.0103.0576-.356 1.2942-1.1816 2.5542-.7361 1.1088-1.5049 2.2158-2.6744 2.2158-1.16953 0-1.47052-.711-2.82064-.711-1.31572 0-1.78354.7344-2.85332.7344-1.06977 0-1.81621-1.026-2.67444-2.286C.8032 14.2326 0 11.934 0 9.7524c0-3.4992 2.17396-5.355 4.31351-5.355 1.13686 0 2.08452.7812 2.79828.7812.67936 0 1.73882-.828 3.03221-.828.4902 0 2.2513.0468 3.4105 1.7856Zm-4.02453-3.267c.53493-.6642.91323-1.5858.91323-2.5074 0-.1278-.0103-.2574-.0326-.3618-.87031.0342-1.90569.6066-2.53001 1.3644-.49017.5832-.94767 1.5048-.94767 2.439 0 .1404.02236.2808.03268.3258.05504.0108.14447.0234.23391.0234.78083 0 1.7629-.5472 2.33046-1.2834Z" />
                </svg>
                {t('navigation.download')}
              </span>
            </Link>
          </div>

          {/* Mobile right: toggles + hamburger (drawer) */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <LanguageToggle />
           {mobileOpen ? <button
              aria-label="Menu"
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => {
                setMobileOpen(false);
                console.log('Closing mobile menu');
              }}
            >
              {
               <svg
               className="h-5 w-5 transition-transform duration-200"
               viewBox="0 0 24 24"
               strokeWidth="2"
               stroke="currentColor"
               fill="none"
               strokeLinecap="round"
               strokeLinejoin="round"
               aria-hidden="true"
             >
               <path d="M6 6l12 12M6 18L18 6" />
             </svg>
              }
            </button> : <button
              aria-label="Menu"
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(true)}
            >
              {
                <svg
                  className="h-5 w-5 transition-transform duration-200"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              }
            </button>}
          </div>

          {/* Mobile popup menu (positioned outside header box) */}
          <div
            id="mobile-menu"
            ref={menuRef}
            className={`lg:hidden absolute left-3 right-3 top-full mt-2 z-40 origin-top rounded-xl border bg-background  backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-200 ${mobileOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1"} ${scrolled ? "border-foreground/15" : "border-foreground/10"}`}
            aria-hidden={!mobileOpen}
          >
            <nav className="p-2">
              <ul className="flex flex-col divide-y divide-foreground/10">
                <li>
                  <Link href="/features" className="block px-3 py-3 text-sm font-medium hover:bg-foreground/5" onClick={() => setMobileOpen(false)}>
                    {t('navigation.features')}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="block px-3 py-3 text-sm font-medium hover:bg-foreground/5" onClick={() => setMobileOpen(false)}>
                    {t('navigation.pricing')}
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="block px-3 py-3 text-sm font-medium hover:bg-foreground/5" onClick={() => setMobileOpen(false)}>
                    {t('navigation.docs')}
                  </Link>
                </li>
                <li>
                  <Link href="/system_nodes" className="block px-3 py-3 text-sm font-medium hover:bg-foreground/5" onClick={() => setMobileOpen(false)}>
                    hsafa nodes
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="block px-3 py-3 text-sm font-medium hover:bg-foreground/5" onClick={() => setMobileOpen(false)}>
                    {t('navigation.contact')}
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex items-center justify-between gap-2 p-2">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              <Link
                href="/download"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                onClick={() => setMobileOpen(false)}
              >
                {t('navigation.download')}
              </Link>
            </div>
          </div>

        </header>
  
  );
}
