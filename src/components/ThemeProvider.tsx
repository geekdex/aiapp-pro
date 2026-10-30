'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from 'react';

export type Theme = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'auto',
  resolvedTheme: 'dark',
  setTheme: () => {},
});

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('storage', callback);
  window.addEventListener('local-theme-change', callback);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('local-theme-change', callback);
    mediaQuery.removeEventListener('change', callback);
  };
}

function getThemeSnapshot(): Theme {
  try {
    return (localStorage.getItem('theme') as Theme) || 'auto';
  } catch {
    return 'auto';
  }
}

function getServerSnapshot(): Theme {
  return 'auto';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);

  // Determine actual resolved theme (light or dark)
  const isDark =
    theme === 'dark' ||
    (theme === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const resolvedTheme: 'light' | 'dark' = isDark ? 'dark' : 'light';

  // Synchronize DOM classes and attribute with the resolved theme
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    root.setAttribute('data-theme', theme);
  }, [resolvedTheme, theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem('theme', newTheme);
      window.dispatchEvent(new Event('local-theme-change'));
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
