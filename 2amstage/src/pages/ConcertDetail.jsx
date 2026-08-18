import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  CalendarDays,
  Clock,
  ArrowLeft,
  ShoppingBag,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useEvent } from "../hooks/useEvents";
import { useAuthStore } from "../store/authStore";
import api, { apiErrorMessage } from "../lib/api";
import PosterFrame from "../components/ui/PosterFrame";
import LoadingScreen from "../components/ui/LoadingScreen";
import { InlineSpinner } from "../components/ui/LoadingScreen";
import CountdownTimer from "../components/ui/CountdownTimer";
import Reveal from "../components/ui/Reveal";
import SeatmapZones from "../components/concert/SeatmapZones";
import { formatDateLong, formatTime, formatIDR } from "../utils/format";

export default function ConcertDetail() {
  const { id } = useParams();
  const { event, loading, error } = useEvent(id);
  const [quantities, setQuantities] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  const categories = event?.ticket_categories || [];

  const selectedItems = useMemo(
    () =>
      categories
        .filter((c) => (quantities[c.id] || 0) > 0)
        .map((c) => ({
          ticket_category_id: c.id,
          nama_kategori: c.nama_kategori,
          harga: c.harga,
          jumlah: quantities[c.id],
          subtotal: c.harga * quantities[c.id],
        })),
    [categories, quantities]
  );

  const totalHarga = selectedItems.reduce((sum, it) => sum + it.subtotal, 0);
  const totalTickets = selectedItems.reduce((sum, it) => sum + it.jumlah, 0);

  const onQuantityChange = (categoryId, qty) => {
    setQuantities(qty > 0 ? { [categoryId]: qty } : {});
  };

  const handleBuy = async () => {
    if (hasEnded) {
      toast.error("Event ini sudah berlalu.");
      return;
    }
    if (totalTickets === 0) {
      toast.error("Pilih minimal satu tiket dulu.");
      return;
    }
    if (!isAuthenticated()) {
      toast.info("Masuk dulu untuk melanjutkan pembelian.");
      navigate("/login", { state: { from: { pathname: `/concerts/${id}` } } });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        event_id: event.id,
        items: selectedItems.map((it) => ({
          ticket_category_id: it.ticket_category_id,
          jumlah: it.jumlah,
        })),
      };
      const res = await api.post("/orders", payload);
      toast.success("Order dibuat! Selesaikan pembayaran dalam 10 menit.");
      navigate(`/checkout/${res.data.order.id}`, {
        state: { order: res.data.order, items: selectedItems, event },
      });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal membuat order."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32">
        <LoadingScreen label="Membuka detail konser..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 pt-24 text-center">
        <p className="font-display text-2xl">KONSER TIDAK DITEMUKAN</p>
        <p className="text-mid">{error || "Event ini mungkin sudah tidak tersedia."}</p>
        <Link to="/#concerts" className="btn-primary">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const soldOut = event.status === "sold_out";
  const hasEnded = useMemo(() => {
    if (!event.tanggal || !event.waktu) return false;
    return new Date(`${event.tanggal}T${event.waktu}`).getTime() < Date.now();
  }, [event.tanggal, event.waktu]);

  return (
    <div>
      {/* Banner */}
      <section className="relative h-[52vh] min-h-[380px] w-full overflow-hidden pt-16">
        <PosterFrame src={event.poster_url} alt={event.nama} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-void/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-transparent to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-10 sm:px-8">
          <Link
            to="/#concerts"
            className="mb-4 flex w-fit items-center gap-1.5 text-sm text-mid hover:text-hi"
          >
            <ArrowLeft className="h-4 w-4" /> Semua Konser
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {hasEnded && (
              <span className="badge mb-3 border-hairline/15 bg-hairline/[0.05] text-mid">Event Telah Berakhir</span>
            )}
            {!hasEnded && soldOut && (
              <span className="badge mb-3 border-stage/30 bg-stage/15 text-stage">Sold Out</span>
            )}
            <h1 className="font-display text-4xl leading-none tracking-wide sm:text-6xl">
              {event.artis || event.nama}
            </h1>
            <p className="mt-2 text-lg text-mid">{event.nama}</p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-12">
            {/* Info row */}
            <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-hairline/10 bg-surface p-5">
                <CalendarDays className="h-5 w-5 text-stage" />
                <p className="mt-3 text-sm text-dim">Tanggal</p>
                <p className="mt-1 font-semibold">{formatDateLong(event.tanggal)}</p>
              </div>
              <div className="rounded-2xl border border-hairline/10 bg-surface p-5">
                <Clock className="h-5 w-5 text-stage" />
                <p className="mt-3 text-sm text-dim">Waktu</p>
                <p className="mt-1 font-semibold">{formatTime(event.waktu)}</p>
              </div>
              <div className="rounded-2xl border border-hairline/10 bg-surface p-5">
                <MapPin className="h-5 w-5 text-stage" />
                <p className="mt-3 text-sm text-dim">Lokasi</p>
                <p className="mt-1 font-semibold">{event.lokasi}</p>
              </div>
            </Reveal>

            {/* Countdown */}
            <Reveal className="rounded-2xl border border-hairline/10 bg-gradient-to-br from-surface to-surface2 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-dim">
                Konser dimulai dalam
              </p>
              <div className="mt-4">
                <CountdownTimer targetDate={`${event.tanggal}T${event.waktu}`} />
              </div>
            </Reveal>

            {/* Description */}
            {event.deskripsi && (
              <Reveal>
                <h2 className="font-display text-2xl tracking-wide">TENTANG KONSER</h2>
                <p className="mt-4 whitespace-pre-line leading-relaxed text-mid">
                  {event.deskripsi}
                </p>
              </Reveal>
            )}

            {/* Seatmap / zone selection */}
            <Reveal>
              <h2 className="font-display text-2xl tracking-wide">PILIH ZONA & TIKET</h2>
              <p className="mt-2 text-mid">
                Ketuk zona pada peta atau atur langsung jumlah tiket di daftar kategori.
              </p>
              <div className="mt-6">
                {categories.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-hairline/15 p-10 text-center text-mid">
                    Kategori tiket untuk event ini belum tersedia.
                  </div>
                ) : (
                  <SeatmapZones
                    categories={categories}
                    quantities={quantities}
                    onChange={onQuantityChange}
                    disabled={hasEnded}
                  />
                )}
              </div>
            </Reveal>
          </div>

          {/* Sticky order summary */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <Reveal className="rounded-2xl border border-hairline/10 bg-surface p-6">
              <h3 className="flex items-center gap-2 font-display text-lg tracking-wide">
                <ShoppingBag className="h-4 w-4 text-stage" /> RINGKASAN PESANAN
              </h3>

              {selectedItems.length === 0 ? (
                <p className="mt-6 text-sm text-dim">Belum ada tiket dipilih.</p>
              ) : (
                <div className="mt-5 space-y-3 border-b border-hairline/10 pb-4">
                  {selectedItems.map((it) => (
                    <div key={it.ticket_category_id} className="flex items-center justify-between text-sm">
                      <span className="text-mid">
                        {it.nama_kategori} <span className="text-dim">×{it.jumlah}</span>
                      </span>
                      <span className="font-mono font-semibold">{formatIDR(it.subtotal)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-mid">Total ({totalTickets} tiket)</span>
                <span className="font-display text-2xl tracking-wide">{formatIDR(totalHarga)}</span>
              </div>

              <button
                onClick={handleBuy}
                disabled={submitting || soldOut || hasEnded || totalTickets === 0}
                className="btn-primary mt-6 w-full"
              >
                {submitting ? (
                  <InlineSpinner />
                ) : hasEnded ? (
                  "Event Telah Berakhir"
                ) : soldOut ? (
                  "Tiket Habis"
                ) : (
                  <>
                    Beli Tiket <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[11px] text-dim">
                Order akan ditahan selama 10 menit untuk penyelesaian pembayaran.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
