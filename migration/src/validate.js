#!/usr/bin/env node
/**
 * Onafhankelijke validatie van het migratieresultaat.
 * Telt zelf opnieuw uit de export en uit de output; gebruikt bewust NIET het
 * rapport van de migrator, zodat een fout in de migrator hier zichtbaar wordt.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { walk } from "./util.js";
import { LANGS, VARIANT_RE, IMAGE_EXT, DOWNLOAD_EXT, UPLOADS_PREFIX, CATEGORY_NAMES } from "./config.js";

const EXPORT = path.resolve(process.argv.includes("--export") ? process.argv[process.argv.indexOf("--export") + 1] : "output");
const OUT = path.resolve(process.argv.includes("--dest") ? process.argv[process.argv.indexOf("--dest") + 1] : "migration/out");
const REDIRECTS = path.resolve("migration/redirects.json");

const POST_RE = /^(\d{4})\/(\d{2})\/([^/]+)\/index\.html$/;
const rel = (root, f) => path.relative(root, f).split(path.sep).join("/");

// ── bron tellen ───────────────────────────────────────────────────────────
function scanSource() {
  const html = walk(EXPORT, (f) => f.endsWith(".html")).map((f) => rel(EXPORT, f));
  const posts = { en: new Set(), es: new Set(), fr: new Set(), pt: new Set(), ru: new Set() };
  const pageCandidates = new Set();
  const attachments = new Set();
  const commentPages = new Set();
  const feeds = new Set();

  for (const r of html) {
    const parts = r.split("/");
    const lang = LANGS.includes(parts[0]) ? parts[0] : "en";
    const sub = lang === "en" ? r : parts.slice(1).join("/");

    if (POST_RE.test(sub)) { posts[lang].add(sub.replace(/\/index\.html$/, "")); continue; }
    const viaComment = sub.match(/^(\d{4}\/\d{2}\/[^/]+)\/comment-page-\d+\/index\.html$/);
    if (viaComment) { posts[lang].add(viaComment[1]); commentPages.add(r); continue; }
    if (/(^|\/)feed(\/index\.html|\.html)$/.test(sub)) { feeds.add(r); continue; }
    if (/(^|\/)comment-page-\d+\/index\.html$/.test(sub)) { commentPages.add(r); continue; }
    if (/^\d{4}\/\d{2}\/[^/]+\/.+\/index\.html$/.test(sub)) { attachments.add(r); continue; }
    if (lang !== "en") continue;
    if (/^(category|tag|author|user|page|comments|wp-admin|wp-json|wp-includes|wp-content|web\.archive\.org|fonts\.)/.test(sub)) continue;
    if (/(^|\/)page\/\d+\/index\.html$/.test(sub)) continue;
    pageCandidates.add(sub.replace(/\/?index\.html$/, "") || "(home)");
  }

  const dirs = (p) => (fs.existsSync(path.join(EXPORT, p))
    ? fs.readdirSync(path.join(EXPORT, p), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
    : []);

  const uploads = walk(path.join(EXPORT, UPLOADS_PREFIX)).map((f) => rel(EXPORT, f));
  const images = uploads.filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()));
  const downloads = uploads.filter((f) => DOWNLOAD_EXT.has(path.extname(f).toLowerCase()));
  const variants = images.filter((f) => VARIANT_RE.test(path.basename(f)));
  const originals = images.filter((f) => !VARIANT_RE.test(path.basename(f)));
  const variantsWithOriginal = variants.filter((f) => {
    const m = path.basename(f).match(VARIANT_RE);
    return images.includes(`${path.posix.dirname(f)}/${m[1]}${m[4]}`);
  });

  return {
    htmlFiles: html.length,
    posts, pageCandidates, attachments, commentPages, feeds,
    authorArchives: dirs("author"),
    categoryArchives: dirs("category"),
    tagArchives: dirs("tag"),
    userPages: dirs("user"),
    media: { uploads: uploads.length, images: images.length, downloads: downloads.length, variants: variants.length, originals: originals.length, variantsWithOriginal: variantsWithOriginal.length },
  };
}

// ── output lezen ──────────────────────────────────────────────────────────
function readCollection(sub) {
  const dir = path.join(OUT, "src/content", sub);
  if (!fs.existsSync(dir)) return [];
  return walk(dir, (f) => f.endsWith(".md")).map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    return {
      file: rel(path.join(OUT, "src/content"), file),
      raw,
      frontmatter: m ? yaml.load(m[1]) : null,
      body: m ? m[2] : null,
      parseError: m ? null : "geen geldige frontmatter-blokken",
    };
  });
}

// ── validatie ─────────────────────────────────────────────────────────────
function main() {
  const issues = [];
  const add = (severity, code, subject, detail) => issues.push({ severity, code, subject, detail });

  const src = scanSource();
  const posts = readCollection("posts");
  const pages = readCollection("pages");
  const authors = readCollection("authors");
  const redirects = JSON.parse(fs.readFileSync(REDIRECTS, "utf8"));
  const categories = JSON.parse(fs.readFileSync(path.join(OUT, "src/data/categories.json"), "utf8"));

  // 2. markdown
  for (const item of [...posts, ...pages, ...authors]) {
    if (item.parseError) { add("FAIL", "markdown-onleesbaar", item.file, item.parseError); continue; }
    if (item.body !== null && !item.body.trim() && !item.file.startsWith("authors/")) {
      add("FAIL", "lege-body", item.file, "geen inhoud onder de frontmatter");
    }
    if (/�/.test(item.raw)) add("WARNING", "vervangingsteken", item.file, "U+FFFD in de tekst, mogelijk coderingsverlies");
    // Alleen relatieve verwijzingen zijn fout; een externe URL op een ander
    // domein mag wp-content/uploads in het pad hebben.
    const unrewritten = (item.body || "").match(/(?:\]\(|src=")(?!https?:\/\/)[^)"]*wp-content\/uploads[^)"]*/);
    if (unrewritten) add("FAIL", "onherschreven-pad", item.file, unrewritten[0].slice(0, 80));
    if (/web\.archive\.org/.test(item.body || "")) add("WARNING", "archief-url-in-body", item.file, "web.archive.org staat nog in de body");
    if (/saboxplugin|um-avatar|MsoNormal|Apple-style-span/.test(item.body || "")) {
      add("FAIL", "plugin-markup", item.file, "WordPress-plugin-markup niet verwijderd");
    }
  }

  // 3. frontmatter
  const REQUIRED_POST = ["title", "slug", "permalink", "lang", "date", "dateSource", "categories", "tags", "draft"];
  const permalinks = new Map();
  const slugsPerLang = new Map();
  for (const p of posts) {
    const fm = p.frontmatter;
    if (!fm) continue;
    for (const key of REQUIRED_POST) {
      if (fm[key] === undefined) add("FAIL", "veld-ontbreekt", p.file, key);
    }
    if (!fm.title || !String(fm.title).trim()) add("FAIL", "titel-leeg", p.file, "");
    if (fm.lang && !["en", ...LANGS].includes(fm.lang)) add("FAIL", "taal-ongeldig", p.file, String(fm.lang));
    if (fm.dateSource && !["meta", "page", "url"].includes(fm.dateSource)) add("FAIL", "datesource-ongeldig", p.file, String(fm.dateSource));
    const d = new Date(fm.date);
    if (Number.isNaN(d.getTime())) add("FAIL", "datum-ongeldig", p.file, String(fm.date));
    else if (d < new Date("2005-01-01") || d > new Date()) add("FAIL", "datum-buiten-bereik", p.file, d.toISOString());
    if (fm.updated && Number.isNaN(new Date(fm.updated).getTime())) add("FAIL", "updated-ongeldig", p.file, String(fm.updated));
    if (fm.permalink && !/^\/([a-z]{2}\/)?\d{4}\/\d{2}\/[^/]+\/$/.test(fm.permalink)) {
      add("FAIL", "permalink-vorm", p.file, String(fm.permalink));
    }
    if (permalinks.has(fm.permalink)) add("FAIL", "permalink-dubbel", p.file, `ook ${permalinks.get(fm.permalink)}`);
    else permalinks.set(fm.permalink, p.file);

    const key = `${fm.lang}:${fm.slug}`;
    if (slugsPerLang.has(key)) add("FAIL", "slug-dubbel", p.file, `${key} ook in ${slugsPerLang.get(key)}`);
    else slugsPerLang.set(key, p.file);

    const expected = `posts/${fm.lang}/${fm.permalink.replace(/^\/(es|fr|pt|ru)\//, "/").replace(/^\//, "").replace(/\/$/, "")}.md`;
    if (p.file !== expected) add("FAIL", "pad-wijkt-af", p.file, `verwacht ${expected}`);
  }
  for (const pg of pages) {
    const fm = pg.frontmatter;
    if (!fm) continue;
    for (const key of ["title", "slug", "permalink", "lang", "draft"]) {
      if (fm[key] === undefined) add("FAIL", "veld-ontbreekt", pg.file, key);
    }
    if (permalinks.has(fm.permalink)) add("FAIL", "permalink-dubbel", pg.file, `ook ${permalinks.get(fm.permalink)}`);
    else permalinks.set(fm.permalink, pg.file);
  }

  // 4. relaties
  const authorSlugs = new Set(authors.map((a) => a.frontmatter?.slug).filter(Boolean));
  const categorySlugs = new Set(categories.map((c) => c.slug));
  for (const p of [...posts, ...pages]) {
    const fm = p.frontmatter;
    if (!fm) continue;
    if (fm.author && !authorSlugs.has(fm.author)) add("FAIL", "auteur-onbekend", p.file, fm.author);
    for (const c of fm.categories || []) if (!categorySlugs.has(c)) add("FAIL", "categorie-onbekend", p.file, c);
    if (fm.translationOf && !permalinks.has(fm.translationOf)) {
      add("WARNING", "vertaling-zonder-origineel", p.file, fm.translationOf);
    }
  }
  for (const a of authors) {
    const fm = a.frontmatter;
    if (!fm) continue;
    for (const key of ["name", "slug", "wordpressSlugs"]) if (fm[key] === undefined) add("FAIL", "veld-ontbreekt", a.file, key);
    if (fm.avatar && !fs.existsSync(path.join(OUT, "public", fm.avatar))) add("FAIL", "avatar-ontbreekt", a.file, fm.avatar);
  }

  // 5. media
  const mediaRefs = { local: new Set(), external: new Set(), missing: new Set() };
  const mediaFiles = new Set(walk(path.join(OUT, "public")).map((f) => "/" + rel(path.join(OUT, "public"), f)));
  for (const p of [...posts, ...pages]) {
    const refs = [...(p.body || "").matchAll(/!\[[^\]]*\]\(([^)\s]+)/g), ...(p.body || "").matchAll(/<img[^>]+src="([^"]+)"/g)]
      .map((m) => m[1]);
    const fmImg = p.frontmatter?.featuredImage?.src;
    if (fmImg) refs.push(fmImg);
    for (const r of refs) {
      if (/^https?:\/\//.test(r)) { mediaRefs.external.add(r); continue; }
      if (mediaFiles.has(r)) mediaRefs.local.add(r);
      else { mediaRefs.missing.add(r); add("WARNING", "media-ontbreekt", p.file, r); }
    }
  }

  // 6+7. URL's en interne links
  const known = new Set([...permalinks.keys(), "/", "/rss.xml",
    ...[...authorSlugs].map((s) => `/author/${s}/`),
    ...[...categorySlugs].map((s) => `/category/${s}/`)]);
  for (const p of posts) for (const t of p.frontmatter?.tags || []) known.add(`/tag/${t}/`);

  const resolves = (t) => {
    if (known.has(t)) return true;
    const hit = redirects.exact[t];
    if (hit) return hit.status === 410 ? true : known.has(hit.to);
    return redirects.patterns.some((pt) => new RegExp(pt.match).test(t));
  };

  const links = { internal: 0, external: 0, broken: [] };
  for (const p of [...posts, ...pages]) {
    for (const m of (p.body || "").matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      const href = m[1];
      if (/^https?:\/\//.test(href)) { links.external++; continue; }
      if (href.startsWith("#") || href.startsWith("mailto:")) continue;
      links.internal++;
      const target = href.split("#")[0];
      // Een link naar een mediabestand toetsen we aan de mediabestanden,
      // niet aan de pagina-URL's.
      if (/^\/(media|downloads)\//.test(target)) {
        if (!mediaFiles.has(target)) links.broken.push({ file: p.file, target, kind: "media" });
        continue;
      }
      if (!resolves(target)) links.broken.push({ file: p.file, target, kind: "page" });
    }
  }

  // redirect-consistentie
  for (const [from, r] of Object.entries(redirects.exact)) {
    if (r.status !== 410 && !known.has(r.to) && !redirects.exact[r.to]) {
      add("FAIL", "redirect-naar-niets", from, String(r.to));
    }
    if (known.has(from)) add("FAIL", "redirect-overschrijft-pagina", from, "deze URL bestaat ook als content");
  }

  // ── reconciliatie ───────────────────────────────────────────────────────
  const migrated = {
    posts: Object.fromEntries(["en", ...LANGS].map((l) => [l, posts.filter((p) => p.frontmatter?.lang === l).length])),
    pages: pages.length,
    authors: authors.length,
    categories: categories.length,
    tags: new Set(posts.flatMap((p) => p.frontmatter?.tags || [])).size,
  };

  // Reconciliatie per URL: elke bron-URL is gemigreerd, geredirect, of onverklaard.
  const reconciliation = {};
  let unexplained = 0;
  for (const lang of ["en", ...LANGS]) {
    const outSet = new Set(posts.filter((p) => p.frontmatter?.lang === lang).map((p) => p.frontmatter.permalink));
    const row = { source: src.posts[lang].size, migrated: outSet.size, redirected: 0, gone: 0, unexplained: [] };
    for (const key of src.posts[lang]) {
      const permalink = lang === "en" ? `/${key}/` : `/${lang}/${key}/`;
      if (outSet.has(permalink)) continue;
      const r = redirects.exact[permalink];
      if (r && r.status === 301) row.redirected++;
      else if (r && r.status === 410) row.gone++;
      else row.unexplained.push(permalink);
    }
    unexplained += row.unexplained.length;
    for (const u of row.unexplained) add("FAIL", "post-onverklaard-weg", u, `taal ${lang}`);
    reconciliation[lang] = row;
  }

  const pageOut = new Set(pages.map((p) => p.frontmatter?.permalink));
  const pageRows = [...src.pageCandidates].sort().map((slug) => {
    const permalink = slug === "(home)" ? "/" : `/${slug}/`;
    const r = redirects.exact[permalink];
    const status = pageOut.has(permalink) ? "gemigreerd"
      : r ? `redirect ${r.status}`
      : "NIET GEMIGREERD";
    return { slug, permalink, status };
  });
  for (const p of pageRows) {
    if (p.status === "NIET GEMIGREERD") add("WARNING", "pagina-niet-gemigreerd", p.permalink, "geen bestand en geen redirect");
  }

  const usedTags = new Set(posts.flatMap((p) => p.frontmatter?.tags || []));
  const orphanTags = src.tagArchives.filter((t) => !usedTags.has(t));
  const authorSlugSet = new Set(authors.map((a) => a.frontmatter?.slug));
  const authorWpSlugs = new Set(authors.flatMap((a) => a.frontmatter?.wordpressSlugs || []));
  const archivesWithoutAuthor = src.authorArchives.filter((a) => !authorWpSlugs.has(a));
  const authorsWithoutArchive = authors
    .filter((a) => !(a.frontmatter?.wordpressSlugs || []).some((w) => src.authorArchives.includes(w)))
    .map((a) => a.frontmatter.slug);

  const result = {
    source: {
      posts: Object.fromEntries(Object.entries(src.posts).map(([k, v]) => [k, v.size])),
      pageCandidates: [...src.pageCandidates].sort(),
      authorArchives: src.authorArchives.length,
      categoryArchives: src.categoryArchives.length,
      tagArchives: src.tagArchives.length,
      userPages: src.userPages.length,
      attachments: src.attachments.size,
      commentPages: src.commentPages.size,
      feeds: src.feeds.size,
      media: src.media,
    },
    migrated,
    reconciliation,
    unexplainedPosts: unexplained,
    pages: pageRows,
    taxonomy: { orphanTags, orphanTagCount: orphanTags.length },
    authorsReconciliation: { archivesWithoutAuthor, authorsWithoutArchive },
    media: {
      refsLocal: mediaRefs.local.size,
      refsExternal: mediaRefs.external.size,
      refsMissing: mediaRefs.missing.size,
      filesInOutput: mediaFiles.size,
    },
    links,
    redirects: { exact: Object.keys(redirects.exact).length, patterns: redirects.patterns.length },
    issues,
  };

  fs.writeFileSync("migration/validation.json", JSON.stringify(result, null, 2) + "\n");

  const fails = issues.filter((i) => i.severity === "FAIL");
  const warns = issues.filter((i) => i.severity === "WARNING");
  console.log("\n── Reconciliatie post-URL's ────────────────────");
  for (const lang of ["en", ...LANGS]) {
    const r = reconciliation[lang];
    console.log(`  ${lang}: bron ${String(r.source).padStart(3)} = gemigreerd ${String(r.migrated).padStart(3)} + 301 ${String(r.redirected).padStart(3)} + 410 ${String(r.gone).padStart(2)} + onverklaard ${r.unexplained.length}`);
  }
  console.log(`  pagina's: bron ${src.pageCandidates.size}, waarvan gemigreerd ${migrated.pages}`);
  console.log(`  auteurs: archieven ${src.authorArchives.length}, records ${migrated.authors}`);
  console.log(`  tags: archieven ${src.tagArchives.length}, in gebruik ${migrated.tags}, wees ${orphanTags.length}`);
  console.log("\n── Links ───────────────────────────────────────");
  console.log(`  intern ${links.internal}  extern ${links.external}  kapot ${links.broken.length}  redirects ${result.redirects.exact}+${result.redirects.patterns}`);
  console.log("\n── Bevindingen ─────────────────────────────────");
  const byCode = {};
  for (const i of issues) byCode[`${i.severity} ${i.code}`] = (byCode[`${i.severity} ${i.code}`] || 0) + 1;
  for (const k of Object.keys(byCode).sort()) console.log(`  ${String(byCode[k]).padStart(5)}  ${k}`);
  console.log(`\n  FAIL ${fails.length}   WARNING ${warns.length}\n`);
  process.exitCode = fails.length ? 1 : 0;
}

main();
