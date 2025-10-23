import { filter, isUndefined } from 'lodash';
import { Context, Ticker } from '../types';

const queryTickers = async (_: unknown, { symbols }: { symbols: string }, context: Context): Promise<Ticker[]> => {
  let tickers = await context.dataSources.marketsAPI.getAllTickers();

  // Search feature or symbols one
  if (!isUndefined(symbols)) {
    tickers = filter(tickers, coin => {
      return symbols.split('|').includes(coin.id);
    });
  }

  return tickers;
};

const queryTicker = async (_: unknown, { id }: { id: string }, context: Context): Promise<Ticker> => {
  if (!id || id === 'undefined' || id === undefined) {
    return {
      id: '',
      price: '0',
      symbol: '',
    } as any;
  }
  const response = await context.dataSources.marketsAPI.getTicker(id);

  // Add the id for client caching purpouse
  response.id = response.symbol.replace('BTC', '');

  return response;
};

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    tickers: queryTickers,
    ticker: queryTicker,
  },
};

export default resolvers;
