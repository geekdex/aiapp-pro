import { useSyncExternalStore } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert hex color into rgba style
 */
export function hexToRgba(hex?: string, alpha: number = 0.15): string {
  if (!hex || !hex.startsWith('#')) {
    return `rgba(99, 102, 241, ${alpha})`;
  }
  let c = hex.substring(1);
  if (c.length === 3) {
    c = c
      .split('')
      .map((char) => char + char)
      .join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(99, 102, 241, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const emptySubscribe = () => () => {};

/**
 * React hook to get the platform-appropriate shortcut key ('⌘K' or 'Ctrl K')
 * using useSyncExternalStore to avoid SSR hydration mismatch and cascading renders.
 */
export function useShortcutKey(): string {
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      if (typeof navigator === 'undefined') return '⌘K';
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform);
      return isMac ? '⌘K' : 'Ctrl K';
    },
    () => '⌘K'
  );
}
