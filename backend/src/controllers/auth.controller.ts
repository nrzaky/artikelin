import { Request, Response } from "express";
import { db } from "../db.js";
import bcrypt from "bcryptjs";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [rows]: any = await db.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (!rows.length) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json({
    id: user.id,
    name: user.name,
    role: user.role,
  });
};