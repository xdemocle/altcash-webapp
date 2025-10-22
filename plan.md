# Migration Plan: Move Backend to Next.js API Routes

## Overview

This plan outlines the steps to integrate the existing Node.js/Express backend into the Next.js frontend using the App Router API routes. This will create a monolith application, simplifying deployment and reducing CORS issues.

## Benefits

- Simplified deployment as a single application.
- No need for separate backend server.
- Better integration with Next.js features like SSR and caching.
- Easier management of GraphQL endpoints.

## Risks and Challenges

- Handling database connections (MongoDB) in a serverless environment like Cloudflare Workers.
- Ensuring GraphQL schema and resolvers are compatible with Next.js API routes.
- Potential performance impacts from moving to a serverless model.
- Need to update frontend GraphQL client to point to local /api/graphql instead of external URL.

## Steps

1. ✅ **Backup and Branch**: Completed - changes committed (dcb2376).
2. ✅ **Copy Backend Code**: Completed - backend files moved to `app/api` directory.
3. ✅ **Update GraphQL Schema**: Completed - API route created in `app/api/graphql/route.ts`.
4. ✅ **Dependencies**: Installed required packages (bson, wrangler, etc.).
5. ⏳ **Database Connection**: In progress - MongoDB connection setup for serverless environment.
6. ⏳ **Implement API Routes**: In progress - GraphQL endpoint implementation.
7. ⏳ **Test Locally**: Pending - Run `bun run dev` and test `/api/graphql` endpoint.
8. ✅ **Update Frontend**: Completed - Change GraphQL endpoint in frontend code.
9. ⏳ **Deploy and Test**: Pending - Deploy to Cloudflare and verify functionality.

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

- ⏳ Configure MongoDB driver for Cloudflare Workers compatibility.
- ⏳ Set up environment variables for database connection.
- ⏳ Test connection pooling in serverless environment.

### 5. Implement API Routes

- ⏳ Complete GraphQL endpoint implementation in `app/api/graphql/route.ts`.
- ⏳ Ensure error handling and logging are in place.
- ⏳ Test all resolvers and datasources.

### 6. Test Locally

- Run `bun run dev` and test `/api/graphql` endpoint.

### 7. Update Frontend

- ⏳ Update `NEXT_PUBLIC_GRAPHQL_SERVER` to `/api/graphql` in .env.local.
- ⏳ Update any hard-coded GraphQL URLs in frontend code.

### 8. Deploy and Test

- ⏳ Build using `bun run build`.
- ⏳ Deploy using OpenNext Cloudflare tools.
- ⏳ Test on staging environment.

## Timeline

- Planning: ✅ 1 hour (completed)
- Backend Migration: ✅ 2 hours (completed)
- Database & API Implementation: ⏳ 2-3 hours (in progress)
- Testing: ⏳ 2-3 hours (pending)
- Deployment: ⏳ 1 hour (pending)

## Resources

- Next.js App Router documentation
- GraphQL with Next.js guides
- Cloudflare Workers compatibility for MongoDB
