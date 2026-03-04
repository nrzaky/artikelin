import { Router } from "express";
import {
  getArticles,
  getArticleBySlug,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/articles.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

router.get("/", getArticles);
router.get("/slug/:slug", getArticleBySlug); // 🔥 WAJIB DI ATAS
router.get("/:id", getArticleById);

router.post("/", upload.single("image"), createArticle);
router.put("/:id", upload.single("image"), updateArticle);
router.delete("/:id", deleteArticle);

export default router;