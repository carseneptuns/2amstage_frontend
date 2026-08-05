import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, Wallet, CalendarCheck2, ScanLine, ArrowUpRight } from "lucide-react";
import reportService from "../../services/reportService";
import { assetUrl } from "../../lib/api";
import { formatIDR, formatDateShort } from "../../utils/format";
import LoadingScreen from "../../components/ui/LoadingScreen";
import { apiErrorMessage } from "../../lib/api";
import { toast } from "sonner";

const STAT_CARDS = [
  { key: "total_event", label: "Total Event", icon: CalendarCheck2, color: "text-violet" },
  { key: "total_pendapatan", label: "Total Pendapatan", icon: Wallet, color: "text-amber", money: true },
  { key: "total_tiket_terjual", label: "Tiket Terjual", icon: Ticket, color: "text-stage" },
  { key: "total_checkin", label: "Sudah Check-in", icon: ScanLine, color: "text-mid" },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await reportService.getDashboard();
        setData(res.data);
      } catch (err) {
        toast.error(apiErrorMessage(err, "Gagal memuat dashboard."));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingScreen label="Menyiapkan dashboard..." />;

  const ringkasan = data?.ringkasan || {};

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl tracking-wide sm:text-4xl">Dashboard</h1>
        <p className="mt-1 text-sm text-mid">Ringkasan performa event & penjualan tiket kamu.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, money }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl border border-white/10 p-5"
          >
            <div className="flex items-center justify-between">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="mt-4 font-display text-2xl tracking-wide sm:text-3xl">
              {money ? formatIDR(ringkasan[key]) : (ringkasan[key] ?? 0)}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wider text-dim">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl border border-white/10 p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl tracking-wide">Event Terdekat</h2>
            <Link to="/admin/events" className="flex items-center gap-1 text-xs text-stage hover:underline">
              Kelola semua <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {(!data?.event_terdekat || data.event_terdekat.length === 0) ? (
            <p className="py-8 text-center text-sm text-dim">Belum ada event yang published.</p>
          ) : (
            <div className="space-y-3">
              {data.event_terdekat.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-4 rounded-xl border border-white/5 bg-surface2 p-3"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface3">
                    {e.poster_url && (
                      <img src={assetUrl(e.poster_url)} alt={e.nama} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-hi">{e.nama}</p>
                    <p className="text-xs text-dim">
                      {formatDateShort(e.tanggal)} &middot; {e.lokasi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass rounded-2xl border border-white/10 p-6">
          <h2 className="mb-4 font-display text-xl tracking-wide">Status Event</h2>
          <div className="space-y-3">
            {Object.entries(data?.status_event || {}).length === 0 && (
              <p className="text-sm text-dim">Belum ada data.</p>
            )}
            {Object.entries(data?.status_event || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize text-mid">{status.replace("_", " ")}</span>
                <span className="font-mono text-hi">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
