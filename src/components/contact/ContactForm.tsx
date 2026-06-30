"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const ERRORS: Record<string, string> = {
  missing_required_fields: "Please fill in name, email and message.",
  invalid_email: "That email address doesn't look right.",
  missing_smtp_credentials:
    "The mailer isn't configured yet, please email us directly.",
  send_failed: "Something went wrong. Please try again or email us directly.",
  invalid_body: "Something went wrong. Please try again.",
};

const fieldClass =
  "w-full border-0 border-b border-line-hairline bg-transparent py-3 text-ink-primary placeholder:text-ink-faint focus:border-ink-primary focus:outline-none focus:ring-0 transition-colors";
const labelClass =
  "block text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setError(ERRORS[json.error] ?? ERRORS.send_failed);
      }
    } catch {
      setStatus("error");
      setError(ERRORS.send_failed);
    }
  }

  if (status === "success") {
    return (
      <div className="border border-line-hairline p-10">
        <p className="u-eyebrow text-accent">Message sent</p>
        <p className="mt-4 font-display text-3xl uppercase text-ink-primary">
          Thank you, we&apos;ll be in touch.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          Your enquiry is on its way. We typically reply within a few days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-8 text-[0.7rem] uppercase tracking-[0.16em] text-ink-muted underline-offset-4 transition-colors hover:text-ink-primary"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={cn(fieldClass, "mt-2")}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={cn(fieldClass, "mt-2")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Commission, print enquiry, collaboration…"
          className={cn(fieldClass, "mt-2")}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about the race weekend or project."
          className={cn(fieldClass, "mt-2 resize-none")}
        />
      </div>

      {error && (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="group inline-flex items-center gap-3 bg-ink-primary px-7 py-3.5 text-[0.78rem] uppercase tracking-wide text-bg-base transition-all duration-300 ease-editorial hover:bg-white disabled:opacity-40"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
        <span
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </button>
    </form>
  );
}
