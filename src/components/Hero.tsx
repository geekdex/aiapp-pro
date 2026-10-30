'use client';

import React from 'react';
import { Search, Sparkles, TrendingUp, Cpu, BookCheck, Zap } from 'lucide-react';
import { useShortcutKey } from '@/lib/utils';

interface HeroProps {
  totalTools: number;
  onOpenSearch: () => void;
  onSelectCategory?: (slug: string) => void;
}

export function Hero({ totalTools, onOpenSearch, onSelectCategory }: HeroProps) {
  const shortcutKey = useShortcutKey();

  const hotKeywords = [
    { name: '编程开发', slug: 'ai-programming', icon: '💻' },
    { name: '对话助手', slug: 'ai-chat-assistant', icon: '💬' },
    { name: '写作翻译', slug: 'writer-ai', icon: '✍️' },
    { name: '图像设计', slug: 'image-ai', icon: '🎨' },
    { name: '智能体Agent', slug: 'ai-agents', icon: '🤖' },
    { name: '视频生成', slug: 'video-ai', icon: '🎬' },
    { name: '办公效率', slug: 'productivity-ai', icon: '💼' },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-20 sm:pb-20 text-center transition-colors">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial-hero pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-3 sm:px-6 lg:px-8 z-10">
        {/* Top Tag Pill with Pulsing Dot */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-indigo-500/20 dark:border-indigo-500/30 bg-indigo-50/80 dark:bg-indigo-500/10 px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-xs backdrop-blur-md mb-4 sm:mb-6 hover:border-indigo-500/50 hover:bg-indigo-100/80 dark:hover:bg-indigo-500/15 transition-all max-w-[95vw]">
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
        <p className="mt-3.5 sm:mt-5 text-xs sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl mx-auto px-2">
          精选大语言模型、AI
          编程伙伴、多模态创意与自主智能体，独家提供全流程实战拆解，让前沿技术真正赋能工作与创造。
        </p>

        {/* Search Trigger Bar */}
        <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
          <div
            onClick={onOpenSearch}
            className="group relative flex items-center w-full cursor-pointer rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-white/[0.12] bg-white/90 dark:bg-[#0e1222]/80 p-1.5 sm:p-2.5 shadow-lg sm:shadow-2xl backdrop-blur-2xl hover:border-indigo-500/50 hover:bg-white dark:hover:bg-[#12182c] hover:shadow-indigo-500/10 transition-all duration-300 min-h-[48px]"
          >
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600/20 dark:group-hover:bg-indigo-600/30 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
              <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>
            <div className="ml-2.5 sm:ml-3.5 flex-1 text-left text-xs sm:text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors truncate">
              搜索 1,150+ 款工具名称、使用场景、模型或教程...
            </div>
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-white/[0.06] px-2 py-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 shadow-2xs">
              <kbd>{shortcutKey}</kbd>
            </div>
          </div>

          {/* Quick Categories & Hot Tags */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium mr-0.5 text-slate-600 dark:text-slate-400 shrink-0">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              热门领域:
            </span>
            {hotKeywords.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => {
                  onSelectCategory?.(item.slug);
                  const el = document.getElementById('categories');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] px-2 sm:px-2.5 py-1 sm:py-1.5 text-slate-600 dark:text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all active:scale-95 shadow-2xs cursor-pointer min-h-[32px]"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Key Feature Stats Pills */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mx-auto pt-4 border-t border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-slate-400 text-xs">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
                <Cpu className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>1,150+</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                全球严选 AI 工具
              </span>
            </div>
            <div className="flex flex-col items-center border-x border-slate-200 dark:border-white/[0.08]">
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
        </div>
      </div>
    </section>
  );
}
