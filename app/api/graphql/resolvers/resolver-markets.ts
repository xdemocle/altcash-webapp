import { each, filter, find, isUndefined } from '~/lib/lodash-utils';
import logger from '~/lib/logger';
import { AccountStatus, Context, Market, MissingMarket } from '../types';

interface QueryMarketsArgs {
  limit?: number;
  offset: number;
  term: string;
  symbols: string;
}

const queryMarkets = async (_: unknown, args: QueryMarketsArgs, context: Context): Promise<Market[]> => {
  let { limit, offset = 0, term, symbols } = args;
  logger.debug(`queryMarkets called with args: ${JSON.stringify({ limit, offset, term, symbols })}`);
  let markets = (await context.dataSources.marketsAPI.getAllMarkets()) as any[];
  const names = await context.dataSources.namesAPI.getAll();
  const missingNames: string[] = [];
  const missingNamesArr: MissingMarket[] = [];

  // Filter out markets with undefined baseAsset
  markets = filter(markets, market => {
    if (!market.baseAsset || market.baseAsset === 'undefined') {
      logger.warn(`Filtering out market with undefined baseAsset: ${JSON.stringify(market)}`);
      return false;
    }
    return true;
  });

  // Add names
  each(markets, async market => {
    const nameCoin = find(names, name => {
      return name.symbol === market.baseAsset;
    });

    if (!nameCoin) {
      if (missingNames.indexOf(market.baseAsset) === -1) {
        missingNames.push(market.baseAsset);
      }
    } else {
      (market as any).name = nameCoin.name;
    }

    // Defensive check: skip if baseAsset is still undefined
    if (!market.baseAsset || market.baseAsset === 'undefined') {
      logger.error(`SKIPPING market with undefined baseAsset after filter: ${JSON.stringify(market)}`);
      return;
    }

    (market as any).id = market.symbol = market.baseAsset;

    const notionalFilter = find(market.filters, { filterType: 'NOTIONAL' }) as any;
    (market as any).minNotional = Number(notionalFilter?.minNotional);

    const lotSizeFilter = find(market.filters, { filterType: 'LOT_SIZE' }) as any;
    (market as any).minTradeSize = Number(lotSizeFilter?.minQty);
    (market as any).stepSize = Number(lotSizeFilter?.stepSize);
  });

  // Final filter: remove any markets with undefined ID
  markets = markets.filter(market => {
    if (!(market as any).id || (market as any).id === 'undefined') {
      logger.error(`FINAL FILTER: Removing market with undefined ID: ${JSON.stringify(market)}`);
      return false;
    }
    return true;
  });

  // Order by name
  markets.sort((a: any, b: any) => {
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

    markets = filter(markets, coin => {
      return (
        (coin.name && coin.name.toLowerCase().search(term) !== -1) ||
        coin.symbol.toLowerCase().search(term.toLowerCase()) !== -1
      );
    });
  }

  // Pagination feature
  if (limit) {
    markets = markets.slice(offset, offset + limit);
  }

  return markets;
};

const queryMarket = async (_: unknown, args: { id: string }, context: Context): Promise<Market> => {
  if (!args.id || args.id === 'undefined' || args.id === undefined) {
    return {
      id: '',
      symbol: '',
      baseAsset: '',
      quoteAsset: '',
      quotePrecision: 0,
      filters: [],
      minNotional: 0,
      minTradeSize: 0,
      stepSize: 0,
      status: '',
      name: '',
    } as any;
  }
  const market = (await context.dataSources.marketsAPI.getMarket(args.id)) as any;
  let metaCoin = {
    name: '',
  };

  try {
    metaCoin = await context.dataSources.metadataAPI.getCoin(market.baseAsset);
  } catch (error) {
    logger.debug(`queryMarkets ${error}`);
  }

  const notionalFilter = find(market.filters, { filterType: 'NOTIONAL' }) as any;
  const lotSizeFilter = find(market.filters, { filterType: 'LOT_SIZE' }) as any;

  // Add the id for client caching purpose
  return {
    id: market.baseAsset,
    symbol: market.baseAsset,
    baseAsset: market.baseAsset,
    quoteAsset: market.quoteAsset,
    quotePrecision: market.quoteAssetPrecision,
    filters: market.filters,
    minNotional: Number(notionalFilter?.minNotional),
    minTradeSize: Number(lotSizeFilter?.minQty),
    stepSize: Number(lotSizeFilter?.stepSize),
    status: market.status,
    name: metaCoin.name,
  };
};

const queryCanTrade = (_: unknown, __: unknown, context: Context): Promise<AccountStatus> => {
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
