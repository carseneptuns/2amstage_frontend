import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, AtSign, Bell } from "lucide-react";
import chatService from "../services/chatService";
import { apiErrorMessage, assetUrl } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import usePushSubscription from "../hooks/usePushSubscription";
import LoadingScreen from "../components/ui/LoadingScreen";
import { formatDateTime } from "../utils/format";

const POLL_MS = 5000;
const READ_KEY = "chat_last_read";

function getLastReadMap() {
  try{
    return JSON.parse(localStorage.getItem(READ_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function ChatList() {
  const currentUser = useAuthStore((s) => s.user);
  const { permission, supported, subscribe } = usePushSubscription();
  const [conversations, setConversations] = useState(null);
  const [error, setError] = useState(null);
  const [lastRead, setLastRead] = useState(getLastReadMap);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await chatService.listConversations();
        if (mounted) setConversations(res.data);
      } catch (err) {
        if (mounted) setError(apiErrorMessage(err, "Gagal memuat percakapan."));
      }
    };
    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);
  const markRead = (convoId, timestamp) => {
    const map = { ...lastRead, [convoId]: timestamp};
    localStorage.setItem(READ_KEY, JSON.stringify(map));
    setLastRead(map);
  }

  if (conversations === null && !error) return <LoadingScreen label="Membuka pesan..." />;

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-28 sm:px-8">
      <h1 className="mb-6 font-display text-3xl tracking-wide">PESAN</h1>

      {supported && permission === "default" && (
        <button
          onClick={subscribe}
          className="mb-6 flex w-full items-center gap-3 rounded-2xl border border-stage/25 bg-stage/[0.06] px-4 py-3 text-left transition hover:bg-stage/[0.1]"
        >
          <Bell className="h-5 w-5 shrink-0 text-stage" />
          <span className="flex-1 text-sm text-hi">
            <span className="font-medium">Aktifkan notifikasi</span> biar nggak ketinggalan chat, walau aplikasinya lagi ditutup.
          </span>
        </button>
      )}

      {error && <p className="py-10 text-center text-mid">{error}</p>}

      {conversations?.length === 0 && (
        <div className="rounded-2xl border border-dashed border-hairline/15 py-16 text-center">
          <MessageCircle className="mx-auto mb-3 h-8 w-8 text-dim" />
          <p className="text-mid">Belum ada percakapan.</p>
          <p className="mt-1 text-sm text-dim">
            Chat cuma bisa dimulai kalau kalian saling follow satu sama lain.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {conversations?.map((c) => {
          const other = c.lawan_bicara?.[0];
          if (!other) return null;
          const isMine = c.pesan_terakhir?.sender_id === currentUser?.id;
          const lastMsgTime = c.pesan_terakhir ? new Date(c.pesan_terakhir.created_at).getTime() : 0;
          const isUnread = !isMine && lastMsgTime > (lastRead[c.id] || 0);
          return (
            <Link
              key={c.id}
              to={`/chat/${c.id}`}
              className="flex items-center gap-3 rounded-2xl border border-hairline/10 bg-surface p-4 transition hover:border-hairline/20"
              onClick={() => c.pesan_terakhir && markRead(c.id, lastMsgTime)}
            >
              
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface2">
                {other.avatar_url ? (
                  <img src={assetUrl(other.avatar_url)} alt={other.nama} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-dim">
                    {other.nama?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-hi">{other.nama}</p>
                <p className="truncate text-sm text-dim">
                  {c.pesan_terakhir ? `${isMine ? "Kamu: " : ""}${c.pesan_terakhir.isi}` : "Belum ada pesan"}
                </p>
              </div>
              {c.pesan_terakhir && (
                <span className="text-xs text-dim">{formatDateTime(c.pesan_terakhir.created_at)}</span>
              )}
              {isUnread && <span className="h-2.5 w-2.5 rounded-full bg-red-500"/>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
