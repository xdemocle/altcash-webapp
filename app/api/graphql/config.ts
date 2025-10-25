interface EnvWithNode extends Env {
  NODE_ENV: string;
}

// Get environment from Cloudflare Workers or fallback to process.env for local dev
const getEnv = () => {
  // Check if we're in Cloudflare Workers
  if (typeof globalThis !== 'undefined' && 'process' in globalThis === false) {
    // Will be set by route.ts from env parameter
    return (globalThis as { Env?: EnvWithNode }).Env || ({} as EnvWithNode);
  }

  // Local development with Next.js
  return process.env;
};

const env = getEnv();

export const NODE_ENV = env.NODE_ENV || 'development';

export const SENDGRID_API_KEY = env.SENDGRID_API_KEY || '';

export const CMC_PRO_API_KEY = env.CMC_PRO_API_KEY || '';

export const BINANCE_API_URL = env.BINANCE_API_URL || '';

export const BINANCE_API_KEY = env.BINANCE_API_KEY || '';

export const BINANCE_API_SECRET = env.BINANCE_API_SECRET || '';

export const BINANCE_API_KEY_TESTNET = env.BINANCE_API_KEY_TESTNET || '';

export const BINANCE_API_SECRET_TESTNET = env.BINANCE_API_SECRET_TESTNET || '';
