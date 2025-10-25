import { Metadata } from 'graphql/types';
import { each } from 'lib/lodash-utils';
import logger from 'lib/logger';
import { CMC_PRO_API_KEY } from '../config';

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

// CMC error response shape
interface CmcErrorResponse {
  status: {
    error_code: number;
    error_message: string;
  };
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

    // Check if API key is configured
    if (!CMC_PRO_API_KEY) {
      throw new Error('CoinMarketCap API key is not configured. Please set CMC_PRO_API_KEY environment variable.');
    }

    const url = `${this.baseURL}/cryptocurrency/info?symbol=${symbol.toLowerCase()}`;
    const response = await this.fetchJson<CmcInfoResponse>(url);

    // Log the actual response for debugging
    logger.debug(`CMC API response for ${symbol}: ${JSON.stringify(response)}`);

    if (!response) {
      throw new Error(`Empty response from CoinMarketCap API for symbol: ${symbol}`);
    }

    // Handle CMC error response format
    const errorResponse = response as unknown as CmcErrorResponse;
    if (errorResponse.status?.error_code) {
      throw new Error(
        `CoinMarketCap API error: ${errorResponse.status.error_message} (code: ${errorResponse.status.error_code})`
      );
    }

    if (!response?.data) {
      throw new Error(
        `Invalid response from CoinMarketCap API for symbol: ${symbol}. Response keys: ${Object.keys(response)}`
      );
    }

    const entry = response.data[symbol.toUpperCase()]?.[0];
    if (!entry) {
      throw new Error(
        `Metadata not found for symbol: ${symbol}. Available symbols: ${Object.keys(response.data).join(', ')}`
      );
    }
    const meta: Metadata = {
      id: symbol.toUpperCase(),
      symbol: symbol.toUpperCase(),
      name: entry.name,
      logo: entry.logo,
      metadataId: entry.id,
      slug: entry.slug,
      description: entry.description,
    };
    return meta;
  }

  async missingData(): Promise<Metadata[]> {
    // const symbols = 'AR,ETH,EOS,FCT,GO,NEO,SG,SMBSWAP,TFC'
    const symbols = 'IOTA';
    const response = await this.fetchJson<CmcInfoResponse>(`${this.baseURL}/cryptocurrency/info?symbol=${symbols}`);

    const arr: Metadata[] = [];

    each(response.data, (value, key) => {
      const entry = Array.isArray(value) ? value[0] : (value as CmcInfoResponse['data'][string][number]);
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
