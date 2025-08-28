import { ExternalLink, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/platform/PlatformIcon';
import type { PlatformResult } from '@/types';
import { getPlatformUrl } from '@/lib/api';

interface ResultCardProps {
  result: PlatformResult;
  className?: string;
}



// Composant pour l'icône de statut
const StatusIcon = ({ status, className = "h-4 w-4" }: { status: string; className?: string }) => {
  switch (status) {
    case 'available':
      return <CheckCircle className={`${className} text-green-500`} />;
    case 'taken':
      return <XCircle className={`${className} text-red-500`} />;
    case 'checking':
      return <Loader2 className={`${className} text-blue-500 animate-spin`} />;
    case 'error':
      return <AlertCircle className={`${className} text-orange-500`} />;
    default:
      return <AlertCircle className={`${className} text-gray-400`} />;
  }
};

// Composant pour le badge de priorité
const PriorityBadge = ({ priority }: { priority?: 'high' | 'medium' | 'low' }) => {
  if (!priority) return null;
  
  const variants = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  };
  
  const labels = {
    high: 'Priorité haute',
    medium: 'Priorité moyenne',
    low: 'Priorité basse'
  };
  
  return (
    <Badge variant="secondary" className={`text-xs ${variants[priority]}`}>
      {labels[priority]}
    </Badge>
  );
};

export const ResultCard = ({ result, className = '' }: ResultCardProps) => {
  const platformUrl = getPlatformUrl(result.platform, result.name);
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'taken':
        return 'Pris';
      case 'checking':
        return 'Vérification...';
      case 'error':
        return 'Erreur';
      default:
        return 'Inconnu';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 dark:text-green-400';
      case 'taken':
        return 'text-red-600 dark:text-red-400';
      case 'checking':
        return 'text-blue-600 dark:text-blue-400';
      case 'error':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Icône de la plateforme */}
            <div className="flex-shrink-0 mt-0.5">
              <PlatformIcon platform={result.platform as any} size="md" />
            </div>
            
            {/* Informations de la plateforme */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium text-sm truncate">
                  {result.platform.charAt(0).toUpperCase() + result.platform.slice(1).replace('-', ' ')}
                </h3>
                <PriorityBadge priority={result.priority} />
              </div>
              
              {/* Statut */}
              <div className="flex items-center space-x-2 mb-2">
                <StatusIcon status={result.status} />
                <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                  {getStatusText(result.status)}
                </span>
              </div>
              
              {/* URL ou message d'erreur */}
              {result.status === 'taken' && platformUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => window.open(platformUrl, '_blank')}
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Voir
                </Button>
              )}
              
              {result.status === 'error' && result.error && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {result.error}
                </p>
              )}
              
              {result.status === 'available' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✨ Ce nom est disponible !
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Temps de vérification */}
        {result.lastChecked && (
          <div className="mt-3 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Vérifié il y a {Math.round((Date.now() - result.lastChecked) / 1000)}s
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};