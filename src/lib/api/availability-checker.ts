import type { CheckResult, AvailabilityChecker, PlatformType } from '@/types';
import { PLATFORM_CONFIGS } from '@/lib/platforms';

// Classe d'erreur personnalisée pour les vérifications
export class AvailabilityError extends Error {
  constructor(
    message: string,
    public platform: PlatformType,
    public errorType: 'timeout' | 'cors' | 'rate-limit' | 'parsing' | 'network',
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AvailabilityError';
  }
}

// Détection de la langue du contenu
const detectLanguage = (text: string): "fr" | "en" => {
  const frenchWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or'];
  const englishWords = ['the', 'and', 'or', 'but', 'so', 'for', 'nor', 'yet', 'a', 'an', 'in', 'on', 'at'];
  
  const lowerText = text.toLowerCase();
  
  let frenchScore = 0;
  let englishScore = 0;
  
  frenchWords.forEach(word => {
    if (lowerText.includes(word)) frenchScore++;
  });
  
  englishWords.forEach(word => {
    if (lowerText.includes(word)) englishScore++;
  });
  
  return frenchScore > englishScore ? 'fr' : 'en';
};

// Détection des pages de parking/vente de domaines
const isDomainParkingPage = (content: string, url: string): boolean => {
  const lowerContent = content.toLowerCase();
  const lowerUrl = url.toLowerCase();
  
  // Mots-clés indiquant une page de parking/vente
  const parkingKeywords = [
    // Anglais
    'domain for sale', 'buy this domain', 'domain available', 'domain is for sale',
    'parking page', 'domain parking', 'parked domain', 'domain parked',
    'register this domain', 'purchase this domain', 'acquire this domain',
    'domain marketplace', 'premium domain', 'expired domain',
    'this domain may be for sale', 'inquire about this domain',
    'make an offer', 'domain auction', 'buy now',
    
    // Français
    'domaine à vendre', 'ce domaine est à vendre', 'domaine disponible',
    'acheter ce domaine', 'page de parking', 'domaine parqué',
    'enregistrer ce domaine', 'acquérir ce domaine', 'domaine premium',
    'faire une offre', 'vente aux enchères', 'acheter maintenant'
  ];
  
  // Registrars et services de parking connus
  const registrarKeywords = [
    'godaddy', 'namecheap', 'sedo', 'afternic', 'hugedomains',
    'dan.com', 'undeveloped.com', 'parkingcrew', 'domainmarket',
    'flippa', 'brandpa', 'squadhelp', 'brandroot', 'namerific',
    'ovh', 'gandi', 'ionos', '1and1', 'hostinger'
  ];
  
  // Vérifier les mots-clés de parking
  const hasParkingKeywords = parkingKeywords.some(keyword => 
    lowerContent.includes(keyword)
  );
  
  // Vérifier les noms de registrars
  const hasRegistrarKeywords = registrarKeywords.some(registrar => 
    lowerContent.includes(registrar) || lowerUrl.includes(registrar)
  );
  
  // Vérifier les patterns HTML typiques des pages de parking
  const hasParkingPatterns = [
    /<title[^>]*>.*(?:for sale|à vendre|parking|parked).*<\/title>/i,
    /class=["'].*(?:parking|forsale|domain-sale).*["']/i,
    /id=["'].*(?:parking|forsale|domain-sale).*["']/i
  ].some(pattern => pattern.test(content));
  
  // Détecter les redirections vers des services de parking
  const hasRedirectToParking = [
    'sedoparking', 'parkingcrew', 'domainmarket', 'hugedomains'
  ].some(service => lowerUrl.includes(service));
  
  return hasParkingKeywords || hasRegistrarKeywords || hasParkingPatterns || hasRedirectToParking;
};

// Fonction pour détecter les erreurs CORS
const isCorsError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase();
    return message.includes('cors') || 
           message.includes('network error') ||
           message.includes('failed to fetch') ||
           message.includes('net::err_failed') ||
           message.includes('net::err_aborted');
  }
  return false;
};

// Fonction pour gérer les erreurs de vérification
export const handleCheckError = (
  error: unknown,
  platform: PlatformType
): CheckResult => {
  if (error instanceof AvailabilityError) {
    return {
      status: 'error',
      method: PLATFORM_CONFIGS[platform].checkMethod,
      errorMessage: error.message,
      responseTime: 0
    };
  }

  // Gestion spécifique des erreurs CORS
  if (isCorsError(error)) {
    const isDomainCheck = platform.startsWith('domain-');
    const isSocialMedia = false; // Plus de réseaux sociaux supportés
    
    // Pour les domaines, une erreur réseau peut indiquer que le domaine est disponible
    if (isDomainCheck) {
      return {
        status: 'available',
        method: PLATFORM_CONFIGS[platform].checkMethod,
        errorMessage: 'Domaine probablement disponible (erreur réseau)',
        responseTime: 0
      };
    }
    
    // Pour les autres plateformes, on retourne un statut d'erreur mais informatif
    return {
      status: 'error',
      method: PLATFORM_CONFIGS[platform].checkMethod,
      errorMessage: 'Accès bloqué par la plateforme (CORS)',
      responseTime: 0
    };
  }

  // Gestion des erreurs fetch natives (non-CORS)
  if (error instanceof TypeError && error.message.includes('fetch')) {
    const isDomainCheck = platform.startsWith('domain-');
    return {
      status: isDomainCheck ? 'available' : 'error',
      method: PLATFORM_CONFIGS[platform].checkMethod,
      errorMessage: 'Erreur réseau',
      responseTime: 0
    };
  }

  // Timeout
  if (error instanceof DOMException && error.name === 'AbortError') {
    return {
      status: 'error',
      method: PLATFORM_CONFIGS[platform].checkMethod,
      errorMessage: 'Délai d\'attente dépassé',
      responseTime: 0
    };
  }

  // Erreur inconnue
  return {
    status: 'error',
    method: PLATFORM_CONFIGS[platform].checkMethod,
    errorMessage: 'Erreur inconnue',
    responseTime: 0
  };
};

// Retry logic avec backoff exponentiel
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) break;
      
      // Backoff exponentiel avec jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Implémentation du vérificateur de disponibilité
export const createAvailabilityChecker = (): AvailabilityChecker => {
  const checkByStatusCode = async (url: string): Promise<CheckResult> => {
    const startTime = Date.now();
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'NameScout/1.0.0 (Availability Checker)'
        }
      });
      
      return {
        status: response.status === 404 ? 'available' : 'taken',
        method: 'status-code',
        httpStatus: response.status,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      const errorResult = handleCheckError(error, 'github'); // Utilise une plateforme par défaut
      return {
        ...errorResult,
        responseTime: Date.now() - startTime
      };
    }
  };

  const checkByContentParsing = async (
    url: string, 
    errorMessages: string[]
  ): Promise<CheckResult> => {
    const startTime = Date.now();
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: {
          'User-Agent': 'NameScout/1.0.0 (Availability Checker)'
        }
      });
      
      if (response.status === 404) {
        return {
          status: 'available',
          method: 'content-parsing',
          httpStatus: 404,
          responseTime: Date.now() - startTime
        };
      }
      
      const text = await response.text();
      const detectedLanguage = detectLanguage(text);
      
      // Vérifier les messages d'erreur dans la langue détectée
      const hasErrorMessage = errorMessages.some(msg => 
        text.toLowerCase().includes(msg.toLowerCase())
      );
      
      return {
        status: hasErrorMessage ? 'available' : 'taken',
        method: 'content-parsing',
        httpStatus: response.status,
        responseTime: Date.now() - startTime,
        detectedLanguage
      };
    } catch (error) {
      const errorResult = handleCheckError(error, 'github'); // Utilise une plateforme par défaut
      return {
        ...errorResult,
        method: 'content-parsing',
        responseTime: Date.now() - startTime
      };
    }
  };

  const checkByApi = async (
    endpoint: string, 
    params: Record<string, any>
  ): Promise<CheckResult> => {
    const startTime = Date.now();
    try {
      const url = new URL(endpoint);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
      
      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(8000),
        headers: {
          'User-Agent': 'NameScout/1.0.0 (Availability Checker)',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      // Logique spécifique selon l'API
      let isAvailable = false;
      
      // DockerHub API
      if (endpoint.includes('hub.docker.com')) {
        // Pour DockerHub, count: 0 signifie que le nom est disponible
        isAvailable = data.count === 0;
      }
      // VS Code Extensions API
      else if (endpoint.includes('marketplace.visualstudio.com')) {
        isAvailable = !data.results || data.results.length === 0 || 
                     !data.results[0].extensions || data.results[0].extensions.length === 0;
      } else {
        // Logique générique
        isAvailable = data.error || !data.items?.length;
      }
      
      return {
        status: isAvailable ? 'available' : 'taken',
        method: 'api-official',
        httpStatus: response.status,
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      const errorResult = handleCheckError(error, 'github'); // Utilise une plateforme par défaut
      return {
        ...errorResult,
        method: 'api-official',
        responseTime: Date.now() - startTime
      };
    }
  };

  const checkByConnectivity = async (domain: string): Promise<CheckResult> => {
    const startTime = Date.now();
    const url = `https://${domain}`;
    
    try {
      // Faire une requête GET complète pour analyser le contenu
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'NameScout/1.0.0 (Availability Checker)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        // Suivre les redirections pour détecter les services de parking
        redirect: 'follow'
      });
      
      // Si la réponse n'est pas OK, considérer le domaine comme disponible
      if (!response.ok) {
        return {
          status: 'available',
          method: 'connectivity-test',
          httpStatus: response.status,
          responseTime: Date.now() - startTime,
          errorMessage: `HTTP ${response.status}: ${response.statusText}`
        };
      }
      
      // Analyser le contenu pour détecter les pages de parking
      const content = await response.text();
      const finalUrl = response.url; // URL finale après redirections
      
      // Vérifier si c'est une page de parking/vente
      const isParkingPage = isDomainParkingPage(content, finalUrl);
      
      if (isParkingPage) {
        return {
          status: 'available',
          method: 'connectivity-test',
          httpStatus: response.status,
          responseTime: Date.now() - startTime,
          errorMessage: 'Page de parking/vente détectée - domaine disponible'
        };
      }
      
      // Si ce n'est pas une page de parking, le domaine est probablement pris
      return {
        status: 'taken',
        method: 'connectivity-test',
        httpStatus: response.status,
        responseTime: Date.now() - startTime
      };
      
    } catch (error) {
      // Pour les domaines, une erreur réseau indique généralement que le domaine est disponible
      const errorResult = handleCheckError(error, 'domain-com');
      return {
        ...errorResult,
        method: 'connectivity-test',
        responseTime: Date.now() - startTime
      };
    }
  };

  return {
    checkByStatusCode,
    checkByContentParsing,
    checkByApi,
    checkByConnectivity
  };
};

// Instance globale du vérificateur
export const availabilityChecker = createAvailabilityChecker();

// Fonction principale pour vérifier une plateforme
export const checkPlatformAvailability = async (
  platform: PlatformType,
  name: string
): Promise<CheckResult> => {
  const config = PLATFORM_CONFIGS[platform];
  if (!config) {
    throw new Error(`Platform ${platform} not configured`);
  }

  const checker = availabilityChecker;
  
  try {
    switch (config.checkMethod) {
      case 'status-code': {
        const url = config.apiEndpoint?.replace('{name}', name) || '';
        return await checker.checkByStatusCode(url);
      }
      
      case 'content-parsing': {
        const url = config.apiEndpoint?.replace('{name}', name) || '';
        const errorMessages = [
          ...(config.errorMessages?.fr || []),
          ...(config.errorMessages?.en || [])
        ];
        return await checker.checkByContentParsing(url, errorMessages);
      }
      
      case 'api-official': {
        const endpoint = config.apiEndpoint || '';
        const params = { name };
        
        // Paramètres spécifiques pour VS Code Extensions
        if (platform === 'vscode-extensions') {
          return await checker.checkByApi(endpoint, {
            filters: {
              target: 'Microsoft.VisualStudio.Code',
              criteria: [{
                filterType: 8,
                value: name
              }]
            },
            flags: 914
          });
        }
        
        return await checker.checkByApi(endpoint, params);
      }
      
      case 'connectivity-test': {
        const domain = `${name}${config.name}`; // ex: myproject.com
        return await checker.checkByConnectivity(domain);
      }
      
      default:
        throw new Error(`Unsupported check method: ${config.checkMethod}`);
    }
  } catch (error) {
    return handleCheckError(error, platform);
  }
};