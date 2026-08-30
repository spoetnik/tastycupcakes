#!/usr/bin/env node
/**
 * Fase 7 — contentvergelijking oud vs. nieuw.
 * Vergelijkt per pagina de tekst en de structurele elementen van de
 * WordPress-export met de gebouwde Astro-pagina. Vergelijkt bewust ná het
 * verwijderen van de blokken die we opzettelijk hebben weggehaald
 * (auteursbox, reactiewidget), zodat alleen echt verlies overblijft.
 */
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import yaml from "js-yaml";
import { walk, toCsv } from "./util.js";
import { STRIP_SELECTORS, CONTENT_SELECTORS, NON_CONTENT_IMAGE } from "./config.js";

const words = (s) => (s.replace(/\s+/g, " ").trim().match(/[\p{L}\p{N}]+/gu) || []).length;

function oldContent(file) {
  if (!fs.existsSync(file)) return null;
  const $ = cheerio.load(fs.readFileSync(file, "utf8"));
  let node = null;
  for (const sel of CONTENT_SELECTORS) {
    const n = $(sel).first();
    if (n.length) { node = n; break; }
  }
  if (!node) return null;
  node.find(STRIP_SELECTORS.join(",")).remove();
  node.find("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    if (NON_CONTENT_IMAGE.some((re) => re.test(src))) $(el).remove();
  });
  return measure($, node);
}

function newContent(file) {
  if (!fs.existsSync(file)) return null;
  const $ = cheerio.load(fs.readFileSync(file, "utf8"));
  const node = $("article.prose").first();
  if (!node.length) return null;
  // Onderdelen die het thema toevoegt, tellen niet als bron-content.
  node.find("h1, .meta, .badges, .author-box, .lang-switch").remove();
  return measure($, node);
}

function measure($, node) {
  return {
    words: words(node.text()),
    headings: node.find("h1,h2,h3,h4,h5,h6").length,
    images: node.find("img").length,
    links: node.find("a[href]").length,
    lists: node.find("ul,ol").length,
    listItems: node.find("li").length,
    tables: node.find("table").length,
    blockquotes: node.find("blockquote").length,
    captions: node.find("figcaption, .wp-caption-text").length,
    iframes: node.find("iframe").length,
    pre: node.find("pre").length,
  };
}

const KEYS = ["words", "headings", "images", "links", "lists", "listItems", "tables", "blockquotes", "captions", "iframes", "pre"];

// Alle gemigreerde posts en pagina's aflopen.
const rows = [];
for (const sub of ["posts", "pages"]) {
  for (const md of walk(`src/content/${sub}`, (f) => f.endsWith(".md"))) {
    const fm = yaml.load(fs.readFileSync(md, "utf8").match(/^---\n([\s\S]*?)\n---/)[1]);
    const source = fm.wordpress?.sourceFile;
    if (!source) continue;
    const before = oldContent(source);
    const after = newContent(path.join("dist", fm.permalink, "index.html"));
    if (!before || !after) {
      rows.push({ permalink: fm.permalink, status: !before ? "bron onleesbaar" : "output ontbreekt" });
      continue;
    }
    const delta = Object.fromEntries(KEYS.map((k) => [k, after[k] - before[k]]));
    const wordLoss = before.words ? (before.words - after.words) / before.words : 0;
    rows.push({
      permalink: fm.permalink,
      status: "ok",
      ...Object.fromEntries(KEYS.map((k) => [`${k}_oud`, before[k]])),
      ...Object.fromEntries(KEYS.map((k) => [`${k}_nieuw`, after[k]])),
      wordLossPct: Math.round(wordLoss * 1000) / 10,
      delta,
    });
  }
}

const ok = rows.filter((r) => r.status === "ok");
const summary = { pages: ok.length, problems: rows.length - ok.length };
for (const k of KEYS) {
  summary[k] = {
    oud: ok.reduce((a, r) => a + r[`${k}_oud`], 0),
    nieuw: ok.reduce((a, r) => a + r[`${k}_nieuw`], 0),
  };
}

const lost = ok.filter((r) => r.wordLossPct > 2).sort((a, b) => b.wordLossPct - a.wordLossPct);
const gained = ok.filter((r) => r.wordLossPct < -2).sort((a, b) => a.wordLossPct - b.wordLossPct);
const structural = ok
  .map((r) => ({ permalink: r.permalink, ...r.delta }))
  .filter((r) => KEYS.some((k) => k !== "words" && k !== "headings" && r[k] < 0));

fs.writeFileSync("migration/content-diff.json", JSON.stringify({ summary, lost, gained, structural }, null, 2) + "\n");
fs.writeFileSync(
  "migration/content-diff.csv",
  toCsv(
    ok.map((r) => ({ permalink: r.permalink, woorden_oud: r.words_oud, woorden_nieuw: r.words_nieuw, verlies_pct: r.wordLossPct,
      afb_oud: r.images_oud, afb_nieuw: r.images_nieuw, links_oud: r.links_oud, links_nieuw: r.links_nieuw,
      tabellen_oud: r.tables_oud, tabellen_nieuw: r.tables_nieuw })),
    ["permalink", "woorden_oud", "woorden_nieuw", "verlies_pct", "afb_oud", "afb_nieuw", "links_oud", "links_nieuw", "tabellen_oud", "tabellen_nieuw"],
  ),
);

console.log(`\nvergeleken: ${summary.pages} pagina's (${summary.problems} niet vergelijkbaar)\n`);
console.log("element        oud     nieuw   verschil");
for (const k of KEYS) {
  const { oud, nieuw } = summary[k];
  const d = nieuw - oud;
  console.log(`  ${k.padEnd(12)} ${String(oud).padStart(6)} ${String(nieuw).padStart(8)} ${(d > 0 ? "+" : "") + d}`);
}
console.log(`\npagina's met >2% tekstverlies: ${lost.length}`);
lost.slice(0, 10).forEach((r) => console.log(`  ${String(r.wordLossPct).padStart(5)}%  ${r.permalink}  (${r.words_oud} → ${r.words_nieuw})`));
console.log(`\npagina's met >2% méér tekst: ${gained.length}`);
gained.slice(0, 5).forEach((r) => console.log(`  ${String(r.wordLossPct).padStart(6)}%  ${r.permalink}  (${r.words_oud} → ${r.words_nieuw})`));
console.log(`\npagina's die structurele elementen verloren: ${structural.length}`);
structural.slice(0, 10).forEach((r) => console.log(`  ${r.permalink}  ${JSON.stringify(Object.fromEntries(Object.entries(r).filter(([k, v]) => k !== "permalink" && v < 0)))}`));
