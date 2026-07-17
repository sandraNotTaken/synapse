"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function DevLoginButton() {
  const [email, setEmail] = useState("esewiosarugue@gmail.com");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await signIn("credentials", {
        email,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error("Sign-in failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-yellow-500/30 bg-yellow-500/5 p-5">
      <h3 className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-yellow-500">
        Development Bypass
      </h3>
      <form onSubmit={handleSignIn} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          placeholder="test@example.com"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-yellow-600/80 hover:bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In with Test Email"}
        </button>
      </form>
    </div>
  );
}
