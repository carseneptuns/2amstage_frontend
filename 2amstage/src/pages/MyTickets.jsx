import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Ticket, Clock3, XCircle, CheckCircle2, ArrowRight, Mail, MailCheck } from "lucide-react";
import { apiErrorMessage } from "../lib/api";
import orderService from "../services/orderService";
import eventService from "../services/eventService";
import LoadingScreen, { InlineSpinner } from "../components/ui/LoadingScreen";
import Reveal from "../components/ui/Reveal";
import CountdownTimer from "../components/ui/CountdownTimer";
import PosterFrame from "../components/ui/PosterFrame";
import { formatIDR, formatDateTime } from "../utils/format";

const STATUS_BADGE = {
  paid: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  pending: "border-amber/30 bg-amber/10 text-amber",
  cancelled: "border-black/15 bg-black/[0.03] text-mid",
  expired: "border-stage/30 bg-stage/10 text-stage",
};

export default function MyTickets() {
  const [orders, setOrders] = useState(null);
  const [eventsById, setEventsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resendingId, setResendingId] = useState(null);

  const handleResendEmail = async (orderId) => {
    setResendingId(orderId);
    try {
      await orderService.resendEmail(orderId);
      toast.success("Tiket berhasil dikirim ulang ke email kamu.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal mengirim ulang email."));
    } finally {
      setResendingId(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const ordersRes = await orderService.getMine();
        setOrders(ordersRes.data);

        const ids = [...new Set(ordersRes.data.map((o) => o.event_id))];
        const results = await Promise.allSettled(ids.map((id) => eventService.getById(id)));
        const map = {};
        results.forEach((r, i) => {
          if (r.status === "fulfilled") map[ids[i]] = r.value.data;
        });
        setEventsById(map);
      } catch (err) {
        setError(apiErrorMessage(err, "Gagal memuat riwayat pesanan kamu."));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="pt-32">
        <LoadingScreen label="Membuka riwayat pesanan..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 pt-24 text-center text-mid">
        {error}
      </div>
    );
  }

  const paidOrders = (orders || []).filter((o) => o.status_pembayaran === "paid");
  const otherOrders = (orders || []).filter((o) => o.status_pembayaran !== "paid");
  const sortedOrders = [...paidOrders, ...otherOrders].sort(
    (a, b) => new Date(b.waktu_order) - new Date(a.waktu_order)
  );

  return (
    <div className="mx-auto max-w-4xl px-5 py-28 sm:px-8">
      <div className="mb-10">
        <span className="badge border-stage/30 bg-stage/10 text-stage">
          <Ticket className="h-3 w-3" /> Riwayat Pembelian
        </span>
        <h1 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">TIKET SAYA</h1>
        <p className="mt-2 max-w-xl text-mid">
          E-tiket lengkap dengan QR code otomatis dikirim ke email kamu setiap pembayaran
          berhasil. Gak nemu emailnya? Kirim ulang lewat tombol di bawah.
        </p>
      </div>

      {sortedOrders.length === 0 && (
        <EmptyState
          icon={Clock3}
          title="Belum ada pesanan"
          desc="Riwayat pembelian tiketmu akan tercatat di sini."
        />
      )}

      <div className="space-y-3">
        {sortedOrders.map((order, i) => {
          const event = eventsById[order.event_id];
          const isPending = order.status_pembayaran === "pending";
          const isPaid = order.status_pembayaran === "paid";

          return (
            <Reveal key={order.id} delay={i * 0.04}>
              <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <PosterFrame src={event?.poster_url} alt={event?.nama} className="h-full w-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg tracking-wide">
                      {event?.artis || event?.nama || `Order #${order.id}`}
                    </p>
                    <p className="truncate text-xs text-dim">{event?.nama}</p>
                    <p className="mt-0.5 text-xs text-dim">
                      {isPaid ? `Dibayar ${formatDateTime(order.paid_at)}` : formatDateTime(order.waktu_order)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <span className="font-mono text-sm font-bold">{formatIDR(order.total_harga)}</span>
                  <span className={`badge ${STATUS_BADGE[order.status_pembayaran]}`}>
                    {order.status_pembayaran === "paid" && <CheckCircle2 className="h-3 w-3" />}
                    {order.status_pembayaran === "cancelled" && <XCircle className="h-3 w-3" />}
                    {order.status_pembayaran}
                  </span>

                  {isPending && order.expired_at && (
                    <CountdownTimer targetDate={order.expired_at} compact />
                  )}
                  {isPending && (
                    <Link
                      to={`/checkout/${order.id}`}
                      className="flex items-center gap-1 text-sm font-semibold text-stage hover:underline"
                    >
                      Bayar <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {isPaid && (
                    <button
                      onClick={() => handleResendEmail(order.id)}
                      disabled={resendingId === order.id}
                      className="btn-secondary !px-4 !py-2 text-xs disabled:opacity-50"
                    >
                      {resendingId === order.id ? (
                        <InlineSpinner />
                      ) : (
                        <>
                          <Mail className="h-3.5 w-3.5" /> Kirim Ulang ke Email
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {paidOrders.length > 0 && (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-black/10 bg-surface2 p-5 text-sm text-mid">
          <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-stage" />
          <p>
            E-tiket kamu (QR code + detail lengkap) ada di inbox email yang kamu daftarkan.
            Cek juga folder spam kalau belum ketemu.
          </p>
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-black/15 py-20 text-center">
      <Icon className="h-8 w-8 text-dim" />
      <p className="font-display text-xl tracking-wide">{title}</p>
      <p className="max-w-xs text-sm text-mid">{desc}</p>
      <Link to="/#concerts" className="btn-primary mt-3">
        Jelajahi Konser
      </Link>
    </div>
  );
}
