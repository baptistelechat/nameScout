import { NextRequest, NextResponse } from 'next/server';
import type { PlatformResult, SearchResult } from '@/types';
import { getAllPlatforms } from '@/lib/platforms';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: 'Le paramètre "name" est requis' },
        { status: 400 }
      );
    }

    // Validation du nom
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Le nom doit contenir au moins 2 caractères' },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: 'Le nom ne peut pas dépasser 50 caractères' },
        { status: 400 }
      );
    }

    // Caractères autorisés (alphanumériques, tirets, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      return NextResponse.json(
        { error: 'Le nom ne peut contenir que des lettres, chiffres, tirets et underscores' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const platforms = getAllPlatforms();
    const results: PlatformResult[] = [];

    // Vérifier toutes les plateformes en parallèle avec limitation de concurrence
    const concurrencyLimit = 5;
    const chunks = [];
    
    for (let i = 0; i < platforms.length; i += concurrencyLimit) {
      chunks.push(platforms.slice(i, i + concurrencyLimit));
    }

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (config) => {
        try {
          // Appel à l'API route individuelle
          const response = await fetch(
            `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/check/${config.type}?name=${encodeURIComponent(name)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const result = await response.json();
          results.push(result);
          return result;
        } catch (error) {
          const errorResult: PlatformResult = {
            platform: config.type,
            category: config.category,
            name,
            status: 'error',
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            priority: config.priority,
            lastChecked: Date.now()
          };
          
          results.push(errorResult);
          return errorResult;
        }
      });

      await Promise.all(chunkPromises);
      
      // Petite pause entre les chunks pour éviter de surcharger les APIs
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Calculer les statistiques
    const availableCount = results.filter(r => r.status === 'available').length;
    const takenCount = results.filter(r => r.status === 'taken').length;

    const searchResult: SearchResult = {
      searchTerm: name,
      timestamp: startTime,
      results,
      totalChecked: results.length,
      availableCount,
      takenCount
    };

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error('Erreur lors de la vérification globale:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la vérification'
      },
      { status: 500 }
    );
  }
}

// Gestion des requêtes OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}