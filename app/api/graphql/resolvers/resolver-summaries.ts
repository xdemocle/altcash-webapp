import { Context, Summary } from '../types';

interface MinimalSummaryResponse {
  symbol: string;
  highPrice?: string | number;
  lowPrice?: string | number;
  volume?: string | number;
  quoteVolume?: string | number;
  priceChange?: string | number;
}

const querySummary = async (_: unknown, { id }: { id: string }, context: Context): Promise<Summary> => {
  if (!id || id === 'undefined' || id === undefined) {
    const empty: Summary = {
      id: '',
      symbol: '',
      high: 0,
      low: 0,
      volume: 0,
      quoteVolume: 0,
      percentChange: 0,
    };
    return empty;
  }
  const response = (await context.dataSources.marketsAPI.getSummary(id)) as MinimalSummaryResponse;

  response.symbol = response.symbol.replace('BTC', '');

  return {
    // Add the id for client caching purpouse
    id: response.symbol,
    symbol: response.symbol,
    high: Number(response.highPrice),
    low: Number(response.lowPrice),
    volume: Number(response.volume),
    quoteVolume: Number(response.quoteVolume),
    percentChange: Number(response.priceChange),
  };
};

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    summary: querySummary,
  },
};

export default resolvers;
