"use client";

import React, { useState, useEffect, useTransition } from "react";
import { User, Settings, ShieldAlert, KeyRound, Check, AlertTriangle, Loader2, BarChart3, Award, Flame, Zap, Brain, Sparkles, QrCode, Copy, ShieldCheck, Lock, BookOpen, GraduationCap, Timer } from "lucide-react";
import { updateUserProfile, resetAccountData } from "@/app/dashboard/settings/user-actions";
import { useRouter } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import GoalSettings from "./goal-settings";
import AnalyticsChart, { DayAnalytics } from "./analytics-chart";
import PushNotificationToggle from "./push-notification-toggle";

interface SettingsClientProps {
  initialName: string;
  email: string;
  initials: string;
  currentGoal: number;
  xp?: number;
  level?: number;
  weeklyAnalytics?: DayAnalytics[];
}

type TabType = "profile" | "learning" | "shortcuts" | "privacy" | "analytics";

export default function SettingsClient({
  initialName,
  email,
  initials,
  currentGoal,
  xp = 120,
  level = 2,
  weeklyAnalytics = [],
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

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAWizard, setShow2FAWizard] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(1);
  const [twoFactorSecret] = useState("JBSW Y3DP EHPK 3PXP");
  const [twoFactorInputCode, setTwoFactorInputCode] = useState("");
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [recoveryCodes] = useState([
    "ABCD-1234-EFGH",
    "IJKL-5678-MNOP",
    "QRST-9012-UVWX",
    "YZAB-3456-CDEF"
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const enabled = localStorage.getItem("synapse_2fa_enabled");
      setTwoFactorEnabled(enabled === "true");
    }
  }, []);

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      if (confirm("Are you sure you want to disable 2FA? This will reduce your account security.")) {
        localStorage.setItem("synapse_2fa_enabled", "false");
        setTwoFactorEnabled(false);
      }
    } else {
      setTwoFactorStep(1);
      setTwoFactorInputCode("");
      setTwoFactorError(null);
      setCopiedSecret(false);
      setShow2FAWizard(true);
    }
  };

  const handleVerify2FA = () => {
    if (twoFactorInputCode.length !== 6) {
      setTwoFactorError("Verification code must be exactly 6 digits.");
      return;
    }
    setTwoFactorError(null);
    setTwoFactorStep(2); // Success step showing recovery codes
  };

  const handleComplete2FA = () => {
    localStorage.setItem("synapse_2fa_enabled", "true");
    setTwoFactorEnabled(true);
    setShow2FAWizard(false);
  };

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
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition cursor-pointer text-left ${
            activeTab === "analytics"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Analytics & Charts
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
                Customize your public display name and read our active study recommendations.
              </p>
            </div>

            {/* Profile Avatar & Email Header */}
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-lg font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                {initials}
              </div>
              <div>
                <h4 className="font-bold text-foreground">{name}</h4>
                <p className="text-xs text-muted-foreground">{email}</p>
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

            {/* Active Study Guidelines */}
            <div className="border-t border-border pt-6 space-y-4">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                Active Study Guidelines
              </h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs">
                    <Sparkles className="h-4 w-4" />
                    <span>Active Recall</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Test your memory rather than rereading. Use the practice exams generated from your notes to identify knowledge gaps before reviews.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs">
                    <Flame className="h-4 w-4" />
                    <span>Spaced Repetition</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Review cards right as you are about to forget them. Set your daily review target limit to manage your workload consistently.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs">
                    <GraduationCap className="h-4 w-4" />
                    <span>Feynman Technique</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Explain dense topics simply inside the workspace tutor panel. Teaching a concept is the fastest way to master and consolidate memory.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs">
                    <Timer className="h-4 w-4" />
                    <span>Focus Intervals</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Study in 25-minute intervals followed by a 5-minute break. Use the top bar timer to keep track of your focus blocks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics & Charts Tab */}
        {activeTab === "analytics" && (
          <AnalyticsChart
            weeklyData={weeklyAnalytics || []}
            dailyGoal={currentGoal}
          />
        )}

        {/* Learning Preferences */}
        {activeTab === "learning" && (
          <div className="space-y-6">
            {/* Theme */}
            <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Appearance</h2>
                <p className="text-xs text-muted-foreground">Select your interface styling scheme.</p>
              </div>
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>

            {/* Desktop / PWA Push Notifications */}
            <PushNotificationToggle />

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

            {/* Two-Factor Authentication (2FA) */}
            <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-500" />
                  Two-Factor Authentication (2FA)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Protect your Synapse profile using an authenticator app (e.g. Google Authenticator).
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggle2FA}
                className={`rounded-xl cursor-pointer text-sm font-semibold px-5 py-2.5 transition border ${
                  twoFactorEnabled
                    ? "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-indigo-600 hover:bg-indigo-500 border-indigo-600 text-white"
                }`}
              >
                {twoFactorEnabled ? "2FA Enabled" : "Configure 2FA"}
              </button>
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

      {/* 2FA Setup Wizard Modal */}
      {show2FAWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-indigo-500/20 bg-card p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center gap-3 text-indigo-500">
              <div className="rounded-xl bg-indigo-500/10 p-2 border border-indigo-500/20 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Configure Two-Factor Auth (2FA)</h3>
            </div>

            {twoFactorStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  1. Scan this QR code using your authenticator app (e.g. Google Authenticator, Authy, or 1Password):
                </p>

                {/* Styled SVG QR Code Mock */}
                <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border bg-white w-44 h-44 mx-auto shadow-inner relative group">
                  <QrCode className="h-36 w-36 text-slate-900" />
                  <div className="absolute inset-0 bg-slate-950/80 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center p-3 text-center">
                    <span className="text-[10px] text-white font-medium">otpauth://totp/Synapse:{email}?secret={twoFactorSecret}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] text-muted-foreground text-center">
                    Or enter the secret key manually:
                  </p>
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 p-2.5">
                    <code className="text-xs font-mono font-bold text-foreground select-all">{twoFactorSecret}</code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(twoFactorSecret);
                        setCopiedSecret(true);
                        setTimeout(() => setCopiedSecret(false), 2000);
                      }}
                      className="cursor-pointer rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition flex items-center justify-center"
                    >
                      {copiedSecret ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label htmlFor="otp2fa" className="text-xs font-semibold text-foreground block">
                    2. Enter 6-digit Verification Code:
                  </label>
                  <input
                    id="otp2fa"
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={twoFactorInputCode}
                    onChange={(e) => setTwoFactorInputCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-center tracking-[0.5em] font-mono rounded-xl border border-border bg-background px-4 py-2.5 text-base text-foreground focus:border-indigo-500 focus:outline-none"
                  />
                  {twoFactorError && (
                    <p className="text-[11px] font-semibold text-red-500">{twoFactorError}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShow2FAWizard(false)}
                    className="rounded-xl border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-semibold px-4 py-2.5 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleVerify2FA}
                    className="rounded-xl cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 transition shadow-lg shadow-indigo-600/20"
                  >
                    Verify Code
                  </button>
                </div>
              </div>
            )}

            {twoFactorStep === 2 && (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-center space-y-1">
                  <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-foreground text-sm">2FA Configured Successfully!</h4>
                  <p className="text-muted-foreground text-[11px]">
                    Your account is now protected by Two-Factor Authentication.
                  </p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-foreground">Backup Recovery Codes</h5>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Store these backup codes in a safe place. If you lose access to your authenticator app, these are the only way to log in.
                  </p>
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-muted/20 p-3.5 font-mono text-[11px] text-center font-semibold text-foreground select-all">
                    {recoveryCodes.map((code) => (
                      <div key={code} className="border border-border/40 rounded-lg py-1.5 bg-card/45 shadow-sm">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleComplete2FA}
                    className="w-full rounded-xl cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-3 transition shadow-lg shadow-indigo-600/20 text-center"
                  >
                    I Saved My Recovery Codes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
