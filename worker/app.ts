import type { ExportedHandler } from '@cloudflare/workers-types';
// import { handler } from 'next/dist/build/templates/app-page';

// `.open-next/worker.js` is generated during the OpenNext build step
// @ts-expect-error - This file is generated during the build process
import { default as handler } from '../.open-next/worker.js';

const worker: ExportedHandler<Env> = {
  fetch(request, env, context) {
    return handler.fetch(request, env, context);
  },
};

export default worker;
