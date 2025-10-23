import { each, filter, find, isUndefined } from 'lodash';
import {
  AccountStatus,
  Context,
  DataSources,
  Market,
  MissingMarket
} from '../types';
import logger from '../utilities/logger';

const queryMarkets = async (
  _: unknown,
  {
    limit,
    offset = 0,
    term,
    symbols
  }: {
    limit?: number;
    offset: number;
    term: string;
    symbols: string;
  },
  context: Context
): Promise<Market[]> => {
  let markets = await context.dataSources.marketsAPI.getAllMarkets();
  const names = await context.dataSources.namesAPI.getAll();
  const missingNames: string[] = [];
  const missingNamesArr: MissingMarket[] = [];

  // Filter out markets with undefined baseAsset
  markets = filter(markets, (market) => {
    if (!market.baseAsset || market.baseAsset === 'undefined') {
      logger.warn(
        `Filtering out market with undefined baseAsset: ${JSON.stringify(market)}`
      );
      return false;
    }
    return true;
  });

  // Add names
  each(markets, async (market) => {
    const nameCoin = find(names, (name) => {
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
      logger.error(
        `SKIPPING market with undefined baseAsset after filter: ${JSON.stringify(market)}`
      );
      return;
    }

    market.id = market.symbol = market.baseAsset;

    market.minNotional = Number(
      find(market.filters, { filterType: 'NOTIONAL' })?.minNotional
    );

    market.minTradeSize = Number(
      find(market.filters, { filterType: 'LOT_SIZE' })?.minQty
    );

    market.stepSize = Number(
      find(market.filters, { filterType: 'LOT_SIZE' })?.stepSize
    );
  });

  // Final filter: remove any markets with undefined ID
  markets = markets.filter((market) => {
    if (!market.id || market.id === 'undefined') {
      logger.error(
        `FINAL FILTER: Removing market with undefined ID: ${JSON.stringify(market)}`
      );
      return false;
    }
    return true;
  });

  // Order by name
  markets.sort((a: Market, b: Market) => {
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
  each(missingNames, (name) => {
    missingNamesArr.push({
      symbol: name,
      name: name
    });
  });

  if (missingNamesArr.length > 0) {
    logger.info(`missingNamesArr ${JSON.stringify(missingNamesArr)}`);
  }

  // Search feature or symbols one
  if (!isUndefined(symbols)) {
    limit = limit || 20;

    if (!symbols.length) {
      markets = [];
    } else {
      markets = filter(markets, (coin) => {
        return symbols.split('|').includes(coin.baseAsset);
      });
    }
  } else if (term && term.length) {
    limit = limit || 20;

    markets = filter(markets, (coin) => {
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

const queryMarket = async (
  _: unknown,
  { id }: { id: string },
  { dataSources }: { dataSources: DataSources }
): Promise<Market> => {
  if (!id || id === 'undefined' || id === undefined) {
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
      name: ''
    } as any;
  }
  const market = await dataSources.marketsAPI.getMarket(id);
  let metaCoin = {
    name: ''
  };

  try {
    metaCoin = await dataSources.metadataAPI.getCoin(market.baseAsset);
  } catch (error) {
    logger.debug(`queryMarkets ${error}`);
  }

  // Add the id for client caching purpose
  return {
    id: market.baseAsset,
    symbol: market.baseAsset,
    baseAsset: market.baseAsset,
    quoteAsset: market.quoteAsset,
    quotePrecision: market.quoteAssetPrecision,
    filters: market.filters,
    minNotional: Number(
      find(market.filters, { filterType: 'NOTIONAL' })?.minNotional
    ),
    minTradeSize: Number(
      find(market.filters, { filterType: 'LOT_SIZE' })?.minQty
    ),
    stepSize: Number(
      find(market.filters, { filterType: 'LOT_SIZE' })?.stepSize
    ),
    status: market.status,
    name: metaCoin.name
  };
};

const queryCanTrade = (
  _: unknown,
  __: unknown,
  context: Context
): Promise<AccountStatus> => {
  return context.dataSources.marketsAPI.getCanTrade();
};

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    markets: queryMarkets,
    market: queryMarket,
    canTrade: queryCanTrade
  }
};

export default resolvers;
