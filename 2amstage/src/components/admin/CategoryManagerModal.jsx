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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-void/85 p-3 backdrop-blur-sm sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className="glass flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-hairline/10"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-hairline/10 px-6 py-4 sm:px-8">
            <div className="min-w-0">
              <h2 className="font-display text-2xl tracking-wide">Kategori Tiket</h2>
              <p className="truncate text-sm text-dim">{event?.nama}</p>
            </div>
            <button onClick={onClose} className="rounded-full p-1.5 text-dim hover:bg-hairline/[0.03] hover:text-hi">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="shrink-0 border-b border-hairline/10 px-6 py-5 sm:px-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-[1.6fr_1fr_1fr_auto]">
              <input
                value={form.nama_kategori}
                onChange={(e) => setForm((f) => ({ ...f, nama_kategori: e.target.value }))}
                placeholder="Nama kategori"
                className="input-field"
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
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 !px-4 !py-2.5 text-sm sm:flex-initial">
                  {saving ? <InlineSpinner /> : editingId ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span className="sm:hidden">{editingId ? "Simpan" : "Tambah"}</span>
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="btn-secondary !px-4 !py-2.5 text-sm">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
            {loading ? (
              <p className="py-6 text-center text-sm text-dim">Memuat...</p>
            ) : categories.length === 0 ? (
              <p className="py-6 text-center text-sm text-dim">Belum ada kategori tiket.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between rounded-xl border border-hairline/5 bg-surface2 px-4 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-hi">{cat.nama_kategori}</p>
                      <p className="mt-0.5 text-xs text-dim">{formatIDR(cat.harga)}</p>
                      <p className="text-xs text-dim">sisa {cat.sisa_kuota}/{cat.kuota}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="rounded-lg p-2 text-mid hover:bg-hairline/[0.03] hover:text-hi"
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
