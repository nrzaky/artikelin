import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type Category = {
  id: number;
  name: string;
};

const AdminCreateArticle = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // HTML
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  /* =======================
   * FETCH CATEGORIES
   * ======================= */
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => alert("Gagal mengambil kategori"));
  }, []);

  /* =======================
   * SUBMIT
   * ======================= */
  const submit = async () => {
    if (!title || !content || !categoryId) {
      alert("Judul, konten, dan kategori wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content); // HTML dari Quill
    formData.append("category_id", categoryId);
    formData.append("status", status);
    formData.append("author", "Admin");
    formData.append("meta_title", metaTitle);
    formData.append("meta_description", metaDescription);

    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      await fetch("/api/articles", {
        method: "POST",
        body: formData,
      });

      navigate("/admin");
    } catch {
      alert("Gagal menyimpan artikel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-1">
          New Article
        </h1>
        <p className="text-sm text-muted-foreground">
          Create article as draft or publish directly
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
        <option value="published">Publish</option>
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
        <div
          className="cursor-pointer border-2 border-dashed rounded-md p-6 text-center hover:border-primary transition"
          onClick={() =>
            document.getElementById("imageInput")?.click()
          }
        >
          {preview ? (
            <img
              src={preview}
              className="mx-auto max-h-60 rounded-md object-cover"
            />
          ) : (
            <p className="text-muted-foreground">
              Klik untuk upload gambar
            </p>
          )}
        </div>

        <input
          id="imageInput"
          type="file"
          className="hidden"
          accept="image/*"
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
        <Button onClick={submit} disabled={loading}>
          {loading
            ? "Saving..."
            : status === "draft"
            ? "Save Draft"
            : "Publish"}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/admin")}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AdminCreateArticle;