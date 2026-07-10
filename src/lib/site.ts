/**
 * Single source of truth for site-wide chrome: identity, navigation, contact, socials.
 * Keeps Nav / Footer / metadata in sync from one place.
 */
export const site = {
  name: "JXL-Visuals",
  shortName: "JXL",
  tagline: "Editorial Motorsport Archive",
  description:
    "A digital publishing house dedicated to motorsport. Every race weekend becomes a collectible publication, documented through photography, atmosphere and editorial design.",
  url: "https://jxl-visuals.com",
  email: "alex@jxl-visuals.com",
  locale: "en",
  nav: [
    { label: "Home", href: "/" },
    { label: "Publications", href: "/publications" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com/jxl_visuals" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
