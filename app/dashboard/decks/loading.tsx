export default function DecksLoading() {
  return (
    <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-52 rounded-2xl bg-white/5" />
        <div className="h-4 w-80 rounded-xl bg-white/5" />
      </div>

      {/* Decks Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-white/5 bg-white/5 p-6 h-[200px] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 rounded-full bg-white/5" />
                <div className="h-4 w-16 rounded-xl bg-white/5" />
              </div>
              <div className="h-6 w-3/4 rounded-xl bg-white/5" />
              <div className="h-4 w-1/2 rounded-xl bg-white/5" />
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
              <div className="h-4 w-20 rounded-xl bg-white/5" />
              <div className="h-4 w-4 rounded-full bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
