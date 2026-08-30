import * as cheerio from "cheerio";
import {
  CONTENT_SELECTORS, TITLE_SUFFIXES, FALLBACK_TITLE_PREFIX, AUTHOR_OVERRIDES,
} from "./config.js";

/** Ruwe metadata uit één HTML-bestand. Doet geen aannames; ontbrekend = null. */
export function extract(html, sourceRel) {
  const $ = cheerio.load(html);

  const rawTitle = ($("title").first().text() || "").trim();
  const { title, isFallback } = cleanTitle(rawTitle);

  const article = $("article[id^='post-']").first();
  const bodyClass = $("body").attr("class") || "";
  const articleClass = article.attr("class") || "";
  const classes = `${bodyClass} ${articleClass}`.split(/\s+/).filter(Boolean);

  let container = null, capture = "none";
  for (const sel of CONTENT_SELECTORS) {
    const node = $(sel).first();
    if (node.length) {
      container = node;
      capture = sel === ".entry-content" ? "modern" : "legacy";
      break;
    }
  }

  return {
    sourceRel,
    title,
    rawTitle,
    isEnglishFallback: isFallback,
    titleNeedsReview: looksConcatenated(title),
    postId: pick(classes, /^postid-(\d+)$/) ?? pick(classes, /^page-id-(\d+)$/),
    categories: classes.filter((c) => c.startsWith("category-")).map((c) => c.slice(9)),
    tags: classes.filter((c) => c.startsWith("tag-")).map((c) => c.slice(4)),
    published: meta($, "property", "article:published_time"),
    modified: meta($, "property", "article:modified_time"),
    description: meta($, "name", "description") || meta($, "property", "og:description"),
    ogImage: meta($, "property", "og:image"),
    author: extractAuthor($),
    authorBox: extractAuthorBox($),
    pageDate: extractPageDate($),
    filedUnder: extractFiledUnder($, title),
    isRedirectStub: /window\.location\.href\s*=/.test(html) && html.length < 2000,
    capture,
    containerHtml: container ? cheerio.load("<div></div>")("div").append(container.clone()).html() : null,
    $,
    container,
  };
}

function meta($, attr, value) {
  const el = $(`meta[${attr}='${value}']`).first();
  const c = el.attr("content");
  return c && c.trim() ? c.trim() : null;
}

function pick(classes, re) {
  for (const c of classes) {
    const m = c.match(re);
    if (m) return Number(m[1]);
  }
  return null;
}

/** Verwijdert het site-achtervoegsel en de qTranslate-fallbackmarkering. */
export function cleanTitle(raw) {
  let t = raw;
  for (const suffix of TITLE_SUFFIXES) {
    if (t.endsWith(suffix)) { t = t.slice(0, -suffix.length); break; }
  }
  let isFallback = false;
  if (t.startsWith(FALLBACK_TITLE_PREFIX)) {
    isFallback = true;
    t = t.slice(FALLBACK_TITLE_PREFIX.length);
  }
  return { title: t.trim(), isFallback };
}

/**
 * Heuristiek voor de aaneengeplakte meertalige titels (ANALYSIS.md §3.6).
 * Markeert alleen; splitst niet — dat kan niet betrouwbaar automatisch.
 */
export function looksConcatenated(title) {
  if (!title) return false;
  if (/[Ѐ-ӿ]/.test(title)) return true;              // Cyrillisch in een Engelse titel
  return /[a-zà-ÿ][A-ZÀ-Þ]/.test(title);                       // kleine letter direct gevolgd door hoofdletter
}

function extractAuthor($) {
  const link = $(".entry-meta a[href*='/author/'], .entry-meta a[href*='author/']").first();
  const metaText = $(".entry-meta, .wpn_postinfo").first().text();
  const fromMeta = metaText.match(/Author\s*:\s*([^|\n]+?)(?:\s+Date\s*:|\s*$)/)
    || metaText.replace(/\s+/g, " ").match(/Posted by ([A-Z][^]{1,40}?) on [A-Z][a-z]+ \d/);
  const boxName = $(".saboxplugin-authorname").first().text().trim();

  let wpSlug = null;
  const href = link.attr("href");
  if (href) {
    const m = href.match(/author\/([^/]+)/);
    if (m) wpSlug = decodeURIComponent(m[1]);
  }

  // De entry-meta hoort bij deze post; de auteursbox is een widget die in
  // sommige thema's een vaste persoon toont. Daarom heeft entry-meta voorrang.
  const metaName = fromMeta ? fromMeta[1].trim() : null;
  let name = metaName || link.text().trim() || boxName || null;
  const boxMismatch = Boolean(boxName && metaName && boxName !== metaName);
  if (wpSlug && AUTHOR_OVERRIDES[wpSlug]) name = AUTHOR_OVERRIDES[wpSlug];

  return name || wpSlug ? { name, wpSlug, boxName: boxName || null, boxMismatch } : null;
}

/** Bio, avatar en website uit de Simple Author Box, voor het opschonen. */
function extractAuthorBox($) {
  const wrap = $("[class*=saboxplugin-wrap]").first();
  if (!wrap.length) return null;
  const bio = wrap.find(".saboxplugin-desc").text().replace(/\s+/g, " ").trim();
  const avatar = wrap.find("img").first().attr("src") || null;
  const website = wrap.find(".saboxplugin-web a").first().attr("href")
    || wrap.find("a[href^=http]").first().attr("href") || null;
  return { bio: bio || null, avatar, website };
}

/**
 * Datum uit de zichtbare pagina, voor captures zonder og-meta.
 * Twee formaten: modern "Date : June 20, 2009" en Simplista
 * "Posted by X on June 20th, 2009 at 2:46 pm".
 */
function extractPageDate($) {
  const text = $(".entry-meta, .wpn_postinfo").first().text().replace(/\s+/g, " ");
  const modern = text.match(/Date\s*:\s*([A-Z][a-z]+ \d{1,2}, \d{4})/);
  if (modern) return isoOrNull(modern[1]);
  const legacy = text.match(/on ([A-Z][a-z]+ \d{1,2})(?:st|nd|rd|th), (\d{4})(?: at (\d{1,2}):(\d{2}) ?(am|pm))?/i);
  if (legacy) {
    const [, md, year, hh, mm, ap] = legacy;
    let hour = hh ? Number(hh) % 12 : 0;
    if (ap && ap.toLowerCase() === "pm") hour += 12;
    return isoOrNull(`${md}, ${year} ${String(hour).padStart(2, "0")}:${mm || "00"}:00 UTC`);
  }
  return null;
}

function isoOrNull(s) {
  const d = new Date(/UTC$/.test(s) ? s : `${s} 00:00:00 UTC`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Simplista noteerde taxonomie als "Filed Under: Agile , Estimation , Scrum",
 * direct gevolgd door de posttitel en "Posted by ...". Beide worden afgekapt.
 */
export function extractFiledUnder($, title = "") {
  const text = $(".wpn_postinfo").first().text().replace(/\s+/g, " ");
  const m = text.match(/Filed Under:\s*(.*?)(?:\s*Posted by\b|$)/);
  if (!m) return [];
  let body = m[1].trim();
  if (title && body.endsWith(title)) body = body.slice(0, -title.length).trim();
  return body
    .split(/\s*,\s*/)
    .map((s) => s.trim())
    .filter((s) => s && s.length < 40 && !/^\d+ Comment/i.test(s) && !/\d{4} at \d/.test(s));
}
