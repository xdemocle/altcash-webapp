import BinanceAPI from '../datasources/binance.node';
import MetadataAPI from '../datasources/metadata';
import MybitxAPI from '../datasources/mybitx';
import NamesAPI from '../datasources/names';
// import OrdersAPI from '../datasources/orders';
// import OrdersQueueAPI from '../datasources/orders-queue';

export default {
  marketsAPI: new BinanceAPI(),
  mybitxAPI: new MybitxAPI(),
  metadataAPI: new MetadataAPI(),
  namesAPI: new NamesAPI(),
  // ordersAPI: new OrdersAPI(),
  // ordersQueueAPI: new OrdersQueueAPI()
};
