import { useState } from 'react';
import { Check, ChevronDown, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store';
import type { AvailabilityStatus } from '@/types';

const STATUS_CONFIG = {
  available: {
    label: 'Disponible',
    icon: CheckCircle,
    color: 'text-green-500',
    description: 'Noms disponibles sur ces plateformes'
  },
  taken: {
    label: 'Pris',
    icon: XCircle,
    color: 'text-red-500',
    description: 'Noms déjà utilisés sur ces plateformes'
  },
  checking: {
    label: 'En cours',
    icon: Loader2,
    color: 'text-blue-500',
    description: 'Vérifications en cours'
  },
  error: {
    label: 'Erreur',
    icon: AlertCircle,
    color: 'text-orange-500',
    description: 'Erreurs lors de la vérification'
  }
} as const;

export const StatusFilter = () => {
  const { filters, toggleStatusFilter, resetFilters } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const allStatuses = Object.keys(STATUS_CONFIG) as AvailabilityStatus[];
  const selectedCount = filters.status.length;
  const isAllSelected = selectedCount === allStatuses.length;
  
  const handleToggleAll = () => {
    if (isAllSelected) {
      // Désélectionner tout
      allStatuses.forEach(status => {
        if (filters.status.includes(status)) {
          toggleStatusFilter(status);
        }
      });
    } else {
      // Sélectionner tout
      allStatuses.forEach(status => {
        if (!filters.status.includes(status)) {
          toggleStatusFilter(status);
        }
      });
    }
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {filters.status.includes('available') && (
                <CheckCircle className="h-3 w-3 text-green-500" />
              )}
              {filters.status.includes('taken') && (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
              {filters.status.includes('checking') && (
                <Loader2 className="h-3 w-3 text-blue-500" />
              )}
              {filters.status.includes('error') && (
                <AlertCircle className="h-3 w-3 text-orange-500" />
              )}
            </div>
            <span>Statut</span>
          </div>
          {selectedCount > 0 && selectedCount < allStatuses.length && (
            <Badge 
              variant="secondary" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {selectedCount}
            </Badge>
          )}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Filtrer par statut</span>
          {!isAllSelected && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleAll}
              className="h-6 px-2 text-xs"
            >
              Tout sélectionner
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Option pour tout sélectionner/désélectionner */}
        <DropdownMenuCheckboxItem
          checked={isAllSelected}
          onCheckedChange={handleToggleAll}
          className="font-medium"
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <XCircle className="h-3 w-3 text-red-500" />
              <Loader2 className="h-3 w-3 text-blue-500" />
              <AlertCircle className="h-3 w-3 text-orange-500" />
            </div>
            <span>Tous les statuts</span>
          </div>
          {isAllSelected && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuSeparator />
        
        {/* Options individuelles */}
        {allStatuses.map((status) => {
          const config = STATUS_CONFIG[status];
          const isSelected = filters.status.includes(status);
          const IconComponent = config.icon;
          
          return (
            <DropdownMenuCheckboxItem
              key={status}
              checked={isSelected}
              onCheckedChange={() => toggleStatusFilter(status)}
            >
              <div className="flex items-center space-x-2 flex-1">
                <IconComponent 
                  className={`h-4 w-4 ${config.color} ${status === 'checking' ? 'animate-spin' : ''}`} 
                />
                <div className="flex-1">
                  <div className="font-medium">{config.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>
              </div>
              {isSelected && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuCheckboxItem>
          );
        })}
        
        {/* Raccourcis rapides */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Raccourcis rapides
        </DropdownMenuLabel>
        
        <DropdownMenuCheckboxItem
          checked={filters.status.includes('available') && filters.status.includes('taken') && !filters.status.includes('checking') && !filters.status.includes('error')}
          onCheckedChange={() => {
            // Sélectionner seulement disponible et pris
            const newStatus: AvailabilityStatus[] = ['available', 'taken'];
            // Réinitialiser d'abord
            allStatuses.forEach(s => {
              if (filters.status.includes(s) && !newStatus.includes(s)) {
                toggleStatusFilter(s);
              }
            });
            // Puis ajouter les nouveaux
            newStatus.forEach(s => {
              if (!filters.status.includes(s)) {
                toggleStatusFilter(s);
              }
            });
          }}
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <XCircle className="h-3 w-3 text-red-500" />
            </div>
            <span className="text-sm">Résultats finaux uniquement</span>
          </div>
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuCheckboxItem
          checked={filters.status.includes('available') && !filters.status.includes('taken') && !filters.status.includes('checking') && !filters.status.includes('error')}
          onCheckedChange={() => {
            // Sélectionner seulement disponible
            const newStatus: AvailabilityStatus[] = ['available'];
            // Réinitialiser d'abord
            allStatuses.forEach(s => {
              if (filters.status.includes(s) && !newStatus.includes(s)) {
                toggleStatusFilter(s);
              }
            });
            // Puis ajouter les nouveaux
            newStatus.forEach(s => {
              if (!filters.status.includes(s)) {
                toggleStatusFilter(s);
              }
            });
          }}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-green-500" />
            <span className="text-sm">Disponibles uniquement</span>
          </div>
        </DropdownMenuCheckboxItem>
        
        {/* Actions */}
        {!isAllSelected && selectedCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  resetFilters();
                  setIsOpen(false);
                }}
                className="w-full text-xs"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};