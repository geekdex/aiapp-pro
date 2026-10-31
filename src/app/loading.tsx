import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-[#06080e] text-slate-900 dark:text-slate-100 overflow-x-clip w-full">
      {/* Background ambient grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-60 z-0" />

      {/* Main Skeleton */}
      <main className="flex-1 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 w-full relative z-10 space-y-6">
        <div className="flex flex-col items-center justify-center pt-12 pb-8 text-center space-y-4">
          <div className="h-6 w-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 animate-pulse" />
          <div className="h-10 w-96 max-w-full rounded-xl bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
          <div className="h-4 w-72 max-w-full rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
        </div>

        {/* Category Pills Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto py-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-8 w-24 rounded-xl bg-slate-200 dark:bg-white/[0.06] animate-pulse"
            />
          ))}
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pt-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c101e]/80 p-5 space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-white/[0.08]" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-24 rounded bg-slate-200 dark:bg-white/[0.08]" />
                  <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/[0.08]" />
                </div>
              </div>
              <div className="h-3 w-full rounded bg-slate-200 dark:bg-white/[0.08]" />
              <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-white/[0.08]" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
