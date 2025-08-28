import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Heart, Zap, Shield, Globe } from 'lucide-react';

export default function AboutPage() {
  const technologies = [
    'Next.js 14',
    'React 18',
    'TypeScript',
    'Tailwind CSS',
    'shadcn/ui',
    'Zustand',
    'Lucide React'
  ];

  const platforms = [
    { category: 'Développement', count: 6, examples: ['GitHub', 'npm', 'PyPI', 'crates.io'] },
    { category: 'Réseaux Sociaux', count: 6, examples: ['Twitter/X', 'Instagram', 'LinkedIn', 'YouTube'] },
    { category: 'Stores & Extensions', count: 5, examples: ['Chrome Store', 'VS Code', 'App Store'] },
    { category: 'Domaines Web', count: 8, examples: ['.com', '.io', '.dev', '.fr'] }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">À propos de NameScout</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Un outil moderne et gratuit pour vérifier la disponibilité de noms sur plus de 25 plateformes
          </p>
        </div>

        <div className="grid gap-8">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Qu'est-ce que NameScout ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                NameScout est une application web qui simplifie le processus de recherche de noms pour les développeurs, 
                créateurs et entrepreneurs. Au lieu de vérifier manuellement chaque plateforme une par une, NameScout 
                effectue toutes les vérifications simultanément.
              </p>
              <p>
                L'application vérifie la disponibilité sur les plateformes de développement (GitHub, npm, PyPI), 
                les réseaux sociaux (Twitter, Instagram, LinkedIn), les stores d'applications, et les domaines web 
                les plus populaires.
              </p>
            </CardContent>
          </Card>

          {/* Plateformes supportées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Plateformes supportées
              </CardTitle>
              <CardDescription>
                Plus de 25 plateformes organisées par catégories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {platforms.map((platform) => (
                  <div key={platform.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{platform.category}</h4>
                      <Badge variant="secondary">{platform.count} plateformes</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {platform.examples.join(', ')}, et plus...
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fonctionnalités */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Fonctionnalités principales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">🚀 Vérification rapide</h4>
                  <p className="text-sm text-muted-foreground">
                    Vérifications parallèles sur toutes les plateformes en quelques secondes
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">🔒 Confidentialité</h4>
                  <p className="text-sm text-muted-foreground">
                    Aucune donnée envoyée à nos serveurs, tout reste dans votre navigateur
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">📱 Responsive</h4>
                  <p className="text-sm text-muted-foreground">
                    Interface optimisée pour mobile, tablette et desktop
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">🌙 Thème sombre</h4>
                  <p className="text-sm text-muted-foreground">
                    Basculement automatique ou manuel entre thèmes clair et sombre
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">📊 Filtres avancés</h4>
                  <p className="text-sm text-muted-foreground">
                    Filtrage par catégorie, statut et priorité des plateformes
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">💾 Historique local</h4>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarde automatique de vos recherches dans le navigateur
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle>Technologies utilisées</CardTitle>
              <CardDescription>
                Application moderne construite avec les dernières technologies web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Open Source */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Open Source
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                NameScout est un projet open source. Le code source est disponible sur GitHub 
                et les contributions sont les bienvenues !
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/namescout/namescout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <Github className="h-4 w-4" />
                  Voir sur GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Des questions, suggestions ou problèmes ? N'hésitez pas à nous contacter !
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Email :</strong> contact@namescout.dev
                </p>
                <p className="text-sm">
                  <strong>Issues GitHub :</strong> Pour signaler des bugs ou proposer des améliorations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}