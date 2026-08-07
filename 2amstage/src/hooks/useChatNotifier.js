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

function canUseOsNotification() {
  return typeof window !== "undefined" && "Notification" in window;
}

export default function useChatNotifier() {
  const currentUser = useAuthStore((s) => s.user);
  const location = useLocation();
  const navigate = useNavigate();
  const locationRef = useRef(location.pathname);

  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  // Minta izin notifikasi sekali, pas user login — browser nolak minta izin
  // lagi kalau sebelumnya udah pernah di-allow/deny (jadi aman dipanggil tiap mount).
  useEffect(() => {
    if (currentUser && canUseOsNotification() && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [currentUser]);

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
            const goToChat = () => navigate(`/chat/${c.id}`);

            // Tab lagi disembunyiin/diminimize/pindah tab lain → pakai notifikasi
            // OS asli (Notification API) biar keliatan walau lagi nggak natap web-nya.
            // Tab lagi keliatan/aktif → toast di dalam app aja, nggak perlu OS notif.
            const useOsNotification =
              canUseOsNotification() &&
              Notification.permission === "granted" &&
              document.hidden;

            if (useOsNotification) {
              const notif = new Notification(other.nama, {
                body: msg.isi,
                icon: "/stage-icon.svg",
                tag: `chat-${c.id}`, // notif baru dari chat yang sama gantiin yang lama, nggak numpuk
              });
              notif.onclick = () => {
                window.focus();
                goToChat();
                notif.close();
              };
            } else {
              toast(other.nama, {
                description: msg.isi,
                action: { label: "Buka", onClick: goToChat },
              });
            }

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