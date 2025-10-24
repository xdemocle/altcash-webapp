import { Viewport } from 'next';
import { ReactNode } from 'react';
import '../styles/global.css';
import { Providers } from './providers';

interface RootLayoutProps {
  children: ReactNode;
}

export const viewport: Viewport = {
  themeColor: 'black',
};

export const metadata = {
  title: 'Altcash | Buy crypto coins fast and easy in South Africa!',
  description: 'Buy crypto coins fast and easy in South Africa!',
  keywords: 'buy, crypto, coins, fast and easy, bitcoins, altcoins, South Africa',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Altcash | Buy crypto coins fast and easy in South Africa!',
    description: 'Buy crypto coins fast and easy in South Africa!',
    type: 'website',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:300,500,700&display=swap" />
        <meta name="description" content="Buy crypto coins fast and easy in South Africa!" />
        <meta name="keywords" content="buy, crypto, coins, fast and easy, bitcoins, altcoins, South Africa" />
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
