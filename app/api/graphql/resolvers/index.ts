import { mergeResolvers } from '@graphql-tools/merge';
import resolverCount from '../resolvers/resolver-count';
import resolverMarkets from '../resolvers/resolver-markets';
import resolverMeta from '../resolvers/resolver-meta';
import resolverOrderQueues from '../resolvers/resolver-order-queues';
import resolverOrders from '../resolvers/resolver-orders';
import resolverPair from '../resolvers/resolver-pair';
import resolverSummaries from '../resolvers/resolver-summaries';
import resolverTickers from '../resolvers/resolver-tickers';

export default mergeResolvers([
  resolverMarkets,
  resolverCount,
  resolverMeta,
  resolverPair,
  resolverSummaries,
  resolverTickers,
  resolverOrders,
  resolverOrderQueues
]);
