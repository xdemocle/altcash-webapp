import { Close, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import useGlobal from '~/hooks/use-global';

const TopBarSearch = () => {
  const router = useRouter();
  const { coinPageNeedle, setCoinPageNeedle, setTab } = useGlobal();
  const [inputValue, setInputValue] = useState(coinPageNeedle);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateNeedle = (needle: string) => {
    setCoinPageNeedle(needle);
  };

  const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (value.trim().length > 0) {
        updateNeedle(value);
      } else if (coinPageNeedle) {
        updateNeedle('');
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const onFocusHandler = () => {
    setTab(1);
    if (router.pathname !== '/buy/[tab]' || router.query.tab !== 'all') {
      router.push('/buy/all', undefined, { shallow: true });
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <TextField
        name="inputSearchCoins"
        placeholder="Type the coin name"
        fullWidth
        variant="outlined"
        value={inputValue}
        onChange={onChangeHandler}
        onFocus={onFocusHandler}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {inputValue && (
                <IconButton
                  color="primary"
                  aria-label="Reset search results"
                  onClick={() => {
                    setInputValue('');
                    updateNeedle('');
                  }}
                >
                  <Close />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
};

export default TopBarSearch;
