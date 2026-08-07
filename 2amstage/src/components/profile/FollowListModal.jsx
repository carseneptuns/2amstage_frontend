import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, AtSign, Loader2 } from "lucide-react";
import followService from "../../services/followService";
import { assetUrl } from "../../lib/api";
import FollowButton from "./FollowButton";

export default function FollowListModal({ userId, mode, onClose }) {
  // mode: "followers" | "following"
  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (!userId || !mode) return;
    setUsers(null);
    const fetcher = mode === "followers" ? followService.followers : followService.following;
    fetcher(userId)
      .then((res) => setUsers(res.data.users))
      .catch(() => setUsers([]));
  }, [userId, mode]);

  const open = Boolean(mode);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass max-h-[75vh] w-full max-w-sm overflow-hidden rounded-2xl border border-white/10"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h3 className="font-display text-lg tracking-wide">
                {mode === "followers" ? "Pengikut" : "Mengikuti"}
              </h3>
              <button onClick={onClose} className="rounded-full p-1 text-dim hover:text-hi">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {users === null && (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-5 w-5 animate-spin text-dim" />
                </div>
              )}

              {users?.length === 0 && (
                <p className="py-10 text-center text-sm text-dim">
                  {mode === "followers" ? "Belum ada pengikut." : "Belum mengikuti siapa-siapa."}
                </p>
              )}

              {users?.map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5">
                  <Link to={`/profil/${u.username}`} onClick={onClose} className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-surface2">
                      {u.avatar_url ? (
                        <img src={assetUrl(u.avatar_url)} alt={u.nama} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center font-display text-xs text-dim">
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
                  <FollowButton userId={u.id} compact />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
