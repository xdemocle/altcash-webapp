'use client';

import { ArrowBack } from '@mui/icons-material';
import { Grid, ListItem, Tooltip } from '@mui/material';
import type { Metadata, PageDataResponse, PairResponse } from 'graphql/types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { btcToRandPriceWithSymbol } from '~/common/currency';
import { urqlClient } from '~/common/graphql';
import CoinSVG from '~/components/atoms/coin-svg';
import LinkExtBlank from '~/components/atoms/link-ext-blank';
import CoinBuy from '~/components/templates/coin-buy';
import { GET_META_COIN, GET_PAGE_DATA, GET_PAIR } from '~/graphql/queries';
import {
  BackButton,
  BoxBuy,
  Card,
  Column,
  DataParagraph,
  InfoParagraph,
  Inner,
  Links,
  PageAvatar,
  Progress,
  Root,
  StyledPaper,
  Title,
} from './components';

interface CoinPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CoinPage({ params }: CoinPageProps) {
  const router = useRouter();
  const [coinId, setCoinId] = useState<string>('');

  useEffect(() => {
    params.then(resolvedParams => {
      setCoinId(String(resolvedParams.id).toUpperCase());
    });
  }, [params]);
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

  const dataCoin = data?.market;
  const dataSummary = data?.summary;
  const dataTicker = data?.ticker;
  const metaCoin = metadata?.metaCoin;
  const bitcoinRandPrice = Number(dataPair?.pair?.last_trade ?? 1);
  const tickerPriceNumber = Number(dataTicker?.price ?? 0);

  const handleBackButton = () => {
    router.push('/buy');
  };

  return (
    <Root>
      <Tooltip title="Go back to coin list">
        <BackButton
          color="primary"
          variant="outlined"
          aria-label="Find a coin"
          onClick={handleBackButton}
          startIcon={<ArrowBack />}
        >
          Back
        </BackButton>
      </Tooltip>

      <Inner>
        <Title color="primary" variant="h4" gutterBottom>
          {dataCoin?.name || coinId}
        </Title>

        <PageAvatar>
          {loading && <Progress size="4rem" />}
          {!loading && !metaCoin?.description && <CoinSVG coinSymbol={coinId || ''} />}
          {!loading && metaCoin?.logo && (
            <Image src={metaCoin.logo} width="64" height="64" alt={metaCoin.logo} title={metaCoin.name} />
          )}
        </PageAvatar>

        <InfoParagraph variant="h6" gutterBottom>
          Buy now
        </InfoParagraph>

        <BoxBuy>
          <CoinBuy coin={dataCoin} ticker={dataTicker} />
        </BoxBuy>

        <InfoParagraph variant="h6" gutterBottom>
          Market Details & Statistics
        </InfoParagraph>
        <DataParagraph aria-label="Coin Data">
          <ListItem divider>
            <Column primary={<strong>Current Buy Price</strong>} />
            {dataTicker?.price && bitcoinRandPrice ?
              <Column
                primary={btcToRandPriceWithSymbol(tickerPriceNumber, bitcoinRandPrice)}
                secondary={`${dataTicker.price} BTC`}
              />
            : null}
          </ListItem>
          <ListItem divider>
            <Column primary="Price Change" />
            <Column primary={`${dataSummary?.percentChange}%`} secondary={'Last 24hrs'} />
          </ListItem>
          <ListItem divider>
            <Column primary="Price at Highest" />
            {dataSummary?.high && bitcoinRandPrice ?
              <Column
                primary={btcToRandPriceWithSymbol(dataSummary.high, bitcoinRandPrice)}
                secondary={`${dataSummary.high} BTC`}
              />
            : null}
          </ListItem>
          <ListItem divider>
            <Column primary="Price at Lowest" />
            {dataSummary?.low && bitcoinRandPrice ?
              <Column
                primary={btcToRandPriceWithSymbol(dataSummary.low, bitcoinRandPrice)}
                secondary={`${dataSummary.low} BTC`}
              />
            : null}
          </ListItem>
          <ListItem divider>
            <Column primary="Trading Volume" />
            <Column
              primary={`${dataSummary?.volume?.toFixed(2)} ${dataCoin?.symbol}`}
              secondary={`of ${dataCoin?.name}`}
            />
          </ListItem>
          <ListItem divider>
            <Column primary="Quote Volume" />
            <Column
              primary={`${btcToRandPriceWithSymbol(dataSummary?.quoteVolume ?? 0, bitcoinRandPrice)}`}
              secondary={`${dataSummary?.quoteVolume?.toFixed(2)} BTC`}
            />
          </ListItem>
        </DataParagraph>

        {metaCoin?.description && (
          <Fragment>
            <InfoParagraph variant="h6" gutterBottom>
              Description
            </InfoParagraph>
            <Card>
              <InfoParagraph variant="body1">{metaCoin.description}</InfoParagraph>
            </Card>
          </Fragment>
        )}

        {metaCoin?.urls && (
          <Links>
            <InfoParagraph variant="h6" gutterBottom>
              Links
            </InfoParagraph>
            <Grid container>
              {!!metaCoin.urls.website?.length && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <StyledPaper>
                    <strong>Website:</strong>
                    <br />
                    {metaCoin.urls.website.map((url: string) => (
                      <LinkExtBlank key={url} url={url} br />
                    ))}
                  </StyledPaper>
                </Grid>
              )}

              {!!metaCoin.urls.twitter?.length && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <StyledPaper>
                    <strong>Social Media:</strong>
                    <br />
                    {metaCoin.urls.twitter.map((url: string) => (
                      <LinkExtBlank key={url} url={url} br />
                    ))}
                  </StyledPaper>
                </Grid>
              )}

              {!!metaCoin.urls.chat?.length && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <StyledPaper>
                    <strong>Chat:</strong>
                    <br />
                    {metaCoin.urls.chat.map((url: string) => (
                      <LinkExtBlank key={url} url={url} br />
                    ))}
                  </StyledPaper>
                </Grid>
              )}
            </Grid>
          </Links>
        )}
      </Inner>
    </Root>
  );
}
