# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this monorepo.

## Monorepo Structure

This is a **bun workspaces** monorepo containing the full Altcash application:

```
altcash-webapp/
├── packages/
│   ├── frontend/     # Next.js + React frontend (@altcash/frontend)
│   └── backend/      # Express + GraphQL backend (@altcash/backend)
└── package.json      # Root workspace configuration
```

## Package Manager

**IMPORTANT: This project uses `bun` as the package manager, NOT npm or yarn.**

All package operations should use `bun`:
```bash
# Install all dependencies for all packages
bun install

# Add a dependency to a specific package
bun add <package> --filter frontend
bun add <package> --filter backend

# Run commands in specific packages
bun run --filter frontend <script>
bun run --filter backend <script>
```

## Development Commands

### Running Both Applications

```bash
# Run both frontend and backend concurrently
bun dev

# Run frontend only (http://localhost:3000)
bun dev:frontend

# Run backend only (http://localhost:4000)
bun dev:backend
```

### Building

```bash
# Build both packages
bun build

# Build frontend only
bun build:frontend

# Build backend only
bun build:backend
```

### Production

```bash
# Start frontend in production mode
bun start:frontend

# Start backend (currently alias for build)
bun start:backend
```

### Maintenance

```bash
# Lint frontend code
bun lint

# Clean all node_modules and build artifacts
bun clean

# Reinstall all dependencies
bun clean && bun install
```

## Environment Setup

### Frontend (.env.local in packages/frontend/)
```
NEXT_PUBLIC_GRAPHQL_SERVER=http://localhost:4000
```

### Backend (.env in packages/backend/)
```
NODE_ENV=development
PORT=4000
SENDGRID_API_KEY=your_key
CMC_PRO_API_KEY=your_key
BINANCE_API_KEY=your_key
BINANCE_API_SECRET=your_secret
BINANCE_API_KEY_TESTNET=your_testnet_key
BINANCE_API_SECRET_TESTNET=your_testnet_secret
BINANCE_API_URL=https://api.binance.com
```

## Frontend Architecture (@altcash/frontend)

### Tech Stack
- **Next.js 15.5.6** - React framework with Pages Router
- **React 19** - Latest React version
- **TypeScript 5.9.3**
- **Apollo Client 4** - GraphQL client
- **MUI v7** - Material-UI components
- **tss-react** - Styling solution

### Key Patterns

#### Component Structure (Atomic Design)
- `src/components/atoms/` - Basic components
- `src/components/molecules/` - Component combinations
- `src/components/organisms/` - Complex UI sections
- `src/components/templates/` - Page layouts

#### Styling with tss-react
```typescript
// use-styles.tsx
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}));

// Component
const { classes } = useStyles();  // Always destructure!
```

#### Context Providers
- `src/context/global.tsx` - App state (sidebar, tabs, bitcoin price)
- `src/context/favourites.tsx` - User favourites (localStorage)
- Providers composed in `src/pages/_app.tsx`

#### GraphQL Integration
- Apollo Client in `src/common/apollo/apollo-client.ts`
- Queries in `src/graphql/queries.ts`
- Connects to backend GraphQL server

### Known Issues
- Minor SSR warning during development (non-blocking, doesn't affect functionality)

## Backend Architecture (@altcash/backend)

### Tech Stack
- **Apollo Server 3** with Express
- **GraphQL** schema-first approach
- **MongoDB** with Mongoose
- **Binance API** integration
- **TypeScript** with ts-node

### Core Components

#### Order Processing Pipeline
1. User creates order → MongoDB
2. **Cron 1** (5s): Import paid orders to queue
3. **Cron 2** (15s): Execute queued orders on Binance
4. Queue tracks: `isExecuted`, `isFilled`, `hasErrors`

#### DataSources
- `BinanceAPI` - Market data + order execution
- `OrdersAPI` - Order MongoDB operations
- `OrdersQueueAPI` - Queue management + Binance execution
- `MetadataAPI` - Crypto metadata (CoinMarketCap)

#### Key Patterns

**Order Execution**:
```typescript
// In OrdersQueueAPI.executeExchangeOrder()
1. Validate Binance account (balance > 0.0006 BTC)
2. Post market buy order
3. Update order.orderReferences with response
4. Mark queue status
```

**GraphQL Resolvers**:
- Domain-split resolvers in `src/resolvers/`
- Merged in `src/utilities/apollo.ts`
- Schema in `src/schema.graphql`

### Important Constraints
- All pairs must be BTC-quoted (base/BTC)
- Market orders only
- Minimum: 0.0006 BTC balance
- Account must have `canTrade: true`

## Full-Stack Integration

### Development Workflow

1. **Start backend first**:
   ```bash
   cd packages/backend
   bun dev  # Runs on port 4000
   ```

2. **Then start frontend**:
   ```bash
   cd packages/frontend
   bun dev  # Runs on port 3000
   ```

Or from root:
```bash
bun dev  # Starts both
```

### Data Flow

```
Frontend (React/Next.js)
  ↓ Apollo Client
Backend GraphQL API (port 4000)
  ↓ DataSources
MongoDB + Binance API
  ↓ Cron Jobs
Automated Order Processing
```

### API Communication

- Frontend uses `NEXT_PUBLIC_GRAPHQL_SERVER` to connect to backend
- Backend exposes GraphQL endpoint at `/graphql`
- Apollo Client handles caching and state management
- Backend cron jobs run independently of frontend requests

## Common Development Tasks

### Adding a New Feature

**Frontend**:
1. Create GraphQL query in `packages/frontend/src/graphql/queries.ts`
2. Create component in appropriate atomic design folder
3. Use `useQuery` or `useMutation` hooks
4. Style with tss-react

**Backend**:
1. Define type in `packages/backend/src/schema.graphql`
2. Create resolver in `packages/backend/src/resolvers/`
3. Add to resolver merge in `src/utilities/apollo.ts`
4. Create DataSource if needed

### Database Changes

1. Update Mongoose model in `packages/backend/src/models/`
2. Update TypeScript types in `packages/backend/src/types.ts`
3. Update GraphQL schema in `packages/backend/src/schema.graphql`
4. Update resolvers accordingly

### Working with Orders

- Orders are queued and executed via cron jobs
- Check `hasErrors` flag for failed orders
- `orderReferences` contains Binance API response history
- Queue linked by `orderId` (string of Order._id)

## Debugging

### Frontend
- Dev server includes inspector: `NODE_OPTIONS='--inspect'`
- Check browser console for client errors
- Apollo DevTools for GraphQL debugging

### Backend
- Logs in `./altcash.log` (production)
- Console output in development
- MongoDB connection errors check connection string
- Binance API errors check credentials and balance

## Package-Specific Documentation

For detailed package-specific information, see:
- `packages/frontend/CLAUDE.md` - Frontend-specific details
- `packages/backend/CLAUDE.md` - Backend-specific details
