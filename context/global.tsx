'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { BUY_TABS_DEFAULT } from '../common/constants';

export interface GlobalContextProps {
  isSidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  coinPageNeedle: string;
  setCoinPageNeedle: Dispatch<SetStateAction<string>>;
  coinListPage: number;
  setCoinListPage: Dispatch<SetStateAction<number>>;
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
  bitcoinRandPrice: number;
  setBitcoinRandPrice: Dispatch<SetStateAction<number>>;
}

export const GlobalContext = createContext<GlobalContextProps>({} as GlobalContextProps);

interface Props {
  children: ReactNode;
}

const GlobalProvider = ({ children }: Props) => {
  // Default to Featured tab since we're using client-side tab switching
  // No longer depend on URL pathname for tab state
  const [tab, setTab] = useState<GlobalContextProps['tab']>(BUY_TABS_DEFAULT);

  const [isSidebarOpen, setSidebarOpen] = useState<GlobalContextProps['isSidebarOpen']>(false);
  const [coinPageNeedle, setCoinPageNeedle] = useState<GlobalContextProps['coinPageNeedle']>('');
  const [coinListPage, setCoinListPage] = useState<GlobalContextProps['coinListPage']>(1);
  const [bitcoinRandPrice, setBitcoinRandPrice] = useState<GlobalContextProps['bitcoinRandPrice']>(0);

  return (
    <GlobalContext.Provider
      value={{
        isSidebarOpen,
        setSidebarOpen,
        coinPageNeedle,
        setCoinPageNeedle,
        coinListPage,
        setCoinListPage,
        tab,
        setTab,
        bitcoinRandPrice,
        setBitcoinRandPrice,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
