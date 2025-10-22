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

1. **Backup and Branch**: Ensure you're on a new branch (as mentioned).
2. **Copy Backend Code**: Move necessary backend files to `packages/frontend/app/api` directory.
3. **Update GraphQL Schema**: Adapt GraphQL server to run within Next.js API route.
4. **Database Connection**: Configure MongoDB connection for serverless environment.
5. **Implement API Routes**: Create `/api/graphql` route in Next.js.
6. **Test Locally**: Run Next.js dev server and test API endpoints.
7. **Update Frontend**: Change GraphQL endpoint in frontend code.
8. **Deploy and Test**: Deploy to Cloudflare and verify functionality.

## Detailed Steps

### 1. Backup and Branch

- Already done; ensure all changes are committed.

### 2. Copy Backend Code

- Copy `resolvers`, `datasources`, `graphql` directories from backend to `packages/frontend/app/api`.
- Adjust import paths as needed.

### 3. Update GraphQL Schema

- Create a new API route in `app/api/graphql/route.ts`.
- Use `graphql-yoga` or similar to handle GraphQL requests.

### 4. Database Connection

- Use MongoDB driver compatible with Cloudflare Workers (e.g., with `fetch` API).
- Handle connections with environment variables.

### 5. Implement API Routes

- Set up the GraphQL endpoint to handle queries and mutations.
- Ensure error handling and logging are in place.

### 6. Test Locally

- Run `bun run dev:frontend` and test `/api/graphql` endpoint.

### 7. Update Frontend

- Change `NEXT_PUBLIC_GRAPHQL_SERVER` to `/api/graphql` in .env.local.
- Update any hard-coded URLs in code.

### 8. Deploy and Test

- Build and deploy using OpenNext Cloudflare tools.
- Test on staging environment.

## Timeline

- Planning: 1 hour
- Implementation: 4-6 hours
- Testing: 2-3 hours

## Resources

- Next.js App Router documentation
- GraphQL with Next.js guides
- Cloudflare Workers compatibility for MongoDB
