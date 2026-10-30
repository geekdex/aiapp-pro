'use client';

import React, { useState, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ListOrdered,
} from 'lucide-react';

interface CodelabTutorialProps {
  tutorial: string;
  toolTitle: string;
}

interface StepItem {
  id: string;
  title: string;
  content: string;
}

function CodeBlock({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (textRef.current) {
      const codeText = textRef.current.innerText || '';
      navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group my-4">
      {/* On touch/mobile: always visible; on desktop: show on hover */}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2.5 top-2.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 flex items-center gap-1 rounded-md border border-white/20 dark:border-white/10 bg-black/60 dark:bg-white/10 px-2 py-1 text-[11px] text-white hover:bg-black/80 dark:hover:bg-white/20 transition-all backdrop-blur-md cursor-pointer z-10"
        title="复制代码"
        aria-label="复制代码"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-emerald-400" />
            <span className="text-emerald-400">已复制</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span>复制</span>
          </>
        )}
      </button>
      <pre
        ref={textRef}
        {...props}
        className="overflow-x-auto rounded-xl p-3.5 sm:p-4 bg-slate-900 dark:bg-[#090c16] text-slate-100 border border-slate-800 dark:border-white/[0.08] text-xs sm:text-sm max-w-full leading-relaxed"
      >
        {children}
      </pre>
    </div>
  );
}

export function CodelabTutorial({ tutorial, toolTitle }: CodelabTutorialProps) {
  const cleanTutorial = (tutorial || '').trim();

  // Parse markdown into sections based on ## headers
  const steps: StepItem[] = useMemo(() => {
    if (!cleanTutorial) return [];

    // Split by markdown H2 (## )
    const rawSections = cleanTutorial.split(/(?=^##\s+)/m);
    const parsed: StepItem[] = [];

    rawSections.forEach((section, index) => {
      const trimmed = section.trim();
      if (!trimmed) return;

      const lines = trimmed.split('\n');
      const firstLine = lines[0] || '';
      let title = `步骤 ${index + 1}`;

      if (firstLine.startsWith('## ')) {
        title = firstLine.replace('## ', '').trim();
      }

      parsed.push({
        id: `step-${index + 1}`,
        title,
        content: trimmed,
      });
    });

    return parsed;
  }, [cleanTutorial]);

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [mobileStepMenuOpen, setMobileStepMenuOpen] = useState(false);

  const customComponents = {
    pre: CodeBlock,
  };

  // If no tutorial content, do not render
  if (!cleanTutorial) {
    return null;
  }

  // If no H2 headers found, render entire markdown cleanly
  if (steps.length <= 1) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0c101e]/70 p-4 sm:p-8 backdrop-blur-xl shadow-md dark:shadow-xl transition-colors">
        <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200">
          <BookOpen className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            使用指南与实操详解
          </h2>
        </div>
        <div className="codelab-article prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base overflow-x-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
            {cleanTutorial}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  const currentStep = steps[activeStepIndex] || steps[0];

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-[#0b0f1d]/80 backdrop-blur-xl overflow-hidden shadow-lg dark:shadow-2xl transition-colors">
      {/* Codelabs Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50/80 dark:bg-[#101528]/90 px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 dark:border-indigo-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {toolTitle} · Google Codelabs 实操指南
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />约 5 分钟通关
              </span>
              <span>·</span>
              <span>共 {steps.length} 个实操环节</span>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
          <span className="font-mono text-indigo-600 dark:text-indigo-300 font-bold text-xs">
            {activeStepIndex + 1} / {steps.length}
          </span>
          <div className="h-2 w-20 sm:w-28 rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{
                width: `${((activeStepIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Stepper / Dropdown (H5 Optimized) */}
      <div className="lg:hidden border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-100/70 dark:bg-[#080b16]/90 p-2.5">
        <button
          type="button"
          onClick={() => setMobileStepMenuOpen(!mobileStepMenuOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-xs font-medium text-slate-800 dark:text-slate-200 shadow-xs"
        >
          <div className="flex items-center gap-2 truncate mr-2">
            <ListOrdered className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              第 {activeStepIndex + 1} 步:
            </span>
            <span className="truncate">{currentStep.title}</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${
              mobileStepMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Mobile Dropdown Step Selector */}
        {mobileStepMenuOpen && (
          <div className="mt-2 space-y-1 rounded-xl bg-white dark:bg-[#0c101e] border border-slate-200 dark:border-white/[0.08] p-1.5 shadow-lg max-h-60 overflow-y-auto">
            {steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPassed = idx < activeStepIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setMobileStepMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left px-2.5 py-2 rounded-lg text-xs transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    <span
                      className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : isPassed
                            ? 'bg-emerald-500/20 text-emerald-600'
                            : 'bg-slate-200 dark:bg-white/[0.06] text-slate-500'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </span>
                    <span className="truncate">{step.title}</span>
                  </div>
                  {isActive && (
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium shrink-0">
                      当前
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Quick Horizontal Step Pills on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 px-0.5">
          {steps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const isPassed = idx < activeStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : isPassed
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-white dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-white/[0.06]'
                }`}
              >
                <span>{idx + 1}.</span>
                <span className="max-w-[80px] truncate">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout (Desktop Sidebar + Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Desktop Left Step Index Sidebar (Hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-4 border-r border-slate-200/80 dark:border-white/[0.08] bg-slate-50/60 dark:bg-[#080b16]/70 p-4 sm:p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-2">
            学习步骤大纲 (Table of Contents)
          </div>
          <nav className="space-y-1.5">
            {steps.map((step, idx) => {
              const isActive = idx === activeStepIndex;
              const isPassed = idx < activeStepIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-white font-semibold border border-indigo-200 dark:border-indigo-500/40 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-xs'
                          : isPassed
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-200 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                    </span>
                    <span className="truncate">{step.title}</span>
                  </div>

                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 translate-x-0.5'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Active Content Panel */}
        <div className="lg:col-span-8 p-4 sm:p-8 flex flex-col justify-between bg-white/60 dark:bg-[#0d1122]/40">
          <div className="codelab-article prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base overflow-x-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
              {currentStep.content}
            </ReactMarkdown>
          </div>

          {/* Bottom Next/Prev Step Actions */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-200/80 dark:border-white/[0.08] pt-5">
            <button
              type="button"
              disabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              className={`rounded-xl border border-slate-200 dark:border-white/[0.08] px-4 py-2.5 text-xs font-medium transition-colors text-center ${
                activeStepIndex === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-900 dark:hover:text-white cursor-pointer active:scale-95'
              }`}
            >
              ← 上一步
            </button>

            {activeStepIndex < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700 transition-all active:scale-95 cursor-pointer"
              >
                <span>下一步: {steps[activeStepIndex + 1]?.title}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium text-center">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>已通关全部环节！开启您的高效探索</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
