import {
  STRIP_SELECTORS, STRIP_CLASS_PATTERNS, KEEP_CLASSES,
  NON_CONTENT_IMAGE,
} from "./config.js";
import { resolveRef } from "./links.js";

/**
 * De eerste afbeelding is doorgaans het grootste element boven de vouw; die
 * niet uitstellen. De rest wel.
 */
function applyImageAttrs(img, res, index) {
  img.attr("decoding", "async");
  if (index > 1) img.attr("loading", "lazy");
  if (res.width && res.height) {
    img.attr("width", String(res.width));
    img.attr("height", String(res.height));
  }
}

/**
 * Schoont de contentcontainer op en herschrijft alle verwijzingen.
 * Muteert de cheerio-node; geeft de verzamelde verwijzingen terug zodat de
 * aanroeper kan rapporteren in plaats van stilzwijgend iets te laten vallen.
 */
export function clean($, container, sourceRel, mediaIndex) {
  let imageIndex = 0;
  let pendingAttrs = {};
  const refs = { uploads: [], externalImages: [], internalLinks: [], externalLinks: [], iframes: [] };

  container.find(STRIP_SELECTORS.join(",")).remove();

  container.find("img").each((_, el) => {
    const img = $(el);
    const src = img.attr("src");
    if (!src) { img.remove(); return; }
    if (NON_CONTENT_IMAGE.some((re) => re.test(src))) { img.remove(); return; }
    imageIndex++;
    pendingAttrs = {};
    const ref = resolveRef(src, sourceRel);
    if (ref.kind === "upload") {
      const res = mediaIndex.resolve(ref.value);
      refs.uploads.push({ upload: ref.value, ...res });
      img.attr("src", res.url);
      pendingAttrs = res;
    } else if (ref.kind === "external") {
      // Een externe URL kan naar een oude host van deze site wijzen. Als het
      // bestand lokaal bestaat, is de lokale kopie beter dan een externe link.
      const local = ref.value.match(/\/wp-content\/uploads\/(.+)$/);
      const asUpload = local ? `wp-content/uploads/${local[1].split("?")[0]}` : null;
      if (asUpload && mediaIndex.has(asUpload)) {
        const res = mediaIndex.resolve(asUpload);
        refs.uploads.push({ upload: asUpload, ...res });
        img.attr("src", res.url);
        pendingAttrs = res;
      } else {
        refs.externalImages.push(ref.value);
        img.attr("src", ref.value);
        pendingAttrs = {};
      }
    } else if (ref.kind === "internal") {
      // Een attachmentpagina als src is nooit een afbeelding.
      refs.externalImages.push(ref.value);
      img.attr("src", ref.value);
      pendingAttrs = {};
    }
    for (const attr of ["srcset", "sizes", "data-src", "data-srcset", "fetchpriority", "loading", "decoding", "width", "height"]) {
      img.removeAttr(attr);
    }
    // Pas ná het opschonen zetten, anders worden ze meteen weer verwijderd.
    applyImageAttrs(img, pendingAttrs, imageIndex);
    if (!img.attr("alt")) img.attr("alt", "");
  });

  container.find("a[href]").each((_, el) => {
    const a = $(el);
    const ref = resolveRef(a.attr("href"), sourceRel);
    if (ref.kind === "internal") {
      refs.internalLinks.push(ref.value);
      a.attr("href", ref.value);
    } else if (ref.kind === "upload") {
      const res = mediaIndex.resolve(ref.value);
      refs.uploads.push({ upload: ref.value, ...res });
      a.attr("href", res.url);
    } else if (ref.kind === "external") {
      refs.externalLinks.push(ref.value);
      a.attr("href", ref.value);      // teruggewonnen uit de Wayback-URL
    }
  });

  container.find("iframe[src]").each((_, el) => {
    const frame = $(el);
    const ref = resolveRef(frame.attr("src"), sourceRel);
    refs.iframes.push(ref.value);
    frame.attr("src", ref.value);
  });

  // Tabelnormalisatie. De export bevat layout-tabellen en tabellen zonder
  // rijen (32 losse <col>-elementen); turndown-plugin-gfm crasht daarop.
  container.find("colgroup, col").remove();
  container.find("table").each((_, el) => {
    const table = $(el);
    if (table.find("tr").length === 0) {
      const inner = table.html();
      if (inner && table.text().trim()) table.replaceWith(`<div>${inner}</div>`);
      else table.remove();
    }
  });
  container.find("tr").each((_, el) => {
    if ($(el).closest("table").length === 0) $(el).remove();
  });

  // Een GFM-pipe-tabel kan alleen inline-inhoud bevatten. Cellen met blokken
  // (<p>, lijsten, <br>) leveren anders kapotte Markdown op zoals "| 1 | 0.54</p>".
  // Zulke tabellen blijven daarom HTML.
  container.find("table").each((_, el) => {
    const table = $(el);
    let needsHtml = false;
    table.find("td, th").each((_, cell) => {
      const node = $(cell);
      // Losse alinea's in een cel zijn plat te slaan; de rest niet.
      node.find("p").each((_, p) => {
        const inner = $(p).html();
        $(p).replaceWith(inner ? `${inner} ` : "");
      });
      // Een kop in een tabelcel is opmaak, geen documentstructuur.
      node.find("h1, h2, h3, h4, h5, h6").each((_, h) => {
        const inner = $(h).html();
        $(h).replaceWith(`<strong>${inner ?? ""}</strong>`);
      });
      if (node.find("ul, ol, table, pre, br, div").length) needsHtml = true;
    });
    if (needsHtml) table.attr("data-keep", "html");
  });

  // De paginatitel is de h1 van de pagina; een h1 in de body zou een tweede
  // top-level kop opleveren en de koppenhiërarchie breken.
  container.find("h1").each((_, el) => {
    const node = $(el);
    node.replaceWith(`<h2>${node.html() ?? ""}</h2>`);
  });

  container.find("[style]").removeAttr("style");
  container.find("[class]").each((_, el) => {
    const node = $(el);
    const kept = (node.attr("class") || "")
      .split(/\s+/)
      .filter(Boolean)
      .filter((c) => KEEP_CLASSES.has(c) || !STRIP_CLASS_PATTERNS.some((re) => re.test(c)));
    if (kept.length) node.attr("class", kept.join(" "));
    else node.removeAttr("class");
  });
  container.find("[id], [data-id], [align], [border], [cellpadding], [cellspacing]").each((_, el) => {
    for (const a of ["id", "data-id", "align", "border", "cellpadding", "cellspacing"]) $(el).removeAttr(a);
  });

  // Lege alinea's en spans die na het strippen overblijven.
  let changed = true;
  while (changed) {
    changed = false;
    container.find("p, span, div, em, strong").each((_, el) => {
      const node = $(el);
      if (node.find("img, iframe, br, hr, table, video, audio").length) return;
      if (node.text().replace(/ /g, " ").trim() === "") { node.remove(); changed = true; }
    });
  }

  return refs;
}
