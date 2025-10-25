import { AccountStatus, BinanceMarket, MissingMarket, QueryMarketsArgs } from 'graphql/types';
import { each, filter, find, isUndefined } from 'lib/lodash-utils';
import logger from 'lib/logger';
import { AppGraphContext } from '../config';

const queryMarkets = async (_: unknown, args: QueryMarketsArgs, context: AppGraphContext): Promise<BinanceMarket[]> => {
  let { limit } = args;
  const offset = args.offset ?? 0;
  const term = args.term;
  const symbols = args.symbols;
  const missingNames: string[] = [];
  const missingNamesArr: MissingMarket[] = [];

  let markets = (await context.dataSources.marketsAPI.getAllMarkets()) as BinanceMarket[];
  const names = await context.dataSources.namesAPI.getAll();

  logger.debug(`queryMarkets called with args: ${JSON.stringify({ limit, offset, term, symbols })}`);

  // Filter out markets with undefined baseAsset
  markets = filter(markets, market => {
    if (!market.baseAsset || market.baseAsset === 'undefined') {
      logger.warn(`Filtering out market with undefined baseAsset: ${JSON.stringify(market)}`);
      return false;
    }
    return true;
  });

  // Add names
  await Promise.all(
    markets.map(async market => {
      const nameCoin = find(names, name => {
        return name.symbol === market.baseAsset;
      });

      if (!nameCoin) {
        if (missingNames.indexOf(market.baseAsset) === -1) {
          missingNames.push(market.baseAsset);
        }
      } else {
        market.name = nameCoin.name;
      }

      // Defensive check: skip if baseAsset is still undefined
      if (!market.baseAsset || market.baseAsset === 'undefined') {
        logger.error(`SKIPPING market with undefined baseAsset after filter: ${JSON.stringify(market)}`);
        return;
      }

      market.id = market.symbol = market.baseAsset;

      const notionalFilter = find(market.filters, { filterType: 'NOTIONAL' }) as { minNotional?: string } | undefined;
      market.minNotional = Number(notionalFilter?.minNotional);

      const lotSizeFilter = find(market.filters, { filterType: 'LOT_SIZE' }) as
        | { minQty?: string; stepSize?: string }
        | undefined;
      market.minTradeSize = Number(lotSizeFilter?.minQty);
      market.stepSize = Number(lotSizeFilter?.stepSize);
    })
  );

  // Final filter: remove any markets with undefined ID
  markets = markets.filter(market => {
    if (!market.id || market.id === 'undefined') {
      logger.error(`FINAL FILTER: Removing market with undefined ID: ${JSON.stringify(market)}`);
      return false;
    }
    return true;
  });

  // Order by name
  markets.sort((a: BinanceMarket, b: BinanceMarket) => {
    // ignore upper and lowercase
    const nameA = a.symbol && a.symbol.toUpperCase();
    const nameB = b.symbol && b.symbol.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  });

  // Prepare array of missing names stringified
  each(missingNames, name => {
    missingNamesArr.push({
      symbol: name,
      name: name,
    });
  });

  if (missingNamesArr.length > 0) {
    logger.info(`missingNamesArr ${JSON.stringify(missingNamesArr)}`);
  }

  // Search feature or symbols one
  if (!isUndefined(symbols) && symbols) {
    limit = limit || 20;

    const symbolList = symbols.split('|').filter(s => s.trim());
    logger.debug(`Filtering by symbols: ${JSON.stringify(symbolList)}, total markets: ${markets.length}`);
    if (symbolList.length === 0) {
      markets = [];
    } else {
      markets = filter(markets, coin => {
        const match = symbolList.includes(coin.baseAsset);
        if (match) {
          logger.debug(`Symbol match: ${coin.baseAsset}`);
        }
        return match;
      });
    }
    logger.debug(`After symbol filter: ${markets.length} markets`);
  } else if (term && term.length) {
    limit = limit || 20;

    markets = filter(markets, (coin: BinanceMarket) => {
      return (
        (coin.name && (coin.name as string).toLowerCase().search(term) !== -1) ||
        coin.symbol.toLowerCase().search(term.toLowerCase()) !== -1
      );
    });
  }

  // Pagination feature
  if (limit) {
    markets = markets.slice(offset, offset + limit);
  }

  const result: BinanceMarket[] = markets.map(m => ({
    id: m.id ?? m.baseAsset,
    symbol: m.baseAsset,
    baseAsset: m.baseAsset,
    quoteAsset: m.quoteAsset,
    quotePrecision: m.quoteAssetPrecision ?? 0,
    minNotional: Number(m.minNotional ?? 0) || 0,
    minTradeSize: Number(m.minTradeSize ?? 0) || 0,
    stepSize: Number(m.stepSize ?? 0) || 0,
    status: m.status ?? '',
    name: m.name ?? '',
  } as BinanceMarket));

  return result;
};

const queryMarket = async (_: unknown, args: { id: string }, context: AppGraphContext): Promise<BinanceMarket> => {
  if (!args.id || args.id === 'undefined' || args.id === undefined) {
    const empty: BinanceMarket = {
      id: '',
      symbol: '',
      baseAsset: '',
      quoteAsset: '',
      quotePrecision: 0,
      minNotional: 0,
      minTradeSize: 0,
      stepSize: 0,
      status: '',
      name: '',
    } as BinanceMarket;
    return empty;
  }
  const market = (await context.dataSources.marketsAPI.getMarket(args.id)) as {
    baseAsset: string;
    quoteAsset: string;
    quoteAssetPrecision: number;
    filters: { filterType: string; minNotional?: string; minQty?: string; stepSize?: string }[];
    status: string;
  };
  let metaCoin = {
    name: '',
  };

  try {
    metaCoin = await context.dataSources.metadataAPI.getCoin(market.baseAsset);
  } catch (error) {
    logger.debug(`queryMarkets ${error}`);
  }

  const notionalFilter = find(market.filters, { filterType: 'NOTIONAL' }) as { minNotional?: string } | undefined;
  const lotSizeFilter = find(market.filters, { filterType: 'LOT_SIZE' }) as
    | { minQty?: string; stepSize?: string }
    | undefined;

  // Add the id for client caching purpose
  return {
    id: market.baseAsset,
    symbol: market.baseAsset,
    baseAsset: market.baseAsset,
    quoteAsset: market.quoteAsset,
    quotePrecision: market.quoteAssetPrecision ?? 0,
    minNotional: Number(notionalFilter?.minNotional) || 0,
    minTradeSize: Number(lotSizeFilter?.minQty) || 0,
    stepSize: Number(lotSizeFilter?.stepSize) || 0,
    status: market.status ?? '',
    name: metaCoin.name ?? '',
  } as BinanceMarket;
};

const queryCanTrade = (_: unknown, __: unknown, context: AppGraphContext): Promise<AccountStatus> => {
  return context.dataSources.marketsAPI.getCanTrade();
};

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    markets: queryMarkets,
    market: queryMarket,
    canTrade: queryCanTrade,
  },
};

export default resolvers;
