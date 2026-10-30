'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, Theme } from '@/components/ThemeProvider';
import { Sun, Moon, Monitor, Check } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const options: { key: Theme; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'auto',
      label: '自动 (跟随系统)',
      icon: <Monitor className="h-4 w-4" />,
      desc: '默认，依设备系统偏好自适应',
    },
    {
      key: 'light',
      label: '亮色模式',
      icon: <Sun className="h-4 w-4" />,
      desc: '明亮通透，适合白天使用',
    },
    {
      key: 'dark',
      label: '暗色模式',
      icon: <Moon className="h-4 w-4" />,
      desc: '深邃高对比，舒适护眼',
    },
  ];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 hover:border-indigo-500/40 hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm cursor-pointer"
        aria-label="切换色彩主题"
        title={`当前主题：${theme === 'auto' ? '自动' : theme === 'light' ? '亮色' : '暗色'}`}
      >
        {theme === 'auto' ? (
          <Monitor className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
        ) : theme === 'light' ? (
          <Sun className="h-4 w-4 text-amber-500" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-400" />
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 dark:border-white/[0.12] bg-white/95 dark:bg-[#0c0f1c]/95 p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-white/[0.06] mb-1">
            选择外观主题
          </div>
          <div className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = theme === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setTheme(opt.key);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-white border border-indigo-200/80 dark:border-indigo-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={
                        isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                      }
                    >
                      {opt.icon}
                    </span>
                    <div>
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                        {opt.desc}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
