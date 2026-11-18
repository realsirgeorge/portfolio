/**
 * Site-wide constants: canonical URL, navigation, and the Knight Labs links
 * that business enquiries are routed to.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://realsirgeorge.knightlabs.co.ke"
).replace(/\/$/, "");

export const SITE_NAME = "George Wanyoike";

export const KNIGHT_LABS = {
  name: "Knight Labs",
  url: "https://knightlabs.co.ke",
  quickStart: "https://knightlabs.co.ke/#quick-start",
  services: "https://knightlabs.co.ke/services",
  about: "https://knightlabs.co.ke/about",
  contact: "https://knightlabs.co.ke/contact",
  trust: "https://knightlabs.co.ke/trust",
  /** Published on knightlabs.co.ke/contact. */
  email: "hello@knightlabs.co.ke",
} as const;

export const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/knight-labs", label: "Knight Labs" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Writing" },
  { href: "/open-for-work", label: "Hire" },
  { href: "/library", label: "Library" },
] as const;
