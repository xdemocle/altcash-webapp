import { List } from '@mui/material';
import { memo } from 'react';
import { Market } from '~/graphql/types';
import CoinItem from '../coin-item';

type Props = {
  markets: Market[];
};

const CoinsListMap = memo(({ markets }: Props) => {
  return (
    <List>
      {markets.map((market: Market) => {
        return market && <CoinItem key={market.id} coin={market} />;
      })}
    </List>
  );
});

CoinsListMap.displayName = 'CoinsListMap';

export default CoinsListMap;
