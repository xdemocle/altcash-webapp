import { each } from '~/lib/lodash-utils';
import { CMC_PRO_API_KEY } from '../config';
import { Metadata } from '../types';

class MetadataAPI {
  private baseURL = 'https://pro-api.coinmarketcap.com/v2';

  private async fetchJson<T = any>(url: string): Promise<T> {
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
    const response = await this.fetchJson<any>(`${this.baseURL}/cryptocurrency/info?symbol=${symbol.toLowerCase()}`);

    return response.data[symbol.toUpperCase()][0];
  }

  async missingData(): Promise<Metadata[]> {
    // const symbols = 'AR,ETH,EOS,FCT,GO,NEO,SG,SMBSWAP,TFC'
    const symbols = 'IOTA';
    const response = await this.fetchJson<any>(`${this.baseURL}/cryptocurrency/info?symbol=${symbols}`);

    const arr: Metadata[] = [];

    each(response.data, (value: any, key: any) => {
      arr.push({
        id: String(key),
        metadataId: value.id,
        symbol: String(key),
        name: value.name,
        slug: value.slug,
        description: value.description,
        logo: value.logo,
      });
    });

    return arr;
  }
}

export default MetadataAPI;
