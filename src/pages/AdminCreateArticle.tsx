import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


type Category = {
  id: number;
  name: string;
};

const AdminCreateArticle = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
   * SUBMIT ARTICLE
   * ======================= */
    const submit = async () => {
    if (!title || !content || !categoryId) {
        alert("Judul, konten, dan kategori wajib diisi");
        return;
    }

    try {
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("category_id", categoryId);
        formData.append("author", "Admin");

        if (image) {
        formData.append("image", image); 
        }

        await fetch("/api/articles", {
        method: "POST",
        body: formData, 
        });

        navigate("/admin");
    } catch (err) {
        alert("Gagal menyimpan artikel");
    } finally {
        setLoading(false);
    }
    };

  /* =======================
   * RENDER
   * ======================= */
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-2xl font-bold mb-6">New Article</h1>

      {/* TITLE */}
      <input
        className="w-full mb-4 p-3 border rounded-md"
        placeholder="Article title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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

      {/* CONTENT */}
      <textarea
        className="w-full mb-6 p-3 border rounded-md h-52"
        placeholder="Write your article content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

{/* IMAGE UPLOAD */}
<div className="mb-6">
  <label className="block text-sm font-medium mb-2">
    Featured Image
  </label>

  <div
    onClick={() =>
      document.getElementById("imageInput")?.click()
    }
    className="cursor-pointer border-2 border-dashed rounded-md p-6 text-center hover:border-primary transition"
  >
    {!preview ? (
      <div className="text-muted-foreground">
        <p className="font-medium">
          Klik untuk upload gambar
        </p>
        <p className="text-xs mt-1">
          PNG, JPG, JPEG (max 2MB)
        </p>
      </div>
    ) : (
      <img
        src={preview}
        alt="Preview"
        className="mx-auto max-h-60 object-cover rounded-md"
      />
    )}
  </div>

    <input
        id="imageInput"
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
        <Button onClick={submit} disabled={loading}>
          {loading ? "Publishing..." : "Publish"}
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