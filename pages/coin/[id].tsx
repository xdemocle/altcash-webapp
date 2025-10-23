import { ArrowBack } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { btcToRandPriceWithSymbol } from '../../common/currency';
import { urqlClient } from '../../common/graphql-client';
import CoinSVG from '../../components/atoms/coin-svg';
import LinkExtBlank from '../../components/atoms/link-ext-blank';
import CoinBuy from '../../components/templates/coin-buy';
import {
  GET_META_COIN,
  GET_PAGE_DATA,
  GET_PAIR, // GET_META_COIN_LOGO
} from '../../graphql/queries';
import type { Market, Metadata, PageDataResponse, PairResponse, Summary, Ticker } from '../../graphql/types';
import useStyles from '../../styles/coin-use-styles';

const fallbackMarket: Market = {
  id: '',
  symbol: '',
  name: '',
  status: '',
  quotePrecision: 0,
  minTradeSize: 0,
  minNotional: 0,
  stepSize: 1,
};

const fallbackSummary: Summary = {
  id: '',
  high: 0,
  low: 0,
  volume: 0,
  quoteVolume: 0,
  percentChange: 0,
};

const fallbackTicker: Ticker = {
  id: '',
  price: '0',
};

const CoinPage: NextPage = () => {
  const { classes } = useStyles();
  const router = useRouter();
  const { id } = router.query;
  const coinId = String(id).toUpperCase();
  const [data, setData] = useState<PageDataResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId || coinId === 'UNDEFINED') return;

    const fetchPageData = async () => {
      setLoading(true);
      const result = await urqlClient
        .query(GET_PAGE_DATA, {
          id: coinId,
        })
        .toPromise();
      if (!result.error) {
        setData(result.data as PageDataResponse);
      }
      setLoading(false);
    };
    fetchPageData();
  }, [coinId]);

  const [metadata, setMetadata] = useState<{ metaCoin: Metadata } | null>(null);
  const [dataPair, setDataPair] = useState<PairResponse | null>(null);

  useEffect(() => {
    if (!coinId || coinId === 'UNDEFINED') return;

    const fetchMetadata = async () => {
      const result = await urqlClient
        .query(GET_META_COIN, {
          id: coinId,
        })
        .toPromise();
      if (!result.error) {
        setMetadata(result.data as { metaCoin: Metadata });
      }
    };
    fetchMetadata();
  }, [coinId]);

  useEffect(() => {
    const fetchPair = async () => {
      const result = await urqlClient
        .query(GET_PAIR, {
          pair: 'XBTZAR',
        })
        .toPromise();
      if (!result.error) {
        setDataPair(result.data as PairResponse);
      }
    };
    fetchPair();
  }, []);

  const dataCoin = data?.market ?? fallbackMarket;
  const dataSummary = data?.summary ?? fallbackSummary;
  const dataTicker = data?.ticker ?? fallbackTicker;
  const metaCoin = metadata?.metaCoin;
  const bitcoinRandPrice = Number(dataPair?.pair?.last_trade ?? 1);
  const tickerPriceNumber = Number(dataTicker.price);

  const handleBackButton = () => {
    router.push('/buy');
    // TODO refactor
    // if (history.action === 'PUSH') {
    //   history.goBack();
    // } else {
    //   router.push('/buy');
    // }
  };

  return (
    <div className={classes.root}>
      <Tooltip title="Go back to coin list">
        <Button
          color="primary"
          size="large"
          aria-label="Find a coin"
          onClick={handleBackButton}
          startIcon={<ArrowBack />}
          className={classes.backButton}
        >
          Back
        </Button>
      </Tooltip>

      <div className={classes.inner}>
        <Typography color="primary" variant="h4" gutterBottom className={classes.title}>
          {dataCoin.name || coinId}
        </Typography>

        <div className={classes.pageAvatar}>
          {loading && <CircularProgress className={classes.progress} size="4rem" />}
          {!loading && !metaCoin?.description && <CoinSVG coinSymbol={coinId || ''} />}
          {!loading && metaCoin?.logo && (
            <Image src={metaCoin.logo} width="64" height="64" alt={metaCoin.logo} title={metaCoin.name} />
          )}
        </div>

        <Typography variant="h6" gutterBottom className={classes.infoParagraph}>
          Buy now
        </Typography>

        <div className={classes.boxBuy}>
          <CoinBuy coin={dataCoin} ticker={dataTicker} />
        </div>

        <Typography variant="h6" gutterBottom className={classes.infoParagraph}>
          Market Details & Statistics
        </Typography>
        <List className={classes.dataParagraph} aria-label="Coin Data">
          <ListItem divider>
            <ListItemText primary={<strong>Current Buy Price</strong>} className={classes.column} />
            {dataTicker.price && bitcoinRandPrice ?
              <ListItemText
                primary={btcToRandPriceWithSymbol(tickerPriceNumber, bitcoinRandPrice)}
                secondary={`${dataTicker.price} BTC`}
                className={classes.column}
              />
            : null}
          </ListItem>
          <ListItem divider>
            <ListItemText primary="Price Change" className={classes.column} />
            <ListItemText
              primary={`${dataSummary.percentChange}%`}
              secondary={'Last 24hrs'}
              className={classes.column}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText primary="Price at Highest" className={classes.column} />
            {dataSummary.high && bitcoinRandPrice ?
              <ListItemText
                primary={btcToRandPriceWithSymbol(dataSummary.high, bitcoinRandPrice)}
                secondary={`${dataSummary.high} BTC`}
                className={classes.column}
              />
            : null}
          </ListItem>
          <ListItem divider>
            <ListItemText primary="Price at Lowest" className={classes.column} />
            {dataSummary.low && bitcoinRandPrice ?
              <ListItemText
                primary={btcToRandPriceWithSymbol(dataSummary.low, bitcoinRandPrice)}
                secondary={`${dataSummary.low} BTC`}
                className={classes.column}
              />
            : null}
          </ListItem>
          <ListItem divider>
            <ListItemText primary="Trading Volume" className={classes.column} />
            <ListItemText
              primary={`${dataSummary.volume.toFixed(2)} ${dataCoin.symbol}`}
              secondary={`of ${dataCoin.name}`}
              className={classes.column}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText primary="Quote Volume" className={classes.column} />
            <ListItemText
              primary={`${btcToRandPriceWithSymbol(dataSummary.quoteVolume, bitcoinRandPrice)}`}
              secondary={`${dataSummary.quoteVolume.toFixed(2)} BTC`}
              className={classes.column}
            />
          </ListItem>
        </List>

        {metaCoin?.description && (
          <Fragment>
            <Typography variant="h6" gutterBottom className={classes.infoParagraph}>
              Description
            </Typography>
            <Paper className={classes.card}>
              <Typography variant="body1">{metaCoin.description}</Typography>
            </Paper>
          </Fragment>
        )}

        {metaCoin?.urls && (
          <div className={classes.links}>
            <Typography variant="h6" gutterBottom className={classes.infoParagraph}>
              Links
            </Typography>
            <Grid container>
              {!!metaCoin.urls.website?.length && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper className={classes.paper}>
                    <strong>Website:</strong>
                    <br />
                    {metaCoin.urls.website.map((url: string) => (
                      <LinkExtBlank key={url} url={url} br />
                    ))}
                  </Paper>
                </Grid>
              )}

              {!!metaCoin.urls.twitter?.length && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper className={classes.paper}>
                    <strong>Social Media:</strong>
                    <br />
                    {metaCoin.urls.twitter.map((url: string) => (
                      <LinkExtBlank key={url} url={url} br />
                    ))}
                  </Paper>
                </Grid>
              )}

              {!!metaCoin.urls.chat?.length && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper className={classes.paper}>
                    <strong>Chat:</strong>
                    <br />
                    {metaCoin.urls.chat.map((url: string) => (
                      <LinkExtBlank key={url} url={url} br />
                    ))}
                  </Paper>
                </Grid>
              )}
            </Grid>
          </div>
        )}
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: false,
  };
}

export default CoinPage;

// export async function getStaticPaths() {
//     query: GET_META_COIN_LOGO
//   });
//   // Get the paths we want to pre-render
//   const paths = data?.metaCoinAll?.map((coin: Metadata) => ({
//     params: { id: coin.symbol.toLowerCase() }
//   }));

//   // We'll pre-render only these paths at build time.
//   return { paths, fallback: true };
// }
// export async function getStaticProps() {
//     query: GET_META_COIN_LOGO
//   });
//   return {
//     props: {
//       metaCoinAll: data.metaCoinAll
//     }
//   };
// }
