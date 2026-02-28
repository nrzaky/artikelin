import type { Request, Response } from "express";
import { db } from "../db.js";
import fs from "fs";
import path from "path";

export const getArticles = async (_req: Request, res: Response) => {
  const [rows] = await db.query(`
    SELECT 
      articles.*,
      categories.name AS category
    FROM articles
    LEFT JOIN categories ON articles.category_id = categories.id
    ORDER BY articles.id DESC
  `);

  res.json(rows);
};

export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [rows]: any = await db.query(
    "SELECT * FROM articles WHERE id = ? LIMIT 1",
    [id]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.json(rows[0]);
};

export const createArticle = async (req: Request, res: Response) => {
  const { title, content, category_id, author } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  await db.query(
    "INSERT INTO articles (title, content, image, category_id, author) VALUES (?,?,?,?,?)",
    [title, content, image, category_id, author]
  );

  res.status(201).json({ message: "Article created" });
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, category_id } = req.body;

  // ambil artikel lama
  const [[old]]: any = await db.query(
    "SELECT image FROM articles WHERE id = ?",
    [id]
  );

  let image = old?.image;

  // jika upload gambar baru
  if (req.file) {
    image = `/uploads/${req.file.filename}`;

    // hapus gambar lama (jika ada)
    if (old?.image) {
      const oldPath = path.join(process.cwd(), old.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
  }

  await db.query(
    "UPDATE articles SET title=?, content=?, category_id=?, image=? WHERE id=?",
    [title, content, category_id, image, id]
  );

  res.json({ message: "Article updated" });
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.query("DELETE FROM articles WHERE id = ?", [id]);

  res.json({ message: "Article deleted" });
};