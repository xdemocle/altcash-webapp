import type { KVNamespace } from '@cloudflare/workers-types';
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
  resolvers: resolvers as any
});

// Create yoga instance
const yoga = createYoga<Context>({
  schema
});

/*
 * Named exports for Next.js App Router
 */
export async function POST(req: NextRequest): Promise<Response> {
  return yoga.fetch(req.url, {
    kv: (globalThis as any).KV as KVNamespace,
    dataSources: datasources
  });
}

export async function GET(req: NextRequest): Promise<Response> {
  return yoga.fetch(req.url, {
    kv: (globalThis as any).KV as KVNamespace,
    dataSources: datasources
  });
}

export async function OPTIONS(req: NextRequest): Promise<Response> {
  return yoga.fetch(req.url, {
    kv: (globalThis as any).KV as KVNamespace,
    dataSources: datasources
  });
}
