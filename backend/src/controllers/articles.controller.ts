import type { Request, Response } from "express";
import { db } from "../db.js";
import fs from "fs";
import path from "path";
import { slugify } from "../utils/slug.js";

/* =======================
 * GET ALL ARTICLES
 * - Public: hanya published
 * - Admin: bisa filter status
 * - Support search
 * ======================= */
export const getArticles = async (req: Request, res: Response) => {
  try {
    const { search, status, admin } = req.query;

    let sql = `
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.content,
        a.image,
        a.author,
        a.created_at,
        a.status,
        c.name AS category
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE 1=1
    `;

    const params: any[] = [];

    // ❗ USER ONLY → published
    if (!admin) {
      sql += " AND a.status = 'published'";
    }

    // ADMIN FILTER
    if (admin && status) {
      sql += " AND a.status = ?";
      params.push(status);
    }

    if (search) {
      sql += " AND (a.title LIKE ? OR a.content LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " ORDER BY a.created_at DESC";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

/* =======================
 * GET ARTICLE BY SLUG
 * - PUBLIC: hanya published
 * ======================= */
export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const [[article]]: any = await db.query(
      `
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.content,
        a.image,
        a.author,
        a.created_at,
        a.status,
        a.meta_title,
        a.meta_description,
        c.name AS category
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ? AND a.status = 'published'
      LIMIT 1
      `,
      [slug]
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
/* =======================
 * GET ARTICLE BY ID
 * - ADMIN ONLY
 * ======================= */
export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [[article]]: any = await db.query(
      `
      SELECT 
        a.*,
        c.name AS category
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?
      LIMIT 1
      `,
      [id]
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch article" });
  }
};

/* =======================
 * CREATE ARTICLE
 * - Default: draft
 * - Slug unique
 * ======================= */
export const createArticle = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      category_id,
      author,
      status,
      meta_title,
      meta_description,
    } = req.body;

    if (!title || !content || !category_id) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    let slug = slugify(title);

    // 🔒 pastikan slug unik
    const [[exists]]: any = await db.query(
      "SELECT id FROM articles WHERE slug = ? LIMIT 1",
      [slug]
    );

    if (exists) {
      slug = `${slug}-${Date.now()}`;
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await db.query(
      `
      INSERT INTO articles
      (title, slug, meta_title, meta_description, content, image, category_id, author, status)
      VALUES (?,?,?,?,?,?,?,?,?)
      `,
      [
        title,
        slug,
        meta_title || title,
        meta_description || content.slice(0, 160),
        content,
        image,
        category_id,
        author || "Admin",
        status === "published" ? "published" : "draft",
      ]
    );

    res.status(201).json({ message: "Article created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create article" });
  }
};

/* =======================
 * UPDATE ARTICLE
 * ======================= */
export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category_id, status } = req.body;

    if (!title || !content || !category_id) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [[old]]: any = await db.query(
      "SELECT image FROM articles WHERE id = ?",
      [id]
    );

    if (!old) {
      return res.status(404).json({ message: "Article not found" });
    }

    let image = old.image;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;

      if (old.image) {
        const oldPath = path.join(process.cwd(), old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await db.query(
      `
      UPDATE articles
      SET title=?, content=?, category_id=?, image=?, status=?
      WHERE id=?
      `,
      [
        title,
        content,
        category_id,
        image,
        status === "published" ? "published" : "draft",
        id,
      ]
    );

    res.json({ message: "Article updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update article" });
  }
};

/* =======================
 * DELETE ARTICLE
 * ======================= */
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [[article]]: any = await db.query(
      "SELECT image FROM articles WHERE id = ?",
      [id]
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (article.image) {
      const imagePath = path.join(process.cwd(), article.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await db.query("DELETE FROM articles WHERE id = ?", [id]);

    res.json({ message: "Article deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete article" });
  }
};