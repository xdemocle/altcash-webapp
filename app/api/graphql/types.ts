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
  symbols?: string;
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
  [key: string]: unknown;
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
  KV?: KVNamespace;
  dataSources: typeof datasources;
}

export interface OrderQueueSchema {
  orderId: string;
  isExecuted: boolean;
  isFilled: boolean;
  hasErrors: boolean;
}

export interface OrderSchema {
  amount: string;
  total: string;
  symbol: string;
  email: string;
  pin: string;
  isPaid: boolean;
  isPending: boolean;
  isWithdrawn: boolean;
  isCancelled: boolean;
  wallet: string;
  reference: string;
  hasErrors: boolean;
  orderReferences: string[];
}

/**
 * Request parameters for newOrder operation in TradeApi.
 * @interface NewOrderRequest
 */
export interface NewOrderRequest {
  /**
   *
   * @type {string}
   * @memberof TradeApiNewOrder
   */
  readonly symbol: string;
  /**
   *
   * @type {'BUY' | 'SELL'}
   * @memberof TradeApiNewOrder
   */
  readonly side: NewOrderSideEnum;
  /**
   *
   * @type {'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT' | 'LIMIT_MAKER' | 'NON_REPRESENTABLE'}
   * @memberof TradeApiNewOrder
   */
  readonly type: NewOrderTypeEnum;
  /**
   *
   * @type {'GTC' | 'IOC' | 'FOK' | 'NON_REPRESENTABLE'}
   * @memberof TradeApiNewOrder
   */
  readonly timeInForce?: NewOrderTimeInForceEnum;
  /**
   *
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly quantity?: number;
  /**
   *
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly quoteOrderQty?: number;
  /**
   *
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly price?: number;
  /**
   * A unique id among open orders. Automatically generated if not sent.<br/> Orders with the same `newClientOrderID` can be accepted only when the previous one is filled, otherwise the order will be rejected.
   * @type {string}
   * @memberof TradeApiNewOrder
   */
  readonly newClientOrderId?: string;
  /**
   *
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly strategyId?: number;
  /**
   * The value cannot be less than `1000000`.
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly strategyType?: number;
  /**
   * Used with `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly stopPrice?: number;
  /**
   * See [Trailing Stop order FAQ](faqs/trailing-stop-faq.md).
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly trailingDelta?: number;
  /**
   * Used with `LIMIT`, `STOP_LOSS_LIMIT`, and `TAKE_PROFIT_LIMIT` to create an iceberg order.
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly icebergQty?: number;
  /**
   *
   * @type {'ACK' | 'RESULT' | 'FULL' | 'MARKET' | 'LIMIT'}
   * @memberof TradeApiNewOrder
   */
  readonly newOrderRespType?: NewOrderNewOrderRespTypeEnum;
  /**
   *
   * @type {'NONE' | 'EXPIRE_TAKER' | 'EXPIRE_MAKER' | 'EXPIRE_BOTH' | 'DECREMENT' | 'NON_REPRESENTABLE'}
   * @memberof TradeApiNewOrder
   */
  readonly selfTradePreventionMode?: NewOrderSelfTradePreventionModeEnum;
  /**
   *
   * @type {'PRIMARY_PEG' | 'MARKET_PEG' | 'NON_REPRESENTABLE'}
   * @memberof TradeApiNewOrder
   */
  readonly pegPriceType?: NewOrderPegPriceTypeEnum;
  /**
   * Priceleveltopegthepriceto(max:100).<br>See[PeggedOrdersInfo](#pegged-orders-info)
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly pegOffsetValue?: number;
  /**
   *
   * @type {'PRICE_LEVEL' | 'NON_REPRESENTABLE'}
   * @memberof TradeApiNewOrder
   */
  readonly pegOffsetType?: NewOrderPegOffsetTypeEnum;
  /**
   * The value cannot be greater than `60000`. <br> Supports up to three decimal places of precision (e.g., 6000.346) so that microseconds may be specified.
   * @type {number}
   * @memberof TradeApiNewOrder
   */
  readonly recvWindow?: number;
}

export enum NewOrderSideEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum NewOrderTypeEnum {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP_LOSS = 'STOP_LOSS',
  STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
  TAKE_PROFIT = 'TAKE_PROFIT',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
  LIMIT_MAKER = 'LIMIT_MAKER',
  NON_REPRESENTABLE = 'NON_REPRESENTABLE',
}

export enum NewOrderTimeInForceEnum {
  GTC = 'GTC',
  IOC = 'IOC',
  FOK = 'FOK',
  NON_REPRESENTABLE = 'NON_REPRESENTABLE',
}

export enum NewOrderNewOrderRespTypeEnum {
  ACK = 'ACK',
  RESULT = 'RESULT',
  FULL = 'FULL',
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export enum NewOrderSelfTradePreventionModeEnum {
  NONE = 'NONE',
  EXPIRE_TAKER = 'EXPIRE_TAKER',
  EXPIRE_MAKER = 'EXPIRE_MAKER',
  EXPIRE_BOTH = 'EXPIRE_BOTH',
  DECREMENT = 'DECREMENT',
  NON_REPRESENTABLE = 'NON_REPRESENTABLE',
}

declare enum NewOrderPegPriceTypeEnum {
  PRIMARY_PEG = 'PRIMARY_PEG',
  MARKET_PEG = 'MARKET_PEG',
  NON_REPRESENTABLE = 'NON_REPRESENTABLE',
}

declare enum NewOrderPegOffsetTypeEnum {
  PRICE_LEVEL = 'PRICE_LEVEL',
  NON_REPRESENTABLE = 'NON_REPRESENTABLE',
}

export const SPOT_REST_API_PROD_URL = 'https://api.binance.com';
export const SPOT_REST_API_TESTNET_URL = 'https://testnet.binance.vision';
export const SPOT_WS_API_PROD_URL = 'wss://ws-api.binance.com:443/ws-api/v3';
export const SPOT_WS_API_TESTNET_URL = 'wss://ws-api.testnet.binance.vision/ws-api/v3';
export const SPOT_WS_STREAMS_PROD_URL = 'wss://stream.binance.com:9443';
export const SPOT_WS_STREAMS_TESTNET_URL = 'wss://stream.testnet.binance.vision';
export const SPOT_REST_API_MARKET_URL = 'https://data-api.binance.vision';
export const SPOT_WS_STREAMS_MARKET_URL = 'wss://data-stream.binance.vision';
