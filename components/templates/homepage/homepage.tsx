import { Button, Grid, Icon, Typography } from '@mui/material';
import clsx from 'clsx';
import Link from 'next/link';
import { Parallax } from 'react-parallax';
import useStyles from './use-styles';

const Homepage = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Parallax bgImage="/assets/hero.jpg" strength={300} bgStyle={{ top: '-5%' }}>
        <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center' }}>
          <div className={classes.parallaxContent}>
            <Typography
              variant="h2"
              gutterBottom
              color="inherit"
              className={clsx(classes.typographyShadow, classes.typographyMainTitle)}
            >
              Altcash Demo
            </Typography>
            <Typography variant="h4" gutterBottom color="inherit" className={classes.typographyShadow}>
              Learn Cryptocurrency Trading Risk-Free
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              color="inherit"
              className={classes.typographyShadow}
              sx={{ fontSize: '1.1rem', marginTop: '1rem' }}
            >
              Educational Demo Platform • No Real Transactions • Live Market Data
            </Typography>
            <hr className={classes.heroDivider} />
            <Link href="/buy">
              <Button variant="contained" color="primary" size="large" className={classes.ctoButton}>
                Buy Altcoins now
              </Button>
            </Link>
          </div>
        </div>
      </Parallax>

      <Grid className={classes.gridContainer} container alignContent="center" justifyContent="center">
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
            <Button variant="contained" color="secondary" size="large" className={classes.ctoButton}>
              Explore Cryptocurrencies
            </Button>
          </Link>
        </Grid>
      </Grid>

      <Parallax bgImage="/assets/section.jpg" strength={300} bgStyle={{ top: '-20%' }}>
        <div style={{ minHeight: '45vh' }}>
          <div className={classes.parallaxContent}>
            <Grid container alignContent="center" justifyContent="center">
              <Grid size={{ xs: 12, sm: 5, lg: 4 }} className={classes.gridOverlayItem}>
                <Typography variant="subtitle1" gutterBottom color="primary" align="center">
                  About This Demo
                </Typography>
                <Typography variant="body1" color="inherit" align="left">
                  Altcash Demo is an educational platform showcasing modern cryptocurrency trading interfaces. Built
                  with real-time market data, it provides a risk-free environment to learn about Bitcoin, Ethereum, and
                  altcoins. Perfect for beginners and crypto enthusiasts who want to understand how trading platforms
                  work.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 5, lg: 4 }} className={classes.gridOverlayItem}>
                <Typography variant="subtitle1" gutterBottom color="primary" align="center">
                  Learn More
                </Typography>
                <Typography variant="body1" gutterBottom color="inherit" align="left">
                  Explore our comprehensive resources to understand cryptocurrency trading better.
                </Typography>
                <Typography variant="body1" color="inherit" align="left">
                  <Button variant="text" size="small" href="/about">
                    <Icon className={classes.leftIcon}>info</Icon> About Altcash Demo
                  </Button>
                  <Button variant="text" size="small" href="/support">
                    <Icon className={classes.leftIcon}>help</Icon> FAQ & Support
                  </Button>
                  <Button variant="text" size="small" href="/buy">
                    <Icon className={classes.leftIcon}>trending_up</Icon> Explore Markets
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      </Parallax>
    </div>
  );
};

export default Homepage;
