/** Verzamelt tellingen, warnings en errors. Niets wordt stil overgeslagen. */
export function createReport() {
  const counts = {};
  const warnings = [];
  const errors = [];
  const lists = { noAuthor: [], noCategory: [], missingImages: [], brokenLinks: [], titlesToReview: [], externalImages: [], unmigratable: [] };

  return {
    counts, warnings, errors, lists,
    bump(key, n = 1) { counts[key] = (counts[key] || 0) + n; },
    warn(code, subject, detail) { warnings.push({ code, subject, detail }); },
    error(code, subject, detail) { errors.push({ code, subject, detail }); },
    list(name, value) { lists[name].push(value); },

    print(log = console.log) {
      const line = (k, v) => log(`  ${String(v).padStart(6)}  ${k}`);
      log("\n── Migratie ────────────────────────────────────");
      for (const k of Object.keys(counts).sort()) line(k, counts[k]);
      log("\n── Kwaliteit ───────────────────────────────────");
      line("posts niet migreerbaar (410)", lists.unmigratable.length);
      line("content zonder auteur", lists.noAuthor.length);
      line("content zonder categorie", lists.noCategory.length);
      line("ontbrekende afbeeldingen", lists.missingImages.length);
      line("gebroken interne links", lists.brokenLinks.length);
      line("titels handmatig na te kijken", lists.titlesToReview.length);
      line("externe afbeeldingen (niet lokaal)", lists.externalImages.length);
      log("\n── Meldingen ───────────────────────────────────");
      line("warnings", warnings.length);
      line("errors", errors.length);
      const byCode = {};
      for (const w of warnings) byCode[w.code] = (byCode[w.code] || 0) + 1;
      for (const code of Object.keys(byCode).sort()) log(`          ${code}: ${byCode[code]}`);
      for (const e of errors.slice(0, 20)) log(`  ERROR  ${e.code}  ${e.subject}  ${e.detail ?? ""}`);
      if (errors.length > 20) log(`  … en nog ${errors.length - 20} errors, zie migration/report.json`);
      log("");
    },

    toJSON() {
      return {
        counts,
        quality: Object.fromEntries(Object.entries(lists).map(([k, v]) => [k, v.length])),
        warnings, errors, lists,
      };
    },
  };
}
