import { useQuery } from '@apollo/client/react';
import { btcToRandPriceWithSymbol } from '../../../common/currency';
import { GET_PAIR, GET_TICKER } from '../../../graphql/queries';
import {
  Market,
  PairResponse,
  PairVariables,
  Ticker
} from '../../../graphql/types';
import { memo } from 'react';

type Props = {
  coin: Market;
};

const CoinTicker = memo(({ coin }: Props) => {
  const { data } = useQuery<{ ticker: Ticker }, { id: string }>(GET_TICKER, {
    fetchPolicy: 'cache-first',
    skip: !coin || !coin.id,
    variables: {
      id: coin?.id || ''
    }
  });

  const { data: dataPair } = useQuery<PairResponse, PairVariables>(GET_PAIR, {
    fetchPolicy: 'cache-first',
    variables: {
      pair: 'XBTZAR'
    }
  });

  if (!coin) {
    return null;
  }

  const fallbackTicker: Ticker = {
    id: '',
    price: '0'
  };

  const dataTicker = data?.ticker ?? fallbackTicker;
  const bitcoinRandPrice = dataPair?.pair
    ? Number(dataPair.pair.last_trade)
    : undefined;

  const priceValue = Number(dataTicker.price);
  const isValidPrice = priceValue > 0 && bitcoinRandPrice && bitcoinRandPrice > 0;

  return (
    <span suppressHydrationWarning>
      {isValidPrice
        ? btcToRandPriceWithSymbol(priceValue, bitcoinRandPrice)
        : 'n/d'}
    </span>
  );
});

CoinTicker.displayName = 'CoinTicker';

export default CoinTicker;
