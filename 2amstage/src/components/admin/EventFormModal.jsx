import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import eventService from "../../services/eventService";
import { apiErrorMessage, assetUrl } from "../../lib/api";
import { InlineSpinner } from "../ui/LoadingScreen";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "sold_out", label: "Sold Out" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

const emptyForm = {
  nama: "",
  artis: "",
  deskripsi: "",
  tanggal: "",
  waktu: "",
  lokasi: "",
  status: "draft",
};

export default function EventFormModal({ open, onClose, onSaved, event }) {
  const [form, setForm] = useState(emptyForm);
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(event);

  useEffect(() => {
    if (!open) return;
    if (event) {
      setForm({
        nama: event.nama || "",
        artis: event.artis || "",
        deskripsi: event.deskripsi || "",
        tanggal: event.tanggal || "",
        waktu: (event.waktu || "").slice(0, 5),
        lokasi: event.lokasi || "",
        status: event.status || "draft",
      });
      setPosterPreview(event.poster_url ? assetUrl(event.poster_url) : null);
    } else {
      setForm(emptyForm);
      setPosterPreview(null);
    }
    setPosterFile(null);
  }, [open, event]);

  if (!open) return null;

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePosterChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama || !form.tanggal || !form.waktu || !form.lokasi) {
      toast.error("Nama, tanggal, waktu, dan lokasi wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      const payload = eventService.toFormData({ ...form, poster: posterFile || undefined });
      if (isEdit) {
        await eventService.update(event.id, payload);
        toast.success("Event berhasil diperbarui.");
      } else {
        await eventService.create(payload);
        toast.success("Event berhasil dibuat.");
      }
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal menyimpan event."));
    } finally {
      setSaving(false);
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
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl tracking-wide">
              {isEdit ? "Edit Event" : "Buat Event Baru"}
            </h2>
            <button onClick={onClose} className="text-dim hover:text-hi">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block cursor-pointer overflow-hidden rounded-xl border border-dashed border-white/15 bg-surface2">
              {posterPreview ? (
                <img src={posterPreview} alt="Poster" className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-dim">
                  <UploadCloud className="h-6 w-6" />
                  <span className="text-xs">Unggah poster event</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handlePosterChange} />
            </label>

            <div>
              <label className="mb-1 block text-xs font-medium text-mid">Nama Event *</label>
              <input
                value={form.nama}
                onChange={handleChange("nama")}
                className="input-field w-full"
                placeholder="cth. Midnight Echoes Live"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-mid">Artis / Line-up</label>
              <input
                value={form.artis}
                onChange={handleChange("artis")}
                className="input-field w-full"
                placeholder="cth. The Neon Riot"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-mid">Tanggal *</label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={handleChange("tanggal")}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-mid">Waktu *</label>
                <input
                  type="time"
                  value={form.waktu}
                  onChange={handleChange("waktu")}
                  className="input-field w-full"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-mid">Lokasi *</label>
              <input
                value={form.lokasi}
                onChange={handleChange("lokasi")}
                className="input-field w-full"
                placeholder="cth. GBK Senayan, Jakarta"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-mid">Deskripsi</label>
              <textarea
                value={form.deskripsi}
                onChange={handleChange("deskripsi")}
                rows={3}
                className="input-field w-full resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-mid">Status</label>
              <select value={form.status} onChange={handleChange("status")} className="input-field w-full">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
              {saving ? <InlineSpinner /> : isEdit ? "Simpan Perubahan" : "Buat Event"}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
