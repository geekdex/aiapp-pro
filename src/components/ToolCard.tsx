'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight, BookOpen } from 'lucide-react';
import { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
  categoryName?: string;
}

export function ToolCard({ tool, categoryName }: ToolCardProps) {
  const [imgError, setImgError] = useState(false);
  const data = tool.data || {};
  const title = data.title || '未命名工具';
  const logo = data.logo;
  const description = data.description || '暂无描述信息';
  const websiteUrl = data.website_url;
  const hasTutorial = Boolean(data.tutorial && data.tutorial.trim().length > 0);

  // Fallback initial letter
  const initial = title.trim().charAt(0) || 'A';

  // Palette generator for avatar background if logo fails
  const initialGradients = [
    'from-indigo-500/20 to-purple-600/20 text-indigo-600 dark:text-indigo-300',
    'from-cyan-500/20 to-blue-600/20 text-cyan-600 dark:text-cyan-300',
    'from-rose-500/20 to-orange-500/20 text-rose-600 dark:text-rose-300',
    'from-emerald-500/20 to-teal-600/20 text-emerald-600 dark:text-emerald-300',
    'from-amber-500/20 to-yellow-600/20 text-amber-600 dark:text-amber-300',
  ];
  const charCode = title.charCodeAt(0) || 0;
  const gradientClass = initialGradients[charCode % initialGradients.length];

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c101e]/80 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-white dark:hover:bg-[#11162a]/95 shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-[0_16px_36px_-12px_rgba(99,102,241,0.2)] h-full">
      {/* Subtle top inner glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-white/10 to-transparent pointer-events-none group-hover:via-indigo-500/40 dark:group-hover:via-indigo-400/30 transition-all" />

      <div>
        {/* Top Header: Logo + Title + Category (Single source of truth for classification, no duplicate badge) */}
        <div className="flex items-center gap-3.5 min-w-0">
          <Link
            href={`/tool/${tool.id}`}
            className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-[#14192b] p-1.5 shadow-2xs group-hover:border-indigo-500/40 transition-colors"
          >
            {logo && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={title}
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-full w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br ${gradientClass} text-base font-bold`}
              >
                {initial}
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              href={`/tool/${tool.id}`}
              className="text-[15px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate block"
              title={title}
            >
              {title}
            </Link>

            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate mt-1">
              {categoryName || 'AI 工具'}
            </span>
          </div>
        </div>

        {/* Description: Fixed 2-line height for strict visual alignment across all cards in the grid */}
        <p className="mt-3.5 text-xs text-slate-600 dark:text-slate-300/85 leading-relaxed line-clamp-2 h-10 overflow-hidden">
          {description}
        </p>
      </div>

      {/* Card Action Footer: Evenly aligned at bottom */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/[0.06] pt-3 text-xs">
        <Link
          href={`/tool/${tool.id}`}
          className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <span>查看详情</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <div className="flex items-center gap-1.5">
          {hasTutorial && (
            <Link
              href={`/tool/${tool.id}#tutorial`}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors border border-indigo-200/60 dark:border-indigo-500/20"
              onClick={(e) => e.stopPropagation()}
              title="查看实操教程"
            >
              <BookOpen className="h-3 w-3" />
              <span>教程</span>
            </Link>
          )}

          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.1] hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200/80 dark:border-white/[0.06]"
              onClick={(e) => e.stopPropagation()}
            >
              <span>访问官网</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
