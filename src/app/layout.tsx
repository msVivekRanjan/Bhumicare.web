import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/contexts/language-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Bhumicare Web Dashboard',
  description:
    'A responsive, AI + IoT-powered soil intelligence web dashboard for Indian farmers and agricultural organizations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', inter.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
