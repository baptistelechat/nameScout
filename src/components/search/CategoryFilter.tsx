import { useState } from 'react';
import { Check, ChevronDown, Filter } from 'lucide-react';
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
import { PLATFORM_CATEGORIES } from '@/lib/platforms';
import type { PlatformCategory } from '@/types';

export const CategoryFilter = () => {
  const { filters, toggleCategoryFilter, resetFilters } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const allCategories = Object.keys(PLATFORM_CATEGORIES) as PlatformCategory[];
  const selectedCount = filters.categories.length;
  const isAllSelected = selectedCount === allCategories.length;

  
  const handleToggleAll = () => {
    if (isAllSelected) {
      // Désélectionner tout
      allCategories.forEach(category => {
        if (filters.categories.includes(category)) {
          toggleCategoryFilter(category);
        }
      });
    } else {
      // Sélectionner tout
      allCategories.forEach(category => {
        if (!filters.categories.includes(category)) {
          toggleCategoryFilter(category);
        }
      });
    }
  };
  
  const getCategoryIcon = (category: PlatformCategory) => {
    const icons = {
      development: '🔧',
      social: '📱',
      stores: '🏪',
      domains: '🌐'
    };
    return icons[category];
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="mr-2 h-4 w-4" />
          Catégories
          {selectedCount > 0 && selectedCount < allCategories.length && (
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
          <span>Filtrer par catégorie</span>
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
            <span>🎯</span>
            <span>Toutes les catégories</span>
          </div>
          {isAllSelected && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuCheckboxItem>
        
        <DropdownMenuSeparator />
        
        {/* Options individuelles */}
        {allCategories.map((category) => {
          const categoryInfo = PLATFORM_CATEGORIES[category];
          const isSelected = filters.categories.includes(category);
          
          return (
            <DropdownMenuCheckboxItem
              key={category}
              checked={isSelected}
              onCheckedChange={() => toggleCategoryFilter(category)}
            >
              <div className="flex items-center space-x-2 flex-1">
                <span>{getCategoryIcon(category)}</span>
                <div className="flex-1">
                  <div className="font-medium">{categoryInfo.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {categoryInfo.description}
                  </div>
                </div>
              </div>
              {isSelected && <Check className="ml-2 h-4 w-4" />}
            </DropdownMenuCheckboxItem>
          );
        })}
        
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