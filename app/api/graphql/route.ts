import type { KVNamespace } from '@cloudflare/workers-types';
import { createSchema, createYoga } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import datasources from './datasources';
import resolvers from './resolvers';
import { typeDefs } from './schema';

// Define runtime
export const runtime = 'edge';

// Define context
export interface Context {
  kv: KVNamespace;
  dataSources: typeof datasources;
}

// Create schema
const schema = createSchema({
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
  return yoga.fetch(req.url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    context: {
      kv: (globalThis as any).KV as KVNamespace,
      dataSources: datasources
    }
  } as any);
}

export async function GET(req: NextRequest): Promise<Response> {
  return yoga.fetch(req.url, {
    method: req.method,
    headers: req.headers,
    context: {
      kv: (globalThis as any).KV as KVNamespace,
      dataSources: datasources
    }
  } as any);
}

export async function OPTIONS(req: NextRequest): Promise<Response> {
  return yoga.fetch(req.url, {
    method: req.method,
    headers: req.headers,
    context: {
      kv: (globalThis as any).KV as KVNamespace,
      dataSources: datasources
    }
  } as any);
}
