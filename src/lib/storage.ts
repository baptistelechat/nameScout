import type { StoredData, SearchResult, SearchHistory } from '@/types';

// Version du schéma de données pour les migrations futures
const STORAGE_VERSION = '1.0.0';
const STORAGE_KEY = 'namescout-data';

// Données par défaut
const DEFAULT_DATA: StoredData = {
  version: STORAGE_VERSION,
  history: {
    searches: []
  },
  preferences: {
    theme: 'system',
    maxHistoryItems: 100,
    defaultFilters: {
      categories: ['development', 'domains', 'stores'],
      status: ['available', 'taken', 'error']
    },
    enabledPlatforms: [
      'github', 'npm', 'domain-com', 'domain-io',
      'pypi', 'crates', 'chrome-store', 'vscode-extensions'
    ],
    autoSaveResults: true
  }
};

// Classe pour gérer le localStorage
class StorageManager {
  private data: StoredData;
  
  constructor() {
    this.data = this.loadData();
  }
  
  // Charger les données depuis localStorage
  private loadData(): StoredData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { ...DEFAULT_DATA };
      }
      
      const parsed = JSON.parse(stored) as StoredData;
      
      // Vérifier la version et migrer si nécessaire
      if (parsed.version !== STORAGE_VERSION) {
        return this.migrateData(parsed);
      }
      
      // Fusionner avec les données par défaut pour les nouvelles propriétés
      return this.mergeWithDefaults(parsed);
    } catch (error) {
      console.warn('Erreur lors du chargement des données:', error);
      return { ...DEFAULT_DATA };
    }
  }
  
  // Sauvegarder les données dans localStorage
  private saveData(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }
  
  // Migrer les données d'une ancienne version
  private migrateData(oldData: any): StoredData {
    console.log('Migration des données de la version', oldData.version, 'vers', STORAGE_VERSION);
    
    // Pour l'instant, on repart des données par défaut
    // Dans le futur, on pourra implémenter des migrations spécifiques
    const migrated = { ...DEFAULT_DATA };
    
    // Conserver l'historique si possible
    if (oldData.history?.searches && Array.isArray(oldData.history.searches)) {
      migrated.history.searches = oldData.history.searches.slice(0, 50); // Limiter à 50 entrées
    }
    
    return migrated;
  }
  
  // Fusionner avec les données par défaut
  private mergeWithDefaults(data: StoredData): StoredData {
    return {
      version: STORAGE_VERSION,
      history: {
        searches: data.history?.searches || []
      },
      preferences: {
        ...DEFAULT_DATA.preferences,
        ...data.preferences
      }
    };
  }
  
  // Obtenir toutes les données
  getData(): StoredData {
    return { ...this.data };
  }
  
  // Obtenir l'historique des recherches
  getSearchHistory(): SearchHistory {
    return { ...this.data.history };
  }
  
  // Ajouter une recherche à l'historique
  addSearch(search: SearchResult): void {
    const searches = [search, ...this.data.history.searches]
      .slice(0, this.data.preferences.maxHistoryItems);
    
    this.data.history.searches = searches;
    this.saveData();
  }
  
  // Supprimer une recherche de l'historique
  removeSearch(timestamp: number): void {
    this.data.history.searches = this.data.history.searches
      .filter(search => search.timestamp !== timestamp);
    this.saveData();
  }
  
  // Vider l'historique
  clearHistory(): void {
    this.data.history.searches = [];
    this.saveData();
  }
  
  // Obtenir les préférences
  getPreferences(): StoredData['preferences'] {
    return { ...this.data.preferences };
  }
  
  // Mettre à jour les préférences
  updatePreferences(preferences: Partial<StoredData['preferences']>): void {
    this.data.preferences = {
      ...this.data.preferences,
      ...preferences
    };
    this.saveData();
  }
  
  // Obtenir le thème
  getTheme(): 'light' | 'dark' | 'system' {
    return this.data.preferences.theme;
  }
  
  // Définir le thème
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this.data.preferences.theme = theme;
    this.saveData();
  }
  
  // Exporter toutes les données
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }
  
  // Importer des données
  importData(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as StoredData;
      
      // Valider les données importées
      if (!this.validateImportedData(imported)) {
        throw new Error('Données invalides');
      }
      
      this.data = this.mergeWithDefaults(imported);
      this.saveData();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      return false;
    }
  }
  
  // Valider les données importées
  private validateImportedData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      data.history &&
      Array.isArray(data.history.searches) &&
      data.preferences &&
      typeof data.preferences === 'object'
    );
  }
  
  // Réinitialiser toutes les données
  reset(): void {
    this.data = { ...DEFAULT_DATA };
    this.saveData();
  }
  
  // Obtenir la taille des données stockées
  getStorageSize(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Blob([stored]).size : 0;
    } catch {
      return 0;
    }
  }
  
  // Nettoyer les anciennes données
  cleanup(): void {
    const maxAge = 90 * 24 * 60 * 60 * 1000; // 90 jours
    const cutoff = Date.now() - maxAge;
    
    this.data.history.searches = this.data.history.searches
      .filter(search => search.timestamp > cutoff);
    
    this.saveData();
  }
}

// Instance globale du gestionnaire de stockage
export const storageManager = new StorageManager();

// Hooks pour utiliser le stockage avec React
export const useStorage = () => {
  return {
    getData: () => storageManager.getData(),
    getSearchHistory: () => storageManager.getSearchHistory(),
    addSearch: (search: SearchResult) => storageManager.addSearch(search),
    removeSearch: (timestamp: number) => storageManager.removeSearch(timestamp),
    clearHistory: () => storageManager.clearHistory(),
    getPreferences: () => storageManager.getPreferences(),
    updatePreferences: (prefs: Partial<StoredData['preferences']>) => 
      storageManager.updatePreferences(prefs),
    getTheme: () => storageManager.getTheme(),
    setTheme: (theme: 'light' | 'dark' | 'system') => storageManager.setTheme(theme),
    exportData: () => storageManager.exportData(),
    importData: (data: string) => storageManager.importData(data),
    reset: () => storageManager.reset(),
    getStorageSize: () => storageManager.getStorageSize(),
    cleanup: () => storageManager.cleanup()
  };
};

// Utilitaires pour l'historique
export const searchHistoryUtils = {
  // Rechercher dans l'historique
  searchInHistory: (query: string): SearchResult[] => {
    const history = storageManager.getSearchHistory();
    return history.searches.filter(search => 
      search.searchTerm.toLowerCase().includes(query.toLowerCase())
    );
  },
  
  // Obtenir les recherches récentes
  getRecentSearches: (limit: number = 10): SearchResult[] => {
    const history = storageManager.getSearchHistory();
    return history.searches.slice(0, limit);
  },
  
  // Obtenir les recherches populaires (les plus fréquentes)
  getPopularSearches: (limit: number = 5): { term: string; count: number }[] => {
    const history = storageManager.getSearchHistory();
    const termCounts = new Map<string, number>();
    
    history.searches.forEach(search => {
      const term = search.searchTerm.toLowerCase();
      termCounts.set(term, (termCounts.get(term) || 0) + 1);
    });
    
    return Array.from(termCounts.entries())
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },
  
  // Obtenir les statistiques de l'historique
  getHistoryStats: () => {
    const history = storageManager.getSearchHistory();
    const totalSearches = history.searches.length;
    const uniqueTerms = new Set(history.searches.map(s => s.searchTerm.toLowerCase())).size;
    const avgResultsPerSearch = totalSearches > 0 
      ? history.searches.reduce((sum, s) => sum + s.totalChecked, 0) / totalSearches 
      : 0;
    
    return {
      totalSearches,
      uniqueTerms,
      avgResultsPerSearch: Math.round(avgResultsPerSearch)
    };
  }
};

// Nettoyer automatiquement au chargement
if (typeof window !== 'undefined') {
  // Nettoyer les anciennes données une fois par jour
  const lastCleanup = localStorage.getItem('namescout-last-cleanup');
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  if (!lastCleanup || now - parseInt(lastCleanup) > oneDayMs) {
    storageManager.cleanup();
    localStorage.setItem('namescout-last-cleanup', now.toString());
  }
}