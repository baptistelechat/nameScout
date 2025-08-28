import type { PlatformResult, SearchResult, PlatformType } from '@/types';
import { PLATFORM_CONFIGS, getAllPlatforms } from '@/lib/platforms';
import { useAppStore } from '@/lib/store';

// Cache pour éviter les requêtes répétées
interface CacheEntry {
  result: PlatformResult;
  timestamp: number;
  ttl: number;
}

class AvailabilityCache {
  private cache = new Map<string, CacheEntry>();
  
  set(key: string, result: PlatformResult, ttlMinutes: number = 30): void {
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }
  
  get(key: string): PlatformResult | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.result;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  getCacheKey(platform: PlatformType, name: string): string {
    return `${platform}:${name.toLowerCase()}`;
  }
}

export const availabilityCache = new AvailabilityCache();

// Fonction pour vérifier une seule plateforme via API route
export const checkSinglePlatform = async (
  platform: PlatformType,
  name: string
): Promise<PlatformResult> => {
  const config = PLATFORM_CONFIGS[platform];
  const cacheKey = availabilityCache.getCacheKey(platform, name);
  
  // Vérifier le cache d'abord
  const cached = availabilityCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Créer le résultat initial
  const result: PlatformResult = {
    platform,
    category: config.category,
    name,
    status: 'checking',
    lastChecked: Date.now()
  };
  
  try {
    // Appel à l'API route Next.js
    const response = await fetch(`/api/check/${platform}?name=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const apiResult = await response.json();
    
    // Mettre en cache le résultat (sauf les erreurs)
    if (apiResult.status !== 'error') {
      availabilityCache.set(cacheKey, apiResult, 30);
    }
    
    return apiResult;
  } catch (error) {
    return {
      ...result,
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
};

// Fonction pour vérifier toutes les plateformes via API route
export const checkAllPlatforms = async (
  name: string,
  onProgress?: (result: PlatformResult) => void
): Promise<SearchResult> => {
  const startTime = Date.now();
  const platforms = getAllPlatforms();
  
  // Initialiser tous les résultats avec le statut 'checking'
  const initialResults = platforms.map(config => ({
    platform: config.type,
    category: config.category,
    name,
    status: 'checking' as const,
    lastChecked: Date.now()
  }));
  
  // Notifier les résultats initiaux
  if (onProgress) {
    initialResults.forEach(result => onProgress(result));
  }
  
  try {
    // Utiliser l'API route pour vérifier toutes les plateformes
    const response = await fetch(`/api/check/all?name=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const searchResult: SearchResult = await response.json();
    
    // Notifier les résultats finaux
    if (onProgress) {
      searchResult.results.forEach(result => onProgress(result));
    }
    
    return searchResult;
  } catch (error) {
    // En cas d'erreur, retourner les résultats avec des erreurs
    const errorResults = initialResults.map(result => ({
      ...result,
      status: 'error' as const,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }));
    
    if (onProgress) {
      errorResults.forEach(result => onProgress(result));
    }
    
    return {
      searchTerm: name,
      timestamp: startTime,
      results: errorResults,
      totalChecked: errorResults.length,
      availableCount: 0,
      takenCount: 0
    };
  }
};

// Hook pour effectuer une recherche avec gestion d'état
export const useSearch = () => {
  const {
    setIsSearching,
    setCurrentResults,
    updatePlatformResult,
    addSearchToHistory,
    setSearchError,
    preferences
  } = useAppStore();
  
  const performSearch = async (name: string) => {
    if (!name.trim()) {
      setSearchError('Veuillez saisir un nom à vérifier');
      return;
    }
    
    // Validation du nom
    if (name.length < 2) {
      setSearchError('Le nom doit contenir au moins 2 caractères');
      return;
    }
    
    if (name.length > 50) {
      setSearchError('Le nom ne peut pas dépasser 50 caractères');
      return;
    }
    
    // Caractères autorisés (alphanumériques, tirets, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      setSearchError('Le nom ne peut contenir que des lettres, chiffres, tirets et underscores');
      return;
    }
    
    setSearchError(null);
    setIsSearching(true);
    setCurrentResults([]);
    
    try {
      const searchResult = await checkAllPlatforms(
        name,
        (result) => {
          // Mettre à jour le résultat en temps réel
          updatePlatformResult(result.platform, result);
        }
      );
      
      // Sauvegarder dans l'historique si activé
      if (preferences.autoSaveResults) {
        addSearchToHistory(searchResult);
      }
      
    } catch (error) {
      setSearchError(
        error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors de la recherche'
      );
    } finally {
      setIsSearching(false);
    }
  };
  
  return { performSearch };
};

// Fonction utilitaire pour obtenir l'URL d'une plateforme
export const getPlatformUrl = (platform: PlatformType, name: string): string | undefined => {
  const config = PLATFORM_CONFIGS[platform];
  if (!config.apiEndpoint) return undefined;
  
  // Cas spéciaux pour certaines plateformes
  switch (platform) {
    case 'github':
      return `https://github.com/${name}`;
    case 'npm':
      return `https://www.npmjs.com/package/${name}`;
    case 'pypi':
      return `https://pypi.org/project/${name}/`;
    case 'twitter':
      return `https://twitter.com/${name}`;
    case 'instagram':
      return `https://www.instagram.com/${name}`;
    case 'youtube':
      return `https://www.youtube.com/@${name}`;
    default:
      return config.apiEndpoint.replace('{name}', name);
  }
};

// Fonction pour exporter les résultats
export const exportResults = (searchResult: SearchResult, format: 'json' | 'csv' = 'json') => {
  if (format === 'json') {
    const dataStr = JSON.stringify(searchResult, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `namescout-${searchResult.searchTerm}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  } else if (format === 'csv') {
    const headers = ['Platform', 'Category', 'Status', 'URL', 'Error'];
    const rows = searchResult.results.map(result => [
      result.platform,
      result.category,
      result.status,
      result.url || '',
      result.error || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `namescout-${searchResult.searchTerm}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
  }
};