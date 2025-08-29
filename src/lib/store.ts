import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  SearchResult,
  PlatformResult,
  SearchFilters,
  PlatformCategory,
  AvailabilityStatus,
  PlatformType
} from '@/types';

// Store principal pour l'état de l'application
interface AppState {
  // État de la recherche
  searchTerm: string;
  isSearching: boolean;
  currentResults: PlatformResult[];
  searchError: string | null;
  
  // Historique des recherches
  searchHistory: SearchResult[];
  
  // Filtres
  filters: SearchFilters;
  
  // Thème
  theme: 'light' | 'dark' | 'system';
  
  // Préférences
  preferences: {
    maxHistoryItems: number;
    enabledPlatforms: PlatformType[];
    autoSaveResults: boolean;
  };
  
  // Actions de recherche
  setSearchTerm: (term: string) => void;
  setIsSearching: (searching: boolean) => void;
  setCurrentResults: (results: PlatformResult[]) => void;
  updatePlatformResult: (platform: PlatformType, result: Partial<PlatformResult>) => void;
  setSearchError: (error: string | null) => void;
  clearCurrentSearch: () => void;
  
  // Actions d'historique
  addSearchToHistory: (search: SearchResult) => void;
  removeSearchFromHistory: (timestamp: number) => void;
  clearSearchHistory: () => void;
  
  // Actions de filtres
  setFilters: (filters: Partial<SearchFilters>) => void;
  toggleCategoryFilter: (category: PlatformCategory) => void;
  toggleStatusFilter: (status: AvailabilityStatus) => void;
  resetFilters: () => void;
  
  // Actions de thème
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Actions de préférences
  setPreferences: (preferences: Partial<AppState['preferences']>) => void;
  
  // Utilitaires
  getFilteredResults: () => PlatformResult[];
  getSearchStats: () => { total: number; available: number; taken: number; error: number };
}

const defaultFilters: SearchFilters = {
  categories: ['development', 'domains', 'stores'],
  status: ['available', 'taken', 'error'] // Suppression de 'checking' par défaut
};

const defaultPreferences = {
  maxHistoryItems: 100,
  enabledPlatforms: [
    'github', 'npm', 'domain-com', 'domain-io',
      'pypi', 'crates', 'chrome-store', 'vscode-extensions'
  ] as PlatformType[],
  autoSaveResults: true
};

export const useAppStore = create<AppState>()(persist(
  (set, get) => ({
    // État initial
    searchTerm: '',
    isSearching: false,
    currentResults: [],
    searchError: null,
    searchHistory: [],
    filters: defaultFilters,
    theme: 'system',
    preferences: defaultPreferences,
    
    // Actions de recherche
    setSearchTerm: (term: string) => set({ searchTerm: term }),
    
    setIsSearching: (searching: boolean) => set({ isSearching: searching }),
    
    setCurrentResults: (results: PlatformResult[]) => set({ currentResults: results }),
    
    updatePlatformResult: (platform: PlatformType, result: Partial<PlatformResult>) => {
      const { currentResults } = get();
      const updatedResults = currentResults.map(r => 
        r.platform === platform ? { ...r, ...result } : r
      );
      set({ currentResults: updatedResults });
    },
    
    setSearchError: (error: string | null) => set({ searchError: error }),
    
    clearCurrentSearch: () => set({
      searchTerm: '',
      currentResults: [],
      searchError: null,
      isSearching: false
    }),
    
    // Actions d'historique
    addSearchToHistory: (search: SearchResult) => {
      const { searchHistory, preferences } = get();
      const newHistory = [search, ...searchHistory]
        .slice(0, preferences.maxHistoryItems);
      set({ searchHistory: newHistory });
    },
    
    removeSearchFromHistory: (timestamp: number) => {
      const { searchHistory } = get();
      const newHistory = searchHistory.filter(s => s.timestamp !== timestamp);
      set({ searchHistory: newHistory });
    },
    
    clearSearchHistory: () => set({ searchHistory: [] }),
    
    // Actions de filtres
    setFilters: (newFilters: Partial<SearchFilters>) => {
      const { filters } = get();
      set({ filters: { ...filters, ...newFilters } });
    },
    
    toggleCategoryFilter: (category: PlatformCategory) => {
      const { filters } = get();
      const categories = filters.categories.includes(category)
        ? filters.categories.filter(c => c !== category)
        : [...filters.categories, category];
      set({ filters: { ...filters, categories } });
    },
    
    toggleStatusFilter: (status: AvailabilityStatus) => {
      const { filters } = get();
      const statusFilters = filters.status.includes(status)
        ? filters.status.filter(s => s !== status)
        : [...filters.status, status];
      set({ filters: { ...filters, status: statusFilters } });
    },
    
    resetFilters: () => set({ filters: defaultFilters }),
    
    // Actions de thème
    setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),
    
    // Actions de préférences
    setPreferences: (newPreferences: Partial<AppState['preferences']>) => {
      const { preferences } = get();
      set({ preferences: { ...preferences, ...newPreferences } });
    },
    
    // Utilitaires
    getFilteredResults: () => {
      const { currentResults, filters } = get();
      const filtered = currentResults.filter(result => {
        const categoryMatch = filters.categories.includes(result.category);
        const statusMatch = filters.status.includes(result.status);
        return categoryMatch && statusMatch;
      });
      
      // Trier par statut puis par ordre alphabétique :
      // 1. D'abord les "disponible" par ordre alphabétique
      // 2. Ensuite les "pris" par ordre alphabétique
      // 3. Puis les autres statuts par ordre alphabétique
      return filtered.sort((a, b) => {
        const statusOrder: Record<string, number> = { 'available': 0, 'taken': 1, 'error': 2 };
        const orderA = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 99;
        const orderB = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 99;
        
        // Si même statut, trier par ordre alphabétique du nom de la plateforme
        if (orderA === orderB) {
          return a.platform.localeCompare(b.platform);
        }
        
        return orderA - orderB;
      });
    },
    
    getSearchStats: () => {
      const { currentResults } = get();
      return {
        total: currentResults.length,
        available: currentResults.filter(r => r.status === 'available').length,
        taken: currentResults.filter(r => r.status === 'taken').length,
        error: currentResults.filter(r => r.status === 'error').length
      };
    }
  }),
  {
    name: 'namescout-store',
    partialize: (state) => ({
      searchHistory: state.searchHistory,
      filters: state.filters,
      theme: state.theme,
      preferences: state.preferences
    })
  }
));

// Hook pour obtenir les résultats filtrés
export const useFilteredResults = () => {
  const getFilteredResults = useAppStore(state => state.getFilteredResults);
  return getFilteredResults();
};

// Hook pour les statistiques de recherche
export const useSearchStats = () => {
  const getSearchStats = useAppStore(state => state.getSearchStats);
  return getSearchStats();
};

// Hook pour le thème avec résolution système
export const useTheme = () => {
  const theme = useAppStore(state => state.theme);
  const setTheme = useAppStore(state => state.setTheme);
  
  const resolvedTheme = theme === 'system' 
    ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
    
  return { theme, setTheme, resolvedTheme };
};