import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getToolById, getCategories, getRelatedTools, getSystemConfig } from '@/lib/api';
import { ToolDetailClient } from '@/components/ToolDetailClient';

interface ToolPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { id } = await params;
  const tool = await getToolById(id);

  if (!tool || !tool.data) {
    return {
      title: '工具未找到 - AIAPP.PRO',
    };
  }

  const title = tool.data.title;
  const desc = tool.data.description;

  return {
    title: `${title} - AI 工具详情与使用指南 | AIAPP.PRO`,
    description: desc,
    openGraph: {
      title: `${title} - AIAPP.PRO`,
      description: desc,
      type: 'article',
    },
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { id } = await params;
  const [tool, categories, systemConfig] = await Promise.all([
    getToolById(id),
    getCategories(),
    getSystemConfig(),
  ]);

  if (!tool || !tool.data) {
    notFound();
  }

  // Fetch only the lightweight related tools for this category (4 items)
  const relatedTools = await getRelatedTools(tool.data.category_id, tool.id, 4);

  return (
    <ToolDetailClient
      tool={tool}
      categories={categories}
      systemConfig={systemConfig}
      allTools={relatedTools}
      relatedTools={relatedTools}
    />
  );
}
