import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Ticket, Clock3, XCircle, CheckCircle2, ArrowRight, Mail } from "lucide-react";
import api, { apiErrorMessage } from "../lib/api";
import orderService from "../services/orderService";
import LoadingScreen, { InlineSpinner } from "../components/ui/LoadingScreen";
import QRTicket from "../components/ticket/QRTicket";
import Reveal from "../components/ui/Reveal";
import CountdownTimer from "../components/ui/CountdownTimer";
import PosterFrame from "../components/ui/PosterFrame";
import { formatIDR, formatDateTime } from "../utils/format";
import { getAllCachedOrders } from "../utils/ticketCache";

const STATUS_BADGE = {
  paid: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  pending: "border-amber/30 bg-amber/10 text-amber",
  cancelled: "border-white/15 bg-white/5 text-mid",
  expired: "border-stage/30 bg-stage/10 text-stage",
};

export default function MyTickets() {
  const [orders, setOrders] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [eventsById, setEventsById] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("tickets"); // tickets | orders
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
        const [ordersRes, ticketsRes] = await Promise.all([
          api.get("/orders/my"),
          api.get("/tickets/my"),
        ]);
        setOrders(ordersRes.data);
        setTickets(ticketsRes.data);

        // Fetch event details for every distinct event_id referenced by orders
        const ids = [...new Set(ordersRes.data.map((o) => o.event_id))];
        const results = await Promise.allSettled(ids.map((id) => api.get(`/events/${id}`)));
        const map = {};
        results.forEach((r, i) => {
          if (r.status === "fulfilled") map[ids[i]] = r.value.data;
        });
        setEventsById(map);
      } catch (err) {
        setError(apiErrorMessage(err, "Gagal memuat tiket kamu."));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="pt-32">
        <LoadingScreen label="Membuka dompet tiket..." />
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
  const cache = getAllCachedOrders();
  const ticketsByCode = Object.fromEntries((tickets || []).map((t) => [t.ticket_code, t]));

  // Tickets we can confidently attribute to a specific order (from local cache)
  const claimedCodes = new Set();
  const groupedTickets = paidOrders
    .map((order) => {
      const cached = cache[order.id];
      const event = eventsById[order.event_id];
      const codes = cached?.ticketCodes || [];
      codes.forEach((c) => claimedCodes.add(c));
      const orderTickets = codes.map((c) => ticketsByCode[c]).filter(Boolean);
      return { order, event, tickets: orderTickets };
    })
    .filter((g) => g.tickets.length > 0);

  const unassignedTickets = (tickets || []).filter((t) => !claimedCodes.has(t.ticket_code));

  return (
    <div className="mx-auto max-w-4xl px-5 py-28 sm:px-8">
      <div className="mb-10">
        <span className="badge border-stage/30 bg-stage/10 text-stage">
          <Ticket className="h-3 w-3" /> Dompet Tiket
        </span>
        <h1 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">TIKET SAYA</h1>
        <p className="mt-2 text-mid">Semua tiket aktif dan riwayat pesananmu di satu tempat.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex w-fit gap-1 rounded-full border border-white/10 bg-surface p-1">
        <button
          onClick={() => setTab("tickets")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "tickets" ? "bg-stage text-hi" : "text-mid hover:text-hi"
          }`}
        >
          Tiket ({(tickets || []).length})
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            tab === "orders" ? "bg-stage text-hi" : "text-mid hover:text-hi"
          }`}
        >
          Riwayat Pesanan ({(orders || []).length})
        </button>
      </div>

      {tab === "tickets" && (
        <>
          {(tickets || []).length === 0 && (
            <EmptyState
              icon={Ticket}
              title="Belum ada tiket"
              desc="Tiket QR akan muncul di sini setelah pembayaranmu berhasil."
            />
          )}

          <div className="space-y-12">
            {groupedTickets.map(({ order, event, tickets: ts }) => (
              <Reveal key={order.id}>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                    <PosterFrame src={event?.poster_url} alt={event?.nama} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg tracking-wide">
                      {event?.artis || event?.nama || `Order #${order.id}`}
                    </p>
                    <p className="text-xs text-dim">Dibayar {formatDateTime(order.paid_at)}</p>
                  </div>
                  <button
                    onClick={() => handleResendEmail(order.id)}
                    disabled={resendingId === order.id}
                    className="btn-secondary shrink-0 !px-4 !py-2 text-xs"
                  >
                    {resendingId === order.id ? (
                      <InlineSpinner />
                    ) : (
                      <>
                        <Mail className="h-3.5 w-3.5" /> Kirim Ulang ke Email
                      </>
                    )}
                  </button>
                </div>
                <div className="space-y-4">
                  {ts.map((t, i) => (
                    <QRTicket key={t.id} ticket={t} event={event} index={i} />
                  ))}
                </div>
              </Reveal>
            ))}

            {unassignedTickets.length > 0 && (
              <Reveal>
                <h2 className="mb-1 font-display text-lg tracking-wide text-mid">
                  TIKET LAINNYA
                </h2>
                <p className="mb-4 text-xs text-dim">
                  Diterbitkan dari pesanan sebelumnya — detail konser lengkap tersedia di sesi
                  tempat kamu membayar.
                </p>
                <div className="space-y-4">
                  {unassignedTickets.map((t, i) => (
                    <QRTicket key={t.id} ticket={t} event={null} index={i} />
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {(orders || []).length === 0 && (
            <EmptyState
              icon={Clock3}
              title="Belum ada pesanan"
              desc="Riwayat pesananmu akan tercatat di sini."
            />
          )}
          {[...paidOrders, ...otherOrders]
            .sort((a, b) => new Date(b.waktu_order) - new Date(a.waktu_order))
            .map((order) => {
              const event = eventsById[order.event_id];
              const isPending = order.status_pembayaran === "pending";
              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <PosterFrame src={event?.poster_url} alt={event?.nama} className="h-full w-full" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{event?.nama || `Order #${order.id}`}</p>
                      <p className="text-xs text-dim">{formatDateTime(order.waktu_order)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:justify-end">
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
                    {order.status_pembayaran === "paid" && (
                      <button
                        onClick={() => handleResendEmail(order.id)}
                        disabled={resendingId === order.id}
                        className="flex items-center gap-1 text-xs font-semibold text-mid hover:text-hi disabled:opacity-50"
                      >
                        {resendingId === order.id ? <InlineSpinner /> : <Mail className="h-3.5 w-3.5" />}
                        Kirim Ulang
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 py-20 text-center">
      <Icon className="h-8 w-8 text-dim" />
      <p className="font-display text-xl tracking-wide">{title}</p>
      <p className="max-w-xs text-sm text-mid">{desc}</p>
      <Link to="/#concerts" className="btn-primary mt-3">
        Jelajahi Konser
      </Link>
    </div>
  );
}
