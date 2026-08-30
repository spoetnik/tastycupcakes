#!/usr/bin/env node
/**
 * Fase 6 — URL- en SEO-validatie.
 * Bouwt de volledige URL-inventaris van de oude site uit de export, vergelijkt
 * die met de gebouwde site in dist/ plus de redirect-tabel, en controleert de
 * SEO-elementen op elke gegenereerde pagina.
 */
import fs from "node:fs";
import path from "node:path";
import { walk, toCsv } from "./util.js";

const EXPORT = "output";
const DIST = "dist";
const REDIRECTS = "migration/redirects.json";

const rel = (root, f) => path.relative(root, f).split(path.sep).join("/");

// ── oude URL's ────────────────────────────────────────────────────────────
function oldUrls() {
  const urls = new Map(); // url -> soort
  for (const file of walk(EXPORT)) {
    const r = rel(EXPORT, file);
    // Mappen die de crawler zelf aanmaakte; dit waren nooit URL's van de site.
    if (/^(web\.archive\.org|fonts\.(googleapis|gstatic)\.com)\//.test(r)) continue;
    if (r.endsWith("/index.html") || r === "index.html") {
      const dir = r.slice(0, -"index.html".length);
      urls.set(`/${dir}`, classify(`/${dir}`));
    } else {
      urls.set(`/${r}`, classify(`/${r}`));
    }
  }
  return urls;
}

function classify(url) {
  if (/^\/(es|fr|pt|ru)\//.test(url)) {
    const sub = url.replace(/^\/(es|fr|pt|ru)/, "");
    return `vertaald:${classify(sub)}`;
  }
  if (/^\/\d{4}\/\d{2}\/[^/]+\/$/.test(url)) return "artikel";
  if (/^\/\d{4}\/\d{2}\/[^/]+\/comment-page-\d+\/$/.test(url)) return "reactiepagina";
  if (/(^|\/)feed(\/|\.html$)/.test(url)) return "feed";
  if (/^\/\d{4}\/\d{2}\/[^/]+\/.+\/$/.test(url)) return "attachment";
  if (/^\/\d{4}\/(\d{2}\/)?$/.test(url)) return "datumarchief";
  if (/^\/category\/[^/]+\/page\/\d+\/$/.test(url)) return "categorie-paginering";
  if (/^\/category\//.test(url)) return "categorie";
  if (/^\/tag\/[^/]+\/page\/\d+\/$/.test(url)) return "tag-paginering";
  if (/^\/tag\//.test(url)) return "tag";
  if (/^\/author\//.test(url)) return "auteur";
  if (/^\/user\//.test(url)) return "gebruikersprofiel";
  if (/^\/page\/\d+\/$/.test(url)) return "home-paginering";
  if (/(^|\/)feed(\/|\.html$)/.test(url)) return "feed";
  if (/^\/wp-content\/uploads\//.test(url)) return "media";
  if (/^\/wp-(admin|json|includes|content|login)/.test(url)) return "wordpress-systeem";
  if (/^\/(web\.archive\.org|fonts\.)/.test(url)) return "crawler-artefact";
  if (url === "/") return "homepage";
  if (/\.[a-z0-9]{2,5}$/i.test(url)) return "bestand";
  return "pagina";
}

// ── nieuwe URL's ──────────────────────────────────────────────────────────
function newUrls() {
  const urls = new Set();
  for (const file of walk(DIST)) {
    const r = rel(DIST, file);
    if (r === "index.html") urls.add("/");
    else if (r.endsWith("/index.html")) urls.add(`/${r.slice(0, -"index.html".length)}`);
    else urls.add(`/${r}`);
  }
  return urls;
}

// ── redirects ─────────────────────────────────────────────────────────────
function loadRedirects() {
  const table = JSON.parse(fs.readFileSync(REDIRECTS, "utf8"));
  const patterns = table.patterns.map((p) => ({ ...p, re: new RegExp(p.match) }));
  return {
    lookup(url) {
      const exact = table.exact[url];
      if (exact) return { ...exact, via: "exact" };
      for (const p of patterns) {
        const m = url.match(p.re);
        if (m) {
          const to = p.to ? p.to.replace(/\$(\d)/g, (_, n) => m[Number(n)] ?? "") : null;
          return { to, status: p.status, reason: p.id, via: "patroon" };
        }
      }
      return null;
    },
    table,
  };
}

// ── SEO ───────────────────────────────────────────────────────────────────
function auditSeo(newSet) {
  const issues = [];
  const stats = { pages: 0, canonical: 0, description: 0, og: 0, h1one: 0 };
  for (const file of walk(DIST, (f) => f.endsWith(".html"))) {
    const r = rel(DIST, file);
    const url = r === "index.html" ? "/"
      : r.endsWith("/index.html") ? `/${r.slice(0, -"index.html".length)}`
      : `/${r}`;
    const html = fs.readFileSync(file, "utf8");
    stats.pages++;

    const title = decodeEntities(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? "");
    if (!title) issues.push({ severity: "FAIL", code: "titel-ontbreekt", url });
    else if (title.length > 70) issues.push({ severity: "WARNING", code: "titel-te-lang", url, detail: `${title.length} tekens` });

    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (!canonical) issues.push({ severity: "FAIL", code: "canonical-ontbreekt", url });
    else {
      stats.canonical++;
      const expected = `https://tastycupcakes.org${url}`;
      // De canonical hoort percent-encoded te zijn; vergelijk gedecodeerd.
      const same = canonical === expected || safeDecode(canonical) === expected;
      if (!same && !url.startsWith("/404")) {
        issues.push({ severity: "FAIL", code: "canonical-wijkt-af", url, detail: canonical });
      }
    }

    const descRaw = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    const desc = descRaw === undefined ? undefined : decodeEntities(descRaw);
    if (!desc) issues.push({ severity: "WARNING", code: "description-ontbreekt", url });
    else {
      stats.description++;
      if (desc.length > 165) issues.push({ severity: "WARNING", code: "description-te-lang", url, detail: `${desc.length}` });
    }

    const ogTitle = /<meta property="og:title"/.test(html);
    const ogUrl = /<meta property="og:url"/.test(html);
    const ogType = /<meta property="og:type"/.test(html);
    if (ogTitle && ogUrl && ogType) stats.og++;
    else issues.push({ severity: "FAIL", code: "open-graph-onvolledig", url });

    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 === 1) stats.h1one++;
    else issues.push({ severity: h1 === 0 ? "FAIL" : "WARNING", code: `h1-aantal-${h1}`, url });
  }
  return { issues, stats };
}

/** HTML-entities tellen als één teken, niet als hun bronvorm. */
function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

function safeDecode(s) {
  try { return decodeURI(s); } catch { return s; }
}

// ── main ──────────────────────────────────────────────────────────────────
const old = oldUrls();
const fresh = newUrls();
const redirects = loadRedirects();

const rows = [];
const summary = {};
const chains = {};
for (const [url, kind] of [...old.entries()].sort()) {
  let status, target = "", note = "";
  if (fresh.has(url)) {
    status = "EXACT";
    target = url;
  } else {
    // Een redirect mag via een tweede regel landen; dat werkt in de praktijk.
    // De ketenlengte wordt wel geteld, want elke extra hop kost linkwaarde.
    let cursor = url, hops = 0, last = null;
    const seen = new Set([url]);
    while (hops < 5) {
      const r = redirects.lookup(cursor);
      if (!r) break;
      last = r;
      hops++;
      if (r.status === 410 || !r.to) break;
      cursor = r.to;
      if (fresh.has(cursor) || seen.has(cursor)) break;
      seen.add(cursor);
    }
    chains[hops] = (chains[hops] || 0) + 1;
    if (!last) status = "ONTBREEKT";
    else if (last.status === 410) { status = "GONE"; note = last.reason; }
    else if (fresh.has(cursor)) { status = "REDIRECT"; target = cursor; note = `301 · ${hops} hop${hops > 1 ? "s" : ""}`; }
    else { status = "REDIRECT-DOELWIT-WEG"; target = cursor; note = `${hops} hops`; }
  }
  rows.push({ old: url, new: target, kind, status, note });
  summary[kind] ??= {};
  summary[kind][status] = (summary[kind][status] || 0) + 1;
}

// hygiëne-controles
const hygiene = [];
const noSlash = [...old.keys()].filter((u) => !u.endsWith("/") && !/\.[a-z0-9]{2,5}$/i.test(u));
if (noSlash.length) hygiene.push({ code: "url-zonder-trailing-slash", count: noSlash.length, sample: noSlash.slice(0, 3) });

const lower = new Map();
for (const u of old.keys()) {
  const k = u.toLowerCase();
  if (lower.has(k) && lower.get(k) !== u) hygiene.push({ code: "case-verschil", a: lower.get(k), b: u });
  lower.set(k, u);
}
const encoded = [...old.keys()].filter((u) => /%[0-9a-f]{2}/i.test(u));
const nonAscii = [...old.keys()].filter((u) => /[^\x20-\x7e]/.test(u));

const dupNew = [];
const seenLower = new Map();
for (const u of fresh) {
  const k = u.toLowerCase();
  if (seenLower.has(k) && seenLower.get(k) !== u) dupNew.push([seenLower.get(k), u]);
  seenLower.set(k, u);
}

const seo = auditSeo(fresh);

const result = {
  counts: {
    oldUrls: old.size,
    newUrls: fresh.size,
    exact: rows.filter((r) => r.status === "EXACT").length,
    redirect: rows.filter((r) => r.status === "REDIRECT").length,
    gone: rows.filter((r) => r.status === "GONE").length,
    redirectBroken: rows.filter((r) => r.status === "REDIRECT-DOELWIT-WEG").length,
    missing: rows.filter((r) => r.status === "ONTBREEKT").length,
  },
  perKind: summary,
  chains,
  hygiene: { checks: hygiene, encodedUrls: encoded.length, nonAsciiUrls: nonAscii.length, duplicateCaseNew: dupNew.length },
  seo: seo.stats,
  seoIssues: seo.issues,
  missing: rows.filter((r) => r.status === "ONTBREEKT"),
  redirectBroken: rows.filter((r) => r.status === "REDIRECT-DOELWIT-WEG"),
};

fs.writeFileSync("migration/url-audit.json", JSON.stringify(result, null, 2) + "\n");
fs.writeFileSync("migration/url-inventory.csv", toCsv(rows, ["old", "new", "kind", "status", "note"]));

console.log("\n── URL-inventaris ──────────────────────────────");
console.log(`  oude URL's: ${old.size}   nieuwe URL's: ${fresh.size}`);
for (const [k, v] of Object.entries(result.counts).slice(2)) console.log(`  ${k.padEnd(16)} ${v}`);
console.log("\n── Per soort ───────────────────────────────────");
for (const kind of Object.keys(summary).sort()) {
  console.log(`  ${kind.padEnd(26)} ${JSON.stringify(summary[kind])}`);
}
console.log("\n── Redirect-ketens ─────────────────────────────");
for (const k of Object.keys(chains).sort()) console.log(`  ${k} hop(s): ${chains[k]}`);
console.log("\n── Hygiëne ─────────────────────────────────────");
console.log(`  URL-encoding in oude URL's: ${encoded.length}   niet-ASCII: ${nonAscii.length}`);
console.log(`  case-conflicten nieuw: ${dupNew.length}`);
for (const h of hygiene.slice(0, 5)) console.log(`  ${JSON.stringify(h)}`);
console.log("\n── SEO ─────────────────────────────────────────");
console.log(`  pagina's ${seo.stats.pages}  canonical ${seo.stats.canonical}  description ${seo.stats.description}  OG ${seo.stats.og}  exact één h1 ${seo.stats.h1one}`);
const byCode = {};
for (const i of seo.issues) byCode[`${i.severity} ${i.code}`] = (byCode[`${i.severity} ${i.code}`] || 0) + 1;
for (const k of Object.keys(byCode).sort()) console.log(`  ${String(byCode[k]).padStart(5)}  ${k}`);
const fails = seo.issues.filter((i) => i.severity === "FAIL").length + result.counts.missing + result.counts.redirectBroken;
console.log(`\n  FAILs totaal: ${fails}\n`);
process.exitCode = fails ? 1 : 0;
