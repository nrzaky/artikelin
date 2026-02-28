import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const submit = async () => {
    if (!name) return alert("Nama kategori wajib diisi");

    if (editingId) {
      await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
    }

    setName("");
    setEditingId(null);
    loadCategories();
  };

  const remove = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;

    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    loadCategories();
  };

  const addCategory = async () => {
    if (!name) return alert("Nama kategori wajib diisi");

    await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

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

    await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });

    setName("");
    setEditingId(null);
    loadCategories();
    };
  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>

  <Button
    variant="outline"
    onClick={() => navigate("/admin")}
  >
    ← Kembali ke Dashboard
  </Button>
</div>

    {/* FORM */}
    <div className="flex gap-2 mb-6">
    <input
        className="flex-1 border p-2 rounded-md"
        placeholder={
        editingId
            ? "Edit kategori"
            : "Tambah kategori baru"
        }
        value={name}
        onChange={(e) => setName(e.target.value)}
    />

    {/* ADD BUTTON */}
    <Button
        onClick={addCategory}
        disabled={Boolean(editingId)}
    >
        Add
    </Button>

    {/* UPDATE BUTTON */}
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
              <p className="text-xs text-muted-foreground">
                {c.slug}
              </p>
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