'use client';

import { Grid, Typography } from '@mui/material';
import { Info, Help, TrendingUp } from '@mui/icons-material';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  CTOButton,
  GridContainer,
  GridOverlayItem,
  HeroDivider,
  LeftIconButton,
  ParallaxContainer,
  ParallaxContent,
  Root,
  StyledTypography,
} from './components';

const Parallax = dynamic(() => import('react-parallax').then(m => m.Parallax), {
  ssr: false,
});

const Homepage = () => {
  return (
    <Root>
      <Parallax bgImage="/assets/hero.jpg" strength={300} bgStyle={{ top: '-5%' }}>
        <ParallaxContainer>
          <ParallaxContent>
            <StyledTypography variant="h2" gutterBottom color="inherit">
              Altcash Demo
            </StyledTypography>
            <StyledTypography variant="h4" gutterBottom color="inherit">
              Learn Cryptocurrency Trading Risk-Free
            </StyledTypography>
            <StyledTypography
              variant="body1"
              gutterBottom
              color="inherit"
              sx={{ fontSize: '1.1rem', marginTop: '1rem' }}
            >
              Educational Demo Platform • No Real Transactions • Live Market Data
            </StyledTypography>
            <HeroDivider />
            <Link href="/buy">
              <CTOButton variant="contained" color="primary" size="large">
                Buy Altcoins now
              </CTOButton>
            </Link>
          </ParallaxContent>
        </ParallaxContainer>
      </Parallax>

      <GridContainer container alignContent="center" justifyContent="center">
        <Grid size={12}>
          <Typography variant="h4" gutterBottom color="primary" align="center">
            Explore Cryptocurrency Trading with Confidence
          </Typography>
          <Typography variant="subtitle1" gutterBottom color="secondary" align="center">
            Altcash Demo is an educational platform designed to help you understand how cryptocurrency trading works.
            Explore live market data, learn about Bitcoin, Ethereum, and altcoins—all risk-free.
          </Typography>
          <Typography variant="subtitle2" gutterBottom color="secondary" align="center">
            <strong>Important:</strong> This is a demonstration platform only. No real transactions occur here.
          </Typography>
          <Link href="/buy">
            <CTOButton variant="contained" color="secondary" size="large">
              Explore Cryptocurrencies
            </CTOButton>
          </Link>
        </Grid>
      </GridContainer>

      <Parallax bgImage="/assets/section.jpg" strength={300} bgStyle={{ top: '-20%' }}>
        <div style={{ minHeight: '45vh' }}>
          <ParallaxContent>
            <Grid container alignContent="center" justifyContent="center">
              <GridOverlayItem size={{ xs: 12, sm: 5, lg: 4 }}>
                <Typography variant="subtitle1" gutterBottom color="primary" align="center">
                  About This Demo
                </Typography>
                <Typography variant="body1" color="inherit" align="left">
                  Altcash Demo is an educational platform showcasing modern cryptocurrency trading interfaces. Built
                  with real-time market data, it provides a risk-free environment to learn about Bitcoin, Ethereum, and
                  altcoins. Perfect for beginners and crypto enthusiasts who want to understand how trading platforms
                  work.
                </Typography>
              </GridOverlayItem>
              <GridOverlayItem size={{ xs: 12, sm: 5, lg: 4 }}>
                <Typography variant="subtitle1" gutterBottom color="primary" align="center">
                  Learn More
                </Typography>
                <Typography variant="body1" gutterBottom color="inherit" align="left">
                  Explore our comprehensive resources to understand cryptocurrency trading better.
                </Typography>
                <Typography variant="body1" color="inherit" align="left">
                  <LeftIconButton variant="text" size="small" href="/about">
                    <Info /> About Altcash Demo
                  </LeftIconButton>
                  <LeftIconButton variant="text" size="small" href="/support">
                    <Help /> FAQ & Support
                  </LeftIconButton>
                  <LeftIconButton variant="text" size="small" href="/buy">
                    <TrendingUp /> Explore Markets
                  </LeftIconButton>
                </Typography>
              </GridOverlayItem>
            </Grid>
          </ParallaxContent>
        </div>
      </Parallax>
    </Root>
  );
};

export default Homepage;
