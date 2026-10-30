'use client';

import React from 'react';
import { CategoryTabItem } from '@/types';
import { Sparkles } from 'lucide-react';

interface CategoryTabsProps {
  categories: CategoryTabItem[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
}

export function CategoryTabs({ categories, selectedSlug, onSelect }: CategoryTabsProps) {
  const isAllActive = selectedSlug === 'all';

  return (
    <div
      id="categories"
      className="w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#070913]/90 backdrop-blur-xl sticky top-16 z-30 py-2.5 sm:py-3 shadow-sm dark:shadow-lg dark:shadow-black/20 transition-colors duration-200"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 -mx-1 px-1">
          {/* 'All' Tab */}
          <button
            type="button"
            onClick={() => onSelect('all')}
            className={`group flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shrink-0 min-h-[38px] active:scale-95 ${
              isAllActive
                ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 ring-1 ring-white/25 scale-[1.02]'
                : 'border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-indigo-500/30 hover:bg-slate-100 dark:hover:bg-white/[0.07] hover:text-slate-900 dark:hover:text-white shadow-2xs'
            }`}
          >
            <Sparkles
              className={`h-3.5 w-3.5 ${isAllActive ? 'text-white' : 'text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform'}`}
            />
            <span>全部工具</span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const isActive = selectedSlug === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.slug)}
                className={`group flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shrink-0 min-h-[38px] active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 ring-1 ring-white/25 scale-[1.02]'
                    : 'border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-indigo-500/30 hover:bg-slate-100 dark:hover:bg-white/[0.07] hover:text-slate-900 dark:hover:text-white shadow-2xs'
                }`}
              >
                <span className="text-xs sm:text-sm">{cat.icon || '🔖'}</span>
                <span>{cat.name}</span>
                {typeof cat.count === 'number' && cat.count > 0 && (
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-mono transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-slate-100 dark:bg-white/[0.07] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
