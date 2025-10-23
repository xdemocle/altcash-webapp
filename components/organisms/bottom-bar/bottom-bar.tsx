import { useQuery } from '@apollo/client/react';
import { Tooltip, Typography } from '@mui/material';
import { GET_COUNT } from '../../../graphql/queries';
import type { CountItem, CountResponse } from '../../../graphql/types';
import { AppBarStyled, LinkStyled } from './styled';

const BottomBar = () => {
  const { data } = useQuery<CountResponse>(GET_COUNT);

  return (
    <AppBarStyled color="secondary">
      <Typography variant="body1" color="inherit" align="right" sx={{ textTransform: 'capitalize' }}>
        {data &&
          data.count &&
          data.count.map((count: CountItem, ix: number) => (
            <span key={`${count}${ix}`}>
              {count.name}: {count.count} -{' '}
            </span>
          ))}{' '}
        <Tooltip title="Require assistance with customer Support" placement="top" arrow>
          <LinkStyled href="/support">Support</LinkStyled>
        </Tooltip>
        {' - '} &copy; Altcash {new Date().getFullYear()}
      </Typography>
    </AppBarStyled>
  );
};

export default BottomBar;
