'use client';

import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/branding/logo";

export default function AuthNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-zinc-950/60 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8">
          <Logo />

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full cursor-pointer border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-r border-white/10 bg-zinc-950/95 p-6 shadow-2xl transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 space-y-2 text-sm text-zinc-300">
          <a href="/" className="block rounded-xl px-3 py-3 transition hover:bg-white/10 hover:text-white">
            Home
          </a>
          <a href="/dashboard" className="block rounded-xl px-3 py-3 transition hover:bg-white/10 hover:text-white">
            Dashboard
          </a>
          <a href="/login" className="block rounded-xl px-3 py-3 transition hover:bg-white/10 hover:text-white">
            Login
          </a>
        </nav>
      </aside>
    </>
  );
}