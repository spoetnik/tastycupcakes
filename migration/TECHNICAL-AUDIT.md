# Fase 8 — Technische audit

**Project:** TastyCupcakes.org
**Datum:** 2026-08-29
**Build:** Astro 7.2.9, statisch, geen adapter
**Reproduceerbaar met:** `npm run verify`

## Eindoordeel

| Gebied | Oordeel |
|---|---|
| Build | **PASS** |
| Performance | **PASS** — met één zware pagina als aandachtspunt |
| HTML | **PASS** |
| SEO | **PASS** — titels blijven een WARNING |
| Accessibility | **WARNING** — 143 afbeeldingen zonder alt-tekst |
| **Totaal** | **WARNING** |

Geen FAIL. De twee resterende WARNINGs zijn contentschuld uit de WordPress-export, geen
technische gebreken van de site.

---

## 1. Build

| Controle | Resultaat |
|---|---|
| `npm run build` | ✅ slaagt |
| Errors | ✅ 0 |
| Warnings | ✅ 0 |
| Gegenereerde pagina's | ✅ 1.090 |
| Bouwtijd | 8 s |
| Alle routes gegenereerd | ✅ 454 permalinks + 13 categorieën + 105 categoriepagina's + 316 tags + 165 auteurs + 34 pagineringspagina's + 3 |
| Schema-validatie | ✅ een fout in frontmatter breekt de build met veld en verwachte waarde |

### Eén commando voor de hele keten

`npm run verify` draait migratie → build → redirect-artefacten → URL-audit → tests, en stopt
bij de eerste fout:

```
3675 redirects (exact) · 1090 pagina's gebouwd · 3675 redirect-regels
FAILs totaal: 0 · tests 33/33
```

**Waarom dit nodig was.** Tijdens deze fase draaide de URL-audit een keer op een verouderde
`redirects.json` van een eerder afgebroken run, en meldde 820 fouten die er niet waren. Losse
stappen kunnen uit de pas lopen; één keten kan dat niet.

Daarnaast stopte de migrator eerder met exitcode 1 op de enige onmigreerbare post
(`/2018/04/test-and-learn-2/`). Dat is een bewust afgehandelde situatie — de URL krijgt een
410 — en telt nu als luide waarschuwing in plaats van als fout. Onafgehandeld verlies is nog
steeds een harde fout.

---

## 2. Performance

| Meting | Waarde |
|---|---|
| HTML totaal | 8,1 MB over 1.090 pagina's, gemiddeld 7,6 kB |
| **Client-side JavaScript** | **0 bestanden, 0 bytes** |
| CSS | 1 bestand, 4,4 kB |
| Webfonts | 0 — alleen systeemfonts en Georgia |
| Afbeeldingen | 188 bestanden, 27 MB |
| Downloads (PDF/PPTX) | 13 bestanden, 27 MB |
| Mediane paginagewicht (HTML+CSS+afbeeldingen) | **11 kB** |
| 90e percentiel | 27 kB |
| Zwaarste pagina | 3,86 MB (`/2012/03/ouija-board-estimation/`) |

### Geen JavaScript

Astro levert standaard geen client-side JS en er is geen enkele `client:`-directive gebruikt.
De enige `<script>` in de output is het JSON-LD-blok, dat data is en niet wordt uitgevoerd.

### Afbeeldingen — verbeterd in deze fase

| | Voor | Na |
|---|---|---|
| Totale omvang | 51 MB | **27 MB** |
| Grootste bestand | 6,2 MB | **1,4 MB** |
| Bestanden > 1 MB | 7 | 1 |
| `loading="lazy"` | 148 (alleen avatars) | **219** |
| `width` + `height` | 148 | **192** |

Zestien afbeeldingen zijn verkleind naar maximaal 1.600 px breed. De aanleiding was concreet:
`michael-mccullough.jpg` was 6,2 MB en werd als avatar van 64×64 px getoond. Avatars gaan nu
naar 256 px.

Elke afbeelding krijgt `decoding="async"`; alles behalve de eerste afbeelding van een pagina
krijgt `loading="lazy"` — de eerste is doorgaans het LCP-element en wordt niet uitgesteld.
`width` en `height` staan erop waar de afmetingen bekend zijn, zodat de browser ruimte
reserveert en de layout niet verspringt.

| Aandachtspunt | Toelichting |
|---|---|
| Formaten blijven JPG/PNG | WebP of AVIF zou ~30% schelen, maar verandert de bestandsnaam en dus 244 media-redirects uit fase 6. Niet gedaan zonder aanleiding. |
| `/2012/03/ouija-board-estimation/` is 3,86 MB | Eén pagina met veel grote foto's. Alle afbeeldingen behalve de eerste laden lui, dus de eerste weergave is licht. Verder verkleinen kan, maar kost beeldkwaliteit op een archief van workshopmateriaal. |
| 172 afbeeldingen zonder `width`/`height` | Extern gehoste afbeeldingen; hun afmetingen zijn niet bekend zonder ze op te halen. |

### CSS en fonts

Eén stylesheet van 4,4 kB, geen preprocessor, geen framework. Geen enkel webfont: de body
gebruikt de systeem-UI-stack, koppen Georgia met fallbacks. Geen netwerkverzoek voor
typografie, dus geen FOUT/FOIT.

---

## 3. HTML

| Controle | Resultaat |
|---|---|
| Semantische landmarks | ✅ `header`, `nav`, `main`, `article`, `aside`, `footer` |
| Koppenhiërarchie | ✅ exact één `<h1>` op alle 1.090 pagina's, daarna h2 → h3 |
| `lang`-attribuut | ✅ per pagina; vertalingen krijgen `lang="ru"` etc. |
| Viewport | ✅ `width=device-width, initial-scale=1` |
| Canonical | ✅ 1.090 / 1.090, correct en percent-encoded waar nodig |
| `alt` aanwezig | ✅ 364 / 364 — geen enkele `<img>` zonder `alt` |
| Links met tekst | ✅ 0 links zonder toegankelijke naam |
| `target="_blank"` zonder `rel` | ✅ 0 |
| Buttons vs. links | ✅ geen `<button>` gebruikt voor navigatie |

Koppen binnen tabelcellen zijn in fase 7 omgezet naar `<strong>`; die hoorden niet in de
documentstructuur.

---

## 4. SEO

| Controle | Resultaat |
|---|---|
| `sitemap-index.xml` → `sitemap-0.xml` | ✅ 1.089 URL's, 404 uitgesloten |
| `robots.txt` | ✅ sitemap-verwijzing; `/wp-admin/`, `/wp-json/`, `/user/` geblokkeerd |
| `<title>` | ✅ 1.090 / 1.090 |
| Meta description | ✅ 1.090 / 1.090, alle ≤ 165 tekens |
| Open Graph | ✅ `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, `og:locale` |
| Twitter card | ✅ |
| `hreflang` | ✅ alleen op de 63 posts met echte vertalingen |
| RSS | ✅ `/rss.xml`, 50 recentste artikelen |
| **Structured data** | ✅ JSON-LD op 454 pagina's |
| Titels ≤ 70 tekens | ⚠ 1.010 / 1.090 |

### Structured data — toegevoegd in deze fase

Elke post en pagina krijgt een `@graph` met:

- **Article** (of **WebPage**): headline, description, `inLanguage`, `datePublished`,
  `dateModified`, auteur met URL, afbeelding, `isPartOf` de website, en `license` die naar
  CC BY 4.0 wijst;
- **BreadcrumbList**: Home → categorie → artikel.

Relevant voor deze site: het is een archief van workshopspellen waarvan auteurschap en datum
inhoudelijk meetellen, en de licentie is expliciet.

### De 80 lange titels

59 komen door de aaneengeplakte meertalige titels uit WordPress, 21 zijn gewoon lange koppen.
Bekende contentschuld sinds fase 1, staat in `titles-to-review.csv`. Geen technische fout.

---

## 5. Accessibility

| Controle | Resultaat |
|---|---|
| Skip-link | ✅ toegevoegd, zichtbaar bij focus |
| Focus-states | ✅ `:focus-visible` met 3px accentkleur en offset |
| Toetsenbordnavigatie | ✅ alleen native links; geen tabindex-vallen, geen JS-handlers |
| Semantische elementen | ✅ landmarks aanwezig, lijsten als lijsten, tabellen met `th` |
| Contrast (WCAG AA) | ✅ alle combinaties gemeten |
| `alt` aanwezig | ✅ 100% |
| **Betekenisvolle alt-tekst** | ⚠ 73 van 364 |

### Contrast

| Combinatie | Ratio | Oordeel |
|---|---|---|
| Tekst op achtergrond | 15,82 | AA + AAA |
| Gedempte tekst op achtergrond | 6,75 | AA + AAA |
| Accentkleur op achtergrond | 5,66 | AA |
| Accentkleur op kaart | 5,91 | AA |
| Accentkleur op badge-achtergrond | 4,97 | AA |

### Toegevoegd in deze fase

Er waren geen focus-regels: de standaardoutline verdwijnt op sommige elementen en is slecht
zichtbaar op de accentkleur. Toetsenbordgebruikers konden niet zien waar ze waren. Er is nu
een expliciete `:focus-visible`-ring en een skip-link naar de inhoud.

### De lege alt-teksten

291 van 364 afbeeldingen hebben `alt=""`. Daarvan zijn **148 auteur-avatars**, waar een lege
alt correct is: de naam staat er direct naast, een alt zou die verdubbelen.

Blijven over: **143 content-afbeeldingen zonder alt-tekst**. De WordPress-export bevat die
tekst niet, en de migrator verzint hem niet — een verkeerde alt-tekst is schadelijker dan een
lege. Dit is de enige echte toegankelijkheidsschuld en vraagt redactioneel werk.

---

## 6. Wijzigingen in deze fase

Alleen wijzigingen met aantoonbare aanleiding.

| Wijziging | Bewijs dat het nodig was |
|---|---|
| Afbeeldingen verkleinen naar max. 1.600 px, avatars naar 256 px | 6,2 MB avatar op 64×64 px; media 51 → 27 MB |
| `loading="lazy"` + `decoding="async"` op alle afbeeldingen behalve de eerste | 226 content-afbeeldingen laadden allemaal direct |
| `width`/`height` uit de bron-afmetingen | zonder afmetingen verspringt de layout tijdens het laden |
| `:focus-visible`-ring | er was geen enkele focus-regel |
| Skip-link | er was geen manier om de navigatie over te slaan |
| JSON-LD Article + BreadcrumbList | er was geen structured data |
| `wp-image-*` en `fetchpriority` uit de content strippen | WordPress-resten in de uitvoer |
| `npm run verify` als één keten | een audit draaide op een verouderd artefact en meldde 820 valse fouten |
| Onmigreerbare post = waarschuwing + 410 in plaats van fout | de keten kon niet doorlopen op een bewust afgehandeld geval |

### Verworpen wijziging

Voor het toevoegen van beeldattributen lag een rehype-plugin voor de hand. Astro 7 gebruikt
standaard een nieuwe Markdown-processor; rehype-plugins vereisen `@astrojs/markdown-remark`,
wat de processor terugzet op unified. Na die wissel veranderde de rendering meetbaar: het
aantal koppen ging van 890 naar 865 zonder dat de content wijzigde.

Daarom teruggedraaid. De attributen worden nu door de migrator geschreven, waarmee de
gevalideerde rendering intact blijft en er geen extra dependency bijkomt.

---

## 7. Openstaand

| Punt | Omvang | Aard |
|---|---|---|
| Alt-teksten schrijven | 143 afbeeldingen | redactioneel |
| Aaneengeplakte titels valideren | 59 zichtbaar, 116 gemarkeerd | redactioneel |
| Ontbrekende afbeeldingen | 16 | bron |
| `/2012/03/ouija-board-estimation/` verder verkleinen | 1 pagina, 3,86 MB | afweging kwaliteit vs. gewicht |
| WebP/AVIF | 188 bestanden | vereist 244 extra redirects |
| Externe afbeeldingen controleren | 12 op 2 pagina's | vraagt netwerktoegang |

---

## 8. Deploybaarheid

| | |
|---|---|
| Output | `dist/`, volledig statisch |
| Server-runtime | geen |
| Redirects | `migration/bunny-edge-script.js`, 3.675 exacte regels + 12 patronen |
| Hosting | bunny.net Storage + Pull Zone |
| Te controleren bij deploy | of de Edge Rule-actie "Redirect To URL" een 301 of 302 stuurt (zie URL-REPORT §11.3) |

---

*Einde fase 8.*
