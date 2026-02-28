import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";

export const login = async (req: Request, res: Response) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email/password kosong" });
    }

    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    console.log("DB RESULT:", rows);

    if (!rows.length) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    const user = rows[0];

    if (!user.password) {
      return res.status(500).json({ message: "Password hash kosong di DB" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Bukan admin" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};