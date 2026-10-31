import React from 'react';

export default function ToolDetailLoading() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-[#06080e] text-slate-900 dark:text-slate-100 overflow-x-clip w-full">
      {/* Background ambient grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-60 z-0" />

      {/* Ambient glowing orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="bg-ambient-orb-1" />
        <div className="bg-ambient-orb-2" />
      </div>

      {/* Header skeleton */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#070913]/90 backdrop-blur-xl h-16 flex items-center px-4 sm:px-8 justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
          <div className="h-5 w-28 rounded-lg bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-40 rounded-xl bg-slate-200 dark:bg-white/[0.08] animate-pulse hidden sm:block" />
          <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full relative z-10">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
          <div className="h-4 w-12 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
          <div className="h-4 w-3 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
          <div className="h-4 w-16 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
          <div className="h-4 w-3 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
        </div>

        {/* Tool Hero Header Skeleton */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c101e]/80 p-6 sm:p-8 backdrop-blur-xl shadow-lg mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
              {/* Logo Skeleton */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-slate-200 dark:bg-white/[0.08] animate-pulse shrink-0" />

              {/* Title & Metadata Skeletons */}
              <div className="space-y-3 flex-1 w-full">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-48 rounded-lg bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
                  <div className="h-5 w-16 rounded-md bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
                </div>
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
                <div className="flex items-center gap-4 pt-1">
                  <div className="h-4 w-20 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
                  <div className="h-4 w-28 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
                </div>
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
              <div className="h-11 w-full sm:w-36 rounded-xl bg-indigo-500/20 dark:bg-indigo-500/10 animate-pulse" />
              <div className="h-9 w-full sm:w-36 rounded-xl bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c101e]/80 p-6 sm:p-8 backdrop-blur-xl shadow-md space-y-4 mb-12">
          <div className="h-6 w-40 rounded-lg bg-slate-200 dark:bg-white/[0.08] animate-pulse mb-6" />
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
          <div className="h-4 w-4/6 rounded bg-slate-200 dark:bg-white/[0.08] animate-pulse" />
          <div className="h-32 w-full rounded-xl bg-slate-200 dark:bg-white/[0.08] animate-pulse mt-6" />
        </div>

        {/* Related Tools Skeleton Grid */}
        <div className="pt-4">
          <div className="h-6 w-32 rounded-lg bg-slate-200 dark:bg-white/[0.08] animate-pulse mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c101e]/80 p-4 animate-pulse space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-white/[0.08]" />
                  <div className="h-4 w-24 rounded bg-slate-200 dark:bg-white/[0.08]" />
                </div>
                <div className="h-3 w-full rounded bg-slate-200 dark:bg-white/[0.08]" />
                <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-white/[0.08]" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
