import { each, filter } from 'lodash';
import { BINANCE_API_URL } from '../config';
import { AccountStatus, BinanceOrderResponse, Market, Order, Summary, Ticker } from '../types';
import logger from '../utilities/logger';

const ERROR = {
  notrade: "Your Binance Account can't trade!",
  nofunds: 'Your Binance Account has not enough funds!',
};

class BinanceAPI {
  private baseURL = BINANCE_API_URL + '/api/v3/';
  private nodeImplementation: any = null;

  constructor() {
    // Edge-compatible: lazy-load Node.js implementation at runtime
  }

  private async getNodeImplementation() {
    // if (!this.nodeImplementation) {
    //   try {
    //     const module = await import('./binance.node');
    //     this.nodeImplementation = new module.default();
    //   } catch (error) {
    //     logger.warn('Node.js Binance client not available, trading operations disabled');
    //     throw new Error('Trading operations not available in this runtime');
    //   }
    // }
    return this.nodeImplementation;
  }

  private async fetchJson<T = any>(url: string): Promise<T> {
    const response = await fetch(url);
    return (await response.json()) as T;
  }

  async ping(): Promise<Record<string, string>> {
    return await this.fetchJson(`${this.baseURL}ping`);
  }

  async time(): Promise<Record<string, string>> {
    return await this.fetchJson(`${this.baseURL}time`);
  }

  async getAllMarkets(): Promise<Market[]> {
    const response = await this.fetchJson(`${this.baseURL}exchangeInfo`);
    let symbols = response.symbols;

    logger.debug(`Total markets from Binance: ${symbols.length}`);

    // Removing not needed markets
    symbols = filter(symbols, market => {
      if (!market.baseAsset || market.baseAsset === 'undefined') {
        logger.error(`FILTERING OUT market with undefined baseAsset: ${JSON.stringify(market)}`);
        return false;
      }
      return market.quoteAsset === 'BTC';
    });

    logger.debug(`Filtered markets (BTC pairs): ${symbols.length}`);

    const undefinedMarkets = symbols.filter((m: any) => !m.baseAsset || m.baseAsset === 'undefined');

    if (undefinedMarkets.length > 0) {
      logger.error(`STILL HAVE UNDEFINED MARKETS: ${JSON.stringify(undefinedMarkets)}`);
    }

    return symbols;
  }

  async getMarket(symbol: string): Promise<Market> {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getMarket call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getMarket: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getMarket called with symbol: ${symbol}, marketSymbol: ${marketSymbol}`);
    const response = await this.fetchJson(`${this.baseURL}exchangeInfo?symbol=${marketSymbol}`);

    return response.symbols[0];
  }

  async getAllTickers(): Promise<Ticker[]> {
    let response = await this.fetchJson(`${this.baseURL}ticker/price`);

    // Removing not needed markets
    response = filter(response, coin => {
      // This way we detect btcusdt and others ex. CHRBTC
      return coin.symbol.search('BTC') >= 3;
    });

    each(response, coin => {
      coin.id = coin.symbol = coin.symbol.replace('BTC', '');
    });

    return response;
  }

  async getTicker(symbol: string): Promise<Ticker> {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getTicker call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getTicker: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getTicker called with symbol: ${symbol}`);

    return await this.fetchJson(`${this.baseURL}ticker/price?symbol=${marketSymbol}`);
  }

  async getSummary(symbol: string): Promise<Summary> {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getSummary call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getSummary: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getSummary called with symbol: ${symbol}`);

    return await this.fetchJson(`${this.baseURL}ticker/24hr?symbol=${marketSymbol}`);
  }

  async getAccountData(): Promise<Record<string, string>> {
    const impl = await this.getNodeImplementation();
    return impl.getAccountData();
  }

  async getCanTrade(): Promise<AccountStatus> {
    const impl = await this.getNodeImplementation();
    return impl.getCanTrade();
  }

  async postOrder(order: Order): Promise<BinanceOrderResponse | Error | { data: any }> {
    const impl = await this.getNodeImplementation();
    return impl.postOrder(order);
  }
}

export default BinanceAPI;
