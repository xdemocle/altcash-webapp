// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare/config';
import kvIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache';
import kvNextTagCache from '@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache';

export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  cachePurge: 'dummy', // Disable cache purge - KV handles invalidation internally
  enableCacheInterception: true,
  tagCache: kvNextTagCache,
});
