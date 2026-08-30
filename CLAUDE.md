# CLAUDE.md — tastycupcakes.org

## Project

Statische Astro-site voor tastycupcakes.org, gemigreerd uit een WordPress-export
in het Wayback Machine-archief. Deploy via GitHub Actions naar bunny.net.

- **Repo:** spoetnik/tastycupcakes
- **Taal:** JavaScript/TypeScript (Astro)

## Regels

- `src/content/` en `public/media/` zijn data, geen code. Niet handmatig
  aanpassen — `npm run migrate` genereert ze opnieuw en pruned wat er niet in
  de bron staat.
- URL's hebben een afsluitende slash (`trailingSlash: "always"`). Wijzigen
  breekt elke bestaande link en de 301-tabel in `migration/bunny-edge-script.js`.
- Redirects worden gegenereerd: `npm run redirects`. Het edge script niet met de
  hand bijwerken.

## Commando's

```sh
npm run dev      # lokale server
npm run build    # bouwt naar dist/
npm run verify   # migratie + build + redirects + URL-audit + tests
npm run deploy   # upload dist/ naar bunny.net (vereist BUNNY_* env vars)
```

## Security

Geen secrets in de repo. Bunny-credentials staan als GitHub repository secrets.
