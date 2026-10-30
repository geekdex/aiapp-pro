'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Category, CategoryTabItem, Pagination, SystemConfig, Tool } from '@/types';
import { CATEGORY_ICON_MAP } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ToolCard } from '@/components/ToolCard';
import { SearchModal } from '@/components/SearchModal';
import { Footer } from '@/components/Footer';
import {
  Sparkles,
  Layers,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';

interface HomeClientProps {
  categories: Category[];
  initialTools: Tool[];
  initialPagination?: Pagination;
  systemConfig?: SystemConfig;
}

export function HomeClient({
  categories,
  initialTools,
  initialPagination,
  systemConfig,
}: HomeClientProps) {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const searchParam = searchParams.get('search');

  const [customSlug, setCustomSlug] = useState<string | null>(null);
  const selectedSlug = customSlug ?? (catParam || 'all');

  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(() => searchParam === 'open');
  const [quickFilter, setQuickFilter] = useState<string>('');
  const [debouncedFilter, setDebouncedFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'newest'>('default');

  // Tools & Pagination State
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [pagination, setPagination] = useState<Pagination>(() => {
    if (initialPagination) return initialPagination;
    return {
      page: 1,
      page_size: 100,
      total: initialTools.length,
      total_pages: Math.max(1, Math.ceil(initialTools.length / 100)),
    };
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isInitialMount = useRef<boolean>(true);

  // Debounce quick filter input to avoid excessive requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(quickFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [quickFilter]);

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

  // Fetch tools with server-side pagination & filter
  const fetchToolsData = useCallback(
    async (slug: string, page: number, search: string, sort: string) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          page_size: '100',
        });
        if (slug !== 'all') {
          params.set('category_slug', slug);
        }
        if (search.trim()) {
          params.set('search', search.trim());
        }
        if (sort !== 'default') {
          params.set('sort_by', sort);
        }

        const res = await fetch(`/api/tools?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.items) {
            setTools(data.items);
            if (data.pagination) {
              setPagination(data.pagination);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load tools:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Smooth scroll to tools section on page change
  const scrollToToolsSection = () => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById('tools-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Trigger fetch when category, debounced search, or sort changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Skip initial fetch if using default 'all' view with initial tools
      if (selectedSlug === 'all' && !debouncedFilter && sortBy === 'default') {
        return;
      }
    }

    setCurrentPage(1);
    fetchToolsData(selectedSlug, 1, debouncedFilter, sortBy);
  }, [selectedSlug, debouncedFilter, sortBy, fetchToolsData]);

  // Handle Page navigation
  const handleGoToPage = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.total_pages || newPage === currentPage) return;
    setCurrentPage(newPage);
    fetchToolsData(selectedSlug, newPage, debouncedFilter, sortBy);
    scrollToToolsSection();
  };

  const handleNextPage = () => {
    if (currentPage < pagination.total_pages) {
      handleGoToPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handleGoToPage(currentPage - 1);
    }
  };

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

  // Extract counts per category directly from extension API response
  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    categories.forEach((cat) => {
      counts[cat.id] = cat.count ?? cat.data?.count ?? 0;
    });
    return counts;
  }, [categories]);

  // Total tools across all categories
  const totalAllTools = useMemo(() => {
    const sum = Object.values(categoryCounts).reduce((acc, curr) => acc + curr, 0);
    return sum > 0 ? sum : initialPagination?.total || initialTools.length;
  }, [categoryCounts, initialPagination, initialTools.length]);

  // Format Category Tabs (Only include categories with at least 1 tool)
  const categoryTabItems: CategoryTabItem[] = useMemo(() => {
    return categories
      .map((cat) => {
        const slug = cat.data?.slug || `cat-${cat.id}`;
        return {
          id: cat.id,
          name: cat.data?.name || '未命名分类',
          slug,
          icon: CATEGORY_ICON_MAP[slug] || '🔖',
          count: categoryCounts[cat.id] || 0,
        };
      })
      .filter((cat) => (cat.count ?? 0) > 0);
  }, [categories, categoryCounts]);

  const activeCategoryName = useMemo(() => {
    if (selectedSlug === 'all') return '全部 AI 工具';
    const cat = categories.find((c) => (c.data?.slug || `cat-${c.id}`) === selectedSlug);
    return cat ? `${cat.data?.name}` : '工具列表';
  }, [selectedSlug, categories]);

  // Compute pagination page numbers window
  const paginationRange = useMemo(() => {
    const totalPages = pagination.total_pages;
    const current = currentPage;
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (current >= totalPages - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [pagination.total_pages, currentPage]);

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

      {/* Hero Section with Integrated Category Filter */}
      <Hero
        totalTools={totalAllTools}
        categories={categoryTabItems}
        selectedSlug={selectedSlug}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Tool Grid Section */}
      <main
        id="tools-section"
        className="flex-1 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-12 sm:pb-16 w-full relative z-10"
      >
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
                  {pagination.total} 款
                </span>
                {selectedSlug !== 'all' && (
                  <button
                    type="button"
                    onClick={() => handleSelectCategory('all')}
                    className="text-xs font-normal text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5"
                    title="重置为全部工具"
                  >
                    <span>(清除分类)</span>
                  </button>
                )}
                {isLoading && (
                  <Loader2 className="h-4 w-4 text-indigo-500 animate-spin ml-1 inline" />
                )}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                点击工具卡片查看详情与实操指南，或直接直达官方网站 · 每页最多 100 款
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
        {tools.length > 0 ? (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 transition-opacity duration-200 ${
              isLoading ? 'opacity-60' : 'opacity-100'
            }`}
          >
            {tools.map((tool) => (
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

        {/* Pagination & Next Page Navigation */}
        {pagination.total_pages > 1 && (
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 dark:border-white/[0.06] pt-6">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono text-center sm:text-left">
              第 <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentPage}</span> /{' '}
              {pagination.total_pages} 页 · 共 {pagination.total} 款工具 (每页 100 款)
            </div>

            <div className="flex items-center gap-1.5">
              {/* Previous Page Button */}
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage <= 1 || isLoading}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>上一页</span>
              </button>

              {/* Numbered Page Buttons */}
              <div className="hidden xs:flex items-center gap-1">
                {paginationRange.map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 py-1 text-xs text-slate-400 dark:text-slate-600 select-none"
                      >
                        …
                      </span>
                    );
                  }
                  const pageNum = Number(p);
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={`page-${pageNum}`}
                      type="button"
                      onClick={() => handleGoToPage(pageNum)}
                      disabled={isLoading}
                      className={`min-w-[34px] h-[34px] flex items-center justify-center rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                          : 'border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Page Button */}
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= pagination.total_pages || isLoading}
                className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-50/80 dark:bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              >
                <span>下一页</span>
                <ChevronRight className="h-3.5 w-3.5" />
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
        tools={tools}
        categoryMap={categoryMap}
      />

      {/* Footer (with compliance filing info) */}
      <Footer systemConfig={systemConfig} />
    </div>
  );
}
