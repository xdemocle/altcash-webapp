import { useMutation as useTanstackMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentNode } from 'graphql';
import { urqlClient } from '~/common/graphql-client';

export function useGraphQLMutation<TData = any, TVariables extends Record<string, any> = any>(
  mutation: DocumentNode,
  options?: any
) {
  const queryClient = useQueryClient();

  return useTanstackMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const result = await urqlClient.mutation(mutation, variables as any).toPromise();
      if (result.error) {
        throw new Error(result.error.message);
      }
      return (result.data || {}) as TData;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries();
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
