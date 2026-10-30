'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Compass, Menu, X, Layers } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useShortcutKey } from '@/lib/utils';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export function Navbar({ onOpenSearch }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shortcutKey = useShortcutKey();
  const router = useRouter();

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      router.push('/?search=open');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/85 dark:bg-[#070913]/90 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 shadow-md shadow-indigo-500/25 ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">
            <Sparkles className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-white" />
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-0 blur group-hover:opacity-40 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                AIAPP
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  .PRO
                </span>
              </span>
              <span className="rounded-md bg-indigo-500/10 dark:bg-indigo-500/15 px-1.5 py-0.2 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-500/30">
                PRO
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden xs:inline sm:inline">
              全球 AI 工具与实战导航
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
          >
            <Compass className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            探索工具
          </Link>
          <Link
            href="/#categories"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
          >
            <Layers className="h-4 w-4 text-purple-500 dark:text-purple-400" />
            分类索引
          </Link>
        </nav>

        {/* Right Search, ThemeToggle & Action */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={handleSearchClick}
            className="group flex items-center gap-2 sm:gap-2.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100/70 dark:bg-white/[0.04] px-2.5 sm:px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:border-indigo-500/40 hover:bg-slate-200/60 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white transition-all shadow-xs cursor-pointer active:scale-95 min-h-[38px]"
            aria-label="搜索工具"
          >
            <Search className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
            <span className="hidden sm:inline">搜索工具、模型、教程...</span>
            <span className="sm:hidden text-xs font-medium">搜索</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white dark:bg-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] shadow-xs">
              {shortcutKey}
            </kbd>
          </button>

          {/* Theme Switcher Toggle (Auto / Light / Dark) */}
          <ThemeToggle />

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0a0d18]/95 px-4 py-3 backdrop-blur-2xl transition-colors">
          <nav className="flex flex-col gap-1.5">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:bg-slate-200/70"
            >
              <Compass className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
              探索全部工具
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] active:bg-slate-200/70"
            >
              <Layers className="h-4.5 w-4.5 text-purple-500 dark:text-purple-400" />
              分类索引
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
