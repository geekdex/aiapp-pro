import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { NavigationProgressBar } from '@/components/NavigationProgressBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#06080e' },
  ],
};

export const metadata: Metadata = {
  title: 'AIAPP.PRO - 全球 AI 工具导航与深度实战指南',
  description: '汇聚全球顶尖 AI 工具、大语言模型与智能体应用，提供深度实战指南与评测。',
};

// Inline script to prevent theme flash (FOUC)
const themeInitializerScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme') || 'auto';
    var isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    root.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#06080e] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 w-full max-w-full overflow-x-clip">
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
