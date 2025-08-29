import { Badge } from '@/components/ui/badge';
import type { AvailabilityStatus } from '@/types';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';

interface PlatformBadgeProps {
  status: AvailabilityStatus;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Configuration des badges par statut
const STATUS_BADGE_CONFIG = {
  available: {
    label: 'Disponible',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  taken: {
    label: 'Pris',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800',
    icon: XCircle,
    iconColor: 'text-red-600'
  },
  error: {
    label: 'Erreur',
    variant: 'outline' as const,
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800',
    icon: AlertCircle,
    iconColor: 'text-orange-600'
  }
};

// Tailles de badges
const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5 h-5',
  md: 'text-sm px-2.5 py-0.5 h-6',
  lg: 'text-sm px-3 py-1 h-7'
};

const ICON_SIZES = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4'
};

export const PlatformBadge = ({ 
  status, 
  className = '', 
  showIcon = true, 
  size = 'md' 
}: PlatformBadgeProps) => {
  const config = STATUS_BADGE_CONFIG[status];
  const IconComponent = config.icon;
  const sizeClass = SIZE_CLASSES[size];
  const iconSize = ICON_SIZES[size];
  
  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${sizeClass} ${className} flex items-center gap-1.5 font-medium`}
    >
      {showIcon && (
        <IconComponent 
          className={`${iconSize} ${config.iconColor}`} 
        />
      )}
      <span>{config.label}</span>
    </Badge>
  );
};

// Badge de catégorie
interface CategoryBadgeProps {
  category: 'development' | 'stores' | 'domains';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CATEGORY_CONFIG = {
  development: {
    label: 'Dev',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    emoji: '🔧'
  },

  stores: {
    label: 'Store',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800',
    emoji: '🏪'
  },
  domains: {
    label: 'Domaine',
    className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
    emoji: '🌐'
  }
};

export const CategoryBadge = ({ category, className = '', size = 'sm' }: CategoryBadgeProps) => {
  const config = CATEGORY_CONFIG[category];
  const sizeClass = SIZE_CLASSES[size];
  
  return (
    <Badge 
      variant="outline"
      className={`${config.className} ${sizeClass} ${className} flex items-center gap-1 font-medium`}
    >
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </Badge>
  );
};

// Hook pour obtenir les informations d'un badge
export const useBadgeConfig = (status: AvailabilityStatus) => {
  return STATUS_BADGE_CONFIG[status];
};