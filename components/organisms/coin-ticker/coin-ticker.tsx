import { memo, useEffect, useState } from 'react';
import { btcToRandPriceWithSymbol } from '~/common/currency';
import { urqlClient } from '~/common/graphql';
import { GET_PAIR, GET_TICKER } from '~/graphql/queries';
import { Market, PairResponse, Ticker } from '~/graphql/types';

type Props = {
  coin: Market;
};

const CoinTicker = memo(({ coin }: Props) => {
  const [data, setData] = useState<{ ticker: Ticker } | null>(null);
  const [dataPair, setDataPair] = useState<PairResponse | null>(null);

  useEffect(() => {
    if (!coin || !coin.id) return;

    const fetchTicker = async () => {
      // Add random delay (0-200ms) to stagger requests and avoid thundering herd
      // Increased from 100ms to 200ms for better request distribution
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
      
      // cache-first: use cache if available, otherwise fetch from network
      // This policy prioritizes cached data to reduce redundant requests
      const result = await urqlClient.query(GET_TICKER, { id: coin.id }, { requestPolicy: 'cache-first' }).toPromise();
      if (!result.error && result.data) {
        setData(result.data as { ticker: Ticker });
      }
    };
    fetchTicker();
  }, [coin?.id]);

  useEffect(() => {
    const fetchPair = async () => {
      // Small delay for pair requests to avoid simultaneous requests
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      
      // Query from cache first, then network if not cached
      // Pair data is shared across all tickers, so caching is especially important
      const result = await urqlClient.query(GET_PAIR, { pair: 'XBTZAR' }, { requestPolicy: 'cache-first' }).toPromise();
      if (!result.error) {
        setDataPair(result.data as PairResponse);
      }
    };
    fetchPair();
  }, []);

  if (!coin) {
    return null;
  }

  const fallbackTicker: Ticker = {
    id: '',
    price: '0',
  };

  const dataTicker = data?.ticker || fallbackTicker;
  const bitcoinRandPrice = dataPair?.pair ? Number(dataPair.pair.last_trade) : undefined;

  const priceValue = Number(dataTicker.price);
  const isValidPrice = priceValue > 0 && bitcoinRandPrice && bitcoinRandPrice > 0;

  return (
    <span suppressHydrationWarning>
      {isValidPrice ? btcToRandPriceWithSymbol(priceValue, bitcoinRandPrice) : 'n/d'}
    </span>
  );
});

CoinTicker.displayName = 'CoinTicker';

export default CoinTicker;
