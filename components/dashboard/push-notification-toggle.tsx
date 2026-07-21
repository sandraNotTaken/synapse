"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, CheckCircle2, ShieldAlert } from "lucide-react";

export default function PushNotificationToggle() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    } else {
      setSupported(false);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!supported) return;

    try {
      const status = await Notification.requestPermission();
      setPermission(status);

      if (status === "granted") {
        // Send a test native OS / Browser push notification
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification("Synapse Notifications Enabled 🧠", {
            body: "You will receive alerts for study goal targets, streak reminders, and deck review schedules.",
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
          });
        } else {
          new Notification("Synapse Notifications Enabled 🧠", {
            body: "You will receive alerts for study goal targets, streak reminders, and deck review schedules.",
          });
        }
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  if (!supported) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-500 flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>Browser notifications are not supported in this browser.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
          {permission === "granted" ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </div>
        <div>
          <h4 className="text-xs font-bold text-foreground">Desktop & PWA Push Notifications</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Receive native system alerts for daily study goals, streaks, and flashcard review windows.
          </p>
        </div>
      </div>

      <button
        onClick={requestNotificationPermission}
        disabled={permission === "granted"}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
          permission === "granted"
            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default"
            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
        }`}
      >
        {permission === "granted" ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Enabled</span>
          </>
        ) : (
          <>
            <Bell className="h-3.5 w-3.5" />
            <span>{permission === "denied" ? "Permission Denied" : "Enable Alerts"}</span>
          </>
        )}
      </button>
    </div>
  );
}
