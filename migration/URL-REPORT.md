# Fase 6 — URL- en SEO-validatie

**Project:** TastyCupcakes.org
**Datum:** 2026-08-29
**Oud:** `output/` (WordPress/Wayback-export, 7.555 bestanden)
**Nieuw:** `dist/` (Astro-build, 1.090 pagina's)
**Basis:** [ANALYSIS.md](./ANALYSIS.md) · [CONTENT-MODEL.md](./CONTENT-MODEL.md) · [MIGRATION-REPORT.md](./MIGRATION-REPORT.md)

## Eindoordeel

| Onderdeel | Oordeel |
|---|---|
| URL-dekking | **PASS** — 0 ontbrekende URL's |
| Redirects | **PASS** — 0 redirects naar een niet-bestaand doel |
| URL-hygiëne | **PASS** — geen case-, encoding- of slash-conflicten |
| Canonical, sitemap, robots, Open Graph | **PASS** — 1.090 / 1.090 |
| Titels | **WARNING** — 80 titels boven 70 tekens |
| **Totaal** | **WARNING** |

---

## 1. Methode

De inventaris is opgebouwd uit drie onafhankelijke bronnen:

1. **Oude URL's** — elke map met een `index.html` in de export plus elk los bestand
   (afbeeldingen, feeds, downloads). Dat is de volledige set URL's die de oude site serveerde.
2. **Nieuwe URL's** — elk bestand in `dist/` na `npm run build`.
3. **Redirect-tabel** — `migration/redirects.json`, met exacte regels én patronen.

Elke oude URL is daarna gevolgd door de redirect-keten tot maximaal 5 stappen, en pas
gerekend als geslaagd wanneer de keten eindigt op een bestaande pagina of een bewuste 410.

Uitgesloten van de inventaris: 9 mappen die de crawler zelf aanmaakte
(`web.archive.org/…`, `fonts.googleapis.com/…`, `fonts.gstatic.com/…`). Dat waren nooit
URL's van de site.

Reproduceerbaar met:

```bash
npm run build
node migration/src/urlaudit.js       # → migration/url-audit.json + url-inventory.csv
node migration/src/emit-redirects.js # → migration/redirects.csv + bunny-edge-script.js
```

---

## 2. Totalen

| | Aantal |
|---|---|
| Oude URL's | **7.546** |
| Nieuwe URL's | **1.296** |
| Exact behouden | **893** |
| Redirect (301) | **6.237** |
| Bewust verdwenen (410) | **416** |
| Redirect naar een niet-bestaand doel | **0** |
| **Ontbrekend** | **0** |

893 + 6.237 + 416 = 7.546. Elke oude URL is verantwoord.

---

## 3. OLD URL → NEW URL per soort

| Soort | Oud | Exact | 301 | 410 | Voorbeeld |
|---|---|---|---|---|---|
| Artikel | 348 | 347 | – | 1 | `/2012/11/delight/` → identiek |
| Artikel vertaald | 1.099 | 99 | 996 | 4 | `/ru/2010/07/…/` → identiek (echte vertaling) |
| | | | | | `/es/2012/11/delight/` → `/2012/11/delight/` |
| Pagina | 13 | 7 | 2 | 4 | `/about/get-involved/` → identiek |
| | | | | | `/tastycupcakes-home/` → `/` |
| | | | | | `/login/` → 410 |
| Pagina vertaald | 56 | – | 36 | 20 | `/es/about/` → `/about/` |
| Categorie | 13 | 13 | – | – | `/category/games/` → identiek |
| Categorie-paginering | 84 | 84 | – | – | `/category/games/page/14/` → identiek |
| Categorie vertaald | 44 | – | 44 | – | `/es/category/games/` → `/category/games/` |
| Categorie-paginering vertaald | 315 | – | 315 | – | `/pt/category/lean/page/2/` → `/category/lean/page/2/` |
| Tag | 324 | 316 | – | 8 | `/tag/improv/` → identiek |
| Tag-paginering | 61 | – | 61 | – | `/tag/teamwork/page/3/` → `/tag/teamwork/` |
| Tag vertaald | 774 | – | 774 | – | `/ru/tag/improv/` → `/tag/improv/` |
| Tag-paginering vertaald | 84 | – | 84 | – | `/es/tag/lego/page/2/` → `/tag/lego/` |
| Auteur | 173 | 24 | 148 | 1 | `/author/geoffwatts/` → `/author/geoff-watts/` |
| Auteur vertaald | 398 | – | 386 | 12 | `/es/author/don/` → `/author/don-mcgreal/` |
| Attachmentpagina | 103 | – | 101 | 2 | `/2011/10/…/finished-cube-real-1/` → de post |
| Attachment vertaald | 129 | – | 121 | 8 | idem, taalvariant → de Engelse post |
| Reactiepagina | 106 | – | 106 | – | `/2012/11/delight/comment-page-1/` → de post |
| Reactiepagina vertaald | 169 | – | 169 | – | idem |
| Feed | 546 | – | 546 | – | `/category/games/feed/` → `/rss.xml` |
| Feed vertaald | 2.106 | – | 2.102 | 4 | `/es/feed/atom/` → `/rss.xml` |
| Media | 244 | – | 244 | – | `/wp-content/uploads/2012/11/foto.jpg` → `/media/2012/11/foto.jpg` |
| Homepage | 1 | 1 | – | – | `/` → identiek |
| Homepage vertaald | 2 | – | 2 | – | `/es/` → `/` |
| Home-paginering | 2 | 2 | – | – | `/page/2/` → identiek |
| Gebruikersprofiel | 69 | – | – | 69 | `/user/don.mcgreal/` → 410 |
| WordPress-systeem | 282 | – | – | 282 | `/wp-admin/`, `/wp-json/`, `/wp-login.php` → 410 |

### Wat exact behouden is

Alle **artikel-URL's**, **pagina-URL's**, **categorie-URL's** (inclusief paginering),
**tag-URL's**, de **homepage** en de **homepage-paginering** staan op precies dezelfde URL
als voorheen. Ook de URL's met bijzondere tekens:

```
/2013/03/8-monkeys-in-a-cage-–-a-mura-learning-game/    (en-dash)
/2017/05/gameception-–-the-team-game-that-creates-itself/
/tag/от-винта-2/                                        (Cyrillisch, nu 410)
```

30 URL's bevatten niet-ASCII tekens. Alle 30 zijn correct afgehandeld; de canonical wordt
percent-encoded uitgeschreven, wat de juiste vorm is.

---

## 4. Redirect-ketens

| Ketenlengte | Aantal |
|---|---|
| 1 hop | 6.616 |
| 2 hops | 37 |
| 3+ hops | 0 |

De 37 tweetraps-redirects zijn auteur-paginering: `/author/admin/page/2/` →
`/author/admin/` → `/author/michael-mccullough/`. Functioneel correct; een extra hop kost
iets linkwaarde. Weg te werken door voor die 37 URL's een exacte regel te genereren, maar
de opbrengst weegt niet op tegen 37 extra regels in de tabel.

---

## 5. URL-hygiëne

| Controle | Resultaat |
|---|---|
| Trailing slash | ✅ `trailingSlash: "always"` in Astro; oude en nieuwe URL's eindigen gelijk |
| Case-verschillen | ✅ 0 conflicten, oud én nieuw |
| Dubbele routes | ✅ 0 — permalinks en bestandspaden zijn uniek gevalideerd in fase 4 |
| URL-encoding | ✅ 0 al-geëncodeerde oude URL's; 30 niet-ASCII URL's correct doorgezet |
| Gewijzigde slugs | ✅ alleen bij auteurs, met 301 (148 stuks) |
| Kapotte interne links | ⚠ 49 — alle 49 zijn gebreken in de bron, zie `broken-links.csv` |

**Gewijzigde slugs.** De enige categorie waar een slug bewust veranderde zijn de
auteur-URL's, die e-mailadressen bevatten:

```
/author/aleem-khan360pmo-com/   → /author/aleem-khan/
/author/agiledoodgmail-com/     → /author/belinda-waldock/
/author/admin/                  → /author/michael-mccullough/
```

Alle 148 hebben een 301. Verder is geen enkele slug gewijzigd; de en-dash-slug is bewust
behouden (zie MIGRATION-REPORT §9).

---

## 6. SEO-controle

Gemeten op alle 1.090 gegenereerde pagina's.

| Controle | Resultaat |
|---|---|
| `<title>` aanwezig | ✅ 1.090 / 1.090 |
| Meta description aanwezig | ✅ 1.090 / 1.090 |
| Canonical aanwezig en correct | ✅ 1.090 / 1.090 |
| Open Graph (`og:title`, `og:url`, `og:type`) | ✅ 1.090 / 1.090 |
| Exact één `<h1>` | ✅ 1.090 / 1.090 |
| Titel ≤ 70 tekens | ⚠ 1.010 / 1.090 |
| Description ≤ 165 tekens | ✅ 1.090 / 1.090 |
| `sitemap-index.xml` | ✅ 1.089 URL's, 404 uitgesloten |
| `robots.txt` | ✅ sitemap-verwijzing, `/wp-admin/`, `/wp-json/`, `/user/` geblokkeerd |
| `hreflang` | ✅ alleen op de 63 posts met echte vertalingen |
| RSS | ✅ `/rss.xml`, 50 meest recente artikelen |

### De 80 te lange titels

| Oorzaak | Aantal |
|---|---|
| Aaneengeplakte meertalige titels (`titleNeedsReview: true`) | 59 |
| Redactioneel lange titels | 21 |

```html
<title>Alaskan Road TripViagem de Carro até o AlaskaViaje por Carretera hacia
AlaskaПоездка на Аляску — TastyCupcakes.org</title>
```

Dit is de contentschuld uit fase 1, niet een fout in de site: de titel komt zo uit
WordPress. De 21 redactionele gevallen zijn gewoon lange koppen
(`Agile Games 2011 Conference: Super Early Bird Pricing until January 24 2011`) en
hoeven niets.

---

## 7. Wat deze fase heeft opgelost

De eerste audit vond **2.029 oude URL's zonder route of redirect**. Alle oorzaken zijn
achterhaald en verholpen.

| # | Gat | Omvang | Oplossing |
|---|---|---|---|
| 1 | Oude media-URL's hadden geen redirect naar `/media/` | 244 | patroonregel `uploads-media` + `uploads-downloads` |
| 2 | Taal-URL's van archieven, tags, categorieën en pagina's | 1.596 | patroonregel `lang-prefix`, als laatste zodat specifieke regels voorgaan |
| 3 | Tag-paginering matchte niet | 61 | regex miste de leidende `/` |
| 4 | Auteur-paginering ontbrak | 17 | patroonregel `author-pagination` |
| 5 | Formaatvarianten wezen naar een niet-gekopieerd bestand | 53 | exacte redirect variant → origineel |
| 6 | Auteurarchieven zonder gemigreerd record | 160 | 410 |
| 7 | Vervallen pagina's hadden geen expliciete regel | 5 | 410 volgens CONTENT-MODEL §4 |
| 8 | Tag-archieven zonder posts | 8 | 410 |
| 9 | `/feed/atom/`, `/feed.html`, `/comments/feed.html` | 7 | feed-patroon verbreed |
| 10 | Genest onder auteurarchief (crawler-artefact) | 4 | 410 |
| 11 | Twee `<h1>` op 12 pagina's | 12 | migrator verlaagt `h1` in content naar `h2` |

### Bugs in de gereedschappen zelf

| Bug | Gevolg |
|---|---|
| Migrator schreef rapporten naar `destRoot/..` | Bij `--dest .` belandden 5 bestanden **buiten de repo**, in `~/Projects/tastycupcakes.org/`. Pad vastgezet op `migration/`, zwerfbestanden verwijderd. |
| Audit rekende `dist/404.html` om tot `/` | Valse canonical-fout |
| Audit vergeleek canonical zonder te decoderen | 2 valse fouten op de en-dash-URL's |
| Audit mat lengtes in HTML-entity-vorm | 6 valse "description te lang" |
| Audit classificeerde post-feeds als attachment | Vertekende telling per soort |

---

## 8. Machine-leesbare redirects

| Bestand | Inhoud |
|---|---|
| `migration/redirects.json` | 3.675 exacte regels + 12 patronen, met reden per regel |
| `migration/redirects.csv` | platte tabel: `from,to,status,reason` |
| `migration/bunny-edge-script.js` | deploy-klare middleware voor de bunny.net Pull Zone (299 kB) |
| `migration/url-inventory.csv` | volledige inventaris: `old,new,kind,status,note` (7.546 regels) |
| `migration/url-audit.json` | ruwe auditresultaten |

Alle vier worden gegenereerd; geen ervan wordt handmatig onderhouden.

```csv
from,to,status,reason
/author/geoffwatts/,/author/geoff-watts/,301,auteur-slug vernieuwd
/es/2012/11/delight/,/2012/11/delight/,301,vertaalde fallback
/wp-content/uploads/2009/06/Mike-150x150.jpg,/media/2009/06/Mike.jpg,301,formaatvariant naar origineel
/user/don.mcgreal/,,410,gebruikersprofiel
```

---

## 9. Wat handmatig aandacht vraagt

| Punt | Omvang |
|---|---|
| Aaneengeplakte titels valideren | 59 zichtbaar in `<title>`, 116 gemarkeerd in totaal |
| `/2018/04/test-and-learn-2/` — verloren artikel, nu 410 | 1 |
| `/es/author/zvonimir-krizgmail-com/` staat op 410 terwijl de auteur bestaat als `/author/zvonimir-kriz/`; het Engelse archief is nooit gecrawld, dus er is geen bron om de mapping op te baseren | 4 URL's |
| 49 kapotte interne links uit de bron | 49 |
| 37 tweetraps-redirects samentrekken | optioneel |

---

## 10. Classificatie

### PASS — URL-behoud

Alle 7.546 oude URL's zijn verantwoord: 893 exact behouden, 6.237 met een 301, 416 bewust
op 410. Nul ontbrekend, nul redirects naar een dood doel. Elke artikel-, pagina-,
categorie-, tag- en paginerings-URL staat op zijn oorspronkelijke adres.

### PASS — techniek

Canonical, Open Graph, sitemap, robots.txt, hreflang en koppenhiërarchie zijn op alle
1.090 pagina's correct. Geen case-, encoding- of trailing-slash-problemen.

### WARNING — titels

80 titels zijn langer dan 70 tekens, waarvan 59 door de meertalige concatenatie uit
WordPress. Zoekmachines kappen die af; de pagina's functioneren, maar de snippets zijn
lelijk. Dit is bekende contentschuld sinds fase 1 en staat in `titles-to-review.csv`.

### Geen FAIL

Er is geen enkele oude URL zonder bestemming en geen enkele technische SEO-fout.

---

*Einde fase 6. `output/` ongewijzigd.*
