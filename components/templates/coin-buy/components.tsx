import { Box, Button, Card, InputLabel, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const RootCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  display: 'grid',
}));

export const GridWrapper = styled('div')(({ theme }) => ({
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

export const GridItem = styled('div')(({ theme }) => ({
  paddingRight: 0,
  [theme.breakpoints.up('md')]: {
    padding: 0,
  },
}));

export const GridTitle = styled(InputLabel)(({ theme }) => ({
  display: 'block',
  color: theme.palette.grey[600],
  fontSize: '.9rem',
  marginBottom: theme.spacing(1),
}));

export const Symbol = styled('strong')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const BoxBuyButtonRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'end',
  width: '100%',
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
    top: '3.3rem',
    right: '1.5rem',
    width: '25%',
  },
}));

export const BoxBuyLed = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '1.5rem',
  right: '1.5rem',
}));

export const BuyButtonContainer = styled('div')(({ theme }) => ({
  marginLeft: 0,
  marginTop: '2.5rem',
  width: '100%',
  [theme.breakpoints.up('md')]: {
    paddingBottom: '1.45rem',
    marginLeft: theme.spacing(2),
    marginTop: 0,
  },
}));

export const BuyButton = styled(Button)(({ theme }) => ({
  minHeight: '3.5rem',
  width: '100%',
}));

export const Flex = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '0',
  height: 'auto',
  [theme.breakpoints.up('md')]: {
    marginTop: '31px',
    height: '56px',
  },
}));

export const InnerCard = styled(Card)(({ theme }) => ({
  transition: 'all 300ms !important',
  overflow: 'hidden',
  height: 0,
  width: '95%',
  margin: '0 auto',
  marginTop: '-0.1rem',
  textAlign: 'right',
}));

export const InnerCardOpen = styled('div')(() => ({
  height: '9rem',
}));

export const InnerCardRoot = styled('div')(({ theme }) => ({
  padding: '1rem',
}));

export const ConfirmationTitle = styled(Typography)(({ theme }) => ({
  marginTop: 0,
  color: theme.palette.primary.main,
}));

export const ConfirmationTitleRed = styled(Typography)(({ theme }) => ({
  marginTop: 0,
  color: theme.palette.error.main,
}));

export const ConfirmationLoader = styled(Box)(({ theme }) => ({
  marginTop: '1rem',
  marginBottom: '1rem',
}));

export const ConfirmationGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

export const ConfirmationSeparator = styled('hr')(({ theme }) => ({
  height: 1,
  border: '0.0625rem solid',
  borderColor: theme.palette.primary.main,
}));
