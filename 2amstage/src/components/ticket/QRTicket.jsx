import { motion } from "framer-motion";
import { MapPin, CalendarDays, Clock, Download, CheckCircle2, XCircle } from "lucide-react";
import TicketStub from "../ui/TicketStub";
import PosterFrame from "../ui/PosterFrame";
import { formatDateLong, formatTime, formatDateTime } from "../../utils/format";

const STATUS_MAP = {
  unused: { label: "Aktif", cls: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400" },
  used: { label: "Sudah Check-in", cls: "border-black/15 bg-black/[0.03] text-mid" },
  void: { label: "Tidak Berlaku", cls: "border-stage/30 bg-stage/10 text-stage" },
};

export default function QRTicket({ ticket, event, categoryName, index = 0 }) {
  const status = STATUS_MAP[ticket.status] || STATUS_MAP.unused;
  const isUsed = ticket.status !== "unused";

  const downloadQR = () => {
    if (!ticket.qr_code_base64) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${ticket.qr_code_base64}`;
    link.download = `${ticket.ticket_code}.png`;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <TicketStub
        stubWidth={132}
        className={isUsed ? "opacity-60 grayscale" : ""}
        main={
          <div className="relative flex flex-col sm:flex-row">
            <div className="relative h-40 w-full shrink-0 sm:h-auto sm:w-32">
              <PosterFrame src={event?.poster_url} alt={event?.nama} className="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent sm:bg-gradient-to-r" />
            </div>
            <div className="min-w-0 flex-1 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-amber">
                    {categoryName || "Tiket"}
                  </p>
                  <h3 className="mt-0.5 truncate font-display text-xl tracking-wide">
                    {event?.artis || event?.nama || "Konser"}
                  </h3>
                  {event?.nama && event?.artis && (
                    <p className="truncate text-xs text-mid">{event.nama}</p>
                  )}
                </div>
                <span className={`badge shrink-0 ${status.cls}`}>
                  {ticket.status === "unused" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {status.label}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-mid">
                {event?.tanggal && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-stage" /> {formatDateLong(event.tanggal)}
                  </span>
                )}
                {event?.waktu && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-stage" /> {formatTime(event.waktu)}
                  </span>
                )}
                {event?.lokasi && (
                  <span className="col-span-2 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-stage" /> {event.lokasi}
                  </span>
                )}
              </div>

              {ticket.status === "used" && ticket.used_at && (
                <p className="mt-2 text-[11px] text-dim">
                  Check-in pada {formatDateTime(ticket.used_at)}
                </p>
              )}
            </div>
          </div>
        }
        stub={
          <>
            {ticket.qr_code_base64 ? (
              <img
                src={`data:image/png;base64,${ticket.qr_code_base64}`}
                alt={`QR ${ticket.ticket_code}`}
                className="h-20 w-20 rounded-lg bg-white p-1 shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
              />
            ) : (
              <div className="h-20 w-20 rounded-lg bg-black/[0.03]" />
            )}
            <p className="mt-2 break-all font-mono text-[9px] leading-tight text-dim">
              {ticket.ticket_code}
            </p>
            {ticket.qr_code_base64 && !isUsed && (
              <button
                onClick={downloadQR}
                className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-stage hover:underline"
              >
                <Download className="h-3 w-3" /> Simpan
              </button>
            )}
          </>
        }
      />
    </motion.div>
  );
}
