export interface MetadataUrls {
  website: string[];
  twitter: string[];
  chat: string[];
  message_board: string[];
  explorer: string[];
  reddit: string[];
  technical_doc: string[];
  source_code: string[];
  announcement: string[];
}

export interface Metadata {
  id: string;
  metadataId: number;
  name: string;
  symbol: string;
  slug: string;
  description: string;
  logo: string;
  urls: MetadataUrls;
}

export interface Market {
  id: string;
  symbol: string;
  name: string;
  status: string;
  quotePrecision: number;
  minTradeSize: number;
  minNotional: number;
  stepSize: number;
}

export interface MarketsResponse {
  markets: Market[];
}

export interface MarketsVariables {
  offset?: number;
  limit?: number;
  term?: string;
  symbols?: string;
}

export interface Ticker {
  id: string;
  price: string;
}

export interface Summary {
  id: string;
  high: number;
  low: number;
  volume: number;
  quoteVolume: number;
  percentChange: number;
}

export interface PageDataResponse {
  market: Market;
  summary: Summary;
  ticker: Ticker;
}

export interface PageDataVariables {
  id: string;
}

export interface MetaCoinAllItem {
  logo: string;
  symbol: string;
}

export interface PairResponse {
  pair?: {
    pair: string;
    last_trade: string;
    timestamp: string;
  };
}

export interface PairVariables {
  pair: string;
}

export interface CountItem {
  name: string;
  count: number;
}

export interface CountResponse {
  count?: CountItem[];
}

export interface Order {
  _id: string;
  amount: string;
  total: string;
  symbol: string;
  email?: string;
  pin?: string;
  isPaid?: boolean;
  isPending?: boolean;
  isWithdrawn?: boolean;
  isCancelled?: boolean;
  wallet?: string;
  reference: string;
  orderReferences: string[];
  hasErrors: boolean;
  timestamp: string;
}

export interface OrderParams {
  amount?: string;
  total?: string;
  symbol?: string;
  email?: string;
  pin?: string;
  isPaid?: boolean;
  isPending?: boolean;
  isWithdrawn?: boolean;
  isCancelled?: boolean;
  wallet?: string;
  reference?: string;
  orderReferences?: string[];
  hasErrors?: boolean;
  [key: string]: unknown;
}
