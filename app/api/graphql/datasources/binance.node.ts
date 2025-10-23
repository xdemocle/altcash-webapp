import { MainClient, OrderResponse } from 'binance';
import { each, filter, find } from 'lodash';
import { BINANCE_API_KEY, BINANCE_API_KEY_TESTNET, BINANCE_API_SECRET, BINANCE_API_SECRET_TESTNET } from '../config';
import { NewOrderSideEnum, NewOrderTypeEnum, Order, Ticker } from '../types';
import logger from '../utilities/logger';

const ERROR = {
  notrade: "Your Binance Account can't trade!",
  nofunds: 'Your Binance Account has not enough funds!',
};

class BinanceAPI {
  client: MainClient;
  clientTestnet: MainClient;

  constructor() {
    this.client = new MainClient({
      api_key: BINANCE_API_KEY,
      api_secret: BINANCE_API_SECRET,
      beautifyResponses: true,
    });

    this.clientTestnet = new MainClient({
      api_key: BINANCE_API_KEY_TESTNET,
      api_secret: BINANCE_API_SECRET_TESTNET,
      // basePath: SPOT_REST_API_TESTNET_URL,
    });
  }

  async ping() {
    return await this.client.testConnectivity();
  }

  async time() {
    return await this.client.getServerTime();
  }

  async getAllMarkets() {
    const response = await this.client.getExchangeInfo();
    let symbols = response.symbols;

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

    return symbols;
  }

  async getMarket(symbol: string) {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getMarket call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getMarket: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getMarket called with symbol: ${symbol}, marketSymbol: ${marketSymbol}`);
    const response = await this.client.getExchangeInfo({ symbol: marketSymbol });
    const market = response.symbols?.[0];

    if (!market) {
      throw new Error(`Market not found for symbol: ${marketSymbol}`);
    }
    return market;
  }

  async getAllTickers() {
    const response = await this.client.getSymbolPriceTicker();
    const data = response as Ticker[];

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

  async getTicker(symbol: string) {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getTicker call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getTicker: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getTicker called with symbol: ${symbol}`);

    const response = await this.client.getSymbolPriceTicker({ symbol: marketSymbol });

    return response as Ticker;
  }

  async getSummary(symbol: string) {
    if (!symbol || symbol === 'undefined' || symbol === 'UNDEFINED' || symbol === undefined) {
      logger.error(`BLOCKING getSummary call with undefined symbol: ${symbol}`);
      throw new Error(`Invalid symbol provided to getSummary: ${symbol}`);
    }
    const marketSymbol = `${symbol}BTC`.toUpperCase();
    logger.debug(`getSummary called with symbol: ${symbol}`);

    const response = await this.client.getSymbolPriceTicker({ symbol: marketSymbol });
    const data = response;

    // ticker24hr returns an array, get the first element
    const summary = Array.isArray(data) ? data[0] : data;

    return summary;
  }

  async getAccountData() {
    const response = await this.client.getAccountInfo();
    const data = response;
    return data;
  }

  async getCanTrade() {
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

  async postOrder(order: Order) {
    const accountData = await this.getAccountData();

    if (!accountData.canTrade) {
      logger.error(`Binance.postOrder: ${ERROR.notrade}`);
      return new Error(`Binance.postOrder: ${ERROR.notrade}`);
    }

    const accountBalance = find(accountData.balances as any, { asset: 'BTC' });
    logger.debug(`accountBalance: ${JSON.stringify(accountBalance)}`);

    // let apiResponse: BinanceOrderResponse | { data: any } | null = null;
    let apiResponse: OrderResponse | null = null;

    // Check if account has funds
    if (Number(accountBalance.free) > 0.0006) {
      // make the order
      try {
        apiResponse = await this.client.submitNewOrder({
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
        apiResponse = err;
      }
    } else {
      // return new Error(`Binance.postOrder: ${ERROR.nofunds} ${JSON.stringify(accountBalance)}`);
      apiResponse = {
        code: -1000,
        msg: `${ERROR.nofunds}, Balance: ${JSON.stringify(accountBalance)}`,
      };
    }

    return apiResponse;
  }
}

export default BinanceAPI;
