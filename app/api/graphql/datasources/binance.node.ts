import { Spot, SPOT_REST_API_PROD_URL, SPOT_REST_API_TESTNET_URL } from '@binance/spot';
import { each, filter, find } from 'lodash';
import { BINANCE_API_KEY, BINANCE_API_KEY_TESTNET, BINANCE_API_SECRET, BINANCE_API_SECRET_TESTNET } from '../config';
import {
  AccountStatus,
  BinanceOrderResponse,
  Market,
  NewOrderSideEnum,
  NewOrderTypeEnum,
  Order,
  Summary,
  Ticker,
} from '../types';
import logger from '../utilities/logger';

const ERROR = {
  notrade: "Your Binance Account can't trade!",
  nofunds: 'Your Binance Account has not enough funds!',
};

class BinanceAPI {
  client: Spot;
  clientTestnet: Spot;

  constructor() {
    this.client = new Spot({
      configurationRestAPI: {
        apiKey: BINANCE_API_KEY,
        apiSecret: BINANCE_API_SECRET,
        basePath: SPOT_REST_API_PROD_URL,
      },
    });

    this.clientTestnet = new Spot({
      configurationRestAPI: {
        apiKey: BINANCE_API_KEY_TESTNET,
        apiSecret: BINANCE_API_SECRET_TESTNET,
        basePath: SPOT_REST_API_TESTNET_URL,
      },
    });
  }

  async ping() {
    return await this.client.restAPI.ping();
  }

  async time() {
    return await this.client.restAPI.time();
  }

  async getAllMarkets(): Promise<Market[]> {
    const response = await this.client.restAPI.exchangeInfo();
    let symbols = (await response.data()).symbols;

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
    const response = await this.client.restAPI.exchangeInfo({ symbol: marketSymbol });
    const market = (await response.data()).symbols?.[0];

    if (!market) {
      throw new Error(`Market not found for symbol: ${marketSymbol}`);
    }
    return market as Market;
  }

  async getAllTickers(): Promise<Ticker[]> {
    const response = await this.client.restAPI.tickerPrice();
    const data = (await response.data()) as Ticker[];

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

    const response = await this.client.restAPI.tickerPrice({ symbol: marketSymbol });

    return (await response.data()) as Ticker;
  }

  async getSummary(symbol: string): Promise<Summary> {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getSummary call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getSummary: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getSummary called with symbol: ${symbol}`);

    const response = await this.client.restAPI.ticker24hr({ symbol: marketSymbol });
    const data = (await response.data()) as Summary[];

    // ticker24hr returns an array, get the first element
    const summary = Array.isArray(data) ? data[0] : data;

    return summary;
  }

  async getAccountData() {
    const response = await this.client.restAPI.getAccount();
    const data = await response.data();
    return data;
  }

  async getCanTrade(): Promise<AccountStatus> {
    let canTrade = false;
    let msg = '';

    const accountData = await this.getAccountData();

    if (!accountData.canTrade) {
      msg = `Binance.postOrder: ${ERROR.notrade}`;
    } else {
      const accountBalance = find(accountData.balances as any, {
        asset: 'BTC',
      });

      if (Number(accountBalance.free) > 0.0006) {
        canTrade = true;
      } else {
        msg = `${ERROR.nofunds}, Balance: ${JSON.stringify(accountBalance)}`;
      }
    }

    return {
      canTrade,
      msg,
    };
  }

  async postOrder(order: Order): Promise<BinanceOrderResponse | Error | { data: any }> {
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
        apiResponse = await this.client.restAPI.newOrder({
          symbol: `${order.symbol.toUpperCase()}BTC`,
          side: NewOrderSideEnum.BUY,
          type: NewOrderTypeEnum.MARKET,
          quantity: Number(order.amount),
        });
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
          msg: `${ERROR.nofunds}, Balance: ${JSON.stringify(accountBalance)}`,
        },
      };
    }

    return apiResponse as BinanceOrderResponse | { data: any };
  }
}

export default BinanceAPI;
