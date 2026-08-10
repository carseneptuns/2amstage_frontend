import { useEffect } from "react";
import pushService from "../services/pushService";
import { useAuthStore } from "../store/authStore";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

// Daftarin service worker + subscribe ke Web Push, sekali per login.
// Ini yang bikin notif chat tetep nyampe walau tab/browser-nya ketutup total
// (beda dari useChatNotifier yang cuma jalan kalau tab-nya masih aktif).
export default function usePushSubscription() {
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!currentUser) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    let cancelled = false;

    (async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }
        if (Notification.permission !== "granted") return;

        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          const { data } = await pushService.getVapidPublicKey();
          if (!data.publicKey) return; // backend belum di-set VAPID_PUBLIC_KEY

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(data.publicKey),
          });
        }

        if (!cancelled) {
          await pushService.subscribe(subscription.toJSON());
        }
      } catch {
        // diam-diam gagal — jangan ganggu UX kalau push nggak berhasil di-setup
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);
}
