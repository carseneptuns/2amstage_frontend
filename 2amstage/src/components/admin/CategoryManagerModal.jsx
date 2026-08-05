import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Pencil, Check } from "lucide-react";
import { toast } from "sonner";
import categoryService from "../../services/categoryService";
import { apiErrorMessage } from "../../lib/api";
import { formatIDR } from "../../utils/format";
import { InlineSpinner } from "../ui/LoadingScreen";

const emptyForm = { nama_kategori: "", harga: "", kuota: "" };

export default function CategoryManagerModal({ open, onClose, event, onChanged }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!event) return;
    setLoading(true);
    try {
      const res = await categoryService.getAll(event.id);
      setCategories(res.data);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal memuat kategori tiket."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      load();
      setForm(emptyForm);
      setEditingId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, event]);

  if (!open) return null;

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ nama_kategori: cat.nama_kategori, harga: cat.harga, kuota: cat.kuota });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_kategori || form.harga === "" || form.kuota === "") {
      toast.error("Nama, harga, dan kuota wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nama_kategori: form.nama_kategori,
        harga: Number(form.harga),
        kuota: Number(form.kuota),
      };
      if (editingId) {
        await categoryService.update(event.id, editingId, payload);
        toast.success("Kategori diperbarui.");
      } else {
        await categoryService.create(event.id, payload);
        toast.success("Kategori ditambahkan.");
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
      onChanged?.();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal menyimpan kategori."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Hapus kategori "${cat.nama_kategori}"?`)) return;
    try {
      await categoryService.remove(event.id, cat.id);
      toast.success("Kategori dihapus.");
      await load();
      onChanged?.();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal menghapus kategori."));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className="glass max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 p-6"
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-display text-xl tracking-wide">Kategori Tiket</h2>
            <button onClick={onClose} className="text-dim hover:text-hi">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mb-5 truncate text-xs text-dim">{event?.nama}</p>

          <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-[1fr_auto] gap-2 sm:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
            <input
              value={form.nama_kategori}
              onChange={(e) => setForm((f) => ({ ...f, nama_kategori: e.target.value }))}
              placeholder="Nama kategori"
              className="input-field col-span-2 sm:col-span-1"
            />
            <input
              type="number"
              min="0"
              value={form.harga}
              onChange={(e) => setForm((f) => ({ ...f, harga: e.target.value }))}
              placeholder="Harga"
              className="input-field"
            />
            <input
              type="number"
              min="0"
              value={form.kuota}
              onChange={(e) => setForm((f) => ({ ...f, kuota: e.target.value }))}
              placeholder="Kuota"
              className="input-field"
            />
            <div className="col-span-2 flex gap-2 sm:col-span-1">
              <button type="submit" disabled={saving} className="btn-primary flex-1 !px-3 !py-2.5 text-sm">
                {saving ? <InlineSpinner /> : editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn-secondary !px-3 !py-2.5 text-sm">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {loading ? (
            <p className="py-6 text-center text-sm text-dim">Memuat...</p>
          ) : categories.length === 0 ? (
            <p className="py-6 text-center text-sm text-dim">Belum ada kategori tiket.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-surface2 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-hi">{cat.nama_kategori}</p>
                    <p className="text-xs text-dim">
                      {formatIDR(cat.harga)} &middot; sisa {cat.sisa_kuota}/{cat.kuota}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => startEdit(cat)}
                      className="rounded-lg p-2 text-mid hover:bg-white/5 hover:text-hi"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="rounded-lg p-2 text-mid hover:bg-stage/10 hover:text-stage"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
