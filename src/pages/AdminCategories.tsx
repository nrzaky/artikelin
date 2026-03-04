import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

type Category = {
  id: number;
  name: string;
  slug: string;
};

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setCategories(data || []);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async () => {
    if (!name) return alert("Nama kategori wajib diisi");

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const { error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
      });

    if (error) {
      console.error(error);
      return;
    }

    setName("");
    loadCategories();
  };

  const updateCategory = async () => {
    if (!editingId) {
      alert("Pilih kategori dulu");
      return;
    }

    if (!name) {
      alert("Nama kategori tidak boleh kosong");
      return;
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const { error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
      })
      .eq("id", editingId);

    if (error) {
      console.error(error);
      return;
    }

    setName("");
    setEditingId(null);
    loadCategories();
  };

  const remove = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadCategories();
  };

  return (
    <div className="container max-w-2xl py-10">
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