# Altcash Web Application

Full-stack cryptocurrency exchange application built with Next.js and GraphQL.

## Monorepo Structure

This monorepo is managed with **Bun workspaces** and contains:

- **`packages/frontend`** - Next.js 15 + React 19 + TypeScript + graphql-yoga
- **`packages/backend`** - Express + graphql-yoga + MongoDB + Binance API

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

### Workspace Package Management

```bash
# Add/remove dependencies for a single workspace
bun add <pkg> --filter frontend
bun remove <pkg> --filter backend

# Run package-specific scripts
bun run --filter frontend <script>
bun run --filter backend <script>
```

### Environment Setup

**Frontend** (`packages/frontend/.env.local`):

```bash

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
- graphql-yoga Client (GraphQL)
- Material-UI v7
- Socket.IO client

### Backend

- Node.js + Express
- graphql-yoga Server (GraphQL)
- MongoDB + Mongoose
- Binance API integration
- Automated cron jobs
- Winston logging

## Documentation

Refer to [`CLAUDE.md`](./CLAUDE.md) for comprehensive development workflows, architecture notes, and CLI guidance covering both frontend and backend packages.

## License

CC BY-NC 4.0

## Author

Rocco R. <im@rocco.me>
