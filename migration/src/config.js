// Vaste kennis uit migration/ANALYSIS.md en migration/CONTENT-MODEL.md.
// Alles wat hier staat is gemeten, niet aangenomen.

export const LANGS = ["es", "fr", "pt", "ru"];
export const DEFAULT_LANG = "en";

export const SITE_HOSTS = ["tastycupcakes.org", "www.tastycupcakes.org"];

/** Titel-achtervoegsels die WordPress/het thema toevoegde. */
export const TITLE_SUFFIXES = [
  " - TastyCupcakes.org",
  " « TastyCupcakes.org",
  " – TastyCupcakes.org",
  " — TastyCupcakes.org",
];

/** qTranslate-fallback: pagina toont Engels onder een taal-URL. */
export const FALLBACK_TITLE_PREFIX = "(English)";

/**
 * Containers waarin de post-body zit, op volgorde van voorkeur.
 * `entry-content` = modern thema (WP 6.6.2), `wpn_post` = Simplista 2.9.
 */
export const CONTENT_SELECTORS = [".entry-content", ".wpn_post"];

/**
 * Elementen die binnen de contentcontainer staan maar er niet in horen.
 * Bron: ANALYSIS.md §3.5 — de auteursbox zit ín .entry-content.
 */
export const STRIP_SELECTORS = [
  "[class*='saboxplugin']",
  "[class*='um-avatar']",
  ".avatar",
  ".gravatar",
  ".vcard",
  ".tag-cloud-link",
  "#comments",
  ".comments-area",
  "[class*='wp-block-latest-comments']",
  "script",
  "style",
  "noscript",
  ".sharedaddy",
  ".jp-relatedposts",
  ".wpn_postinfo",
];

/** Classes die verwijderd worden maar waarvan het element blijft staan. */
export const STRIP_CLASS_PATTERNS = [
  /^wp-block-/,
  /^wp-image-/,
  /^is-layout-/,
  /^has-text-align-/,
  /^size-(large|medium|thumbnail|full)$/,
  /^attachment-/,
  /^clearfix$/,
  /^hps$/,           // Google Translate-residu
  /^GRcorrect$/,     // Google Translate-residu
  /^MsoNormal/,      // Word-plak-residu
  /^Apple-style-span$/,
  /^lt-line-clamp/,  // LanguageTool-residu
  /^post-\d+$/,
  /^entry-/,
];

/** Classes met betekenis die bewaard blijven (ANALYSIS.md §3.5). */
export const KEEP_CLASSES = new Set([
  "alignleft", "alignright", "aligncenter", "alignnone",
  "wp-caption", "wp-caption-text",
  "gallery", "gallery-item", "gallery-icon",
]);

/** Afbeeldingen die geen content zijn: plugin-, thema- en profielplaatjes. */
export const NON_CONTENT_IMAGE = [
  /wp-content\/plugins\//,
  /wp-includes\//,
  /wp-content\/themes\//,
  /wp-content\/profile-pics\//,
  /\.php(\?|$)/,
  /gravatar\.com/,
  /\/(spacer|blank|pixel)\.(gif|png)$/,
];

export const UPLOADS_PREFIX = "wp-content/uploads/";
export const MEDIA_PREFIX = "/media/";
export const DOWNLOAD_EXT = new Set([".pdf", ".pptx", ".ppt", ".doc", ".docx", ".zip"]);
export const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"]);

/** WordPress-formaatvariant: naam-<breedte>x<hoogte>.<ext> */
export const VARIANT_RE = /^(.*)-(\d{2,4})x(\d{2,4})(\.[a-z0-9]+)$/i;

/** Pagina's die niet meegaan (CONTENT-MODEL.md §4). */
export const DROPPED_PAGES = new Set([
  "login", "password-reset", "game", "submit-game-reference",
  "tastycupcakes-home", "about/michael-mccullough/michael-mccullough",
]);

/** Auteur-account waarvan de identiteit uit de export is vastgesteld. */
export const AUTHOR_OVERRIDES = { admin: "Michael McCullough" };

export const CATEGORY_NAMES = {
  games: "Games", agile: "Agile", "team-dynamics": "Team Dynamics",
  "project-management": "Project Management", communication: "Communication",
  development: "Development", product: "Product", requirements: "Requirements",
  lean: "Lean", instructing: "Instructing", news: "News",
  commentary: "Commentary", uncategorized: "Uncategorized",
};
