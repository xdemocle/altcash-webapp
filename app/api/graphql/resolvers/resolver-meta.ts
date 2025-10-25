import { Metadata } from 'graphql/types';
import { AppGraphContext } from '../config';

interface QueryMetaCoinArgs {
  id: string;
}

const queryMetaCoin = async (_: unknown, args: QueryMetaCoinArgs, context: AppGraphContext): Promise<Metadata> => {
  if (!args.id || args.id === 'undefined') {
    throw new Error('Invalid id provided to queryMetaCoin');
  }
  const idUppercase = args.id.toUpperCase();
  const idLowerCase = args.id.toLowerCase();
  const response: Metadata = await context.dataSources.metadataAPI.getCoin(idLowerCase);

  const coin = response;

  coin.metadataId = Number(coin.id);
  coin.id = idUppercase;

  return coin;
};

const queryMetaAllCoins = async (_: unknown, __: unknown, context: AppGraphContext): Promise<Metadata[]> => {
  const response = await context.dataSources.namesAPI.getAll();
  return response;
};

const queryMetaExperiment = async (_: unknown, __: unknown, context: AppGraphContext): Promise<Metadata[]> => {
  const response = await context.dataSources.metadataAPI.missingData();

  return response;
};

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    metaCoin: queryMetaCoin,
    metaCoinAll: queryMetaAllCoins,
    metaExperiment: queryMetaExperiment,
  },
};

export default resolvers;
