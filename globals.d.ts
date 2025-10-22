declare module '@binance/connector' {
  export class Spot {
    constructor(apiKey: string, apiSecret: string, options?: any);
    account(): Promise<any>;
    newOrder(
      symbol: string,
      side: string,
      type: string,
      options?: any
    ): Promise<any>;
  }
}
