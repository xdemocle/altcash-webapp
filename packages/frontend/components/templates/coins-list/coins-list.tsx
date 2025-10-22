import { COINS_PER_PAGE } from '@/common/constants';
import { isServer } from '@/common/utils';
import Loader from '@/components/molecules/loader';
import CoinsListMap from '@/components/organisms/coins-list-map';
import { GET_COUNT, GET_MARKETS } from '@/graphql/queries';
import {
  CountResponse,
  Market,
  MarketsResponse,
  MarketsVariables
} from '@/graphql/types';
import useGlobal from '@/hooks/use-global';
import { useQuery } from '@apollo/client/react';
import { Pagination, Typography } from '@mui/material';
import { clone, find } from 'lodash';
import dynamic from 'next/dynamic';
import { ChangeEvent, Fragment, memo, useMemo } from 'react';
import useStyles from './use-styles';

const PaginationClient = dynamic(
  () => Promise.resolve(({ count, page, onChange }: any) => (
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
  )),
  { ssr: false }
);

interface CoinsListProps {
  markets: Market[];
}

const CoinsList = memo(({ markets }: CoinsListProps) => {
  const { classes } = useStyles();
  const { coinListPage, coinPageNeedle, setCoinListPage } = useGlobal();
  const { data: dataCount } = useQuery<CountResponse>(GET_COUNT, {
    fetchPolicy: 'cache-and-network'
  });
  const shouldQuerySearch = coinPageNeedle && coinPageNeedle.trim().length >= 2;
  const { loading, error, data, networkStatus } = useQuery<
    MarketsResponse,
    MarketsVariables
  >(GET_MARKETS, {
    // We refresh data list at least at reload
    fetchPolicy: 'cache-and-network',
    skip: !shouldQuerySearch,
    variables: {
      term: shouldQuerySearch ? coinPageNeedle : ''
    }
  });
  const dataCoins = shouldQuerySearch ? (data?.markets ?? []) : markets;

  const getListSlice = (limit: number) => {
    const list = dataCoins ? clone(dataCoins) : [];

    if (shouldQuerySearch) {
      return list;
    }

    const offset = (coinListPage - 1) * limit;

    return list.splice(offset, limit);
  };

  const handleChange = (event: ChangeEvent<unknown>, page: number) => {
    setCoinListPage(page);
  };

  const hidePagination = shouldQuerySearch;
  const coinsList = useMemo(
    () => getListSlice(COINS_PER_PAGE),
    [dataCoins, coinPageNeedle, coinListPage]
  );
  const coinsTotal = useMemo(
    () =>
      dataCount && dataCount.count
        ? (find(dataCount.count, { name: 'markets' })?.count ?? 0)
        : 0,
    [dataCount]
  );
  const paginationPages = useMemo(
    () => Math.floor(coinsTotal / COINS_PER_PAGE),
    [coinsTotal]
  );

  return (
    <Fragment>
      {error && <Typography>Error! {error.message}</Typography>}

      {coinsList && !coinsList.length && networkStatus === 7 && (
        <Typography variant="subtitle1">No results...</Typography>
      )}

      {loading && !coinsList.length && (
        <Loader
          text={
            <Typography variant="subtitle1">Loading coins list...</Typography>
          }
        />
      )}

      {coinsList && <CoinsListMap markets={coinsList} />}

      {!hidePagination && (
        <div className={classes.pagination}>
          <PaginationClient
            count={paginationPages}
            page={coinListPage}
            onChange={handleChange}
          />
        </div>
      )}
    </Fragment>
  );
});

CoinsList.displayName = 'CoinsList';

export default CoinsList;
