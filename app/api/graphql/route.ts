// import Redis from 'ioredis';
import { ApolloServer, ApolloServerPlugin, BaseContext } from '@apollo/server';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import BinanceAPI from '../datasources/binance';
import MetadataAPI from '../datasources/metadata';
import MybitxAPI from '../datasources/mybitx';
import NamesAPI from '../datasources/names';
import OrdersAPI from '../datasources/orders';
import OrdersQueueAPI from '../datasources/orders-queue';
import OrderModel from '../models/orders';
import OrderQueueModel from '../models/orders-queue';
import resolverCount from '../resolvers/resolver-count';
import resolverMarkets from '../resolvers/resolver-markets';
import resolverMeta from '../resolvers/resolver-meta';
import resolverOrderQueues from '../resolvers/resolver-order-queues';
import resolverOrders from '../resolvers/resolver-orders';
import resolverPair from '../resolvers/resolver-pair';
import resolverSummaries from '../resolvers/resolver-summaries';
import resolverTickers from '../resolvers/resolver-tickers';
import typeDefs from '../schema';
import { DataSource } from '../types';

type DataSources = Record<string, DataSource>;

type DataSourcesFn = () => DataSources;

interface ContextWithDataSources extends BaseContext {
  dataSources?: DataSources;
  resolvers?: any;
}

export const runtime = 'edge';

export const ApolloDataSources = (options: {
  dataSources: DataSourcesFn;
  resolvers: any;
}): ApolloServerPlugin<ContextWithDataSources> => ({
  requestDidStart: async (requestContext) => {
    const dataSources = options.dataSources();
    const resolvers = options.resolvers;
    const initializers = Object.values(dataSources).map(async (dataSource) => {
      if (dataSource.initialize)
        dataSource.initialize({
          cache: requestContext.cache,
          context: requestContext.contextValue
        });
    });

    await Promise.all(initializers);

    requestContext.contextValue.dataSources = dataSources;
    requestContext.contextValue.resolvers = resolvers;
  }
});

const dataSources: DataSourcesFn = () => ({
  marketsAPI: new BinanceAPI(),
  metadataAPI: new MetadataAPI(),
  namesAPI: new NamesAPI(),
  mybitxAPI: new MybitxAPI(),
  ordersAPI: new OrdersAPI({ modelOrCollection: OrderModel }),
  ordersQueueAPI: new OrdersQueueAPI({
    modelOrCollection: OrderQueueModel
  })
});

const resolvers = mergeResolvers([
  resolverMarkets,
  resolverCount,
  resolverMeta,
  resolverPair,
  resolverSummaries,
  resolverTickers,
  resolverOrders,
  resolverOrderQueues
]);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const apolloServer = new ApolloServer({
  typeDefs: mergeTypeDefs([typeDefs]),
  // todo kv
  cache: new InMemoryLRUCache({
    max: 500,
    // ~100MiB
    maxSize: Math.pow(2, 20) * 100,
    // 5 minutes (in milliseconds)
    ttl: 300_000
  }),
  csrfPrevention: true,
  introspection: true,
  plugins: [ApolloDataSources({ dataSources, resolvers })]
});

export default startServerAndCreateNextHandler(apolloServer);
