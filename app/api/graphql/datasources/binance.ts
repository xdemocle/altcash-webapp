import { RESTDataSource } from '@apollo/datasource-rest';
import { Spot } from '@binance/connector-typescript';
import { each, filter, find } from 'lodash';
import {
  BINANCE_API_KEY,
  BINANCE_API_KEY_TESTNET,
  BINANCE_API_SECRET,
  BINANCE_API_SECRET_TESTNET,
  BINANCE_API_URL
} from '../config';
import {
  AccountStatus,
  BinanceOrderResponse,
  Market,
  Order,
  Ticker
} from '../types';
import logger from '../utilities/logger';

const ERROR = {
  notrade: "Your Binance Account can't trade!",
  nofunds: 'Your Binance Account has not enough funds!'
};

class BinanceAPI extends RESTDataSource {
  client: any;
  clientTestnet: any;

  constructor() {
    super();

    this.baseURL = BINANCE_API_URL + '/api/v3/';

    this.client = new (Spot as any)(BINANCE_API_KEY, BINANCE_API_SECRET);

    this.clientTestnet = new (Spot as any)(
      BINANCE_API_KEY_TESTNET,
      BINANCE_API_SECRET_TESTNET,
      {
        baseURL: 'https://testnet.binance.vision'
      }
    );
  }

  async ping(): Promise<Record<string, string>> {
    return await this.get('ping');
  }

  async time(): Promise<Record<string, string>> {
    return await this.get('time');
  }

  async getAllMarkets(): Promise<Market[]> {
    const response = await this.get('exchangeInfo');
    let symbols = response.symbols;

    logger.debug(`Total markets from Binance: ${symbols.length}`);

    // Removing not needed markets
    symbols = filter(symbols, (market) => {
      if (!market.baseAsset || market.baseAsset === 'undefined') {
        logger.error(
          `FILTERING OUT market with undefined baseAsset: ${JSON.stringify(market)}`
        );
        return false;
      }
      return market.quoteAsset === 'BTC';
    });

    logger.debug(`Filtered markets (BTC pairs): ${symbols.length}`);

    const undefinedMarkets = symbols.filter(
      (m: any) => !m.baseAsset || m.baseAsset === 'undefined'
    );

    if (undefinedMarkets.length > 0) {
      logger.error(
        `STILL HAVE UNDEFINED MARKETS: ${JSON.stringify(undefinedMarkets)}`
      );
    }

    return symbols;
  }

  async getMarket(symbol: string): Promise<Market> {
    if (
      !symbol ||
      symbol === 'undefined' ||
      symbol === 'UNDEFINED' ||
      symbol === undefined
    ) {
      logger.error(`BLOCKING getMarket call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getMarket: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(
      `getMarket called with symbol: ${symbol}, marketSymbol: ${marketSymbol}`
    );
    const response = await this.get(`exchangeInfo?symbol=${marketSymbol}`);

    return response.symbols[0];
  }

  async getAllTickers(): Promise<Ticker[]> {
    let response = await this.get('ticker/price');

    // Removing not needed markets
    response = filter(response, (coin) => {
      // This way we detect btcusdt and others ex. CHRBTC
      return coin.symbol.search('BTC') >= 3;
    });

    each(response, (coin) => {
      coin.id = coin.symbol = coin.symbol.replace('BTC', '');
    });

    return response;
  }

  async getTicker(symbol: string): Promise<Ticker> {
    if (
      !symbol ||
      symbol === 'undefined' ||
      symbol === 'UNDEFINED' ||
      symbol === undefined
    ) {
      logger.error(`BLOCKING getTicker call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getTicker: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getTicker called with symbol: ${symbol}`);

    return await this.get(`ticker/price?symbol=${marketSymbol}`);
  }

  async getSummary(symbol: string): Promise<Record<string, string>> {
    if (
      !symbol ||
      symbol === 'undefined' ||
      symbol === 'UNDEFINED' ||
      symbol === undefined
    ) {
      logger.error(`BLOCKING getSummary call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getSummary: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getSummary called with symbol: ${symbol}`);

    return await this.get(`ticker/24hr?symbol=${marketSymbol}`);
  }

  async getAccountData(): Promise<Record<string, string>> {
    const response = await this.client.account();

    return response.data;
  }

  async getCanTrade(): Promise<AccountStatus> {
    let canTrade = false;
    let msg = '';

    const accountData = await this.getAccountData();

    if (!accountData.canTrade) {
      msg = `Binance.postOrder: ${ERROR.notrade}`;
    } else {
      const accountBalance = find(accountData.balances as any, {
        asset: 'BTC'
      });

      if (Number(accountBalance.free) > 0.0006) {
        canTrade = true;
      } else {
        msg = `${ERROR.nofunds}, Balance: ${JSON.stringify(accountBalance)}`;
      }
    }

    return {
      canTrade,
      msg
    };
  }

  async postOrder(
    order: Order
  ): Promise<BinanceOrderResponse | Error | { data: any }> {
    const accountData = await this.getAccountData();

    if (!accountData.canTrade) {
      logger.error(`Binance.postOrder: ${ERROR.notrade}`);
      return new Error(`Binance.postOrder: ${ERROR.notrade}`);
    }

    const accountBalance = find(accountData.balances as any, { asset: 'BTC' });
    logger.debug(`accountBalance: ${JSON.stringify(accountBalance)}`);

    let apiResponse: BinanceOrderResponse | { data: any } | null = null;

    // Check if account has funds
    if (Number(accountBalance.free) > 0.0006) {
      // make the order
      try {
        apiResponse = await this.client.newOrder(
          `${order.symbol.toUpperCase()}BTC`,
          'BUY',
          'MARKET',
          {
            // price: '0.001',
            // timeInForce: 'GTC'
            quantity: order.amount
          }
        );
      } catch (error: any) {
        let err = error;

        if (error && error.response && error.response.data) {
          err = error.response.data;
        }

        // return new Error(`Binance.postOrder error: ${JSON.stringify(err)}`);
        apiResponse = { data: err };
      }
    } else {
      // return new Error(`Binance.postOrder: ${ERROR.nofunds} ${JSON.stringify(accountBalance)}`);
      apiResponse = {
        data: {
          code: -1000,
          msg: `${ERROR.nofunds}, Balance: ${JSON.stringify(accountBalance)}`
        }
      };
    }

    return apiResponse as BinanceOrderResponse | { data: any };
  }
}

export default BinanceAPI;
