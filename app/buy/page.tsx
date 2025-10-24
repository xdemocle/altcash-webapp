'use client';

import { List as ListIcon, NewReleases as NewReleasesIcon, Star } from '@mui/icons-material';
import { Paper, Tab, Tabs, Typography } from '@mui/material';
import { ValueOf } from 'next/dist/shared/lib/constants';
import { useEffect, useState } from 'react';
import { BUY_TAB_ALL, BUY_TAB_FAVOURITE, BUY_TAB_FEATURED, SYMBOLS_FEATURED } from '~/common/constants';
import { urqlClient } from '~/common/graphql';
import TopBarSearch from '~/components/organisms/top-bar-search';
import CoinsList from '~/components/templates/coins-list';
import CoinsUserList from '~/components/templates/coins-user-list';
import { GET_MARKETS, GET_META_COIN_LOGO, GET_PAIR } from '~/graphql/queries';
import { Market } from '~/graphql/types';
import useGlobal from '~/hooks/use-global';
import useStyles from '~/styles/buy-use-styles';

interface MarketCache {
  [key: number]: { markets: Market[]; loading: boolean; loaded: boolean };
}

const DEFAULT_MARKET_CACHE: ValueOf<MarketCache> = { markets: [], loading: true, loaded: false };

export default function BuyPage() {
  const { classes } = useStyles();
  const { tab: activeTab, setTab } = useGlobal();
  const [marketsCache, setMarketsCache] = useState<MarketCache>(DEFAULT_MARKET_CACHE);

  const symbolsFeatured = SYMBOLS_FEATURED.sort();

  // Pre-fetch meta coin logo data once
  useEffect(() => {
    urqlClient
      .query(GET_META_COIN_LOGO, {
        requestPolicy: 'cache-and-network',
      })
      .toPromise();
  }, []);

  // Data fetching function
  const fetchMarketsForTab = async (tabNumber: number) => {
    if (tabNumber === BUY_TAB_FAVOURITE) {
      setMarketsCache(prev => ({
        ...prev,
        [tabNumber]: { ...prev[tabNumber], loading: false, loaded: true, markets: [] },
      }));

      return;
    }

    setMarketsCache(prev => ({
      ...prev,
      [tabNumber]: { ...prev[tabNumber], loading: true, loaded: false, markets: [] },
    }));

    try {
      let symbols = '';

      if (tabNumber === BUY_TAB_FEATURED) {
        symbols = SYMBOLS_FEATURED.sort().join('|');
      }

      const marketsResult = await urqlClient
        .query<{ markets: Market[] }>(GET_MARKETS, {
          ...(symbols.length > 0 ? { symbols } : {}),
        })
        .toPromise();

      // Pre-fetch XBTZAR pair data
      await urqlClient
        .query(GET_PAIR, {
          pair: 'XBTZAR',
          requestPolicy: 'cache-and-network',
        })
        .toPromise();

      const marketsData = marketsResult.data?.markets || [];
      const validMarkets = marketsData.filter((market: Market) => market.id && market.id !== 'undefined');

      setMarketsCache(prev => ({
        ...prev,
        [tabNumber]: {
          markets: validMarkets,
          loading: false,
          loaded: true,
        },
      }));
    } catch (error) {
      console.debug('Failed to fetch markets:', error);
      setMarketsCache(prev => ({
        ...prev,
        [tabNumber]: {
          markets: [],
          loading: false,
          loaded: true,
        },
      }));
    }
  };

  // Load data for current tab on mount
  useEffect(() => {
    fetchMarketsForTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (newTab: number) => {
    setTab(newTab);
  };

  const currentTabData = marketsCache[activeTab] || DEFAULT_MARKET_CACHE;

  return (
    <div className={classes.root}>
      <Typography color="primary" variant="h4" gutterBottom className={classes.title}>
        Altcoins
      </Typography>

      <TopBarSearch />

      <Paper className={classes.paper}>
        <Tabs
          value={activeTab}
          onChange={(_evt, tabNumber) => handleTabChange(tabNumber)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Featured" icon={<NewReleasesIcon />} classes={{ root: classes.tabRoot }} />
          <Tab label="All Coins" icon={<ListIcon />} classes={{ root: classes.tabRoot }} />
          <Tab label="Favourite" icon={<Star />} classes={{ root: classes.tabRoot }} />
        </Tabs>
      </Paper>

      {/* Render content based on active tab */}
      {!currentTabData.loading && activeTab === BUY_TAB_FEATURED && (
        <CoinsUserList markets={currentTabData.markets} predefined={symbolsFeatured} />
      )}
      {!currentTabData.loading && activeTab === BUY_TAB_ALL && <CoinsList markets={currentTabData.markets} />}
      {!currentTabData.loading && activeTab === BUY_TAB_FAVOURITE && <CoinsUserList />}

      {/* Show loading state */}
      {currentTabData.loading && <Typography>Loading...</Typography>}
    </div>
  );
}
