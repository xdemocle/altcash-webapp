import { useQuery } from '@apollo/client/react';
import { btcToRandPriceWithSymbol } from '../../../common/currency';
import { GET_PAIR, GET_TICKER } from '../../../graphql/queries';
import {
  Market,
  PairResponse,
  PairVariables,
  Ticker
} from '../../../graphql/types';

type Props = {
  coin: Market;
};

const CoinTicker = ({ coin }: Props) => {
  const { data } = useQuery<{ ticker: Ticker }, { id: string }>(GET_TICKER, {
    fetchPolicy: 'cache-first',
    variables: {
      id: coin && coin.id
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

  return (
    <span suppressHydrationWarning>
      {dataTicker.price && bitcoinRandPrice
        ? btcToRandPriceWithSymbol(Number(dataTicker.price), bitcoinRandPrice)
        : 'n/d'}
    </span>
  );
};

export default CoinTicker;
