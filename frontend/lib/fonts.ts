import { Saira_Stencil_One, Vidaloka, Rokkitt, Inter } from "next/font/google";

// Server-rendered Google Fonts — Next.js self-hosts these at build time,
// so there's no client-side request to fonts.googleapis.com and no
// layout shift. Each exposes a CSS variable consumed in globals.css.

export const sairaStencilOne = Saira_Stencil_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-logo",
  display: "swap",
});

export const vidaloka = Vidaloka({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

export const rokkitt = Rokkitt({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-subheading",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const fontVariables = [
  sairaStencilOne.variable,
  vidaloka.variable,
  rokkitt.variable,
  inter.variable,
].join(" ");
