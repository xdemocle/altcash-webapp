import { useEffect, useState } from 'react';
import { btcToRandPrice } from '../common/currency';
import { Ticker } from '../graphql/types';
import useGlobal from './use-global';

const useMultiplier = (ticker: Ticker) => {
  const { bitcoinRandPrice } = useGlobal();
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    const newMultiplier = Number(btcToRandPrice(Number(ticker.price), bitcoinRandPrice));

    if (!Number.isNaN(newMultiplier)) {
      setMultiplier(newMultiplier);
    }
  }, [ticker, bitcoinRandPrice]);

  return {
    multiplier,
  };
};

export default useMultiplier;
