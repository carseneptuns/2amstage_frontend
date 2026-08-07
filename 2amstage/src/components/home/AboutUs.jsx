import Reveal from "../ui/Reveal";

const STATS = [
  { value: "250+", label: "Konser Terfasilitasi" },
  { value: "120K", label: "Tiket Terjual" },
  { value: "40+", label: "Kota Terjangkau" },
  { value: "4.9/5", label: "Rating Pengguna" },
];

export default function AboutUs() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="badge border-stage/30 bg-stage/10 text-stage">Tentang 2AMSTAGE</span>
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-wide sm:text-5xl">
            KAMI PERCAYA MALAM TERBAIK DIMULAI DARI{" "}
            <span className="bg-amber-gradient bg-clip-text text-transparent">TIKET YANG TEPAT</span>
          </h2>
          <p className="mt-6 text-mid leading-relaxed">
            2AMSTAGE lahir dari kejengkelan yang sama: antre server tiket yang lambat,
            takut kena tiket palsu, dan bingung mencari QR code di email menjelang pintu
            masuk. Kami membangun ulang seluruh perjalanan itu — dari menemukan artis
            favoritmu, memilih zona terbaik, sampai memegang tiket digital yang bisa
            langsung dipindai.
          </p>
          <p className="mt-4 text-mid leading-relaxed">
            Setiap event yang tayang di sini dikurasi langsung oleh promotor dan
            organizer terverifikasi, jadi kamu bisa fokus pada satu hal saja:
            menikmati panggungnya.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="grid grid-cols-2 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-hairline/10 bg-surface p-6 text-center transition hover:border-stage/30"
            >
              <p className="font-display text-3xl tracking-wide text-hi sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-dim">
                {s.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
