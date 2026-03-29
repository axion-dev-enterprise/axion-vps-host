export function MostSoldSkeleton() {
  return (
    <section className="mx-auto mt-20 max-w-[1440px] px-6 md:px-10">
      <div className="mb-10 flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-36 animate-pulse rounded-full bg-slate-200" />
          <div className="h-10 w-56 animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-12 w-44 animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
        <div className="rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-soft">
          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="mx-auto h-[360px] w-[250px] animate-pulse rounded-[2rem] bg-slate-200" />
            <div className="space-y-4">
              <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
              <div className="h-12 w-4/5 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
              <div className="grid gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-28 animate-pulse rounded-[1.4rem] bg-slate-200" />
                ))}
              </div>
              <div className="flex gap-3">
                <div className="h-12 w-48 animate-pulse rounded-full bg-slate-200" />
                <div className="h-12 w-36 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex gap-4 rounded-[1.6rem] border border-white/80 bg-white/90 p-4 shadow-soft">
              <div className="h-[120px] w-[96px] animate-pulse rounded-[1.3rem] bg-slate-200" />
              <div className="flex-1 space-y-3">
                <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="h-5 w-11/12 animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-16 animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
