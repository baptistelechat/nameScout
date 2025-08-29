import type { PlatformType, CheckResult, PlatformResult, PlatformConfig } from '@/types';
import { createAvailabilityChecker } from '@/lib/api/availability-checker';

const availabilityChecker = createAvailabilityChecker();

/**
 * Vérifie la disponibilité d'un nom sur une plateforme spécifique
 * @param name Le nom à vérifier
 * @param platform Le type de plateforme
 * @param config La configuration de la plateforme
 * @returns Le résultat de la vérification
 */
export const checkPlatformAvailability = async (
  name: string,
  platform: PlatformType,
  config: PlatformConfig
): Promise<PlatformResult> => {
  try {
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
        throw new Error(`Méthode de vérification "${config.checkMethod}" non supportée`);
    }

    // Ajouter les informations de la plateforme au résultat
    const platformResult: PlatformResult = {
      platform,
      category: config.category,
      name,
      status: result.status,
      lastChecked: Date.now(),
      url: result.status === 'taken' ? config.apiEndpoint?.replace('{name}', name) : undefined,
      error: result.errorMessage
    };

    return platformResult;
  } catch (error) {
    console.error(`Erreur lors de la vérification de ${platform}:`, error);
    
    return {
      platform,
      category: config.category,
      name,
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      lastChecked: Date.now()
    };
  }
};