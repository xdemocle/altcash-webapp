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
  resolvers,
});

// Create yoga instance
const yoga = createYoga<Context>({
  schema,
});

/*
 * Named exports for Next.js App Router
 */
function createYogaContext(env: Env): Context {
  return {
    KV: env.NEXT_INC_CACHE_KV,
    dataSources: datasources,
  };
}

export async function POST(req: NextRequest): Promise<Response> {
  const { env } = getCloudflareContext();
  return yoga.fetch(req.url, createYogaContext(env as Env));
}

export async function GET(req: NextRequest): Promise<Response> {
  const { env } = getCloudflareContext();
  return yoga.fetch(req.url, createYogaContext(env as Env));
}

export async function OPTIONS(req: NextRequest): Promise<Response> {
  const { env } = getCloudflareContext();
  return yoga.fetch(req.url, createYogaContext(env as Env));
}
