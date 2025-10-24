import { Paper, Tab, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export const Root = styled('div')(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(2),
  marginLeft: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  marginRight: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(2),
    marginLeft: theme.spacing(5),
    paddingBottom: theme.spacing(5),
    marginRight: theme.spacing(5),
  },
}));

export const Title = styled(Typography)(({ theme }) => ({
  lineHeight: '3rem',
  marginTop: '-3.25rem !important',
}));

export const ButtonLoadMore = styled('div')(({ theme }) => ({
  margin: '0 auto',
}));

export const RightIcon = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

export const ButtonProgress = styled('div')(({ theme }) => ({
  color: green[500],
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: -12,
  marginLeft: -12,
}));

export const BottomListWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  textAlign: 'center',
  margin: theme.spacing(1),
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: '1rem 0',
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  maxWidth: 'none',
  minWidth: 'auto',
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 0,
  textDecoration: 'none !important',
}));
