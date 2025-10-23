import { KVNamespace } from '@cloudflare/workers-types';
import datasources from './datasources';

export interface AccountStatus {
  canTrade: boolean;
  msg: string;
}

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
  symbol: string;
  name: string;
  logo: string;
  metadataId?: number;
  slug?: string;
  description?: string | null;
  urls?: MetadataUrls;
}

export interface Market {
  [x: string]: any;
  symbols?: any;
  id: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  quotePrecision: number;
  minTradeSize: number;
  minNotional: number;
  stepSize: number;
  status: string;
  name: string;
}

export interface Summary {
  id: string;
  symbol: string;
  high: number;
  low: number;
  volume: number;
  quoteVolume: number;
  percentChange: number;
  [x: string]: string | number;
}

export interface Ticker {
  id: string;
  symbol: string;
  price: string;
}

export interface Count {
  name: string;
  count: number;
}

export interface MissingMarket {
  symbol: string;
  name: string;
}

export interface Pair {
  ask: string;
  bid: string;
  last_trade: string;
  pair: string;
  rolling_24_hour_volume: string;
  status: string;
  timestamp: number;
}

export interface Order {
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
  hasErrors?: boolean;
  orderReferences: string[];
  timestamp: string;
}

export interface OrderParams {
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
  reference?: string;
  hasErrors?: boolean;
  orderReferences?: string[];
}

export interface UpdateOrderParams {
  email?: string;
  isPaid?: boolean;
  isPending?: boolean;
  isWithdrawn?: boolean;
  isCancelled?: boolean;
  wallet?: string;
  reference?: string;
  orderReferences?: string[];
}

export interface OrderQueue {
  orderId: string;
  isExecuted: boolean;
  isFilled: boolean;
  hasErrors: boolean;
  timestamp: string;
}

export interface OrderQueueParams {
  orderId: string;
  isExecuted?: boolean;
  isFilled?: boolean;
  hasErrors?: boolean;
}

export interface UpdateOrderQueueParams {
  orderId?: string;
  isExecuted?: boolean;
  isFilled?: boolean;
  hasErrors?: boolean;
}

export declare abstract class DataSource<T = any> {
  getCanTrade(): Promise<AccountStatus>;
  executeOrders(orders: OrderQueue[]): Promise<OrderQueue[] | null>;
  getAllMarkets(): Promise<Market[]>;
  getMarket(id: string): Promise<Market>;
  getTicker(id: string): Promise<Ticker>;
  getPair(pair: string): Promise<Pair>;
  getAllTickers(): Promise<Ticker[]>;
  getSummary(id: string): Promise<Summary>;
  getCoin(id: string): Promise<Metadata>;
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order>;
  getQueues(): Promise<OrderQueue[] | null>;
  getQueue(id: string): Promise<OrderQueue>;
  createOrder(amount: string, total: string, symbol: string): Promise<Order>;
  updateOrder(id: string, input: OrderParams): Promise<Order>;
  createQueue(
    orderId: string,
    isExecuted: boolean,
    isFilled: boolean
  ): Promise<OrderQueue>;
  updateQueue(id: string, input: UpdateOrderQueueParams): Promise<any>;
  getAll(): Promise<Metadata[]>;
  missingData(): Promise<Metadata[]>;
  importAndCheckOrders(orders: Order[]): Promise<any>;
  checkPendingPaidOrders(): Promise<Order[]>;
}

export type DataSources = {
  [name: string]: DataSource;
};

export interface BinanceOrderResponse {
  statusText: string;
  data: {
    // symbol: 'XRPBTC',
    symbol: string;
    // orderId: 196334,
    orderId: number;
    // orderListId: -1,
    orderListId: number;
    // clientOrderId: 'ZiYunMe8S7XEmq8AtcUk7N',
    clientOrderId: string;
    // transactTime: 1658591808732,
    transactTime: number;
    // price: '0.00000000',
    price: string;
    // origQty: '20.00000000',
    origQty: string;
    // executedQty: '0.00000000',
    executedQty: string;
    // cummulativeQuoteQty: '0.00000000',
    cummulativeQuoteQty: string;
    // status: 'EXPIRED',
    status: string;
    // timeInForce: 'GTC',
    timeInForce: string;
    // type: 'MARKET',
    type: string;
    // side: 'BUY',
    side: string;
    // fills: []
    fills: string[];
  };
}

// Define context
export interface Context {
  kv: KVNamespace;
  dataSources: typeof datasources;
}
