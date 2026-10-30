import { ApiResponse, Category, PaginatedData, SystemConfig, Tool } from '@/types';
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
    // Return null if API address is not configured in environment
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
      // Revalidate every 60 seconds (ISR / EdgeOne cache friendly)
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
  } catch {
    // Backend service may not be running locally; will use fallback data
    return null;
  }
}

/**
 * Fetch all categories, sorted by sort_order
 */
export async function getCategories(): Promise<Category[]> {
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
 * Fetch tools with pagination and optional search
 */
export async function getTools(
  params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<PaginatedData<Tool>> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 100;

  const queryParams = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (params.sortBy) queryParams.set('sort_by', params.sortBy);
  if (params.sortOrder) queryParams.set('sort_order', params.sortOrder);

  const data = await foundryFetch<PaginatedData<Tool>>(`/tools?${queryParams.toString()}`);

  if (!data || !data.items || data.items.length === 0) {
    return {
      items: FALLBACK_TOOLS,
      pagination: {
        page: 1,
        page_size: pageSize,
        total: FALLBACK_TOOLS.length,
        total_pages: 1,
      },
    };
  }

  return data;
}

/**
 * Fetch a single tool by its ID
 */
export async function getToolById(id: string | number): Promise<Tool | null> {
  const record = await foundryFetch<Tool>(`/tools/${id}`);
  if (record && record.data) {
    return record;
  }

  const numericId = Number(id);
  const fallback = FALLBACK_TOOLS.find((t) => t.id === numericId || t.data?.slug === String(id));
  return fallback || null;
}

/**
 * Get related tools in the same category
 */
export async function getRelatedTools(
  categoryId: number,
  currentToolId: number,
  limit: number = 6
): Promise<Tool[]> {
  const res = await getTools({ page: 1, pageSize: 60 });
  const filtered = res.items.filter(
    (t) => (t.data?.category_id === categoryId || !categoryId) && t.id !== currentToolId
  );
  if (filtered.length === 0) {
    return res.items.filter((t) => t.id !== currentToolId).slice(0, limit);
  }
  return filtered.slice(0, limit);
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
