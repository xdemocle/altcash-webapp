import { useQuery } from '@tanstack/react-query';
import { DocumentNode } from 'graphql';
import { urqlClient } from '~common/graphql';

export function useGraphQLQuery<TData = any>(
  key: string[],
  query: DocumentNode,
  variables?: Record<string, any>,
  options?: any
) {
  return useQuery({
    queryKey: [key, variables],
    queryFn: async () => {
      const result = await urqlClient.query(query, variables).toPromise();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data as TData;
    },
    ...options,
  });
}
