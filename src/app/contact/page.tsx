import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Commissions and collaborations. Get in touch with JXL-Visuals.",
};

export default function ContactPage() {
  return (
    <Container className="pb-section pt-32 md:pt-40">
      <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        {/* Intro */}
        <div>
          <Eyebrow accent>Contact</Eyebrow>
          <h1 className="u-display mt-5 text-display-sm text-balance">
            Let&apos;s document your race weekend.
          </h1>
          <p className="mt-7 max-w-measure-sm text-base leading-relaxed text-ink-muted">
            For commissions, team and manufacturer collaborations, or simply
            to talk motorsport, reach out below or email directly.
          </p>

          <div className="mt-12 space-y-6">
            <div>
              <p className="u-eyebrow mb-2">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="text-lg text-ink-primary transition-colors hover:text-accent"
              >
                {site.email}
              </a>
            </div>
            <div>
              <p className="u-eyebrow mb-2">Elsewhere</p>
              <div className="flex gap-6">
                {site.social.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm uppercase tracking-[0.14em] text-ink-muted transition-colors hover:text-ink-primary"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:pt-2">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
