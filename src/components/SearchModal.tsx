'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Tool } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  tools: Tool[];
  categoryMap: Record<number, string>;
}

export function SearchModal({ isOpen, onClose, onOpen, tools, categoryMap }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [remoteResults, setRemoteResults] = useState<Tool[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setQuery('');
    setRemoteResults([]);
    setSelectedIndex(0);
    onClose();
  }, [onClose]);

  // Debounced server search across the full database
  useEffect(() => {
    const trimmed = query.trim();
    if (!isOpen || !trimmed) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/tools?search=${encodeURIComponent(trimmed)}&page_size=15`);
        if (res.ok) {
          const json = await res.json();
          if (json?.items && Array.isArray(json.items)) {
            setRemoteResults(json.items);
          }
        }
      } catch {
        // Fallback to local
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  // Global Esc & keyboard shortcut listener (Mac Command+K & Windows/Linux Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const isKeyK = e.key === 'k' || e.key === 'K' || e.code === 'KeyK';

      if (isCmdOrCtrl && isKeyK) {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen) {
          handleClose();
        } else {
          onOpen?.();
        }
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, handleClose, onOpen]);

  // Filter tools: merge local immediate matches with full database remote results
  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools.slice(0, 8);
    const q = query.toLowerCase().trim();
    const local = tools.filter((t) => {
      const title = (t.data?.title || '').toLowerCase();
      const desc = (t.data?.description || '').toLowerCase();
      const badge = (t.data?.badge || '').toLowerCase();
      const catName = (categoryMap[t.data?.category_id] || '').toLowerCase();
      return title.includes(q) || desc.includes(q) || badge.includes(q) || catName.includes(q);
    });

    const map = new Map<number, Tool>();
    local.forEach((t) => map.set(t.id, t));
    remoteResults.forEach((t) => map.set(t.id, t));
    return Array.from(map.values()).slice(0, 15);
  }, [query, tools, categoryMap, remoteResults]);

  // Handle arrow key navigation & Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length)
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        router.push(`/tool/${filteredTools[selectedIndex].id}`);
        handleClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-3 sm:pt-20 px-2 sm:px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0a0d18] shadow-2xl backdrop-blur-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 transition-colors">
        {/* Search Header */}
        <div className="flex items-center border-b border-slate-200 dark:border-white/[0.08] px-3.5 sm:px-4 py-3 sm:py-3.5 bg-slate-50/60 dark:bg-white/[0.02]">
          <Search className="h-5 w-5 text-indigo-500 dark:text-indigo-400 shrink-0 mr-2.5 sm:mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="搜索 1,150+ 款 AI 工具、功能或分类..."
            className="flex-1 bg-transparent text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white mr-1 cursor-pointer"
              aria-label="清空搜索"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-white/[0.04] px-2.5 py-1 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer min-h-[30px]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[75vh] sm:max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-white/[0.03]">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              const catName = categoryMap[tool.data?.category_id];
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    router.push(`/tool/${tool.id}`);
                    handleClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/40 text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#14192b] p-1.5 flex items-center justify-center">
                      {tool.data?.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tool.data.logo}
                          alt={tool.data.title}
                          className="h-full w-full object-contain rounded"
                        />
                      ) : (
                        <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400">
                          {tool.data?.title?.charAt(0) || 'A'}
                        </span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {tool.data?.title}
                        </span>
                        {catName && (
                          <span className="rounded bg-slate-100 dark:bg-white/[0.06] px-1.5 py-0.2 text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06] hidden xs:inline">
                            {catName}
                          </span>
                        )}
                        {tool.data?.badge && (
                          <span className="rounded bg-indigo-50 dark:bg-indigo-500/15 px-1.5 py-0.2 text-[10px] text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/25">
                            {tool.data.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-lg">
                        {tool.data?.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-300 font-mono">
                        查看 <CornerDownLeft className="h-3 w-3" />
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500">
              未找到与 &quot;{query}&quot; 相关的 AI 工具，建议尝试更换搜索关键词
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-3">
            <span>
              <kbd className="font-mono text-slate-600 dark:text-slate-400">↑↓</kbd> 切换
            </span>
            <span>
              <kbd className="font-mono text-slate-600 dark:text-slate-400">↵</kbd> 查看详情
            </span>
            <span>
              <kbd className="font-mono text-slate-600 dark:text-slate-400">ESC</kbd> 关闭
            </span>
          </div>
          <span className="sm:hidden text-[10px] text-slate-400">点击工具直接查看详情</span>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
            AIAPP.PRO 全球严选
          </span>
        </div>
      </div>
    </div>
  );
}
