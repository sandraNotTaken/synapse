import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-4xl font-semibold text-slate-950">Welcome to Synapse</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Track your courses, topics, and review progress in one place.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            View dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
