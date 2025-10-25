'use client';

import { ShoppingBasket, Star, StarBorder } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import CoinSVG from 'components/atoms/coin-svg';
import CoinTicker from 'components/organisms/coin-ticker';
import { Market } from 'graphql/types';
import useFavourites from 'hooks/use-favourites';
import { useRouter } from 'next/navigation';
import { Fragment, SyntheticEvent, memo } from 'react';
import { Column, StyledListItemButton, TickerColumn } from './components';

interface Props {
  coin: Market;
}

const CoinItem = memo(({ coin }: Props) => {
  const router = useRouter();
  const showBuy = useMediaQuery('(min-width:600px)');
  const { addFavourites, removeFavourites, userCoinFavourites } = useFavourites();

  if (!coin) {
    return null;
  }

  const iconButtonHandler = (e: SyntheticEvent) => {
    e.preventDefault();

    if (userCoinFavourites.includes(coin.symbol as never)) {
      removeFavourites(coin.symbol);
    } else {
      addFavourites(coin.symbol);
    }
  };

  const isStarred = userCoinFavourites.includes(coin.symbol as never);

  const secondaryAction = (
    <>
      {showBuy && (
        <Tooltip title="Buy now" placement="bottom">
          <Button
            aria-label="Buy now"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ShoppingBasket />
          </Button>
        </Tooltip>
      )}
      <Tooltip title={`${isStarred ? 'Remove from' : 'Add to'} your favourites`} placement="bottom">
        <Button aria-label={`${isStarred ? 'Remove from' : 'Add to'} your favourites`} onClick={iconButtonHandler}>
          {isStarred ?
            <Star />
          : <StarBorder />}
        </Button>
      </Tooltip>
    </>
  );

  const handleRowClick = () => {
    router.push(`/coin/${coin.id.toLowerCase()}`);
  };

  return (
    <Fragment>
      <StyledListItemButton onClick={handleRowClick}>
        <ListItemIcon>
          <CoinSVG coinSymbol={coin.symbol} />
        </ListItemIcon>
        <Column
          primary={coin.name || coin.id}
          secondary={`${coin.symbol.toUpperCase()} ${coin.status !== 'TRADING' ? ' / ' + coin.status : ''}`}
        />
        <TickerColumn
          primary={<CoinTicker coin={coin} />}
          secondary="Live Price"
          className={`ticker ${coin.status}`}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>{secondaryAction}</Box>
      </StyledListItemButton>
      <Divider />
    </Fragment>
  );
});

CoinItem.displayName = 'CoinItem';

export default CoinItem;
