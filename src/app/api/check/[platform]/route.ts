import { NextRequest, NextResponse } from 'next/server';
import type { PlatformType, CheckResult } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/platforms';
import { createAvailabilityChecker } from '@/lib/api/availability-checker';

const availabilityChecker = createAvailabilityChecker();

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const platform = params.platform as PlatformType;

    if (!name) {
      return NextResponse.json(
        { error: 'Le paramètre "name" est requis' },
        { status: 400 }
      );
    }

    if (!PLATFORM_CONFIGS[platform]) {
      return NextResponse.json(
        { error: `Plateforme "${platform}" non supportée` },
        { status: 400 }
      );
    }

    const config = PLATFORM_CONFIGS[platform];
    let result: CheckResult;

    switch (config.checkMethod) {
      case 'status-code': {
        const url = config.apiEndpoint?.replace('{name}', name) || '';
        result = await availabilityChecker.checkByStatusCode(url);
        break;
      }
      
      case 'content-parsing': {
        const url = config.apiEndpoint?.replace('{name}', name) || '';
        const errorMessages = [
          ...(config.errorMessages?.fr || []),
          ...(config.errorMessages?.en || [])
        ];
        result = await availabilityChecker.checkByContentParsing(url, errorMessages);
        break;
      }
      
      case 'api-official': {
        const endpoint = config.apiEndpoint || '';
        const apiParams = { name };
        
        // Paramètres spécifiques pour VS Code Extensions
        if (platform === 'vscode-extensions') {
          const vscodeParams = {
            filters: {
              target: 'Microsoft.VisualStudio.Code',
              criteria: [{
                filterType: 8,
                value: name
              }]
            },
            flags: 914
          };
          result = await availabilityChecker.checkByApi(endpoint, vscodeParams);
        } else {
          result = await availabilityChecker.checkByApi(endpoint, apiParams);
        }
        break;
      }
      
      case 'connectivity-test': {
        const domain = `${name}${config.name}`; // ex: myproject.com
        result = await availabilityChecker.checkByConnectivity(domain);
        break;
      }
      
      default:
        return NextResponse.json(
          { error: `Méthode de vérification "${config.checkMethod}" non supportée` },
          { status: 400 }
        );
    }

    // Ajouter les informations de la plateforme au résultat
    const platformResult = {
      platform,
      category: config.category,
      name,
      status: result.status,
      priority: config.priority,
      lastChecked: Date.now(),
      url: result.status === 'taken' ? config.apiEndpoint?.replace('{name}', name) : undefined,
      error: result.errorMessage,
      responseTime: result.responseTime,
      method: result.method,
      httpStatus: result.httpStatus
    };

    return NextResponse.json(platformResult);
  } catch (error) {
    console.error(`Erreur lors de la vérification de ${params.platform}:`, error);
    
    return NextResponse.json(
      {
        platform: params.platform,
        status: 'error',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        lastChecked: Date.now()
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