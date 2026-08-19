import { AtSign, MessageCircle, PlayCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-hairline/10 bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src="/stage-icon.svg" alt="2AMSTAGE" className="h-6 w-6" />
              <span className="font-display text-xl tracking-wide">
                2AM<span className="text-stage">STAGE</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-mid">
              Panggung terdekat dari layar kamu. Temukan konser, amankan kursi, dan hidupkan
              malammu.
            </p>
            <div className="mt-5 flex gap-3">
              {[AtSign, MessageCircle, PlayCircle].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline/10 text-mid transition hover:border-stage/40 hover:text-stage"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-dim">Jelajah</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-mid">
              <li><a href="#concerts" className="hover:text-hi">Konser</a></li>
              <li><a href="#services" className="hover:text-hi">Layanan</a></li>
              <li><a href="#about" className="hover:text-hi">Tentang Kami</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-dim">Akun</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-mid">
              <li><a href="/my-tickets" className="hover:text-hi">Tiket Saya</a></li>
              <li><a href="/login" className="hover:text-hi">Masuk</a></li>
              <li><a href="/register" className="hover:text-hi">Daftar Akun</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-dim">Bantuan</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-mid">
              <li>support@2amstage.id</li>
              <li>+62 812-0000-2024</li>
              <li>Setiap hari, 09.00–22.00 WIB</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-hairline/10 pt-6 text-xs text-dim sm:flex-row">
          <span>© {new Date().getFullYear()} 2AMSTAGE. Semua hak dilindungi.</span>
          <span className="font-mono">MADE FOR THE ONES WHO STAY TILL 2AM</span>
        </div>
      </div>
    </footer>
  );
}
