'use client';

import { REFRESH_BTCZAR_LIVE_PRICE } from 'common/constants';
import { urqlClient } from 'common/graphql';
import { isServer } from 'common/utils';
import { GET_PAIR } from 'graphql/queries';
import type { PairResponse, PairVariables } from 'graphql/types';
import useGlobal from 'hooks/use-global';
import { Fragment, useEffect, useState } from 'react';

const BitcoinRandLivePrice = () => {
  const { setBitcoinRandPrice } = useGlobal();
  const [data, setData] = useState<PairResponse | null>(null);

  const getLivePrice = async (variables: PairVariables) => {
    const result = await urqlClient.query(GET_PAIR, variables).toPromise();
    if (!result.error) {
      setData(result.data as PairResponse);
    }
  };

  useEffect(() => {
    const variables: PairVariables = { pair: 'XBTZAR' };
    getLivePrice(variables);

    const intervalBtcPrice = () => {
      if (!isServer()) {
        return setInterval(() => getLivePrice(variables), REFRESH_BTCZAR_LIVE_PRICE);
      }

      return 0;
    };

    const intervalId = intervalBtcPrice();

    return () => {
      if (!isServer()) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    // Set globally
    if (data && data.pair && data.pair.last_trade) {
      setBitcoinRandPrice(Number(data.pair.last_trade));
    }
  }, [data, setBitcoinRandPrice]);

  console.info('bitcoinRandPrice', data && data.pair && data.pair.last_trade);

  return <Fragment />;
};

export default BitcoinRandLivePrice;
