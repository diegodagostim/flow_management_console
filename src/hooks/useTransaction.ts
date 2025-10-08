import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useStorage } from '@/hooks/useStorage'
import { TransactionService } from '@/core/services/transactionService'
import type { CreateTransactionInput, UpdateTransactionInput, TransactionFilters } from '@/core/models/Transaction'

/**
 * Query keys for transaction operations
 */
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: TransactionFilters) => [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  count: () => [...transactionKeys.all, 'count'] as const,
  stats: () => [...transactionKeys.all, 'stats'] as const,
  unreconciled: () => [...transactionKeys.all, 'unreconciled'] as const,
};

/**
 * Hook to get transaction service instance
 */
function useTransactionService() {
  const storage = useStorage();
  return new TransactionService(storage);
}

/**
 * Hook to get all transactions
 */
export function useTransactions(filters?: TransactionFilters) {
  const transactionService = useTransactionService();

  return useQuery({
    queryKey: filters ? transactionKeys.list(filters) : transactionKeys.lists(),
    queryFn: () => filters ? transactionService.search(filters) : transactionService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single transaction by ID
 */
export function useTransaction(id: string) {
  const transactionService = useTransactionService()

  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get transactions count
 */
export function useTransactionsCount() {
  const transactionService = useTransactionService();

  return useQuery({
    queryKey: transactionKeys.count(),
    queryFn: () => transactionService.getCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get transactions statistics
 */
export function useTransactionsStats() {
  const transactionService = useTransactionService();

  return useQuery({
    queryKey: transactionKeys.stats(),
    queryFn: () => transactionService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get unreconciled transactions
 */
export function useUnreconciledTransactions() {
  const transactionService = useTransactionService();

  return useQuery({
    queryKey: transactionKeys.unreconciled(),
    queryFn: () => transactionService.getUnreconciledTransactions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const transactionService = useTransactionService();

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => transactionService.create(input),
    onSuccess: (newTransaction) => {
      // Invalidate and refetch transaction lists
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.count() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.stats() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.unreconciled() })
      
      // Add the new transaction to the cache
      queryClient.setQueryData(transactionKeys.detail(newTransaction.id!), newTransaction)
    },
    onError: (error) => {
      console.error('Failed to create transaction:', error);
    },
  });
}

/**
 * Hook to update a transaction
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const transactionService = useTransactionService();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTransactionInput }) =>
      transactionService.update(id, input),
    onSuccess: (updatedTransaction) => {
      // Update the transaction in the cache
      queryClient.setQueryData(transactionKeys.detail(updatedTransaction.id!), updatedTransaction)
      
      // Invalidate transaction lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.stats() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.unreconciled() })
    },
    onError: (error) => {
      console.error('Failed to update transaction:', error);
    },
  });
}

/**
 * Hook to delete a transaction
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const transactionService = useTransactionService();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the transaction from the cache
      queryClient.removeQueries({ queryKey: transactionKeys.detail(deletedId) });
      
      // Invalidate transaction lists and count
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.count() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.stats() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.unreconciled() });
    },
    onError: (error) => {
      console.error('Failed to delete transaction:', error);
    },
  });
}

/**
 * Hook to mark transaction as reconciled
 */
export function useMarkTransactionAsReconciled() {
  const queryClient = useQueryClient();
  const transactionService = useTransactionService();

  return useMutation({
    mutationFn: (id: string) => transactionService.markAsReconciled(id),
    onSuccess: (updatedTransaction) => {
      // Update the transaction in the cache
      queryClient.setQueryData(transactionKeys.detail(updatedTransaction.id!), updatedTransaction)
      
      // Invalidate transaction lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.stats() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.unreconciled() })
    },
    onError: (error) => {
      console.error('Failed to mark transaction as reconciled:', error);
    },
  });
}

/**
 * Hook to generate transaction number
 */
export function useGenerateTransactionNumber() {
  const transactionService = useTransactionService();

  return useQuery({
    queryKey: ['transactions', 'generate-number'],
    queryFn: () => transactionService.generateTransactionNumber(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to prefetch a transaction
 */
export function usePrefetchTransaction() {
  const queryClient = useQueryClient()
  const transactionService = useTransactionService()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: transactionKeys.detail(id),
      queryFn: () => transactionService.getById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}
