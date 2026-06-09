import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useCategories";

const AdminCategories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const { mutateAsync: addCategoryMutation } = useAddCategory();
  const { mutateAsync: updateCategoryMutation } = useUpdateCategory();
  const { mutateAsync: deleteCategoryMutation } = useDeleteCategory();

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const addCategory = async () => {
    if (!name) return toast.error("Nama kategori wajib diisi");
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    try {
      await addCategoryMutation({ name, slug });
      setName("");
      toast.success("Kategori berhasil ditambahkan");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menambah kategori");
    }
  };

  const updateCategory = async () => {
    if (!editingId) return toast.error("Pilih kategori dulu");
    if (!name) return toast.error("Nama kategori tidak boleh kosong");

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    try {
      await updateCategoryMutation({ id: editingId, name, slug });
      setName("");
      setEditingId(null);
      toast.success("Kategori berhasil diupdate");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengupdate kategori");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;

    try {
      await deleteCategoryMutation(id);
      toast.success("Kategori berhasil dihapus");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus kategori");
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <Helmet>
        <title>Kelola Kategori - Artikelin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>

        <Button variant="outline" onClick={() => navigate("/admin")}>
          ← Kembali ke Dashboard
        </Button>
      </div>

      {/* FORM */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border p-2 rounded-md"
          placeholder={editingId ? "Edit kategori" : "Tambah kategori baru"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* ADD */}
        <Button onClick={addCategory} disabled={Boolean(editingId)}>
          Add
        </Button>

        {/* UPDATE */}
        <Button
          variant="outline"
          onClick={updateCategory}
          disabled={!editingId}
        >
          Update
        </Button>

        {editingId && (
          <Button
            variant="ghost"
            onClick={() => {
              setEditingId(null);
              setName("");
            }}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between border rounded-md p-3"
          >
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.slug}</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(c.id);
                  setName(c.name);
                }}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => remove(c.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;