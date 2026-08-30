# Migratiepipeline

Zet de WordPress/Wayback-export in `output/` om naar Markdown met YAML-frontmatter,
opgeschoonde media en een redirect-tabel, volgens [CONTENT-MODEL.md](./CONTENT-MODEL.md).

```bash
npm install
npm run migrate          # schrijft naar migration/out/
npm run migrate:dry      # rapporteert zonder te schrijven
npm test                 # 33 tests
```

## Opties

| Optie | Standaard | Betekenis |
|---|---|---|
| `--export <dir>` | `output` | de WordPress-export (wordt alleen gelezen) |
| `--dest <dir>` | `migration/out` | doelmap voor `src/content` en `public/` |
| `--dry-run` | uit | alles doorrekenen en rapporteren, niets schrijven |
| `--limit <n>` | 0 | alleen de eerste n bronnen, voor snel proberen |
| `--no-prune` | uit | verouderde output van een vorige run laten staan |

De doelmap is bewust niet de repo-root: `migration/out/` bevat een kant-en-klare
`src/content/` en `public/`, klaar om naar de Astro-repo te kopiëren.

## Pipeline

```
output/                 de export, read-only
   │
   ├─ discover.js       bronnen vinden en classificeren (post, pagina, attachment, taal)
   ├─ extract.js        metadata uit de HTML: titel, datums, auteur, taxonomie, auteursbox
   ├─ clean.js          plugin-markup weg, verwijzingen herschrijven, tabellen normaliseren
   ├─ markdown.js       HTML → Markdown (turndown + GFM)
   ├─ media.js          variantregels, kopiëren, ontbrekende bestanden registreren
   ├─ lang.js           echte vertaling of Engelse fallback
   ├─ authors.js        auteursregister en slug-toewijzing
   ├─ redirects.js      patroon- en exacte redirects
   └─ report.js         tellingen, warnings, errors
   │
migration/out/          Markdown + frontmatter + media
migration/*.json|csv    redirects, rapport en handmatige controlelijsten
```

## Reproduceerbaarheid

Dezelfde export geeft byte-identieke output. Dat wordt op vier manieren afgedwongen:

1. bronbestanden worden altijd in gesorteerde volgorde verwerkt;
2. bestanden worden alleen herschreven als de inhoud verandert (`writeIfChanged`);
3. slug-botsingen worden deterministisch opgelost (meeste posts wint, dan alfabetisch);
4. output van een vorige run die nu niet meer geproduceerd wordt, wordt verwijderd.

Er staan geen tijdstempels of willekeurige waarden in de output. De test
`de migratie is idempotent` vergelijkt twee volledige runs byte voor byte.

De export zelf wordt nooit geschreven; de test `de originele export wordt nooit
gewijzigd` controleert dat op mtime-niveau.

## Uitvoer

| Bestand | Inhoud |
|---|---|
| `out/src/content/posts/<taal>/YYYY/MM/<slug>.md` | posts |
| `out/src/content/pages/en/<pad>.md` | pagina's |
| `out/src/content/authors/<slug>.md` | auteurs |
| `out/src/data/categories.json`, `tags.json` | taxonomie |
| `out/public/media/YYYY/MM/…`, `out/public/downloads/…` | media |
| `redirects.json` | patronen + exacte redirects |
| `report.json` | volledige tellingen, warnings en errors |
| `missing-media.csv` | referenties zonder bestand |
| `titles-to-review.csv` | de aaneengeplakte meertalige titels |
| `broken-links.csv` | interne links zonder bestemming |

## Wat de migrator niet doet

Bewust, omdat het niet betrouwbaar automatisch kan:

- **titels splitsen.** De meertalige titels hebben geen scheidingsteken. Ze worden
  gemarkeerd met `titleNeedsReview: true` en verzameld in `titles-to-review.csv`.
- **ontbrekende afbeeldingen vervangen.** Geen placeholders; de referentie blijft
  staan en komt in `missing-media.csv`.
- **kapotte links repareren.** De crawler heeft een aantal externe links tot lokale
  `.html`-bestanden platgeslagen. Die zijn niet te herleiden en worden gemeld.
- **alt-teksten verzinnen.** Ontbrekende alt blijft leeg.
- **auteurs samenvoegen.** Accounts met dezelfde weergavenaam blijven gescheiden,
  met een `mogelijk-dubbele-auteur`-waarschuwing.

De migrator eindigt met exitcode 1 zodra er errors zijn, zodat een run in CI faalt
in plaats van stilletjes content te laten liggen.
