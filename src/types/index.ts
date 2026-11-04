export interface CategoryData {
  name: string;
  slug?: string;
  sort_order?: number;
  count?: number;
}

export interface Category {
  id: number;
  model_id?: number;
  system_id?: string;
  model_slug?: string;
  sort?: number;
  data: CategoryData;
  created_at?: string;
  updated_at?: string;
  count?: number;
}

export interface CategoryWithCountItem {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  count: number;
}

export interface CategoriesWithCountsData {
  categories: CategoryWithCountItem[];
  total_tools: number;
}

export interface ToolData {
  title: string;
  slug?: string;
  category_id: number;
  website_url: string;
  logo: string;
  badge: string;
  badgeColor?: string;
  description: string;
  tutorial?: string;
}

export interface Tool {
  id: number;
  model_id: number;
  system_id: string;
  model_slug: string;
  sort?: number;
  data: ToolData;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface CategoryTabItem {
  id: number | 'all';
  name: string;
  slug: string;
  icon?: string;
  count?: number;
}

export interface SystemConfig {
  icpNo?: string;
  icpUrl?: string;
  psbNo?: string;
  psbUrl?: string;
  siteName?: string;
  siteUrl?: string;
  siteDescription?: string;
}
