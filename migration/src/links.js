import path from "node:path";
import { SITE_HOSTS, UPLOADS_PREFIX, MEDIA_PREFIX } from "./config.js";

const ARCHIVE_RE = /^https?:\/\/web\.archive\.org\/web\/\d{8,14}(?:[a-z]{2}_)?\/(https?:\/\/.+)$/i;

/**
 * Haalt de originele URL uit een Wayback-replay-URL.
 * De crawler heeft externe links en embeds hierin verpakt; de originele
 * bestemming staat er nog in en is dus terug te winnen (ANALYSIS.md §3.4).
 */
export function unwrapArchiveUrl(url) {
  const m = String(url).match(ARCHIVE_RE);
  if (!m) return null;
  let inner = m[1];
  // Geneste replays komen voor.
  let next;
  while ((next = inner.match(ARCHIVE_RE))) inner = next[1];
  return inner;
}

/** Site-absoluut pad uit een URL van het eigen domein, anders null. */
export function siteAbsolute(url) {
  try {
    const u = new URL(url);
    if (!SITE_HOSTS.includes(u.hostname)) return null;
    return normalisePath(u.pathname);
  } catch {
    return null;
  }
}

/** `/2012/11/delight/` — altijd met leidende en afsluitende slash. */
export function normalisePath(p) {
  let out = p.split("#")[0].split("?")[0];
  out = out.replace(/index\.html?$/i, "");
  if (!out.startsWith("/")) out = "/" + out;
  if (!/\.[a-z0-9]{2,5}$/i.test(out) && !out.endsWith("/")) out += "/";
  return out.replace(/\/{2,}/g, "/");
}

/**
 * Lost een href/src op tegen de map van het bronbestand.
 * @param {string} href    waarde uit de HTML
 * @param {string} sourceRel  pad van het bronbestand t.o.v. de exportroot
 * @returns {{kind:"internal"|"external"|"anchor"|"mailto"|"upload", value:string, original?:string}}
 */
export function resolveRef(href, sourceRel) {
  const raw = String(href || "").trim();
  if (!raw) return { kind: "anchor", value: "" };
  if (raw.startsWith("#")) return { kind: "anchor", value: raw };
  if (/^(mailto|tel):/i.test(raw)) return { kind: "mailto", value: raw };
  if (raw.startsWith("data:")) return { kind: "external", value: raw };

  const unwrapped = unwrapArchiveUrl(raw);
  if (unwrapped) {
    const internal = siteAbsolute(unwrapped);
    if (internal) return uploadOrInternal(internal, raw);
    return { kind: "external", value: unwrapped, original: raw };
  }

  if (/^https?:\/\//i.test(raw)) {
    const internal = siteAbsolute(raw);
    if (internal) return uploadOrInternal(internal, raw);
    return { kind: "external", value: raw };
  }
  if (raw.startsWith("//")) return { kind: "external", value: "https:" + raw };

  // Relatief pad: oplossen tegen de map van het bronbestand.
  const baseDir = path.posix.dirname(sourceRel.split(path.sep).join("/"));
  const resolved = path.posix.normalize(path.posix.join(baseDir, raw));
  return uploadOrInternal(normalisePath(resolved), raw);
}

function uploadOrInternal(p, original) {
  const clean = p.replace(/^\//, "");
  if (clean.startsWith(UPLOADS_PREFIX)) {
    return { kind: "upload", value: clean, original };
  }
  return { kind: "internal", value: p, original };
}

/** `wp-content/uploads/2015/03/x.png` -> `/media/2015/03/x.png` */
export function uploadToMedia(uploadPath) {
  return MEDIA_PREFIX + uploadPath.slice(UPLOADS_PREFIX.length);
}
