import type { Metadata, Viewport } from "next";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { site } from "@/lib/site";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: [
    "motorsport photography",
    "editorial",
    "Nürburgring",
    "Le Mans",
    "GT racing",
    "publication",
    "JXL-Visuals",
  ],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · ${site.tagline}`,
    description: site.description,
  },
  icons: {
    icon: "/media/logo-jxl.png",
    apple: "/media/logo-jxl.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={site.locale}
      className={`${fontDisplay.variable} ${fontSans.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-bg-base text-ink-primary">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink-primary focus:px-4 focus:py-2 focus:text-bg-base"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
