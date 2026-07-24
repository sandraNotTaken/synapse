"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { Bell, Award, Flame, Brain, Info, Check, Trash2, Loader2, Sparkles } from "lucide-react";
import {
  getUserNotifications,
  markNotificationAsRead,
  clearAllNotifications,
  generateSimulatedNotifications,
} from "@/app/dashboard/study/notification-actions";
import { useOffline } from "@/components/providers/offline-provider";

export default function NotificationCenter() {
  const { isOffline } = useOffline();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = async () => {
    if (isOffline) return;
    try {
      const data = await getUserNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Poll notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [isOffline]);

  // Trigger simulations when opening dropdown to keep goals/reviews up-to-date
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !isOffline) {
      startTransition(async () => {
        await generateSimulatedNotifications();
        await loadNotifications();
      });
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await markNotificationAsRead(id);
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleClearAll = async () => {
    setLoading(true);
    try {
      await clearAllNotifications();
      setNotifications([]);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <Award className="h-4 w-4 text-emerald-500" />;
      case "streak":
        return <Flame className="h-4 w-4 text-orange-500" />;
      case "review":
        return <Brain className="h-4 w-4 text-indigo-500" />;
      default:
        return <Bell className="h-4 w-4 text-cyan-500" />;
    }
  };

  const formatTime = (date: Date | string) => {
    const elapsed = Date.now() - new Date(date).getTime();
    const mins = Math.round(elapsed / 60000);
    const hours = Math.round(mins / 60);
    const days = Math.round(hours / 24);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label="Notifications Center"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black text-white ring-2 ring-background animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Container */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
          <div className="flex items-center justify-between border-b border-border/10 pb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-bold text-foreground">Updates & Reminders</span>
            </div>
            {notifications.length > 0 && (
              <button
                type="button"
                disabled={loading}
                onClick={handleClearAll}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:text-rose-600 transition cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
                Clear All
              </button>
            )}
          </div>

          {/* List content */}
          <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`relative flex items-start gap-3 rounded-xl border p-3 transition duration-200 ${
                  notif.read
                    ? "border-border/40 bg-card/20 opacity-70"
                    : "border-indigo-500/20 bg-indigo-500/[0.03] hover:bg-indigo-500/10"
                }`}
              >
                <div className="rounded-lg bg-background p-2 shrink-0 border border-border">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 space-y-0.5 text-left min-w-0 pr-6">
                  <h5 className="text-xs font-bold text-foreground leading-snug truncate">
                    {notif.title}
                  </h5>
                  <p className="text-[11px] text-muted-foreground leading-normal line-clamp-2">
                    {notif.body}
                  </p>
                  <span className="text-[9px] text-muted-foreground font-semibold block pt-1">
                    {formatTime(notif.createdAt)}
                  </span>
                </div>

                {/* Mark as read tick */}
                {!notif.read && (
                  <button
                    type="button"
                    onClick={(e) => handleMarkAsRead(notif.id, e)}
                    className="absolute top-3 right-3 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 transition"
                    title="Mark as read"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Info className="h-6 w-6 text-muted-foreground/60 stroke-[1.5]" />
                <h4 className="mt-2.5 text-xs font-semibold text-foreground">All caught up!</h4>
                <p className="mt-1 text-[11px] text-muted-foreground max-w-[200px]">
                  You have no new alerts or learning prompts.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
