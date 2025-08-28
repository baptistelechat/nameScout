import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NameScout - Vérifiez la disponibilité de votre nom sur 25+ plateformes',
  description: 'Vérifiez rapidement la disponibilité d\'un nom sur GitHub, npm, les réseaux sociaux, les domaines et plus encore.',
  keywords: ['nom', 'disponibilité', 'github', 'npm', 'domaine', 'réseaux sociaux'],
  authors: [{ name: 'NameScout Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}