"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";

const DISMISS_KEY = "installPromptDismissedAt";
const DISMISS_DAYS = 14;

function wasRecentlyDismissed() {
  try {
    const stored = localStorage.getItem(DISMISS_KEY);
    if (!stored) return false;
    const elapsedDays = (Date.now() - Number(stored)) / (1000 * 60 * 60 * 24);
    return elapsedDays < DISMISS_DAYS;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    const ua = navigator.userAgent;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua) && !window.MSStream;

    if (isStandalone || !isMobile || wasRecentlyDismissed()) {
      return;
    }

    setDismissed(false);

    if (isIOS) {
      setShowIOSHint(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIOSHint(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  if (dismissed || (!deferredPrompt && !showIOSHint)) return null;

  return (
    <div className="w-full max-w-5xl glass rounded-3xl border border-white/5 p-6 mb-8 flex items-center gap-5 relative overflow-hidden">
      <div className="absolute -right-6 -top-6 w-28 h-28 bg-yellow-500/10 blur-[50px] -z-10"></div>

      <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-[#F2B824] to-[#B48A1B] rounded-2xl flex items-center justify-center text-black font-bold text-2xl shadow-[0_0_20px_rgba(242,184,36,0.2)]">
        T
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-lg">{t("install_title")}</h3>
        <p className="text-slate-400 text-sm mt-1">
          {showIOSHint ? t("install_ios_hint") : t("install_desc")}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {deferredPrompt && (
          <button
            onClick={install}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-all active:scale-95"
          >
            {t("install_now")}
          </button>
        )}
        <button
          onClick={dismiss}
          className="text-slate-500 hover:text-white text-sm font-medium px-2 py-2.5 transition-colors"
        >
          {t("install_dismiss")}
        </button>
      </div>
    </div>
  );
}
