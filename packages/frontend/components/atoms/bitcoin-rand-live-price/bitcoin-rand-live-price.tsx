import { useLazyQuery } from '@apollo/client/react';
import { Fragment, useEffect } from 'react';
import { REFRESH_BTCZAR_LIVE_PRICE } from '../../../common/constants';
import { isServer } from '../../../common/utils';
import { GET_PAIR } from '../../../graphql/queries';
import type { PairResponse, PairVariables } from '../../../graphql/types';
import useGlobal from '../../../hooks/use-global';

const BitcoinRandLivePrice = () => {
  const { setBitcoinRandPrice } = useGlobal();
  const [getLivePrice, { data }] = useLazyQuery<PairResponse, PairVariables>(
    GET_PAIR,
    {
      fetchPolicy: 'cache-and-network'
    }
  );

  useEffect(() => {
    const variables: PairVariables = { pair: 'XBTZAR' };
    getLivePrice({ variables });

    const intervalBtcPrice = () => {
      if (!isServer()) {
        return setInterval(
          () => getLivePrice({ variables }),
          REFRESH_BTCZAR_LIVE_PRICE
        );
      }

      return 0;
    };

    const intervalId = intervalBtcPrice();

    return () => {
      if (!isServer()) {
        window.clearInterval(intervalId);
      }
    };
  }, [getLivePrice]);

  useEffect(() => {
    // Set globally
    if (data && data.pair && data.pair.last_trade) {
      setBitcoinRandPrice(Number(data.pair.last_trade));
    }
  }, [data, setBitcoinRandPrice]);

  // eslint-disable-next-line no-console
  console.info('bitcoinRandPrice', data && data.pair && data.pair.last_trade);

  return <Fragment />;
};

export default BitcoinRandLivePrice;
