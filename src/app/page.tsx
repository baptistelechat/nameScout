"use client";

import { Layout } from "@/components/layout/Layout";
import { CategoryFilter } from "@/components/search/CategoryFilter";
import { ResultGrid } from "@/components/search/ResultGrid";
import { SearchForm } from "@/components/search/SearchForm";
import { StatusFilter } from "@/components/search/StatusFilter";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { Clock, Search, Shield, Zap } from "lucide-react";

export default function HomePage() {
  const { currentResults, isSearching } = useAppStore();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Search className="h-16 w-16 text-primary" />
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                <Zap className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            NameScout
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Vérifiez la disponibilité de votre nom sur 25+ plateformes en
            quelques secondes
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Vérification rapide</h3>
                <p className="text-sm text-muted-foreground">
                  Vérifiez simultanément sur GitHub, npm, les réseaux sociaux et
                  plus
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Sécurisé & Privé</h3>
                <p className="text-sm text-muted-foreground">
                  Aucune donnée stockée sur nos serveurs, tout reste local
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Historique local</h3>
                <p className="text-sm text-muted-foreground">
                  Consultez vos recherches précédentes à tout moment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchForm />
        </div>

        {/* Results Section */}
        {(currentResults.length > 0 || isSearching) && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CategoryFilter />
              <StatusFilter />
            </div>

            {/* Results Grid */}
            <ResultGrid />
          </div>
        )}

        {/* Empty State */}
        {currentResults.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Prêt à vérifier un nom ?
            </h3>
            <p className="text-muted-foreground">
              Saisissez un nom ci-dessus pour commencer la vérification sur
              toutes les plateformes
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
