import { motion } from "framer-motion";

/**
 * Reveal teks kata-per-kata dengan masking (bukan fade biasa) — tiap kata
 * "naik" dari balik garis, ke-stagger sedikit demi sedikit. Ini teknik
 * animasi headline yang umum dipakai situs-situs Awwwards-style.
 *
 * Pakai <br/> di dalam `text` (sebagai string biasa) buat ganti baris manual,
 * atau taruh elemen lain lewat children kalau butuh styling per-kata (warna
 * beda, dst) — lihat Hero.jsx buat contoh pemakaian campuran.
 */
export default function SplitReveal({
  words,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.05,
  duration = 0.9,
}) {
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word.text}
          </motion.span>
          {word.space !== false && "\u00A0"}
        </span>
      ))}
    </span>
  );
}
