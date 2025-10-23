import { btcToRandPriceWithSymbol } from '../../../common/currency';
import { GET_PAIR, GET_TICKER } from '../../../graphql/queries';
import { Market, PairResponse, PairVariables, Ticker } from '../../../graphql/types';
import { memo, useEffect, useState } from 'react';
import { urqlClient } from '../../../common/graphql-client';

type Props = {
  coin: Market;
};

const CoinTicker = memo(({ coin }: Props) => {
  const [data, setData] = useState<{ ticker: Ticker } | null>(null);
  const [dataPair, setDataPair] = useState<PairResponse | null>(null);

  useEffect(() => {
    if (!coin || !coin.id) return;

    const fetchTicker = async () => {
      const result = await urqlClient.query(GET_TICKER, { id: coin.id }).toPromise();
      if (!result.error) {
        setData(result.data as { ticker: Ticker });
      }
    };
    fetchTicker();
  }, [coin?.id]);

  useEffect(() => {
    const fetchPair = async () => {
      const result = await urqlClient.query(GET_PAIR, { pair: 'XBTZAR' }).toPromise();
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
