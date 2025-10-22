/**
 * apollo-client.ts
 */
import { ApolloClient, ApolloLink, HttpLink } from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { isServer } from '../utils';
import { cache } from './apollo-cache';

// Use Next.js API route for GraphQL
// - On server (SSR): absolute localhost URL
// - On client: relative path
const uri = isServer() ? 'http://localhost:3000/api/graphql' : '/api/graphql';

// Initialize Apollo client with cache and state
export const apolloClient = new ApolloClient({
  ssrMode: isServer(),
  cache,
  link: ApolloLink.from([new RetryLink(), new HttpLink({ uri })])
});
