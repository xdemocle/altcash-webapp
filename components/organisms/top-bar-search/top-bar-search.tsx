'use client';

import { Close, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, Stack, TextField } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BUY_TAB_ALL } from '~/common/constants';
import useGlobal from '~/hooks/use-global';

const TopBarSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
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
    // Switch to "All Coins" tab when search is focused
    setTab(BUY_TAB_ALL);

    // Navigate to buy page if not already there
    if (!pathname.startsWith('/buy')) {
      router.push('/buy');
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
