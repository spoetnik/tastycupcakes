// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://tastycupcakes.org",
  // WordPress serveerde elke URL met een afsluitende slash. Behouden, anders
  // krijgt iedere bestaande URL op de site een extra redirect.
  trailingSlash: "always",
  build: { format: "directory" },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
  markdown: {
    shikiConfig: { theme: "github-light", wrap: true },
  },
});
