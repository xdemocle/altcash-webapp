import { Box, Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  display: 'grid',
}));

export const ConfirmationGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    width: '75%',
    paddingRight: '2.5%',
    flexDirection: 'row',
  },
}));

export const ConfirmationGridCol = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '2.5rem',
  '&:first-of-type': { marginTop: 0 },
  [theme.breakpoints.up('md')]: {
    marginTop: 0,
    width: '49%',
  },
}));

export const ConfirmationGridCard = styled(Card)(({ theme }) => ({
  padding: '2rem',
  height: 'auto',
}));

export const ConfirmationTitle = styled('h2')(({ theme }) => ({
  marginTop: 0,
  color: theme.palette.primary.main,
}));

export const ConfirmationTitleRed = styled('h4')(({ theme }) => ({
  marginTop: 0,
  color: theme.palette.error.main,
}));

export const ConfirmationLoader = styled(Box)(({ theme }) => ({
  marginTop: '1rem',
  marginBottom: '1rem',
  textAlign: 'center',
  height: '10rem',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}));

export const ConfirmationSeparator = styled('hr')(({ theme }) => ({
  height: 0,
  borderWidth: '0 0 0.1rem',
  borderStyle: 'solid',
  borderColor: theme.palette.primary.main,
}));

export const ConfirmationLoaderText = styled('div')(({ theme }) => ({
  marginTop: '1rem',
  marginLeft: '1rem',
}));

export const Logs = styled('div')(({ theme }) => ({
  padding: '0.1rem 0.5rem',
  fontSize: '0.75rem',
  fontWeight: 900,
  height: '3.5rem',
  background: '#f9f7f7',
  overflow: 'auto',
}));

export const OrderReference = styled('div')(({ theme }) => ({
  fontWeight: 200,
  marginTop: '0.25rem',
  width: '100%',
  maxWidth: '25rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}));
