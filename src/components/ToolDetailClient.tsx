'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Category, SystemConfig, Tool } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToolCard } from '@/components/ToolCard';
import { CodelabTutorial } from '@/components/CodelabTutorial';
import { SearchModal } from '@/components/SearchModal';
import { hexToRgba } from '@/lib/utils';
import {
  ExternalLink,
  ChevronRight,
  Home,
  Calendar,
  Globe,
  Tag,
  ShieldCheck,
  Share2,
  Sparkles,
  Info,
} from 'lucide-react';

interface ToolDetailClientProps {
  tool: Tool;
  categories: Category[];
  systemConfig?: SystemConfig;
  allTools: Tool[];
  relatedTools: Tool[];
}

export function ToolDetailClient({
  tool,
  categories,
  systemConfig,
  allTools,
  relatedTools,
}: ToolDetailClientProps) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Global Command+K (Mac) / Ctrl+K (Windows/Linux) shortcut listener in capture phase
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

  // Map category_id to Category name
  const categoryMap = useMemo(() => {
    const map: Record<number, string> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.data?.name || `分类 ${cat.id}`;
    });
    return map;
  }, [categories]);

  const data = tool.data;
  const cat = categories.find((c) => c.id === data.category_id);
  const categoryName = cat?.data?.name || 'AI工具';
  const categorySlug = cat?.data?.slug || 'all';

  // Check if tutorial exists and is not empty
  const hasTutorial = Boolean(data.tutorial && data.tutorial.trim().length > 0);

  const badgeColor = data.badgeColor || '#6366f1';
  const badgeBg = hexToRgba(badgeColor, 0.12);
  const badgeBorder = hexToRgba(badgeColor, 0.28);

  const createdDate = tool.created_at
    ? new Date(tool.created_at).toISOString().split('T')[0]
    : '2025-01-01';

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-[#06080e] text-slate-900 dark:text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:bg-indigo-500/30 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Background ambient grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-60 z-0" />

      {/* Ambient glowing orbs */}
      <div className="bg-ambient-orb-1" />
      <div className="bg-ambient-orb-2" />

      {/* Navbar with interactive search modal trigger */}
      <Navbar onOpenSearch={() => setSearchModalOpen(true)} />

      <main className="flex-1 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
            <span>首页</span>
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />
          <Link
            href={`/?cat=${categorySlug}`}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {categoryName}
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />
          <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-none">
            {data.title}
          </span>
        </nav>

        {/* Tool Hero Card */}
        <div className="mb-8 sm:mb-10 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c101e]/80 p-4 sm:p-8 backdrop-blur-2xl shadow-lg dark:shadow-2xl relative overflow-hidden transition-colors">
          {/* Subtle gradient border rim */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            {/* Left: Logo & Metadata */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative flex h-16 w-16 sm:h-24 sm:w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/[0.12] bg-slate-100 dark:bg-[#14192b] p-2 sm:p-3 shadow-md">
                {data.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.logo}
                    alt={data.title}
                    className="h-full w-full object-contain rounded-lg sm:rounded-xl"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-2xl sm:text-3xl font-extrabold text-indigo-500 dark:text-indigo-300">
                    {data.title.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-2 sm:space-y-2.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {data.title}
                  </h1>

                  {data.badge && (
                    <span
                      className="inline-flex items-center rounded-lg px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold border"
                      style={{
                        backgroundColor: badgeBg,
                        borderColor: badgeBorder,
                        color: badgeColor,
                      }}
                    >
                      {data.badge}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" />
                    官方收录
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 max-w-2xl leading-relaxed">
                  {data.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>分类: {categoryName}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>收录时间: {createdDate}</span>
                  </span>
                  {hasTutorial && (
                    <a
                      href="#tutorial"
                      className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-300 hover:underline font-medium"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                      <span>含 Codelabs 深度指南</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Direct Visit Button */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
              {data.website_url && (
                <a
                  href={data.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 active:scale-[0.98] transition-all ring-1 ring-white/15 min-h-[42px]"
                >
                  <Globe className="h-4 w-4" />
                  <span>访问官方网站</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <a
                href={`https://service.weibo.com/share/share.php?url=${encodeURIComponent(`https://aiapp.pro/tool/${tool.id}`)}&title=${encodeURIComponent(`发现了一款超棒的 AI 工具：${data.title} - ${data.description}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white transition-colors min-h-[38px]"
                title="分享链接"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>分享此工具</span>
              </a>
            </div>
          </div>
        </div>

        {/* Codelabs Interactive Tutorial or Tool Overview */}
        {hasTutorial ? (
          <div id="tutorial" className="mb-12 sm:mb-14 scroll-mt-24">
            <CodelabTutorial tutorial={data.tutorial!} toolTitle={data.title} />
          </div>
        ) : (
          <div className="mb-12 sm:mb-14 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c101e]/80 p-5 sm:p-8 backdrop-blur-xl shadow-md dark:shadow-xl transition-colors">
            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-200/80 dark:border-white/[0.08] text-slate-900 dark:text-white">
              <Info className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
              <h2 className="text-base sm:text-lg font-bold">工具概览与简介</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed mb-6">
              {data.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {data.website_url && (
                <a
                  href={data.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all min-h-[40px]"
                >
                  <Globe className="h-4 w-4" />
                  <span>直达官网立即体验</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Related Tools Recommendation */}
        {relatedTools.length > 0 && (
          <section className="mb-12">
            <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>同类热门工具推荐</span>
                  <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {categoryName}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  探索更多与 {data.title} 相似的高效生产力助手
                </p>
              </div>
              <Link
                href={`/?cat=${categorySlug}`}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium w-fit"
              >
                查看该分类全部
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {relatedTools.map((rel) => (
                <ToolCard key={rel.id} tool={rel} categoryName={categoryName} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Global Command/Search Modal on detail page */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onOpen={() => setSearchModalOpen(true)}
        tools={allTools}
        categoryMap={categoryMap}
      />

      {/* Footer */}
      <Footer systemConfig={systemConfig} />
    </div>
  );
}
