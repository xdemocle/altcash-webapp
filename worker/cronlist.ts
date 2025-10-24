import { urqlClient } from '~/common/graphql';
import logger from '~/lib/logger';
import { queryCheckAndExecuteOrderQueue, queryImportAndCheckOrders } from './queries';

export const runCron = () => {
  // importAndCheckOrders
  setInterval(async () => {
    const result = await urqlClient.query(queryImportAndCheckOrders, undefined).toPromise();

    if (result.data?.importAndCheckOrders?.length) {
      logger.debug(`importAndCheckOrders ${JSON.stringify(result.data.importAndCheckOrders)}`);
    }
  }, 5000);

  // checkAndExecuteOrderQueue
  setInterval(async () => {
    const result = await urqlClient.query(queryCheckAndExecuteOrderQueue, undefined).toPromise();

    if (result.data?.checkAndExecuteOrderQueue?.length) {
      logger.debug(`checkAndExecuteOrderQueue ${JSON.stringify(result.data.checkAndExecuteOrderQueue)}`);
    }
  }, 15000);
};
