/**
 * SINGLE SOURCE OF TRUTH for the archive.
 *
 * Every page is generated from this file. To add a publication:
 *   1. Drop photos into /public/publications/<slug>/ (cover.jpg, gallery/NN.jpg, brochure.pdf)
 *   2. Add one object below.
 * No other code changes are required.
 */

export type PublicationCategory =
  | "Nürburgring"
  | "Le Mans"
  | "Hillclimb"
  | "GT Racing";

/** Canonical filter order. Filters render data-driven, in this order. */
export const CATEGORY_ORDER: PublicationCategory[] = [
  "Nürburgring",
  "Le Mans",
  "Hillclimb",
  "GT Racing",
];

export type GallerySectionLabel =
  | "Arrival"
  | "Practice"
  | "Race"
  | "Night"
  | "Atmosphere"
  | "People"
  | "Details"
  | "Victory";

export interface GallerySection {
  label: GallerySectionLabel;
  /** Optional short editorial caption shown under the chapter title. */
  caption?: string;
  images: string[];
}

export type PublicationStatus = "published" | "coming-soon";

export interface Publication {
  slug: string;
  title: string;
  subtitle: string;
  location: string;
  category: PublicationCategory;
  date: string; // ISO, used for sorting; year derived for display
  dateLabel: string; // human display, e.g. "29 May – 1 June 2025"
  circuit: string;
  format: string;
  cover: string;
  description: string;
  gallery: GallerySection[];
  pdf: string;
  featured?: boolean;
  status?: PublicationStatus; // defaults to "published"
  pages?: number;
  photos?: string; // display string, e.g. "180+"
  /** Future-proofing: search / filtering / related. */
  tags?: string[];
}

const base = (slug: string) => `/publications/${slug}`;

export const publications: Publication[] = [
  {
    slug: "24h-nuerburgring-2025",
    title: "24H Nürburgring 2025",
    subtitle: "Four days. One track. Hundreds of stories.",
    location: "Nürburgring, Germany",
    category: "Nürburgring",
    date: "2025-05-29",
    dateLabel: "29 May – 1 June 2025",
    circuit: "Nürburgring Nordschleife",
    format: "Digital Brochure",
    cover: `${base("24h-nuerburgring-2025")}/cover.jpg`,
    pdf: `${base("24h-nuerburgring-2025")}/brochure.pdf`,
    description:
      "The 24-hour race at the Nürburgring is more than a race. It is a test of everything. Twenty-four hours through fog, rain and floodlight in the Eifel. This is our visual story.",
    featured: true,
    pages: 82,
    photos: "180+",
    tags: ["endurance", "nordschleife", "gt3", "night"],
    gallery: [
      {
        label: "Arrival",
        caption: "The beginning, paddock, pit lane and the calm before.",
        images: [
          `${base("24h-nuerburgring-2025")}/gallery/01.jpg`,
          `${base("24h-nuerburgring-2025")}/gallery/02.jpg`,
        ],
      },
      {
        label: "Practice",
        caption: "Finding limits in the green hell.",
        images: [
          `${base("24h-nuerburgring-2025")}/gallery/03.jpg`,
          `${base("24h-nuerburgring-2025")}/gallery/04.jpg`,
        ],
      },
      {
        label: "Race",
        caption: "Twenty-four hours of intensity.",
        images: [
          `${base("24h-nuerburgring-2025")}/gallery/05.jpg`,
          `${base("24h-nuerburgring-2025")}/gallery/06.jpg`,
        ],
      },
      {
        label: "Night",
        caption: "Another world after dark.",
        images: [
          `${base("24h-nuerburgring-2025")}/gallery/07.jpg`,
          `${base("24h-nuerburgring-2025")}/gallery/08.jpg`,
          `${base("24h-nuerburgring-2025")}/gallery/09.jpg`,
        ],
      },
      {
        label: "Details",
        caption: "The small things that decide everything.",
        images: [
          `${base("24h-nuerburgring-2025")}/gallery/10.jpg`,
          `${base("24h-nuerburgring-2025")}/gallery/11.jpg`,
        ],
      },
      {
        label: "Victory",
        caption: "The reward.",
        images: [
          `${base("24h-nuerburgring-2025")}/gallery/12.jpg`,
          `${base("24h-nuerburgring-2025")}/gallery/13.jpg`,
        ],
      },
    ],
  },
  {
    slug: "24h-le-mans-2026",
    title: "24H Le Mans 2026",
    subtitle: "The greatest race in the world. Coming soon.",
    location: "Le Mans, France",
    category: "Le Mans",
    date: "2026-06-13",
    dateLabel: "June 2026",
    circuit: "Circuit de la Sarthe",
    format: "Digital Brochure",
    cover: `${base("24h-le-mans-2026")}/cover.jpg`,
    pdf: `${base("24h-le-mans-2026")}/brochure.pdf`,
    description:
      "A century of speed down the Mulsanne. Our next publication follows the 24 Hours of Le Mans, dawn light, midnight pace and the long road to the finish.",
    featured: true,
    status: "coming-soon",
    photos: "Coming soon",
    tags: ["endurance", "le-mans", "hypercar"],
    gallery: [
      {
        label: "Atmosphere",
        caption: "First impressions, the road to Le Mans.",
        images: [
          `${base("24h-le-mans-2026")}/gallery/01.jpg`,
          `${base("24h-le-mans-2026")}/gallery/02.jpg`,
          `${base("24h-le-mans-2026")}/gallery/03.jpg`,
        ],
      },
    ],
  },
  {
    slug: "24h-nuerburgring-2024",
    title: "24H Nürburgring 2024",
    subtitle: "Golden light and a long night in the Eifel.",
    location: "Nürburgring, Germany",
    category: "Nürburgring",
    date: "2024-05-30",
    dateLabel: "30 May – 2 June 2024",
    circuit: "Nürburgring Nordschleife",
    format: "Digital Brochure",
    cover: `${base("24h-nuerburgring-2024")}/cover.jpg`,
    pdf: `${base("24h-nuerburgring-2024")}/brochure.pdf`,
    description:
      "Golden hour over the Nordschleife giving way to a relentless night. A weekend of weather, attrition and the unmistakable roar of GT3 machinery.",
    pages: 78,
    photos: "150+",
    tags: ["endurance", "nordschleife", "gt3"],
    gallery: [
      {
        label: "Practice",
        caption: "Dialling in before the storm.",
        images: [
          `${base("24h-nuerburgring-2024")}/gallery/01.jpg`,
          `${base("24h-nuerburgring-2024")}/gallery/02.jpg`,
        ],
      },
      {
        label: "Race",
        caption: "Wheel to wheel through the Eifel.",
        images: [
          `${base("24h-nuerburgring-2024")}/gallery/03.jpg`,
          `${base("24h-nuerburgring-2024")}/gallery/04.jpg`,
        ],
      },
      {
        label: "Night",
        caption: "Headlights against the dark.",
        images: [
          `${base("24h-nuerburgring-2024")}/gallery/05.jpg`,
          `${base("24h-nuerburgring-2024")}/gallery/06.jpg`,
        ],
      },
    ],
  },
  {
    slug: "24h-nuerburgring-2022",
    title: "24H Nürburgring 2022",
    subtitle: "Where the modern legend was written.",
    location: "Nürburgring, Germany",
    category: "Nürburgring",
    date: "2022-05-28",
    dateLabel: "28 – 29 May 2022",
    circuit: "Nürburgring Nordschleife",
    format: "Digital Brochure",
    cover: `${base("24h-nuerburgring-2022")}/cover.jpg`,
    pdf: `${base("24h-nuerburgring-2022")}/brochure.pdf`,
    description:
      "The return to a full-capacity Eifel classic. Colour, crowds and the raw theatre of endurance racing across the most demanding circuit in the world.",
    pages: 72,
    photos: "140+",
    tags: ["endurance", "nordschleife", "gt3"],
    gallery: [
      {
        label: "Arrival",
        caption: "Setting the stage.",
        images: [
          `${base("24h-nuerburgring-2022")}/gallery/01.jpg`,
          `${base("24h-nuerburgring-2022")}/gallery/02.jpg`,
        ],
      },
      {
        label: "Race",
        caption: "The fight unfolds.",
        images: [
          `${base("24h-nuerburgring-2022")}/gallery/03.jpg`,
          `${base("24h-nuerburgring-2022")}/gallery/04.jpg`,
        ],
      },
      {
        label: "Atmosphere",
        caption: "The mood of the mountain.",
        images: [
          `${base("24h-nuerburgring-2022")}/gallery/05.jpg`,
          `${base("24h-nuerburgring-2022")}/gallery/06.jpg`,
        ],
      },
    ],
  },
  {
    slug: "bergrennen-gurnigel-2022",
    title: "Bergrennen Gurnigel 2022",
    subtitle: "Against the mountain, against the clock.",
    location: "Gurnigel, Switzerland",
    category: "Hillclimb",
    date: "2022-09-17",
    dateLabel: "17 – 18 September 2022",
    circuit: "Gurnigel Hillclimb",
    format: "Digital Brochure",
    cover: `${base("bergrennen-gurnigel-2022")}/cover.jpg`,
    pdf: `${base("bergrennen-gurnigel-2022")}/brochure.pdf`,
    description:
      "A Swiss hillclimb through forest and fog. No room for error on a ribbon of road climbing into the Bernese pre-alps, pure, distilled motorsport.",
    pages: 64,
    photos: "90+",
    tags: ["hillclimb", "switzerland"],
    gallery: [
      {
        label: "Practice",
        caption: "Learning the line.",
        images: [
          `${base("bergrennen-gurnigel-2022")}/gallery/01.jpg`,
          `${base("bergrennen-gurnigel-2022")}/gallery/02.jpg`,
        ],
      },
      {
        label: "Race",
        caption: "Flat out, uphill.",
        images: [
          `${base("bergrennen-gurnigel-2022")}/gallery/03.jpg`,
          `${base("bergrennen-gurnigel-2022")}/gallery/04.jpg`,
        ],
      },
      {
        label: "Atmosphere",
        caption: "The quiet of the climb.",
        images: [`${base("bergrennen-gurnigel-2022")}/gallery/05.jpg`],
      },
    ],
  },
];
