'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, Cpu, BookCheck, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { CategoryTabItem } from '@/types';

interface HeroProps {
  totalTools: number;
  categories: CategoryTabItem[];
  selectedSlug: string;
  onOpenSearch?: () => void;
  onSelectCategory: (slug: string) => void;
}

export function Hero({
  totalTools,
  categories,
  selectedSlug,
  onSelectCategory,
}: HeroProps) {
  const isAllActive = selectedSlug === 'all';

  // Safeguard: Filter out any category with count === 0
  const validCategories = useMemo(() => {
    return categories.filter((c) => typeof c.count !== 'number' || c.count > 0);
  }, [categories]);

  // Collapse threshold for category pills if there are many categories
  const COLLAPSE_THRESHOLD = 9;
  const hasMore = validCategories.length > COLLAPSE_THRESHOLD;
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    return validCategories.slice(COLLAPSE_THRESHOLD).some((c) => c.slug === selectedSlug);
  });

  const displayedCategories =
    isExpanded || !hasMore ? validCategories : validCategories.slice(0, COLLAPSE_THRESHOLD);

  const handleCategoryClick = (slug: string) => {
    onSelectCategory(slug);

    // On mobile screens, smoothly scroll to tools section so user sees updated list
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const el = document.getElementById('tools-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-5 sm:pt-14 sm:pb-8 text-center transition-colors">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-hero pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 z-10">
        {/* Top Tag Pill with Pulsing Dot */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-indigo-500/20 dark:border-indigo-500/30 bg-indigo-50/80 dark:bg-indigo-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-xs backdrop-blur-md mb-3 sm:mb-4 hover:border-indigo-500/50 hover:bg-indigo-100/80 dark:hover:bg-indigo-500/15 transition-all max-w-[95vw]">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="truncate">
            已收录 {totalTools > 0 ? totalTools : '1,150+'} 款前沿 AI 工具与实战指南
          </span>
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400 shrink-0" />
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.25] sm:leading-[1.15]">
          探索全球顶尖{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
            AI 生产力工具
          </span>
          <br /> 与深度实战指南
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl mx-auto px-2">
          精选大语言模型、AI
          编程伙伴、多模态创意与自主智能体，独家提供全流程实战拆解，让前沿技术真正赋能工作与创造。
        </p>

        {/* Key Feature Stats Pills */}
        <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto py-2 px-3 rounded-2xl border border-slate-200/70 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-md shadow-2xs text-xs">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
              <Cpu className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <span>{totalTools > 0 ? `${totalTools}+` : '1,150+'}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              全球严选 AI 工具
            </span>
          </div>
          <div className="flex flex-col items-center border-x border-slate-200/80 dark:border-white/[0.08]">
            <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
              <BookCheck className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              <span>Codelabs</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              全流程拆解指南
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
              <Zap className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>EdgeOne</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              极速毫秒级响应
            </span>
          </div>
        </div>

        {/* Integrated Category Filter Pills */}
        <div
          id="categories"
          className="mt-5 sm:mt-7 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs max-w-3xl mx-auto"
        >
          <span className="flex items-center gap-1 font-medium mr-0.5 text-slate-500 dark:text-slate-400 shrink-0 select-none">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
            热门分类:
          </span>

          {/* "All Tools" Option */}
          <button
            type="button"
            onClick={() => handleCategoryClick('all')}
            className={`group inline-flex items-center gap-1 sm:gap-1.5 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs transition-all duration-200 cursor-pointer min-h-[32px] sm:min-h-[34px] select-none active:scale-95 ${
              isAllActive
                ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-medium shadow-md shadow-indigo-500/25 ring-1 ring-white/20 scale-[1.02]'
                : 'border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-50/70 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-300 shadow-2xs'
            }`}
          >
            <Sparkles
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                isAllActive ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'
              }`}
            />
            <span>全部</span>
            {totalTools > 0 && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-mono transition-colors ${
                  isAllActive
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-slate-100 dark:bg-white/[0.08] text-slate-500 dark:text-slate-400'
                }`}
              >
                {totalTools}
              </span>
            )}
          </button>

          {/* Dynamic Category Chips (only non-empty categories) */}
          {displayedCategories.map((cat) => {
            const isActive = selectedSlug === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(isActive ? 'all' : cat.slug)}
                className={`group inline-flex items-center gap-1 sm:gap-1.5 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs transition-all duration-200 cursor-pointer min-h-[32px] sm:min-h-[34px] select-none active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-medium shadow-md shadow-indigo-500/25 ring-1 ring-white/20 scale-[1.02]'
                    : 'border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-50/70 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-300 shadow-2xs'
                }`}
              >
                <span className="text-xs">{cat.icon || '🔖'}</span>
                <span>{cat.name}</span>
                {typeof cat.count === 'number' && cat.count > 0 && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-mono transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-slate-100 dark:bg-white/[0.08] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Expand / Collapse Button if many categories */}
          {hasMore && (
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1 rounded-xl border border-dashed border-slate-300 dark:border-white/[0.12] bg-white/60 dark:bg-white/[0.02] px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all cursor-pointer min-h-[32px] sm:min-h-[34px]"
            >
              <span>{isExpanded ? '收起' : `更多 (${validCategories.length - COLLAPSE_THRESHOLD})`}</span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
