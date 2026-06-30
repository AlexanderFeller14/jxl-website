import { Bebas_Neue, Inter } from "next/font/google";

/**
 * Display: tall, condensed editorial caps, the motorsport-magazine headline voice.
 * Sans: a quiet, premium humanist grotesque for body, labels and UI.
 */
export const fontDisplay = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
