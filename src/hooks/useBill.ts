import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useStorage } from '@/hooks/useStorage'
import { BillService } from '@/core/services/billService'
import type { CreateBillInput, UpdateBillInput, BillFilters } from '@/core/models/Bill'

/**
 * Query keys for bill operations
 */
export const billKeys = {
  all: ['bills'] as const,
  lists: () => [...billKeys.all, 'list'] as const,
  list: (filters: BillFilters) => [...billKeys.lists(), filters] as const,
  details: () => [...billKeys.all, 'detail'] as const,
  detail: (id: string) => [...billKeys.details(), id] as const,
  count: () => [...billKeys.all, 'count'] as const,
  stats: () => [...billKeys.all, 'stats'] as const,
  overdue: () => [...billKeys.all, 'overdue'] as const,
};

/**
 * Hook to get bill service instance
 */
function useBillService() {
  const storage = useStorage();
  return new BillService(storage);
}

/**
 * Hook to get all bills
 */
export function useBills(filters?: BillFilters) {
  const billService = useBillService();

  return useQuery({
    queryKey: filters ? billKeys.list(filters) : billKeys.lists(),
    queryFn: () => filters ? billService.search(filters) : billService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single bill by ID
 */
export function useBill(id: string) {
  const billService = useBillService()

  return useQuery({
    queryKey: billKeys.detail(id),
    queryFn: () => billService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get bills count
 */
export function useBillsCount() {
  const billService = useBillService();

  return useQuery({
    queryKey: billKeys.count(),
    queryFn: () => billService.getCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get bills statistics
 */
export function useBillsStats() {
  const billService = useBillService();

  return useQuery({
    queryKey: billKeys.stats(),
    queryFn: () => billService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get overdue bills
 */
export function useOverdueBills() {
  const billService = useBillService();

  return useQuery({
    queryKey: billKeys.overdue(),
    queryFn: () => billService.getOverdueBills(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new bill
 */
export function useCreateBill() {
  const queryClient = useQueryClient();
  const billService = useBillService();

  return useMutation({
    mutationFn: (input: CreateBillInput) => billService.create(input),
    onSuccess: (newBill) => {
      // Invalidate and refetch bill lists
      queryClient.invalidateQueries({ queryKey: billKeys.lists() })
      queryClient.invalidateQueries({ queryKey: billKeys.count() })
      queryClient.invalidateQueries({ queryKey: billKeys.stats() })
      queryClient.invalidateQueries({ queryKey: billKeys.overdue() })
      
      // Add the new bill to the cache
      queryClient.setQueryData(billKeys.detail(newBill.id!), newBill)
    },
    onError: (error) => {
      console.error('Failed to create bill:', error);
    },
  });
}

/**
 * Hook to update a bill
 */
export function useUpdateBill() {
  const queryClient = useQueryClient();
  const billService = useBillService();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBillInput }) =>
      billService.update(id, input),
    onSuccess: (updatedBill) => {
      // Update the bill in the cache
      queryClient.setQueryData(billKeys.detail(updatedBill.id!), updatedBill)
      
      // Invalidate bill lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: billKeys.lists() })
      queryClient.invalidateQueries({ queryKey: billKeys.stats() })
      queryClient.invalidateQueries({ queryKey: billKeys.overdue() })
    },
    onError: (error) => {
      console.error('Failed to update bill:', error);
    },
  });
}

/**
 * Hook to delete a bill
 */
export function useDeleteBill() {
  const queryClient = useQueryClient();
  const billService = useBillService();

  return useMutation({
    mutationFn: (id: string) => billService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the bill from the cache
      queryClient.removeQueries({ queryKey: billKeys.detail(deletedId) });
      
      // Invalidate bill lists and count
      queryClient.invalidateQueries({ queryKey: billKeys.lists() });
      queryClient.invalidateQueries({ queryKey: billKeys.count() });
      queryClient.invalidateQueries({ queryKey: billKeys.stats() });
      queryClient.invalidateQueries({ queryKey: billKeys.overdue() });
    },
    onError: (error) => {
      console.error('Failed to delete bill:', error);
    },
  });
}

/**
 * Hook to mark bill as paid
 */
export function useMarkBillAsPaid() {
  const queryClient = useQueryClient();
  const billService = useBillService();

  return useMutation({
    mutationFn: ({ id, paymentMethod, paymentDate }: { id: string; paymentMethod?: string; paymentDate?: string }) =>
      billService.markAsPaid(id, paymentMethod, paymentDate),
    onSuccess: (updatedBill) => {
      // Update the bill in the cache
      queryClient.setQueryData(billKeys.detail(updatedBill.id!), updatedBill)
      
      // Invalidate bill lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: billKeys.lists() })
      queryClient.invalidateQueries({ queryKey: billKeys.stats() })
      queryClient.invalidateQueries({ queryKey: billKeys.overdue() })
    },
    onError: (error) => {
      console.error('Failed to mark bill as paid:', error);
    },
  });
}

/**
 * Hook to prefetch a bill
 */
export function usePrefetchBill() {
  const queryClient = useQueryClient()
  const billService = useBillService()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: billKeys.detail(id),
      queryFn: () => billService.getById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}
