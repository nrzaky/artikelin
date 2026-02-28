import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

type Category = {
  id: number;
  name: string;
};

const API_URL = "http://localhost:3001";

const AdminEditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
   * FETCH DATA
   * ======================= */
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch(`/api/articles/${id}`).then((r) => r.json()),
    ]).then(([cats, article]) => {
      setCategories(cats);
      setTitle(article.title);
      setContent(article.content);
      setCategoryId(String(article.category_id));
      setPreview(article.image ? API_URL + article.image : null);
      setLoading(false);
    });
  }, [id]);

  /* =======================
   * SUBMIT UPDATE
   * ======================= */
  const submit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category_id", categoryId);

    if (image) {
      formData.append("image", image);
    }

    await fetch(`/api/articles/${id}`, {
      method: "PUT",
      body: formData,
    });

    navigate("/admin");
  };

  if (loading) return <p className="p-6">Loading...</p>;

    return (
  <div className="container max-w-3xl py-10">
    {/* HEADER */}
    <div className="mb-8">
      <h1 className="text-3xl font-extrabold mb-1">
        Edit Article
      </h1>
      <p className="text-sm text-muted-foreground">
        Update article content and featured image
      </p>
    </div>

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
      <Button onClick={submit}>Update</Button>

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
export default AdminEditArticle;