'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getAllPlatforms } from '@/lib/platforms';

export const SearchForm = () => {
  const [inputValue, setInputValue] = useState('');
  const { searchError, setSearchTerm } = useAppStore();
  const {
    setIsSearching,
    setCurrentResults,
    setSearchError,
    isSearching
  } = useAppStore();

  const platformCount = getAllPlatforms().length;

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
      
      const searchResult = await response.json();
      
      // Mettre à jour directement tous les résultats
      setCurrentResults(searchResult.results);
      

      
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSearching) return;
    
    setSearchTerm(inputValue.trim());
    await performSearch(inputValue.trim());
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Validation en temps réel
    if (value && !/^[a-zA-Z0-9_-]*$/.test(value)) {
      // Empêcher la saisie de caractères non autorisés
      return;
    }
  };
  
  const isValid = inputValue.trim().length >= 2 && inputValue.trim().length <= 50;
  
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Entrez le nom à vérifier (ex: monprojet)"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isSearching}
            className="pr-10"
            maxLength={50}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button 
          type="submit" 
          disabled={!isValid || isSearching}
          className="px-6"
        >
          {isSearching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Vérifier
            </>
          )}
        </Button>
      </form>
      
      {/* Messages d'aide et d'erreur */}
      <div className="text-sm space-y-1">
        {searchError && (
          <p className="text-destructive font-medium">
            {searchError}
          </p>
        )}
        
        {!searchError && inputValue && (
          <div className="text-muted-foreground">
            {inputValue.length < 2 && (
              <p>Le nom doit contenir au moins 2 caractères</p>
            )}
            {inputValue.length > 50 && (
              <p>Le nom ne peut pas dépasser 50 caractères</p>
            )}
            {inputValue && !/^[a-zA-Z0-9_-]+$/.test(inputValue) && (
              <p>Seuls les lettres, chiffres, tirets et underscores sont autorisés</p>
            )}
          </div>
        )}
        
        {!inputValue && (
          <p className="text-muted-foreground">
            Vérifiez la disponibilité d'un nom sur {platformCount}+ plateformes : GitHub, npm, réseaux sociaux, domaines...
          </p>
        )}
      </div>
      
      {/* Suggestions rapides */}
      {!inputValue && !isSearching && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Exemples :</span>
          {['monprojet', 'startup2024', 'my-app', 'cool_name'].map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              onClick={() => setInputValue(example)}
              className="text-xs h-7"
            >
              {example}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};