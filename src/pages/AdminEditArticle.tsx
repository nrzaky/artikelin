import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "@/lib/supabase";

type Category = {
  id: number;
  name: string;
};

const AdminEditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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
    const loadData = async () => {
      const { data: cats } = await supabase
        .from("categories")
        .select("*");

      const { data: article } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      setCategories(cats || []);

      if (article) {
        setTitle(article.title);
        setContent(article.content);
        setCategoryId(String(article.category_id));
        setStatus(article.status);
        setPreview(article.image);
        setMetaTitle(article.meta_title || "");
        setMetaDescription(article.meta_description || "");
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  /* =======================
   * UPDATE ARTICLE
   * ======================= */
  const submit = async () => {
    if (!title || !content || !categoryId) {
      alert("Judul, konten, dan kategori wajib diisi");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = preview;

      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        await supabase.storage
          .from("articles")
          .upload(fileName, image);

        const { data } = supabase.storage
          .from("articles")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await supabase
        .from("articles")
        .update({
          title,
          slug,
          content,
          category_id: Number(categoryId),
          status,
          image: imageUrl,
          meta_title: metaTitle,
          meta_description: metaDescription,
        })
        .eq("id", id);

      navigate("/admin");
    } catch (err) {
      console.error(err);
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
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-1">
          Edit Article
        </h1>
        <p className="text-sm text-muted-foreground">
          Update article content, status, and featured image
        </p>
      </div>

      <input
        className="w-full mb-4 p-3 border rounded-md"
        placeholder="Article title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

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

      <div className="mb-6">
        <label className="block font-medium mb-2">
          Content
        </label>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Featured Image
        </label>

        <div
          className="cursor-pointer border-2 border-dashed rounded-md p-6 text-center"
          onClick={() =>
            document.getElementById("editImageInput")?.click()
          }
        >
          {preview ? (
            <img
              src={preview}
              className="mx-auto max-h-60 object-cover rounded-md"
            />
          ) : (
            <p className="text-muted-foreground">
              Klik untuk upload gambar
            </p>
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