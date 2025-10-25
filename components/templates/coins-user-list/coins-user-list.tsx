import { List, Typography } from '@mui/material';
import { urqlClient } from 'common/graphql';
import Loader from 'components/molecules/loader';
import CoinItem from 'components/organisms/coin-item';
import { GET_MARKETS } from 'graphql/queries';
import { BinanceMarket } from 'graphql/types';
import useFavourites from 'hooks/use-favourites';
import { isUndefined } from 'lib/lodash-utils';
import { memo, useEffect, useState } from 'react';

interface CoinsUserListProps {
  predefined?: string[];
  markets?: BinanceMarket[];
}

const CoinsUserList = memo(({ predefined, markets }: CoinsUserListProps) => {
  const { userCoinFavourites } = useFavourites();
  const [data, setData] = useState<{ markets: BinanceMarket[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const networkStatus = data ? 7 : 4;

  const fetchMarkets = async () => {
    setLoading(true);

    const result = await urqlClient
      .query(GET_MARKETS, {
        symbols: predefined ? predefined.join('|') : userCoinFavourites.join('|'),
      })
      .toPromise();

    if (!result.error) {
      setData(result.data as { markets: BinanceMarket[] });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  const isFeaturedView = !isUndefined(predefined);
  const dataCoins = data?.markets;
  const coinsList = dataCoins || markets;

  return (
    <div>
      {coinsList && !coinsList.length && networkStatus === 7 && (
        <Typography variant="subtitle1">
          No {isFeaturedView ? 'featured coins.' : 'starred coins. Add some first.'}
        </Typography>
      )}
      {coinsList && coinsList.length > 0 && (
        <List>
          {coinsList.map((coin: BinanceMarket) => (
            <CoinItem key={coin.id} coin={coin} />
          ))}
        </List>
      )}
      {!dataCoins && !loading && (
        <Typography variant="subtitle1" suppressHydrationWarning>
          No coins available
        </Typography>
      )}
      {loading && (!coinsList || networkStatus === 4) && (
        <Loader
          text={
            <Typography variant="subtitle1">Loading {isFeaturedView ? 'featured' : 'favourite'} list...</Typography>
          }
        />
      )}
    </div>
  );
});

CoinsUserList.displayName = 'CoinsUserList';

export default CoinsUserList;
