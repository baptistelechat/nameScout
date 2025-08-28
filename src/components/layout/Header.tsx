'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Info, Search } from 'lucide-react';

export const Header = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo et navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">🔍</div>
              <span className="font-bold text-xl">NameScout</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link href="/" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Recherche</span>
                </Link>
              </Button>
              
              <Button
                variant={isActive('/about') ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link href="/about" className="flex items-center space-x-2">
                  <Info className="h-4 w-4" />
                  <span>À propos</span>
                </Link>
              </Button>
            </nav>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Navigation mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
                <Link href={isActive('/') ? '/about' : '/'}>
                  {isActive('/') ? (
                    <Info className="h-4 w-4" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};