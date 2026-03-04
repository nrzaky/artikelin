import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const JWT_SECRET = process.env.JWT_SECRET || "artikelin-secret";
const SESSION_EXPIRE = "30m"; // ⏱ 30 menit

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password wajib diisi" });
    }

    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    const user = rows[0];

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Bukan admin" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password salah" });
    }

    // ✅ BUAT TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: SESSION_EXPIRE }
    );

    return res.json({
      token,
      expiresIn: 30 * 60, // detik
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login gagal" });
  }
};