import { Pair } from 'graphql/types';
import { AppGraphContext } from '../config';

const queryPair = async (_: unknown, { pair }: { pair: string }, context: AppGraphContext): Promise<Pair> => {
  const response = await context.dataSources.mybitxAPI.getPair(pair);

  return response;
};

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    pair: queryPair,
  },
};

export default resolvers;
