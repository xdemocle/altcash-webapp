import { filter } from 'lodash';
import { Context, Count } from '../types';

const queryCount = async (
  _: unknown,
  { limit }: { limit: number },
  context: Context
): Promise<Count[]> => {
  const counts = [];
  const markets = await context.dataSources.marketsAPI.getAllMarkets();
  const activeMarkets = filter(markets, { status: 'TRADING' });

  counts.push({
    name: 'markets',
    count: markets.length
  });

  counts.push({
    name: 'activeMarkets',
    count: activeMarkets.length
  });

  return counts;
};

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    count: queryCount
  }
};

export default resolvers;
