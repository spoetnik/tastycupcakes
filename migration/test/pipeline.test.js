import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import yaml from "js-yaml";

import { migrate } from "../src/index.js";

const EXPORT = path.resolve("migration/test/fixtures/export");

function run(dest) {
  return migrate({ exportRoot: EXPORT, destRoot: dest, dryRun: false });
}
function tmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "migratie-"));
}
function readPost(dest, rel) {
  const raw = fs.readFileSync(path.join(dest, "src/content/posts", rel), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(m, `geen frontmatter in ${rel}`);
  return { frontmatter: yaml.load(m[1]), body: m[2].trim() };
}

test("simpele post krijgt volledige frontmatter en schone body", async () => {
  const dest = tmp();
  await run(dest);
  const { frontmatter: fm, body } = readPost(dest, "en/2012/11/simple.md");

  assert.equal(fm.title, "Simple Post");
  assert.equal(fm.slug, "simple");
  assert.equal(fm.permalink, "/2012/11/simple/");
  assert.equal(fm.lang, "en");
  assert.equal(fm.description, "Een simpele post.");
  assert.equal(new Date(fm.date).toISOString(), "2012-11-02T10:47:05.000Z");
  assert.equal(fm.dateSource, "meta");
  assert.equal(new Date(fm.updated).toISOString(), "2012-11-02T11:45:11.000Z");
  assert.equal(fm.author, "michael-mccullough");
  assert.deepEqual(fm.categories, ["games", "agile"]);
  assert.deepEqual(fm.tags, ["improv"]);
  assert.equal(fm.wordpress.id, 101);
  assert.equal(fm.wordpress.capture, "modern");
  assert.equal(fm.draft, false);

  assert.match(body, /^## Kop twee/m);
  assert.doesNotMatch(body, /Bio van de auteur|Ruis/, "auteursbox en reactiewidget zijn weg");
});

test("post met afbeelding: variant wordt vervangen door het origineel", async () => {
  const dest = tmp();
  await run(dest);
  const { frontmatter: fm, body } = readPost(dest, "en/2012/11/with-image.md");

  assert.match(body, /\/media\/2012\/11\/foto\.jpg/, "de -300x200 variant is vervangen door het origineel");
  assert.doesNotMatch(body, /300x200/);
  assert.match(body, /<figcaption>Het onderschrift<\/figcaption>/);
  assert.equal(fm.featuredImage.src, "/media/2012/11/foto.jpg");
  assert.equal(fm.featuredImage.derived, true, "featured image is afgeleid, niet uit de bron");
  assert.ok(fs.existsSync(path.join(dest, "public/media/2012/11/foto.jpg")));
  assert.ok(!fs.existsSync(path.join(dest, "public/media/2012/11/foto-300x200.jpg")), "variant wordt niet gekopieerd");
});

test("post met meerdere afbeeldingen: variant zonder origineel blijft, ontbrekende wordt gemeld", async () => {
  const dest = tmp();
  const { report } = await run(dest);
  const { body } = readPost(dest, "en/2012/11/many-images.md");

  assert.equal((body.match(/!\[/g) || []).length, 4);
  assert.match(body, /\/media\/2012\/11\/alleen-variant-150x150\.jpg/, "enige overgebleven versie blijft behouden");
  assert.match(body, /https:\/\/elders\.example\/plaatje\.png/, "externe afbeelding uit het archief teruggewonnen");
  assert.ok(
    report.lists.missingImages.some((m) => m.file.endsWith("bestaat-niet.jpg")),
    "ontbrekende afbeelding staat in het rapport",
  );
  assert.ok(fs.existsSync(path.join(dest, "public/media/2012/11/alleen-variant-150x150.jpg")));
});

test("interne links blijven werken, externe links blijven heel, kapotte link wordt gemeld", async () => {
  const dest = tmp();
  const { report } = await run(dest);
  const { body } = readPost(dest, "en/2012/11/linky.md");

  assert.match(body, /\[interne link\]\(\/2012\/11\/simple\/\)/);
  assert.match(body, /\[categorie\]\(\/category\/games\/\)/);
  assert.match(body, /\[externe link via archief\]\(https:\/\/voorbeeld\.nl\/pagina\)/);
  assert.match(body, /\[directe externe link\]\(https:\/\/direct\.example\/pad\)/);
  assert.ok(
    report.lists.brokenLinks.some((b) => b.to === "/2099/01/bestaat-niet/"),
    "de kapotte interne link wordt gerapporteerd in plaats van stil weggelaten",
  );
});

test("post met meerdere categorieën en tags", async () => {
  const dest = tmp();
  await run(dest);
  const { frontmatter: fm } = readPost(dest, "en/2012/11/cats.md");
  assert.deepEqual(fm.categories, ["games", "agile", "lean"]);
  assert.deepEqual(fm.tags, ["improv", "teamwork"]);
});

test("meerdere auteurs krijgen elk een eigen bestand met redirect vanaf de oude slug", async () => {
  const dest = tmp();
  const { redirects } = await run(dest);
  const dir = path.join(dest, "src/content/authors");
  const slugs = fs.readdirSync(dir).map((f) => f.replace(/\.md$/, "")).sort();
  assert.deepEqual(slugs, ["jane-doe", "michael-mccullough"]);

  const mm = yaml.load(fs.readFileSync(path.join(dir, "michael-mccullough.md"), "utf8").replace(/^---\n|---\n$/g, ""));
  assert.equal(mm.name, "Michael McCullough");
  assert.deepEqual(mm.wordpressSlugs, ["admin"]);
  assert.match(mm.bio, /Bio van de auteur/);
  assert.equal(redirects.exact["/author/admin/"].to, "/author/michael-mccullough/");
  assert.equal(redirects.exact["/author/admin/"].status, 301);
});

test("dode capture wordt hersteld uit de comment-page variant", async () => {
  const dest = tmp();
  const { report } = await run(dest);
  const { frontmatter: fm, body } = readPost(dest, "en/2012/11/dead.md");
  assert.equal(fm.wordpress.capture, "recovered");
  assert.match(body, /comment-page variant/);
  assert.ok(report.warnings.some((w) => w.code === "capture-hersteld"));
});

test("ontbrekende metadata: datum en taxonomie uit het oude thema, geen verzinsels", async () => {
  const dest = tmp();
  const { report } = await run(dest);
  const { frontmatter: fm } = readPost(dest, "en/2013/01/no-meta.md");

  assert.equal(fm.dateSource, "page", "datum komt uit de zichtbare pagina, niet uit meta");
  assert.equal(new Date(fm.date).toISOString(), "2013-01-05T09:15:00.000Z");
  assert.equal(fm.author, "michael-mccullough");
  assert.deepEqual(fm.categories, ["agile"]);
  assert.deepEqual(fm.tags, ["estimation"]);
  assert.equal(fm.description, undefined, "geen description in de bron, dus geen veld");
  assert.equal(fm.wordpress.capture, "legacy");
  assert.equal(report.errors.length, 0);
});

test("echte vertaling wordt een bestand, Engelse fallback wordt een 301", async () => {
  const dest = tmp();
  const { redirects } = await run(dest);

  const es = readPost(dest, "es/2012/11/simple.md");
  assert.equal(es.frontmatter.lang, "es");
  assert.equal(es.frontmatter.translationOf, "/2012/11/simple/");
  assert.deepEqual(es.frontmatter.categories, ["games", "agile"], "taxonomie geërfd van het Engelse origineel");

  assert.ok(!fs.existsSync(path.join(dest, "src/content/posts/ru/2012/11/simple.md")),
    "de Russische fallback wordt geen bestand");
  assert.equal(redirects.exact["/ru/2012/11/simple/"].to, "/2012/11/simple/");
  assert.equal(redirects.exact["/ru/2012/11/simple/"].status, 301);
});

test("de migratie is idempotent", async () => {
  const dest = tmp();
  await run(dest);
  const snapshot = (root) =>
    fs.readdirSync(root, { recursive: true })
      .filter((f) => fs.statSync(path.join(root, f)).isFile())
      .sort()
      .map((f) => `${f}:${fs.readFileSync(path.join(root, f)).toString("base64")}`)
      .join("\n");

  const first = snapshot(dest);
  const { report } = await run(dest);
  const second = snapshot(dest);

  assert.equal(first, second, "tweede run geeft byte-identieke output");
  assert.equal(report.counts["bestanden nieuw"], 0);
  assert.equal(report.counts["bestanden gewijzigd"], 0);
  assert.ok(report.counts["bestanden ongewijzigd"] > 0);
});

test("de originele export wordt nooit gewijzigd", async () => {
  const before = fs.readdirSync(EXPORT, { recursive: true })
    .map((f) => `${f}:${fs.statSync(path.join(EXPORT, f)).mtimeMs}`)
    .sort()
    .join("\n");
  await run(tmp());
  const after = fs.readdirSync(EXPORT, { recursive: true })
    .map((f) => `${f}:${fs.statSync(path.join(EXPORT, f)).mtimeMs}`)
    .sort()
    .join("\n");
  assert.equal(before, after);
});
