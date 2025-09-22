"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../providers/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-24 border-t border-foreground/10 bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1800px] py-10">
        {/* Top row */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3">
              <span className="relative h-8 w-20">
                <Image
                  src="/hsafa-logo-dark.svg"
                  alt="HSAFA logo"
                  height={32}
                  width={160}
                  className="block site-logo"
                  priority
                />
              </span>
              <span className="text-sm font-semibold tracking-tight">HSAFA</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Crafting agentic experiences that feel effortless, powerful, and beautifully human.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/features" className="hover:text-foreground/90 text-foreground/80">
                    {t ? t("navigation.features") : "Features"}
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground/90 text-foreground/80">
                    {t ? t("navigation.pricing") : "Pricing"}
                  </Link>
                </li>
                <li>
                  <Link href="/download" className="hover:text-foreground/90 text-foreground/80">
                    {t ? t("navigation.download") : "Download"}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href="/docs" className="hover:text-foreground/90 text-foreground/80">
                    {t ? t("navigation.docs") : "Docs"}
                  </Link>
                </li>
                <li>
                  <Link href="/system_nodes" className="hover:text-foreground/90 text-foreground/80">
                    hsafa nodes
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground/90 text-foreground/80">
                    {t ? t("navigation.contact") : "Contact"}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Follow</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/90 text-foreground/80">
                    X / Twitter
                  </a>
                </li>
                <li>
                  <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/90 text-foreground/80">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@example.com" className="hover:text-foreground/90 text-foreground/80">
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-foreground/10" />

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} HSAFA. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground/80">Privacy</Link>
            <Link href="#" className="hover:text-foreground/80">Terms</Link>
            <Link href="#" className="hover:text-foreground/80">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
