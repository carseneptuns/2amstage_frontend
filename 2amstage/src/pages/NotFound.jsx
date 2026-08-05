import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
      <Zap className="h-10 w-10 text-stage" />
      <h1 className="mt-6 font-display text-7xl tracking-wide sm:text-8xl">404</h1>
      <p className="mt-3 text-lg text-mid">Panggung yang kamu cari sudah bubar.</p>
      <Link to="/" className="btn-primary mt-8">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
      </Link>
    </div>
  );
}
