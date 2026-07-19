"use client";

import React, { useState, useEffect, useTransition } from "react";
import { User, Settings, ShieldAlert, KeyRound, Check, AlertTriangle, Loader2 } from "lucide-react";
import { updateUserProfile, resetAccountData } from "@/app/dashboard/settings/user-actions";
import { useRouter } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import GoalSettings from "./goal-settings";

interface SettingsClientProps {
  initialName: string;
  email: string;
  initials: string;
  currentGoal: number;
}

type TabType = "profile" | "learning" | "shortcuts" | "privacy";

export default function SettingsClient({
  initialName,
  email,
  initials,
  currentGoal,
}: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [name, setName] = useState(initialName);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("synapse_shortcuts_enabled");
      setShortcutsEnabled(saved !== "false");
    }
  }, []);

  const handleToggleShortcuts = () => {
    const newValue = !shortcutsEnabled;
    setShortcutsEnabled(newValue);
    localStorage.setItem("synapse_shortcuts_enabled", String(newValue));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSavingProfile(true);
    try {
      await updateUserProfile(name.trim());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile name:", err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResetData = () => {
    startTransition(async () => {
      try {
        await resetAccountData();
        setConfirmModalOpen(false);
        setConfirmInput("");
        router.refresh();
        router.push("/dashboard");
      } catch (err) {
        console.error("Failed to reset account data:", err);
      }
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-4">
      {/* Sidebar Navigation */}
      <div className="md:col-span-1 flex flex-col gap-1.5">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition cursor-pointer text-left ${
            activeTab === "profile"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4" />
          Profile Settings
        </button>

        <button
          onClick={() => setActiveTab("learning")}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition cursor-pointer text-left ${
            activeTab === "learning"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          Preferences & Goals
        </button>

        <button
          onClick={() => setActiveTab("shortcuts")}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition cursor-pointer text-left ${
            activeTab === "shortcuts"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Keyboard Hotkeys
        </button>

        <button
          onClick={() => setActiveTab("privacy")}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition cursor-pointer text-left ${
            activeTab === "privacy"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Security & Privacy
        </button>
      </div>

      {/* Settings Form Wrapper */}
      <div className="md:col-span-3 space-y-6">
        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Profile Settings</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Customize your public display name and account specifics.
              </p>
            </div>

            {/* Avatar display */}
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-xl font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                {initials}
              </div>
              <div>
                <h4 className="font-bold text-foreground">{name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
              </div>
            </div>

            {/* Profile form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {saveSuccess ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                    <Check className="h-3.5 w-3.5" />
                    Profile Updated
                  </span>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl cursor-pointer bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 flex items-center gap-2"
                >
                  {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Learning Preferences */}
        {activeTab === "learning" && (
          <div className="space-y-6">
            {/* Theme */}
            <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Appearance</h2>
                <p className="text-xs text-muted-foreground">Select your interface styling scheme.</p>
              </div>
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>

            {/* Goal settings */}
            <GoalSettings currentGoal={currentGoal} />
          </div>
        )}

        {/* Keyboard Hotkeys */}
        {activeTab === "shortcuts" && (
          <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Keyboard Hotkeys</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Speed up card reviews and navigation using key configurations.
                </p>
              </div>

              {/* Toggle switch */}
              <button
                type="button"
                onClick={handleToggleShortcuts}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  shortcutsEnabled ? "bg-indigo-600" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    shortcutsEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Key list overview */}
            <div className="border-t border-border pt-4 space-y-4">
              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                  <span className="font-semibold text-foreground">Navigation Hotkeys</span>
                  <span className="text-xs text-muted-foreground">Typed sequentially</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Go to Dashboard</span>
                  <span><kbd className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">g</kbd> + <kbd className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">d</kbd></span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Go to Study Hub</span>
                  <span><kbd className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">g</kbd> + <kbd className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">s</kbd></span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Open Shortcuts Cheatsheet</span>
                  <kbd className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">?</kbd>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-border/40 pb-2">
                  <span className="font-semibold text-foreground">Active Workspaces</span>
                  <span className="text-xs text-muted-foreground">Inside specific editors</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Save Note Content</span>
                  <kbd className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">Ctrl + S</kbd>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Flip Review Card</span>
                  <kbd className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">Space</kbd>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Rate confidence levels</span>
                  <span className="flex gap-1">
                    <kbd className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">1</kbd>
                    <span className="text-muted-foreground/30">-</span>
                    <kbd className="bg-background px-1.5 py-0.5 rounded border border-border font-mono">4</kbd>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security & Privacy */}
        {activeTab === "privacy" && (
          <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Security & Data Privacy</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your account database storage and privacy compliance.
              </p>
            </div>

            {/* Privacy note */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4 text-xs text-muted-foreground leading-relaxed">
              For security compliance, all study logs, focus heartbeats, note drafts, flashcard stacks, and course profiles are encrypted. Deleting your personal records is permanent and deletes all values from Synapse databases.
            </div>

            {/* Delete button */}
            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-foreground">Reset Account Data</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Wipes all courses, flashcards, logs, and streaks from your account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setConfirmModalOpen(true)}
                className="rounded-xl cursor-pointer bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-500 text-sm font-semibold px-5 py-2.5 transition"
              >
                Reset Account Data
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Double confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-rose-500/20 bg-card p-6 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="rounded-xl bg-rose-500/10 p-2 border border-rose-500/20 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Wipe Account Data?</h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              This action is permanent and **cannot be undone**. All courses, generated flashcards, logged study sessions, and mastery matrices will be permanently deleted.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                To confirm, type <span className="font-mono text-rose-500">RESET MY DATA</span> below:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="RESET MY DATA"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-rose-500 focus:outline-none uppercase font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmModalOpen(false);
                  setConfirmInput("");
                }}
                className="rounded-xl border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-semibold px-4 py-2.5 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={confirmInput !== "RESET MY DATA" || isPending}
                onClick={handleResetData}
                className="rounded-xl cursor-pointer bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2.5 transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Wipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
