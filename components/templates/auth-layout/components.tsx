import { styled } from '@mui/material/styles';

export const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: '#e3e4e9',
}));

export const AppFrame = styled('div')(({ theme }) => ({
  zIndex: 1,
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  margin: '0 auto',
  [theme.breakpoints.up('xl')]: {
    padding: '3rem 6rem 6rem 6rem',
    height: 'calc(100vh - 12rem)',
  },
}));

export const Inner = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('xl')]: {
    overflow: 'hidden',
    minHeight: 'calc(100vh - 9rem)',
    maxHeight: 'calc(100vh - 9rem)',
    borderRadius: '1.5rem',
    boxShadow: '0 0.25rem 1rem rgba(0,0,0,0.15)',
  },
}));

export const Content = styled('main')(({ theme }) => ({
  position: 'relative',
  flexGrow: 1,
  overflow: 'hidden',
  minHeight: 'calc(100vh - 36px)',
  paddingBottom: theme.spacing(1.5), // Converted from pxToRem(36)
  backgroundColor: '#f4f5f4',
  [theme.breakpoints.only('xs')]: {
    minHeight: 'calc(100vh - 56px)',
    paddingBottom: theme.spacing(3.5), // Converted from pxToRem(56)
  },
  [theme.breakpoints.up('xl')]: {
    overflowY: 'auto',
    minHeight: 'auto',
  },
}));
