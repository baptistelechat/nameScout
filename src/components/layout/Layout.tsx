import { Header } from './Header';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="namescout-theme">
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t bg-background">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>© NameScout</span>
                <span>•</span>
                <span>Fait par Baptiste LECHAT avec ❤️ pour les développeurs</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <a 
                  href="https://x.com/baptiste_lechat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  X (Twitter)
                </a>
                <span>•</span>
                <a 
                  href="https://github.com/baptistelechat/nameScout" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
                <span>•</span>
                <a 
                  href="/about" 
                  className="hover:text-foreground transition-colors"
                >
                  À propos
                </a>
                <span>•</span>
                <span>v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};