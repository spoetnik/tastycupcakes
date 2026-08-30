import { getCollection, type CollectionEntry } from "astro:content";
import categoriesData from "../data/categories.json";
import tagOverrides from "../data/tags.json";

export type Post = CollectionEntry<"posts">;
export type Page = CollectionEntry<"pages">;
export type Author = CollectionEntry<"authors">;

const notDraft = <T extends { data: { draft: boolean } }>(e: T) => !e.data.draft;

/** Alle gepubliceerde posts, nieuwste eerst. Eén bron voor elke lijstweergave. */
export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", notDraft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Alleen Engelstalig: de vertalingen hebben hun eigen URL's, niet de archieven. */
export async function englishPosts(): Promise<Post[]> {
  return (await allPosts()).filter((p) => p.data.lang === "en");
}

export async function allPages(): Promise<Page[]> {
  return (await getCollection("pages", notDraft)).sort(
    (a, b) => (a.data.order ?? 999) - (b.data.order ?? 999) || a.data.title.localeCompare(b.data.title),
  );
}

export async function authorMap(): Promise<Map<string, Author>> {
  const authors = await getCollection("authors");
  return new Map(authors.map((a) => [a.data.slug, a]));
}

export type Category = { slug: string; name: string; description: string; order?: number; hidden?: boolean };
export const categories: Category[] = categoriesData as Category[];
export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

type TagOverride = { name?: string; hidden?: boolean };
const overrides = tagOverrides as Record<string, TagOverride>;

/** Tags zijn afgeleid uit de posts; alleen uitzonderingen staan in tags.json. */
export function tagName(slug: string): string {
  const override = overrides[slug]?.name;
  if (override) return override;
  return slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export function tagIsHidden(slug: string): boolean {
  return overrides[slug]?.hidden === true;
}

export async function tagsWithCounts(): Promise<Array<{ slug: string; name: string; count: number }>> {
  const counts = new Map<string, number>();
  for (const post of await englishPosts()) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([slug]) => !tagIsHidden(slug))
    .map(([slug, count]) => ({ slug, name: tagName(slug), count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export async function categoriesWithCounts() {
  const posts = await englishPosts();
  return categories
    .filter((c) => !c.hidden)
    .map((c) => ({ ...c, count: posts.filter((p) => p.data.categories.includes(c.slug)).length }))
    .filter((c) => c.count > 0);
}

/** Vertalingen van een Engelse post, voor de taalkeuze en hreflang. */
export async function translationsOf(permalink: string): Promise<Post[]> {
  const posts = await allPosts();
  return posts
    .filter((p) => p.data.translationOf === permalink)
    .sort((a, b) => a.data.lang.localeCompare(b.data.lang));
}

export function formatDate(date: Date, lang = "en"): string {
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Paginering zonder afhankelijkheid van Astro's paginate(), zodat /page/N/ exact klopt. */
export function paginate<T>(items: T[], page: number, perPage: number) {
  const total = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), total);
  return {
    items: items.slice((current - 1) * perPage, current * perPage),
    current,
    total,
    hasPrev: current > 1,
    hasNext: current < total,
  };
}
