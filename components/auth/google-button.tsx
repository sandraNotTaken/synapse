"use client";

import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function GoogleButton() {
  async function handleSignIn() {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignIn}
      className="
        group
        relative
        flex
        h-14
        w-full
        cursor-pointer
        items-center
        justify-center
        gap-4
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card/85
        px-6
        font-medium
        text-foreground
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-indigo-500/40
        hover:bg-muted
        hover:shadow-[0_20px_60px_rgba(99,102,241,0.25)]
        active:scale-[0.98]
      "
    >
      {/* Hover Glow */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-indigo-500/10
          via-cyan-400/10
          to-indigo-500/10
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      {/* Google Icon */}
      <FcGoogle className="relative z-10 text-2xl" />

      {/* Text */}
      <span className="relative z-10">
        Continue with Google
      </span>
    </button>
  );
}