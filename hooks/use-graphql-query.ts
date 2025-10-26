import { useQuery } from '@tanstack/react-query';
import { urqlClient } from 'common/graphql';
import { DocumentNode } from 'graphql';

export function useGraphQLQuery<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  key: string[],
  query: DocumentNode,
  variables?: TVariables,
  options?: Record<string, unknown>
) {
  return useQuery({
    queryKey: [key, variables],
    queryFn: async () => {
      const result = await urqlClient.query(query, variables || {}).toPromise();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data as TData;
    },
    ...options,
  });
}
