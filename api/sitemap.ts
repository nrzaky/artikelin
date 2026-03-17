import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// helper biar semua URL konsisten pakai trailing slash
const withSlash = (url: string) => url.replace(/\/?$/, "/");

export default async function handler(req: any, res: any) {
  try {
    const { data: articles, error } = await supabase
      .from("articles")
      .select("slug, created_at")
      .eq("status", "published");

    if (error) {
      throw error;
    }

    const baseUrl = "https://artikelin.my.id/";

    // generate dynamic URLs
    const urls = articles
      ?.map((article) => {
        return `
        <url>
          <loc>${withSlash(baseUrl + "articles/" + article.slug)}</loc>
          <lastmod>${new Date(article.created_at).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${withSlash(baseUrl)}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${withSlash(baseUrl + "articles")}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  ${urls}

</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.status(200).send(sitemap);
  } catch (err) {
    res.status(500).send("Error generating sitemap");
  }
}