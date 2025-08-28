import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const themes = [
    {
      value: 'light' as const,
      label: 'Clair',
      icon: Sun,
      description: 'Thème clair'
    },
    {
      value: 'dark' as const,
      label: 'Sombre',
      icon: Moon,
      description: 'Thème sombre'
    },
    {
      value: 'system' as const,
      label: 'Système',
      icon: Monitor,
      description: 'Suivre les préférences système'
    }
  ];
  
  const currentTheme = themes.find(t => t.value === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">Basculer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((themeOption) => {
          const IconComponent = themeOption.icon;
          const isSelected = theme === themeOption.value;
          
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`cursor-pointer ${isSelected ? 'bg-accent' : ''}`}
            >
              <div className="flex items-center space-x-2 w-full">
                <IconComponent className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{themeOption.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {themeOption.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
        
        {/* Indicateur du thème résolu */}
        {resolvedTheme && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground border-t">
            Thème actuel : {resolvedTheme === 'dark' ? '🌙 Sombre' : '☀️ Clair'}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Version simple avec juste un bouton toggle
export function SimpleThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  
  // Afficher une icône par défaut pendant l'hydratation
  if (!resolvedTheme) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="relative"
        disabled
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Chargement du thème...</span>
      </Button>
    );
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">
        Basculer vers le thème {resolvedTheme === 'dark' ? 'clair' : 'sombre'}
      </span>
    </Button>
  );
}

// Version avec animation
export function AnimatedThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  
  // Afficher une icône par défaut pendant l'hydratation
  if (!resolvedTheme) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="relative overflow-hidden"
        disabled
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Chargement du thème...</span>
      </Button>
    );
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="relative overflow-hidden"
    >
      <div className="relative">
        <Sun 
          className={`h-4 w-4 transition-all duration-300 ${
            resolvedTheme === 'dark' 
              ? 'rotate-90 scale-0' 
              : 'rotate-0 scale-100'
          }`} 
        />
        <Moon 
          className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
            resolvedTheme === 'dark' 
              ? 'rotate-0 scale-100' 
              : '-rotate-90 scale-0'
          }`} 
        />
      </div>
      <span className="sr-only">
        Basculer vers le thème {resolvedTheme === 'dark' ? 'clair' : 'sombre'}
      </span>
    </Button>
  );
}