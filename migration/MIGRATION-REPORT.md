# Fase 4 — Migratierapport

**Project:** TastyCupcakes.org
**Datum:** 2026-08-29
**Bron:** `output/` (7.555 bestanden, 254 MB)
**Doel:** `migration/out/`
**Basis:** [ANALYSIS.md](./ANALYSIS.md) · [CONTENT-MODEL.md](./CONTENT-MODEL.md) · [README.md](./README.md)

## Eindoordeel: **WARNING**

Geen onverklaarde contentverschillen. Elke bron-URL is aantoonbaar gemigreerd, geredirect of
bewust op 410 gezet. Geen `PASS`, omdat één post inhoudelijk verloren is en er handwerk
openstaat dat de migrator niet kan afmaken. Onderbouwing in §8.

---

## 1. Uitgevoerde run

### Pre-checks

| Controle | Resultaat |
|---|---|
| Input-directory `output/` bestaat | ✅ 7.555 bestanden, 254 MB |
| Input herkend als de WordPress-export | ✅ `index.html`, `wp-content/`, `wp-json/` aanwezig |
| Output-directory | ✅ `migration/out/` — niet `output/`, niet de repo-root |
| Doelmap leeggemaakt vóór de run | ✅ schone run, geen restanten van eerdere runs |

### Commando's

```bash
rm -rf migration/out
node migration/src/index.js       # migratie
node migration/src/validate.js    # onafhankelijke validatie
npm test                          # 33 tests
```

De validator telt zelf opnieuw uit de export én uit de output. Hij gebruikt bewust **niet**
het rapport van de migrator, zodat een fout in de migrator hier zichtbaar wordt in plaats van
zichzelf te bevestigen.

### De export is niet gewijzigd

```
vóór de run:  43680d5d789c2262f18b71dbdad602f22e68da36ac196ff24eaac3f0bd958157
ná de run:    43680d5d789c2262f18b71dbdad602f22e68da36ac196ff24eaac3f0bd958157
```

SHA-256 over alle padnamen en bestandsgroottes in `output/`. Identiek. De test
`de originele export wordt nooit gewijzigd` controleert dit bovendien op mtime-niveau.

### Reproduceerbaar

Tweede run direct na de eerste: **0 nieuw, 0 gewijzigd, 622 ongewijzigd.** Byte-identiek.

| Controle | Resultaat |
|---|---|
| Tests | 33 / 33 geslaagd |
| Validator FAILs | 0 |
| Validator WARNINGs | 19 |
| Migrator errors | 1 |

---

## 2. Content

### WordPress (bron)

| | Aantal |
|---|---|
| Artikelen (EN) | **349** |
| Artikelen (es / fr / pt / ru) | 274 / 275 / 275 / 275 = **1.099** |
| Pagina-URL's | **14** |
| Auteurs (archiefmappen) | **163** |
| Categorieën | **13** |
| Tags (archiefmappen) | **324** |

Aanvullend in de bron: 232 attachmentpagina's, 280 reactiepagina's, 2.647 feed-URL's,
69 gebruikersprofielen.

> **Let op — 349, niet 348.** Fase 1 telde 348 Engelse posts door te tellen hoeveel
> `/YYYY/MM/slug/index.html`-bestanden er zijn. Dat mist één post: zie §7.1.

### Gemigreerd

| | Aantal |
|---|---|
| Artikelen (EN) | **348** |
| Artikelen (es / fr / pt / ru) | 24 / 12 / 23 / 40 = **99** |
| Pagina's | **7** |
| Auteurs | **165** |
| Categorieën | **13** |
| Tags (in gebruik) | **316** |

Totaal 447 Markdown-artikelen, 7 pagina's, 165 auteursrecords, 622 bestanden inclusief media.

### Reconciliatie per URL

Elke bron-URL is gecontroleerd: gemigreerd, geredirect, of 410. Niet als saldo, maar per URL.

| Taal | Bron | Gemigreerd | → 301 | → 410 | **Onverklaard** |
|---|---|---|---|---|---|
| en | 349 | 348 | 0 | 1 | **0** |
| es | 274 | 24 | 249 | 1 | **0** |
| fr | 275 | 12 | 262 | 1 | **0** |
| pt | 275 | 23 | 251 | 1 | **0** |
| ru | 275 | 40 | 234 | 1 | **0** |

**Nul onverklaarde post-URL's.** De grote aantallen 301's zijn de bevestigde vertaalregel uit
CONTENT-MODEL §1: taal-URL's die Engelse tekst tonen worden een redirect, geen bestand.

---

## 3. Media

| | Aantal |
|---|---|
| Originele afbeeldingen in de export | **115** |
| WordPress-formaatvarianten | **116** |
| Waarvan verwijderbaar (origineel bestaat) | **53** |
| Varianten die de enige overgebleven versie zijn | **63** |
| Downloads (PDF / PPTX) | **13** |
| **Behouden afbeeldingen in de output** | **178** |
| Downloads in de output | **13** |
| Avatars | 10 |
| **Ontbrekende afbeeldingen** | **16** |

De 53 verwijderbare varianten zijn niet gekopieerd; hun referenties zijn herschreven naar het
origineel. De 63 varianten zonder origineel zijn wél gekopieerd — dat is de enige versie die de
export nog bevat.

Verwijzingen in de gemigreerde content:

| Soort verwijzing | Aantal |
|---|---|
| Lokaal (`/media/…`, `/downloads/…`) | 57 |
| Extern (ander domein) | 149 |
| Zonder bestand | 6 |

De 149 externe verwijzingen zijn grotendeels **teruggewonnen**: de crawler had ze in een
Wayback-URL verpakt, waaruit de migrator de originele bestemming haalt. Zonder die stap waren
het 149 kapotte lokale paden geweest.

---

## 4. Links

| | Aantal |
|---|---|
| Interne links | **152** |
| Externe links | **67** |
| Broken links | **51** (49 pagina, 2 media) |
| Redirects | **2.934 exact + 6 patronen** |

Redirects naar reden:

| Reden | Aantal | Status |
|---|---|---|
| Attachmentpagina | 1.666 | 301 |
| Vertaalde fallback | 996 | 301 |
| Auteur-slug vernieuwd | 138 | 301 |
| Legacy URL (reactiepagina's, herstelde bronnen) | 113 | 301 |
| Attachment zonder bestaande post | 14 | 410 |
| Vertaalde fallback zonder EN-origineel | 4 | 410 |
| Oude homepage, genest duplicaat | 2 | 301 |
| Geen bruikbare capture | 1 | 410 |
| **Totaal** | **2.934** | 2.915× 301, 19× 410 |

---

## 5. Metadata

| Controle | Resultaat |
|---|---|
| Ontbrekende titels | **0** |
| Ontbrekende auteurs | **2** |
| Ontbrekende categorieën | **9** |
| Dubbele slugs | **0** |
| Dubbele permalinks | **0** |
| Ongeldige datums | **0** |
| Datums buiten bereik | **0** |
| Geschatte datums (`dateSource: url`) | **44** |
| Ontbrekende afbeeldingen | **16** |
| Titels die handmatig nagekeken moeten worden | **119** (116 posts + 3 pagina's) |
| Onbekende auteursreferenties | **0** |
| Onbekende categoriereferenties | **0** |
| Ontbrekende avatars | **0** |
| Plugin-markup in de content | **0** |
| Niet-herschreven `wp-content`-paden | **0** |

Datumherkomst over 447 artikelen: **302× uit `og:`-meta**, **101× uit de zichtbare pagina**
(oud thema, `wpn_postinfo`), **44× geschat uit de URL**. Elke geschatte datum staat als
`dateSource: url` in de frontmatter en is dus terugvindbaar.

---

## 6. Validatie

| Stap | Resultaat |
|---|---|
| Markdown leesbaar, frontmatter parseert | ✅ 620 bestanden |
| Verplichte velden aanwezig | ✅ 0 ontbrekend |
| Veldtypes en enums geldig | ✅ `lang`, `dateSource`, datums |
| Permalink-vorm en uniciteit | ✅ 0 dubbel |
| Bestandspad komt overeen met permalink | ✅ 0 afwijkingen |
| `author` verwijst naar bestaande auteur | ✅ |
| `categories` verwijzen naar `categories.json` | ✅ |
| `translationOf` verwijst naar bestaande EN-post | ✅ |
| Media-verwijzingen bestaan | ⚠ 6 zonder bestand |
| Interne links resolveren (direct of via redirect) | ⚠ 49 kapot |
| Redirects wijzen naar bestaande content | ✅ 0 naar niets |
| Redirect overschrijft geen live URL | ✅ 0 conflicten |

---

## 7. Verschillen en hun oorzaak

Elk verschil is onderzocht tot de oorzaak in de bron. Geen enkel verschil is weggeredeneerd.

### 7.1 Eén post ontbrak in de brontelling — migrator-bug, opgelost

`/2013/03/8-monkeys-in-a-cage-–-a-mura-learning-game/` **heeft geen `index.html` in de
export**; alleen `comment-page-1/index.html` is gecrawld.

De eerste run migreerde die post niet en **meldde dat ook niet** — stille contentverlies, wat de
opdracht expliciet verbiedt. Ontdekt doordat de validator een redirect vond die naar een
niet-bestaande post wees.

Opgelost: de migrator zoekt nu post-URL's waarvan de canonieke capture ontbreekt en herstelt ze
uit de reactiepagina, met de waarschuwing `canonieke-capture-ontbreekt`. De post is nu volledig
gemigreerd, inclusief auteur (Zvonimir Kriz), datum en taxonomie.

Zelfde patroon aangetroffen bij `output/2009/10/about` en `output/2010/05/about`: mappen zonder
`index.html`. Dat zijn geen posts maar historische padvarianten; ze leverden ongeldige
attachment-redirects op en zijn nu 410.

### 7.2 Eén post is niet te migreren — contentverlies

`/2018/04/test-and-learn-2/` heeft in de hele export geen bruikbare capture: de `index.html` is
een redirect-stub van 88 bytes, er is geen reactiepagina, en er is geen vertaalde versie.

Dit is de enige echte contentverlies van de migratie. De URL krijgt een 410. Herstel kan alleen
via een nieuwe fetch uit de Wayback Machine.

**Gevolg:** de twee wees-tags `experimentation` en `experiments` horen bij precies deze post.
Dat verklaart 2 van de 8 ongebruikte tag-archieven.

### 7.3 Pagina's: 14 in de bron, 7 gemigreerd

| Bron-URL | Status | Reden |
|---|---|---|
| `/about/` | gemigreerd | |
| `/about/don-mcgreal/` | gemigreerd | |
| `/about/get-involved/` | gemigreerd | |
| `/about/michael-mccullough/` | gemigreerd | |
| `/about/michael-sahota/` | gemigreerd | |
| `/about/translation-project/` | gemigreerd | |
| `/agile-games-conference-2011/` | gemigreerd | |
| `/about/michael-mccullough/michael-mccullough/` | 301 | genest duplicaat (CONTENT-MODEL §4) |
| `/tastycupcakes-home/` | 301 → `/` | duplicaat van de homepage |
| `/` | niet gemigreerd | capture is een postpagina, geen homepage (ANALYSIS §1.3) |
| `/login/` | niet gemigreerd | Ultimate Member, geen functie zonder WordPress |
| `/password-reset/` | niet gemigreerd | idem |
| `/submit-game-reference/` | niet gemigreerd | formulierpagina, werkt niet statisch |
| `/feed/atom/` | niet gemigreerd | RSS-feed, valt onder het feed-redirectpatroon |

Vijf niet-gemigreerde URL's, alle vijf een bewuste beslissing uit CONTENT-MODEL §4. De
homepage en `/submit-game-reference/` staan nog open als beslissing (§9).

### 7.4 Auteurs: 163 archieven, 165 records

| | Aantal |
|---|---|
| Auteur-archieven in de bron | 163 |
| Archieven met een gemigreerd record | 162 |
| Archief zonder record | 1 — `craig-browncraigwbrown-net`, heeft geen enkele post |
| Records zonder archief | 3 — `karen-favazza-spencer`, `vijay-bandaru`, `zvonimir-kriz` |

162 + 3 = 165. De drie zonder archief zijn auteurs die wél posts hebben, maar wier
archiefpagina nooit gecrawld is. Hun naam komt uit de post-metadata.

Daarnaast 3× `mogelijk-dubbele-auteur`: verschillende WordPress-accounts met dezelfde
weergavenaam. Bewust niet samengevoegd — dat is een menselijke beslissing (§9).

### 7.5 Tags: 324 archieven, 316 in gebruik

| Wees-tag | Oorzaak |
|---|---|
| `experimentation`, `experiments` | horen bij `/2018/04/test-and-learn-2/` (§7.2) |
| `от-винта-2`, `от-винта-2-2021`, `райя-и-последний-дракон`, `райя-последний-дракон`, `рая-и-последний-дракон`, `рая-последний-дракон` | **lege archiefpagina's in de export** — geen enkele post in de hele export draagt deze tags |

Gecontroleerd: de zes Cyrillische archieven bevatten geen postlinks, en `grep` over alle
post-HTML vindt geen `tag-от-винта-2`. Het zijn restanten van verwijderde posts.

### 7.6 Broken links: 51

| Soort | Aantal | Oorzaak |
|---|---|---|
| Externe links platgeslagen tot lokale `.html` | ~20 | de crawler schreef `www.linkedin.com/in/…` weg als `…/douglas-husovsk.html`; de originele URL is onherleidbaar |
| Attachmentpagina's die nooit gecrawld zijn | ~16 | `/2009/06/what-were-they-thinking/attachment/1/` e.a. bestaan niet in de export |
| Base64 data-URI opgeslagen als bestandsnaam | 5 | crawler-artefact, beschreven in ANALYSIS §2.6 |
| `doggy-planning.html`, `vision.html` e.a. | ~8 | idem, externe of niet-gecrawlde bestemmingen |
| TDO Mini Forms-bijlagen (`/media/tdomf/…/…html`) | 2 | `.html`-bijlagen uit de formulierplugin, geen afbeelding of download |

Alle 51 zijn **bestaande gebreken in de export**, geen migratiefouten. Ze staan in
`migration/broken-links.csv`. De migrator repareert ze bewust niet: een verzonnen bestemming is
schadelijker dan een zichtbaar kapotte link.

### 7.7 Ontbrekende afbeeldingen: 16

Referenties zonder bestand, bijvoorbeeld `IMG_3022-300x225-150x150.jpg`,
`Innovation-Ambition-Matrix1-660x627.png`, `4As-300x215.png`. Gecontroleerd: de bijbehorende
uploadmappen bestaan niet in de export — deze bestanden zijn nooit gecrawld.

Conform CONTENT-MODEL §10.3 blijft de verwijzing staan met het verwachte pad en komt hij in
`migration/missing-media.csv`. Geen placeholders.

---

## 8. Bugs gevonden tijdens de validatie

De validatie was geen formaliteit: zes echte fouten kwamen aan het licht en zijn opgelost.

| # | Bug | Gevolg | Status |
|---|---|---|---|
| 1 | Post-URL's zonder `index.html` werden noch gemigreerd noch gemeld | stille contentverlies (§7.1) | opgelost |
| 2 | Attachment-redirects wezen naar niet-bestaande posts | 13 redirects naar niets | opgelost, nu 410 of naar de EN-post |
| 3 | Auteur-slugbotsing kon de oude URL van persoon A naar persoon B laten wijzen | 1 conflict op `/author/karen-favazza-spencer/` | opgelost: wie de slug al heeft, houdt hem |
| 4 | Smileys uit `wp-includes` werden als content-afbeelding behandeld | ontbrekende media-referenties | opgelost |
| 5 | Dubbele formaatvarianten (`-300x225-150x150`) werden niet herleid | onnodig ontbrekende afbeeldingen | opgelost |
| 6 | Externe URL's naar een oude host van de site werden niet lokaal gemaakt terwijl het bestand lokaal bestond | onnodig externe afhankelijkheid | opgelost |

Twee fouten zaten in de **validator zelf** (padprefix, en media-links die aan pagina-URL's
werden getoetst). Beide gecorrigeerd; ze veroorzaakten geen verkeerde output, alleen valse
meldingen.

---

## 9. Afwijking van CONTENT-MODEL.md

**Slug met en-dash niet genormaliseerd.** CONTENT-MODEL §7 stelde voor
`8-monkeys-in-a-cage-–-a-mura-learning-game` te normaliseren naar
`8-monkeys-in-a-cage-a-mura-learning-game` met een 301. De migrator behoudt de originele slug
en permalink.

Reden: uitgangspunt 8 (bestaande URL's behouden) weegt hier zwaarder dan een cosmetisch nettere
slug, en de bestaande URL werkt gewoon. Wil je alsnog normaliseren, dan is dat één regel in de
migrator plus één redirect. **Graag bevestigen.**

---

## 10. Wat nog handwerk is

| Taak | Omvang | Bestand |
|---|---|---|
| Aaneengeplakte meertalige titels valideren | 119 (116 posts + 3 pagina's) | `titles-to-review.csv` |
| Ontbrekende afbeeldingen bijhalen of accepteren | 16 | `missing-media.csv` |
| Kapotte links beoordelen | 51 | `broken-links.csv` |
| `/2018/04/test-and-learn-2/` opnieuw fetchen of laten vervallen | 1 | §7.2 |
| Mogelijk dubbele auteurs beoordelen | 3 | `report.json` |
| Posts zonder categorie | 9 | `report.json` |
| Posts zonder auteur | 2 | `report.json` |
| Homepage ontwerpen | 1 | §7.3 |
| `/submit-game-reference/` beslissen | 1 | §7.3 |

---

## 11. Classificatie

### **WARNING**

**Waarom geen FAIL:** er zijn geen onverklaarde contentverschillen. Alle 1.448 post-URL's uit de
bron zijn per URL herleid tot gemigreerd, 301 of 410 — nul onverklaard. De validator geeft nul
FAILs. Alle referenties, relaties en URL's zijn consistent. De export is aantoonbaar
ongewijzigd en de migratie is byte-identiek reproduceerbaar.

**Waarom geen PASS:**

1. **Eén post is inhoudelijk verloren** (`/2018/04/test-and-learn-2/`). Verklaard, maar
   verlies blijft verlies.
2. **119 titels zijn niet automatisch te herstellen** (116 posts en 3 pagina's) en staan nu
   met `titleNeedsReview: true` in de output.
3. **16 afbeeldingen en 51 links zijn kapot in de bron** en dus ook in het resultaat.

Punten 2 en 3 waren bekend en geaccepteerd sinds fase 1; punt 1 is onvermijdelijk zonder een
nieuwe fetch. Zodra de titels gevalideerd zijn en er een besluit ligt over de verloren post,
kan dit een PASS worden.

---

*Einde fase 4. `output/` ongewijzigd, checksum geverifieerd.*
