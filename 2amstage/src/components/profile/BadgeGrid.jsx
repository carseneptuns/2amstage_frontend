import { Eye, EyeOff, ChevronUp, ChevronDown, Award } from "lucide-react";
import { assetUrl } from "../../lib/api";
import { formatDateShort } from "../../utils/format";

/**
 * `badges` items shape (owner mode): { id, event_id, nama_event, artis, poster_url, tanggal, is_visible, display_order }
 * `badges` items shape (public/read-only mode): { event_id, nama_event, artis, poster_url, tanggal }
 */
export default function BadgeGrid({ badges, editable = false, onToggleVisible, onMove }) {
  if (!badges || badges.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline/15 py-12 text-center text-sm text-dim">
        <Award className="mx-auto mb-2 h-6 w-6" />
        Belum ada badge konser. Badge muncul otomatis setelah check-in tiket di lokasi acara.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {badges.map((b, i) => (
        <div
          key={b.id || b.event_id}
          className={`group relative overflow-hidden rounded-2xl border border-hairline/10 bg-surface ${
            editable && !b.is_visible ? "opacity-40" : ""
          }`}
        >
          <div className="aspect-square w-full overflow-hidden bg-surface3">
            {b.poster_url && (
              <img src={assetUrl(b.poster_url)} alt={b.nama_event} className="h-full w-full object-cover" />
            )}
          </div>
          <div className="p-3">
            <p className="truncate text-sm font-semibold text-hi">{b.artis || b.nama_event}</p>
            <p className="mt-0.5 truncate text-xs text-dim">{formatDateShort(b.tanggal)}</p>
          </div>

          {editable && (
            <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-void/60 p-1.5 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
              <div className="flex gap-1">
                <button
                  onClick={() => onMove?.(i, -1)}
                  disabled={i === 0}
                  className="rounded-md bg-hairline/[0.04] p-1 text-hi disabled:opacity-30"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onMove?.(i, 1)}
                  disabled={i === badges.length - 1}
                  className="rounded-md bg-hairline/[0.04] p-1 text-hi disabled:opacity-30"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={() => onToggleVisible?.(b)}
                className="rounded-md bg-hairline/[0.04] p-1 text-hi"
                title={b.is_visible ? "Sembunyikan dari profil publik" : "Tampilkan di profil publik"}
              >
                {b.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
