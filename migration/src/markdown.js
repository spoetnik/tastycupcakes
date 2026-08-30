import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

/**
 * Eén gedeelde, deterministisch geconfigureerde converter.
 * GFM levert tabellen, doorhalingen en task lists.
 */
export function createConverter() {
  const td = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
    strongDelimiter: "**",
    linkStyle: "inlined",
    blankReplacement: (content, node) => (node.isBlock ? "\n\n" : ""),
  });
  td.use(gfm);

  // Onderschriften en iframes blijven HTML: Markdown kent ze niet en
  // omzetten naar platte tekst zou betekenis weggooien (CONTENT-MODEL.md §10.4).
  td.keep(["figure", "figcaption", "iframe"]);

  // Markdown kent geen width/height/loading. Afbeeldingen met afmetingen
  // blijven daarom HTML; zonder die attributen verspringt de layout.
  td.addRule("sizedImage", {
    filter: (node) => node.nodeName === "IMG" && node.hasAttribute("width"),
    replacement: (_content, node) => {
      const attr = (n) => (node.getAttribute(n) ? ` ${n}="${node.getAttribute(n)}"` : "");
      return `<img src="${node.getAttribute("src")}" alt="${(node.getAttribute("alt") || "").replace(/"/g, "&quot;")}"` +
        `${attr("width")}${attr("height")}${attr("loading")}${attr("decoding")}>`;
    },
  });

  // Tabellen die niet als pipe-tabel kunnen, blijven HTML in een scrollbare
  // wrapper; anders lopen brede tabellen op mobiel buiten de pagina.
  td.addRule("htmlTable", {
    filter: (node) => node.nodeName === "TABLE" && node.getAttribute("data-keep") === "html",
    replacement: (_content, node) => {
      node.removeAttribute("data-keep");
      return `\n\n<div class="table-scroll">${node.outerHTML}</div>\n\n`;
    },
  });

  // WordPress' oude caption-markup naar semantische figure.
  td.addRule("wpCaption", {
    filter: (node) =>
      node.nodeName === "DIV" && /(^|\s)wp-caption(\s|$)/.test(node.getAttribute("class") || ""),
    replacement: (content, node) => {
      const img = node.querySelector("img");
      const caption = node.querySelector(".wp-caption-text");
      if (!img) return content;
      const alt = (img.getAttribute("alt") || "").replace(/"/g, "&quot;");
      const src = img.getAttribute("src") || "";
      const attr = (n) => (img.getAttribute(n) ? ` ${n}="${img.getAttribute(n)}"` : "");
      const extra = `${attr("width")}${attr("height")}${attr("loading")}${attr("decoding")}`;
      const text = caption ? caption.textContent.trim() : "";
      return `\n\n<figure>\n  <img src="${src}" alt="${alt}"${extra}>\n${
        text ? `  <figcaption>${escapeHtml(text)}</figcaption>\n` : ""
      }</figure>\n\n`;
    },
  });

  return td;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Normaliseert witruimte zodat dezelfde input altijd hetzelfde bestand geeft. */
export function toMarkdown(td, html) {
  return td
    .turndown(html)
    .replace(/ /g, " ")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
