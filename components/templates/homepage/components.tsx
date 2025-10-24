import { Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
}));

export const ParallaxContainer = styled('div')(({ theme }) => ({
  minHeight: '65vh',
  display: 'flex',
  alignItems: 'center',
}));

export const ParallaxContent = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '0',
  width: '100%',
  padding: '3rem 1.5rem',
  transform: 'translate(0,-50%)',
  color: theme.palette.primary.contrastText,
  textAlign: 'center',
  [theme.breakpoints.only('xs')]: {
    position: 'static',
    transform: 'none',
    padding: '2rem 1.5rem',
  },
}));

export const StyledTypography = styled(Typography)(({ theme, variant }) => ({
  textShadow: '1px 1px 1px rgba(0,0,0,0.35)',
  ...(variant === 'h2' && {
    fontWeight: '600 !important',
    textTransform: 'uppercase',
  }),
}));

export const HeroDivider = styled('hr')(({ theme }) => ({
  background: '#fff',
  opacity: 0.5,
  height: '0.3rem',
  width: '65%',
  border: 'none',
}));

export const CTOButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: `0.9rem ${theme.spacing(4)}`,
  minHeight: 'auto',
  lineHeight: 'normal',
}));

export const GridContainer = styled(Grid)(({ theme }) => ({
  padding: '6rem 1.5rem',
  textAlign: 'center',
  [theme.breakpoints.only('xs')]: {
    padding: '2rem 1.5rem',
  },
}));

export const GridOverlayItem = styled(Grid)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  padding: '1.5rem',
  color: '#232323',
}));

export const LeftIconButton = styled(Button)(({ theme }) => ({
  '& .MuiIcon-root': {
    marginRight: theme.spacing(1),
  },
}));
