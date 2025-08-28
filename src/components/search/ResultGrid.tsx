import { useMemo } from 'react';
import { ResultCard } from './ResultCard';
import { useAppStore, useFilteredResults } from '@/lib/store';
import { PLATFORM_CATEGORIES } from '@/lib/platforms';
import type { PlatformCategory } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Composant pour les statistiques de recherche
const SearchStats = () => {
  const { currentResults, isSearching } = useAppStore();
  
  const stats = useMemo(() => {
    const total = currentResults.length;
    const available = currentResults.filter(r => r.status === 'available').length;
    const taken = currentResults.filter(r => r.status === 'taken').length;
    const checking = currentResults.filter(r => r.status === 'checking').length;
    const error = currentResults.filter(r => r.status === 'error').length;
    
    return { total, available, taken, checking, error };
  }, [currentResults]);
  
  if (!currentResults.length && !isSearching) return null;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-muted-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </div>
          <div className="text-sm text-muted-foreground">Disponibles</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <XCircle className="h-4 w-4 text-red-500" />
            <div className="text-2xl font-bold text-red-600">{stats.taken}</div>
          </div>
          <div className="text-sm text-muted-foreground">Pris</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
            <div className="text-2xl font-bold text-blue-600">{stats.checking}</div>
          </div>
          <div className="text-sm text-muted-foreground">En cours</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <div className="text-2xl font-bold text-orange-600">{stats.error}</div>
          </div>
          <div className="text-sm text-muted-foreground">Erreurs</div>
        </CardContent>
      </Card>
    </div>
  );
};

// Composant pour les skeletons de chargement
const ResultSkeleton = () => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-5 w-5 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Composant pour une section de catégorie
interface CategorySectionProps {
  category: PlatformCategory;
  results: any[];
  isSearching: boolean;
}

const CategorySection = ({ category, results, isSearching }: CategorySectionProps) => {
  const categoryInfo = PLATFORM_CATEGORIES[category];
  const categoryResults = results.filter(r => r.category === category);
  
  if (!categoryResults.length && !isSearching) return null;
  
  const availableCount = categoryResults.filter(r => r.status === 'available').length;
  const takenCount = categoryResults.filter(r => r.status === 'taken').length;
  const checkingCount = categoryResults.filter(r => r.status === 'checking').length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">{categoryInfo.name}</h2>
          <Badge variant="outline" className="text-xs">
            {categoryResults.length} plateformes
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          {availableCount > 0 && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {availableCount} disponibles
            </Badge>
          )}
          {takenCount > 0 && (
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {takenCount} pris
            </Badge>
          )}
          {checkingCount > 0 && (
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {checkingCount} en cours
            </Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoryResults.map((result) => (
          <ResultCard key={result.platform} result={result} />
        ))}
        
        {/* Skeletons pour les plateformes en cours de vérification */}
        {isSearching && checkingCount > 0 && (
          Array.from({ length: Math.min(checkingCount, 4) }).map((_, index) => (
            <ResultSkeleton key={`skeleton-${category}-${index}`} />
          ))
        )}
      </div>
    </div>
  );
};

// Composant principal de la grille de résultats
export const ResultGrid = () => {
  const { searchTerm, isSearching, currentResults } = useAppStore();
  const filteredResults = useFilteredResults();
  
  // Grouper les résultats par catégorie
  const resultsByCategory = useMemo(() => {
    const grouped: Record<PlatformCategory, any[]> = {
      development: [],
      social: [],
      stores: [],
      domains: []
    };
    
    filteredResults.forEach(result => {
      if (grouped[result.category]) {
        grouped[result.category].push(result);
      }
    });
    
    return grouped;
  }, [filteredResults]);
  
  // Si aucune recherche n'a été effectuée
  if (!searchTerm && !isSearching && !currentResults.length) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">Prêt à vérifier un nom ?</h2>
          <p className="text-muted-foreground">
            Entrez un nom dans le champ de recherche ci-dessus pour vérifier sa disponibilité 
            sur plus de 25 plateformes différentes.
          </p>
        </div>
      </div>
    );
  }
  
  // Si une recherche est en cours mais aucun résultat encore
  if (isSearching && !currentResults.length) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-lg font-semibold mb-2">
            Vérification de "{searchTerm}" en cours...
          </h2>
          <p className="text-muted-foreground">
            Nous vérifions la disponibilité sur toutes les plateformes.
          </p>
        </div>
        
        {/* Skeletons par catégorie */}
        {Object.keys(PLATFORM_CATEGORIES).map((category) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <ResultSkeleton key={`skeleton-${category}-${index}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* En-tête avec le terme recherché */}
      {searchTerm && (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            Résultats pour "{searchTerm}"
          </h1>
          {isSearching && (
            <p className="text-muted-foreground flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Vérification en cours...</span>
            </p>
          )}
        </div>
      )}
      
      {/* Statistiques */}
      <SearchStats />
      
      {/* Résultats par catégorie */}
      <div className="space-y-8">
        {(Object.keys(PLATFORM_CATEGORIES) as PlatformCategory[]).map((category) => (
          <CategorySection
            key={category}
            category={category}
            results={resultsByCategory[category]}
            isSearching={isSearching}
          />
        ))}
      </div>
      
      {/* Message si aucun résultat après filtrage */}
      {!isSearching && filteredResults.length === 0 && currentResults.length > 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-lg font-semibold mb-2">Aucun résultat avec ces filtres</h2>
          <p className="text-muted-foreground">
            Essayez de modifier vos filtres pour voir plus de résultats.
          </p>
        </div>
      )}
    </div>
  );
};