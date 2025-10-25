import { Viewport } from 'next';
import { Roboto } from 'next/font/google';
import { ReactNode } from 'react';
import '../styles/global.css';
import { Providers } from './providers';

interface RootLayoutProps {
  children: ReactNode;
}

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: 'black',
};

export const metadata = {
  title: 'Altcash Demo | Cryptocurrency Trading Platform (Demo Only)',
  description:
    'Altcash Demo - A demonstration cryptocurrency trading platform showcasing Bitcoin, Ethereum, and altcoin trading features. This is a demo platform for educational purposes only, not a real trading platform.',
  keywords:
    'crypto demo, bitcoin demo, ethereum demo, altcoins, cryptocurrency trading demo, South Africa, educational platform',
  authors: [{ name: 'Altcash Demo' }],
  creator: 'Altcash',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Altcash Demo | Cryptocurrency Trading Platform (Demo Only)',
    description:
      'Altcash Demo Platform - Educational demonstration of cryptocurrency trading. This is a demo platform for learning purposes, not a real trading platform.',
    type: 'website',
    url: 'https://altcash.co.za',
    siteName: 'Altcash Demo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Altcash Demo | Crypto Trading Platform (Demo)',
    description: 'Educational demo platform for cryptocurrency trading - Not a real trading platform',
  },
};

export default function Layout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={roboto.className}>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/63249f9137898912e9699a6f/1gd3gukf1';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
              })();
            `,
            }}
          />
        )}
      </head>
      <body className="root" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
