# Fase 1 — Analyse van de WordPress-export

**Project:** TastyCupcakes.org — migratie naar Astro
**Bron:** `output/` (7.555 bestanden, 254 MB)
**Datum analyse:** 2026-08-29
**Status:** analyse only — geen bestanden gewijzigd, niets geconverteerd

---

## 0. Belangrijkste conclusie vooraf

De export in `output/` is **geen WordPress-export in de klassieke zin**. Er is:

- geen WXR/XML-export (`wp-includes/wlwmanifest.xml` is een themabestand, geen content);
- geen database-dump;
- geen bruikbare REST-API-dump (`wp-json/` bevat 94 bestanden: 3 pagina's, wat taxonomieën, géén posts-endpoint).

Wat er wél is: een **gecrawlde, gelokaliseerde kopie van gerenderde HTML uit de Wayback Machine**. De enige betrouwbare bron van content is dus de HTML zelf.

Gevolgen die de rest van dit rapport bepalen:

1. De HTML komt uit **meerdere themageneraties en meerdere crawl-momenten**. Niet elke URL heeft dezelfde markup.
2. Sommige URL's zijn gecrawld op een moment dat het domein **kapot of geparkeerd** was.
3. De crawler heeft **externe links en afbeeldingen herschreven**; een deel van de oorspronkelijke bestemmingen is daardoor verloren of wijst nu naar `web.archive.org`.
4. Een oude meertalige plugin (qTranslate-achtig) heeft **titels van meerdere talen aan elkaar geplakt** in de databasevelden. Dat zit in de HTML en moet opgeschoond worden.

Geen van deze punten blokkeert de migratie, maar ze bepalen wel welke stappen geautomatiseerd kunnen worden en welke handmatig gecontroleerd moeten worden.

---

## 1. Content

### 1.1 Contenttypes

Uit de `type-*` en `status-*` classes op `<article>` in alle Engelstalige HTML:

| WordPress type | Voorkomens | Opmerking |
|---|---|---|
| `type-post` | 376 | reguliere artikelen (incl. `comment-page-1`-duplicaten) |
| `type-attachment` | 38 | media-attachmentpagina's |
| custom post types | **0** | geen CPT's aangetroffen |

| WordPress status | Voorkomens |
|---|---|
| `status-publish` | 376 |
| `status-inherit` | 38 (attachments) |
| `draft` / `pending` / `private` | **0** |

**Er zijn geen concepten/drafts en geen custom post types.** Het contentmodel is dus eenvoudig: posts, pages, en drie taxonomieën.

### 1.2 Posts

348 canonieke post-URL's (`/YYYY/MM/slug/index.html`). Ingedeeld naar kwaliteit van de capture:

| Capture-kwaliteit | Aantal | Markup |
|---|---|---|
| Modern thema, bruikbare `.entry-content` | **333** | WordPress 6.6.2 + AIOSEO |
| Oud thema (Simplista 2.9) | **8** | XHTML, `wpn_post` container |
| Dode capture (redirect-stub) | **7** | 88 bytes, `window.location.href="/lander"` |

**Posts per jaar:**

| Jaar | Posts | Jaar | Posts | Jaar | Posts |
|---|---|---|---|---|---|
| 2009 | 37 | 2014 | 27 | 2019 | 27 |
| 2010 | 6 | 2015 | 28 | 2020 | 22 |
| 2011 | 42 | 2016 | 26 | 2021 | 8 |
| 2012 | 50 | 2017 | 23 | 2022 | 8 |
| 2013 | 20 | 2018 | 17 | 2023 | 7 |

**De 7 dode captures en hun herstelbron:**

| Post-URL | Herstelbron | Kwaliteit |
|---|---|---|
| `/2018/01/daily-scrum-game/` | `comment-page-1/` | modern thema, volledig |
| `/2019/02/virtual-cards-against-agility/` | `comment-page-1/` | modern thema, volledig |
| `/2012/11/three-headed-expert/` | `comment-page-1/` | oud thema (XHTML) |
| `/2015/11/silent-collaboration/` | `comment-page-1/` | oud thema (XHTML) |
| `/2015/01/hold-the-ball-longer-stronger-together/` | `comment-page-1/` | oud thema (XHTML) |
| `/2018/07/check-your-mindset/` | `comment-page-1/` | oud thema (XHTML) |
| `/2018/04/test-and-learn-2/` | **geen** | ook geen vertaalde versie |

Alle zeven zijn dus herstelbaar op één na. Voor `/2018/04/test-and-learn-2/` bestaat geen enkele bruikbare kopie in de export.

### 1.3 Pagina's

| Pad | Bytes | Markup | Titel |
|---|---|---|---|
| `about/` | 53.250 | modern | About TastyCupcakes |
| `about/don-mcgreal/` | 46.592 | modern | Don McGreal |
| `about/michael-mccullough/` | 48.534 | modern | Michael McCullough |
| `about/michael-mccullough/michael-mccullough/` | 37.012 | modern | duplicaat, genest |
| `about/get-involved/` | 11.495 | **oud** | Get Involved |
| `about/michael-sahota/` | 9.967 | **oud** | Michael Sahota |
| `about/translation-project/` | 16.846 | **oud** | Translation Project |
| `agile-games-conference-2011/` | 12.121 | **oud** | Agile Games Conference 2011 |
| `submit-game-reference/` | 14.507 | **oud** | Submit Game Reference Below |
| `tastycupcakes-home/` | 10.067 | **oud** | TastyCupcakes Home |
| `game/comment-page-1/` | 16.379 | **oud** | Submit Your Game Below |
| `login/` | 47.951 | modern | Login (plugin-pagina) |
| `password-reset/` | 47.046 | modern | Password Reset (plugin-pagina) |
| `index.html` (homepage) | 20.585 | **oud** | **"One Word Storytelling"** ⚠ |

Daarnaast: **69 `user/<naam>/` profielpagina's** (Ultimate Member plugin, `page-template-default`). Dit zijn gegenereerde profielpagina's zonder redactionele waarde.

⚠ **De homepage-capture is fout.** `output/index.html` heeft de titel *"One Word Storytelling"* en oude-thema-markup — er is een postpagina opgeslagen op de homepage-URL. De echte homepage moet gereconstrueerd worden.

⚠ **Ontbrekende Engelse pagina's.** De Spaanse crawl bevat `es/all-games/` en `es/vision/`, maar `output/all-games/` en `output/vision/` bestaan niet. Deze twee Engelse pagina's ontbreken in de export terwijl ze wel bestonden.

### 1.4 Attachmentpagina's

39 stuks, als geneste URL onder de post: `/2011/10/continuous-integration-with-lego/finished-cube-real-1/`. WordPress genereert die automatisch. Ze bevatten geen redactionele content en kunnen vervallen.

### 1.5 Auteurs

| Meting | Aantal |
|---|---|
| Auteur-archiefmappen (`author/`) | 164 |
| Unieke auteursnamen uit posts | **156** |
| Auteurs met >1 post | 47 |

Auteur-slugs zijn **afgeleid van e-mailadressen**, wat lelijke URL's oplevert:

```
/author/aleem-khan360pmo-com/     ← aleem.khan@360pmo.com
/author/agiledoodgmail-com/       ← agiledood@gmail.com
/author/seabreezes1iglide-net/    ← seabreezes1@iglide.net
/author/don/                      ← nette slug
/author/admin/                    ← generiek
```

**Top-auteurs:**

| Auteur | Posts |
|---|---|
| Luke Hohmann | 26 |
| Michael McCullough | 25 |
| Don McGreal | 23 |
| Geoff Watts | 16 |
| Stavros Stavru | 13 |
| Paul Goddard | 9 |
| Paul Boos | 7 |
| Michael Sahota | 6 |
| Belinda Waldock | 5 |

De lange staart: ~110 auteurs met precies 1 post.

Auteursbiografieën zitten in de `saboxplugin-*`-blokken (Simple Author Box) én in de 69 `user/`-profielpagina's. Beide zijn bruikbaar als bron voor auteursdata.

### 1.6 Categorieën

13 stuks, allemaal met vaste slug. Volledig:

| Slug | Posts |
|---|---|
| `games` | 271 |
| `agile` | 209 |
| `team-dynamics` | 126 |
| `project-management` | 101 |
| `communication` | 89 |
| `development` | 68 |
| `product` | 67 |
| `requirements` | 51 |
| `lean` | 38 |
| `instructing` | 29 |
| `news` | 21 |
| `uncategorized` | 3 |
| `commentary` | 3 |

15 posts hebben géén categorie (dit zijn de dode/oude captures).

### 1.7 Tags

| Meting | Aantal |
|---|---|
| Tag-archiefmappen | 324 |
| Unieke tags gebruikt op posts | **315** |
| Posts zonder tags | 114 |

Er zit ruis in de tagset: `tag-734`, `tag---2 tag-789` (tag zonder naam), enkele tags met één post. Opschoning is wenselijk maar niet blokkerend.

### 1.8 Publicatie- en wijzigingsdatums

| Meting | Aantal |
|---|---|
| Posts met `article:published_time` | 300 / 348 |
| Posts met `article:modified_time` | 300 / 348 |
| Posts zonder datum in meta | 48 |
| Datum die afwijkt van URL-jaar/maand | **1** |

Formaat: `2012-11-02T10:47:05+00:00` (ISO 8601, UTC).

De 48 posts zonder meta-datum zijn de oude-thema- en dode captures. Voor die posts is de datum af te leiden uit:
1. de URL (`/2009/06/…` → juni 2009);
2. de `wpn_postinfo`-regel in het oude thema.

De enige afwijking: `/2016/05/5668/` heeft `published_time = 2016-06-01`, dus URL-maand 05 tegen datum-maand 06. Bij het genereren van nieuwe URL's moet de **URL** leidend zijn, niet de datum, anders breekt die permalink.

### 1.9 Slugs

| Meting | Aantal |
|---|---|
| Dubbele slugs | **0** |
| Numerieke slugs (post-ID als slug) | 3 — `5668`, `10283`, `4729` |
| Slug ≠ slugify(titel) | 91 / 348 |

De 91 afwijkingen zijn grotendeels géén echt probleem: ze komen voort uit de **titelvervuiling** (§3.6), plus normale redactionele verschillen:

```
slug: team-trust-canvas
titel: "Building team trust using a Trust Canvas"

slug: scrum-card-game
titel: "ScrumCardGame – simple and realistic Scrum simulation"

slug: 5668
titel: "Traditional vs. Agile Approach of Managing Work"
```

Conclusie: **de slug uit het URL-pad is de betrouwbare bron**, niet de titel.

### 1.10 Vertalingen

| Taal | Posts | Overige pagina's |
|---|---|---|
| Spaans (`es/`) | 274 | incl. `all-games`, `vision` |
| Frans (`fr/`) | 275 | |
| Portugees (`pt/`) | 275 | |
| Russisch (`ru/`) | 275 | |

Samen ~1.100 vertaalde posts en ~5.100 vertaalde HTML-bestanden.

**Belangrijk technisch verschil:** vertaalde pagina's hebben `<body>` **zonder class-attribuut**. Categorieën, tags, post-ID en post-type zijn daar dus niet uit de markup af te leiden. De koppeling moet via het URL-pad (`/es/2012/11/delight/` ↔ `/2012/11/delight/`).

---

## 2. Media

### 2.1 Bestanden in `wp-content/uploads/`

| Extensie | Aantal |
|---|---|
| `.jpg` | 117 |
| `.png` | 106 |
| `.pdf` | 10 |
| `.jpeg` | 8 |
| `.pptx` | 3 |
| **Totaal** | **244** |

Geen video- of audiobestanden aanwezig. Geen `.zip`, `.docx` of andere downloads.

### 2.2 WordPress-gegenereerde varianten

| Meting | Aantal |
|---|---|
| Originele bestanden | 128 |
| Grootte-varianten (`-300x211.jpg` etc.) | **116** |
| Unieke afbeeldingen met ≥1 variant | 105 |
| Varianten waarvan het **origineel ontbreekt** | **60** |

Die laatste 60 zijn een reëel kwaliteitsverlies: alleen de verkleinde versie is bewaard. Voorbeeld: `2009/06/mrhappyface-225x300.jpg` bestaat, de full-size versie niet.

Per jaar (uploadmap):

| Jaar | Bestanden | Jaar | Bestanden |
|---|---|---|---|
| 2015 | 36 | 2019 | 14 |
| 2011 | 32 | 2023 | 12 |
| 2016 | 30 | 2020 | 11 |
| 2012 | 28 | 2014 | 10 |
| 2017 | 26 | 2013 | 8 |
| 2022 | 18 | 2009 | 8 |
| | | 2018 | 6 |
| | | 2021 | 3 |

Plus 2 bestanden in `uploads/tdomf/` (TDO Mini Forms plugin).

### 2.3 Duplicaten

Op MD5-hash gemeten over alle 244 uploadbestanden: **1 duplicaatgroep**.

```
wp-content/uploads/2011/04/logo-org.png
wp-content/uploads/2011/05/logo-newTagline.png   (identiek)
```

Dat is verwaarloosbaar. Er is dus geen duplicaatprobleem in de media-bibliotheek zelf.

### 2.4 Media buiten `uploads/`

96 bestanden in `wp-content/themes/`, `wp-admin/` en `wp-includes/` (theme-sprites, admin-iconen, fonts). **Allemaal weggooibaar** — het nieuwe thema neemt dit niet over.

### 2.5 Ontbrekende media — grootste medialek

Van de afbeeldingen die vanuit de post-content worden aangeroepen:

| Herkomst van `<img src>` | Referenties |
|---|---|
| Lokaal `wp-content/uploads/…` | 227 |
| **`web.archive.org/…`** (niet gedownload) | **111** |
| Overig (extern, data-URI) | 5 |

En van de 227 lokale referenties: **116 unieke paden bestaan niet op schijf** (119 referenties). Voorbeelden:

```
wp-content/uploads/2015/03/The-Estimation-Quest-Template.png
wp-content/uploads/2015/03/The-Fatware-Matrix.png
wp-content/uploads/2009/06/mrhappyface-225x300.jpg
```

Sommige daarvan zijn nooit van dit domein geweest (`agify.me`, `gravatar.com`) — de crawler heeft ze wél naar een lokaal pad herschreven zonder ze te downloaden.

**Netto: circa 230 afbeeldingsreferenties in de content hebben geen lokaal bestand.** Dit is het grootste inhoudelijke gat in de export.

### 2.6 Curiositeit — data-URI opgeslagen als bestand

De crawler heeft een base64 data-URI behandeld als een URL en opgeslagen als een `.html`-bestand met een bestandsnaam van ~4 kB:

```
image/png%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAA…AAElFTkSuQmCC.html
```

5 referenties. Bij de conversie moet de data-URI hersteld of het plaatje verwijderd worden.

---

## 3. HTML en content-markup

Gemeten binnen `.entry-content` van alle 333 bruikbare posts.

### 3.1 Elementfrequentie

| Element | Aantal | Element | Aantal |
|---|---|---|---|
| `p` | 7.772 | `h3` | 289 |
| `li` | 5.226 | `ol` | 221 |
| `strong` | 3.299 | `h2` | 201 |
| `div` | 1.918 | `figure` | 169 |
| `br` | 1.693 | `tr` | 105 |
| `ul` | 1.258 | `h4` | 92 |
| `em` | 719 | `figcaption` | 66 |
| `span` | 642 | `blockquote` | 53 |
| `pre` | 572 | `table` | 25 |
| `td` | 391 | `iframe` | 7 |
| `a` | 347 | `script` | 6 |
| `img` | 343 | | |

Verdeling over posts (aantal posts dat het element bevat):

| Element | Posts |
|---|---|
| `ul` | 219 |
| `img` | 177 |
| `ol` | 85 |
| `figure` | 62 |
| `h2` | 42 |
| `h3` | 37 |
| `figcaption` | 27 |
| `blockquote` | 24 |
| `h4` | 17 |
| `table` | **11** |
| `iframe` | **7** |
| `pre` | 5 |

De content is dus overwegend **eenvoudig**: alinea's, lijsten, kopjes, vetgedrukte labels, afbeeldingen. Complexe structuren zijn zeldzaam.

De 572 `pre`-elementen zitten in slechts 5 posts — dat is bijna zeker `<pre>` misbruikt voor layout, niet voor code. Handmatig controleren.

### 3.2 Gutenberg-blockmarkup

| Class | Voorkomens |
|---|---|
| `wp-block-heading` | 174 |
| `wp-block-list` | 123 |
| `wp-block-image` | 102 |
| `is-layout-flow` | 14 |
| `has-text-align-center` | 11 |

Aanwezig, maar beperkt: alleen de nieuwere posts zijn in Gutenberg bewerkt. Er zijn **geen HTML-comments met blockdefinities** (`<!-- wp:paragraph -->`) — die worden bij rendering weggegooid. De blockmarkup is dus alleen als CSS-class zichtbaar en kan volledig verwijderd worden.

### 3.3 Shortcodes

**Geen echte shortcodes gevonden.** Alles wat op `[iets]` lijkt is gewone tekst tussen blokhaken:

```
[Optional]  [insert name]  [See appendix]  [3-minutes]
```

WordPress heeft alle shortcodes al gerenderd vóór de crawl. Dat is goed nieuws: er is geen shortcode-parser nodig.

### 3.4 Embeds en iframes

7 iframes, **allemaal met een `web.archive.org`-URL als `src`**. De oorspronkelijke embed-bestemmingen (vrijwel zeker YouTube/Vimeo) zitten verstopt in het archief-URL-pad en moeten daaruit teruggerekend worden:

```
https://web.archive.org/web/<timestamp>if_/https://www.youtube.com/embed/<id>
                                          └── originele URL begint hier
```

Handmatige controle van 7 stuks is haalbaar.

### 3.5 WordPress- en plugin-specifieke rommel

Elementen die **in `.entry-content` staan maar er niet in horen**:

| Class | Voorkomens | Herkomst | Actie |
|---|---|---|---|
| `saboxplugin-wrap` en varianten | ~127 per class | Simple Author Box | **verwijderen** — auteursdata naar frontmatter |
| `um-avatar`, `um-avatar-gravatar` | 64 | Ultimate Member | verwijderen |
| `avatar`, `avatar-100`, `gravatar` | 73 / 64 | avatars | verwijderen |
| `vcard`, `fn`, `author` | 131 | hCard microformats | verwijderen |
| `hps`, `GRcorrect` | 44 / 11 | **Google Translate-residu** | verwijderen |
| `lt-line-clamp__raw-line` | 25 | LanguageTool-residu | verwijderen |
| `MsoNormal` | 19 | **Word-plak-residu** | verwijderen |
| `Apple-style-span` | 35 | **Pages/Mail-plak-residu** | verwijderen |
| `clearfix` | 132 | thema-layout | verwijderen |
| `tag-cloud-link` | 45 | widget | verwijderen |
| `alignnone`, `aligncenter`, `alignleft` | 71 samen | uitlijning | **betekenisdragend** — bewaren als attribuut |
| `size-large`, `size-thumbnail`, `size-full` | 98 samen | afbeeldingsformaat | mag weg (Astro bepaalt zelf) |
| `wp-caption`, `wp-caption-text` | 38 / 39 | onderschriften | **betekenisdragend** — omzetten naar figure/figcaption |
| `gallery-item`, `gallery-icon`, `attachment-thumbnail` | 20 elk | WP-gallery | **betekenisdragend** — 20 galerij-items, apart behandelen |

De belangrijkste: **de Simple Author Box zit binnen `.entry-content`**, niet erbuiten. Wie naïef de hele `.entry-content` naar Markdown converteert, krijgt in élke post een auteursbiografie met avatar en socialmedia-links mee. Dit moet vóór conversie weggeknipt.

### 3.6 Titelvervuiling door de oude vertaalplugin ⚠

Dit is de belangrijkste contentbevinding.

Een oude qTranslate-achtige plugin sloeg alle taalvarianten in één titelveld op. Na verwijdering van de plugin staan die varianten aaneengeplakt in de HTML — in **zowel `<title>` als `og:title` als de `h1`**:

```html
<title>The Backlog is in the Eye of the BeholderO Backlog está no olho de quem
vêEl Backlog esta en el ojo de quien lo miraБэклог в глазах смотрящего -
TastyCupcakes.org</title>
```

Meting:

| Meting | Aantal |
|---|---|
| Titels met camelCase-grens (waarschijnlijk aaneengeplakt) | **102** |
| Titels met Cyrillisch schrift (zeker aaneengeplakt) | 34 |

**Er is geen betrouwbare bron voor de schone Engelse titel in de export.** Het scheidingspunt is niet machinaal te bepalen: `"…BeholderO Backlog…"` heeft geen scheidingsteken. Wat wél helpt:

- de tag- en categorie-archiefpagina's tonen soms een afgekapte titel;
- de vertaalde varianten (`es/`, `fr/`, `pt/`, `ru/`) bevatten dezelfde concatenatie, wat helpt bij het vinden van het splitspunt;
- de slug is meestal een betrouwbare afgeleide van de Engelse titel.

**Aanbeveling: automatisch een voorstel genereren op basis van de slug, daarna alle ~102 titels handmatig laten valideren.** Dit is de enige echte handmatige stap in de migratie.

De `.entry-content` van de posts is **niet** vervuild — die is netjes Engelstalig. Alleen de titels.

### 3.7 Inline styles

| Meting | Aantal |
|---|---|
| Elementen met `style`-attribuut | 1.713 |
| Posts met ≥1 inline style | 81 / 333 |

Grotendeels breedte/hoogte op afbeeldingen en Word-plak-residu. Standaard verwijderen; alleen bij de 11 posts met tabellen even controleren of de styling betekenis draagt.

### 3.8 Links binnen de content

| Type | Aantal |
|---|---|
| Relatieve links (`../../../…`) | 342 |
| Anker-links (`#…`) | 5 |
| `mailto:` | 0 |
| **Absolute externe links** | **0** |

Dit is een serieus signaal: **er staat geen enkele externe link meer in de content.** De crawler heeft alles gelokaliseerd. De 152 unieke interne linkdoelen bestaan grotendeels uit auteurbox-links:

```
25×  ../../../author/admin/index.html
24×  ../../../author/don/index.html
24×  ../../../about/don-mcgreal/index.html
22×  ../../../index.html
16×  ../../../author/geoffwatts/index.html
 3×  ../../../category/games/index.html
```

Echte redactionele post-naar-post links zijn er dus **nauwelijks**. Wat wel bestond aan uitgaande links naar externe bronnen (boeken, tools, blogs van auteurs) is in deze export **verloren gegaan**. Herstel kan alleen via een nieuwe Wayback-fetch van de originele captures.

### 3.9 Reacties

`#comments` (comments-area) is aanwezig in de moderne posts, maar bevat **0 reactie-items**. De `wp-block-latest-comments__comment`-blokken in de HTML zijn een sidebar-widget met site-brede recente reacties, niet de reacties bij die post.

De `comment-page-1/`-URL's bestaan wel (43 stuks), wat betekent dat er ooit reacties waren — maar de inhoud is niet mee gecrawld.

**Conclusie: reacties zijn niet migreerbaar.** Als reacties gewenst zijn, moet dat een nieuw systeem worden (Giscus, Utterances) of wegblijven.

### 3.10 Verwijderbare elementen — samenvatting

| Categorie | Verwijderen? |
|---|---|
| `saboxplugin-*` auteursbox | ✅ ja, data naar frontmatter |
| `um-*`, avatars, gravatars | ✅ ja |
| `vcard` / `fn` microformats | ✅ ja |
| `hps`, `GRcorrect`, `lt-line-clamp__raw-line` | ✅ ja (vertaaltool-residu) |
| `MsoNormal`, `Apple-style-span` | ✅ ja (plak-residu) |
| `clearfix`, `tag-cloud-link` | ✅ ja |
| `wp-block-*` classes | ✅ ja (semantiek blijft in de tag) |
| `size-*` classes | ✅ ja |
| Inline `style` | ✅ ja, met controle bij tabellen |
| `<script>` in content (6×) | ✅ ja |
| Lege `<p>`, `<p><em></em></p>` | ✅ ja |
| `align*` classes | ⚠ omzetten naar attribuut |
| `wp-caption*` | ⚠ omzetten naar figure/figcaption |
| `gallery-*` | ⚠ omzetten naar galerij-component |

---

## 4. Relaties

| Relatie | Bron in de HTML | Betrouwbaarheid |
|---|---|---|
| post → auteur | `.entry-meta a[href*="/author/"]`; fallback `saboxplugin-authorname` | 333/348 (96%) |
| post → categorie | `category-*` classes op `<article>` | 333/348 |
| post → tags | `tag-*` classes op `<article>` | 234/348 hebben tags |
| post → afbeeldingen | `<img src>` binnen `.entry-content` | 177 posts; 230 refs zonder bestand |
| post → post-ID | `postid-*` op `<body>`, `id="post-N"` op `<article>` | 333/348 |
| post → vertaling | via identiek URL-pad onder `/es/`, `/fr/`, `/pt/`, `/ru/` | 274–275 per taal |
| post → attachments | geneste URL onder de post-slug | 39 attachmentpagina's |
| post ↔ post | interne links in content | **vrijwel afwezig** |
| auteur → bio | `saboxplugin-desc` + `user/<naam>/` profielpagina | 156 auteurs |
| categorie → posts | `category/<slug>/` archief + pagination | volledig |
| tag → posts | `tag/<slug>/` archief + pagination | volledig |

**Belangrijk voor het contentmodel:** de post→auteur-relatie is 1-op-1 (geen co-auteurs aangetroffen). Post→categorie is 1-op-veel (gemiddeld ~3 categorieën per post). Post→tag is 1-op-veel maar 114 posts hebben er geen.

---

## 5. URL-structuur

### 5.1 Aangetroffen patronen

| Type | Patroon | Voorbeeld | Aantal |
|---|---|---|---|
| Artikel | `/YYYY/MM/<slug>/` | `/2012/11/delight/` | 348 |
| Pagina | `/<slug>/` | `/about/` | ~10 |
| Genest pagina | `/<parent>/<slug>/` | `/about/get-involved/` | 5 |
| Categorie | `/category/<slug>/` | `/category/games/` | 13 |
| Categorie-paginering | `/category/<slug>/page/N/` | `/category/games/page/14/` | ~35 |
| Tag | `/tag/<slug>/` | `/tag/teamwork/` | 324 |
| Tag-paginering | `/tag/<slug>/page/N/` | `/tag/teamwork/page/3/` | ~49 |
| Auteur | `/author/<slug>/` | `/author/don/` | 164 |
| Homepage-paginering | `/page/N/` | `/page/2/`, `/page/3/` | 2 |
| Attachment | `/YYYY/MM/<post>/<attachment>/` | `/2011/10/continuous-integration-with-lego/finished-cube-real-1/` | 39 |
| Reactiepaginering | `/YYYY/MM/<slug>/comment-page-1/` | `/2018/01/daily-scrum-game/comment-page-1/` | 43 |
| Vertaling | `/<lang>/YYYY/MM/<slug>/` | `/es/2012/11/delight/` | ~1.100 |
| RSS-feed | `/<willekeurig>/feed/`, `/feed/atom/` | `/category/games/feed/` | 545 |
| Gebruikersprofiel | `/user/<naam>/` | `/user/don.mcgreal/` | 69 |
| Systeem | `/wp-admin/`, `/wp-json/`, `/wp-login.php` | | 115 |

### 5.2 Wijken URL's af van slug/bestandsnaam?

**Nee.** Elke post staat als `<slug>/index.html`, en de mapnaam is exact de WordPress-slug. Er zijn:

- **0 dubbele slugs**;
- **1 datum-afwijking** (`/2016/05/5668/` heeft publicatiedatum 2016-06-01);
- **3 numerieke slugs** (`5668`, `10283`, `4729`) — WordPress-fallback toen de titel geen bruikbare slug opleverde.

De URL-structuur is dus consistent en betrouwbaar. **De URL is de meest betrouwbare bron van waarheid in deze hele export** — betrouwbaarder dan de titel, betrouwbaarder dan de meta-datum.

### 5.3 Bijzondere URL's

| URL | Opmerking |
|---|---|
| `/tastycupcakes-home/` | oude homepage, duplicaat van `/` |
| `/about/michael-mccullough/michael-mccullough/` | dubbel geneste duplicaatpagina |
| `/login/`, `/password-reset/` | Ultimate Member plugin — **vervalt volledig** |
| `/game/`, `/submit-game-reference/` | formulierpagina's (TDO Mini Forms) — **werken niet statisch** |
| `/all-games/`, `/vision/` | **bestaan alleen in `/es/`** — Engelse versie ontbreekt |
| `/user/*/` | 69 profielpagina's — **vervallen** |
| `/wp-admin/`, `/wp-json/`, `/wp-login.php` | **vervallen** |

### 5.4 Aanbeveling URL-behoud

| Oude URL | Nieuwe URL | Actie |
|---|---|---|
| `/YYYY/MM/<slug>/` | identiek | **1-op-1 behouden** |
| `/<pagina>/` | identiek | 1-op-1 behouden |
| `/category/<slug>/` | identiek | 1-op-1 behouden |
| `/tag/<slug>/` | identiek | 1-op-1 behouden |
| `/author/<email-slug>/` | `/author/<nette-slug>/` | **301-redirect** |
| `/…/page/N/` | identiek | behouden waar zinvol |
| `/…/comment-page-1/` | naar de post | **301-redirect** |
| `/YYYY/MM/<post>/<attachment>/` | naar de post | **301-redirect** |
| `/…/feed/` | `/rss.xml` of per-taxonomie feed | **301-redirect** |
| `/user/*/`, `/login/`, `/wp-*` | — | **410 Gone** of verwijderen |

---

## 6. Aanbevolen contentmodel

Vier collecties. Meer is niet nodig — er zijn geen custom post types.

```
posts       348 items    het hart van de site
pages        10 items    redactionele losse pagina's
authors     156 items    naam, bio, avatar, links
taxonomies   13 + 315    categorieën en tags
```

**Ontwerpkeuzes:**

1. **Auteurs als eigen collectie**, niet als losse frontmatter-string. Er zijn 156 auteurs met biografieën en socialmedia-links; die moeten één keer bestaan, niet 348 keer gedupliceerd.
2. **Categorieën als data-bestand**, niet als collectie. Slechts 13 stuks, met alleen slug + naam. Een `categories.json` volstaat.
3. **Tags impliciet** uit de posts afleiden. 315 tags met alleen een naam — een eigen bestand per tag is overkill.
4. **Geen aparte collectie voor vertalingen.** Als vertalingen meegaan, dan als taalmappen binnen `posts` (Astro i18n-routing), niet als parallel model.

---

## 7. Aanbevolen Markdown-structuur

```
content/
├── posts/
│   ├── 2009/
│   │   └── 06/
│   │       ├── planning-poker.md
│   │       └── telephone-game.md
│   ├── 2012/
│   │   └── 11/
│   │       └── delight.md
│   └── …
├── pages/
│   ├── about.md
│   ├── about/
│   │   ├── don-mcgreal.md
│   │   ├── get-involved.md
│   │   └── translation-project.md
│   └── agile-games-conference-2011.md
├── authors/
│   ├── luke-hohmann.md
│   ├── michael-mccullough.md
│   └── …
└── data/
    ├── categories.json
    └── redirects.csv
```

**Waarom `posts/YYYY/MM/slug.md`:** het bestandspad is daarmee een directe afspiegeling van de permalink. Dat maakt de URL-generatie in Astro triviaal (`/[...slug]`), houdt 348 bestanden overzichtelijk verdeeld, en maakt een ontbrekend bestand meteen zichtbaar als een gebroken URL.

**Waarom geen platte map:** 348 bestanden in één map is werkbaar maar verliest de datum-informatie uit het pad, waardoor de permalink volledig van de frontmatter afhangt — precies de datum die bij 48 posts onbetrouwbaar is.

---

## 8. Aanbevolen media-structuur

```
public/
└── media/
    ├── 2009/06/mrhappyface.jpg
    ├── 2012/11/delight-setup.png
    └── …
```

**Uitgangspunten:**

1. **Behoud de `YYYY/MM/`-indeling** van WordPress. Dat maakt de herschrijving van `wp-content/uploads/2015/03/x.png` naar `/media/2015/03/x.png` een pure padvervanging — geen mapping-tabel nodig.
2. **Gooi de grootte-varianten weg** waar het origineel bestaat (56 bestanden). Astro's `<Image>` genereert zelf responsive varianten.
3. **Behoud de 60 varianten waarvan het origineel ontbreekt** — dat is de enige overgebleven versie.
4. **PDF's en PPTX apart**: `public/downloads/`. 13 bestanden, geen beeldverwerking nodig.
5. **De 230 ontbrekende referenties** krijgen geen placeholder maar een expliciete registratie in `migration/missing-media.csv`, zodat later gericht bijgehaald kan worden.

---

## 9. Voorgestelde frontmatter

### Post

```yaml
---
title: "Delight"
slug: "delight"
permalink: "/2012/11/delight/"
date: 2012-11-02T10:47:05Z
updated: 2012-11-02T11:45:11Z
author: "geoff-watts"
categories:
  - games
  - agile
  - communication
  - product
  - requirements
tags:
  - collaboration
  - creativity
  - customer
  - emergence
  - improv
wordpress:
  id: 2650
  source: "output/2012/11/delight/index.html"
  capture: "modern"
translations:
  es: "/es/2012/11/delight/"
  fr: "/fr/2012/11/delight/"
  pt: "/pt/2012/11/delight/"
  ru: "/ru/2012/11/delight/"
---
```

**Toelichting op de keuzes:**

- `permalink` staat er **expliciet** in, ook al is die af te leiden uit het pad. Dat maakt URL-behoud controleerbaar met een script en beschermt tegen het ene geval waar datum en URL uiteenlopen.
- `date` komt uit `article:published_time`; ontbreekt die, dan uit de URL — met `date_source: url` erbij, zodat onbetrouwbare datums zichtbaar blijven.
- `author` is een **slug-referentie** naar de authors-collectie, geen vrije tekst.
- `wordpress.*` is bewust bewaard: post-ID en bronbestand maken de migratie reproduceerbaar en controleerbaar. Kan later verwijderd worden.
- `wordpress.capture` legt vast of de post uit een moderne, oude of herstelde capture komt — precies de posts die extra controle verdienen.
- `translations` alleen opnemen als vertalingen meegaan.

### Pagina

```yaml
---
title: "About TastyCupcakes"
slug: "about"
permalink: "/about/"
updated: 2024-06-11T09:12:00Z
wordpress:
  id: 2
  source: "output/about/index.html"
  capture: "modern"
---
```

### Auteur

```yaml
---
name: "Geoff Watts"
slug: "geoff-watts"
wordpress_slug: "geoffwatts"
avatar: "/media/authors/geoff-watts.jpg"
bio: "…"
website: "https://…"
post_count: 16
---
```

`wordpress_slug` is nodig om de 301-redirects van de oude e-mail-gebaseerde auteur-URL's te genereren.

---

## 10. Migratierisico's

| # | Risico | Omvang | Impact | Beheersing |
|---|---|---|---|---|
| 1 | **Aaneengeplakte meertalige titels** | ~102 posts | hoog — titels op de site fout | slug-gebaseerd voorstel + handmatige validatie |
| 2 | **Ontbrekende afbeeldingsbestanden** | ~230 referenties | hoog — gaten in artikelen | registreren, gericht bijhalen uit Wayback |
| 3 | **Externe links volledig weggelokaliseerd** | alle uitgaande links | hoog — SEO en bruikbaarheid | opnieuw fetchen van originele captures |
| 4 | **Auteursbox binnen `.entry-content`** | 127 posts | hoog als je het mist | expliciet strippen vóór conversie |
| 5 | **Twee themageneraties in de export** | 8 posts + 6 pagina's | midden | tweede parser voor `wpn_post`-markup |
| 6 | **Dode redirect-captures** | 7 posts | midden | 6 herstelbaar, 1 verloren |
| 7 | **Homepage-capture is een postpagina** | 1 | midden | homepage opnieuw ontwerpen |
| 8 | **Ontbrekende Engelse pagina's** (`/all-games/`, `/vision/`) | 2 | midden | herleiden uit `/es/`-versie of opnieuw fetchen |
| 9 | **48 posts zonder betrouwbare datum** | 48 | midden | URL als fallback, markeren in frontmatter |
| 10 | **Auteur-URL's afgeleid van e-mailadressen** | 164 | midden — privacy én lelijke URL's | nieuwe slugs + 301-redirects |
| 11 | **7 iframes naar `web.archive.org`** | 7 | laag | originele embed-URL terugrekenen |
| 12 | **20 gallery-items zonder gallery-component** | 20 | laag | eigen Astro-component |
| 13 | **60 afbeeldingen alleen als thumbnail** | 60 | laag | accepteren of bijhalen |
| 14 | **Reacties niet gecrawld** | 43 posts hadden reacties | laag | accepteren of nieuw systeem |
| 15 | **Data-URI als bestandsnaam opgeslagen** | 5 refs | laag | herstellen of verwijderen |
| 16 | **`pre` misbruikt voor layout** | 5 posts, 572 elementen | laag | handmatig bekijken |
| 17 | **Scope-explosie door vertalingen** | ~1.100 posts | **project-bepalend** | expliciete beslissing vóór fase 2 |

---

## 11. Wat eerst handmatig gecontroleerd moet worden

Op volgorde van belang:

1. **De ~102 aaneengeplakte titels.** Er is geen machinale oplossing. Genereer een CSV met `slug, ruwe titel, voorstel` en loop die door. Reken op 1–2 uur.
2. **De 8 oude-thema-posts en 6 oude-thema-pagina's.** Andere markup, andere containers. Klein genoeg om per stuk te bekijken, groot genoeg om fout te gaan bij blind automatiseren.
3. **De 7 dode captures.** Voor 6 is `comment-page-1/` de bron; controleer of die inhoudelijk compleet is. `/2018/04/test-and-learn-2/` moet een beslissing krijgen: opnieuw fetchen uit Wayback, of laten vervallen met een 410.
4. **De homepage.** Wat er nu staat is een postpagina. De nieuwe homepage moet ontworpen worden, niet gemigreerd.
5. **`/all-games/` en `/vision/`.** Bepaal of deze pagina's terugmoeten en waar de Engelse tekst vandaan komt.
6. **De 11 posts met tabellen.** Markdown-tabellen zijn beperkter dan HTML-tabellen; controleer of de structuur overleeft.
7. **De 7 iframes.** Zoek de originele embed-URL en beslis of de video nog bestaat.
8. **De 5 posts met `pre`-elementen.** Vaststellen of het code of layout is.
9. **De 20 gallery-items.** Vaststellen of er een galerij-component nodig is of dat losse afbeeldingen volstaan.
10. **De 3 numerieke slugs.** Beslissen of `/2016/05/5668/` zo blijft (URL-behoud) of een nette slug met redirect krijgt.
11. **Steekproef van 20 willekeurige posts** na conversie, vergelijkend met de originele HTML.

---

## 12. Wat volledig geautomatiseerd kan worden

| Stap | Automatiseerbaar | Toelichting |
|---|---|---|
| Post-inventarisatie uit URL-paden | ✅ volledig | patroon is 100% consistent |
| Extractie categorieën + tags | ✅ volledig | uit `<article class>`, 333/348 |
| Extractie post-ID | ✅ volledig | uit `postid-*` |
| Extractie publicatie-/wijzigingsdatum | ✅ volledig | og-meta, met URL-fallback |
| Extractie auteur | ✅ volledig | `.entry-meta` met sabox-fallback |
| Extractie slug en permalink | ✅ volledig | uit het pad |
| Strippen van plugin-rommel | ✅ volledig | vaste class-lijst uit §3.5 |
| Strippen van inline styles | ✅ volledig | met uitzondering voor tabellen |
| HTML → Markdown-conversie | ✅ volledig | de content is structureel eenvoudig |
| Herschrijven `uploads/` → `/media/` | ✅ volledig | pure padvervanging |
| Media kopiëren + varianten opschonen | ✅ volledig | regel uit §8 |
| Detecteren ontbrekende media | ✅ volledig | referenties toetsen aan schijf |
| Auteurscollectie genereren | ✅ volledig | uit sabox + `user/`-pagina's |
| Redirect-tabel genereren | ✅ volledig | auteur, attachment, comment-page, feed |
| Vertaal-koppeling leggen | ✅ volledig | via identiek URL-pad |
| Validatie: elke oude URL bestaat nog | ✅ volledig | vergelijking oude paden ↔ gegenereerde routes |
| Validatie: elke afbeelding resolvet | ✅ volledig | |
| Validatie: elke interne link resolvet | ✅ volledig | |
| **Titels opschonen** | ❌ **niet** | zie §3.6 — handmatige validatie |
| **Oude-thema-parsing** | ⚠ half | parser schrijven kan, resultaat controleren moet |
| **Externe links herstellen** | ❌ niet uit deze export | vereist nieuwe Wayback-fetch |
| **Homepage** | ❌ niet | nieuw ontwerp |

**Verhouding:** ruwweg 95% van het werk is automatiseerbaar. De resterende 5% zit vrijwel volledig in de titels en de oude captures.

---

## 13. Openstaande beslissingen vóór fase 2

1. **Vertalingen: mee of niet?** Dit verviervoudigt de omvang van de migratie (348 → ~1.450 posts) en vraagt om i18n-routing in Astro. De vertalingen zijn vermoedelijk machinaal gemaakt; hun SEO-waarde moet dat werk rechtvaardigen.
2. **Ontbrekende media: bijhalen of accepteren?** ~230 referenties. Bijhalen betekent een nieuwe Wayback-fetch-ronde.
3. **Externe links: herstellen of laten vervallen?** Herstel vereist opnieuw ophalen van de originele captures.
4. **Auteur-URL's: behouden of vernieuwen?** De huidige slugs bevatten e-mailadressen. Vernieuwen is beter voor privacy én leesbaarheid, met 301-redirects.
5. **Reacties: nieuw systeem of weglaten?**
6. **Paginering: behouden?** `/page/N/`-URL's hebben doorgaans weinig SEO-waarde.

---

*Einde fase 1. Geen bestanden in `output/` gewijzigd.*
