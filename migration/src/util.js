import fs from "node:fs";
import path from "node:path";

/** Slug volgens de conventie uit CONTENT-MODEL.md §7. */
export function slugify(input) {
  return String(input)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Schrijft alleen als de inhoud verandert. Dat maakt de migratie idempotent:
 * dezelfde input geeft niet alleen dezelfde output, maar ook dezelfde mtimes.
 * @returns {"created"|"updated"|"unchanged"}
 */
export function writeIfChanged(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    if (fs.readFileSync(file, "utf8") === content) return "unchanged";
    fs.writeFileSync(file, content);
    return "updated";
  }
  fs.writeFileSync(file, content);
  return "created";
}

/** Idem voor binaire bestanden, vergelijkt op grootte en inhoud. */
export function copyIfChanged(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) {
    const a = fs.statSync(src), b = fs.statSync(dest);
    if (a.size === b.size && fs.readFileSync(src).equals(fs.readFileSync(dest))) return "unchanged";
  }
  fs.copyFileSync(src, dest);
  return "copied";
}

/** Idem voor een buffer die in het geheugen is opgebouwd. */
export function writeBufferIfChanged(dest, buffer) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.readFileSync(dest).equals(buffer)) return "unchanged";
  fs.writeFileSync(dest, buffer);
  return "written";
}

/** Alle bestanden onder dir, gesorteerd — sortering maakt de run deterministisch. */
export function walk(dir, filter = () => true) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, filter));
    else if (filter(full)) out.push(full);
  }
  return out;
}

export function toCsv(rows, header) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [header.join(","), ...rows.map((r) => header.map((h) => esc(r[h])).join(","))].join("\n") + "\n";
}
