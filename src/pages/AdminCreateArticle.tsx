import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { supabase } from "@/lib/supabase";

type Category = {
  id: number;
  name: string;
};

const AdminCreateArticle = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("id");

      setCategories(data || []);
    };

    loadCategories();
  }, []);

  const submit = async () => {
    if (!title || !content || !categoryId) {
      alert("Judul, konten, dan kategori wajib diisi");
      return;
    }

    try {
      setLoading(true);

      let imageUrl: string | null = null;

      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        const { error } = await supabase.storage
          .from("articles")
          .upload(fileName, image);

        if (error) throw error;

        const { data } = supabase.storage
          .from("articles")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await supabase.from("articles").insert({
        title,
        slug,
        content,
        category_id: Number(categoryId),
        status,
        image: imageUrl,
        author: "Admin",
        meta_title: metaTitle,
        meta_description: metaDescription,
      });

      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan artikel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6">New Article</h1>

      <input
        className="w-full mb-4 p-3 border rounded-md"
        placeholder="Article title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="w-full mb-3 p-3 border rounded-md"
        placeholder="Meta Title"
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
      />

      <textarea
        className="w-full mb-4 p-3 border rounded-md"
        placeholder="Meta Description"
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

      <ReactQuill value={content} onChange={setContent} className="mb-6" />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
          }
        }}
      />

      {preview && (
        <img src={preview} className="mt-4 max-h-60 rounded-md" />
      )}

      <div className="flex gap-2 mt-6">
        <Button onClick={submit} disabled={loading}>
          {loading ? "Saving..." : "Publish"}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate("/admin")}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AdminCreateArticle;