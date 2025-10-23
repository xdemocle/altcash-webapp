import { each, filter } from 'lodash';
import { AccountStatus, BinanceOrderResponse, Market, Order, Summary, Ticker } from '../types';
import logger from '../utilities/logger';

const SPOT_REST_API_PROD_URL = 'https://api.binance.com/api';

const ERROR = {
  notrade: "Your Binance Account can't trade!",
  nofunds: 'Your Binance Account has not enough funds!',
};

class BinanceAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = SPOT_REST_API_PROD_URL;
  }

  private async fetchAPI(endpoint: string, params?: Record<string, any>): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.statusText}`);
    }
    return response.json();
  }

  async ping() {
    return await this.fetchAPI('/v3/ping');
  }

  async time() {
    return await this.fetchAPI('/v3/time');
  }

  async getAllMarkets(): Promise<Market[]> {
    const data = await this.fetchAPI('/v3/exchangeInfo');
    let symbols = data.symbols;

    logger.debug(`Total markets from Binance: ${symbols?.length}`);

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

    return symbols as Market[];
  }

  async getMarket(symbol: string): Promise<Market> {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getMarket call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getMarket: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getMarket called with symbol: ${symbol}, marketSymbol: ${marketSymbol}`);
    const data = await this.fetchAPI('/v3/exchangeInfo', { symbol: marketSymbol });
    const market = data.symbols?.[0];

    if (!market) {
      throw new Error(`Market not found for symbol: ${marketSymbol}`);
    }
    return market as Market;
  }

  async getAllTickers(): Promise<Ticker[]> {
    const data = (await this.fetchAPI('/v3/ticker/price')) as Ticker[];

    // Removing not needed markets
    const filteredResponse = filter(data, coin => {
      // This way we detect btcusdt and others ex. CHRBTC
      return coin.symbol.search('BTC') >= 3;
    });

    each(filteredResponse, coin => {
      coin.id = coin.symbol = coin.symbol.replace('BTC', '');
    });

    return filteredResponse;
  }

  async getTicker(symbol: string): Promise<Ticker> {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getTicker call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getTicker: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getTicker called with symbol: ${symbol}`);

    return (await this.fetchAPI('/v3/ticker/price', { symbol: marketSymbol })) as Ticker;
  }

  async getSummary(symbol: string): Promise<Summary> {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getSummary call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getSummary: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getSummary called with symbol: ${symbol}`);

    const data = await this.fetchAPI('/v3/ticker/24hr', { symbol: marketSymbol });

    // ticker24hr returns an object, not an array
    return data as Summary;
  }

  async getAccountData() {
    throw new Error(
      'Trading operations (getAccountData) require a separate Node.js endpoint. Use /api/trading instead.'
    );
  }

  async getCanTrade(): Promise<AccountStatus> {
    throw new Error('Trading operations (getCanTrade) require a separate Node.js endpoint. Use /api/trading instead.');
  }

  async postOrder(order: Order): Promise<BinanceOrderResponse | Error | { data: any }> {
    throw new Error('Trading operations (postOrder) require a separate Node.js endpoint. Use /api/trading instead.');
  }
}

export default BinanceAPI;
