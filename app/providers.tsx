import { CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode, Suspense } from 'react';
import CookieConsent from 'react-cookie-consent';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next/appDir';
import { QueryProvider } from '../common/providers/query-provider';
import { theme } from '../common/theme';
import { isServer } from '../common/utils';
import BitcoinRandLivePrice from '../components/atoms/bitcoin-rand-live-price';
import ScrollToTop from '../components/atoms/scroll-to-top';
import TickersLivePrice from '../components/molecules/tickers-live-price';
import DefaultLayout from '../components/templates/default-layout';
import UserCoinFavouritesProvider from '../context/favourites';
import GlobalProvider from '../context/global';
import { GATracker } from './ga-tracker';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <QueryProvider>
          <GlobalProvider>
            <UserCoinFavouritesProvider>
              <Suspense fallback={null}>
                <GATracker />
              </Suspense>
              <div suppressHydrationWarning>
                <CssBaseline />
                <ScrollToTop />
                {!isServer() && <BitcoinRandLivePrice />}
                <TickersLivePrice />

                <DefaultLayout>{children}</DefaultLayout>

                <CookieConsent
                  location="bottom"
                  buttonText="Okay"
                  cookieName="CookiePrivacySA"
                  style={{ background: '#2B373B' }}
                  buttonStyle={{
                    color: '#ffffff',
                    background: '#28a745',
                    fontSize: '13px',
                    font: 'inherit',
                    textTransform: 'uppercase',
                    fontWeight: '700',
                    borderRadius: '.25rem',
                  }}
                  expires={150}
                >
                  This website uses cookies to enhance the user experience.
                </CookieConsent>
              </div>
            </UserCoinFavouritesProvider>
          </GlobalProvider>
        </QueryProvider>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
