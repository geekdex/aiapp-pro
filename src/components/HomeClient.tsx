'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Category, CategoryTabItem, SystemConfig, Tool } from '@/types';
import { CATEGORY_ICON_MAP } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryTabs } from '@/components/CategoryTabs';
import { ToolCard } from '@/components/ToolCard';
import { SearchModal } from '@/components/SearchModal';
import { Footer } from '@/components/Footer';
import { Sparkles, Layers, Search, SlidersHorizontal } from 'lucide-react';

interface HomeClientProps {
  categories: Category[];
  initialTools: Tool[];
  systemConfig?: SystemConfig;
}

export function HomeClient({ categories, initialTools, systemConfig }: HomeClientProps) {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const searchParam = searchParams.get('search');

  const [customSlug, setCustomSlug] = useState<string | null>(null);
  const selectedSlug = customSlug ?? (catParam || 'all');

  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(() => searchParam === 'open');
  const [quickFilter, setQuickFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'newest'>('default');

  // Global Command+K (Mac) and Ctrl+K (Windows/Linux) shortcut listener in capture phase
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const isKeyK = e.key === 'k' || e.key === 'K' || e.code === 'KeyK';

      if (isCmdOrCtrl && isKeyK) {
        e.preventDefault();
        e.stopPropagation();
        setSearchModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  const handleSelectCategory = (slug: string) => {
    setCustomSlug(slug);
    setQuickFilter('');
  };

  // Map category_id to Category name
  const categoryMap = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.data?.name || `分类 ${cat.id}`;
    });
    return map;
  }, [categories]);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    initialTools.forEach((tool) => {
      const catId = tool.data?.category_id;
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
      }
    });
    return counts;
  }, [initialTools]);

  // Format Category Tabs
  const categoryTabItems: CategoryTabItem[] = useMemo(() => {
    return categories.map((cat) => {
      const slug = cat.data?.slug || `cat-${cat.id}`;
      return {
        id: cat.id,
        name: cat.data?.name || '未命名分类',
        slug,
        icon: CATEGORY_ICON_MAP[slug] || '🔖',
        count: categoryCounts[cat.id] || 0,
      };
    });
  }, [categories, categoryCounts]);

  // Map category slug to id
  const slugToIdMap = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      const slug = cat.data?.slug || `cat-${cat.id}`;
      map[slug] = cat.id;
    });
    return map;
  }, [categories]);

  // Filter tools based on selected category & quickFilter
  const filteredTools = useMemo(() => {
    let result = initialTools;

    if (selectedSlug !== 'all') {
      const catId = slugToIdMap[selectedSlug];
      if (catId) {
        result = result.filter((t) => t.data?.category_id === catId);
      }
    }

    if (quickFilter.trim()) {
      const q = quickFilter.toLowerCase().trim();
      result = result.filter((t) => {
        const title = (t.data?.title || '').toLowerCase();
        const desc = (t.data?.description || '').toLowerCase();
        const badge = (t.data?.badge || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || badge.includes(q);
      });
    }

    // Sort
    if (sortBy === 'name') {
      result = [...result].sort((a, b) => (a.data?.title || '').localeCompare(b.data?.title || ''));
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [selectedSlug, initialTools, slugToIdMap, quickFilter, sortBy]);

  const activeCategoryName = useMemo(() => {
    if (selectedSlug === 'all') return '全部 AI 工具';
    const cat = categories.find((c) => (c.data?.slug || `cat-${c.id}`) === selectedSlug);
    return cat ? `${cat.data?.name}` : '工具列表';
  }, [selectedSlug, categories]);

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-[#06080e] text-slate-900 dark:text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:bg-indigo-500/30 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Background ambient grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-60 z-0" />

      {/* Ambient glowing orbs */}
      <div className="bg-ambient-orb-1" />
      <div className="bg-ambient-orb-2" />
      <div className="bg-ambient-orb-3" />

      {/* Navbar */}
      <Navbar onOpenSearch={() => setSearchModalOpen(true)} />

      {/* Hero Section */}
      <Hero
        totalTools={initialTools.length}
        onOpenSearch={() => setSearchModalOpen(true)}
        onSelectCategory={(slug) => {
          handleSelectCategory(slug);
          const el = document.getElementById('categories');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Category Tabs */}
      <CategoryTabs
        categories={categoryTabItems}
        selectedSlug={selectedSlug}
        onSelect={handleSelectCategory}
      />

      {/* Main Tool Grid Section */}
      <main className="flex-1 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-10 w-full relative z-10">
        {/* Section Header & In-page Filter */}
        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs shrink-0">
              <Layers className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>{activeCategoryName}</span>
                <span className="rounded-full bg-slate-200/70 dark:bg-white/[0.08] px-2 py-0.5 text-xs font-mono text-indigo-600 dark:text-indigo-300 border border-slate-300/60 dark:border-white/[0.06]">
                  {filteredTools.length} 款
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                点击工具卡片查看详情与实操指南，或直接直达官方网站
              </p>
            </div>
          </div>

          {/* Quick Search & Sort Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex items-center w-full sm:w-60">
              <Search className="h-3.5 w-3.5 absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="快速筛选当前工具..."
                value={quickFilter}
                onChange={(e) => setQuickFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] pl-9 pr-7 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-indigo-500/50 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none transition-all shadow-xs min-h-[38px]"
              />
              {quickFilter && (
                <button
                  type="button"
                  onClick={() => setQuickFilter('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer p-1"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-1 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] p-1 text-xs shadow-xs min-h-[38px]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 ml-1.5 mr-0.5 hidden sm:inline" />
              <button
                type="button"
                onClick={() => setSortBy('default')}
                className={`flex-1 sm:flex-initial rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer text-center ${
                  sortBy === 'default'
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                推荐
              </button>
              <button
                type="button"
                onClick={() => setSortBy('newest')}
                className={`flex-1 sm:flex-initial rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer text-center ${
                  sortBy === 'newest'
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                最新
              </button>
              <button
                type="button"
                onClick={() => setSortBy('name')}
                className={`flex-1 sm:flex-initial rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer text-center ${
                  sortBy === 'name'
                    ? 'bg-indigo-600 text-white font-medium shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                字母
              </button>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                categoryName={categoryMap[tool.data?.category_id]}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c101e]/60 p-10 sm:p-16 text-center backdrop-blur-2xl shadow-xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              未找到匹配的 AI 工具
            </h3>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {quickFilter
                ? `未能找到与 “${quickFilter}” 相关的工具，建议尝试其他关键词`
                : '当前分类下暂无已收录的内容，您可以查看其他分类'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {quickFilter && (
                <button
                  type="button"
                  onClick={() => setQuickFilter('')}
                  className="rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-100 dark:bg-white/[0.05] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-all cursor-pointer"
                >
                  清除筛选关键词
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSelectCategory('all')}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                浏览全部工具
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Command/Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onOpen={() => setSearchModalOpen(true)}
        tools={initialTools}
        categoryMap={categoryMap}
      />

      {/* Footer (with compliance filing info) */}
      <Footer systemConfig={systemConfig} />
    </div>
  );
}
