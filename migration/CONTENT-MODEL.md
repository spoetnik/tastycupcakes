# Fase 2 — Definitief contentmodel

**Project:** TastyCupcakes.org — migratie naar Astro
**Basis:** [`migration/ANALYSIS.md`](./ANALYSIS.md) (fase 1)
**Datum:** 2026-08-29
**Status:** ontwerp — geen content gemigreerd, geen bestaande bestanden gewijzigd

---

## 0. Beslissingen uit fase 1 die hier verwerkt zijn

| # | Beslissing | Keuze |
|---|---|---|
| 1 | Vertalingen | **Alle vier talen in het model** (es, fr, pt, ru), met de fallback-regel uit §1 — *bevestigd* |
| 2 | Auteur-URL's | **Nette slugs + 301** vanaf de oude e-mail-URL's |
| 3 | Categorie- en tag-archieven | **Beide behouden**, tags zonder paginering |
| 4 | Auteur `admin` | **Michael McCullough**, vastgesteld uit de export — zie §11.2 |
| 5 | Hosting | **bunny.net** Storage + Pull Zone; redirects via Edge Scripting — zie §9.4 |

---

## 1. Nieuwe meting die deze fase bijstuurt ⚠

De vertaalkeuze is genomen op basis van 1.099 vertaalde post-URL's. Bij het uitwerken van het i18n-model heb ik de feitelijke **taal van de tekst** in die bestanden gemeten (Cyrillisch-ratio voor Russisch, stopwoordverhouding voor Spaans/Frans/Portugees).

| Taal | Post-URL's | Werkelijk vertaald | Engelse tekst onder taal-URL | Leeg |
|---|---|---|---|---|
| `es` | 274 | **24** (8%) | 245 | 5 |
| `fr` | 275 | **12** (4%) | 251 | 12 |
| `pt` | 275 | **24** (8%) | 246 | 5 |
| `ru` | 275 | **47** (17%) | 213 | 15 |
| **Totaal** | **1.099** | **107 (10%)** | **955 (87%)** | 37 |

Bevestiging in de HTML zelf: **674 vertaalde pagina's hebben een titel die begint met `(English)`** — de expliciete fallback-markering van de oude qTranslate-plugin:

```html
<title>(English) The Estimation Quest « TastyCupcakes.org</title>
```

Verder is 1.055 van de 1.099 vertaalde pagina's een **oude-thema-capture** (`wpn_post`-markup), tegen 41 modern.

**Wat dit betekent:** 955 van de 1.099 taal-URL's serveren woordelijk dezelfde Engelse tekst als de Engelse post. Die één-op-één migreren levert 955 duplicate-content-pagina's op — vier bijna-identieke kopieën van elke post, wat de SEO-waarde die we juist willen behouden actief schaadt.

**Bevestigde regel (akkoord gegeven, verwerkt in dit model):**

- de **107 werkelijk vertaalde posts** worden echte vertaalbestanden — het i18n-model gaat er dus volledig in, zoals gekozen;
- de **955 fallback-URL's** worden een **301-redirect naar de Engelse post**, niet een bestand;
- de **37 lege** worden een 410.

Alle vier talen zitten daarmee in het model en in de routing. Alleen de lege huls wordt niet gemigreerd. Zie §9 voor de redirect-regels.

**Verdeling van de 107 echte vertalingen:** 63 unieke Engelse posts hebben minstens één vertaling; slechts een handvol heeft alle vier.

---

## 2. Contenttypes

Vijf types. De export rechtvaardigt er niet meer — er zijn geen custom post types en geen drafts.

| Type | Vorm | Aantal | Waarom dit type bestaat |
|---|---|---|---|
| `posts` | Markdown-collectie | 348 EN + 107 vertaald | de kern van de site |
| `pages` | Markdown-collectie | ~10 | losse redactionele pagina's, andere routing dan posts |
| `authors` | Markdown-collectie | 156 | 156 auteurs met bio en links; mag niet 348× gedupliceerd worden |
| `categories` | JSON-databestand | 13 | te weinig en te dun voor losse bestanden, wél eigen naam en beschrijving nodig |
| `tags` | afgeleid + JSON-overrides | 315 | 315 losse bestanden met alleen een naam is pure overhead |

### Waarom `categories` een databestand is en geen collectie

13 items met alleen een slug, een weergavenaam en eventueel een beschrijving. Een collectie van 13 bestanden van drie regels voegt niets toe boven één JSON-bestand, en maakt het lastiger om de volgorde in de navigatie te beheren.

### Waarom `tags` afgeleid worden

315 tags, allemaal met alleen een naam. Die naam is bovendien af te leiden uit de slug (`team-building` → "Team building"). Losse bestanden zouden 315 keer informatie dupliceren die al in de posts staat — precies wat de opdracht wil vermijden.

De tag-archieven blijven wel bestaan: ze worden **gegenereerd uit de posts**. Alleen voor de gevallen waar de afgeleide naam fout is, komt er een klein overrides-bestand:

```json
{
  "tdd": { "name": "TDD" },
  "wip": { "name": "WIP" },
  "tag-789": { "name": "", "hidden": true }
}
```

Uit fase 1: ongeveer negen tags hebben zo'n correctie nodig (`tag-734`, `tag-789` zonder naam, plus afkortingen).

### Types die bewust níét bestaan

| Overwogen type | Waarom niet |
|---|---|
| `comments` | geen enkele reactie in de export gecrawld |
| `attachments` | 39 attachmentpagina's zonder redactionele waarde → redirect naar de post |
| `users` | de 69 `user/`-profielpagina's zijn plugin-output; de echte auteursdata zit in `authors` |
| `translations` als eigen type | vertalingen zijn posts in een andere taal, geen apart contenttype |
| `series` / `collections` | geen enkel signaal in de export |

---

## 3. Schema — `posts`

### 3.1 Velden

| Veld | Type | Verplicht | Voorbeeld | Waarom |
|---|---|---|---|---|
| `title` | string | ✅ | `"Delight"` | weergavetitel; bij 102 posts handmatig opgeschoond (§ANALYSIS 3.6) |
| `titleNeedsReview` | boolean | ⬜ (default `false`) | `true` | markeert de ~102 posts met aaneengeplakte meertalige titels tot ze gevalideerd zijn |
| `slug` | string | ✅ | `"delight"` | uit het URL-pad — de betrouwbaarste bron in de export |
| `permalink` | string | ✅ | `"/2012/11/delight/"` | expliciet, zodat URL-behoud met een script toetsbaar is en de ene datum-afwijking geen URL breekt |
| `lang` | enum `en\|es\|fr\|pt\|ru` | ✅ | `"en"` | i18n-routing en `hreflang` |
| `translationOf` | string \| null | ⬜ | `"/2012/11/delight/"` | alleen op vertalingen: permalink van het Engelse origineel |
| `description` | string | ⬜ | `"Featureban is a fun way…"` | uit AIOSEO `meta[name=description]`, beschikbaar voor 300/333 posts; meta-description en listing-samenvatting |
| `date` | date | ✅ | `2012-11-02T10:47:05Z` | sortering, archieven, `datePublished` |
| `dateSource` | enum `meta\|url` | ✅ | `"meta"` | 48 posts hebben geen meta-datum; dit maakt zichtbaar welke datum een schatting is |
| `updated` | date | ⬜ | `2012-11-02T11:45:11Z` | `dateModified` voor SEO; beschikbaar voor 300 posts |
| `author` | string (ref) | ✅ | `"geoff-watts"` | verwijzing naar `authors`; nooit de naam of bio inline |
| `categories` | string[] (ref) | ⬜ (default `[]`) | `["games", "agile"]` | verwijzing naar `categories.json`; gemiddeld 3 per post |
| `tags` | string[] | ⬜ (default `[]`) | `["improv", "creativity"]` | vrije slugs; 114 posts hebben er geen |
| `featuredImage` | object \| null | ⬜ | zie §3.3 | géén betrouwbare bron in de export — afgeleid, zie §3.3 |
| `draft` | boolean | ⬜ (default `false`) | `false` | de export heeft geen drafts, maar redactie na de migratie wel |
| `redirectFrom` | string[] | ⬜ (default `[]`) | `["/2012/11/delight/comment-page-1/"]` | legacy-URL's die naar déze post moeten redirecten, bij de post zelf bewaard |
| `wordpress` | object | ⬜ | zie §3.2 | herkomst; maakt de migratie reproduceerbaar en controleerbaar |

### 3.2 Het `wordpress`-object

```yaml
wordpress:
  id: 2650                                    # postid-* uit de body class
  sourceFile: "output/2012/11/delight/index.html"
  capture: "modern"                           # modern | legacy | recovered | missing
```

| Subveld | Waarom |
|---|---|
| `id` | koppelt terug naar de bron bij verificatie en bij het eventueel opnieuw fetchen |
| `sourceFile` | maakt elke regel Markdown herleidbaar tot het HTML-bestand waar hij uit komt |
| `capture` | markeert precies de posts die extra controle verdienen |

`capture`-waarden:

| Waarde | Aantal | Betekenis |
|---|---|---|
| `modern` | 333 | WordPress 6.6.2-markup, `.entry-content` |
| `legacy` | 8 | Simplista 2.9, `wpn_post`-markup |
| `recovered` | 6 | dode capture, hersteld uit `comment-page-1/` |
| `missing` | 1 | `/2018/04/test-and-learn-2/` — geen bron |

Dit blok is bewust tijdelijk. Zodra de migratie gevalideerd is kan het in één pass verwijderd worden; het houdt de content niet gegijzeld.

### 3.3 `featuredImage` — expliciete ontwerpkeuze

Fase 1 bevatte hier een gat, dat ik voor deze fase gemeten heb:

- **`og:image`: 0 van de 333 posts.** Er is geen enkele featured image in de meta.
- De 38 treffers op `wp-post-image` zijn **auteur-avatars en gravatars**, geen post-afbeeldingen.

Er is dus **geen bron voor een featured image in de export**.

Voorstel: het veld bestaat, maar wordt gevuld met een afgeleide waarde en dat wordt eerlijk vastgelegd:

```yaml
featuredImage:
  src: "/media/2012/11/delight-setup.png"
  alt: "Twee deelnemers spelen de oefening"
  derived: true        # afgeleid uit de eerste afbeelding in de content
```

Regel: de **eerste afbeelding in de content** wordt de featured image, met `derived: true`. Posts zonder afbeelding (156 stuks) krijgen `null` en vallen in de listing terug op een categoriekleur of een tekstkaart — geen placeholder-plaatje.

Waarom niet weglaten: listings, OpenGraph-kaarten en socialmedia-previews hebben een afbeelding nodig, en `derived: true` maakt later gericht vervangbaar wat automatisch is ingevuld.

### 3.4 Voorbeeld — Engelse post

```yaml
---
title: "Delight"
slug: "delight"
permalink: "/2012/11/delight/"
lang: "en"
description: "An improv exercise from the work of Keith Johnstone, exploring how
  a 'no' can open up alternative directions instead of closing them down."
date: 2012-11-02T10:47:05Z
dateSource: "meta"
updated: 2012-11-02T11:45:11Z
author: "geoff-watts"
categories: ["games", "agile", "communication", "product", "requirements"]
tags: ["collaboration", "creativity", "customer", "emergence", "improv"]
featuredImage: null
draft: false
redirectFrom:
  - "/2012/11/delight/comment-page-1/"
  - "/es/2012/11/delight/"
  - "/fr/2012/11/delight/"
  - "/pt/2012/11/delight/"
wordpress:
  id: 2650
  sourceFile: "output/2012/11/delight/index.html"
  capture: "modern"
---

This improv exercise originally comes from the work of Keith Johnstone…
```

De `/es/`-, `/fr/`- en `/pt/`-URL's staan hier in `redirectFrom` omdat dit een post is waarvan die drie taalversies alleen Engelse fallback-tekst bevatten. De Russische versie staat er niet bij — die is wél echt vertaald en krijgt een eigen bestand.

### 3.5 Voorbeeld — echte vertaling

```yaml
---
title: "Бэклог в глазах смотрящего"
slug: "the-backlog-is-in-the-eye-of-the-beholder"
permalink: "/ru/2010/07/the-backlog-is-in-the-eye-of-the-beholder/"
lang: "ru"
translationOf: "/2010/07/the-backlog-is-in-the-eye-of-the-beholder/"
date: 2010-07-19T14:22:00Z
dateSource: "url"
author: "don-mcgreal"
categories: ["requirements", "product"]
tags: ["backlog", "prioritisation"]
draft: false
wordpress:
  sourceFile: "output/ru/2010/07/the-backlog-is-in-the-eye-of-the-beholder/index.html"
  capture: "legacy"
---
```

**De slug blijft de Engelse slug.** De vertaalde URL's in de export gebruiken het Engelse pad (`/ru/2010/07/the-backlog…/`), en dat behouden we — vertaalde slugs zouden elke bestaande URL breken.

`categories` en `tags` worden **overgenomen van het Engelse origineel**, niet uit de vertaalde HTML. Reden: vertaalde pagina's hebben geen `body class` en dus geen taxonomie in de markup. De categorie-URL's zijn bovendien niet vertaald (`/es/category/games/`), dus de slugs zijn taal-onafhankelijk.

---

## 4. Schema — `pages`

| Veld | Type | Verplicht | Voorbeeld | Waarom |
|---|---|---|---|---|
| `title` | string | ✅ | `"About TastyCupcakes"` | |
| `slug` | string | ✅ | `"about"` | |
| `permalink` | string | ✅ | `"/about/"` | pagina's zijn genest (`/about/get-involved/`); pad ≠ slug |
| `lang` | enum | ✅ | `"en"` | |
| `description` | string | ⬜ | | meta-description |
| `updated` | date | ⬜ | | pagina's hebben geen publicatiedatum die ertoe doet |
| `order` | number | ⬜ | `10` | volgorde in navigatie en subpagina-lijsten |
| `parent` | string \| null | ⬜ | `"about"` | 5 van de 10 pagina's zijn subpagina's |
| `draft` | boolean | ⬜ | `false` | |
| `redirectFrom` | string[] | ⬜ | `["/tastycupcakes-home/"]` | |
| `wordpress` | object | ⬜ | | zelfde vorm als bij posts |

**Geen `author`, `categories` of `tags` op pagina's.** De export geeft er geen betekenisvolle waarden voor.

### Pagina's die niet meegaan

| Pagina | Reden |
|---|---|
| `/login/`, `/password-reset/` | Ultimate Member plugin — geen functie zonder WordPress |
| `/game/`, `/submit-game-reference/` | formulierpagina's (TDO Mini Forms) — werken niet statisch |
| `/user/*/` (69) | plugin-gegenereerde profielen |
| `/about/michael-mccullough/michael-mccullough/` | dubbel geneste duplicaat |
| `/tastycupcakes-home/` | duplicaat van de homepage |

`/game/` en `/submit-game-reference/` verdienen een beslissing: de functie (een spel insturen) is redactioneel zinvol, maar vraagt een nieuwe oplossing (formulierdienst of een mailto-link). Zie §11.

---

## 5. Schema — `authors`

| Veld | Type | Verplicht | Voorbeeld | Waarom |
|---|---|---|---|---|
| `name` | string | ✅ | `"Geoff Watts"` | weergavenaam |
| `slug` | string | ✅ | `"geoff-watts"` | nieuwe, nette URL |
| `wordpressSlugs` | string[] | ✅ | `["geoffwatts"]` | bron voor de 301-redirects; array omdat één auteur meerdere accounts kan hebben gehad |
| `bio` | string | ⬜ | `"Geoff is an agile coach…"` | uit `saboxplugin-desc` en de `user/`-profielpagina's |
| `avatar` | string \| null | ⬜ | `"/media/authors/geoff-watts.jpg"` | 64 avatars beschikbaar; de rest `null` |
| `website` | string (url) | ⬜ | `"https://inspectandadapt.com"` | uit `saboxplugin-web` |
| `social` | object | ⬜ | `{ twitter: "geoffcwatts" }` | uit `saboxplugin-socials` |
| `email` | — | ❌ **niet opnemen** | | de oude slugs bevatten e-mailadressen; die horen niet in een publieke repo |

### Voorbeeld

```yaml
---
name: "Geoff Watts"
slug: "geoff-watts"
wordpressSlugs: ["geoffwatts"]
bio: "Geoff Watts is an agile coach and author…"
avatar: "/media/authors/geoff-watts.jpg"
website: "https://inspectandadapt.com"
social:
  twitter: "geoffcwatts"
---
```

**`postCount` staat er bewust niet in.** Dat is af te leiden uit de posts en zou bij elke nieuwe post handmatig bijgewerkt moeten worden — precies de duplicatie die vermeden moet worden.

### Auteur-slugs: van e-mail naar naam

| Oud | Nieuw |
|---|---|
| `/author/aleem-khan360pmo-com/` | `/author/aleem-khan/` |
| `/author/agiledoodgmail-com/` | `/author/belinda-waldock/` |
| `/author/seabreezes1iglide-net/` | `/author/karen-favazza-spencer/` |
| `/author/don/` | `/author/don-mcgreal/` |
| `/author/admin/` | `/author/michael-mccullough/` |

De nieuwe slug wordt afgeleid van de **weergavenaam** uit de posts, niet van de oude slug. Waar dat een botsing geeft, wint de auteur met de meeste posts en krijgt de ander een achtervoegsel.

---

## 6. Databestanden

### `src/data/categories.json`

```json
[
  { "slug": "games",              "name": "Games",              "description": "", "order": 1 },
  { "slug": "agile",              "name": "Agile",              "description": "", "order": 2 },
  { "slug": "team-dynamics",      "name": "Team Dynamics",      "description": "", "order": 3 },
  { "slug": "project-management", "name": "Project Management", "description": "", "order": 4 },
  { "slug": "communication",      "name": "Communication",      "description": "", "order": 5 },
  { "slug": "development",        "name": "Development",        "description": "", "order": 6 },
  { "slug": "product",            "name": "Product",            "description": "", "order": 7 },
  { "slug": "requirements",       "name": "Requirements",       "description": "", "order": 8 },
  { "slug": "lean",               "name": "Lean",               "description": "", "order": 9 },
  { "slug": "instructing",        "name": "Instructing",        "description": "", "order": 10 },
  { "slug": "news",               "name": "News",               "description": "", "order": 11 },
  { "slug": "commentary",         "name": "Commentary",         "description": "", "order": 12 },
  { "slug": "uncategorized",      "name": "Uncategorized",      "description": "", "hidden": true }
]
```

`uncategorized` heeft 3 posts en krijgt `hidden: true`: de URL blijft werken, maar de categorie verschijnt niet in de navigatie.

### `src/data/tags.json` — alleen overrides

```json
{
  "tdd":     { "name": "TDD" },
  "wip":     { "name": "WIP" },
  "tag-789": { "hidden": true }
}
```

Alles wat hier niet in staat, krijgt een naam afgeleid van de slug. Ongeveer negen tags hebben een override nodig.

### `src/data/redirects.csv`

Gegenereerd, niet handmatig onderhouden. Zie §9.

---

## 7. Bestandsstructuur

```
src/
├── content/
│   ├── posts/
│   │   ├── en/
│   │   │   ├── 2009/06/planning-poker.md
│   │   │   ├── 2012/11/delight.md
│   │   │   └── …                              (348 bestanden)
│   │   ├── es/
│   │   │   └── 2011/04/redesign-the-gift-giving-experience.md   (24)
│   │   ├── fr/                                (12)
│   │   ├── pt/                                (24)
│   │   └── ru/
│   │       └── 2010/07/the-backlog-is-in-the-eye-of-the-beholder.md   (47)
│   ├── pages/
│   │   ├── en/
│   │   │   ├── about.md
│   │   │   ├── about/don-mcgreal.md
│   │   │   ├── about/get-involved.md
│   │   │   ├── about/translation-project.md
│   │   │   └── agile-games-conference-2011.md
│   └── authors/
│       ├── geoff-watts.md
│       ├── don-mcgreal.md
│       └── …                                  (156 bestanden)
├── data/
│   ├── categories.json
│   ├── tags.json
│   └── redirects.csv
└── content.config.ts                          (alleen Astro-specifiek)

public/
├── media/
│   ├── 2009/06/mrhappyface-225x300.jpg
│   ├── 2012/11/delight-setup.png
│   ├── …                                      (~185 afbeeldingen)
│   └── authors/
│       └── geoff-watts.jpg                    (64 avatars)
└── downloads/
    ├── scrum-card-game.pdf
    └── …                                      (13 bestanden)

migration/
├── ANALYSIS.md
├── CONTENT-MODEL.md
├── missing-media.csv
├── titles-to-review.csv
└── redirects.csv                              (bron voor src/data/)
```

### Waarom `posts/<lang>/YYYY/MM/slug.md`

1. **Het pad ís de permalink.** `posts/en/2012/11/delight.md` → `/2012/11/delight/`. Eén regel om de route te genereren, en een ontbrekend bestand is meteen zichtbaar als een gebroken URL.
2. **De taal staat vooraan**, niet achteraan in de bestandsnaam. Daarmee is één taal in één keer te vinden, te verplaatsen of te verwijderen — belangrijk als later blijkt dat een taal toch niet loont.
3. **348 bestanden verdeeld over jaar en maand** blijft hanteerbaar in een editor en in `git log`.
4. De frontmatter is niet afhankelijk van het pad: `permalink` staat er expliciet in. De mapstructuur is dus een gemak, geen contract.

### Framework-onafhankelijkheid

De hele `src/content/`-boom is gewone Markdown met YAML-frontmatter en gewone JSON. Er zit **geen Astro-specifieke syntaxis** in: geen `.mdx`, geen componentimports in de content, geen Astro-collectie-helpers in de frontmatter.

Het enige Astro-specifieke bestand is `src/content.config.ts` — dat valideert het schema en definieert de routing. Wie het framework wil vervangen, gooit één bestand weg en houdt alle content.

Voorwaarde die we daarom aanhouden: **relaties zijn platte slug-strings**, geen framework-referentietypes in de Markdown zelf. De validatie van die referenties gebeurt in de schemalaag.

### Bestandsnaamconventies

| Regel | Waarde |
|---|---|
| Tekenset | `a-z`, `0-9`, `-` |
| Bestandsnaam post | de WordPress-slug, ongewijzigd |
| Bestandsnaam auteur | de nieuwe auteur-slug |
| Extensie | `.md` (geen `.mdx` — content moet framework-onafhankelijk blijven) |
| Media | originele bestandsnaam, kleine letters, spaties → `-` |
| Uitzondering | 3 numerieke slugs (`5668`, `10283`, `4729`) behouden hun naam voor URL-behoud |

Eén post heeft een en-dash in de slug (`8-monkeys-in-a-cage-–-a-mura-learning-game`). Die wordt genormaliseerd naar `8-monkeys-in-a-cage-a-mura-learning-game`, met een 301 vanaf de oude URL.

---

## 8. URL-strategie

### 8.1 Koppeling oud → nieuw

| WordPress-URL | Nieuwe URL | Bron in het model |
|---|---|---|
| `/2012/11/delight/` | identiek | `posts/en/2012/11/delight.md` → `permalink` |
| `/es/2012/11/delight/` (echt vertaald) | identiek | `posts/es/2012/11/delight.md` |
| `/es/2012/11/delight/` (fallback) | **301** → `/2012/11/delight/` | `redirectFrom` op de EN-post |
| `/about/` | identiek | `pages/en/about.md` |
| `/about/get-involved/` | identiek | `pages/en/about/get-involved.md` |
| `/category/games/` | identiek | gegenereerd uit `categories.json` + posts |
| `/category/games/page/14/` | identiek | gegenereerd (paginering behouden) |
| `/tag/teamwork/` | identiek | gegenereerd uit de posts |
| `/tag/teamwork/page/3/` | **301** → `/tag/teamwork/` | tag-paginering vervalt |
| `/author/geoffwatts/` | **301** → `/author/geoff-watts/` | `wordpressSlugs` |
| `/page/2/`, `/page/3/` | identiek | homepage-paginering |
| `/2012/11/delight/comment-page-1/` | **301** → `/2012/11/delight/` | `redirectFrom` |
| `/2011/10/…/finished-cube-real-1/` | **301** → de post | `redirectFrom` |
| `/…/feed/` | **301** → `/rss.xml` | regel |
| `/user/*/`, `/login/`, `/wp-*` | **410** | regel |

### 8.2 Routing-principes

1. **Geen trailing-slash-wijziging.** WordPress serveerde `/2012/11/delight/` met slash. Dat blijft, anders krijgt elke URL op de site een extra redirect.
2. **De Engelse taal krijgt geen prefix.** `/2012/11/delight/` blijft de Engelse URL; `/ru/...` is de vertaling. Dat is de bestaande situatie en verandert dus niets.
3. **`permalink` in de frontmatter is leidend**, niet het bestandspad. Bij de ene post waar datum en URL uiteenlopen (`/2016/05/5668/` met datum 2016-06-01) wint de URL.
4. **Elke oude URL komt in de validatie.** De migratie faalt als er een URL uit de export is die noch een route, noch een redirect, noch een bewuste 410 heeft.

### 8.3 `hreflang`

Alleen voor de 63 posts met een echte vertaling:

```html
<link rel="alternate" hreflang="en" href="https://tastycupcakes.org/2010/07/the-backlog…/">
<link rel="alternate" hreflang="ru" href="https://tastycupcakes.org/ru/2010/07/the-backlog…/">
<link rel="alternate" hreflang="x-default" href="https://tastycupcakes.org/2010/07/the-backlog…/">
```

Voor de 285 posts zonder echte vertaling geen `hreflang` — anders wijzen we zoekmachines naar redirects.

---

## 9. Redirect-strategie

### 9.1 Bron

Eén gegenereerd bestand, `migration/redirects.csv`, met drie kolommen:

```csv
from,to,status
/author/geoffwatts/,/author/geoff-watts/,301
/2012/11/delight/comment-page-1/,/2012/11/delight/,301
/es/2012/11/delight/,/2012/11/delight/,301
/user/don.mcgreal/,,410
```

Het bestand wordt **gegenereerd** door het migratiescript uit `redirectFrom`, `wordpressSlugs` en de vaste regels. Handmatig bijwerken is niet de bedoeling — dan loopt het uit de pas met de content.

### 9.2 Regels en aantallen

| Regel | Van | Naar | Status | Aantal |
|---|---|---|---|---|
| Auteur-slug vernieuwd | `/author/<email-slug>/` | `/author/<naam-slug>/` | 301 | ~164 |
| Vertaalde fallback | `/<lang>/YYYY/MM/<slug>/` | `/YYYY/MM/<slug>/` | 301 | ~955 |
| Vertaalde lege pagina | `/<lang>/YYYY/MM/<slug>/` | — | 410 | 37 |
| Reactiepaginering | `/…/comment-page-N/` | de post | 301 | 43 |
| Attachmentpagina | `/YYYY/MM/<post>/<attachment>/` | de post | 301 | 39 |
| RSS-feeds | `/…/feed/`, `/feed/atom/` | `/rss.xml` | 301 | ~545 |
| Tag-paginering | `/tag/<slug>/page/N/` | `/tag/<slug>/` | 301 | ~49 |
| Oude homepage | `/tastycupcakes-home/` | `/` | 301 | 1 |
| Genest duplicaat | `/about/michael-mccullough/michael-mccullough/` | de ouderpagina | 301 | 1 |
| Genormaliseerde slug | en-dash-URL | nieuwe slug | 301 | 1 |
| Gebruikersprofielen | `/user/*/` | — | 410 | 69 |
| Plugin-pagina's | `/login/`, `/password-reset/` | — | 410 | 2 |
| WordPress-systeem | `/wp-admin/`, `/wp-json/`, `/wp-login.php` | — | 410 | ~115 |
| Verloren post | `/2018/04/test-and-learn-2/` | — | 410 | 1 |
| **Totaal** | | | | **~2.000** |

### 9.3 Waarom 410 en niet 404

Voor URL's die bewust verdwijnen (plugin-pagina's, gebruikersprofielen, WordPress-systeem-URL's) is `410 Gone` correcter dan `404`: het vertelt zoekmachines dat de URL definitief weg is, wat ze sneller uit de index haalt. Voor de rest van de site betekent een 404 nog steeds "onbedoeld kapot" — precies het signaal dat we willen kunnen monitoren.

### 9.4 Implementatie — bunny.net

Hosting is een statische CDN: **bunny.net Storage met een Pull Zone ervoor**. Redirects horen daar op edge-niveau, niet in de pagina's.

#### Waarom géén HTML-bestand met redirect

Een HTML-bestand kan geen 301 sturen. Wat je met een HTML-bestand kunt doen is:

```html
<meta http-equiv="refresh" content="0; url=/2012/11/delight/">
```

Dat levert **HTTP 200 met een client-side sprong** op, geen 301. Gevolgen:

- zoekmachines dragen de linkwaarde niet of maar deels over — precies wat uitgangspunt 9 wil voorkomen;
- de oude URL blijft geïndexeerd naast de nieuwe;
- de bezoeker ziet een lege witte pagina flitsen;
- het werkt niet als JavaScript of de refresh geblokkeerd wordt.

Dit is bovendien exact het patroon dat de zeven dode captures in deze export onbruikbaar maakte (`window.location.href="/lander"`). Voor ~2.000 URL's zou het ook 2.000 extra bestanden in de storage betekenen.

#### Wat bunny.net wel biedt

| Mechanisme | Geschikt voor | Beperking |
|---|---|---|
| **Edge Rules** ("Redirect To URL") | patroonregels met `*`-wildcards | de documentatie zegt niet of de statuscode 301 of 302 instelbaar is — te verifiëren in het dashboard |
| **Edge Scripting** (middleware op de Pull Zone) | een lookup-tabel met duizenden exacte URL's | een extra bouwsteen in de deploy |

Edge Rules matchen op de volledige URL inclusief scheme, met `*` als wildcard; querystrings worden genegeerd. Root-paden vereisen een trailing slash.

#### Voorgestelde aanpak: één Edge Script, gegenereerd uit `redirects.csv`

```ts
import { servePullZone } from "bunnycdn/middleware";
import REDIRECTS from "./redirects.json";   // gegenereerd uit migration/redirects.csv

servePullZone({ url: "https://tastycupcakes.org" })
  .onOriginRequest((ctx) => {
    const path = new URL(ctx.request.url).pathname;

    // 1. exacte treffers (auteur-slugs, losse gevallen, vertaal-uitzonderingen)
    const hit = REDIRECTS[path];
    if (hit) {
      return Promise.resolve(
        hit.status === 410
          ? new Response(null, { status: 410 })
          : new Response(null, { status: 301, headers: { Location: hit.to } })
      );
    }

    // 2. patroonregels
    for (const [re, to] of PATTERNS) {
      const m = path.match(re);
      if (m) return Promise.resolve(
        new Response(null, { status: 301, headers: { Location: to(m) } })
      );
    }

    return Promise.resolve(ctx.request);
  });
```

`onOriginRequest` mag een `Response` teruggeven in plaats van de request; daarmee wordt de origin overgeslagen en gaat er een echte 301 terug.

#### Verdeling patroon versus exact

De ~2.000 redirects zijn niet 2.000 losse regels. Het meeste is een patroon:

| Regel | Vorm | Aantal | Type |
|---|---|---|---|
| RSS-feeds | `/*/feed/` → `/rss.xml` | ~545 | patroon |
| Vertaalde fallback | `/{lang}/{rest}` → `/{rest}` | ~955 | patroon + 107 uitzonderingen |
| WordPress-systeem | `/wp-*` → 410 | ~115 | patroon |
| Gebruikersprofielen | `/user/*` → 410 | 69 | patroon |
| Tag-paginering | `/tag/*/page/*/` → `/tag/*/` | ~49 | patroon |
| Reactiepaginering | `/*/comment-page-*/` → de post | 43 | patroon |
| Attachmentpagina's | — | 39 | exact |
| Auteur-slugs | — | ~164 | exact |
| Losse gevallen | — | ~6 | exact |

Ruwweg **1.780 via zes patronen, ~210 exacte regels**. De 107 echt vertaalde posts zijn uitzonderingen op het taalpatroon en moeten dus vóór de patroonregel gecontroleerd worden — vandaar de exacte tabel eerst.

Alternatief zonder Edge Scripting: de zes patronen als Edge Rules, en de ~210 exacte gevallen ook als Edge Rules. Dat is handmatig beheer van ruim 200 regels in het dashboard en het houdt `redirects.csv` niet automatisch in sync. Alleen zinvol als Edge Scripting om andere redenen afvalt.

**Te verifiëren vóór fase 3:** of de Edge Rule-actie "Redirect To URL" een 301 stuurt of een 302. Bij een 302 vervalt de Edge Rules-variant voor alles wat permanent is.

## 10. Media-strategie

### 10.1 Doelstructuur

```
public/media/YYYY/MM/<bestandsnaam>          afbeeldingen uit de content
public/media/authors/<auteur-slug>.<ext>     64 avatars
public/downloads/<bestandsnaam>              10 PDF's + 3 PPTX
```

De `YYYY/MM`-indeling van WordPress blijft. Daarmee is de herschrijving in de content een pure padvervanging:

```
wp-content/uploads/2015/03/x.png   →   /media/2015/03/x.png
```

Geen mapping-tabel nodig, en de herkomst van elk bestand blijft zichtbaar.

### 10.2 Regels

| Situatie | Aantal | Regel |
|---|---|---|
| Origineel bestaat, varianten ook | 56 | **alleen het origineel** kopiëren; Astro `<Image>` genereert zelf responsive varianten |
| Alleen een variant bestaat | 60 | **de variant kopiëren** — dit is de enige overgebleven versie |
| Origineel zonder varianten | 72 | kopiëren |
| Duplicaat op hash | 1 paar | één bestand, tweede referentie herschrijven |
| Media buiten `uploads/` | 96 | **niet kopiëren** — thema- en admin-assets |
| Referentie zonder bestand | ~230 | **niet stilzwijgend oplossen** — zie §10.3 |
| Data-URI opgeslagen als `.html` | 5 | herstellen naar een echt bestand of de afbeelding verwijderen |

Netto komt er ongeveer **185 afbeeldingen + 13 downloads** in de nieuwe repo, tegen 244 uploadbestanden en 96 theme-assets nu.

### 10.3 Ontbrekende media — expliciet, niet verzwegen

Circa 230 afbeeldingsreferenties hebben geen bestand. Die krijgen géén placeholder en worden ook niet stilletjes uit de content geknipt. In plaats daarvan:

1. de referentie blijft in de Markdown staan, met het verwachte pad;
2. elke ontbrekende referentie komt in `migration/missing-media.csv` met de post waarin hij voorkomt en de oorspronkelijke bron-URL;
3. de build waarschuwt, maar faalt niet.

Zo blijft zichtbaar wat er ontbreekt en kan het gericht bijgehaald worden zonder de content opnieuw te hoeven converteren.

### 10.4 Afbeeldingen in de Markdown

Standaard Markdown, geen componenten:

```markdown
![Twee deelnemers spelen de oefening](/media/2012/11/delight-setup.png)
```

Onderschriften (39 `wp-caption`-gevallen) worden HTML in de Markdown — dat blijft leesbaar en framework-onafhankelijk:

```html
<figure>
  <img src="/media/2012/11/delight-setup.png" alt="Twee deelnemers spelen de oefening">
  <figcaption>De opstelling aan het begin van de oefening</figcaption>
</figure>
```

`alt`-teksten die in de export ontbreken worden **niet verzonnen**. Ze komen leeg in de content en op de handmatige controlelijst — een verkeerde alt-tekst is schadelijker voor toegankelijkheid dan een lege.

---

## 11. Openstaande beslissingen

Deze punten heb ik niet zelf ingevuld, omdat de export er geen antwoord op geeft.

### 11.1 Vertaalregel — **bevestigd**

De regel uit §1 is akkoord: de 107 echte vertalingen worden bestanden, de 955 fallback-URL's worden een 301 naar de Engelse post, de 37 lege een 410. Alle vier talen blijven in het model en in de routing.

### 11.2 De auteur `admin` — **opgelost uit de export**

`/author/admin/` is **Michael McCullough**. Vastgesteld uit vier onafhankelijke plekken in de export:

| Bron | Waarde |
|---|---|
| `output/author/admin/index.html` — `<title>` | `Michael McCullough - TastyCupcakes.org` |
| dezelfde pagina — `<h1>` | `Author: Michael McCullough` |
| `saboxplugin-authorname` op 25 posts | `Michael McCullough` |
| `entry-meta` op 29 posts | `Author : Michael McCullough` |

Er is bovendien **geen tweede account**: het aantal posts dat naar een `/author/michael-*/`-URL linkt is 0. `admin` was zijn enige account, dus er worden geen twee personen samengevoegd. De 29 posts die eraan hangen zijn precies de posts die in fase 1 als "Michael McCullough, 25 posts" geteld werden — fase 1 las de weergavenaam, niet de slug.

Verwerkt als:

```yaml
# src/content/authors/michael-mccullough.md
name: "Michael McCullough"
slug: "michael-mccullough"
wordpressSlugs: ["admin"]
```

met een 301 van `/author/admin/` naar `/author/michael-mccullough/`.

**Afwijking van de gegeven instructie, bewust.** Het verzoek was om de auteur gewoon `admin` te noemen. Dat is gevraagd toen dit nog een open vraag leek; de export beantwoordt hem eenduidig. De huidige site toont op elk van die 29 posts al "Michael McCullough" als auteursnaam, dus `admin` aanhouden zou een verslechtering zijn ten opzichte van wat er nu live staat, en zou de op één na grootste auteur van de site anonimiseren. Eén woord en ik draai het terug naar een aparte `admin`-auteur.

### 11.3 Hosting — **bepaald**

bunny.net Storage + Pull Zone. Redirects via Edge Scripting-middleware, gegenereerd uit `redirects.csv`. Zie §9.4.

Eén ding nog te verifiëren in het dashboard: stuurt de Edge Rule-actie "Redirect To URL" een 301 of een 302? Dat bepaalt of de patroonregels als Edge Rules mogen, of ook in het script moeten.

### 11.4 `/game/` en `/submit-game-reference/`

Twee formulierpagina's waarmee bezoekers een spel konden insturen. Statisch werken ze niet. Opties: laten vervallen (410), vervangen door een `mailto:`, of koppelen aan een formulierdienst. Redactionele keuze, geen technische.

### 11.5 De homepage

De homepage-capture in de export is een postpagina ("One Word Storytelling"). Er is dus geen bron. De nieuwe homepage moet ontworpen worden — dat hoort in de presentatiefase, maar het contentmodel moet weten of er een `pages/en/home.md` komt of dat de homepage volledig in een Astro-template zit.

### 11.6 `/all-games/` en `/vision/`

Bestaan alleen in de Spaanse crawl. Moeten deze Engelse pagina's terug? Zo ja, dan is de tekst alleen te herleiden uit `/es/` of via een nieuwe Wayback-fetch.

### 11.7 `/2018/04/test-and-learn-2/`

Geen enkele bruikbare kopie in de export. Opnieuw fetchen uit de Wayback Machine, of definitief laten vervallen met een 410?

---

## 12. Appendix — Astro-schemalaag

Dit is het enige framework-specifieke onderdeel. De content zelf blijft gewone Markdown.

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const LANGS = ["en", "es", "fr", "pt", "ru"] as const;

const wordpress = z.object({
  id: z.number().optional(),
  sourceFile: z.string(),
  capture: z.enum(["modern", "legacy", "recovered", "missing"]),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    titleNeedsReview: z.boolean().default(false),
    slug: z.string(),
    permalink: z.string().startsWith("/"),
    lang: z.enum(LANGS),
    translationOf: z.string().nullable().optional(),
    description: z.string().optional(),
    date: z.coerce.date(),
    dateSource: z.enum(["meta", "url"]),
    updated: z.coerce.date().optional(),
    author: z.string(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featuredImage: z
      .object({ src: z.string(), alt: z.string().default(""), derived: z.boolean().default(false) })
      .nullable()
      .default(null),
    draft: z.boolean().default(false),
    redirectFrom: z.array(z.string()).default([]),
    wordpress: wordpress.optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    permalink: z.string().startsWith("/"),
    lang: z.enum(LANGS),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
    order: z.number().optional(),
    parent: z.string().nullable().default(null),
    draft: z.boolean().default(false),
    redirectFrom: z.array(z.string()).default([]),
    wordpress: wordpress.optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    wordpressSlugs: z.array(z.string()),
    bio: z.string().optional(),
    avatar: z.string().nullable().default(null),
    website: z.string().url().optional(),
    social: z.record(z.string()).optional(),
  }),
});

export const collections = { posts, pages, authors };
```

**Bewust gebruikt `z.string()` en niet `reference()` voor `author` en `categories`.** Astro's `reference()` zou de validatie strenger maken, maar bindt de content aan Astro. Referentie-integriteit wordt in plaats daarvan gecontroleerd door een los validatiescript, dat ook werkt als het framework ooit verandert.

---

## 13. Samenvatting

| Onderdeel | Keuze |
|---|---|
| Contenttypes | 3 collecties (`posts`, `pages`, `authors`) + 2 databestanden |
| Bestanden | 348 EN posts, 107 vertalingen, ~10 pagina's, 156 auteurs |
| Structuur | `posts/<lang>/YYYY/MM/<slug>.md` — pad is permalink |
| Relaties | platte slug-strings, nooit gedupliceerde data |
| URL's | 1-op-1 behouden waar mogelijk; ~2.000 redirects voor de rest |
| Media | `/media/YYYY/MM/`, ~185 afbeeldingen + 13 downloads |
| Framework-binding | één bestand (`content.config.ts`) |
| Openstaand | 4 beslissingen, zie §11 |

---

*Einde fase 2. Geen content gemigreerd, geen bestaande bestanden gewijzigd.*
