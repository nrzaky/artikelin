import type { Request, Response } from "express";
import { db } from "../db.js";

export const getCategories = async (_req: Request, res: Response) => {
  const [rows] = await db.query("SELECT * FROM categories ORDER BY name ASC");
  res.json(rows);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  await db.query(
    "INSERT INTO categories (name, slug) VALUES (?, ?)",
    [name, slug]
  );

  res.status(201).json({ message: "Category created" });
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  await db.query(
    "UPDATE categories SET name=? WHERE id=?",
    [name, id]
  );

  res.json({ message: "Category updated" });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.query("DELETE FROM categories WHERE id = ?", [id]);
  res.json({ message: "Category deleted" });
};