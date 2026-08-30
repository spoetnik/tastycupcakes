import rss from "@astrojs/rss";
import { englishPosts } from "../utils/content";
import { SITE } from "../utils/site";

export async function GET(context) {
  const posts = (await englishPosts()).slice(0, 50);
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      pubDate: post.data.date,
      link: post.data.permalink,
      categories: post.data.categories,
    })),
  });
}
