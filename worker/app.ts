import type { ExportedHandler } from '@cloudflare/workers-types';

// `.open-next/worker.js` is generated during the OpenNext build step
import handler from '../.open-next/worker.js';

const worker: ExportedHandler<Env> = {
  fetch(request, env, context) {
    return handler.fetch(request, env, context);
  },
};

export default worker;
