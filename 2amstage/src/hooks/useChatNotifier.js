import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import chatService from "../services/chatService";
import { useAuthStore } from "../store/authStore";

const POLL_MS = 5000;
const READ_KEY = "chat_last_read";
const NOTIFIED_KEY = "chat_last_notified";

function getMap(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

export default function useChatNotifier() {
  const currentUser = useAuthStore((s) => s.user);
  const location = useLocation();
  const navigate = useNavigate();
  const locationRef = useRef(location.pathname);

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!currentUser) return;

    const check = async () => {
      try {
        const res = await chatService.listConversations();
        const lastRead = getMap(READ_KEY);
        const lastNotified = getMap(NOTIFIED_KEY);
        let changed = false;

        for (const c of res.data) {
          const other = c.lawan_bicara?.[0];
          const msg = c.pesan_terakhir;
          if (!other || !msg || msg.sender_id === currentUser.id) continue;

          const msgTime = new Date(msg.created_at).getTime();
          const isUnread = msgTime > (lastRead[c.id] || 0);
          const alreadyNotified = msgTime <= (lastNotified[c.id] || 0);
          const onThisChatPage = locationRef.current === `/chat/${c.id}`;

          if (isUnread && !alreadyNotified && !onThisChatPage) {
            toast(other.nama, {
              description: msg.isi,
              action: {
                label: "Buka",
                onClick: () => navigate(`/chat/${c.id}`),
              },
            });
            lastNotified[c.id] = msgTime;
            changed = true;
          }
        }

        if (changed) localStorage.setItem(NOTIFIED_KEY, JSON.stringify(lastNotified));
      } catch {
        // silent — jangan ganggu user kalau polling notifikasi gagal
      }
    };

    check();
    const interval = setInterval(check, POLL_MS);
    return () => clearInterval(interval);
  }, [currentUser, navigate]);
}