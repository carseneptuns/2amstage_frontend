import { QrCode, ShieldCheck, Zap, Armchair, Clock3, Smartphone } from "lucide-react";
import Reveal from "../ui/Reveal";

const SERVICES = [
  {
    icon: QrCode,
    title: "Tiket QR Instan",
    desc: "Begitu pembayaran berhasil, tiket QR premium langsung tersedia di akunmu — siap dipindai di pintu masuk.",
    accent: "stage",
  },
  {
    icon: Armchair,
    title: "Pilih Zona Real-Time",
    desc: "Lihat sisa kuota tiap kategori secara langsung dan pilih posisi terbaik sebelum kehabisan.",
    accent: "violet",
  },
  {
    icon: ShieldCheck,
    title: "Transaksi Aman",
    desc: "Setiap order terkunci dengan sesi pembayaran 10 menit, mencegah kuota diserobot pembeli lain.",
    accent: "amber",
  },
  {
    icon: Clock3,
    title: "Reminder Otomatis",
    desc: "Hitung mundur pada tiap event memastikan kamu tidak pernah melewatkan hari-H.",
    accent: "stage",
  },
  {
    icon: Smartphone,
    title: "Semua di Satu Genggaman",
    desc: "Riwayat order, tiket aktif, dan detail konser tersimpan rapi di halaman Tiket Saya.",
    accent: "violet",
  },
  {
    icon: Zap,
    title: "Checkout Kilat",
    desc: "Alur pembelian singkat: pilih kategori, konfirmasi, bayar — tanpa langkah berbelit.",
    accent: "amber",
  },
];

const ACCENTS = {
  stage: "text-stage bg-stage/10 border-stage/20",
  violet: "text-violet bg-violet/10 border-violet/20",
  amber: "text-amber bg-amber/10 border-amber/20",
};

export default function ServiceOverview() {
  return (
    <section id="services" className="relative border-y border-hairline/5 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <span className="badge border-amber/30 bg-amber/10 text-amber">Kenapa 2AMSTAGE</span>
          <h2 className="mt-4 font-display text-4xl tracking-wide sm:text-5xl">
            SATU PANGGUNG, <span className="text-stage">SEMUA</span> DIURUS
          </h2>
          <p className="mt-3 text-mid">
            Kami membangun setiap langkah pembelian tiket supaya terasa secepat energi
            konser itu sendiri.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-hairline/10 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-hairline/20">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border ${ACCENTS[s.accent]}`}
                >
                  <s.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-5 font-display text-lg tracking-wide">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mid">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
