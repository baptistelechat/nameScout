// Types principaux pour NameScout

export type AvailabilityStatus = 'available' | 'taken' | 'checking' | 'error';

export type PlatformCategory = 'development' | 'social' | 'stores' | 'domains';

export type CheckMethod = 'status-code' | 'content-parsing' | 'api-official' | 'connectivity-test';

export type PlatformType = 
  // Développement
  | 'github' | 'npm' | 'pypi' | 'crates' | 'dockerhub' | 'homebrew'
  // Réseaux sociaux
  | 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube'
  // Stores
  | 'chrome-store' | 'firefox-addons' | 'vscode-extensions' | 'app-store' | 'play-store'
  // Domaines
  | 'domain-com' | 'domain-net' | 'domain-org' | 'domain-io' | 'domain-dev' | 'domain-fr';

export interface PlatformResult {
  platform: PlatformType;
  category: PlatformCategory;
  name: string;
  status: AvailabilityStatus;
  url?: string;
  error?: string;
  priority?: 'high' | 'medium' | 'low';
  lastChecked?: number;
}

export interface SearchResult {
  searchTerm: string;
  timestamp: number;
  results: PlatformResult[];
  totalChecked: number;
  availableCount: number;
  takenCount: number;
}

export interface SearchHistory {
  searches: SearchResult[];
}

export interface SearchFilters {
  categories: PlatformCategory[];
  status: AvailabilityStatus[];
  priority: ('high' | 'medium' | 'low')[];
}

export interface PlatformConfig {
  type: PlatformType;
  category: PlatformCategory;
  name: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  apiEndpoint?: string;
  checkMethod: CheckMethod;
  rateLimit?: number;
  errorMessages?: {
    fr: string[];
    en: string[];
  };
  timeout?: number;
}

export interface CheckResult {
  status: AvailabilityStatus;
  method: CheckMethod;
  httpStatus?: number;
  responseTime?: number;
  errorMessage?: string;
  detectedLanguage?: 'fr' | 'en';
}

export interface AvailabilityChecker {
  checkByStatusCode: (url: string) => Promise<CheckResult>;
  checkByContentParsing: (url: string, errorMessages: string[]) => Promise<CheckResult>;
  checkByApi: (endpoint: string, params: Record<string, any>) => Promise<CheckResult>;
  checkByConnectivity: (domain: string) => Promise<CheckResult>;
}

// Types pour le localStorage
export interface StoredData {
  version: string;
  history: SearchHistory;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    maxHistoryItems: number;
    defaultFilters: SearchFilters;
    enabledPlatforms: PlatformType[];
    autoSaveResults: boolean;
  };
}

// Types pour les erreurs
export interface AvailabilityErrorType {
  message: string;
  platform: PlatformType;
  errorType: 'timeout' | 'cors' | 'rate-limit' | 'parsing' | 'network';
  retryable: boolean;
}

// Types pour le cache
export interface CacheEntry {
  result: CheckResult;
  timestamp: number;
  ttl: number;
}

// Types pour les hooks
export interface UseSearchState {
  searchTerm: string;
  isSearching: boolean;
  results: PlatformResult[];
  error: string | null;
}

export interface UseFiltersState {
  filters: SearchFilters;
  filteredResults: PlatformResult[];
}

export interface UseHistoryState {
  history: SearchResult[];
  addSearch: (search: SearchResult) => void;
  clearHistory: () => void;
  removeSearch: (timestamp: number) => void;
}

export interface UseThemeState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';
}