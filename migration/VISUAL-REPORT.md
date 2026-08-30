# Fase 7 — Visuele regressietest

**Project:** TastyCupcakes.org
**Datum:** 2026-08-29
**Oud:** `output/` op `localhost:8081` · **Nieuw:** `dist/` op `localhost:8082`
**Methode:** structurele contentvergelijking over alle 454 pagina's + browsermetingen (Chromium, 1280×900 en 390×844)

## Samenvatting

| Prioriteit | Bevindingen |
|---|---|
| 1. Contentverlies | **geen** — 0 pagina's met noemenswaardig tekstverlies |
| 2. Functionaliteit | **1 opgelost** — Creative Commons-licentie was verdwenen |
| 3. Layout | **2 opgelost** — kapotte tabel-Markdown, koppen in tabelcellen |
| 4. Responsive | **geen problemen** — 0 horizontale overflow op alle geteste pagina's |
| 5. Kleine visuele verschillen | 5, alle bewust |

---

## 1. Methode

Screenshots vergelijken zegt weinig als het doel niet is om WordPress na te bouwen. De
zwaarste controle is daarom niet visueel maar structureel: voor **alle 454 gemigreerde
pagina's** is het bron-HTML-fragment naast de gebouwde pagina gelegd en zijn woorden,
koppen, afbeeldingen, links, lijsten, tabellen, citaten, bijschriften en iframes geteld.

De vergelijking gebeurt ná het verwijderen van de blokken die we bewust hebben weggehaald
(auteursbox, reactiewidget, plugin-afbeeldingen), zodat alleen echt verlies overblijft.

```bash
node migration/src/visualdiff.js   # → migration/content-diff.json + content-diff.csv
```

Daarnaast zijn acht pagina's in een echte browser gemeten op twee breedtes: typografie,
koppen, afbeeldingen die niet laden, navigatie, footer en horizontale overflow.

| Type | Pagina |
|---|---|
| Homepage | `/` |
| Representatief artikel | `/2012/11/delight/` |
| Lang artikel | `/2015/09/scrumgauntlet/` (8.830 woorden) |
| Artikel met afbeeldingen | `/2020/06/anxiety-party/` (12 afbeeldingen) |
| Categoriepagina | `/category/games/` |
| Auteurpagina | `/author/don-mcgreal/` |
| Contentpagina | `/about/` |
| Bijzondere HTML | `/2017/07/decoration-kanban/` (15 tabellen) |

---

## 2. Prioriteit 1 — Contentverlies

**Geen.** Over 454 pagina's:

| Element | Oud | Nieuw | Verschil |
|---|---|---|---|
| Woorden | 297.718 | 302.647 | **+4.929** |
| Koppen | 896 | 890 | −6 |
| Afbeeldingen | 227 | 226 | −1 |
| Links | 471 | 590 | +119 |
| Lijsten | 1.910 | 1.832 | −78 |
| **Lijst-items** | 6.479 | 6.559 | **+80** |
| Tabellen | 25 | 20 | −5 |
| Citaten | 55 | 55 | 0 |
| Bijschriften | 70 | 70 | 0 |
| Iframes | 7 | 7 | 0 |
| `<pre>` | 580 | 22 | −558 |

- **0 pagina's met meer dan 2% tekstverlies.** De 163 pagina's met méér tekst komen doordat
  `<pre>`-blokken die de bron per regel gebruikte nu doorlopende alinea's zijn.
- **1 lijst-item** verloren op de hele site (`/2016/06/paint-the-story-point/`).
- **1 kop** verloren (`/2013/03/play-doh-zoo-agile-ux-unleashed/`, een lege kop).
- **1 afbeelding** verloren (`/2017/09/the-large-scale-scrum-less-dynamics-game/`) — dat is een
  gravatar-avatar, terecht verwijderd. Alle 7 inhoudelijke afbeeldingen staan er, met hun
  originele externe URL teruggewonnen uit de Wayback-wrapper.

### De −558 `<pre>` is een verbetering, geen verlies

`/2017/10/deep-dive-into-kanban-essentials-using-donut-making/` had 530 `<pre>`-elementen,
gemiddeld 54 tekens, geen enkele met `<code>`:

```html
<pre>- Recommended size for each team: 8 members, one of them would be a quality Stud</pre>
<pre>down their team name on the chart, and put it up on the wall</pre>
```

Dat is plakschade uit Word, geen code. Het is nu gewone tekst en lijsten. De woordtelling
op die pagina daalt niet.

### De −78 lijsten zijn lege omhulsels

De bron bevat `<ul>`-elementen zonder `<li>`, genest in andere lijsten. Op
`/2016/06/first-things-first/`: 65 lijsten met 154 items, waarvan meerdere lijsten nul
directe items hebben. Die omhulsels verdwijnen; de items niet — vandaar +80 items over de
hele site tegenover −78 lijsten.

### Lege bijschriften: al kapot in de bron

45 `<figure>`-elementen op 21 pagina's hebben een bijschrift zonder afbeelding, waarvan 19 op
`/2015/09/scrumgauntlet/`. Gecontroleerd in de bron: die pagina heeft daar **20 figures en
maar 1 afbeelding**. De overige 19 zijn nooit meegecrawld. De migratie bewaart de
bijschriften ("Requirements", "Done", "Gauntlet game area layout") correct.

**Voorstel, niet uitgevoerd:** een bijschrift zonder afbeelding leest nu als een losse
tekstregel. Een klein kader met "afbeelding niet beschikbaar" zou dat verklaren. Dat is
cosmetisch en raakt 21 pagina's; zeg het als je het wilt.

---

## 3. Prioriteit 2 — Functionaliteit

### Opgelost: de Creative Commons-licentie was verdwenen

De oude site had op **4.352 pagina's** in de footer:

> This work is licensed under a Creative Commons Attribution 4.0 International License.

In de nieuwe site stond die nergens. Erger: mijn footer zei
`© 2026. Content van de TastyCupcakes-community.`, wat het tegenovergestelde suggereert van
wat er juridisch geldt.

Dit is geen cosmetiek maar een juridische regressie: bezoekers en hergebruikers moeten kunnen
zien onder welke voorwaarden de content valt. De footer bevat nu weer de licentie met een
`rel="license"`-link naar `creativecommons.org/licenses/by/4.0/`, op alle 1.090 pagina's.

### Bewust vervallen

| Functie | Oud | Nieuw |
|---|---|---|
| Sidebar met tagwolk, recente reacties en recente posts | ~50 links per pagina | vervallen; ontdekking via categorie-, tag- en auteurpagina's |
| Login en wachtwoordherstel | in de hoofdnavigatie | vervallen (Ultimate Member, werkt niet statisch) |
| Reacties | reactieformulier per post | vervallen; nooit meegecrawld (ANALYSIS §3.9) |
| Zoekveld | in de header | vervallen |

### Navigatie

| | Oud | Nieuw |
|---|---|---|
| Items | About TastyCupcakes · Don McGreal · Michael McCullough · Login · Password Reset | Home · Games · Agile · About |
| Aantal links | 5 | 4 |

De twee oprichterspagina's staan niet meer in de topnavigatie, maar zijn wel gelinkt vanaf
`/about/` en behouden hun URL. Geen onbereikbare content.

De footer is compacter: 9 links (acht categorieën plus RSS) tegen 11–34 in de oude
themafooter, die per pagina wisselde met categorie- en tagwidgets.

---

## 4. Prioriteit 3 — Layout

### Opgelost: kapotte tabel-Markdown

`/2017/07/decoration-kanban/` toonde letterlijk dit op de pagina:

```
| 1 | 0.54</p>
| 2 | 0.54</p>
```

Oorzaak: een GFM-pipe-tabel kan alleen inline-inhoud bevatten. Cellen met `<p>`, lijsten of
`<br>` leveren regelafbrekingen op die de tabel breken. De conversie produceerde ongeldige
Markdown, die als platte tekst werd gerenderd.

Opgelost in twee stappen: losse `<p>` in een cel wordt platgeslagen tot inline-inhoud, en
tabellen die daarna nog blok-inhoud bevatten blijven HTML, in een `div.table-scroll`. De
tabellentelling ging van 15 naar 20; de vijf resterende zijn layout-tabellen zonder rijen die
terecht zijn uitgepakt.

### Opgelost: koppen in tabelcellen

De bron had `<h5>` in `<th>`. Een kop in een tabelcel is opmaak, geen documentstructuur, en
vervuilt de koppenhiërarchie. Die worden nu `<strong>`.

### Eerder al opgelost (fase 6)

Twaalf pagina's hadden twee of meer `<h1>`, doordat de content zelf een `<h1>` bevatte naast
de paginatitel. De migrator verlaagt content-`h1` nu naar `h2`. Alle 1.090 pagina's hebben nu
exact één `<h1>`.

---

## 5. Prioriteit 4 — Responsive

Gemeten op 1280×900 en 390×844.

| Pagina | Overflow 1280 | Overflow 390 |
|---|---|---|
| Homepage | 0 | 0 |
| Artikel | 0 | 0 |
| Lang artikel | 0 | 0 |
| Artikel met afbeeldingen | 0 | 0 |
| Categoriepagina | 0 | 0 |
| Auteurpagina | 0 | 0 |
| Contentpagina | 0 | 0 |
| Bijzondere HTML (tabellen) | 0 | 0 |

**Geen enkele pagina loopt horizontaal over.** Op `/2017/07/decoration-kanban/` bij 390px zijn
de `table`-elementen breder dan het scherm, maar ze scrollen binnen hun eigen
`div.table-scroll` — het document zelf blijft binnen de viewport. Dat is precies het gedrag
dat de wrapper moet leveren.

De kaartenlijst gaat van twee kolommen naar één onder 46rem; de navigatie breekt af naar een
tweede regel. Beide zonder overlap.

---

## 6. Prioriteit 5 — Kleine visuele verschillen

Alle bewust, geen van alle contentgerelateerd.

| Eigenschap | Oud | Nieuw | Reden |
|---|---|---|---|
| Body-tekst | 15px / 22px (1,47) | 16px / 26,4px (1,65) | leesbaarheid; 15px is onder de huidige norm |
| Kop `h1` | 24px | 41,6px | duidelijke hiërarchie op een archiefsite |
| Regellengte artikel | 649px | 614px | ~68 tekens, dichter bij de leesbaarheidsoptimum |
| Koppen-lettertype | schreefloos | serif | onderscheid tussen kop en tekst zonder kleur |
| Footer | 11–34 links, wisselend | 9 links, constant | voorspelbaarder; de widgets zijn vervallen |

---

## 7. Wat niet te verifiëren was

**Externe afbeeldingen.** Zes afbeeldingen op `/2014/09/the-estimation-quest/` (agify.me) en
zes op `/2017/09/the-large-scale-scrum-less-dynamics-game/` (agilix.nl) laadden niet in de
test. De console meldt `net::ERR_NETWORK_CHANGED`: deze omgeving heeft geen internettoegang.
Of die domeinen nog leven is hiermee **niet** vastgesteld — het is geen bewijs dat ze dood
zijn. Te controleren op een machine met netwerk.

**Bekende ontbrekende afbeeldingen.** De 16 uit `missing-media.csv` renderen als gebroken
afbeelding, bijvoorbeeld drie op `/2019/01/retrospective-sailing-being-agile/`. Dat is
bewust: de verwijzing blijft staan zodat het gat zichtbaar en later te vullen is
(CONTENT-MODEL §10.3).

---

## 8. Wijzigingen in deze fase

| Wijziging | Type | Reden |
|---|---|---|
| Tabellen met blok-inhoud blijven HTML, in een scroll-wrapper | functioneel | de gegenereerde Markdown was ongeldig en werd als platte tekst getoond |
| Koppen in tabelcellen worden `<strong>` | structureel | een kop in een cel is opmaak, geen documentstructuur |
| Creative Commons-licentie terug in de footer | juridisch | stond op 4.352 oude pagina's; de `©`-regel beweerde iets anders |

Geen enkele wijziging is puur cosmetisch doorgevoerd.

---

## 9. Openstaand

| Punt | Omvang |
|---|---|
| Bijschriften zonder afbeelding een zichtbare verklaring geven | 45 op 21 pagina's |
| Externe afbeeldingen controleren met netwerktoegang | 12 op 2 pagina's |
| 16 ontbrekende afbeeldingen bijhalen of accepteren | 16 |
| 80 te lange titels (59 door meertalige concatenatie) | 80 |

---

*Einde fase 7. `output/` ongewijzigd.*
