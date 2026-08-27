import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, AtSign, Loader2, Users, CalendarDays, MapPin } from "lucide-react";
import profileService from "../services/profileService";
import { apiErrorMessage, assetUrl } from "../lib/api";
import FollowButton from "../components/profile/FollowButton";
import PosterFrame from "../components/ui/PosterFrame";
import { formatDateShort, formatIDR } from "../utils/format";
import { toast } from "sonner";

const TABS = [
  { key: "orang", label: "Cari Orang", icon: Users },
  { key: "event", label: "Cari Event", icon: CalendarDays },
];

export default function SearchUsers() {
  const [tab, setTab] = useState("orang");
  const [query, setQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [eventResults, setEventResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setUserResults([]);
      setEventResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        if (tab === "orang") {
          const res = await profileService.search(query.trim());
          setUserResults(res.data.users);
        } else {
          const res = await profileService.searchEvents(query.trim());
          setEventResults(res.data);
        }
      } catch (err) {
        toast.error(apiErrorMessage(err, "Gagal mencari."));
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query, tab]);

  const results = tab === "orang" ? userResults : eventResults;

  return (
    <div className="mx-auto max-w-xl px-5 pb-20 pt-28 sm:px-8">
      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">Cari</h1>
      <p className="mt-1 text-sm text-mid">
        {tab === "orang" ? "Cari berdasarkan username atau nama buat mulai follow." : "Cari event/konser berdasarkan nama, artis, atau lokasi."}
      </p>

      <div className="mt-5 flex gap-2">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setTab(key);
              setSearched(false);
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              tab === key
                ? "border-stage/30 bg-stage/15 text-hi"
                : "border-hairline/10 bg-surface2 text-dim hover:text-hi"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </button>
        ))}
      </div>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === "orang" ? "Cari username atau nama..." : "Cari nama event, artis, atau lokasi..."}
          className="input-field w-full pl-11"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-dim" />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {tab === "orang" &&
          userResults.map((u) => (
            <div
              key={u.id}
              className="glass flex items-center gap-3 rounded-2xl border border-hairline/10 p-3"
            >
              <Link to={`/profil/${u.username}`} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-hairline/10 bg-surface2">
                  {u.avatar_url ? (
                    <img src={assetUrl(u.avatar_url)} alt={u.nama} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-sm text-dim">
                      {u.nama?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-hi">{u.nama}</p>
                  <p className="flex items-center gap-1 truncate text-xs text-dim">
                    <AtSign className="h-3 w-3" /> {u.username}
                  </p>
                </div>
              </Link>
              <FollowButton userId={u.id} />
            </div>
          ))}

        {tab === "event" &&
          eventResults.map((e) => (
            <Link
              key={e.id}
              to={`/concerts/${e.id}`}
              className="glass flex items-center gap-3 rounded-2xl border border-hairline/10 p-3 transition hover:border-stage/30"
            >
              <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg border border-hairline/10 bg-surface2">
                <PosterFrame src={e.poster_url} alt={e.nama} className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-hi">{e.artis || e.nama}</p>
                <p className="truncate text-xs text-dim">{e.nama}</p>
                <div className="mt-1 flex items-center gap-3 text-[11px] text-dim">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" /> {formatDateShort(e.tanggal)}
                  </span>
                  <span className="flex min-w-0 items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 shrink-0" /> {e.lokasi}
                  </span>
                </div>
              </div>
              {e.harga_termurah != null && (
                <span className="shrink-0 font-mono text-xs font-bold text-hi">{formatIDR(e.harga_termurah)}</span>
              )}
            </Link>
          ))}

        {!loading && searched && results.length === 0 && (
          <p className="mt-8 text-center text-sm text-dim">
            Nggak ada {tab === "orang" ? "user" : "event"} yang cocok dengan "{query}".
          </p>
        )}
      </div>
    </div>
  );
}
