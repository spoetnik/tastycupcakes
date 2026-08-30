#!/usr/bin/env node
/**
 * Zet migration/redirects.json om naar deploy-klare artefacten:
 *  - redirects.csv          platte tabel, from,to,status
 *  - bunny-edge-script.js   middleware voor de bunny.net Pull Zone
 */
import fs from "node:fs";
import path from "node:path";
import { toCsv } from "./util.js";

const table = JSON.parse(fs.readFileSync("migration/redirects.json", "utf8"));
const entries = Object.entries(table.exact).sort(([a], [b]) => a.localeCompare(b));

fs.writeFileSync(
  "migration/redirects.csv",
  toCsv(
    entries.map(([from, r]) => ({ from, to: r.to ?? "", status: r.status, reason: r.reason })),
    ["from", "to", "status", "reason"],
  ),
);

const map = Object.fromEntries(entries.map(([from, r]) => [from, r.to ? [r.to, r.status] : [null, r.status]]));

const script = `// Gegenereerd door migration/src/emit-redirects.js — niet handmatig aanpassen.
// Deploy: bunny.net Edge Scripting, gekoppeld aan de Pull Zone van tastycupcakes.org.
import { servePullZone } from "bunnycdn/middleware";

/** ${entries.length} exacte regels. */
const EXACT = ${JSON.stringify(map, null, 0)};

/** ${table.patterns.length} patroonregels; volgorde is significant. */
const PATTERNS = [
${table.patterns.map((p) => `  { re: ${new RegExp(p.match).toString()}, to: ${JSON.stringify(p.to ?? null)}, status: ${p.status} },`).join("\n")}
];

function redirect(to, status) {
  return status === 410
    ? new Response(null, { status: 410 })
    : new Response(null, { status, headers: { Location: to, "Cache-Control": "max-age=3600" } });
}

function resolve(path) {
  const hit = EXACT[path];
  if (hit) return redirect(hit[0], hit[1]);
  for (const p of PATTERNS) {
    const m = path.match(p.re);
    if (!m) continue;
    const to = p.to ? p.to.replace(/\\$(\\d)/g, (_, n) => m[Number(n)] ?? "") : null;
    return redirect(to, p.status);
  }
  return null;
}

servePullZone({ url: "https://tastycupcakes.org" }).onOriginRequest((ctx) => {
  const response = resolve(new URL(ctx.request.url).pathname);
  return Promise.resolve(response ?? ctx.request);
});
`;
fs.writeFileSync("migration/bunny-edge-script.js", script);

console.log(`redirects.csv        ${entries.length} regels`);
console.log(`bunny-edge-script.js ${entries.length} exact + ${table.patterns.length} patronen (${(script.length / 1024).toFixed(0)} kB)`);
