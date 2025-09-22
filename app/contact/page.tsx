"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../components/providers/language-provider";

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  consent: boolean;
};

export default function ContactPage() {
  const { t } = useLanguage();

  const labels = useMemo(
    () => ({
      title: t("navigation.contact") ?? "Contact",
      subtitle:
        "We'd love to hear from you. Tell us about your project or question and we'll respond shortly.",
      yourName: "Your name",
      email: "Email",
      company: "Company (optional)",
      subject: "Subject",
      message: "Message",
      consent: "I agree to be contacted about my inquiry.",
      send: "Send message",
      sending: t("common.loading") ?? "Loading...",
      successTitle: "Message sent",
      successBody: "Thanks! We received your message and will get back to you soon.",
      tryAgain: t("common.try_again") ?? "Try Again",
    }),
    [t]
  );

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    consent: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    // Clear server message when editing
    if (serverError || success) {
      setServerError(null);
      setSuccess(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.name, form.email, form.subject, form.message]);

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/.+@.+\..+/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Please provide at least 10 characters";
    if (!form.consent) e.consent = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    setSuccess(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to send");
      }
      setSuccess(json.message || labels.successBody);
      setForm({ name: "", email: "", company: "", subject: "", message: "", consent: true });
    } catch (err: any) {
      setServerError(err?.message || t("common.error") || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-28">
      <div className="mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] max-w-[1600px]">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] ring-1 ring-border/50 bg-gradient-to-br from-muted/60 via-background/60 to-muted/40 backdrop-blur-xl shadow-2xl px-6 sm:px-10 md:px-14 py-12">
          {/* Decorative glows */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            {/* Left: Intro + Details */}
            <div>
              <span className="inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border/50">
                {labels.title}
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
                {labels.subtitle}
              </h1>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailCard title="General" desc="hello@hsafa.ai" icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>
                } />
                <DetailCard title="Press" desc="press@hsafa.ai" icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M8 17V3h8v14"/></svg>
                } />
                <DetailCard title="Support" desc="support@hsafa.ai" icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13a6 6 0 1 0-9 5.197"/><circle cx="18" cy="18" r="3"/><path d="M13 16h-1a2 2 0 0 1-2-2v-1"/></svg>
                } />
                <DetailCard title="Sales" desc="sales@hsafa.ai" icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v4H3z"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
                } />
              </div>
            </div>

            {/* Right: Form */}
            <div className="relative">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="rounded-[20px] ring-1 ring-border/50 bg-muted/60 backdrop-blur-xl p-5 sm:p-6 shadow-xl">
                {success ? (
                  <SuccessCard title={labels.successTitle} body={success} onReset={() => setSuccess(null)} />
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label={labels.yourName}
                        error={errors.name}
                        input={
                          <input
                            type="text"
                            className="w-full rounded-xl border border-foreground/15 bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Jane Doe"
                          />
                        }
                      />
                      <Field
                        label={labels.email}
                        error={errors.email}
                        input={
                          <input
                            type="email"
                            className="w-full rounded-xl border border-foreground/15 bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            placeholder="jane@company.com"
                          />
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        label={labels.company}
                        error={errors.company}
                        input={
                          <input
                            type="text"
                            className="w-full rounded-xl border border-foreground/15 bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                            value={form.company}
                            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                            placeholder="Company Inc."
                          />
                        }
                      />
                      <Field
                        label={labels.subject}
                        error={errors.subject}
                        input={
                          <input
                            type="text"
                            className="w-full rounded-xl border border-foreground/15 bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                            value={form.subject}
                            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                            placeholder="How can we help?"
                          />
                        }
                      />
                    </div>

                    <Field
                      label={labels.message}
                      error={errors.message}
                      input={
                        <textarea
                          rows={6}
                          className="w-full rounded-xl border border-foreground/15 bg-background/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/20 resize-y"
                          value={form.message}
                          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                          placeholder="Share a bit about your use case, timeline, or questions."
                        />
                      }
                    />

                    <div className="flex items-start gap-3">
                      <input
                        id="consent"
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                        className="mt-1 h-4 w-4 rounded border-foreground/20 bg-background/60 text-foreground focus:ring-2 focus:ring-foreground/20"
                      />
                      <label htmlFor="consent" className="text-sm text-foreground/80">
                        {labels.consent}
                        {errors.consent && (
                          <span className="ml-2 text-xs text-red-500">{errors.consent}</span>
                        )}
                      </label>
                    </div>

                    {serverError && (
                      <div className="rounded-lg border border-red-200/40 bg-red-100/40 px-3 py-2 text-sm text-red-700">
                        {serverError}
                      </div>
                    )}

                    <div className="flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-60"
                      >
                        {submitting ? (
                          <span className="inline-flex items-center gap-2">
                            <Spinner /> {labels.sending}
                          </span>
                        ) : (
                          labels.send
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      {input}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

function DetailCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative rounded-[16px] ring-1 ring-border/50 bg-background/40 backdrop-blur-xl p-4 shadow-md">
      <div className="absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-foreground/5 blur-2xl" />
      <div className="flex items-start gap-3">
        <div className="mt-1 text-foreground/80">{icon}</div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function SuccessCard({ title, body, onReset }: { title: string; body: string; onReset: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center">
        <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <div className="mt-6">
        <button onClick={onReset} className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium hover:bg-foreground/5">
          Close
        </button>
      </div>
    </div>
  );
}
