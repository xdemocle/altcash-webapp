import { cacheExchange, createClient, fetchExchange } from 'urql';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_SERVER || '/api/graphql';

export const urqlClient = createClient({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    credentials: 'include',
  },
  preferGetMethod: false,
  // Default to cache-first for better performance with ticker requests
  requestPolicy: 'cache-and-network',
});
