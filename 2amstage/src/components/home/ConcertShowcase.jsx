import { useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarX2 } from "lucide-react";
import ConcertCard from "./ConcertCard";
import Reveal from "../ui/Reveal";
import LoadingScreen from "../ui/LoadingScreen";

export default function ConcertShowcase({ events, loading, error }) {
  const railRef = useRef(null);

  const scrollBy = (dir) => {
    railRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section id="concerts" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="badge border-violet/30 bg-violet/10 text-violet">
              Line-up minggu ini
            </span>
            <h2 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">
              KONSER YANG SEDANG <span className="text-stage">PANAS</span>
            </h2>
            <p className="mt-3 max-w-lg text-mid">
              Geser untuk melihat semua panggung yang siap kamu datangi — dari klub
              intim sampai arena besar.
            </p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scrollBy(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline/10 text-hi transition hover:border-stage/40 hover:bg-stage/10"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline/10 text-hi transition hover:border-stage/40 hover:bg-stage/10"
              aria-label="Berikutnya"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </Reveal>

        <div className="mt-12">
          {loading && <LoadingScreen label="Memuat line-up..." />}

          {!loading && error && (
            <div className="rounded-2xl border border-stage/20 bg-stage/5 p-10 text-center text-mid">
              {error}
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-hairline/15 py-20 text-center">
              <CalendarX2 className="h-8 w-8 text-dim" />
              <p className="text-mid">Belum ada konser yang dipublikasikan saat ini.</p>
              <p className="text-sm text-dim">Cek lagi nanti, line-up baru segera hadir.</p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div
              ref={railRef}
              className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8"
            >
              {events.map((event, i) => (
                <Reveal key={event.id} delay={Math.min(i * 0.06, 0.3)} y={16}>
                  <ConcertCard event={event} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
