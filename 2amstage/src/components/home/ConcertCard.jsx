import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, ArrowUpRight, Flame } from "lucide-react";
import PosterFrame from "../ui/PosterFrame";
import { formatDateShort, formatIDR } from "../../utils/format";

export default function ConcertCard({ event }) {
  const soldOut = event.status === "sold_out" || event.progress_percent >= 100;
  const almostGone = !soldOut && event.progress_percent >= 75;

  return (
    <Link
      to={`/concerts/${event.id}`}
      className="group relative block w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-stage/30 hover:shadow-glow sm:w-[340px]"
    >
      <div className="relative h-[420px] overflow-hidden sm:h-[440px]">
        <PosterFrame
          src={event.poster_url}
          alt={event.nama}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />

        {/* status badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {almostGone && (
            <span className="badge border-amber/30 bg-amber/15 text-amber">
              <Flame className="h-3 w-3" /> Hampir Habis
            </span>
          )}
          {soldOut && (
            <span className="badge border-stage/30 bg-stage/15 text-stage">Sold Out</span>
          )}
        </div>

        {/* base info — always visible */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-amber">
            {formatDateShort(event.tanggal)}
          </p>
          <h3 className="mt-1 font-display text-2xl leading-tight tracking-wide text-hi">
            {event.artis || event.nama}
          </h3>
          <p className="mt-0.5 truncate text-sm text-mid">{event.nama}</p>

          {/* hover reveal detail panel */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                <div className="flex items-center gap-1.5 text-xs text-mid">
                  <MapPin className="h-3.5 w-3.5 text-stage" /> {event.lokasi}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dim">Mulai dari</span>
                  <span className="font-mono text-sm font-bold text-hi">
                    {event.harga_termurah != null ? formatIDR(event.harga_termurah) : "-"}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-hi transition group-hover:bg-stage">
                  Lihat Detail
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
