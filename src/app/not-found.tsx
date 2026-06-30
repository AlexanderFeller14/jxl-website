import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center py-40">
      <Eyebrow accent>Error 404</Eyebrow>
      <h1 className="u-display mt-5 text-display">Off Track</h1>
      <p className="mt-6 max-w-measure-sm text-base leading-relaxed text-ink-muted">
        This page isn&apos;t part of the archive. Let&apos;s get you back on the
        racing line.
      </p>
      <div className="mt-10 flex gap-7">
        <ButtonLink href="/" variant="outline" arrow>
          Back home
        </ButtonLink>
        <ButtonLink href="/publications" variant="ghost" arrow>
          View publications
        </ButtonLink>
      </div>
    </Container>
  );
}
