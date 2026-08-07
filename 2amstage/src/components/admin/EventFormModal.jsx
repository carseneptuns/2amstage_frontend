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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-void/85 p-3 backdrop-blur-sm sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className="glass flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-black/10"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-6 py-4 sm:px-8">
            <h2 className="font-display text-2xl tracking-wide">
              {isEdit ? "Edit Event" : "Buat Event Baru"}
            </h2>
            <button onClick={onClose} className="rounded-full p-1.5 text-dim hover:bg-black/[0.03] hover:text-hi">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto sm:overflow-hidden">
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 overflow-y-auto p-6 sm:grid-cols-[1fr_1.2fr] sm:p-8">
              {/* Left: poster + status */}
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-mid">Poster Event</label>
                  <label className="block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-2xl border border-dashed border-black/15 bg-surface2">
                    {posterPreview ? (
                      <img src={posterPreview} alt="Poster" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-dim">
                        <UploadCloud className="h-8 w-8" />
                        <span className="text-sm">Unggah poster event</span>
                        <span className="text-xs text-dim/70">Rasio potret disarankan</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePosterChange} />
                  </label>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-mid">Status</label>
                  <select value={form.status} onChange={handleChange("status")} className="input-field w-full">
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right: details */}
              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-mid">Nama Event *</label>
                  <input
                    value={form.nama}
                    onChange={handleChange("nama")}
                    className="input-field w-full"
                    placeholder="cth. Midnight Echoes Live"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-mid">Artis / Line-up</label>
                  <input
                    value={form.artis}
                    onChange={handleChange("artis")}
                    className="input-field w-full"
                    placeholder="cth. The Neon Riot"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-mid">Tanggal *</label>
                    <input
                      type="date"
                      value={form.tanggal}
                      onChange={handleChange("tanggal")}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-mid">Waktu *</label>
                    <input
                      type="time"
                      value={form.waktu}
                      onChange={handleChange("waktu")}
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-mid">Lokasi *</label>
                  <input
                    value={form.lokasi}
                    onChange={handleChange("lokasi")}
                    className="input-field w-full"
                    placeholder="cth. GBK Senayan, Jakarta"
                  />
                </div>

                <div className="flex min-h-0 flex-1 flex-col">
                  <label className="mb-1.5 block text-xs font-medium text-mid">Deskripsi</label>
                  <textarea
                    value={form.deskripsi}
                    onChange={handleChange("deskripsi")}
                    rows={8}
                    className="input-field w-full flex-1 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-black/10 px-6 py-4 sm:px-8">
              <button type="button" onClick={onClose} className="btn-secondary text-sm">
                Batal
              </button>
              <button type="submit" disabled={saving} className="btn-primary text-sm">
                {saving ? <InlineSpinner /> : isEdit ? "Simpan Perubahan" : "Buat Event"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
