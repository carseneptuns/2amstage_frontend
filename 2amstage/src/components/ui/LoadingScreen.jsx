import { motion } from "framer-motion";

export default function LoadingScreen({ label = "Menyalakan panggung..." }) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-6">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-stage/60"
          animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-violet/60"
          animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
        />
        <span className="h-3 w-3 rounded-full bg-amber shadow-glow-amber" />
      </div>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-mid">{label}</p>
    </div>
  );
}

export function InlineSpinner({ className = "" }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/25 border-t-white ${className}`}
    />
  );
}
