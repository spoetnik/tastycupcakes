// Upload dist/ naar een bunny.net Storage Zone en purge daarna de Pull Zone.
// Env: BUNNY_STORAGE_ENDPOINT, BUNNY_STORAGE_ZONE, BUNNY_STORAGE_PASSWORD,
//      BUNNY_API_KEY, BUNNY_PULLZONE_ID
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const env = {
  // Accepteert zowel "storage.bunnycdn.com" als "https://storage.bunnycdn.com/".
  host: process.env.BUNNY_STORAGE_ENDPOINT?.replace(/^https?:\/\//, "").replace(/\/+$/, ""),
  zone: process.env.BUNNY_STORAGE_ZONE,
  key: process.env.BUNNY_STORAGE_PASSWORD,
  apiKey: process.env.BUNNY_API_KEY,
  pullZone: process.env.BUNNY_PULLZONE_ID,
};
for (const [name, value] of Object.entries(env)) {
  if (!value) throw new Error(`Ontbrekende env var: ${name}`);
}

const entries = await readdir("dist", { recursive: true, withFileTypes: true });
const files = entries
  .filter((e) => e.isFile())
  .map((e) => relative("dist", join(e.parentPath, e.name)));

// ponytail: volledige upload, geen diff met wat er al in de zone staat, en
// verwijderde pagina's blijven achter. Ga pas diffen/opruimen als de deploy
// merkbaar traag wordt of oude URL's echt in de weg zitten.
async function worker(queue) {
  for (let file = queue.pop(); file; file = queue.pop()) {
    const path = file.split("/").map(encodeURIComponent).join("/");
    const res = await fetch(`https://${env.host}/${env.zone}/${path}`, {
      method: "PUT",
      headers: { AccessKey: env.key },
      body: await readFile(join("dist", file)),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} bij ${file}`);
  }
}

const total = files.length;
await Promise.all(Array.from({ length: 16 }, () => worker(files)));
console.log(`${total} bestanden geüpload naar ${env.zone}`);

const purge = await fetch(
  `https://api.bunny.net/pullzone/${env.pullZone}/purgeCache`,
  { method: "POST", headers: { AccessKey: env.apiKey } },
);
if (!purge.ok) throw new Error(`Purge mislukte: ${purge.status}`);
console.log("Pull zone gepurged");
