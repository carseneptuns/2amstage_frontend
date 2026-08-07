import { motion } from "framer-motion";
import { Minus, Plus, Check } from "lucide-react";
import { formatIDR } from "../../utils/format";

const ZONE_COLORS = [
  { fill: "fill-stage/25", stroke: "stroke-stage", text: "text-stage", ring: "ring-stage/50" },
  { fill: "fill-violet/25", stroke: "stroke-violet", text: "text-violet", ring: "ring-violet/50" },
  { fill: "fill-amber/25", stroke: "stroke-amber", text: "text-amber", ring: "ring-amber/50" },
  { fill: "fill-emerald-500/20", stroke: "stroke-emerald-400", text: "text-emerald-400", ring: "ring-emerald-400/50" },
];

const MAX_TICKETS = 2;

// Distributes N categories around a simple stage-facing arc for the visual map.
function layoutFor(count, i) {
  if (count <= 1) return { x: 50, y: 62, w: 60, h: 30 };
  const cols = count <= 3 ? count : Math.ceil(count / 2);
  const rows = Math.ceil(count / cols);
  const row = Math.floor(i / cols);
  const col = i % cols;
  const w = 90 / cols - 4;
  const h = 26;
  const x = 5 + col * (90 / cols) + w / 2;
  const y = 40 + row * (h + 8);
  return { x, y, w, h };
}

export default function SeatmapZones({ categories, quantities, onChange }) {
  const getColor = (i) => ZONE_COLORS[i % ZONE_COLORS.length];

  // Radio-style selection: only one category can have qty > 0 at a time.
  // Picking/incrementing a different category clears whatever was selected before.
  const selectCategory = (catId, qty) => {
    if (qty > 0) {
      categories.forEach((c) => {
        if (c.id !== catId && (quantities[c.id] || 0) > 0) {
          onChange(c.id, 0);
        }
      });
    }
    onChange(catId, qty);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      {/* Visual stage map */}
      <div className="rounded-2xl border border-hairline/10 bg-surface p-5">
        <svg viewBox="0 0 100 100" className="w-full">
          {/* stage */}
          <rect x="20" y="6" width="60" height="14" rx="3" className="fill-white/10" />
          <text x="50" y="15" textAnchor="middle" className="fill-mid font-mono" style={{ fontSize: 5 }}>
            STAGE
          </text>

          {categories.map((cat, i) => {
            const { x, y, w, h } = layoutFor(categories.length, i);
            const color = getColor(i);
            const soldOut = cat.sisa_kuota <= 0;
            const selected = quantities[cat.id] > 0;
            const fillRatio = cat.kuota > 0 ? cat.sisa_kuota / cat.kuota : 0;

            return (
              <g
                key={cat.id}
                className={soldOut ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
                onClick={() => !soldOut && selectCategory(cat.id, selected ? quantities[cat.id] : 1)}
              >
                <rect
                  x={x - w / 2}
                  y={y - h / 2}
                  width={w}
                  height={h}
                  rx="3"
                  className={`${soldOut ? "fill-white/5 stroke-white/10" : color.fill + " " + color.stroke} transition-all duration-300`}
                  strokeWidth={selected ? 1.4 : 0.6}
                  style={{
                    filter: selected ? "drop-shadow(0 0 6px rgb(var(--c-stage) / 0.35))" : "none",
                  }}
                />
                {/* fill level indicator */}
                {!soldOut && (
                  <rect
                    x={x - w / 2}
                    y={y + h / 2 - h * fillRatio}
                    width={w}
                    height={h * fillRatio}
                    className={`${color.fill} opacity-60`}
                    style={{ mixBlendMode: "screen" }}
                  />
                )}
                <text
                  x={x}
                  y={y - 2}
                  textAnchor="middle"
                  className={`${soldOut ? "fill-dim" : "fill-hi"} font-semibold`}
                  style={{ fontSize: 4.2 }}
                >
                  {cat.nama_kategori.length > 14 ? cat.nama_kategori.slice(0, 13) + "…" : cat.nama_kategori}
                </text>
                <text x={x} y={y + 4.5} textAnchor="middle" className="fill-dim" style={{ fontSize: 3.4 }}>
                  {soldOut ? "HABIS" : `${cat.sisa_kuota} tersisa`}
                </text>
                {selected && (
                  <circle cx={x + w / 2 - 3} cy={y - h / 2 + 3} r="2.6" className="fill-stage" />
                )}
              </g>
            );
          })}

          <text x="50" y="97" textAnchor="middle" className="fill-dim font-mono" style={{ fontSize: 3 }}>
            TAP ZONA UNTUK MEMILIH
          </text>
        </svg>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-hairline/10 pt-4 text-xs text-mid">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-stage/40 ring-1 ring-stage" /> Tersedia
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-hairline/[0.03] ring-1 ring-white/10" /> Habis
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3 w-3 text-stage" /> Dipilih
          </span>
        </div>
      </div>

      {/* Category list with steppers */}
      <div className="space-y-3">
        <p className="text-xs text-dim">Pilih 1 kategori tiket, maksimal {MAX_TICKETS} tiket per pesanan.</p>
        {categories.map((cat, i) => {
          const color = getColor(i);
          const soldOut = cat.sisa_kuota <= 0;
          const qty = quantities[cat.id] || 0;
          const maxQty = Math.min(cat.sisa_kuota, MAX_TICKETS);

          return (
            <motion.div
              key={cat.id}
              layout
              className={`flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                qty > 0 ? `border-stage/40 bg-stage/5 ring-1 ${color.ring}` : "border-hairline/10 bg-surface"
              } ${soldOut ? "opacity-50" : ""}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${soldOut ? "bg-dim" : color.text.replace("text-", "bg-")}`} />
                  <p className="truncate font-semibold text-hi">{cat.nama_kategori}</p>
                </div>
                <p className="mt-1 font-mono text-sm font-bold text-hi">{formatIDR(cat.harga)}</p>
                <p className="mt-0.5 text-xs text-dim">
                  {soldOut ? "Tiket habis terjual" : `${cat.sisa_kuota} dari ${cat.kuota} kursi tersisa`}
                </p>
              </div>

              {!soldOut && (
                <div className="flex shrink-0 items-center gap-3 rounded-full border border-hairline/10 bg-void/50 px-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => selectCategory(cat.id, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-mid transition hover:bg-hairline/[0.04] disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-5 text-center font-mono text-sm font-bold">{qty}</span>
                  <button
                    type="button"
                    onClick={() => selectCategory(cat.id, Math.min(maxQty, qty + 1))}
                    disabled={qty >= maxQty}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-mid transition hover:bg-hairline/[0.04] disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
