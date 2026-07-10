import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-slate-200 bg-white p-6 md:block">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Synapse
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              Study dashboard
            </p>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Dashboard
            </Link>

            <Link
              href="/login"
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}
