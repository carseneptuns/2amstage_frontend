import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

export default function Hero() {
  const scrollToConcerts = () => {
    document.getElementById("concerts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
      {/* Background collage image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-collage.jpg')" }}
      />

      {/* Overlay: darkens the photo so text stays readable, fades bottom into page bg */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-void/80 via-void/55 to-void" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-void via-transparent to-void/40" />

      {/* ambient stage beams */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[600px] w-[300px] rotate-12 bg-gradient-to-b from-stage/20 to-transparent blur-3xl" />
        <div className="absolute -right-10 top-10 h-[500px] w-[260px] -rotate-12 bg-gradient-to-b from-violet/20 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 text-center sm:px-8 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="badge mx-auto border-stage/30 bg-stage/10 text-stage"
        >
          <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-stage" />
          Penjualan tiket dibuka sepanjang malam
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 font-display text-[16vw] leading-[0.9] tracking-wide text-white sm:text-8xl lg:text-[7rem]"
        >
          LIVE
          <br />
          <span className="text-outline">TILL</span>{" "}
          <span className="bg-stage-gradient bg-clip-text text-transparent">2AM</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-base text-mid sm:text-lg"
        >
          Dari panggung kecil sampai stadion penuh lampu sorot — temukan konser
          favoritmu, amankan tiket dalam hitungan detik, dan bawa pulang tiket
          digital yang bisa dipindai langsung di pintu masuk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button onClick={scrollToConcerts} className="btn-primary">
            Jelajahi Konser <ArrowRight className="h-4 w-4" />
          </button>
          <a href="#about" className="btn-secondary">
            <PlayCircle className="h-4 w-4" /> Cara Kerjanya
          </a>
        </motion.div>
      </div>
    </section>
  );
}
