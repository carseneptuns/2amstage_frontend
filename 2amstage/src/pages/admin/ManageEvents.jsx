import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Tag, MapPin } from "lucide-react";
import { toast } from "sonner";
import eventService from "../../services/eventService";
import { apiErrorMessage, assetUrl } from "../../lib/api";
import { formatDateShort } from "../../utils/format";
import LoadingScreen from "../../components/ui/LoadingScreen";
import EventFormModal from "../../components/admin/EventFormModal";
import CategoryManagerModal from "../../components/admin/CategoryManagerModal";

const STATUS_STYLES = {
  draft: "text-dim border-white/10 bg-white/5",
  published: "text-amber border-amber/30 bg-amber/10",
  sold_out: "text-stage border-stage/30 bg-stage/10",
  selesai: "text-mid border-white/10 bg-white/5",
  dibatalkan: "text-stage border-stage/30 bg-stage/10",
};

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await eventService.getMine();
      setEvents(res.data);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal memuat daftar event."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setActiveEvent(null);
    setFormOpen(true);
  };

  const openEdit = (event) => {
    setActiveEvent(event);
    setFormOpen(true);
  };

  const openCategories = (event) => {
    setActiveEvent(event);
    setCategoryOpen(true);
  };

  const handleDelete = async (event) => {
    if (!confirm(`Hapus event "${event.nama}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await eventService.remove(event.id);
      toast.success("Event dihapus.");
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal menghapus event."));
    }
  };

  if (loading) return <LoadingScreen label="Memuat event kamu..." />;

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide sm:text-4xl">Kelola Event</h1>
          <p className="mt-1 text-sm text-mid">Buat, ubah, dan atur kategori tiket untuk setiap event.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Event Baru
        </button>
      </header>

      {events.length === 0 ? (
        <div className="glass rounded-2xl border border-white/10 py-16 text-center">
          <p className="text-mid">Belum ada event. Yuk buat yang pertama.</p>
          <button onClick={openCreate} className="btn-primary mt-4 text-sm">
            <Plus className="h-4 w-4" /> Buat Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass overflow-hidden rounded-2xl border border-white/10"
            >
              <div className="relative h-36 w-full bg-surface3">
                {event.poster_url ? (
                  <img src={assetUrl(event.poster_url)} alt={event.nama} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-dim">Tanpa poster</div>
                )}
                <span
                  className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                    STATUS_STYLES[event.status] || STATUS_STYLES.draft
                  }`}
                >
                  {event.status.replace("_", " ")}
                </span>
              </div>

              <div className="p-4">
                <h3 className="truncate font-display text-lg tracking-wide">{event.nama}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-dim">
                  <MapPin className="h-3 w-3" /> {event.lokasi}
                </p>
                <p className="mt-0.5 text-xs text-dim">{formatDateShort(event.tanggal)}</p>

                <div className="mt-3 flex items-center justify-between text-xs text-mid">
                  <span>{event.total_kategori || 0} kategori tiket</span>
                  <span>{event.progress_percent ?? 0}% terjual</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-stage-gradient"
                    style={{ width: `${event.progress_percent ?? 0}%` }}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openCategories(event)}
                    className="btn-secondary flex-1 !px-3 !py-2 text-xs"
                  >
                    <Tag className="h-3.5 w-3.5" /> Kategori
                  </button>
                  <button
                    onClick={() => openEdit(event)}
                    className="rounded-full border border-white/15 bg-white/5 p-2 text-mid transition hover:border-white/30 hover:text-hi"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event)}
                    className="rounded-full border border-white/15 bg-white/5 p-2 text-mid transition hover:border-stage/40 hover:text-stage"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <EventFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        event={activeEvent}
        onSaved={load}
      />
      <CategoryManagerModal
        open={categoryOpen}
        onClose={() => setCategoryOpen(false)}
        event={activeEvent}
        onChanged={load}
      />
    </div>
  );
}
