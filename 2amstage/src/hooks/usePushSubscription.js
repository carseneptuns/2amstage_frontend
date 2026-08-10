import { useCallback, useEffect, useState } from "react";
import pushService from "../services/pushService";
import { useAuthStore } from "../store/authStore";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

function isSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
}

// Daftarin service worker + subscribe ke Web Push, sekali per login.
// Ini yang bikin notif chat tetep nyampe walau tab/browser-nya ketutup total
// (beda dari useChatNotifier yang cuma jalan kalau tab-nya masih aktif).
//
// PENTING soal Safari/iOS: WebKit CUMA mau nampilin prompt izin notifikasi
// kalau dipicu langsung dari user gesture (tap/klik) — nggak bisa otomatis
// dari useEffect kayak di Chrome. Makanya hook ini nyediain `subscribe()`
// buat dipanggil dari onClick tombol, bukan cuma auto-run di background.
export default function usePushSubscription() {
  const currentUser = useAuthStore((s) => s.user);
  const [permission, setPermission] = useState(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );

  const subscribe = useCallback(async () => {
    if (!currentUser || !isSupported()) return false;

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");

      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return false;

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        const { data } = await pushService.getVapidPublicKey();
        if (!data.publicKey) return false; // backend belum di-set VAPID_PUBLIC_KEY

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey),
        });
      }

      await pushService.subscribe(subscription.toJSON());
      return true;
    } catch {
      return false;
    }
  }, [currentUser]);

  // Best-effort otomatis — jalan mulus di Chrome (Android/desktop) yang
  // mengizinkan request permission tanpa user gesture. Di Safari ini akan
  // diam-diam gagal tanpa prompt, makanya UI tetap perlu tombol manual.
  useEffect(() => {
    if (currentUser && isSupported() && Notification.permission === "granted") {
      subscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return { permission, supported: isSupported(), subscribe };
}
