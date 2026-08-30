import fs from "node:fs";
import sharp from "sharp";
import path from "node:path";
import { UPLOADS_PREFIX, VARIANT_RE, DOWNLOAD_EXT, IMAGE_EXT } from "./config.js";
import { walk, copyIfChanged, writeBufferIfChanged } from "./util.js";

/**
 * Index van wp-content/uploads met de variantregels uit CONTENT-MODEL.md §10.2:
 *  - origineel bestaat -> gebruik het origineel, ook als de content een variant noemt
 *  - alleen een variant bestaat -> gebruik die variant (enige overgebleven versie)
 *  - geen van beide -> meld het als ontbrekend, verzin niets
 */
export async function createMediaIndex(exportRoot) {
  const uploadsDir = path.join(exportRoot, UPLOADS_PREFIX);
  const present = new Set(
    walk(uploadsDir).map((f) => path.relative(exportRoot, f).split(path.sep).join("/")),
  );

  // Afmetingen vooraf: de conversie zet ze op elke <img>, zodat de browser
  // ruimte reserveert en de layout niet verspringt tijdens het laden.
  const sizes = new Map();
  for (const rel of present) {
    if (!IMAGE_EXT.has(path.posix.extname(rel).toLowerCase())) continue;
    try {
      const meta = await sharp(path.join(exportRoot, rel), { failOn: "none" }).metadata();
      if (meta.width && meta.height) {
        // Dezelfde bovengrens als bij het kopiëren, anders staan er afmetingen
        // in de HTML die niet bij het geleverde bestand horen.
        const MAX = 1600;
        const w = Math.min(meta.width, MAX);
        const h = meta.width > MAX ? Math.round((meta.height / meta.width) * MAX) : meta.height;
        sizes.set(rel, [w, h]);
      }
    } catch { /* onleesbaar; dan gewoon geen afmetingen */ }
  }

  const missing = new Map();   // uploadPath -> aantal referenties
  const used = new Map();      // uploadPath -> doelpad

  function originalOf(uploadPath) {
    const dir = path.posix.dirname(uploadPath);
    let base = path.posix.basename(uploadPath);
    let stripped = false;
    // Dubbele varianten komen voor: naam-300x225-150x150.jpg
    for (let m = base.match(VARIANT_RE); m; m = base.match(VARIANT_RE)) {
      base = `${m[1]}${m[4]}`;
      stripped = true;
      if (present.has(`${dir}/${base}`)) break;
    }
    return stripped ? `${dir}/${base}` : null;
  }

  function destFor(uploadPath) {
    const rel = uploadPath.slice(UPLOADS_PREFIX.length);
    const ext = path.posix.extname(rel).toLowerCase();
    if (DOWNLOAD_EXT.has(ext)) return { url: `/downloads/${path.posix.basename(rel)}`, dir: "public/downloads" };
    return { url: `/media/${rel}`, dir: "public/media" };
  }

  return {
    /** Bestaat dit uploadpad lokaal? Registreert niets. */
    has(uploadPath) {
      const clean = uploadPath.split("?")[0];
      const original = originalOf(clean);
      return present.has(clean) || Boolean(original && present.has(original));
    },

    /** @returns {{url:string|null, source:string|null, missing:boolean, note?:string}} */
    resolve(uploadPath) {
      const clean = uploadPath.split("?")[0];
      let target = clean;
      let note;

      const original = originalOf(clean);
      if (original && present.has(original)) {
        target = original;
        note = "variant vervangen door origineel";
      } else if (!present.has(clean)) {
        missing.set(clean, (missing.get(clean) || 0) + 1);
        const dest = destFor(clean);
        return { url: dest.url, source: null, missing: true, note: "bronbestand ontbreekt" };
      } else if (original && !present.has(original)) {
        note = "alleen variant beschikbaar";
      }

      const dest = destFor(target);
      used.set(target, dest);
      const size = sizes.get(target);
      return { url: dest.url, source: target, missing: false, note, width: size?.[0], height: size?.[1] };
    },

    /**
     * Kopieert alle uploads volgens de variantregels en verkleint te grote
     * afbeeldingen. De export bevat foto's tot 6 MB; die worden op een
     * archiefsite nooit breder dan de leeskolom getoond.
     */
    async copyAll(destRoot, { dryRun = false, maxWidth = 1600 } = {}) {
      const stats = { images: 0, downloads: 0, skippedVariants: 0, unreferenced: 0, resized: 0, bytesBefore: 0, bytesAfter: 0 };
      const dimensions = {};
      for (const rel of [...present].sort()) {
        const base = path.posix.basename(rel);
        const ext = path.posix.extname(base).toLowerCase();
        if (!IMAGE_EXT.has(ext) && !DOWNLOAD_EXT.has(ext)) continue;

        const original = originalOf(rel);
        if (original && present.has(original)) { stats.skippedVariants++; continue; }
        if (!used.has(rel)) stats.unreferenced++;

        const dest = destFor(rel);
        const srcPath = path.join(exportRoot, rel);
        const destPath = path.join(destRoot, dest.dir, dest.url.replace(/^\/(media|downloads)\//, ""));

        if (DOWNLOAD_EXT.has(ext)) {
          if (!dryRun) copyIfChanged(srcPath, destPath);
          stats.downloads++;
          continue;
        }

        const before = fs.statSync(srcPath).size;
        stats.bytesBefore += before;
        try {
          const image = sharp(srcPath, { failOn: "none" });
          const meta = await image.metadata();
          const resize = meta.width && meta.width > maxWidth;
          const buffer = resize
            ? await image.resize({ width: maxWidth, withoutEnlargement: true }).toBuffer()
            : fs.readFileSync(srcPath);
          if (resize) stats.resized++;
          stats.bytesAfter += buffer.length;
          dimensions[dest.url] = resize
            ? [maxWidth, Math.round((meta.height / meta.width) * maxWidth)]
            : [meta.width ?? null, meta.height ?? null];
          if (!dryRun) writeBufferIfChanged(destPath, buffer);
        } catch {
          // Onleesbare afbeelding: ongewijzigd overnemen, niet stil laten vallen.
          if (!dryRun) copyIfChanged(srcPath, destPath);
          stats.bytesAfter += before;
        }
        stats.images++;
      }
      stats.dimensions = dimensions;
      return stats;
    },

    /** Varianten die niet gekopieerd worden, met de URL van hun origineel. */
    variantRedirects() {
      const out = [];
      for (const rel of [...present].sort()) {
        const original = originalOf(rel);
        if (original && present.has(original)) out.push([rel, destFor(original).url]);
      }
      return out;
    },

    missingReferences() {
      return [...missing.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    },
    presentCount: present.size,
  };
}

/** Avatars worden op 64px getoond; 256px dekt ook schermen met hoge dichtheid. */
export async function copyAvatar(exportRoot, destRoot, uploadPath, authorSlug, dryRun) {
  const src = path.join(exportRoot, uploadPath);
  if (!fs.existsSync(src)) return null;
  const ext = path.extname(uploadPath).toLowerCase();
  const url = `/media/authors/${authorSlug}${ext}`;
  if (dryRun) return url;
  try {
    const buffer = await sharp(src, { failOn: "none" })
      .resize({ width: 256, withoutEnlargement: true })
      .toBuffer();
    writeBufferIfChanged(path.join(destRoot, "public", url.slice(1)), buffer);
  } catch {
    copyIfChanged(src, path.join(destRoot, "public", url.slice(1)));
  }
  return url;
}
