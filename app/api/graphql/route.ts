import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createSchema, createYoga } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import datasources from './datasources';
import resolvers from './resolvers';
import { typeDefs } from './schema';
import { Context } from './types';

// Define runtime
export const runtime = 'edge';

// Create schema
const schema = createSchema<Context>({
  typeDefs,
  resolvers
});

// Create yoga instance
const yoga = createYoga<Context>({
  schema
});

/*
 * Named exports for Next.js App Router
 */
export async function POST(req: NextRequest): Promise<Response> {
  const { env } = getCloudflareContext();
  const context: Context = {
    KV: env.NEXT_INC_CACHE_KV,
    dataSources: datasources
  };

  return yoga.fetch(req.url, context);
}

export async function GET(req: NextRequest): Promise<Response> {
  const { env } = getCloudflareContext();
  const context: Context = {
    KV: env.NEXT_INC_CACHE_KV,
    dataSources: datasources
  };

  return yoga.fetch(req.url, context);
}

export async function OPTIONS(req: NextRequest): Promise<Response> {
  const { env } = getCloudflareContext();
  const context: Context = {
    KV: env.NEXT_INC_CACHE_KV,
    dataSources: datasources
  };

  return yoga.fetch(req.url, context);
}
