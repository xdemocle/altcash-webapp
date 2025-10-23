import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createSchema, createYoga } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { NODE_ENV } from './config';
import datasources from './datasources';
import resolvers from './resolvers';
import { typeDefs } from './schema';
import { Context } from './types';

// Define runtime
export const runtime = 'edge';

// Create schema
const schema = createSchema<Context>({
  typeDefs,
  resolvers,
});

// Create yoga instance
const { handleRequest } = createYoga<Context>({
  schema,

  graphiql: NODE_ENV === 'development',

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: '/api/graphql',

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});

function createYogaContext(env: Env): Context {
  return {
    KV: env.NEXT_INC_CACHE_KV,
    dataSources: datasources,
  };
}

/*
 * Named exports for Next.js App Router
 */
export async function POST(req: NextRequest): Promise<Response> {
  const { env } = getCloudflareContext();

  return handleRequest(req, createYogaContext(env as Env));
}

export async function GET(req: NextRequest): Promise<Response> {
  const { env } = getCloudflareContext();

  return handleRequest(req, createYogaContext(env as Env));
}

export async function OPTIONS(req: NextRequest): Promise<Response> {
  const { env } = getCloudflareContext();

  return handleRequest(req, createYogaContext(env as Env));
}
