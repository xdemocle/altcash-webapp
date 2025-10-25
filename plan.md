# Migration Plan: Move Backend to Next.js API Routes

## Overview

This plan outlines the steps to integrate the existing Node.js/Express backend into the Next.js frontend using the App Router API routes. This will create a monolith application, simplifying deployment and reducing CORS issues.

## Benefits

- Simplified deployment as a single application.
- No need for separate backend server.
- Better integration with Next.js features like SSR and caching.
- Easier management of GraphQL endpoints.

## Risks and Challenges

- ~~Handling database connections (MongoDB) in a serverless environment like Cloudflare Workers.~~ **RESOLVED**: Migrated to Cloudflare KV for serverless-native data storage.
- Ensuring GraphQL schema and resolvers are compatible with Next.js API routes.
- Potential performance impacts from moving to a serverless model.
- Need to update frontend GraphQL client to point to local /api/graphql instead of external URL.

## Steps

1. ✅ **Backup and Branch**: Completed - changes committed (dcb2376).
2. ✅ **Copy Backend Code**: Completed - backend files moved to `app/api` directory.
3. ✅ **Update GraphQL Schema**: Completed - API route created in `app/api/graphql/route.ts`.
4. ✅ **Dependencies**: Installed required packages (wrangler, etc.).
5. ✅ **Database Connection**: Completed - MongoDB connection setup for serverless environment.
6. ✅ **Implement API Routes**: Completed - GraphQL endpoint implementation with error handling.
7. ✅ **Test Locally**: Completed - Run `bun run dev` and test `/api/graphql` endpoint.
8. ✅ **Update Frontend**: Completed - Change GraphQL endpoint in frontend code.
9. ✅ **Type Safety & Linting**: Completed - Removed all `any` types and fixed TypeScript errors.
10. ⏳ **Deploy and Test**: In progress - Deploy to Cloudflare and verify functionality.

## Detailed Steps

### 1. Backup and Branch

- ✅ Completed - All changes committed (dcb2376860f097a54a409172f9c0d88b94bd466f).

### 2. Copy Backend Code

- ✅ Completed - Backend files moved to `app/api` directory.
- ✅ Import paths adjusted for monorepo structure.

### 3. Update GraphQL Schema

- ✅ Created API route in `app/api/graphql/route.ts`.
- ✅ Fixed TypeScript errors in `app/api/datasources/binance.ts`.

### 4. Database Connection

- ✅ **Migrated from MongoDB to Cloudflare KV**: Removed MongoDB dependency for serverless compatibility.
- ✅ Implemented KV repository abstraction layer (`app/api/repositories/kv-repository.ts`).
- ✅ Set up environment variables for Cloudflare Workers KV namespace.
- ✅ Environment variables properly configured for both local dev (.env.local) and Cloudflare Workers (.dev.vars).
- ✅ Removed unnecessary dependencies: `bson`, `@emotion/server`, `sass`, `tss-react`.

### 5. Implement API Routes

- ✅ Complete GraphQL endpoint implementation in `app/api/graphql/route.ts`.
- ✅ Error handling and logging in place.
- ✅ All resolvers and datasources tested and working.
- ✅ Fallback values added for numeric fields to prevent NaN serialization errors.

### 6. Test Locally

- ✅ `bun run dev` working correctly.
- ✅ `/api/graphql` endpoint tested and functional.
- ✅ GraphQL queries returning proper data.

### 7. Update Frontend

- ✅ Updated `NEXT_PUBLIC_GRAPHQL_SERVER` to `/api/graphql` in .env.local.
- ✅ Updated any hard-coded GraphQL URLs in frontend code.
- ✅ Frontend GraphQL client (urql) configured correctly.

### 8. Type Safety & Linting

- ✅ Removed all `any` types from codebase:
  - `lib/lodash-utils.ts`: Replaced with `unknown` and proper generics
  - `hooks/use-graphql-query.ts`: Added proper type constraints
  - `hooks/use-graphql-mutation.ts`: Reordered type parameters (required before optional)
  - `components/atoms/coin-svg/coin-svg.tsx`: Converted types to interfaces, removed any casts
  - `components/templates/coin-buy/coin-buy.tsx`: Replaced any with unknown, fixed double negation
  - `app/orders/[base64Id]/page.tsx`: Replaced any with Error | null
- ✅ Fixed TypeScript type parameter ordering issues
- ✅ Added index signatures to OrderParams interfaces to satisfy Record<string, unknown> constraint
- ✅ Build passes successfully with no TypeScript errors

### 9. Deploy and Test

- ⏳ Build using `bun run build` - ✅ Successful
- ⏳ Deploy using OpenNext Cloudflare tools - In progress (worker.js generation issue)
- ⏳ Test on staging environment - Pending

## Infrastructure Migration: MongoDB → Cloudflare KV

### Decision

Migrated from MongoDB to **Cloudflare KV** for the following reasons:

1. **Serverless-Native**: KV is built for edge runtime, no connection pooling issues
2. **Simplified Deployment**: No external database to manage or connect to
3. **Cost-Effective**: KV pricing aligns with serverless usage patterns
4. **Better Performance**: Edge-local data access, no network latency to external DB
5. **Reduced Dependencies**: Eliminated Node.js-only modules (bson, mongodb driver)

### Changes Made

- ✅ Updated GraphQL resolvers to use KV repository instead of MongoDB
- ✅ Removed MongoDB-related dependencies from package.json
- ✅ Updated environment configuration for KV namespace binding
- ✅ Maintained existing data schema compatibility

### Benefits2

- **Edge Runtime Compatible**: No Node.js module conflicts
- **Simpler Codebase**: Single data storage solution
- **Better Scalability**: Automatic distribution across Cloudflare edge locations
- **Reduced Build Complexity**: No webpack bundling issues with Node.js modules

## Timeline

- Planning: ✅ 1 hour (completed)
- Backend Migration: ✅ 2 hours (completed)
- Database & API Implementation: ✅ 2-3 hours (completed)
- Type Safety & Linting: ✅ 1-2 hours (completed)
- Testing: ⏳ 2-3 hours (in progress)
- Deployment: ⏳ 1 hour (pending)

## Performance Optimization: GraphQL Ticker Requests

### Problem

Tab switching in `/buy/` pages triggers excessive GraphQL ticker requests due to:

- Full page navigation causing component remounting
- Individual ticker requests for each coin (20-50+ requests per tab)
- Request cancellation when switching tabs quickly

### 🚀 Recommended Implementation Order

1. **Immediate**: Apply increased cache duration fix
   - Extend CoinTicker cache-first policy
   - Increase random delay staggering (100ms → 200ms)

2. **Short-term**: Implement client-side tab switching
   - Replace URL navigation with client-side state management
   - Eliminate component remounting and request cancellation
   - Cache data per tab to avoid refetching

3. **Medium-term**: Add batch ticker requests
   - Create `GET_MULTIPLE_TICKERS` GraphQL query
   - Fetch all tickers in single request per tab
   - Reduce network overhead significantly

4. **Long-term**: Enhance overall GraphQL caching strategy
   - Improve URQL cache configuration
   - Add TTL-based cache expiration
   - Implement cache-and-network strategy

### Impact

- Reduce GraphQL requests from 50+ per tab switch to near zero
- Eliminate request cancellation and improve UX
- Better cache utilization across tab switches

## Resources

- Next.js App Router documentation
- GraphQL with Next.js guides
- Cloudflare Workers compatibility for MongoDB
