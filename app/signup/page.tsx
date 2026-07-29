"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Loader2, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import Logo from "@/components/branding/logo";
import { registerUser } from "./actions";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [userOtpInput, setUserOtpInput] = useState("");
  const [storedFormData, setStoredFormData] = useState<FormData | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Generate random 4-digit code
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpCode(generatedCode);
    setStoredFormData(formData);
    setOtpSent(true);
  };

  const handleVerifyOTP = async () => {
    if (userOtpInput !== otpCode) {
      setError("Invalid OTP verification code. Please check and try again.");
      return;
    }

    if (!storedFormData) return;

    setLoading(true);
    setError(null);

    const res = await registerUser(storedFormData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1500);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Logo showText={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Join Synapse to master your study notes with AI flashcards & spaced repetition.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-500 animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-500 text-center space-y-1 animate-fade-in">
              <CheckCircle2 className="h-6 w-6 mx-auto" />
              <p className="font-bold text-sm">Account Created!</p>
              <p className="text-muted-foreground text-[11px]">Redirecting you to login...</p>
            </div>
          )}

          {!success && !otpSent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Alex Smith"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-500" />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-indigo-500" />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {otpSent && !success && (
            <div className="space-y-4">
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs text-center leading-relaxed">
                <p className="font-semibold text-foreground">Verification Code Sent!</p>
                <p className="text-muted-foreground mt-1">
                  We've sent a 4-digit verification code to your email. Enter it below to complete sign-up.
                </p>
                <div className="mt-3 inline-block rounded-lg bg-indigo-600/10 px-3 py-1.5 font-mono text-[13px] font-bold text-indigo-600 dark:text-indigo-400">
                  Simulated Email OTP: <span className="underline">{otpCode}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="otp" className="text-xs font-bold text-foreground block text-center">
                  Enter 4-Digit Code
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={4}
                  required
                  placeholder="e.g. 1234"
                  value={userOtpInput}
                  onChange={(e) => setUserOtpInput(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center tracking-[1em] font-mono rounded-xl border border-border bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground/45 focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full cursor-pointer rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                <span>Verify & Create Account</span>
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-xs text-muted-foreground hover:text-foreground hover:underline transition"
              >
                Back to Sign Up
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
