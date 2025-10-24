import { Box, Button, Card } from '@mui/material';
import { styled } from '@mui/material/styles';

export const RootCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(3),
  display: 'grid',
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

export const ConfirmationTitle = styled('h2')(({ theme }) => ({
  marginTop: 0,
  color: theme.palette.primary.main,
}));

export const BuyButton = styled(Button)(({ theme }) => ({
  minHeight: '3.5rem',
  width: '100%',
}));

export const ConfirmationSeparator = styled('hr')(({ theme }) => ({
  height: 1,
  border: '0.0625rem solid',
  borderColor: theme.palette.primary.main,
}));
