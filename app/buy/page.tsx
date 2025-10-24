'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BUY_TAB_ALL, BUY_TAB_FAVOURITE, BUY_TAB_FEATURED } from '~/common/constants';
import RootStyled from '~/components/atoms/root';
import Loader from '~/components/molecules/loader';
import useGlobal from '~/hooks/use-global';

export default function BuyIndex() {
  const router = useRouter();
  const { tab } = useGlobal();

  useEffect(() => {
    let slug = 'featured';

    if (tab === BUY_TAB_FEATURED) {
      slug = 'featured';
    } else if (tab === BUY_TAB_ALL) {
      slug = 'all';
    } else if (tab === BUY_TAB_FAVOURITE) {
      slug = 'favourite';
    }

    router.push(`/buy/${slug}`);
  }, [router, tab]);

  return (
    <RootStyled>
      <Loader text="Loading coins page..." centered />
    </RootStyled>
  );
}
