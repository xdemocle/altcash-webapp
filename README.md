# Altcash Web Application

Full-stack cryptocurrency exchange application built with Next.js and GraphQL.

## Monorepo Structure

This is a bun workspaces monorepo containing:

- **`packages/frontend`** - Next.js 15 + React 19 + TypeScript + Apollo Client
- **`packages/backend`** - Express + Apollo GraphQL + MongoDB + Binance API

## Quick Start

### Prerequisites

- Node.js >= 16.0.0
- Bun >= 1.0.0
- MongoDB running locally or connection string
- Binance API credentials (for backend)

### Installation

```bash
# Install all dependencies
bun install
```

### Environment Setup

**Frontend** (`packages/frontend/.env.local`):
```bash
NEXT_PUBLIC_GRAPHQL_SERVER=http://localhost:4000
```

**Backend** (`packages/backend/.env`):
```bash
NODE_ENV=development
PORT=4000
# Add Binance and other API keys
```

### Development

```bash
# Run both frontend and backend
bun dev

# Or run individually
bun dev:frontend  # http://localhost:3000
bun dev:backend   # http://localhost:4000
```

### Building

```bash
# Build both packages
bun build
```

## Features

- 🪙 Real-time cryptocurrency prices via Binance API
- 📊 Market data and trading pairs
- 🛒 Automated order processing with queue system
- 💰 BTC-quoted trading pairs
- 📱 Responsive UI with Material-UI
- ⚡ Real-time updates with Socket.IO
- 🔐 Secure API integrations

## Tech Stack

### Frontend
- Next.js 15 (Pages Router)
- React 19
- TypeScript
- Apollo Client (GraphQL)
- Material-UI v7
- tss-react (styling)
- Socket.IO client

### Backend
- Node.js + Express
- Apollo Server (GraphQL)
- MongoDB + Mongoose
- Binance API integration
- Automated cron jobs
- Winston logging

## Documentation

See `CLAUDE.md` for detailed development guidance and architecture information.

## License

ISC

## Author

Rocco R. <im@rocco.me>
