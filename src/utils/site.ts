export const SITE = {
  title: "TastyCupcakes.org",
  tagline: "Fuel for Invention and Learning",
  description:
    "Games and exercises for agile teams, coaches and facilitators — a community archive of workshop material.",
  url: "https://tastycupcakes.org",
  locale: "en_US",
  postsPerPage: 10,
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/category/games/", label: "Games" },
  { href: "/category/agile/", label: "Agile" },
  { href: "/about/", label: "About" },
] as const;

export const LANG_NAMES: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  pt: "Português",
  ru: "Русский",
};
