import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Landmark, Wallet, ShieldCheck, ArrowLeft, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import api, { apiErrorMessage } from "../lib/api";
import { useEvent } from "../hooks/useEvents";
import CountdownTimer from "../components/ui/CountdownTimer";
import LoadingScreen, { InlineSpinner } from "../components/ui/LoadingScreen";
import QRTicket from "../components/ticket/QRTicket";
import Reveal from "../components/ui/Reveal";
import { formatIDR } from "../utils/format";
import { cacheOrderTickets } from "../utils/ticketCache";

const METHODS = [
  { id: "qris", label: "QRIS", icon: QrCode, hint: "Scan & bayar instan" },
  { id: "va", label: "Virtual Account", icon: Landmark, hint: "BCA / BNI / Mandiri" },
  { id: "ewallet", label: "E-Wallet", icon: Wallet, hint: "GoPay / OVO / Dana" },
];

export default function Checkout() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [items, setItems] = useState(location.state?.items || null);
  const [eventFromState] = useState(location.state?.event || null);
  const [resolving, setResolving] = useState(!location.state?.order);
  const [method, setMethod] = useState("qris");
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState(null); // { order, tickets }

  const eventId = eventFromState?.id || order?.event_id;
  const { event: fetchedEvent } = useEvent(!eventFromState ? eventId : undefined);
  const event = eventFromState || fetchedEvent;

  // Fallback: page was opened directly (refresh / shared link) without router state.
  useEffect(() => {
    if (order) return;
    (async () => {
      try {
        const res = await api.get("/orders/my");
        const found = res.data.find((o) => String(o.id) === String(orderId));
        if (!found) {
          toast.error("Detail order tidak ditemukan. Silakan mulai ulang dari halaman konser.");
          navigate("/my-tickets", { replace: true });
          return;
        }
        setOrder(found);
      } catch (err) {
        toast.error(apiErrorMessage(err));
      } finally {
        setResolving(false);
      }
    })();
  }, [order, orderId, navigate]);

  const handlePay = async () => {
    setPaying(true);
    // brief cinematic "processing" beat before hitting the API
    await new Promise((r) => setTimeout(r, 900));
    try {
      const res = await api.post(`/orders/${orderId}/pay`);
      setResult(res.data);
      cacheOrderTickets(orderId, {
        eventId: event?.id,
        eventNama: event?.nama,
        ticketCodes: res.data.tickets.map((t) => t.ticket_code),
      });
      toast.success("Pembayaran berhasil! Tiketmu sudah siap.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Pembayaran gagal, coba lagi."));
    } finally {
      setPaying(false);
    }
  };

  if (resolving) {
    return (
      <div className="pt-32">
        <LoadingScreen label="Menyiapkan halaman pembayaran..." />
      </div>
    );
  }

  if (!order) return null;

  const expired = order.status_pembayaran !== "pending" && !result;
  const alreadyPaid = order.status_pembayaran === "paid";

  // ---- Success state ----
  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-28 sm:px-8">
        <Reveal className="mb-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400"
          >
            <PartyPopper className="h-8 w-8" />
          </motion.div>
          <h1 className="mt-5 font-display text-3xl tracking-wide sm:text-4xl">
            PEMBAYARAN BERHASIL
          </h1>
          <p className="mt-2 text-mid">
            {result.tickets.length} tiket sudah diterbitkan. Tunjukkan QR ini di pintu masuk.
          </p>
        </Reveal>

        <div className="space-y-4">
          {result.tickets.map((t, i) => (
            <QRTicket key={t.id} ticket={t} event={event} index={i} />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/my-tickets" className="btn-primary flex-1">
            Lihat Semua Tiket Saya
          </Link>
          <Link to="/" className="btn-secondary flex-1">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-28 sm:px-8">
      <Link to={eventId ? `/concerts/${eventId}` : "/"} className="mb-6 flex w-fit items-center gap-1.5 text-sm text-mid hover:text-hi">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">SELESAIKAN PEMBAYARAN</h1>

      {alreadyPaid ? (
        <div className="mt-8 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-center">
          <p className="text-hi">Order ini sudah dibayar sebelumnya.</p>
          <Link to="/my-tickets" className="btn-primary mt-4 inline-flex">
            Lihat Tiket Saya
          </Link>
        </div>
      ) : expired ? (
        <div className="mt-8 rounded-2xl border border-stage/20 bg-stage/5 p-6 text-center">
          <p className="text-hi">
            Order ini sudah tidak berlaku (status: {order.status_pembayaran}).
          </p>
          <Link to={eventId ? `/concerts/${eventId}` : "/"} className="btn-primary mt-4 inline-flex">
            Pesan Tiket Baru
          </Link>
        </div>
      ) : (
        <>
          {order.expired_at && (
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-amber/20 bg-amber/5 px-5 py-4">
              <span className="text-sm text-mid">Selesaikan sebelum</span>
              <CountdownTimer
                targetDate={order.expired_at}
                compact
                onExpire={() => toast.error("Waktu pembayaran habis.")}
              />
            </div>
          )}

          {/* Order summary */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg tracking-wide">{event?.nama || "Order"}</h2>
              <span className="badge border-amber/30 bg-amber/10 text-amber">
                #{String(order.id).padStart(5, "0")}
              </span>
            </div>

            {items && (
              <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                {items.map((it) => (
                  <div key={it.ticket_category_id} className="flex justify-between text-sm">
                    <span className="text-mid">
                      {it.nama_kategori} × {it.jumlah}
                    </span>
                    <span className="font-mono">{formatIDR(it.subtotal)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="font-semibold">Total Bayar</span>
              <span className="font-display text-2xl tracking-wide text-hi">
                {formatIDR(order.total_harga)}
              </span>
            </div>
          </div>

          {/* Payment method (visual simulation) */}
          <div className="mt-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-dim">
              Pilih Metode Pembayaran
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    method === m.id
                      ? "border-stage/50 bg-stage/10 ring-1 ring-stage/40"
                      : "border-white/10 bg-surface hover:border-white/20"
                  }`}
                >
                  <m.icon className={`h-5 w-5 ${method === m.id ? "text-stage" : "text-mid"}`} />
                  <p className="mt-3 font-semibold">{m.label}</p>
                  <p className="mt-0.5 text-xs text-dim">{m.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handlePay} disabled={paying} className="btn-primary mt-8 w-full">
            {paying ? (
              <>
                <InlineSpinner /> Memproses pembayaran...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" /> Bayar {formatIDR(order.total_harga)}
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[11px] text-dim">
            Simulasi pembayaran — dikonfirmasi langsung oleh backend 2AMSTAGE.
          </p>
        </>
      )}
    </div>
  );
}
