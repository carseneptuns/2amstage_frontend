import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import chatService from "../services/chatService";
import { apiErrorMessage, assetUrl } from "../lib/api";
import { useAuthStore } from "../store/authStore";
import LoadingScreen from "../components/ui/LoadingScreen";

const POLL_MS = 3000;

export default function ChatRoom() {
  const { id } = useParams();
  const currentUser = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const bottomRef = useRef(null);

  const loadMeta = useCallback(async () => {
    try {
      const res = await chatService.listConversations();
      const convo = res.data.find((c) => String(c.id) === String(id));
      setOtherUser(convo?.lawan_bicara?.[0] || null);
    } catch {
      // non-fatal — header just won't show a name
    }
  }, [id]);

  const loadMessages = useCallback(async () => {
    try {
      const res = await chatService.getMessages(id);
      setMessages(res.data);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Gagal memuat pesan."));
    }
  }, [id]);

  useEffect(() => {
    loadMeta();
    loadMessages();
    const interval = setInterval(loadMessages, POLL_MS);
    return () => clearInterval(interval);
  }, [loadMeta, loadMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const isi = text.trim();
    if (!isi) return;
    setSending(true);
    try {
      await chatService.sendMessage(id, isi);
      setText("");
      await loadMessages();
      setBlocked(false);
    } catch (err) {
      if (err?.response?.status === 403) {
        setBlocked(true);
        toast.error(apiErrorMessage(err));
      } else {
        toast.error(apiErrorMessage(err, "Gagal mengirim pesan."));
      }
    } finally {
      setSending(false);
    }
  };

  if (messages === null) return <LoadingScreen label="Membuka percakapan..." />;

  return (
    <div className="mx-auto flex h-[calc(100vh-5rem)] max-w-2xl flex-col px-5 pt-24 sm:px-8">
      <div className="flex shrink-0 items-center gap-3 border-b border-white/10 pb-4">
        <Link to="/chat" className="rounded-full p-2 text-mid hover:bg-white/5 hover:text-hi">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        {otherUser && (
          <>
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-surface2">
              {otherUser.avatar_url ? (
                <img src={assetUrl(otherUser.avatar_url)} alt={otherUser.nama} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-dim">
                  {otherUser.nama?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <Link to={`/profil/${otherUser.username}`} className="font-medium text-hi hover:underline">
              {otherUser.nama}
            </Link>
          </>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto py-4">
        {messages.length === 0 && (
          <p className="py-10 text-center text-sm text-dim">Mulai obrolan kamu.</p>
        )}
        {messages.map((m) => {
          const isMine = m.sender_id === currentUser?.id;
          return (
            <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMine ? "bg-stage text-white" : "bg-surface2 text-hi"
                }`}
              >
                {m.isi}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {blocked && (
        <p className="mb-2 text-center text-xs text-stage">
          Kalian sudah tidak saling follow, tidak bisa mengirim pesan baru.
        </p>
      )}

      <form onSubmit={handleSend} className="shrink-0 border-t border-white/10 py-4">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis pesan..."
            className="input-field flex-1 text-base"
          />
          <button type="submit" disabled={sending || !text.trim()} className="btn-primary !px-4">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
