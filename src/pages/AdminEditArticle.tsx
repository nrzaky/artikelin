import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type Category = {
  id: number;
  name: string;
};

const API_URL = "http://localhost:3001";

const AdminEditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // HTML
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  /* =======================
   * FETCH DATA
   * ======================= */
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch(`/api/articles/${id}`).then((r) => r.json()),
    ])
      .then(([cats, article]) => {
        setCategories(cats);
        setTitle(article.title);
        setContent(article.content); // HTML
        setCategoryId(String(article.category_id));
        setStatus(article.status ?? "draft");
        setPreview(article.image ? API_URL + article.image : null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* =======================
   * SUBMIT UPDATE
   * ======================= */
  const submit = async () => {
    if (!title || !content || !categoryId) {
      alert("Judul, konten, dan kategori wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category_id", categoryId);
    formData.append("status", status);
    formData.append("author", "Admin");
    formData.append("meta_title", metaTitle);
    formData.append("meta_description", metaDescription);

    if (image) {
      formData.append("image", image);
    }

    try {
      setSaving(true);

      await fetch(`/api/articles/${id}?admin=true`, {
        method: "PUT",
        body: formData,
      });

      navigate("/admin");
    } catch {
      alert("Gagal mengupdate artikel");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl py-10 text-muted-foreground">
        Loading article...
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-1">
          Edit Article
        </h1>
        <p className="text-sm text-muted-foreground">
          Update article content, status, and featured image
        </p>
      </div>

      {/* TITLE */}
      <input
        className="w-full mb-4 p-3 border rounded-md"
        placeholder="Article title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

       {/* SLUG */}
      <input
        className="w-full mb-3 p-3 border rounded-md"
        placeholder="Meta Title (SEO)"
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
      />

      <textarea
        className="w-full mb-4 p-3 border rounded-md h-24"
        placeholder="Meta Description (SEO)"
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
      />

      {/* CATEGORY */}
      <select
        className="w-full mb-4 p-3 border rounded-md"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Pilih kategori</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* STATUS */}
      <select
        className="w-full mb-4 p-3 border rounded-md"
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as "draft" | "published")
        }
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      {/* RICH TEXT EDITOR */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          Content
        </label>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Tulis artikel di sini..."
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link"],
              [{ align: [] }],
              ["clean"],
            ],
          }}
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Featured Image
        </label>

        <div
          className="cursor-pointer border-2 border-dashed rounded-md p-6 text-center hover:border-primary transition"
          onClick={() =>
            document.getElementById("editImageInput")?.click()
          }
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-60 object-cover rounded-md"
            />
          ) : (
            <div className="text-muted-foreground">
              <p className="font-medium">
                Klik untuk upload gambar
              </p>
              <p className="text-xs mt-1">
                PNG, JPG, JPEG (max 2MB)
              </p>
            </div>
          )}
        </div>

        <input
          id="editImageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImage(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
        />
      </div>

      {/* ACTION */}
      <div className="flex gap-2">
        <Button onClick={submit} disabled={saving}>
          {saving
            ? "Updating..."
            : status === "draft"
            ? "Save Draft"
            : "Update & Publish"}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/admin")}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AdminEditArticle;