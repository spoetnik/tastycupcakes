import test from "node:test";
import assert from "node:assert/strict";
import * as cheerio from "cheerio";

import { clean } from "../src/clean.js";
import { createConverter, toMarkdown } from "../src/markdown.js";

const td = createConverter();

/** Media-index-dubbel: alles bestaat, behalve wat 'ontbreekt' heet. */
const media = {
  has: (upload) => !upload.includes("ontbreekt"),
  resolve(upload) {
    const missing = upload.includes("ontbreekt");
    return { url: "/media/" + upload.replace("wp-content/uploads/", ""), source: missing ? null : upload, missing };
  },
};

function convert(inner, sourceRel = "2012/11/post/index.html") {
  const $ = cheerio.load(`<div class="entry-content">${inner}</div>`);
  const container = $(".entry-content");
  const refs = clean($, container, sourceRel, media);
  return { markdown: toMarkdown(td, $.html(container)), refs };
}

test("basale HTML blijft behouden", () => {
  const { markdown } = convert(
    `<h2>Kop</h2><p>Met <strong>vet</strong> en <em>cursief</em>.</p>
     <ul><li>een</li><li>twee</li></ul><ol><li>a</li></ol>
     <blockquote><p>Citaat</p></blockquote><pre><code>const x = 1;</code></pre>`,
  );
  assert.match(markdown, /^## Kop/m);
  assert.match(markdown, /\*\*vet\*\*/);
  assert.match(markdown, /_cursief_/);
  assert.match(markdown, /^-\s+een/m);
  assert.match(markdown, /^1\.\s+a/m);
  assert.match(markdown, /^> Citaat/m);
  assert.match(markdown, /```/);
});

test("tabellen worden GFM-tabellen", () => {
  const { markdown } = convert(`<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>`);
  assert.match(markdown, /\| A \| B \|/);
  assert.match(markdown, /\| --- \| --- \|/);
});

test("lege en layout-tabellen laten de conversie niet crashen", () => {
  assert.doesNotThrow(() => convert(`<table><colgroup><col></colgroup></table><p>Na de tabel</p>`));
  const { markdown } = convert(`<table><colgroup><col></colgroup></table><p>Na de tabel</p>`);
  assert.match(markdown, /Na de tabel/);
});

test("wp-caption wordt een figure met figcaption", () => {
  const { markdown } = convert(
    `<div class="wp-caption aligncenter" style="width:310px"><img src="../../../wp-content/uploads/2012/11/f.jpg" alt="Alt"><p class="wp-caption-text">Onderschrift</p></div>`,
  );
  assert.match(markdown, /<figure>/);
  assert.match(markdown, /<figcaption>Onderschrift<\/figcaption>/);
  assert.match(markdown, /src="\/media\/2012\/11\/f\.jpg"/);
});

test("WordPress- en plugin-markup wordt verwijderd", () => {
  const { markdown } = convert(
    `<p class="wp-block-paragraph MsoNormal">Tekst</p>
     <div class="saboxplugin-wrap"><div class="saboxplugin-authorname">Auteur</div><div class="saboxplugin-desc">Bio</div></div>
     <div id="comments" class="comments-area">Reacties</div>
     <script>alert(1)</script><p class="Apple-style-span hps">Meer tekst</p>`,
  );
  assert.match(markdown, /Tekst/);
  assert.match(markdown, /Meer tekst/);
  assert.doesNotMatch(markdown, /Auteur|Bio|Reacties|alert/);
});

test("inline styles en lege alinea's verdwijnen", () => {
  const { markdown } = convert(`<p style="color:red">Rood</p><p></p><p><em></em></p><p>&nbsp;</p><p>Klaar</p>`);
  assert.doesNotMatch(markdown, /style=/);
  assert.equal(markdown, "Rood\n\nKlaar");
});

test("plugin- en profielafbeeldingen tellen niet als content", () => {
  const { markdown, refs } = convert(
    `<img src="../../../wp-content/plugins/wp-spamfree/img/wpsf-img.php" alt="">
     <img src="../../../wp-content/profile-pics/1.jpg" alt="">
     <img src="../../../wp-content/uploads/2012/11/echt.jpg" alt="Echt">`,
  );
  assert.equal(refs.uploads.length, 1);
  assert.match(markdown, /!\[Echt\]\(\/media\/2012\/11\/echt\.jpg\)/);
});

test("meerdere afbeeldingen worden alle herschreven en geteld", () => {
  const { markdown, refs } = convert(
    `<img src="../../../wp-content/uploads/2012/11/a.jpg" alt="A">
     <img src="../../../wp-content/uploads/2012/11/b.jpg" alt="B">
     <img src="../../../wp-content/uploads/2012/11/ontbreekt.jpg" alt="C">`,
  );
  assert.equal(refs.uploads.length, 3);
  assert.equal(refs.uploads.filter((u) => u.missing).length, 1);
  for (const name of ["a", "b", "ontbreekt"]) {
    assert.match(markdown, new RegExp(`/media/2012/11/${name}\\.jpg`));
  }
});

test("interne links worden site-absoluut, externe links blijven heel", () => {
  const { markdown, refs } = convert(
    `<a href="../../../2012/11/ander/index.html">intern</a>
     <a href="https://direct.example/pad">extern</a>
     <a href="https://web.archive.org/web/20240101000000/https://herstel.example/x">gearchiveerd extern</a>`,
  );
  assert.match(markdown, /\[intern\]\(\/2012\/11\/ander\/\)/);
  assert.match(markdown, /\[extern\]\(https:\/\/direct\.example\/pad\)/);
  assert.match(markdown, /\[gearchiveerd extern\]\(https:\/\/herstel\.example\/x\)/,
    "de originele externe URL wordt uit de Wayback-wrapper teruggewonnen");
  assert.deepEqual(refs.internalLinks, ["/2012/11/ander/"]);
  assert.equal(refs.externalLinks.length, 2);
});

test("iframes blijven staan met de teruggewonnen bron", () => {
  const { markdown } = convert(
    `<iframe src="https://web.archive.org/web/20240101000000if_/https://www.youtube.com/embed/abc"></iframe>`,
  );
  assert.match(markdown, /<iframe src="https:\/\/www\.youtube\.com\/embed\/abc"/);
});

test("HTML-randgevallen breken de conversie niet", () => {
  const cases = [
    `<p>Niet gesloten alinea`,
    `<ul><li>een<ul><li>diep genest</li></ul></li></ul>`,
    `<p>Tekst met &amp; &lt; &gt; &nbsp; entiteiten</p>`,
    `<div><div><div><p>Diep genest</p></div></div></div>`,
    `<img src="data:image/png;base64,iVBORw0KGgo=" alt="data-uri">`,
    `<a href="">lege href</a>`,
    `<table><tr><td>rij zonder head</td></tr></table>`,
  ];
  for (const html of cases) {
    assert.doesNotThrow(() => convert(html), `crasht op: ${html}`);
  }
});
