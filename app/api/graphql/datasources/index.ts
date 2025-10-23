import BinanceAPI from '../datasources/binance';
import BittrexAPI from '../datasources/bittrex';
import MetadataAPI from '../datasources/metadata';
import MybitxAPI from '../datasources/mybitx';
import NamesAPI from '../datasources/names';

export default {
  binanceAPI: new BinanceAPI(),
  bittrexAPI: new BittrexAPI(),
  mybitxAPI: new MybitxAPI(),
  metadataAPI: new MetadataAPI(),
  namesAPI: new NamesAPI()
};
