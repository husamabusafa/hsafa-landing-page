"use client";

import { useLanguage } from "../components/providers/language-provider";

export default function DownloadPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen flex items-center justify-center pt-28">
      <h1 className="text-3xl font-semibold">{t("navigation.download")}</h1>
    </main>
  );
}
