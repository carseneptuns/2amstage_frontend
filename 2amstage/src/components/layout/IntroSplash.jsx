import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LETTERS_2AM = ["2", "A", "M"];
const LETTERS_STAGE = ["S", "T", "A", "G", "E"];

const flicker = {
  duration: 0.7,
  times: [0, 0.2, 0.4, 0.55, 0.7, 1],
};

export default function IntroSplash({ onFinish }) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    timeoutRef.current = setTimeout(onFinish, 3100);
    return () => {
      clearTimeout(timeoutRef.current);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => {
    clearTimeout(timeoutRef.current);
    onFinish();
  };

  return (
    <motion.div
      key="intro-splash"
      className="fixed inset-0 z-[999] flex cursor-pointer items-center justify-center overflow-hidden bg-void"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)" }}
      transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      onClick={skip}
    >
      {/* ambient spotlight glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-spotlight"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.55] }}
        transition={{ duration: 1.6, times: [0, 0.5, 1], ease: "easeOut" }}
      />

      {/* crossing stage beams */}
      <motion.div
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[170%] w-40 -translate-x-[230px] rotate-12 bg-gradient-to-b from-stage/25 via-stage/5 to-transparent blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.3] }}
        transition={{ duration: 2, delay: 0.1 }}
      />
      <motion.div
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[170%] w-40 translate-x-[190px] -rotate-12 bg-gradient-to-b from-violet/25 via-violet/5 to-transparent blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.3] }}
        transition={{ duration: 2, delay: 0.25 }}
      />

      {/* vertical scanning light sweep */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-white/10 to-transparent"
        initial={{ y: "-140%" }}
        animate={{ y: "140%" }}
        transition={{ duration: 1.5, delay: 0.35, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center px-6">
        {/* mark: stage-beam triangle drawing itself in */}
        <motion.svg viewBox="0 0 32 32" className="mb-5 h-14 w-14 drop-shadow-[0_0_18px_rgba(255,46,99,0.55)] sm:h-16 sm:w-16">
          <motion.path
            d="M6 22 L16 6 L26 22 Z"
            fill="none"
            stroke="#FF2E63"
            strokeWidth="2"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          />
          <motion.circle
            cx="16"
            cy="17"
            r="2.4"
            fill="#FFC93C"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.7, 1], opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          />
        </motion.svg>

        {/* wordmark — flickers on like a neon marquee */}
        <div className="flex items-baseline gap-2 sm:gap-3">
          <span className="font-display flex text-5xl tracking-wide text-hi sm:text-7xl">
            {LETTERS_2AM.map((ch, i) => (
              <motion.span
                key={`a-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.2, 1, 0.4, 1] }}
                transition={{ ...flicker, delay: 0.85 + i * 0.08 }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
          <span className="font-display flex text-5xl tracking-wide text-stage drop-shadow-[0_0_20px_rgba(255,46,99,0.6)] sm:text-7xl">
            {LETTERS_STAGE.map((ch, i) => (
              <motion.span
                key={`s-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.15, 1, 0.3, 1] }}
                transition={{ ...flicker, delay: 1.25 + i * 0.06 }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </div>

        {/* tagline */}
        <motion.div
          className="mt-4 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-stage to-transparent" />
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-mid">
            Live The Night
          </p>
        </motion.div>
      </div>

      {/* skip */}
      <motion.button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        className="absolute bottom-6 right-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-mid transition hover:border-stage/40 hover:text-hi sm:bottom-8 sm:right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.4 }}
      >
        Lewati
      </motion.button>
    </motion.div>
  );
}
