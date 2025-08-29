import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NameScout - Vérifiez la disponibilité de votre nom sur 25+ plateformes',
  description: 'Vérifiez rapidement la disponibilité d\'un nom sur GitHub, npm, les réseaux sociaux, les domaines et plus encore.',
  keywords: ['nom', 'disponibilité', 'github', 'npm', 'domaine', 'réseaux sociaux'],
  authors: [{ name: 'NameScout Team' }],
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔍</text></svg>',
  },
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
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="c5beba87-2dd6-4c89-ad77-b6d9bc9a2712"
          data-domains="namescout.vercel.app"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}