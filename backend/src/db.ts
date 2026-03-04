import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",      // isi kalau ada
  database: "artikelin",
  port: 3306,        // GANTI kalau MySQL kamu 3307
});