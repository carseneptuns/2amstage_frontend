import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import jsQR from "jsqr";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, LogOut, ScanLine, CameraOff, CheckCircle2, XCircle,
  AlertTriangle, Clock, Keyboard, Loader2, Ticket as TicketIcon,
} from "lucide-react";
import { toast } from "sonner";
import ticketService from "../services/ticketService";
import { apiErrorMessage } from "../lib/api";
import { useAuthStore } from "../store/authStore";

const STATUS_META = {
  success: { label: "TIKET VALID", color: "text-green-400", border: "border-green-400/50", glow: "shadow-[0_0_40px_rgba(52,199,132,0.35)]", icon: CheckCircle2 },
  already_used: { label: "SUDAH DIPAKAI", color: "text-amber", border: "border-amber/50", glow: "shadow-[0_0_40px_rgb(var(--c-amber) / 0.25)]", icon: Clock },
  void: { label: "TIDAK BERLAKU", color: "text-amber", border: "border-amber/50", glow: "shadow-[0_0_40px_rgb(var(--c-amber) / 0.25)]", icon: AlertTriangle },
  expired: { label: "KEDALUWARSA", color: "text-amber", border: "border-amber/50", glow: "shadow-[0_0_40px_rgb(var(--c-amber) / 0.25)]", icon: Clock },
  Invalid: { label: "TIKET TIDAK DITEMUKAN", color: "text-stage", border: "border-stage/50", glow: "shadow-[0_0_40px_rgb(var(--c-stage) / 0.3)]", icon: XCircle },
  error: { label: "GAGAL MEMVALIDASI", color: "text-stage", border: "border-stage/50", glow: "shadow-[0_0_40px_rgb(var(--c-stage) / 0.3)]", icon: XCircle },
};

const RESUME_DELAY = 3000;

export default function ScanTicket() {
  const { user, logout } = useAuthStore();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));
  const rafRef = useRef(null);
  const lastCodeRef = useRef(null);
  const resumeTimerRef = useRef(null);

  const [cameraState, setCameraState] = useState("starting"); // starting | ready | denied | unavailable
  const [scanning, setScanning] = useState(true);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [manualCode, setManualCode] = useState("");
  const [manualOpen, setManualOpen] = useState(false);

  const validateCode = useCallback(async (code) => {
    if (!code || checking) return;
    setChecking(true);
    setScanning(false);
    try {
      const res = await ticketService.validate(code);
      applyResult(code, res.data);
    } catch (err) {
      const data = err?.response?.data;
      if (data?.status) {
        applyResult(code, data);
      } else {
        toast.error(apiErrorMessage(err, "Gagal memvalidasi tiket."));
        setChecking(false);
        setScanning(true);
      }
    }
  }, [checking]);

  const applyResult = (code, data) => {
    setResult({ code, ...data });
    setHistory((h) => [
      { code, status: data.status, time: new Date(), ticket: data.ticket },
      ...h.slice(0, 7),
    ]);
    setChecking(false);
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setResult(null);
      lastCodeRef.current = null;
      setScanning(true);
    }, RESUME_DELAY);
  };

  // Setup kamera tunggal & bersih
  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      try {
        let stream;
        try {
          // Coba minta kamera belakang (Mobile)
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
        } catch (e) {
          // Fallback ke webcam biasa jika di Laptop/PC
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        }

        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current.play();
              if (active) setCameraState("ready");
            } catch (e) {
              console.error("Autoplay error:", e);
            }
          };
        }
      } catch (err) {
        if (!active) return;
        console.error("Gagal membuka kamera:", err);
        setCameraState(err?.name === "NotAllowedError" ? "denied" : "unavailable");
        setManualOpen(true);
      }
    };

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resumeTimerRef.current);
    };
  }, []);

  // Loop QR Code Scanner
  useEffect(() => {
    if (cameraState !== "ready") return;

    const tick = () => {
      const video = videoRef.current;
      if (scanning && video && video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code?.data && code.data !== lastCodeRef.current) {
          lastCodeRef.current = code.data;
          validateCode(code.data.trim());
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cameraState, scanning, validateCode]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    lastCodeRef.current = manualCode.trim();
    validateCode(manualCode.trim());
    setManualCode("");
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const meta = result ? STATUS_META[result.status] || STATUS_META.error : null;
  const StatusIcon = meta?.icon;

  return (
    <div className="flex min-h-screen flex-col bg-void">
      <header className="flex shrink-0 items-center justify-between border-b border-hairline/10 bg-surface px-5 py-4">
        <div className="flex items-center gap-2">
          <ScanLine className="h-5 w-5 text-stage" />
          <span className="font-display text-lg tracking-wide">
            SCAN <span className="text-stage">TIKET</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-dim sm:inline">{user?.nama}</span>
          <Link to="/" className="rounded-full p-2 text-mid hover:bg-hairline/[0.03] hover:text-hi" title="Kembali ke Situs">
            <Globe className="h-4 w-4" />
          </Link>
          <button onClick={handleLogout} className="rounded-full p-2 text-mid hover:bg-stage/10 hover:text-stage" title="Keluar">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5 px-4 py-6">
        {/* Camera viewfinder */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-hairline/10 bg-surface2">
          {/* Video selalu dirender tanpa hidden agar onloadedmetadata dipicu dengan benar */}
          <video
            ref={videoRef}
            muted
            playsInline
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              cameraState === "ready" ? "opacity-100" : "opacity-0"
            }`}
          />

          {cameraState === "starting" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-dim">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-sm">Membuka kamera...</p>
            </div>
          )}

          {(cameraState === "denied" || cameraState === "unavailable") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-dim">
              <CameraOff className="h-8 w-8" />
              <p className="text-sm">
                {cameraState === "denied"
                  ? "Akses kamera ditolak. Izinkan kamera di pengaturan browser, atau input manual di bawah."
                  : "Kamera tidak tersedia di perangkat ini. Gunakan input manual di bawah."}
              </p>
            </div>
          )}

          {/* Scan frame overlay */}
          {cameraState === "ready" && !result && (
            <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-hairline/25">
              <div className="absolute -left-0.5 -top-0.5 h-8 w-8 rounded-tl-2xl border-l-4 border-t-4 border-stage" />
              <div className="absolute -right-0.5 -top-0.5 h-8 w-8 rounded-tr-2xl border-r-4 border-t-4 border-stage" />
              <div className="absolute -bottom-0.5 -left-0.5 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-stage" />
              <div className="absolute -bottom-0.5 -right-0.5 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 border-stage" />
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-stage shadow-[0_0_12px_2px_rgb(var(--c-stage) / 0.6)]"
                animate={{ top: ["4%", "94%", "4%"] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          )}

          {checking && !result && (
            <div className="absolute inset-0 flex items-center justify-center bg-void/50 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-hi" />
            </div>
          )}

          {/* Result overlay */}
          <AnimatePresence>
            {result && meta && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute inset-0 flex flex-col items-center justify-center gap-3 border-4 ${meta.border} ${meta.glow} bg-void/90 px-6 text-center`}
              >
                <StatusIcon className={`h-16 w-16 ${meta.color}`} />
                <p className={`font-display text-2xl tracking-wide ${meta.color}`}>{meta.label}</p>
                {result.ticket?.event_nama && (
                  <div className="mt-1 space-y-0.5">
                    <p className="font-medium text-hi">{result.ticket.event_nama}</p>
                    <p className="text-sm text-mid">
                      {result.ticket.kategori} &middot; {result.ticket.pembeli}
                    </p>
                  </div>
                )}
                <p className="mt-1 font-mono text-xs text-dim">{result.code}</p>
                <p className="max-w-xs text-xs text-dim">{result.message}</p>
                <button
                  onClick={() => {
                    clearTimeout(resumeTimerRef.current);
                    setResult(null);
                    lastCodeRef.current = null;
                    setScanning(true);
                  }}
                  className="btn-primary mt-2 !px-5 !py-2 text-sm"
                >
                  Scan Lagi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Manual input fallback */}
        <div className="rounded-2xl border border-hairline/10 bg-surface p-4">
          <button
            onClick={() => setManualOpen((o) => !o)}
            className="flex w-full items-center justify-between text-sm font-medium text-mid hover:text-hi"
          >
            <span className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" /> Input Kode Manual
            </span>
            <span className="text-xs text-dim">{manualOpen ? "Sembunyikan" : "Tampilkan"}</span>
          </button>
          {manualOpen && (
            <form onSubmit={handleManualSubmit} className="mt-3 flex gap-2">
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="cth. TCK-0ED201E16E9F"
                className="input-field flex-1"
              />
              <button type="submit" disabled={checking} className="btn-primary !px-4 text-sm">
                Cek
              </button>
            </form>
          )}
        </div>

        {/* Recent scans */}
        {history.length > 0 && (
          <div className="rounded-2xl border border-hairline/10 bg-surface p-4">
            <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-dim">
              <TicketIcon className="h-3.5 w-3.5" /> Riwayat Scan
            </p>
            <div className="space-y-2">
              {history.map((h, i) => {
                const hMeta = STATUS_META[h.status] || STATUS_META.error;
                return (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="truncate font-mono text-dim">{h.code}</span>
                    <span className={`shrink-0 font-medium ${hMeta.color}`}>{hMeta.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}