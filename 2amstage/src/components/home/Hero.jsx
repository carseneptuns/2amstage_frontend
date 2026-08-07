import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle, MapPin } from "lucide-react";
import PosterFrame from "../ui/PosterFrame";
import CountdownTimer from "../ui/CountdownTimer";
import { formatDateLong } from "../../utils/format";

export default function Hero({ events = [] }) {
  const featured = events.slice(0, 3);
  const headliner = featured[0];

  const scrollToConcerts = () => {
    document.getElementById("concerts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-spotlight pb-20 pt-32 sm:pt-40">
      {/* ambient stage beams */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[600px] w-[300px] rotate-12 bg-gradient-to-b from-stage/10 to-transparent blur-3xl" />
        <div className="absolute -right-10 top-10 h-[500px] w-[260px] -rotate-12 bg-gradient-to-b from-violet/10 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Left: thesis copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="badge border-stage/30 bg-stage/10 text-stage"
          >
            <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-stage" />
            Penjualan tiket dibuka sepanjang malam
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 font-display text-[15vw] leading-[0.92] tracking-wide sm:text-7xl lg:text-[5.5rem]"
          >
            LIVE
            <br />
            <span className="text-outline">TILL</span>
            <br />
            <span className="bg-stage-gradient bg-clip-text text-transparent">2AM</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-md text-base text-mid sm:text-lg"
          >
            Dari panggung kecil sampai stadion penuh lampu sorot — temukan konser
            favoritmu, amankan tiket dalam hitungan detik, dan bawa pulang tiket
            digital yang bisa dipindai langsung di pintu masuk.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button onClick={scrollToConcerts} className="btn-primary">
              Jelajahi Konser <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#about" className="btn-secondary">
              <PlayCircle className="h-4 w-4" /> Cara Kerjanya
            </a>
          </motion.div>

          {headliner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex items-center gap-4 border-t border-black/10 pt-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-dim">
                Segera hadir
              </span>
              <CountdownTimer targetDate={`${headliner.tanggal}T${headliner.waktu}`} compact />
            </motion.div>
          )}
        </div>

        {/* Right: floating ticket / poster stack */}
        <div className="relative mx-auto h-[420px] w-full max-w-sm sm:h-[480px]">
          {featured.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: i === 0 ? 0 : i === 1 ? -6 : 8,
              }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-6 top-0 animate-floatSlow overflow-hidden rounded-2xl border border-black/10 shadow-2xl"
              style={{
                zIndex: featured.length - i,
                animationDelay: `${i * 0.5}s`,
                transform: `translateY(${i * 26}px) scale(${1 - i * 0.06})`,
              }}
            >
              <Link to={`/concerts/${event.id}`} className="block h-[380px] w-full">
                <div className="relative h-full w-full">
                  <PosterFrame src={event.poster_url} alt={event.nama} className="h-full w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                  {i === 0 && (
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="font-display text-2xl tracking-wide">
                        {event.artis || event.nama}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-mid">
                        <MapPin className="h-3.5 w-3.5 text-stage" />
                        {event.lokasi} · {formatDateLong(event.tanggal)}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
          {featured.length === 0 && (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-black/15 text-sm text-dim">
              Konser akan segera diumumkan
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
