import {
  ApiResponse,
  CategoriesWithCountsData,
  Category,
  PaginatedData,
  SystemConfig,
  Tool,
} from '@/types';
import { FALLBACK_CATEGORIES, FALLBACK_SYSTEM_CONFIG, FALLBACK_TOOLS } from '@/lib/mock-data';

/**
 * Resolve the API base URL strictly from API_URL environment variable.
 * Includes the full path (e.g. http://localhost:8080/api/s/aiapp).
 */
function getApiBaseUrl(): string | null {
  const raw = process.env.API_URL;

  if (!raw || !raw.trim()) {
    return null;
  }

  return raw.trim().replace(/\/+$/, '');
}

/**
 * Resolve the custom Extension API base URL (e.g. http://localhost:8080/api/ext/aiapp).
 */
function getExtApiBaseUrl(): string | null {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return null;
  }

  if (baseUrl.includes('/api/s/')) {
    return baseUrl.replace(/\/api\/s\//, '/api/ext/');
  }

  return `${baseUrl}/ext`;
}

/**
 * API token strictly resolved from API_TOKEN environment variable.
 */
const API_TOKEN = (process.env.API_TOKEN || '').trim();

// Category icon map for beautiful UI badges
export const CATEGORY_ICON_MAP: Record<string, string> = {
  'writer-ai': '✍️',
  'image-ai': '🎨',
  'video-ai': '🎬',
  'productivity-ai': '💼',
  'ai-agents': '🤖',
  'ai-chat-assistant': '💬',
  'ai-programming': '💻',
  'ai-development-platform': '🛠️',
  'design-ai': '📐',
  'audio-ai': '🎵',
  'search-ai': '🔍',
  'ai-learning': '📚',
  'ai-model-training': '🧠',
  'ai-content-detection': '🛡️',
  'ai-prompts': '💡',
};

async function foundryFetch<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return null;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[Foundry API] HTTP ${res.status} on ${path}`);
      return null;
    }

    const json: ApiResponse<T> = await res.json();
    if (json.code !== 0) {
      console.warn(`[Foundry API] Error code ${json.code}: ${json.message}`);
      return null;
    }

    return json.data;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[Foundry API] Failed to reach backend at ${url}: ${(err as Error)?.message || err}`
      );
    }
    return null;
  }
}

async function foundryExtFetch<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  const extBaseUrl = getExtApiBaseUrl();
  if (!extBaseUrl) {
    return null;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${extBaseUrl}${normalizedPath}`;
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    };

    const res = await fetch(url, {
      ...options,
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn(`[Foundry Ext API] HTTP ${res.status} on ${path}`);
      return null;
    }

    const json: ApiResponse<T> = await res.json();
    if (json.code !== 0) {
      console.warn(`[Foundry Ext API] Error code ${json.code}: ${json.message}`);
      return null;
    }

    return json.data;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[Foundry Ext API] Failed to reach backend at ${url}: ${(err as Error)?.message || err}`
      );
    }
    return null;
  }
}

/**
 * Fetch all categories with live tool counts, sorted by sort_order
 */
export async function getCategories(): Promise<Category[]> {
  // 1. Try fetching from custom extension endpoint (/api/ext/aiapp/categories)
  const extData = await foundryExtFetch<CategoriesWithCountsData>('/categories');
  if (extData && extData.categories && extData.categories.length > 0) {
    return extData.categories.map((c) => ({
      id: c.id,
      model_id: 1,
      system_id: 'aiapp',
      model_slug: 'categories',
      count: c.count,
      data: {
        name: c.name,
        slug: c.slug,
        sort_order: c.sort_order,
        count: c.count,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }

  // 2. Fallback to standard AutoCRUD endpoint
  const data = await foundryFetch<PaginatedData<Category>>('/categories?page=1&page_size=100');

  if (!data || !data.items || data.items.length === 0) {
    return FALLBACK_CATEGORIES;
  }

  return [...data.items].sort((a, b) => {
    const orderA = a.data?.sort_order ?? a.id;
    const orderB = b.data?.sort_order ?? b.id;
    return orderA - orderB;
  });
}

/**
 * Fetch tools with pagination, optional category filter, search, and sorting
 */
export async function getTools(
  params: {
    page?: number;
    pageSize?: number;
    categoryId?: number;
    categorySlug?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    fields?: string;
    excludeFields?: string;
  } = {}
): Promise<PaginatedData<Tool>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize || 20));

  const queryParams = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (params.categoryId) queryParams.set('category_id', String(params.categoryId));
  if (params.categorySlug && params.categorySlug !== 'all') {
    queryParams.set('category_slug', params.categorySlug);
  }
  if (params.search && params.search.trim()) {
    queryParams.set('search', params.search.trim());
  }
  if (params.sortBy) queryParams.set('sort_by', params.sortBy);
  if (params.sortOrder) queryParams.set('sort_order', params.sortOrder);

  // Field projection: By default exclude heavy tutorial and video fields from tool listings
  if (params.fields) {
    queryParams.set('fields', params.fields);
  } else if (params.excludeFields) {
    queryParams.set('exclude_fields', params.excludeFields);
  } else {
    queryParams.set('exclude_fields', 'tutorial,video,videoes');
  }

  // 1. Try extension API first
  const extData = await foundryExtFetch<PaginatedData<Tool>>(`/tools?${queryParams.toString()}`);
  if (extData && extData.items) {
    return extData;
  }

  // 2. Fallback to standard AutoCRUD endpoint
  const data = await foundryFetch<PaginatedData<Tool>>(`/tools?${queryParams.toString()}`);

  if (!data || !data.items || data.items.length === 0) {
    const filteredFallback = FALLBACK_TOOLS.filter((t) => {
      if (params.categorySlug && params.categorySlug !== 'all') {
        const cat = FALLBACK_CATEGORIES.find((c) => c.data.slug === params.categorySlug);
        if (cat && t.data.category_id !== cat.id) return false;
      }
      if (params.categoryId && t.data.category_id !== params.categoryId) return false;
      if (params.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        const title = (t.data.title || '').toLowerCase();
        const desc = (t.data.description || '').toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }
      return true;
    });

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      items: filteredFallback.slice(start, end),
      pagination: {
        page,
        page_size: pageSize,
        total: filteredFallback.length,
        total_pages: Math.max(1, Math.ceil(filteredFallback.length / pageSize)),
      },
    };
  }

  return data;
}

/**
 * Check whether a tool possesses a genuine, substantial tutorial
 * (Not empty, not a duplicate of description, and with sufficient tutorial depth)
 */
export function hasValidTutorial(
  data?: { tutorial?: string; description?: string } | null
): boolean {
  if (!data?.tutorial) return false;
  const tut = data.tutorial.trim();
  if (tut.length < 120) return false;
  if (data.description && tut === data.description.trim()) return false;
  return true;
}

/**
 * Fetch a single tool by its ID or slug.
 * Prioritizes the ultra-fast public Extension API endpoint (/api/ext/aiapp/tools/:id),
 * with fallback to AutoCRUD endpoint and local mock data.
 */
export async function getToolById(id: string | number): Promise<Tool | null> {
  // 1. Try public extension API first (fastest, unauthenticated direct DB query)
  const extRecord = await foundryExtFetch<Tool>(`/tools/${id}`);
  if (extRecord && extRecord.data) {
    return extRecord;
  }

  // 2. Fallback to standard AutoCRUD endpoint
  const record = await foundryFetch<Tool>(`/tools/${id}`);
  if (record && record.data) {
    return record;
  }

  // 3. Fallback to mock data if backend is offline
  const numericId = Number(id);
  const fallback = FALLBACK_TOOLS.find((t) => t.id === numericId || t.data?.slug === String(id));
  return fallback || null;
}

/**
 * Get related tools in the same category with minimal network payload
 */
export async function getRelatedTools(
  categoryId: number,
  currentToolId: number,
  limit: number = 4
): Promise<Tool[]> {
  // Fetch only the small targeted subset for the specific category
  const res = await getTools({
    page: 1,
    pageSize: limit + 2,
    categoryId: categoryId || undefined,
  });

  const filtered = res.items.filter((t) => t.id !== currentToolId).slice(0, limit);
  if (filtered.length > 0) {
    return filtered;
  }

  // Fallback to latest tools if current category has no other tools
  const fallbackRes = await getTools({ page: 1, pageSize: limit + 2 });
  return fallbackRes.items.filter((t) => t.id !== currentToolId).slice(0, limit);
}

/**
 * Helper to safely extract string from configuration value
 */
function extractConfigString(val: unknown): string {
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'number') return String(val).trim();
  if (val && typeof val === 'object') {
    if ('value' in val && typeof (val as { value: unknown }).value === 'string') {
      return (val as { value: string }).value.trim();
    }
  }
  return '';
}

/**
 * Fetch system configuration directly from Foundry backend API:
 * GET ${API_URL}/configs (Aggregated key-value JSON)
 * With reliable fallback matching the database records.
 */
export async function getSystemConfig(): Promise<SystemConfig> {
  // Foundry backend endpoint for aggregated configurations: ${API_URL}/configs
  const configs = await foundryFetch<Record<string, unknown>>('/configs');

  // Gracefully handle both camelCase and snake_case keys from backend or fallback
  const icpNo =
    extractConfigString(
      configs?.icpNo ??
        configs?.icp_no ??
        configs?.icp ??
        configs?.icpCode ??
        configs?.icp_code ??
        configs?.ICP_NO ??
        configs?.['icp-no']
    ) || FALLBACK_SYSTEM_CONFIG.icpNo;

  const icpUrl =
    extractConfigString(
      configs?.icpUrl ??
        configs?.icp_url ??
        configs?.icpLink ??
        configs?.icp_link ??
        configs?.ICP_URL ??
        configs?.['icp-url']
    ) || FALLBACK_SYSTEM_CONFIG.icpUrl;

  const psbNo =
    extractConfigString(
      configs?.psbNo ??
        configs?.psb_no ??
        configs?.psb ??
        configs?.policeNo ??
        configs?.police_no ??
        configs?.gonganNo ??
        configs?.gongan_no ??
        configs?.PSB_NO ??
        configs?.['psb-no']
    ) || FALLBACK_SYSTEM_CONFIG.psbNo;

  const psbUrl =
    extractConfigString(
      configs?.psbUrl ??
        configs?.psb_url ??
        configs?.psbLink ??
        configs?.psb_link ??
        configs?.policeUrl ??
        configs?.police_url ??
        configs?.gonganUrl ??
        configs?.gongan_url ??
        configs?.PSB_URL ??
        configs?.['psb-url']
    ) || FALLBACK_SYSTEM_CONFIG.psbUrl;

  const siteName =
    extractConfigString(configs?.siteName ?? configs?.site_name ?? configs?.SITE_NAME) ||
    FALLBACK_SYSTEM_CONFIG.siteName;

  const siteUrl =
    extractConfigString(configs?.siteUrl ?? configs?.site_url ?? configs?.SITE_URL) ||
    FALLBACK_SYSTEM_CONFIG.siteUrl;

  return {
    icpNo: icpNo || undefined,
    icpUrl: icpUrl || undefined,
    psbNo: psbNo || undefined,
    psbUrl: psbUrl || undefined,
    siteName: siteName || undefined,
    siteUrl: siteUrl || undefined,
  };
}
