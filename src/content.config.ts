import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const LANGS = ["en", "es", "fr", "pt", "ru"] as const;

/** Herkomst uit de WordPress-export. Tijdelijk; mag na de migratie weg. */
const wordpress = z.object({
  id: z.number().optional(),
  sourceFile: z.string(),
  capture: z.enum(["modern", "legacy", "recovered", "missing"]),
});

const featuredImage = z
  .object({
    src: z.string(),
    alt: z.string().default(""),
    derived: z.boolean().default(false),
  })
  .nullable()
  .default(null);

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    deferRender: true,
    // Taal + jaar + maand + slug, anders botsen /en/…/delight en /ru/…/delight.
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string().min(1),
    titleNeedsReview: z.boolean().default(false),
    slug: z.string().min(1),
    permalink: z.string().regex(/^\/([a-z]{2}\/)?\d{4}\/\d{2}\/[^/]+\/$/),
    lang: z.enum(LANGS),
    translationOf: z.string().nullable().optional(),
    description: z.string().optional(),
    date: z.coerce.date(),
    dateSource: z.enum(["meta", "page", "url"]),
    updated: z.coerce.date().optional(),
    author: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featuredImage,
    draft: z.boolean().default(false),
    redirectFrom: z.array(z.string()).default([]),
    wordpress: wordpress.optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/pages",
    deferRender: true,
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string().min(1),
    titleNeedsReview: z.boolean().default(false),
    slug: z.string().min(1),
    permalink: z.string().regex(/^\/[^?#]*\/$/),
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
    name: z.string().min(1),
    slug: z.string().min(1),
    wordpressSlugs: z.array(z.string()).min(1),
    bio: z.string().optional(),
    avatar: z.string().nullable().default(null),
    website: z.string().optional(),
    social: z.record(z.string(), z.string()).optional(),
  }),
});

export const collections = { posts, pages, authors };
