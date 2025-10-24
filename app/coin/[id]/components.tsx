import { Button, CircularProgress, List, ListItemText, Paper, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';

export const Root = styled('div')(({ theme }) => ({
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

export const Inner = styled('div')(({ theme }) => ({
  position: 'relative',
}));

export const Title = styled(Typography)(({ theme }) => ({
  lineHeight: '3rem',
}));

export const PageAvatar = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
}));

export const InfoParagraph = styled(Typography)(({ theme }) => ({
  margin: '1rem 0',
  fontWeight: 500,
}));

export const DataParagraph = styled(List)(({ theme }) => ({
  marginBottom: '2.5rem',
}));

export const Column = styled(ListItemText)(({ theme }) => ({
  flexBasis: 0,
}));

export const Progress = styled(CircularProgress)(({ theme }) => ({
  color: green[500],
}));

export const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const BoxBuy = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

export const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const Links = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  marginBottom: theme.spacing(2),
  lineHeight: theme.spacing(3),
  color: theme.palette.text.secondary,
}));
