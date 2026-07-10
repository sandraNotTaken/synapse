import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-950">Sign in</h1>
          <p className="text-sm leading-6 text-slate-600">
            Use Google to sign in and access your study dashboard.
          </p>
        </div>

        <a
          href="/api/auth/signin/google"
          className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Continue with Google
        </a>

        <p className="mt-6 text-sm text-slate-500">
          Don’t have an account yet? The login flow will create one automatically.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-medium text-slate-700 underline-offset-4 transition hover:underline"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
