import { Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { urqlClient } from '~/common/graphql';
import { GET_COUNT } from '~/graphql/queries';
import type { CountItem, CountResponse } from '~/graphql/types';
import { AppBarStyled, LinkStyled } from './styled';

const BottomBar = () => {
  const [data, setData] = useState<CountResponse | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const result = await urqlClient.query(GET_COUNT, {}).toPromise();
      if (!result.error) {
        setData(result.data as CountResponse);
      }
    };
    fetchCount();
  }, []);

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
