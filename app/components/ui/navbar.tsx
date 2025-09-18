"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-[1672px] px-4 md:px-6 lg:px-8">
        <div
          className="relative flex h-20 lg:h-24 w-full items-center justify-between rounded-lg border border-transparent bg-background px-3 py-2 transition-[box-shadow,background-color,border-color] duration-300 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:rounded-2xl lg:py-3 lg:pr-2"
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
                className="block site-logo"
                priority
              />
            </span>
          </Link>

          {/* Center: Nav links (desktop) */}
          <nav className="col-start-2 hidden items-center justify-center lg:flex">
            <ul className="flex items-center gap-4 px-2 text-sm font-medium text-foreground/80 xl:gap-6">
              <li>
                <Link
                  href="#features"
                  className="rounded-md p-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="rounded-md p-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#docs"
                  className="rounded-md p-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="rounded-md p-2 transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right: Actions */}
          <div className="col-start-3 hidden w-full items-center justify-end gap-2 lg:flex">
            <ThemeToggle />
            <LanguageToggle />
            <Link
              href="#download"
              className="relative inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
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
                Download
              </span>
            </Link>
          </div>

          {/* Mobile right: toggles + hamburger (no drawer for now) */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <LanguageToggle />
            <button
              aria-label="Menu"
              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-foreground/10 hover:bg-foreground/5"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
