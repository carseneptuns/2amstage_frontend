import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, AtSign, Loader2 } from "lucide-react";
import profileService from "../services/profileService";
import { apiErrorMessage, assetUrl } from "../lib/api";
import FollowButton from "../components/profile/FollowButton";
import { toast } from "sonner";

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await profileService.search(query.trim());
        setResults(res.data.users);
      } catch (err) {
        toast.error(apiErrorMessage(err, "Gagal mencari user."));
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className="mx-auto max-w-xl px-5 pb-20 pt-28 sm:px-8">
      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">Cari User</h1>
      <p className="mt-1 text-sm text-mid">Cari berdasarkan username atau nama buat mulai follow.</p>

      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari username atau nama..."
          className="input-field w-full pl-11"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-dim" />
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {results.map((u) => (
          <div
            key={u.id}
            className="glass flex items-center gap-3 rounded-2xl border border-white/10 p-3"
          >
            <Link to={`/profil/${u.username}`} className="flex min-w-0 flex-1 items-center gap-3">
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10 bg-surface2">
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

        {!loading && searched && results.length === 0 && (
          <p className="mt-8 text-center text-sm text-dim">Nggak ada user yang cocok dengan "{query}".</p>
        )}
      </div>
    </div>
  );
}
