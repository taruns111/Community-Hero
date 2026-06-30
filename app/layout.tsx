import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'CivicAI – Community Hero | AI-Powered Civic Issue Reporting',
  description: 'Report, verify, and track local civic issues with AI-powered analysis. Join thousands of citizens making their communities better.',
  keywords: 'civic issues, pothole reporting, community, AI, smart city, government, infrastructure',
  openGraph: {
    title: 'CivicAI – Community Hero',
    description: 'AI-powered civic engagement platform for better communities',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-dark-950 text-white antialiased`}>
        <AppProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '12px',
              },
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
