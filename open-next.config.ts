// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare/config';
import kvCachePurge from '@opennextjs/cloudflare/overrides/cache-purge/index';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';
import kvNextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache';

export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  cachePurge: kvCachePurge,
  enableCacheInterception: true,
  tagCache: kvNextTagCache,
});
