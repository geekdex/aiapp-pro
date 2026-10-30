import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ExternalLink } from 'lucide-react';
import { SystemConfig } from '@/types';

interface FooterProps {
  systemConfig?: SystemConfig;
}

export function Footer({ systemConfig }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const icpNo = systemConfig?.icpNo;
  const icpUrl = systemConfig?.icpUrl;
  const psbNo = systemConfig?.psbNo;
  const psbUrl = systemConfig?.psbUrl;

  // 严格显示条件：
  // 1. ICP 备案：icpNo 与 icpUrl 均有值才显示
  const showIcp = Boolean(icpNo?.trim() && icpUrl?.trim());
  // 2. 公安网备案：psbNo 与 psbUrl 均有值才显示
  const showPsb = Boolean(psbNo?.trim() && psbUrl?.trim());

  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-[#05070c] py-8 sm:py-10 text-slate-600 dark:text-slate-400 relative z-10 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: Brand & Bright Foundry Entry */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.06]">
          {/* Brand */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/25">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                AIAPP
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  .PRO
                </span>
              </span>
            </Link>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              全球 AI 工具导航与实战指南社区
            </span>
          </div>

          {/* Simple Bright Foundry Entry */}
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span>本网站基于</span>
            <a
              href="https://github.com/foundkit/foundry"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 px-3.5 py-1 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all ring-1 ring-white/20"
              title="访问 Foundry 开源仓库"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Foundry</span>
              <ExternalLink className="h-3 w-3 text-white/90" />
            </a>
            <span>实现</span>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance Filing Info */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <div>&copy; {currentYear} AIAPP.PRO · 保留所有权利</div>

          {/* 备案信息栏 (符合条件时显示) */}
          {(showIcp || showPsb) && (
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
              {showIcp && (
                <a
                  href={icpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {icpNo}
                </a>
              )}

              {showIcp && showPsb && <span className="text-slate-300 dark:text-slate-700">|</span>}

              {showPsb && (
                <a
                  href={psbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Image
                    src="/psbLogo.png"
                    alt="公安网备"
                    width={16}
                    height={17}
                    className="h-4 w-auto inline-block shrink-0 object-contain"
                  />
                  <span>{psbNo}</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
