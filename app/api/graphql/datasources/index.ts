import BinanceAPI from '../datasources/binance';
import MetadataAPI from '../datasources/metadata';
import MybitxAPI from '../datasources/mybitx';
import NamesAPI from '../datasources/names';
import OrdersQueueAPI from '../datasources/orders-queue';

export default {
  marketsAPI: new BinanceAPI(),
  mybitxAPI: new MybitxAPI(),
  metadataAPI: new MetadataAPI(),
  namesAPI: new NamesAPI(),
  ordersQueueAPI: new OrdersQueueAPI()
};
