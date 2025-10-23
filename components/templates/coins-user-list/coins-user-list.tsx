import { useQuery } from '@apollo/client/react';
import { List, Typography } from '@mui/material';
import Loader from 'components/molecules/loader';
import CoinItem from 'components/organisms/coin-item';
import { GET_MARKETS } from 'graphql/queries';
import { Market } from 'graphql/types';
import useFavourites from 'hooks/use-favourites';
import { isUndefined } from 'lodash';
import { memo } from 'react';

interface CoinsUserListProps {
  predefined?: string[];
  markets: Market[];
}

const CoinsUserList = memo(({ predefined, markets }: CoinsUserListProps) => {
  const { userCoinFavourites } = useFavourites();
  const { loading, data, networkStatus } = useQuery<{ markets: Market[] }>(GET_MARKETS, {
    variables: {
      symbols: predefined ? predefined.join('|') : userCoinFavourites.join('|'),
    },
  });

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
          {coinsList.map((coin: Market) => (
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
