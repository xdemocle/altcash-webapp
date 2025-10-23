import type { ExportedHandler } from '@cloudflare/workers-types';

// @ts-ignore `.open-next/worker.js` is generated during the OpenNext build step
import handler from '../.open-next/worker.js';

type WorkerEnv = Record<string, unknown>;

const worker: ExportedHandler<WorkerEnv> = {
  fetch(request, env, context) {
    return handler.fetch(request, env, context);
  },
};

export default worker;

// Re-export optional Durable Object handlers if OpenNext generated them
// eslint-disable-next-line import/no-duplicates
// @ts-ignore `.open-next/worker.js` is generated during the OpenNext build step
export { DOQueueHandler, DOShardedTagCache } from '../.open-next/worker.js';
