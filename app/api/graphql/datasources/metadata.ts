import { each } from '~/lib/lodash-utils';
import { CMC_PRO_API_KEY } from '../config';
import { Metadata } from '../types';

// Minimal shape for CMC /cryptocurrency/info responses
export interface CmcInfoResponse {
  data: Record<
    string,
    {
      id: number;
      name: string;
      slug: string;
      description: string;
      logo: string;
    }[]
  >;
}

class MetadataAPI {
  private baseURL = 'https://pro-api.coinmarketcap.com/v2';

  private async fetchJson<T = unknown>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_PRO_API_KEY,
      },
    });
    return (await response.json()) as T;
  }

  async getCoin(symbol: string): Promise<Metadata> {
    if (!symbol || symbol === 'undefined') {
      throw new Error('Invalid symbol provided to getCoin');
    }
    const response = await this.fetchJson<CmcInfoResponse>(
      `${this.baseURL}/cryptocurrency/info?symbol=${symbol.toLowerCase()}`
    );

    // Cast to Metadata to match the existing API surface
    return response.data[symbol.toUpperCase()][0] as unknown as Metadata;
  }

  async missingData(): Promise<Metadata[]> {
    // const symbols = 'AR,ETH,EOS,FCT,GO,NEO,SG,SMBSWAP,TFC'
    const symbols = 'IOTA';
    const response = await this.fetchJson<CmcInfoResponse>(
      `${this.baseURL}/cryptocurrency/info?symbol=${symbols}`
    );

    const arr: Metadata[] = [];

    each(response.data, (value, key) => {
      const entry = Array.isArray(value)
        ? value[0]
        : (value as unknown as CmcInfoResponse['data'][string][number]);
      arr.push({
        id: String(key),
        metadataId: entry.id,
        symbol: String(key),
        name: entry.name,
        slug: entry.slug,
        description: entry.description,
        logo: entry.logo,
      });
    });

    return arr;
  }
}

export default MetadataAPI;
