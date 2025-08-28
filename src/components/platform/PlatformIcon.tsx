import type { PlatformType } from "@/types";
import {
  Container,
  Facebook,
  Github,
  Globe,
  Hash,
  Instagram,
  Linkedin,
  Music,
  Package,
  Package2,
  Puzzle,
  Server,
  Store,
  Twitter,
  Youtube,
} from "lucide-react";

interface PlatformIconProps {
  platform: PlatformType;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Mapping des icônes par plateforme
const PLATFORM_ICON_MAP: Record<PlatformType, React.ComponentType<any>> = {
  // Développement
  github: Github,
  npm: Package,
  pypi: Package,
  crates: Package,
  dockerhub: Container,
  homebrew: Package,

  // Déploiement & Hosting
  vercel: Server,
  netlify: Server,
  "firebase-hosting": Server,
  heroku: Server,
  "azure-static": Server,
  "google-cloud-run": Server,

  // Registres spécialisés
  packagist: Package2,
  rubygems: Package2,

  // Réseaux sociaux
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: Music,
  youtube: Youtube,

  // Stores
  "chrome-store": Puzzle,
  "firefox-addons": Puzzle,
  "vscode-extensions": Puzzle,
  "app-store": Store,
  "play-store": Store,

  // Domaines
  "domain-com": Globe,
  "domain-net": Globe,
  "domain-org": Globe,
  "domain-io": Globe,
  "domain-dev": Globe,
  "domain-fr": Globe,
};

// Couleurs par plateforme
const PLATFORM_COLORS: Record<PlatformType, string> = {
  // Développement
  github: "text-gray-900 dark:text-gray-100",
  npm: "text-red-600",
  pypi: "text-blue-600",
  crates: "text-orange-600",
  dockerhub: "text-blue-500",
  homebrew: "text-yellow-600",

  // Déploiement & Hosting
  vercel: "text-black dark:text-white",
  netlify: "text-teal-600",
  "firebase-hosting": "text-orange-500",
  heroku: "text-purple-700",
  "azure-static": "text-blue-500",
  "google-cloud-run": "text-blue-500",

  // Registres spécialisés
  packagist: "text-orange-600",
  rubygems: "text-red-600",

  // Réseaux sociaux
  twitter: "text-blue-400",
  instagram: "text-pink-500",
  facebook: "text-blue-600",
  linkedin: "text-blue-700",
  tiktok: "text-black dark:text-white",
  youtube: "text-red-600",

  // Stores
  "chrome-store": "text-green-600",
  "firefox-addons": "text-orange-600",
  "vscode-extensions": "text-blue-600",
  "app-store": "text-gray-600",
  "play-store": "text-green-600",

  // Domaines
  "domain-com": "text-blue-600",
  "domain-net": "text-green-600",
  "domain-org": "text-purple-600",
  "domain-io": "text-indigo-600",
  "domain-dev": "text-orange-600",
  "domain-fr": "text-blue-500",
};

// Tailles d'icônes
const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const PlatformIcon = ({
  platform,
  className = "",
  size = "md",
}: PlatformIconProps) => {
  const IconComponent = PLATFORM_ICON_MAP[platform];
  const colorClass = PLATFORM_COLORS[platform];
  const sizeClass = SIZE_CLASSES[size];

  if (!IconComponent) {
    // Icône par défaut si la plateforme n'est pas trouvée
    return <Hash className={`${sizeClass} text-gray-400 ${className}`} />;
  }

  return (
    <IconComponent className={`${sizeClass} ${colorClass} ${className}`} />
  );
};

// Composant pour afficher l'icône avec un fond coloré
export const PlatformIconWithBackground = ({
  platform,
  className = "",
  size = "md",
}: PlatformIconProps) => {
  const backgroundColors: Record<PlatformType, string> = {
    // Développement
    github: "bg-gray-900 dark:bg-gray-100",
    npm: "bg-red-600",
    pypi: "bg-blue-600",
    crates: "bg-orange-600",
    dockerhub: "bg-blue-500",
    homebrew: "bg-yellow-600",

    // Déploiement & Hosting
    vercel: "bg-black dark:bg-white",
    netlify: "bg-teal-600",
    "firebase-hosting": "bg-orange-500",
    heroku: "bg-purple-700",
    "azure-static": "bg-blue-500",
    "google-cloud-run": "bg-blue-500",

    // Registres spécialisés
    packagist: "bg-orange-600",
    rubygems: "bg-red-600",

    // Réseaux sociaux
    twitter: "bg-blue-400",
    instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
    facebook: "bg-blue-600",
    linkedin: "bg-blue-700",
    tiktok: "bg-black dark:bg-white",
    youtube: "bg-red-600",

    // Stores
    "chrome-store": "bg-green-600",
    "firefox-addons": "bg-orange-600",
    "vscode-extensions": "bg-blue-600",
    "app-store": "bg-gray-600",
    "play-store": "bg-green-600",

    // Domaines
    "domain-com": "bg-blue-600",
    "domain-net": "bg-green-600",
    "domain-org": "bg-purple-600",
    "domain-io": "bg-indigo-600",
    "domain-dev": "bg-orange-600",
    "domain-fr": "bg-blue-500",
  };

  const IconComponent = PLATFORM_ICON_MAP[platform];
  const bgClass = backgroundColors[platform];
  const sizeClass = SIZE_CLASSES[size];

  const containerSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  if (!IconComponent) {
    return (
      <div
        className={`${containerSizes[size]} rounded-lg bg-gray-400 flex items-center justify-center ${className}`}
      >
        <Hash className={`${sizeClass} text-white`} />
      </div>
    );
  }

  return (
    <div
      className={`${containerSizes[size]} rounded-lg ${bgClass} flex items-center justify-center ${className}`}
    >
      <IconComponent className={`${sizeClass} text-white`} />
    </div>
  );
};

// Hook pour obtenir les informations d'une icône
export const usePlatformIcon = (platform: PlatformType) => {
  return {
    IconComponent: PLATFORM_ICON_MAP[platform] || Hash,
    color: PLATFORM_COLORS[platform] || "text-gray-400",
    hasIcon: !!PLATFORM_ICON_MAP[platform],
  };
};
