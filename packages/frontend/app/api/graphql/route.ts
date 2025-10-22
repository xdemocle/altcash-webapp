import { mergeResolvers } from '@graphql-tools/merge';
import { createSchema, createYoga } from 'graphql-yoga';
import type { NextRequest } from 'next/server';
import resolverCount from '../../resolvers/resolver-count';
import resolverMarkets from '../../resolvers/resolver-markets';
import resolverMeta from '../../resolvers/resolver-meta';
import resolverOrderQueues from '../../resolvers/resolver-order-queues';
import resolverOrders from '../../resolvers/resolver-orders';
import resolverPair from '../../resolvers/resolver-pair';
import resolverSummaries from '../../resolvers/resolver-summaries';
import resolverTickers from '../../resolvers/resolver-tickers';
import typeDefs from '../../schema';

// Build an executable GraphQL schema for Yoga
const schema = createSchema({
  typeDefs,
  resolvers: mergeResolvers([
    resolverMarkets,
    resolverCount,
    resolverMeta,
    resolverPair,
    resolverSummaries,
    resolverTickers,
    resolverOrders,
    resolverOrderQueues
  ])
});

const yoga = createYoga({ schema });

export async function GET(request: NextRequest) {
  return yoga.fetch(request);
}

export async function POST(request: NextRequest) {
  return yoga.fetch(request);
}

export const runtime = 'edge';
