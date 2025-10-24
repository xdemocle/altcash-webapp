'use client';

import { List as ListIcon, NewReleases as NewReleasesIcon, Star } from '@mui/icons-material';
import { Paper, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BUY_TAB_ALL, BUY_TAB_FAVOURITE, BUY_TAB_FEATURED, SYMBOLS_FEATURED } from '~/common/constants';
import { urqlClient } from '~/common/graphql';
import TopBarSearch from '~/components/organisms/top-bar-search';
import CoinsList from '~/components/templates/coins-list';
import CoinsUserList from '~/components/templates/coins-user-list';
import { GET_MARKETS, GET_META_COIN_LOGO, GET_PAIR, GET_TICKER } from '~/graphql/queries';
import { Market } from '~/graphql/types';
import useGlobal from '~/hooks/use-global';
import useStyles from '~/styles/buy-use-styles';

interface BuyTabPageProps {
  params: Promise<{
    tab: string;
  }>;
}

export default function BuyTabPage({ params }: BuyTabPageProps) {
  const router = useRouter();
  const { classes } = useStyles();
  const { tab: tabNumber, setTab } = useGlobal();
  const [tab, setTabState] = useState<string>('featured');

  useEffect(() => {
    params.then((resolvedParams) => {
      setTabState(resolvedParams.tab);
    });
  }, [params]);
  const symbolsFeatured = SYMBOLS_FEATURED.sort();

  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    urqlClient.query(GET_META_COIN_LOGO, {}).toPromise();
  }, []);

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      try {
        let symbols = '';

        if (tab === 'featured') {
          symbols = SYMBOLS_FEATURED.sort().join('|');
        }

        const marketsResult = await urqlClient
          .query<{ markets: Market[] }>(GET_MARKETS, {
            ...(symbols ? { symbols } : {}),
          })
          .toPromise();

        await urqlClient
          .query(GET_PAIR, {
            pair: 'XBTZAR',
          })
          .toPromise();

        const marketsData = marketsResult.data?.markets || [];

        // Filter out markets with undefined IDs
        const validMarkets = marketsData.filter((market: Market) => market.id && market.id !== 'undefined');

        await Promise.all(
          validMarkets.map((market: Market) =>
            urqlClient
              .query(GET_TICKER, {
                id: market.id,
              })
              .toPromise()
              .catch(() => null)
          )
        );

        setMarkets(validMarkets);
      } catch (error) {
        console.debug('Failed to fetch markets:', error);
        setMarkets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [tab]);

  const handleChange = (tabNumber: number) => {
    setTab(tabNumber);
    let slug = 'featured';

    if (tabNumber === BUY_TAB_FEATURED) {
      slug = 'featured';
    } else if (tabNumber === BUY_TAB_ALL) {
      slug = 'all';
    } else if (tabNumber === BUY_TAB_FAVOURITE) {
      slug = 'favourite';
    }

    router.push(`/buy/${slug}`);
  };

  // This affect only the selected UI tab
  useEffect(() => {
    let slug = 0;

    if (tab === 'featured') {
      slug = BUY_TAB_FEATURED;
    } else if (tab === 'all') {
      slug = BUY_TAB_ALL;
    } else if (tab === 'favourite') {
      slug = BUY_TAB_FAVOURITE;
    }

    setTab(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div className={classes.root}>
      <Typography color="primary" variant="h4" gutterBottom className={classes.title}>
        Altcoins
      </Typography>

      <TopBarSearch />

      <Paper className={classes.paper}>
        <Tabs
          value={tabNumber}
          onChange={(_evt, tabNumber) => handleChange(tabNumber)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Featured" icon={<NewReleasesIcon />} classes={{ root: classes.tabRoot }} />
          <Tab label="All Coins" icon={<ListIcon />} classes={{ root: classes.tabRoot }} />
          <Tab label="Favourite" icon={<Star />} classes={{ root: classes.tabRoot }} />
        </Tabs>
      </Paper>

      {!loading && tab === 'featured' && <CoinsUserList markets={markets} predefined={symbolsFeatured} />}
      {!loading && tab === 'all' && <CoinsList markets={markets} />}
      {!loading && tab === 'favourite' && <CoinsUserList markets={markets} />}
    </div>
  );
}
