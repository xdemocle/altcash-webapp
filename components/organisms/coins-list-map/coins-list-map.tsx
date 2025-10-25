import { List } from '@mui/material';
import { BinanceMarket } from 'graphql/types';
import { memo } from 'react';
import CoinItem from '../coin-item';

interface Props {
  markets: BinanceMarket[];
}

const CoinsListMap = memo(({ markets }: Props) => {
  return (
    <List>
      {markets.map((market: BinanceMarket) => {
        return market && <CoinItem key={market.id} coin={market} />;
      })}
    </List>
  );
});

CoinsListMap.displayName = 'CoinsListMap';

export default CoinsListMap;
