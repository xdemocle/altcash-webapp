import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import { QueryProvider } from '../common/providers/query-provider';
import createEmotionCache from '../common/createEmotionCache';
import * as ga from '../common/ga';
import { theme } from '../common/theme';
import { isServer } from '../common/utils';
import BitcoinRandLivePrice from '../components/atoms/bitcoin-rand-live-price';
import ScrollToTop from '../components/atoms/scroll-to-top';
import TickersLivePrice from '../components/molecules/tickers-live-price';
import DefaultLayout from '../components/templates/default-layout';
import UserCoinFavouritesProvider from '../context/favourites';
import GlobalProvider from '../context/global';
import '../styles/global.css';

const clientSideEmotionCache = createEmotionCache();

function MyApp({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: AppProps & { emotionCache: EmotionCache }) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(isServer() ? true : false);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
    };

    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <QueryProvider>
        <GlobalProvider>
          <UserCoinFavouritesProvider>
            <ThemeProvider theme={theme}>
              {/* <AuthProvider> */}
              <Head>
                <title>Altcash | Buy crypto coins fast and easy in South Africa!</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </Head>
              <div suppressHydrationWarning>
                <CssBaseline />
                <ScrollToTop />
                {!isServer() && <BitcoinRandLivePrice />}
                <TickersLivePrice />

                <DefaultLayout>
                  <Component {...pageProps} />
                </DefaultLayout>

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
              {/* </AuthProvider> */}
            </ThemeProvider>
          </UserCoinFavouritesProvider>
        </GlobalProvider>
      </QueryProvider>
    </CacheProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
