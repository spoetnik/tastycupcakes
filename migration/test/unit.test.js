import test from "node:test";
import assert from "node:assert/strict";
import * as cheerio from "cheerio";

import { slugify } from "../src/util.js";
import { unwrapArchiveUrl, resolveRef, normalisePath, uploadToMedia } from "../src/links.js";
import { cleanTitle, looksConcatenated, extract } from "../src/extract.js";
import { isTranslated } from "../src/lang.js";
import { createAuthorRegistry } from "../src/authors.js";

test("slugify normaliseert diacrieten en leestekens", () => {
  assert.equal(slugify("André D'Hondt — Grégory"), "andre-dhondt-gregory");
  assert.equal(slugify("Team Dynamics"), "team-dynamics");
  assert.equal(slugify("  --Rand--  "), "rand");
});

test("Wayback-URL's worden uitgepakt naar de originele bestemming", () => {
  assert.equal(
    unwrapArchiveUrl("https://web.archive.org/web/20241112154605im_/https://elders.example/a.png"),
    "https://elders.example/a.png",
  );
  assert.equal(
    unwrapArchiveUrl("https://web.archive.org/web/20240101000000/https://web.archive.org/web/20230101000000/https://x.test/y"),
    "https://x.test/y",
    "geneste replays worden volledig uitgepakt",
  );
  assert.equal(unwrapArchiveUrl("https://gewoon.example/x"), null);
});

test("paden worden genormaliseerd met leidende en afsluitende slash", () => {
  assert.equal(normalisePath("2012/11/delight/index.html"), "/2012/11/delight/");
  assert.equal(normalisePath("/a/b"), "/a/b/");
  assert.equal(normalisePath("/bestand.pdf"), "/bestand.pdf");
});

test("resolveRef onderscheidt intern, extern, upload en anker", () => {
  const src = "2012/11/delight/index.html";
  assert.equal(resolveRef("../../../author/don/index.html", src).kind, "internal");
  assert.equal(resolveRef("../../../author/don/index.html", src).value, "/author/don/");
  assert.equal(resolveRef("../../../wp-content/uploads/2019/04/a.jpg", src).kind, "upload");
  assert.equal(resolveRef("https://extern.example/a", src).kind, "external");
  assert.equal(resolveRef("#top", src).kind, "anchor");
  assert.equal(resolveRef("mailto:a@b.c", src).kind, "mailto");
  assert.equal(
    resolveRef("https://web.archive.org/web/20240101000000/https://tastycupcakes.org/2012/11/x/", src).value,
    "/2012/11/x/",
    "een gearchiveerde link naar het eigen domein wordt weer intern",
  );
});

test("uploadpad wordt mediapad", () => {
  assert.equal(uploadToMedia("wp-content/uploads/2019/04/a.jpg"), "/media/2019/04/a.jpg");
});

test("titels: site-achtervoegsel en (English)-fallback eraf", () => {
  assert.equal(cleanTitle("Delight - TastyCupcakes.org").title, "Delight");
  assert.equal(cleanTitle("Planning Poker « TastyCupcakes.org").title, "Planning Poker");
  const fb = cleanTitle("(English) The Estimation Quest « TastyCupcakes.org");
  assert.equal(fb.title, "The Estimation Quest");
  assert.equal(fb.isFallback, true);
});

test("aaneengeplakte meertalige titels worden gemarkeerd, niet gesplitst", () => {
  assert.equal(looksConcatenated("The Backlog is in the Eye of the BeholderO Backlog está"), true);
  assert.equal(looksConcatenated("Cynefin with the Team DrawerКеневин"), true);
  assert.equal(looksConcatenated("Delight"), false);
  assert.equal(looksConcatenated("The Product Owner Role"), false);
});

test("taaldetectie scheidt echte vertalingen van Engelse fallback", () => {
  const es = "Esta es una traducción real del artículo que el equipo puede usar para mejorar la comunicación y la colaboración en el trabajo diario con los compañeros de la organización, y para practicar la entrega continua de valor en cada iteración del proyecto.";
  const en = "This is the English text shown under a Spanish URL, which is the qTranslate fallback that we do not want to migrate as a separate file at all.";
  assert.equal(isTranslated(es, "es").translated, true);
  assert.equal(isTranslated(en, "es").translated, false);
  assert.equal(isTranslated("Бэклог в глазах смотрящего ".repeat(20), "ru").translated, true);
  assert.equal(isTranslated("kort", "es").translated, false, "te korte tekst telt niet als vertaling");
});

test("auteurs zonder account-slug worden op naam samengevoegd", () => {
  const reg = createAuthorRegistry();
  reg.record({ name: "Michael McCullough", wpSlug: "admin" });
  reg.record({ name: "Michael McCullough", wpSlug: null });   // oud thema, alleen een naam
  const finalised = reg.finalise();
  assert.equal(finalised.length, 1);
  assert.equal(finalised[0].slug, "michael-mccullough");
  assert.equal(finalised[0].postCount, 2);
});

test("gelijke namen op verschillende accounts blijven gescheiden", () => {
  const reg = createAuthorRegistry();
  reg.record({ name: "Jason Hall", wpSlug: "jason" });
  reg.record({ name: "Jason Hall", wpSlug: "jhall" });
  const finalised = reg.finalise();
  assert.equal(finalised.length, 2);
  assert.deepEqual(finalised.map((a) => a.slug).sort(), ["jason-hall", "jason-hall-2"]);
});

test("ontbrekende metadata levert lege velden, geen verzonnen waarden", () => {
  const html = `<!doctype html><title>Kaal « TastyCupcakes.org</title><body><div class="entry-content"><p>Tekst</p></div></body>`;
  const d = extract(html, "2013/01/kaal/index.html");
  assert.equal(d.published, null);
  assert.equal(d.modified, null);
  assert.equal(d.description, null);
  assert.equal(d.author, null);
  assert.deepEqual(d.categories, []);
  assert.deepEqual(d.tags, []);
});
