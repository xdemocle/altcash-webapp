import { Pagination, Typography } from '@mui/material';
import { COINS_PER_PAGE } from 'common/constants';
import Loader from 'components/molecules/loader';
import CoinsListMap from 'components/organisms/coins-list-map';
import { GET_COUNT, GET_MARKETS } from 'graphql/queries';
import { BinanceMarket, CountResponse } from 'graphql/types';
import useGlobal from 'hooks/use-global';
import { find } from 'lib/lodash-utils';
import dynamic from 'next/dynamic';
import { ChangeEvent, Fragment, memo, useEffect, useMemo, useState } from 'react';
import { urqlClient } from '~common/graphql';
import { PaginationWrapper } from './components';

const PaginationClient = dynamic(
  () =>
    Promise.resolve(
      ({
        count,
        page,
        onChange,
      }: {
        count: number;
        page: number;
        onChange: (event: ChangeEvent<unknown>, page: number) => void;
      }) => (
        <Pagination
          count={count}
          size="large"
          color="primary"
          page={page}
          defaultPage={1}
          siblingCount={6}
          onChange={onChange}
          className="pagination-coins-list"
        />
      )
    ),
  { ssr: false }
);

interface CoinsListProps {
  markets: BinanceMarket[];
}

interface MarketsResponse {
  markets: BinanceMarket[];
}

const CoinsList = memo(({ markets }: CoinsListProps) => {
  const { coinListPage, coinPageNeedle, setCoinListPage } = useGlobal();
  const [dataCount, setDataCount] = useState<CountResponse | null>(null);
  const [data, setData] = useState<MarketsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const networkStatus = data ? 7 : 4;

  const fetchCount = async () => {
    const result = await urqlClient.query(GET_COUNT, {}).toPromise();
    if (!result.error) {
      setDataCount(result.data as CountResponse);
    }
  };

  const fetchMarkets = async () => {
    setLoading(true);
    const result = await urqlClient
      .query(GET_MARKETS, {
        term: coinPageNeedle,
      })
      .toPromise();
    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data as MarketsResponse);
    }
    setLoading(false);
  };

  const getListSlice = (limit: number) => {
    const list = dataCoins ? [...dataCoins] : [];

    if (shouldQuerySearch) {
      return list;
    }

    const offset = (coinListPage - 1) * limit;

    return list.splice(offset, limit);
  };

  const handleChange = (event: ChangeEvent<unknown>, page: number) => {
    setCoinListPage(page);
  };

  useEffect(() => {
    fetchCount();
  }, []);

  useEffect(() => {
    if (!shouldQuerySearch) {
      setData(null);
      return;
    }

    fetchMarkets();
  }, [coinPageNeedle]);

  const shouldQuerySearch = coinPageNeedle && coinPageNeedle.trim().length >= 2;
  const dataCoins = shouldQuerySearch ? (data?.markets ?? []) : markets;

  const hidePagination = shouldQuerySearch;
  const coinsList = useMemo(() => getListSlice(COINS_PER_PAGE), [dataCoins, coinPageNeedle, coinListPage]);
  const coinsTotal = useMemo(
    () => (dataCount && dataCount.count ? (find(dataCount.count, { name: 'markets' })?.count ?? 0) : 0),
    [dataCount]
  );
  const paginationPages = useMemo(() => Math.floor(coinsTotal / COINS_PER_PAGE), [coinsTotal]);

  return (
    <Fragment>
      {error && <Typography>Error! {error.message}</Typography>}

      {coinsList && !coinsList.length && networkStatus === 7 && (
        <Typography variant="subtitle1">No results...</Typography>
      )}

      {loading && !coinsList.length && (
        <Loader text={<Typography variant="subtitle1">Loading coins list...</Typography>} />
      )}

      {coinsList && <CoinsListMap markets={coinsList} />}

      {!hidePagination && (
        <PaginationWrapper>
          <PaginationClient count={paginationPages} page={coinListPage} onChange={handleChange} />
        </PaginationWrapper>
      )}
    </Fragment>
  );
});

CoinsList.displayName = 'CoinsList';

export default CoinsList;
