/**
 * Redirects volgens CONTENT-MODEL.md §9.
 * Patronen worden als patroon bewaard; alleen wat niet te vangen is met een
 * patroon komt in de exacte tabel. Dat scheelt ~1.780 losse regels.
 */
export const PATTERNS = [
  // Volgorde telt: specifiek vóór generiek. De taal-prefixregel staat bewust
  // als laatste, zodat /es/tag/… eerst als tag wordt herkend.
  { id: "feeds", match: "^/(.*/)?feed(\\.html)?(/atom)?/?$", to: "/rss.xml", status: 301 },
  { id: "comments-feed", match: "^/comments/feed(\\.html)?/?$", to: "/rss.xml", status: 301 },
  { id: "comment-pages", match: "^(/(?:es|fr|pt|ru)?/?\\d{4}/\\d{2}/[^/]+/)comment-page-\\d+/?$", to: "$1", status: 301 },
  { id: "tag-pagination", match: "^(?:/(?:es|fr|pt|ru))?/tag/([^/]+)/page/\\d+/?$", to: "/tag/$1/", status: 301 },
  { id: "author-pagination", match: "^(?:/(?:es|fr|pt|ru))?/author/([^/]+)/page/\\d+/?$", to: "/author/$1/", status: 301 },
  // Genest onder een auteurarchief: crawler-artefact, bestond nooit als URL.
  { id: "author-nested", match: "^(?:/(?:es|fr|pt|ru))?/author/[^/]+/[^/]+/?$", status: 410 },
  { id: "stray-html", match: "^/(?:es|fr|pt|ru)/\\d{4}/\\d{2}/[^/]+\\.html$", status: 410 },
  { id: "uploads-downloads", match: "^/wp-content/uploads/(?:.*/)?([^/]+\\.(?:pdf|pptx?|docx?|zip))$", to: "/downloads/$1", status: 301 },
  { id: "uploads-media", match: "^/wp-content/uploads/(.+)$", to: "/media/$1", status: 301 },
  { id: "wp-system", match: "^/wp-(admin|json|includes|login|content)(\\.html|[/.].*)?$", status: 410 },
  { id: "user-profiles", match: "^/user/.*$", status: 410 },
  { id: "lang-prefix", match: "^/(?:es|fr|pt|ru)/(.*)$", to: "/$1", status: 301 },
];

export function createRedirectTable() {
  const exact = new Map();
  return {
    add(from, to, status = 301, reason = "") {
      if (!from || from === to) return;
      if (exact.has(from)) return;           // eerste regel wint, deterministisch
      exact.set(from, { to: to || null, status, reason });
    },
    build() {
      const entries = [...exact.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      return {
        patterns: PATTERNS,
        exact: Object.fromEntries(entries.map(([from, v]) => [from, v])),
        counts: {
          exact: entries.length,
          byStatus: entries.reduce((acc, [, v]) => ({ ...acc, [v.status]: (acc[v.status] || 0) + 1 }), {}),
        },
      };
    },
    size: () => exact.size,
  };
}
