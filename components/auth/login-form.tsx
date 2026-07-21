"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import GoogleButton from "./google-button";
import DevLoginButton from "./dev-login-button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const reset = searchParams.get("reset");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        redirectTo: "/dashboard",
      });

      if (res?.error) {
        setError("Invalid email address or password.");
        setLoading(false);
      } else {
        // Successful login -> navigate to dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to sign in. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-5">
      {registered && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-500 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Account created successfully! Please sign in below.</span>
        </div>
      )}

      {reset && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-500 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Password reset successfully! Please sign in with your new password.</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-red-500 animate-fade-in">
          {error}
        </div>
      )}

      {/* Email & Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-indigo-500" />
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-card/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-indigo-500" />
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-semibold text-indigo-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-border bg-card/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span>Sign In</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Google OAuth & Signup Links */}
      <div className="space-y-4 pt-2">
        <GoogleButton />

        <div className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign Up
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && <DevLoginButton />}
      </div>
    </div>
  );
}
