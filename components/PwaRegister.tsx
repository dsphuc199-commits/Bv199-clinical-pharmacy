"use client";

import { useEffect } from "react";

/* Dang ky service worker toi thieu de Android/iPhone nhan dien ung dung cai dat duoc (PWA). */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    }
  }, []);
  return null;
}
