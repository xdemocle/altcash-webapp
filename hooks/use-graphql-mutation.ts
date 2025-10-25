import { useQueryClient, useMutation as useTanstackMutation } from '@tanstack/react-query';
import { DocumentNode } from 'graphql';
import { urqlClient } from '~common/graphql';

export function useGraphQLMutation<TVariables extends Record<string, unknown>, TData = unknown>(
  mutation: DocumentNode,
  options?: {
    onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
    onError?: (error: Error, variables: TVariables, context: unknown) => void;
    [key: string]: unknown;
  }
) {
  const queryClient = useQueryClient();

  return useTanstackMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const result = await urqlClient.mutation(mutation, variables).toPromise();
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
