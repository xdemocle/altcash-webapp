import { Context, OrderParams } from '../types';
import logger from '../utilities/logger';

// Resolvers define the technique for fetching the types defined in the
// schema.
const resolvers = {
  Query: {
    getOrders: async (_: unknown, __: unknown, context: Context) => {
      return await context.dataSources.ordersAPI.getOrders();
    },
    getOrder: async (_root: unknown, { id }: { id: string }, context: Context) => {
      return await context.dataSources.ordersAPI.getOrder(id);
    },
  },
  Mutation: {
    createOrder: async (_root: unknown, { amount, total, symbol }: OrderParams, context: Context) => {
      const sendOrder = await context.dataSources.ordersAPI.createOrder(amount, total, symbol);

      return sendOrder;
    },
    updateOrder: async (_: unknown, { id, input }: { id: string; input: OrderParams }, context: Context) => {
      const updateOrder = await context.dataSources.ordersAPI.updateOrder(id, input);

      logger.debug(`updateOrder ${updateOrder}`);

      return updateOrder;
    },
  },
};

export default resolvers;
