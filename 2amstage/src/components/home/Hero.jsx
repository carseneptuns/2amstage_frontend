import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import SplitReveal from "../ui/SplitReveal";
import MagneticButton from "../ui/MagneticButton";

/**
 * ============================================================
 *  KOLASE FOTO HERO
 * ============================================================
 *  Ganti baris di bawah ini dengan foto kamu sendiri.
 *  Taruh file fotonya di folder `public/images/hero/`, lalu
 *  tulis path-nya di sini, contoh: "/images/hero/01.jpg"
 *
 *  Urutan array = urutan strip dari kiri ke kanan.
 *  Boleh nambah/kurangin jumlah strip sesuka hati.
 * ============================================================
 */
const HERO_STRIPS = [
  { src: "/images/hero/01.jpg" },
  { src: "/images/hero/02.jpg" },
  { src: "/images/hero/03.jpg" },
  { src: "/images/hero/04.jpg" },
  { src: "/images/hero/05.jpg" },
  { src: "/images/hero/06.jpg" },
];

function HeroCollage({ containerRef }) {
  const [hovered, setHovered] = useState(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <motion.div style={{ y: parallaxY }} className="absolute inset-0 -z-20 flex overflow-hidden">
      {HERO_STRIPS.map((strip, i) => {
        const isHovered = hovered === i;
        const isDimmed = hovered !== null && !isHovered;

        return (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative h-full min-w-0 cursor-pointer overflow-hidden transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ flexGrow: isHovered ? 3 : 1, flexShrink: 1, flexBasis: 0 }}
          >
            <img
              src={strip.src}
              alt=""
              className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: isHovered ? "scale(1.06)" : "scale(1)",
                filter: isDimmed ? "brightness(0.55)" : "brightness(1)",
              }}
              draggable={false}
            />
          </div>
        );
      })}
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const scrollToConcerts = () => {
    document.getElementById("concerts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="snap-section relative isolate flex min-h-[92vh] items-center overflow-hidden">
      {/* Background: kolase strip foto vertikal — atur di HERO_STRIPS di atas */}
      <HeroCollage containerRef={sectionRef} />

      {/* Overlay: menggelapkan foto biar teks tetap kebaca, fade ke bg halaman */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-void/85 via-void/55 to-void" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-void via-transparent to-void/40" />

      {/* ambient stage beams */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-0 h-[600px] w-[300px] rotate-12 bg-gradient-to-b from-stage/20 to-transparent blur-3xl" />
        <div className="absolute -right-10 top-10 h-[500px] w-[260px] -rotate-12 bg-gradient-to-b from-violet/20 to-transparent blur-3xl" />
      </div>

      <div className="pointer-events-none relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 text-center sm:px-8 sm:pt-40 [&_*]:pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="badge mx-auto border-stage/30 bg-stage/10 text-stage"
        >
          <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-stage" />
          Penjualan tiket dibuka sepanjang malam
        </motion.div>

        <h1 className="mt-6 font-display text-[16vw] leading-[0.9] tracking-wide text-white sm:text-8xl lg:text-[7rem]">
          <SplitReveal
            words={[{ text: "LIVE", space: false }]}
            delay={0.15}
          />
          <br />
          <SplitReveal
            words={[
              { text: "TILL", wordClassName: "text-outline" },
            ]}
            delay={0.3}
          />
          <SplitReveal
            words={[{ text: "2AM", space: false }]}
            wordClassName="bg-stage-gradient bg-clip-text text-transparent"
            delay={0.4}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mx-auto mt-6 max-w-xl text-base text-mid sm:text-lg"
        >
          Dari panggung kecil sampai stadion penuh lampu sorot — temukan konser
          favoritmu, amankan tiket dalam hitungan detik, dan bawa pulang tiket
          digital yang bisa dipindai langsung di pintu masuk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton>
            <button onClick={scrollToConcerts} className="btn-primary">
              Jelajahi Konser <ArrowRight className="h-4 w-4" />
            </button>
          </MagneticButton>
          <MagneticButton>
            <a href="#about" className="btn-secondary">
              <PlayCircle className="h-4 w-4" /> Cara Kerjanya
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
