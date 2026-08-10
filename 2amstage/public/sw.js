// Service worker buat 2AMSTAGE Web Push.
// Ini jalan TERPISAH dari tab web — browser yang jalanin di background level OS,
// makanya bisa nerima & nampilin notifikasi walau tab/browser-nya ketutup.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = { title: "2AMSTAGE", body: "Ada pesan baru.", url: "/" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    // payload bukan JSON — pakai default di atas
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Kalau tab-nya lagi difokusin, biarin toast di dalam app aja yang nangkep
      // (dari polling) — jangan dobel nampilin notif OS juga.
      const isFocused = clientList.some((c) => c.focused);
      if (isFocused) return;

      return self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/stage-icon.svg",
        badge: "/stage-icon.svg",
        tag: data.url, // notif dari chat yang sama gantiin yang lama, nggak numpuk
        renotify: true, // ...tapi tetep bunyi/getar tiap pesan baru, nggak didiemin
        data: { url: data.url },
      });
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
