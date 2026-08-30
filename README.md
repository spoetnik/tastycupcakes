# tastycupcakes.org

Statische Astro-site, gemigreerd vanuit de WordPress-export in het Wayback
Machine-archief.

## Draaien

```sh
npm install
npm run dev      # lokale server
npm run build    # bouwt naar dist/
npm run verify   # migratie opnieuw draaien + build + URL-audit + tests
```

## Deploy

Push naar `main` → GitHub Actions bouwt de site en uploadt `dist/` naar de
bunny.net Storage Zone, daarna een purge van de Pull Zone. Zie
`.github/workflows/deploy.yml` en `scripts/deploy-bunny.mjs`.

Benodigde repository secrets:

| Secret | Waar te vinden |
| --- | --- |
| `BUNNY_STORAGE_ENDPOINT` | hostname van de storage regio, bv. `storage.bunnycdn.com` |
| `BUNNY_STORAGE_ZONE` | naam van de Storage Zone |
| `BUNNY_STORAGE_PASSWORD` | Storage Zone → FTP & API Access → Password |
| `BUNNY_API_KEY` | Account Settings → API → API Key |
| `BUNNY_PULLZONE_ID` | numeriek ID van de Pull Zone |

De 301-redirects van de oude WordPress-URL's draaien als bunny.net Edge Script:
`migration/bunny-edge-script.js`, gegenereerd door `npm run redirects`.

## Mappen

- `src/` — Astro-site: content collections, layouts, pages
- `public/` — media en downloads, één-op-één uit het archief
- `migration/` — migratiepipeline, rapporten en audits (`out/` is niet getrackt)
