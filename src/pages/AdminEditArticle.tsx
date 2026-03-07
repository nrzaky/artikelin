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

type StorageImage = {
  name: string;
};

const AdminEditArticle = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [library, setLibrary] = useState<StorageImage[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =======================
     LOAD DATA
  ======================= */

  useEffect(() => {

    const loadData = async () => {

      const { data: cats } = await supabase
        .from("categories")
        .select("*")
        .order("id");

      setCategories(cats || []);

      const { data: article } = await supabase
        .from("articles")
        .select(`
          *,
          article_categories (
            category_id
          )
        `)
        .eq("id", id)
        .single();

      if (article) {

        setTitle(article.title);
        setContent(article.content);
        setStatus(article.status);

        setPreview(article.image);

        setMetaTitle(article.meta_title || "");
        setMetaDescription(article.meta_description || "");

        const catIds = article.article_categories.map(
          (c: any) => c.category_id
        );

        setSelectedCategories(catIds);

      }

      const { data: images } = await supabase.storage
        .from("articles")
        .list();

      setLibrary(images || []);

      setLoading(false);

    };

    loadData();

  }, [id]);

  /* =======================
     UPDATE ARTICLE
  ======================= */

  const submit = async () => {

    if (!title || !content || selectedCategories.length === 0) {
      alert("Judul, konten, dan kategori wajib diisi");
      return;
    }

    try {

      setSaving(true);

      let imageUrl = preview;

      /* =======================
         UPLOAD NEW IMAGE
      ======================= */

      if (image) {

        if (preview) {

          try {

            const fileName = preview.split("/").pop();

            if (fileName) {

              await supabase.storage
                .from("articles")
                .remove([fileName]);

            }

          } catch {
            console.warn("Gagal hapus gambar lama");
          }

        }

        const cleanName = image.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9.-]/g, "");

        const fileName = `${Date.now()}-${cleanName}`;

        const { error } = await supabase.storage
          .from("articles")
          .upload(fileName, image);

        if (error) throw error;

        const { data } = supabase.storage
          .from("articles")
          .getPublicUrl(fileName);

        imageUrl = data.publicUrl;

      }

      /* =======================
         CREATE SLUG
      ======================= */

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      /* =======================
         UPDATE ARTICLE
      ======================= */

      const { error } = await supabase
        .from("articles")
        .update({
          title,
          slug,
          content,
          status,
          image: imageUrl,
          meta_title: metaTitle,
          meta_description: metaDescription
        })
        .eq("id", id);

      if (error) throw error;

      /* =======================
         UPDATE CATEGORIES
      ======================= */

      await supabase
        .from("article_categories")
        .delete()
        .eq("article_id", id);

      const relations = selectedCategories.map(catId => ({
        article_id: Number(id),
        category_id: catId
      }));

      await supabase
        .from("article_categories")
        .insert(relations);

      navigate("/admin");

    } catch (err) {

      console.error(err);
      alert("Gagal mengupdate artikel");

    } finally {

      setSaving(false);

    }

  };

  /* =======================
     SELECT IMAGE FROM LIBRARY
  ======================= */

  const selectImageFromLibrary = (fileName: string) => {

    const url = supabase.storage
      .from("articles")
      .getPublicUrl(fileName).data.publicUrl;

    setPreview(url);
    setImage(null);
    setShowLibrary(false);

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

      <h1 className="text-3xl font-extrabold mb-6">
        Edit Article
      </h1>

      {/* TITLE */}

      <input
        className="w-full mb-4 p-3 border rounded-md"
        placeholder="Article title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* META TITLE */}

      <input
        className="w-full mb-3 p-3 border rounded-md"
        placeholder="Meta Title"
        value={metaTitle}
        onChange={(e) => setMetaTitle(e.target.value)}
      />

      {/* META DESCRIPTION */}

      <textarea
        className="w-full mb-4 p-3 border rounded-md"
        placeholder="Meta Description"
        value={metaDescription}
        onChange={(e) => setMetaDescription(e.target.value)}
      />

      {/* CATEGORIES */}

      <div className="mb-6">

        <label className="block font-medium mb-3">
          Categories
        </label>

        <div className="flex flex-wrap gap-2">

          {categories.map(cat => {

            const active = selectedCategories.includes(cat.id);

            return (

              <button
                key={cat.id}
                type="button"
                onClick={() => {

                  setSelectedCategories(prev =>
                    prev.includes(cat.id)
                      ? prev.filter(id => id !== cat.id)
                      : [...prev, cat.id]
                  );

                }}
                className={`px-3 py-1.5 rounded-full text-sm border transition
                ${active
                  ? "bg-primary text-white border-primary"
                  : "bg-muted hover:bg-muted/70"}`}
              >
                {cat.name}
              </button>

            );

          })}

        </div>

      </div>

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

      {/* CONTENT */}

      <ReactQuill
        value={content}
        onChange={setContent}
        className="mb-6"
      />

      {/* IMAGE UPLOAD */}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {

          const file = e.target.files?.[0];

          if (!file) return;

          setImage(file);
          setPreview(URL.createObjectURL(file));

        }}
      />

      {preview && (
        <img
          src={preview}
          className="mt-4 max-h-60 rounded-md"
        />
      )}

      {/* IMAGE LIBRARY BUTTON */}

      <div className="mt-4">

        <Button
          variant="outline"
          onClick={() => setShowLibrary(!showLibrary)}
        >
          Choose From Library
        </Button>

      </div>

      {/* IMAGE LIBRARY */}

      {showLibrary && (

        <div className="grid grid-cols-3 gap-3 mt-4">

          {library.map(img => {

            const url = supabase.storage
              .from("articles")
              .getPublicUrl(img.name).data.publicUrl;

            return (

              <img
                key={img.name}
                src={url}
                className="cursor-pointer rounded-md border hover:opacity-80"
                onClick={() =>
                  selectImageFromLibrary(img.name)
                }
              />

            );

          })}

        </div>

      )}

      {/* ACTION */}

      <div className="flex gap-2 mt-6">

        <Button
          onClick={submit}
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Article"}
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

export default AdminEditArticle;