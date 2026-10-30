import { NextRequest, NextResponse } from 'next/server';
import { getTools } from '@/lib/api';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('page_size') || '100', 10);
  const categoryIdStr = searchParams.get('category_id');
  const categoryId = categoryIdStr ? parseInt(categoryIdStr, 10) : undefined;
  const categorySlug = searchParams.get('category_slug') || undefined;
  const search = searchParams.get('search') || undefined;
  const sortBy = searchParams.get('sort_by') || undefined;
  const sortOrder = (searchParams.get('sort_order') as 'asc' | 'desc') || undefined;

  const result = await getTools({
    page: isNaN(page) ? 1 : page,
    pageSize: isNaN(pageSize) ? 100 : pageSize,
    categoryId: categoryId && !isNaN(categoryId) ? categoryId : undefined,
    categorySlug,
    search,
    sortBy,
    sortOrder,
  });

  return NextResponse.json(result);
}
