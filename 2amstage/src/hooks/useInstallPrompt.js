import { useEffect, useState } from "react";

function isStandalone() {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

// Android/Chrome punya event asli buat nge-trigger prompt "Install App"
// langsung dari tombol kita sendiri. iOS Safari TIDAK punya API buat itu sama
// sekali (keputusan sengaja dari Apple) — jadi buat iOS, yang bisa kita
// lakuin cuma nunjukin instruksi bergambar ke tombol Share bawaan Safari.
export default function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone());

  useEffect(() => {
    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return null;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return choice.outcome; // "accepted" | "dismissed"
  };

  return {
    installed,
    canPromptNatively: Boolean(deferredPrompt),
    isIos: isIos(),
    promptInstall,
  };
}
