import { useCountdown } from "../../hooks/useCountdown";
import { pad2 } from "../../utils/format";

function Unit({ value, label, accent = false }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg font-mono text-lg font-bold sm:h-14 sm:w-14 sm:text-xl ${
          accent
            ? "bg-stage/15 text-stage border border-stage/30"
            : "bg-hairline/[0.03] text-hi border border-hairline/10"
        }`}
      >
        {pad2(value)}
      </div>
      <span className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-dim">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ targetDate, compact = false, onExpire }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(targetDate);

  if (expired) {
    if (onExpire) onExpire();
    return (
      <span className="badge border-stage/30 bg-stage/10 text-stage">Waktu habis</span>
    );
  }

  if (compact) {
    return (
      <span className="font-mono text-sm font-bold tabular-nums text-amber">
        {days > 0 && `${days}h `}
        {pad2(hours)}:{pad2(minutes)}:{pad2(seconds)}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {days > 0 && <Unit value={days} label="Hari" />}
      <Unit value={hours} label="Jam" accent />
      <span className="pb-4 font-display text-xl text-dim">:</span>
      <Unit value={minutes} label="Menit" accent />
      <span className="pb-4 font-display text-xl text-dim">:</span>
      <Unit value={seconds} label="Detik" />
    </div>
  );
}
