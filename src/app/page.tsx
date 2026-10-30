import { Suspense } from 'react';
import { Metadata } from 'next';
import { getCategories, getTools, getSystemConfig } from '@/lib/api';
import { HomeClient } from '@/components/HomeClient';

export const metadata: Metadata = {
  title: 'AIAPP.PRO - 全球 AI 工具导航与深度实战指南',
  description:
    '汇聚 1,150+ 款全球顶尖 AI 工具、大语言模型与智能体应用，提供 Google Codelabs 风格全流程使用教程与评测，让 AI 真正赋能生产力。',
  keywords: [
    'AI工具导航',
    'AI导航',
    '人工智能软件',
    'ChatGPT',
    'DeepSeek',
    'AI写作',
    'AI绘画',
    'AI编程',
    '智能体',
  ],
  openGraph: {
    title: 'AIAPP.PRO - 全球 AI 工具导航与深度实战指南',
    description: '汇聚 1,150+ 款全球顶尖 AI 工具与深度实战教程。',
    url: 'https://aiapp.pro',
    siteName: 'AIAPP.PRO',
    locale: 'zh_CN',
    type: 'website',
  },
};

// EdgeOne / Next.js ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  // Fetch categories, all tools, and system compliance configs server-side
  const [categories, toolsResult, systemConfig] = await Promise.all([
    getCategories(),
    getTools({ page: 1, pageSize: 2000 }),
    getSystemConfig(),
  ]);

  return (
    <Suspense fallback={null}>
      <HomeClient
        categories={categories}
        initialTools={toolsResult.items}
        systemConfig={systemConfig}
      />
    </Suspense>
  );
}
