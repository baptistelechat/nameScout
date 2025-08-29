import type { PlatformConfig, PlatformType } from "@/types";

// Configuration complète des plateformes avec messages d'erreur
export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  // 🔧 Développement & Code
  github: {
    type: "github",
    category: "development",
    name: "GitHub",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://api.github.com/users/{name}",
  },

  npm: {
    type: "npm",
    category: "development",
    name: "npm",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://registry.npmjs.org/{name}",
  },

  pypi: {
    type: "pypi",
    category: "development",
    name: "PyPI",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://pypi.org/pypi/{name}/json",
  },

  crates: {
    type: "crates",
    category: "development",
    name: "crates.io",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://crates.io/api/v1/crates/{name}",
  },

  dockerhub: {
    type: "dockerhub",
    category: "development",
    name: "Docker Hub",
    checkMethod: "api-official",
    timeout: 5000,
    apiEndpoint: "https://hub.docker.com/v2/repositories/{name}",
  },

  homebrew: {
    type: "homebrew",
    category: "development",
    name: "Homebrew",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://formulae.brew.sh/api/formula/{name}.json",
  },

  // 🚀 Déploiement & Hosting
  vercel: {
    type: "vercel",
    category: "development",
    name: "Vercel",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://{name}.vercel.app",
  },

  netlify: {
    type: "netlify",
    category: "development",
    name: "Netlify",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://{name}.netlify.app",
  },



  "firebase-hosting": {
    type: "firebase-hosting",
    category: "development",
    name: "Firebase Hosting",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://{name}.web.app",
  },

  heroku: {
    type: "heroku",
    category: "development",
    name: "Heroku",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://{name}.herokuapp.com",
  },



  "azure-static": {
    type: "azure-static",
    category: "development",
    name: "Azure Static Web Apps",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://{name}.azurestaticapps.net",
  },

  "google-cloud-run": {
    type: "google-cloud-run",
    category: "development",
    name: "Google Cloud Run",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://{name}-run.a.run.app",
  },

  // 📦 Registres spécialisés

  packagist: {
    type: "packagist",
    category: "development",
    name: "Packagist",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://repo.packagist.org/p2/{name}.json",
  },

  rubygems: {
    type: "rubygems",
    category: "development",
    name: "RubyGems",
    checkMethod: "status-code",
    timeout: 5000,
    apiEndpoint: "https://rubygems.org/api/v1/gems/{name}.json",
  },



  // 📱 Réseaux Sociaux
  twitter: {
    type: "twitter",
    category: "social",
    name: "Twitter/X",
    checkMethod: "content-parsing",
    timeout: 10000,
    apiEndpoint: "https://twitter.com/{name}",
    errorMessages: {
      fr: [
        "Ce compte n'existe pas",
        "Compte suspendu",
        "Utilisateur introuvable",
        "Page introuvable",
      ],
      en: [
        "This account doesn't exist",
        "Account suspended",
        "User not found",
        "Page not found",
      ],
    },
  },

  instagram: {
    type: "instagram",
    category: "social",
    name: "Instagram",
    checkMethod: "content-parsing",
    timeout: 10000,
    apiEndpoint: "https://www.instagram.com/{name}",
    errorMessages: {
      fr: [
        "Page introuvable",
        "Utilisateur introuvable",
        "Contenu indisponible",
        "Cette page n'est pas disponible",
      ],
      en: [
        "Page not found",
        "User not found",
        "Content not available",
        "This page isn't available",
      ],
    },
  },

  facebook: {
    type: "facebook",
    category: "social",
    name: "Facebook",
    checkMethod: "content-parsing",
    timeout: 10000,
    apiEndpoint: "https://www.facebook.com/{name}",
    errorMessages: {
      fr: [
        "Page introuvable",
        "Contenu indisponible",
        "Cette page n'existe pas",
      ],
      en: [
        "Page not found",
        "Content not available",
        "This page doesn't exist",
      ],
    },
  },

  linkedin: {
    type: "linkedin",
    category: "social",
    name: "LinkedIn",
    checkMethod: "content-parsing",
    timeout: 10000,
    apiEndpoint: "https://www.linkedin.com/in/{name}",
    errorMessages: {
      fr: ["Profil introuvable", "Membre introuvable", "Page introuvable"],
      en: ["Profile not found", "Member not found", "Page not found"],
    },
  },

  tiktok: {
    type: "tiktok",
    category: "social",
    name: "TikTok",
    checkMethod: "content-parsing",
    timeout: 10000,
    apiEndpoint: "https://www.tiktok.com/@{name}",
    errorMessages: {
      fr: ["Utilisateur introuvable", "Compte privé", "Page introuvable"],
      en: ["User not found", "Private account", "Page not found"],
    },
  },

  youtube: {
    type: "youtube",
    category: "social",
    name: "YouTube",
    checkMethod: "content-parsing",
    timeout: 8000,
    apiEndpoint: "https://www.youtube.com/@{name}",
    errorMessages: {
      fr: ["Chaîne introuvable", "Cette chaîne n'existe pas"],
      en: ["Channel not found", "This channel doesn't exist"],
    },
  },

  // 🏪 Stores & Extensions
  "chrome-store": {
    type: "chrome-store",
    category: "stores",
    name: "Chrome Web Store",
    checkMethod: "content-parsing",
    timeout: 8000,
    apiEndpoint: "https://chrome.google.com/webstore/search/{name}",
    errorMessages: {
      fr: ["Aucun résultat", "Extension introuvable"],
      en: ["No results", "Extension not found"],
    },
  },

  "firefox-addons": {
    type: "firefox-addons",
    category: "stores",
    name: "Firefox Add-ons",
    checkMethod: "content-parsing",
    timeout: 8000,
    apiEndpoint: "https://addons.mozilla.org/en-US/firefox/search/?q={name}",
    errorMessages: {
      fr: ["Aucun résultat", "Extension introuvable"],
      en: ["No results found", "Extension not found"],
    },
  },

  "vscode-extensions": {
    type: "vscode-extensions",
    category: "stores",
    name: "VS Code Extensions",
    checkMethod: "api-official",
    timeout: 8000,
    apiEndpoint:
      "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
  },

  "app-store": {
    type: "app-store",
    category: "stores",
    name: "Apple App Store",
    checkMethod: "content-parsing",
    timeout: 8000,
    apiEndpoint: "https://apps.apple.com/search?term={name}",
    errorMessages: {
      fr: ["Aucun résultat", "App introuvable"],
      en: ["No results", "App not found"],
    },
  },

  "play-store": {
    type: "play-store",
    category: "stores",
    name: "Google Play Store",
    checkMethod: "content-parsing",
    timeout: 8000,
    apiEndpoint: "https://play.google.com/store/search?q={name}",
    errorMessages: {
      fr: ["Aucun résultat", "App introuvable"],
      en: ["No results", "App not found"],
    },
  },

  // 🌐 Domaines
  "domain-com": {
    type: "domain-com",
    category: "domains",
    name: ".com",
    checkMethod: "connectivity-test",
    timeout: 3000,
  },

  "domain-net": {
    type: "domain-net",
    category: "domains",
    name: ".net",
    checkMethod: "connectivity-test",
    timeout: 3000,
  },

  "domain-org": {
    type: "domain-org",
    category: "domains",
    name: ".org",
    checkMethod: "connectivity-test",
    timeout: 3000,
  },

  "domain-io": {
    type: "domain-io",
    category: "domains",
    name: ".io",
    checkMethod: "connectivity-test",
    timeout: 3000,
  },

  "domain-dev": {
    type: "domain-dev",
    category: "domains",
    name: ".dev",
    checkMethod: "connectivity-test",
    timeout: 3000,
  },

  "domain-fr": {
    type: "domain-fr",
    category: "domains",
    name: ".fr",
    checkMethod: "connectivity-test",
    timeout: 3000,
  },
};

// Utilitaires pour travailler avec les plateformes
export const getPlatformsByCategory = (category: string) => {
  return Object.values(PLATFORM_CONFIGS).filter(
    (config) => config.category === category
  );
};

export const getAllPlatforms = () => {
  return Object.values(PLATFORM_CONFIGS);
};

export const getPlatformConfig = (platform: PlatformType) => {
  return PLATFORM_CONFIGS[platform];
};

// Constantes pour les catégories
export const PLATFORM_CATEGORIES = {
  development: {
    name: "Développement",
    icon: "code",
    description: "Plateformes de développement et packages",
  },
  social: {
    name: "Réseaux Sociaux",
    icon: "users",
    description: "Réseaux sociaux et plateformes communautaires",
  },
  stores: {
    name: "Stores & Extensions",
    icon: "store",
    description: "Magasins d'applications et extensions",
  },
  domains: {
    name: "Domaines",
    icon: "globe",
    description: "Noms de domaine web",
  },
} as const;
