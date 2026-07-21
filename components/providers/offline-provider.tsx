"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import { WifiOff, Wifi, Loader2, Check } from "lucide-react";
import { logStudySession, updateCardConfidence } from "@/app/dashboard/study/actions";
import { updateTopicContent } from "@/app/actions/topic";

interface OfflineContextType {
  isOffline: boolean;
  queueStudySession: (durationSeconds: number) => void;
  queueCardConfidence: (cardId: string, rating: "again" | "hard" | "good" | "easy") => void;
  queueNoteContent: (topicId: string, content: string) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    return {
      isOffline: typeof window !== "undefined" ? !navigator.onLine : false,
      queueStudySession: () => {},
      queueCardConfidence: () => {},
      queueNoteContent: () => {},
    };
  }
  return context;
}

export default function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register Service Worker for offline browser caching & PWA support
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("Service Worker registered with scope:", reg.scope);
      }).catch((err) => {
        console.error("Service Worker registration error:", err);
      });
    }

    // Set initial state
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      setShowBanner(true);
      triggerSync();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check in case they loaded offline
    if (!navigator.onLine) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const queueStudySession = (durationSeconds: number) => {
    if (typeof window === "undefined") return;
    const queue = JSON.parse(localStorage.getItem("synapse_offline_sessions") || "[]");
    queue.push(durationSeconds);
    localStorage.setItem("synapse_offline_sessions", JSON.stringify(queue));
  };

  const queueCardConfidence = (cardId: string, rating: "again" | "hard" | "good" | "easy") => {
    if (typeof window === "undefined") return;
    const queue = JSON.parse(localStorage.getItem("synapse_offline_ratings") || "[]");
    const filtered = queue.filter((item: any) => item.cardId !== cardId);
    filtered.push({ cardId, rating });
    localStorage.setItem("synapse_offline_ratings", JSON.stringify(filtered));
  };

  const queueNoteContent = (topicId: string, content: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`synapse_offline_note_${topicId}`, content);
    
    const list = JSON.parse(localStorage.getItem("synapse_offline_notes_sync_list") || "[]");
    if (!list.includes(topicId)) {
      list.push(topicId);
      localStorage.setItem("synapse_offline_notes_sync_list", JSON.stringify(list));
    }
  };

  const triggerSync = () => {
    if (typeof window === "undefined") return;

    const sessions = JSON.parse(localStorage.getItem("synapse_offline_sessions") || "[]");
    const ratings = JSON.parse(localStorage.getItem("synapse_offline_ratings") || "[]");
    const notesList = JSON.parse(localStorage.getItem("synapse_offline_notes_sync_list") || "[]");

    if (sessions.length === 0 && ratings.length === 0 && notesList.length === 0) {
      // Nothing to sync, dismiss online banner after short time
      setTimeout(() => setShowBanner(false), 3000);
      return;
    }

    setSyncing(true);
    startTransition(async () => {
      try {
        // Sync study sessions
        for (const duration of sessions) {
          await logStudySession(duration);
        }
        localStorage.removeItem("synapse_offline_sessions");

        // Sync card confidence ratings
        for (const item of ratings) {
          await updateCardConfidence(item.cardId, item.rating);
        }
        localStorage.removeItem("synapse_offline_ratings");

        // Sync offline note drafts
        for (const topicId of notesList) {
          const content = localStorage.getItem(`synapse_offline_note_${topicId}`);
          if (content) {
            await updateTopicContent(topicId, content);
            localStorage.removeItem(`synapse_offline_note_${topicId}`);
          }
        }
        localStorage.removeItem("synapse_offline_notes_sync_list");

        setSyncSuccess(true);
        setTimeout(() => {
          setSyncSuccess(false);
          setShowBanner(false);
        }, 4000);
      } catch (err) {
        console.error("Failed to sync offline actions:", err);
      } finally {
        setSyncing(false);
      }
    });
  };

  return (
    <OfflineContext.Provider value={{ isOffline, queueStudySession, queueCardConfidence, queueNoteContent }}>
      {children}

      {/* Connection Status Toast Bar */}
      {showBanner && (
        <div className="fixed bottom-6 left-6 z-50 animate-fade-in">
          {isOffline ? (
            <div className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-950/90 p-4 text-rose-200 shadow-2xl backdrop-blur-xl">
              <WifiOff className="h-5 w-5 shrink-0 text-rose-400 animate-pulse" />
              <div>
                <h5 className="text-xs font-bold leading-none">Offline Mode Active</h5>
                <p className="text-[10px] text-rose-300 mt-1">Progress will be saved locally & synced later.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/90 p-4 text-emerald-200 shadow-2xl backdrop-blur-xl">
              {syncing ? (
                <>
                  <Loader2 className="h-5 w-5 shrink-0 text-emerald-400 animate-spin" />
                  <div>
                    <h5 className="text-xs font-bold leading-none">Back Online</h5>
                    <p className="text-[10px] text-emerald-300 mt-1">Syncing cached study activities...</p>
                  </div>
                </>
              ) : syncSuccess ? (
                <>
                  <Check className="h-5 w-5 shrink-0 text-emerald-400 bg-emerald-500/20 rounded-full p-0.5" />
                  <div>
                    <h5 className="text-xs font-bold leading-none">Sync Completed!</h5>
                    <p className="text-[10px] text-emerald-300 mt-1">All offline activities successfully saved.</p>
                  </div>
                </>
              ) : (
                <>
                  <Wifi className="h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <h5 className="text-xs font-bold leading-none">Connection Restored</h5>
                    <p className="text-[10px] text-emerald-300 mt-1">App successfully connected to the server.</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </OfflineContext.Provider>
  );
}
