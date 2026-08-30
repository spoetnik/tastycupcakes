import { slugify } from "./util.js";

/** Verzamelt auteurs uit de posts; één record per WordPress-account. */
export function createAuthorRegistry() {
  const byWpSlug = new Map();

  return {
    record({ name, wpSlug, bio, avatar, website, count = true }) {
      // Het oude thema noemt alleen een naam, geen account-slug. Zonder deze
      // samenvoeging krijgt dezelfde persoon twee auteurs (michael-mccullough
      // en michael-mccullough-2).
      let key = wpSlug;
      if (!key && name) {
        const wanted = name.trim().toLowerCase();
        for (const [k, e] of byWpSlug) {
          if (e.name.trim().toLowerCase() === wanted) { key = k; break; }
        }
      }
      key = key || slugify(name || "");
      if (!key) return null;
      let entry = byWpSlug.get(key);
      if (!entry) {
        entry = { name: name || key, wpSlugs: new Set([key]), bio: null, avatar: null, website: null, postCount: 0 };
        byWpSlug.set(key, entry);
      }
      if (name && (!entry.name || entry.name === key)) entry.name = name;
      if (bio && !entry.bio) entry.bio = bio;
      if (avatar && !entry.avatar) entry.avatar = avatar;
      if (website && !entry.website) entry.website = website;
      if (count) entry.postCount++;
      return key;
    },

    /** Lost slug-botsingen deterministisch op: meeste posts wint de korte slug. */
    finalise() {
      const entries = [...byWpSlug.entries()]
        .map(([wpSlug, e]) => ({ wpSlug, ...e, slug: slugify(e.name) || slugify(wpSlug) }))
        .sort((a, b) =>
          // Wie de gewenste slug al als account-slug heeft, houdt hem: anders
          // wordt de oude URL van die persoon een redirect naar iemand anders.
          Number(b.wpSlug === b.slug) - Number(a.wpSlug === a.slug)
          || b.postCount - a.postCount
          || a.wpSlug.localeCompare(b.wpSlug));

      const taken = new Set();
      for (const e of entries) {
        let slug = e.slug || "auteur";
        if (taken.has(slug)) {
          let n = 2;
          while (taken.has(`${slug}-${n}`)) n++;
          slug = `${slug}-${n}`;
        }
        taken.add(slug);
        e.slug = slug;
      }
      return entries.sort((a, b) => a.slug.localeCompare(b.slug));
    },

    slugFor(wpSlug, finalised) {
      const hit = finalised.find((e) => e.wpSlug === wpSlug);
      return hit ? hit.slug : null;
    },
  };
}
