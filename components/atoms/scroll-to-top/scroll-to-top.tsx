'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { isServer } from '~/common/utils';

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!isServer()) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
