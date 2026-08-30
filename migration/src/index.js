#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

import { LANGS, CATEGORY_NAMES, DROPPED_PAGES } from "./config.js";
import { discover, authorArchiveNames } from "./discover.js";
import { extract } from "./extract.js";
import { clean } from "./clean.js";
import { createConverter, toMarkdown } from "./markdown.js";
import { createMediaIndex, copyAvatar } from "./media.js";
import { createAuthorRegistry } from "./authors.js";
import { createRedirectTable } from "./redirects.js";
import { createReport } from "./report.js";
import { isTranslated } from "./lang.js";
import { writeIfChanged, toCsv, slugify } from "./util.js";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const EXPORT_ROOT = path.resolve(opt("export", "output"));
const DEST_ROOT = path.resolve(opt("dest", "migration/out"));
/** Rapporten en redirect-tabel staan vast in migration/, los van --dest. */
const REPORT_DIR = path.resolve(opt("reports", "migration"));
const DRY_RUN = args.includes("--dry-run");
const LIMIT = Number(opt("limit", 0)) || 0;

export async function migrate({ exportRoot = EXPORT_ROOT, destRoot = DEST_ROOT, reportDir = REPORT_DIR, dryRun = DRY_RUN, limit = LIMIT } = {}) {
  const report = createReport();
  const media = await createMediaIndex(exportRoot);
  const authors = createAuthorRegistry();
  const redirects = createRedirectTable();
  const td = createConverter();

  const found = discover(exportRoot);
  report.bump("bronbestanden gevonden", found.allHtml.size);
  for (const s of found.skipped) report.warn("pagina-overgeslagen", s.rel, s.reason);

  // ── parse + normalize + clean + transform ───────────────────────────────
  const unmigratable = [];            // permalinks zonder bruikbare bron
  const enPosts = new Map();          // key -> record
  const records = [];                 // alle te schrijven items

  const postSources = limit ? found.posts.slice(0, limit) : found.posts;

  for (const src of postSources.filter((p) => p.lang === "en")) {
    const rec = buildPost(src, { exportRoot, media, td, report, authors, unmigratable });
    if (!rec) continue;
    enPosts.set(src.key, rec);
    records.push(rec);
  }

  for (const src of postSources.filter((p) => p.lang !== "en")) {
    const en = enPosts.get(src.key);
    const rec = buildPost(src, { exportRoot, media, td, report, authors, unmigratable, enRecord: en });
    if (!rec) continue;

    if (rec._fallback) {
      // Engelse tekst onder een taal-URL: 301 naar het origineel, geen bestand.
      if (en) {
        redirects.add(src.permalink, en.frontmatter.permalink, 301, "vertaalde fallback");
        report.bump("vertaalde fallback -> 301");
      } else {
        redirects.add(src.permalink, null, 410, "vertaalde fallback zonder EN-origineel");
        report.bump("vertaalde fallback -> 410");
      }
      continue;
    }
    if (!en) report.warn("vertaling-zonder-origineel", src.permalink, "geen Engelse bronpost gevonden");
    records.push(rec);
  }

  for (const src of limit ? found.pages.slice(0, limit) : found.pages) {
    const rec = buildPage(src, { exportRoot, media, td, report, authors });
    if (rec) records.push(rec);
  }

  // ── auteurs vaststellen en referenties omzetten ─────────────────────────
  // Auteurs die alleen in de content gelinkt worden hebben ook een archief in
  // de export; zonder registratie zou die link als kapot gelden.
  const archiveNames = authorArchiveNames(exportRoot);
  const linkedAuthors = new Set();
  for (const rec of records) {
    for (const target of rec._internalLinks) {
      const m = target.match(/^\/(?:(?:es|fr|pt|ru)\/)?author\/([^/]+)\/$/);
      if (m) linkedAuthors.add(decodeURIComponent(m[1]));
    }
  }
  for (const wpSlug of [...linkedAuthors].sort()) {
    if (archiveNames.has(wpSlug)) {
      authors.record({ name: archiveNames.get(wpSlug), wpSlug, count: false });
    }
  }

  const finalAuthors = authors.finalise();
  const authorBySlug = new Map(finalAuthors.map((a) => [a.wpSlug, a.slug]));

  for (const rec of records) {
    if (rec.frontmatter.author) {
      const mapped = authorBySlug.get(rec.frontmatter.author);
      if (mapped) rec.frontmatter.author = mapped;
      else report.warn("auteur-niet-herleid", rec.frontmatter.permalink, rec.frontmatter.author);
    }
    const mapAuthorPath = (p) => {
      const m = p.match(/^\/(?:(es|fr|pt|ru)\/)?author\/([^/]+)\/$/);
      if (!m) return p;
      const mapped = authorBySlug.get(decodeURIComponent(m[2]));
      return mapped ? `/author/${mapped}/` : p;
    };
    rec.body = rec.body.replace(/\((\/(?:es\/|fr\/|pt\/|pt\/|ru\/)?author\/[^/)]+\/)\)/g,
      (whole, p) => `(${mapAuthorPath(p)})`);
    rec._internalLinks = rec._internalLinks.map(mapAuthorPath);
  }
  const byName = new Map();
  for (const a of finalAuthors) {
    const k = a.name.trim().toLowerCase();
    if (byName.has(k)) {
      report.warn("mogelijk-dubbele-auteur", a.name,
        `accounts ${[...byName.get(k).wpSlugs].join(", ")} en ${[...a.wpSlugs].join(", ")}`);
    } else byName.set(k, a);
  }

  for (const a of finalAuthors) {
    for (const wp of a.wpSlugs) {
      if (wp !== a.slug) redirects.add(`/author/${wp}/`, `/author/${a.slug}/`, 301, "auteur-slug vernieuwd");
      // De taalvarianten van auteurarchieven wijzen naar hetzelfde archief;
      // een exacte regel voorkomt een 301-keten via de taal-prefixregel.
      for (const lang of LANGS) {
        redirects.add(`/${lang}/author/${wp}/`, `/author/${a.slug}/`, 301, "auteurarchief in andere taal");
      }
    }
  }

  // ── redirects uit vaste regels ──────────────────────────────────────────
  for (const rec of records) {
    for (const from of rec._redirectFrom) redirects.add(from, rec.frontmatter.permalink, 301, "legacy URL");
  }
  const livePaths = new Set(records.map((r) => r.frontmatter.permalink));
  for (const att of found.attachments) {
    let to = att.to;
    if (!livePaths.has(to)) {
      // Taalversie is een fallback, of de bovenliggende post bestaat niet.
      const enEquivalent = to.replace(/^\/(es|fr|pt|ru)\//, "/");
      to = livePaths.has(enEquivalent) ? enEquivalent : null;
    }
    if (to) redirects.add(att.from, to, 301, "attachmentpagina");
    else redirects.add(att.from, null, 410, "attachmentpagina zonder bestaande post");
  }
  for (const permalink of unmigratable) {
    redirects.add(permalink, null, 410, "geen bruikbare capture in de export");
  }
  // Pagina's die volgens CONTENT-MODEL §4 vervallen: expliciet 410, geen 404.
  for (const slug of DROPPED_PAGES) {
    if (slug === "tastycupcakes-home" || slug.includes("michael-mccullough/michael")) continue;
    redirects.add(`/${slug}/`, null, 410, "pagina vervalt volgens CONTENT-MODEL §4");
  }
  redirects.add("/game/comment-page-1/", null, 410, "pagina vervalt volgens CONTENT-MODEL §4");

  // Tag-archieven waar geen enkele gemigreerde post naar verwijst.
  const liveTags = new Set(records.flatMap((r) => r.frontmatter.tags || []));
  for (const tag of found.tagArchives) {
    if (!liveTags.has(tag)) redirects.add(`/tag/${tag}/`, null, 410, "tag zonder gepubliceerde posts");
  }

  // Formaatvarianten worden niet gekopieerd als het origineel bestaat; hun
  // oude URL moet naar het origineel wijzen in plaats van naar een leeg pad.
  for (const [variant, original] of media.variantRedirects()) {
    redirects.add(`/${variant}`, original, 301, "formaatvariant naar origineel");
  }

  // Engelse pagina's die alleen in de vertaalde crawl voorkomen.
  for (const slug of ["all-games", "vision"]) {
    redirects.add(`/${slug}/`, null, 410, "pagina ontbreekt in de Engelse export");
  }

  // Auteurarchieven zonder gemigreerd record: geen content, dus 410.
  const knownWpSlugs = new Set(finalAuthors.flatMap((a) => [...a.wpSlugs]));
  for (const archive of found.authorArchives) {
    if (!knownWpSlugs.has(archive)) {
      redirects.add(`/author/${archive}/`, null, 410, "auteurarchief zonder posts");
    }
  }
  // Archieven die alleen in een vertaalde crawl bestaan en nergens op te
  // mappen zijn. Zie URL-REPORT.md §handmatig voor de uitzonderingen.
  for (const [lang, archives] of Object.entries(found.langAuthorArchives)) {
    for (const archive of archives) {
      if (knownWpSlugs.has(archive)) continue;
      redirects.add(`/${lang}/author/${archive}/`, null, 410, "auteurarchief zonder gemigreerd record");
    }
  }

  redirects.add("/tastycupcakes-home/", "/", 301, "oude homepage");
  redirects.add("/about/michael-mccullough/michael-mccullough/", "/about/michael-mccullough/", 301, "genest duplicaat");

  // ── validate ────────────────────────────────────────────────────────────
  const knownPaths = new Set([
    "/", "/rss.xml",
    ...records.map((r) => r.frontmatter.permalink),
    ...finalAuthors.map((a) => `/author/${a.slug}/`),
    ...Object.keys(CATEGORY_NAMES).map((c) => `/category/${c}/`),
  ]);
  const allTags = new Set(records.flatMap((r) => r.frontmatter.tags || []));
  for (const t of allTags) knownPaths.add(`/tag/${t}/`);

  const table = redirects.build();
  const resolves = (target) => {
    if (knownPaths.has(target)) return true;
    const hit = table.exact[target];
    if (hit) return hit.status === 410 ? true : knownPaths.has(hit.to);
    return table.patterns.some((p) => new RegExp(p.match).test(target));
  };

  for (const rec of records) {
    for (const target of rec._internalLinks) {
      if (resolves(target)) continue;
      const note = /^\/(?:es|fr|pt|ru\/)?\d{4}\/\d{2}\/[^/]+\/$/.test(target)
        ? "post bestaat niet in de export"
        : "onbekend doel";
      report.list("brokenLinks", { from: rec.frontmatter.permalink, to: target, note });
      report.warn("gebroken-interne-link", rec.frontmatter.permalink, target);
    }
  }

  // ── write ───────────────────────────────────────────────────────────────
  let written = { created: 0, updated: 0, unchanged: 0 };
  const producedFiles = new Set();
  const write = (file, content) => {
    producedFiles.add(path.resolve(destRoot, file));
    if (dryRun) return;
    written[writeIfChanged(path.join(destRoot, file), content)]++;
  };

  for (const rec of records) {
    write(rec.file, serialise(rec));
    report.bump(rec.kind === "page" ? "pagina's geschreven" : `posts geschreven (${rec.frontmatter.lang})`);
  }

  for (const a of finalAuthors) {
    let avatar = null;
    if (a.avatar && a.avatar.startsWith("wp-content/uploads/")) {
      avatar = await copyAvatar(exportRoot, destRoot, a.avatar, a.slug, dryRun);
    }
    const fm = {
      name: a.name, slug: a.slug, wordpressSlugs: [...a.wpSlugs].sort(),
      bio: a.bio || undefined, avatar: avatar || null, website: a.website || undefined,
    };
    write(`src/content/authors/${a.slug}.md`, `---\n${dumpYaml(fm)}---\n`);
  }
  report.bump("auteurs", finalAuthors.length);

  const usedCategories = new Set(records.flatMap((r) => r.frontmatter.categories || []));
  const categories = Object.entries(CATEGORY_NAMES)
    .filter(([slug]) => usedCategories.has(slug))
    .map(([slug, name], i) => ({ slug, name, description: "", order: i + 1, ...(slug === "uncategorized" ? { hidden: true } : {}) }));
  write("src/data/categories.json", JSON.stringify(categories, null, 2) + "\n");
  report.bump("categorieën", categories.length);

  const tagOverrides = {};
  for (const t of [...allTags].sort()) {
    if (/^\d+$/.test(t) || t.length < 2) tagOverrides[t] = { hidden: true };
  }
  write("src/data/tags.json", JSON.stringify(tagOverrides, null, 2) + "\n");
  report.bump("tags", allTags.size);

  report.bump("redirects (exact)", table.counts.exact);
  report.bump("redirects (patronen)", table.patterns.length);

  const missing = media.missingReferences();
  for (const [file, count] of missing) report.list("missingImages", { file, references: count });
  const mediaStats = await media.copyAll(destRoot, { dryRun });
  report.bump("afbeeldingen gekopieerd", mediaStats.images);
  report.bump("downloads gekopieerd", mediaStats.downloads);
  report.bump("varianten overgeslagen", mediaStats.skippedVariants);
  report.bump("afbeeldingen verkleind", mediaStats.resized);
  report.bump("media MB voor", Math.round(mediaStats.bytesBefore / 1048576));
  report.bump("media MB na", Math.round(mediaStats.bytesAfter / 1048576));
  write("src/data/image-dimensions.json", JSON.stringify(mediaStats.dimensions, null, 0) + "\n");

  if (!dryRun) {
    const out = (f, c) => writeIfChanged(path.join(reportDir, f), c);
    out("redirects.json", JSON.stringify(table, null, 2) + "\n");
    out("missing-media.csv", toCsv(report.lists.missingImages, ["file", "references"]));
    out("titles-to-review.csv", toCsv(report.lists.titlesToReview, ["permalink", "title", "slug"]));
    out("broken-links.csv", toCsv(report.lists.brokenLinks, ["from", "to", "note"]));
    out("report.json", JSON.stringify(report.toJSON(), null, 2) + "\n");
  }

  // Verwijdert output van een vorige run die nu niet meer geproduceerd wordt.
  // Strikt binnen destRoot; de originele export wordt nooit aangeraakt.
  if (!dryRun && !args.includes("--no-prune")) {
    let pruned = 0;
    for (const sub of ["src/content", "src/data"]) {
      const dir = path.join(destRoot, sub);
      if (!fs.existsSync(dir)) continue;
      for (const file of walkFiles(dir)) {
        if (producedFiles.has(path.resolve(file))) continue;
        fs.rmSync(file);
        pruned++;
        report.warn("verouderde-output-verwijderd", path.relative(destRoot, file), "niet geproduceerd in deze run");
      }
    }
    if (pruned) report.bump("verouderde bestanden verwijderd", pruned);
  }

  report.bump("bestanden nieuw", written.created);
  report.bump("bestanden gewijzigd", written.updated);
  report.bump("bestanden ongewijzigd", written.unchanged);
  return { report, records, authors: finalAuthors, redirects: table, media: mediaStats };
}

// ── bouwstenen ────────────────────────────────────────────────────────────

function buildPost(src, ctx) {
  const { exportRoot, media, td, report, authors, enRecord } = ctx;
  let sourceRel = src.sourceRel;
  let html = readFile(exportRoot, sourceRel);
  let data = extract(html, sourceRel);
  let captureNote = data.capture;

  if (src.missingCanonical) {
    report.warn("canonieke-capture-ontbreekt", src.permalink,
      "index.html ontbreekt in de export; hersteld uit de comment-page");
  }
  if (data.isRedirectStub || !data.container) {
    if (src.recovery) {
      sourceRel = src.recovery;
      html = readFile(exportRoot, sourceRel);
      data = extract(html, sourceRel);
      captureNote = "recovered";
      report.warn(
        src.missingCanonical ? "canonieke-capture-ontbreekt" : "capture-hersteld",
        src.permalink,
        `bron vervangen door ${sourceRel}`,
      );
    }
  }
  if (!data.container) {
    if (src.lang !== "en") return { _fallback: true, frontmatter: { permalink: src.permalink } };
    // Bewust afgehandeld: de URL krijgt verderop een 410. Luid gemeld, maar
    // geen fout die de pijplijn stopt.
    report.warn("post-niet-migreerbaar", src.permalink, "geen bruikbare capture in de export");
    ctx.unmigratable.push(src.permalink);
    report.list("unmigratable", src.permalink);
    return null;
  }

  const refs = clean(data.$, data.container, sourceRel, media);
  const bodyHtml = data.$.html(data.container);
  let body;
  try {
    body = toMarkdown(td, bodyHtml);
  } catch (err) {
    report.error("markdown-conversie", src.permalink, `${err.message} (bron ${sourceRel})`);
    return null;
  }

  if (!body.trim()) {
    if (src.lang !== "en") return { _fallback: true, frontmatter: { permalink: src.permalink } };
    report.warn("post-niet-migreerbaar", src.permalink, `lege content in ${sourceRel}`);
    ctx.unmigratable.push(src.permalink);
    return null;
  }

  // Vertaling: alleen een bestand als de tekst daadwerkelijk vertaald is.
  if (src.lang !== "en") {
    const verdict = isTranslated(data.container.text(), src.lang);
    if (!verdict.translated || data.isEnglishFallback) {
      return { _fallback: true, frontmatter: { permalink: src.permalink } };
    }
  }

  const { date, dateSource } = resolveDate(data, src, report);
  const inherited = src.lang !== "en" && enRecord ? enRecord.frontmatter : null;

  if (data.author?.boxMismatch) {
    report.warn("auteursbox-wijkt-af", src.permalink,
      `entry-meta "${data.author.name}" vs auteursbox "${data.author.boxName}"`);
  }
  const boxIsSamePerson = data.author && !data.author.boxMismatch;
  const authorKey = data.author
    ? authors.record({
        name: data.author.name, wpSlug: data.author.wpSlug,
        bio: boxIsSamePerson ? data.authorBox?.bio : undefined,
        avatar: boxIsSamePerson ? normaliseUpload(data.authorBox?.avatar, sourceRel) : undefined,
        website: boxIsSamePerson ? data.authorBox?.website : undefined,
      })
    : null;

  if (!authorKey && !inherited?.author) {
    report.list("noAuthor", src.permalink);
    report.warn("geen-auteur", src.permalink, `capture=${captureNote}`);
  }

  let categories = data.categories.length ? data.categories : inherited?.categories ?? [];
  let tags = data.tags.length ? data.tags : inherited?.tags ?? [];
  if (!categories.length && !tags.length && data.filedUnder?.length) {
    // Oud thema: taxonomie staat als namen in "Filed Under", niet als class.
    const slugs = data.filedUnder.map((n) => slugify(n)).filter(Boolean);
    categories = slugs.filter((s) => s in CATEGORY_NAMES);
    tags = slugs.filter((s) => !(s in CATEGORY_NAMES));
    if (categories.length || tags.length) report.bump("taxonomie uit legacy 'Filed Under'");
  }
  if (!categories.length) {
    report.list("noCategory", src.permalink);
    report.warn("geen-categorie", src.permalink, `capture=${captureNote}`);
  }

  if (data.titleNeedsReview) {
    report.list("titlesToReview", { permalink: src.permalink, title: data.title, slug: src.slug });
  }
  for (const u of refs.uploads) if (u.missing) report.warn("afbeelding-ontbreekt", src.permalink, u.upload);
  for (const x of refs.externalImages) report.list("externalImages", { post: src.permalink, src: x });

  const featured = firstImage(body);

  const frontmatter = compact({
    title: data.title || src.slug,
    titleNeedsReview: data.titleNeedsReview || undefined,
    slug: src.slug,
    permalink: src.permalink,
    lang: src.lang,
    translationOf: src.lang !== "en" ? `/${src.key}/` : undefined,
    description: data.description || undefined,
    date,
    dateSource,
    updated: data.modified || undefined,
    author: authorKey || inherited?.author || undefined,
    categories,
    tags,
    featuredImage: featured ? { src: featured.src, alt: featured.alt, derived: true } : null,
    draft: false,
    wordpress: compact({
      id: data.postId || undefined,
      sourceFile: `output/${sourceRel}`,
      capture: captureNote,
    }),
  });

  const dir = src.lang === "en" ? "en" : src.lang;
  return {
    kind: "post",
    file: `src/content/posts/${dir}/${src.year}/${src.month}/${src.slug}.md`,
    frontmatter, body,
    _internalLinks: refs.internalLinks,
    _redirectFrom: redirectSourcesFor(src),
  };
}

function buildPage(src, ctx) {
  const { exportRoot, media, td, report, authors } = ctx;
  const html = readFile(exportRoot, src.sourceRel);
  const data = extract(html, src.sourceRel);
  if (!data.container) {
    report.error("geen-content", src.permalink, "geen bruikbare capture in de export");
    return null;
  }
  const refs = clean(data.$, data.container, src.sourceRel, media);
  let body;
  try {
    body = toMarkdown(td, data.$.html(data.container));
  } catch (err) {
    report.error("markdown-conversie", src.permalink, `${err.message} (bron ${src.sourceRel})`);
    return null;
  }
  if (!body.trim()) {
    report.error("lege-content", src.permalink, `bron ${src.sourceRel}`);
    return null;
  }
  if (data.titleNeedsReview) {
    report.list("titlesToReview", { permalink: src.permalink, title: data.title, slug: src.slug });
  }
  const parts = src.slug.split("/");
  const frontmatter = compact({
    title: data.title || src.slug,
    titleNeedsReview: data.titleNeedsReview || undefined,
    slug: parts[parts.length - 1],
    permalink: src.permalink,
    lang: "en",
    description: data.description || undefined,
    updated: data.modified || undefined,
    parent: parts.length > 1 ? parts.slice(0, -1).join("/") : null,
    draft: false,
    wordpress: compact({ id: data.postId || undefined, sourceFile: `output/${src.sourceRel}`, capture: data.capture }),
  });
  return {
    kind: "page",
    file: `src/content/pages/en/${src.slug}.md`,
    frontmatter, body,
    _internalLinks: refs.internalLinks,
    _redirectFrom: [],
  };
}

function resolveDate(data, src, report) {
  if (data.published) return { date: data.published, dateSource: "meta" };
  if (data.pageDate) return { date: data.pageDate, dateSource: "page" };
  if (src.year) {
    report.warn("datum-geschat", src.permalink, "datum afgeleid uit de URL");
    return { date: `${src.year}-${src.month}-01T00:00:00.000Z`, dateSource: "url" };
  }
  return { date: undefined, dateSource: undefined };
}

function redirectSourcesFor(src) {
  const out = [];
  if (src.recovery) out.push(`/${src.recovery.replace(/index\.html$/, "")}`);
  return out;
}

function firstImage(markdown) {
  const md = markdown.match(/!\[([^\]]*)\]\(([^)\s]+)/);
  if (md) return { src: md[2], alt: md[1] };
  const html = markdown.match(/<img\s+src="([^"]+)"(?:\s+alt="([^"]*)")?/);
  if (html) return { src: html[1], alt: html[2] || "" };
  return null;
}

function normaliseUpload(src, sourceRel) {
  if (!src) return null;
  const i = src.indexOf("wp-content/uploads/");
  return i >= 0 ? src.slice(i) : null;
}

function walkFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function readFile(root, rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function compact(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) out[k] = v;
  return out;
}

export function dumpYaml(obj) {
  return yaml.dump(obj, { lineWidth: 100, noRefs: true, quotingType: '"', forceQuotes: false });
}

export function serialise(rec) {
  return `---\n${dumpYaml(rec.frontmatter)}---\n\n${rec.body}\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const started = Date.now();
  const { report } = await migrate();
  report.print();
  console.log(`Klaar in ${((Date.now() - started) / 1000).toFixed(1)}s → ${DEST_ROOT}${DRY_RUN ? " (dry run)" : ""}\n`);
  process.exitCode = report.errors.length > 0 ? 1 : 0;
}
