// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare/config';
// import kvCachePurge from '@opennextjs/cloudflare/overrides/cache-purge/index';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';
// TODO
// import memoryQueue from '@opennextjs/cloudflare/overrides/queue/memory-queue';
// import kvNextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache';

export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  // cachePurge: kvCachePurge,
  // queue: memoryQueue,
  enableCacheInterception: true,
  // tagCache: kvNextTagCache,
});
