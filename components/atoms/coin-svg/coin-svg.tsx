import clsx from 'clsx';
import { find } from 'lodash';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { svgCoinPathHelper } from '../../../common/utils';
import { GET_META_COIN_LOGO } from '../../../graphql/queries';
import type { MetaCoinAllItem } from '../../../graphql/types';
import { urqlClient } from '../../../common/graphql-client';
import useStyles from './use-styles';

type MetaCoinLogoQuery = {
  metaCoinAll?: MetaCoinAllItem[];
};

type Props = {
  coinSymbol: string;
  size?: string;
};

const CoinSVG = ({ coinSymbol, size }: Props) => {
  const { classes } = useStyles();
  const [metadata, setMetadata] = useState<MetaCoinLogoQuery | null>(null);
  let symbol = coinSymbol.toLowerCase();
  let imgCoinPath = '';
  let svgCoinPath = null;

  useEffect(() => {
    const fetchMetadata = async () => {
      const result = await urqlClient.query(GET_META_COIN_LOGO, {}).toPromise();
      if (!result.error) {
        setMetadata(result.data as MetaCoinLogoQuery);
      }
    };
    fetchMetadata();
  }, []);

  const getCoinLogo = (symbol: string) => {
    if (!metadata || !metadata.metaCoinAll) {
      return null;
    }

    const coin = find(metadata.metaCoinAll, { symbol });

    if (!coin || !coin.logo) {
      return svgCoinPathHelper('btc');
    }

    return coin.logo;
  };

  if (!metadata) {
    return null;
  }

  try {
    svgCoinPath = svgCoinPathHelper(symbol);
  } catch (err) {
    symbol = 'cc-default';
    imgCoinPath =
      getCoinLogo(coinSymbol.toUpperCase()) || 'https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png';
  }

  return (
    svgCoinPath ?
      <ReactSVG
        src={svgCoinPath.default.src}
        className={clsx(
          classes.avatar,
          symbol,
          classes.regular,
          size === 'avatar' && classes[size],
          size === 'large' && classes[size]
        )}
      />
    : imgCoinPath ?
      <Image src={imgCoinPath} alt={`Logo ${coinSymbol}`} width="32" height="32" title={`Logo ${coinSymbol}`} />
    : null
  );
};

export default CoinSVG;
