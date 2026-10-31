'use client';

import React, { useEffect, useState, useRef, useTransition } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [, startTransition] = useTransition();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete progress on route change
  useEffect(() => {
    if (!visible) return;

    const finishTimer = setTimeout(() => {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(hideTimer);
    }, 10);

    return () => clearTimeout(finishTimer);
  }, [pathname, searchParams, visible]);

  // Intercept internal link clicks to trigger progress bar immediately
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find the closest anchor tag
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Ignore external links, new tabs, downloads, or anchor-only links
      if (
        !href ||
        targetAttr === '_blank' ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#')
      ) {
        return;
      }

      // If it's the exact same pathname and search params, ignore
      try {
        const targetUrl = new URL(href, window.location.origin);
        if (
          targetUrl.pathname === window.location.pathname &&
          targetUrl.search === window.location.search
        ) {
          return;
        }
      } catch {
        return;
      }

      // Start progress bar
      if (timerRef.current) clearInterval(timerRef.current);
      setVisible(true);
      setProgress(15);

      startTransition(() => {
        timerRef.current = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              if (timerRef.current) clearInterval(timerRef.current);
              return 90;
            }
            // Slower progress as it nears 90%
            const increment = Math.max(1, (90 - prev) * 0.15);
            return prev + increment;
          });
        }, 120);
      });
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[2.5px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-200 ease-out shadow-[0_0_12px_rgba(99,102,241,0.8)]"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
