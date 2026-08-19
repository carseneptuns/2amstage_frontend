import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";

/**
 * ============================================================
 *  KOLASE FOTO HERO
 * ============================================================
 *  Ganti/tambah baris di bawah ini dengan foto kamu sendiri.
 *  - src   : path gambar. Taruh file fotonya di folder
 *            `public/images/hero/`, lalu tulis path-nya di sini
 *            contoh: "/images/hero/01.jpg"
 *  - tint  : warna overlay duotone di atas foto (boleh hex apa
 *            saja). Kosongkan / hapus baris `tint` kalau mau
 *            fotonya tampil natural tanpa filter warna.
 *
 *  Urutan array = urutan strip dari kiri ke kanan.
 *  Boleh nambah/kurangin jumlah strip sesuka hati.
 * ============================================================
 */
const HERO_STRIPS = [
  { src: "/images/hero/01.jpg", tint: "#7c9473" }, // sage green
  { src: "/images/hero/02.jpg", tint: "#b08d57" }, // sepia gold
  { src: "/images/hero/03.jpg", tint: "#9b6fc9" }, // purple
  { src: "/images/hero/04.jpg", tint: "#8a1f2b" }, // deep red
  { src: "/images/hero/05.jpg", tint: "#8fb3c4" }, // ice blue
  { src: "/images/hero/06.jpg", tint: null }, // grayscale / natural
  { src: "/images/hero/07.jpg", tint: "#d17bb0" }, // pink
  { src: "/images/hero/08.jpg", tint: "#c9c9c2" }, // foggy grey
  { src: "/images/hero/09.jpg", tint: null }, // natural
  { src: "/images/hero/10.jpg", tint: "#d99a3c" }, // amber
  { src: "/images/hero/11.jpg", tint: "#a3453a" }, // rust red
  { src: "/images/hero/12.jpg", tint: "#4d6a87" }, // steel blue
  { src: "/images/hero/13.jpg", tint: "#8a5db0" }, // violet
  { src: "/images/hero/14.jpg", tint: "#5b7a94" }, // blue grey
  { src: "/images/hero/15.jpg", tint: null }, // b&w grain
  { src: "/images/hero/16.jpg", tint: "#3c8f7a" }, // teal green
];

function HeroCollage() {
  return (
    <div className="absolute inset-0 -z-20 flex overflow-hidden">
      {HERO_STRIPS.map((strip, i) => (
        <div key={i} className="relative h-full min-w-0 flex-1">
          <img
            src={strip.src}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: strip.tint ? "grayscale(1) contrast(1.05)" : "none" }}
            draggable={false}
          />
          {strip.tint && (
            <div
              className="absolute inset-0 mix-blend-color"
              style={{ backgroundColor: strip.tint, opacity: 0.85 }}
            />
          )}
          {strip.tint && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: strip.tint, opacity: 0.18, mixBlendMode: "multiply" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const scrollToConcerts = () => {
    document.getElementById("concerts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
      {/* Background: kolase strip foto vertikal — atur di HERO_STRIPS di atas */}
      <HeroCollage />

      {/* Overlay: menggelapkan foto biar teks tetap kebaca, fade ke bg halaman */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-void/85 via-void/55 to-void" />
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
