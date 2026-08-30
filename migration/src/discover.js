import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { cleanTitle } from "./extract.js";
import { LANGS, DROPPED_PAGES } from "./config.js";

const POST_RE = /^(\d{4})\/(\d{2})\/([^/]+)\/index\.html$/;

/**
 * Vindt alle bronbestanden in de export en classificeert ze.
 * Slaat niets stilzwijgend over: alles wat op een post lijkt maar niet
 * bruikbaar is, komt terug met een reden.
 */
/** Namen uit de auteur-archieven; nodig voor auteurs die alleen gelinkt worden. */
export function authorArchiveNames(exportRoot) {
  const dir = path.join(exportRoot, "author");
  const out = new Map();
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!e.isDirectory()) continue;
    const file = path.join(dir, e.name, "index.html");
    if (!fs.existsSync(file)) continue;
    const $ = cheerio.load(fs.readFileSync(file, "utf8"));
    let name = ($(".page-title").first().text() || $("h1").first().text() || "").trim();
    if (!name) name = cleanTitle($("title").first().text() || "").title;
    name = name.replace(/^Author\s*:?\s*/i, "").replace(/\s+/g, " ").trim();
    // Onbruikbare naam uit een kapotte capture: dan is de slug eerlijker.
    out.set(e.name, name.length >= 2 && /[a-zA-Z]/.test(name) ? name : e.name);
  }
  return out;
}

export function discover(exportRoot) {
  const posts = [];
  const pages = [];
  const attachments = [];
  const skipped = [];

  const rels = listHtml(exportRoot);
  const byRel = new Set(rels);

  for (const rel of rels) {
    const parts = rel.split("/");
    const lang = LANGS.includes(parts[0]) ? parts[0] : "en";
    const sub = lang === "en" ? rel : parts.slice(1).join("/");

    const m = sub.match(POST_RE);
    if (m) {
      posts.push({
        kind: "post", lang, sourceRel: rel,
        year: m[1], month: m[2], slug: m[3],
        permalink: lang === "en" ? `/${m[1]}/${m[2]}/${m[3]}/` : `/${lang}/${m[1]}/${m[2]}/${m[3]}/`,
        key: `${m[1]}/${m[2]}/${m[3]}`,
        recovery: findRecovery(byRel, lang, m),
      });
      continue;
    }

    // Attachmentpagina's staan genest onder de post: /YYYY/MM/<post>/<attachment>/
    const att = sub.match(/^(\d{4})\/(\d{2})\/([^/]+)\/(.+)\/index\.html$/);
    if (att) {
      attachments.push({
        sourceRel: rel, lang,
        from: lang === "en" ? `/${sub.replace(/index\.html$/, "")}` : `/${lang}/${sub.replace(/index\.html$/, "")}`,
        to: lang === "en" ? `/${att[1]}/${att[2]}/${att[3]}/` : `/${lang}/${att[1]}/${att[2]}/${att[3]}/`,
      });
      continue;
    }

    if (lang !== "en") continue;                       // vertaalde pagina's volgen de EN-pagina
    if (isArchiveOrSystem(sub)) continue;

    const slug = sub.replace(/\/?index\.html$/, "");
    if (!slug || DROPPED_PAGES.has(slug)) {
      if (DROPPED_PAGES.has(slug)) skipped.push({ rel, reason: "pagina vervalt volgens CONTENT-MODEL.md §4" });
      continue;
    }
    pages.push({
      kind: "page", lang, sourceRel: rel, slug,
      permalink: `/${slug}/`, key: slug,
    });
  }

  // Post-URL's waarvan de canonieke index.html nooit is gecrawld. Zonder deze
  // stap verdwijnen ze zonder melding; met comment-page als bron zijn ze te
  // herstellen.
  const seen = new Set(posts.map((p) => `${p.lang}:${p.key}`));
  for (const rel of rels) {
    const m = rel.match(/^(?:(es|fr|pt|ru)\/)?(\d{4})\/(\d{2})\/([^/]+)\/comment-page-\d+\/index\.html$/);
    if (!m) continue;
    const [, langPrefix, year, month, slug] = m;
    const lang = langPrefix || "en";
    const key = `${year}/${month}/${slug}`;
    if (seen.has(`${lang}:${key}`)) continue;
    if (byRel.has(`${lang === "en" ? "" : lang + "/"}${key}/index.html`)) continue;
    seen.add(`${lang}:${key}`);
    posts.push({
      kind: "post", lang, sourceRel: rel, year, month, slug,
      permalink: lang === "en" ? `/${key}/` : `/${lang}/${key}/`,
      key, recovery: rel, missingCanonical: true,
    });
  }

  return {
    posts: posts.sort((a, b) => a.sourceRel.localeCompare(b.sourceRel)),
    pages: pages.sort((a, b) => a.sourceRel.localeCompare(b.sourceRel)),
    attachments: attachments.sort((a, b) => a.from.localeCompare(b.from)),
    authorArchives: authorDirs(exportRoot, ""),
    // Auteurarchieven die alleen in een vertaalde crawl staan; het Engelse
    // archief is daar nooit van gecrawld.
    langAuthorArchives: Object.fromEntries(LANGS.map((l) => [l, authorDirs(exportRoot, l)])),
    tagArchives: fs.existsSync(path.join(exportRoot, "tag"))
      ? fs.readdirSync(path.join(exportRoot, "tag"), { withFileTypes: true })
          .filter((e) => e.isDirectory()).map((e) => e.name).sort()
      : [],
    skipped,
    allHtml: byRel,
  };
}

/** Voor dode captures: bestaat er een comment-page-variant met echte content? */
function findRecovery(byRel, lang, m) {
  const base = lang === "en" ? "" : `${lang}/`;
  for (let n = 1; n <= 3; n++) {
    const cand = `${base}${m[1]}/${m[2]}/${m[3]}/comment-page-${n}/index.html`;
    if (byRel.has(cand)) return cand;
  }
  return null;
}

function authorDirs(exportRoot, lang) {
  const dir = path.join(exportRoot, lang, "author");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory()).map((e) => e.name).sort();
}

function isArchiveOrSystem(sub) {
  return (
    /^(category|tag|author|user|page|comments|feed|wp-admin|wp-json|wp-includes|wp-content|web\.archive\.org|fonts\.)/.test(sub) ||
    /(^|\/)feed\/index\.html$/.test(sub) ||
    /(^|\/)comment-page-\d+\/index\.html$/.test(sub) ||
    /(^|\/)page\/\d+\/index\.html$/.test(sub)
  );
}

function listHtml(root) {
  const out = [];
  (function rec(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) rec(full);
      else if (e.name.endsWith(".html")) out.push(path.relative(root, full).split(path.sep).join("/"));
    }
  })(root);
  return out.sort();
}
