'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import * as ga from '../common/ga';

export function GATracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams ? `?${searchParams}` : '');
    ga.pageview(url);
  }, [pathname, searchParams]);

  return null;
}
