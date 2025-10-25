import { filter } from '~/lib/lodash-utils';
import logger from '~/lib/logger';
import { BinanceExchangeInfo, BinanceMarket, Ticker } from '../types';

const BINANCE_API_BASE = 'https://api.binance.com';

class BinanceAPI {
  async ping() {
    const response = await fetch(`${BINANCE_API_BASE}/api/v3/ping`);
    return response.json();
  }

  async time() {
    const response = await fetch(`${BINANCE_API_BASE}/api/v3/time`);
    return response.json();
  }

  async getAllMarkets() {
    const response = await fetch(`${BINANCE_API_BASE}/api/v3/exchangeInfo`);
    const data = (await response.json()) as BinanceExchangeInfo;
    let symbols = data.symbols;

    logger.debug(`Total markets from Binance: ${symbols?.length}`);

    // Removing not needed markets
    symbols = filter(symbols, (market: BinanceMarket) => {
      if (!market.baseAsset || market.baseAsset === 'undefined') {
        logger.error(`FILTERING OUT market with undefined baseAsset: ${JSON.stringify(market)}`);
        return false;
      }
      return market.quoteAsset === 'BTC';
    });

    logger.debug(`Filtered markets (BTC pairs): ${symbols.length}`);

    const undefinedMarkets = symbols.filter((m: BinanceMarket) => !m.baseAsset || m.baseAsset === 'undefined');

    if (undefinedMarkets.length > 0) {
      logger.error(`CRITICAL: Found ${undefinedMarkets.length} markets with undefined baseAsset AFTER filtering`);
      undefinedMarkets.forEach((m: BinanceMarket) => {
        logger.error(`Undefined market: ${JSON.stringify(m)}`);
      });
    }

    return symbols;
  }

  async getMarket(id: string) {
    if (!id || id === 'undefined' || id === undefined) {
      logger.error(`getMarket called with invalid id: ${id}`);
      throw new Error('Invalid market ID');
    }

    const response = await fetch(`${BINANCE_API_BASE}/api/v3/exchangeInfo?symbol=${id}BTC`);
    const data = (await response.json()) as BinanceExchangeInfo;

    if (!data.symbols || data.symbols.length === 0) {
      throw new Error(`Market not found: ${id}`);
    }

    return data.symbols[0];
  }

  async getAllTickers() {
    const response = await fetch(`${BINANCE_API_BASE}/api/v3/ticker/price`);
    const data = (await response.json()) as Ticker[];

    // Removing not needed markets
    const filteredResponse = filter(data, (coin: Ticker) => {
      // This way we detect btcusdt and others ex. CHRBTC
      return coin.symbol.search('BTC') >= 3;
    });

    return filteredResponse;
  }

  async getTicker(id: string) {
    if (!id || id === 'undefined' || id === undefined) {
      logger.error(`getTicker called with invalid id: ${id}`);
      throw new Error('Invalid ticker ID');
    }

    const response = await fetch(`${BINANCE_API_BASE}/api/v3/ticker/price?symbol=${id}BTC`);
    return response.json();
  }

  async getSummary(id: string) {
    if (!id || id === 'undefined' || id === undefined) {
      logger.error(`getSummary called with invalid id: ${id}`);
      throw new Error('Invalid summary ID');
    }

    const response = await fetch(`${BINANCE_API_BASE}/api/v3/ticker/24hr?symbol=${id}BTC`);
    return response.json();
  }

  async getCanTrade() {
    throw new Error('Trading operations not supported in edge runtime. Use Node.js endpoint.');
  }

  async getAccountData() {
    throw new Error('Trading operations not supported in edge runtime. Use Node.js endpoint.');
  }

  async postOrder() {
    throw new Error('Trading operations not supported in edge runtime. Use Node.js endpoint.');
  }
}

export default BinanceAPI;
