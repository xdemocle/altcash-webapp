import { ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  textDecoration: 'none',
  color: '#2B3A41',
  '&:hover': {
    backgroundColor: 'rgba(24, 161, 30, 0.1)',
  },
}));

export const Column = styled(ListItemText)(({ theme }) => ({
  maxWidth: '35%',
  textDecoration: 'none !important',
}));

export const TickerColumn = styled(ListItemText)(({ theme }) => ({
  maxWidth: '35%',
  textDecoration: 'none !important',
  // Additional ticker-specific styles
  '&.ticker': {
    maxWidth: '30%',
  },
}));
