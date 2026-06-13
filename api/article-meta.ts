import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""
);

export default async function handler(req: any, res: any) {
  const { slug } = req.query;

  try {
    // 1. Fetch article from Supabase
    const { data: article } = await supabase
      .from("articles")
      .select("title, content, image, meta_title, meta_description")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    // 2. Determine base URL
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    // 3. Get the base index.html
    let html = "";
    
    // Try to read from filesystem first (Vercel standard output or local dev)
    const possiblePaths = [
      path.join(process.cwd(), "dist", "index.html"),
      path.join(process.cwd(), "public", "index.html"),
      path.join(process.cwd(), "index.html"),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        html = fs.readFileSync(p, "utf8");
        break;
      }
    }

    // Fallback to fetch if filesystem read fails
    if (!html) {
      const response = await fetch(baseUrl);
      html = await response.text();
    }

    if (article && html) {
      const title = article.meta_title || article.title;
      // create a simple text description
      const description = article.meta_description || 
        (article.content ? article.content.replace(/<[^>]+>/g, "").slice(0, 160) : "Artikelin — Stories, Insights & Ideas");
      const image = article.image || "https://artikelin.my.id/og-image-artikelin.png";

      // Replace tags
      html = html
        .replace(
          /<title>.*?<\/title>/i,
          `<title>${title}</title>`
        )
        .replace(
          /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
          `<meta name="description" content="${description}" />`
        )
        .replace(
          /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
          `<meta property="og:title" content="${title}" />`
        )
        .replace(
          /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
          `<meta property="og:description" content="${description}" />`
        )
        .replace(
          /<meta\s+property=["']og:image["']\s+content=["'].*?["']\s*\/?>/i,
          `<meta property="og:image" content="${image}" />`
        )
        .replace(
          /<meta\s+property=["']og:type["']\s+content=["']website["']\s*\/?>/i,
          `<meta property="og:type" content="article" />\n    <meta property="og:url" content="${baseUrl}/articles/${slug}" />`
        );
    }

    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300"); // cache at edge
    res.status(200).send(html);
  } catch (err) {
    console.error("Error generating meta tags:", err);
    // Fallback: Just redirect to the main app to let client-side rendering take over
    res.redirect(`/?redirect=/articles/${slug}`);
  }
}
