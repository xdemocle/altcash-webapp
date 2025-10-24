import { styled } from '@mui/material/styles';

export const AppFrame = styled('div')(() => ({
  zIndex: 1,
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  margin: '0 auto',
}));

export const Inner = styled('div')(({ theme }) => ({
  display: 'flex',
  paddingTop: '4rem',
  [theme.breakpoints.up('sm')]: {
    paddingTop: '0',
  },
}));

export const Content = styled('main')(({ theme }) => ({
  position: 'relative',
  flexGrow: 1,
  minHeight: 'calc(100vh - 36px)',
  paddingBottom: theme.typography.pxToRem(36),
  backgroundColor: '#f4f5f4',
  [theme.breakpoints.only('xs')]: {
    minHeight: 'calc(100vh - 56px)',
    paddingBottom: theme.typography.pxToRem(56),
  },
}));
