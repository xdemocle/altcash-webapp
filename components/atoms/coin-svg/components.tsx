import { styled } from '@mui/material/styles';

export const AvatarContainer = styled('span')<{ size?: 'regular' | 'large' | 'avatar' }>(({ size }) => {
  const base = {
    display: 'inline-flex',
    padding: 0,
    verticalAlign: 'middle',
    overflow: 'visible',
    width: '2rem',
    height: '2rem',
    '& svg': {
      width: '2rem',
      height: '2rem',
      padding: 0,
      verticalAlign: 'middle',
      overflow: 'visible',
    },
  } as const;

  if (size === 'large') {
    return {
      ...base,
      width: '4rem',
      height: '4rem',
      '& svg': {
        width: '4rem',
        height: '4rem',
      },
    };
  }

  return base;
});
