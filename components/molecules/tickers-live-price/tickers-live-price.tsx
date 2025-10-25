'use client';

import { urqlClient } from 'common/graphql';
import { isServer } from 'common/utils';
import { GET_TICKERS } from 'graphql/queries';
import { Fragment, useEffect } from 'react';

const TickersLivePrice = () => {
  useEffect(() => {
    if (isServer()) return;

    const fetchTickers = async () => {
      await urqlClient.query(GET_TICKERS, {}).toPromise();
    };

    fetchTickers();
    const intervalId = setInterval(fetchTickers, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return <Fragment />;
};

export default TickersLivePrice;
