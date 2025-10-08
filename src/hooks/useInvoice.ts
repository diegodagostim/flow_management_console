import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useStorage } from '@/hooks/useStorage'
import { InvoiceService } from '@/core/services/invoiceService'
import type { CreateInvoiceInput, UpdateInvoiceInput, InvoiceFilters } from '@/core/models/Invoice'

/**
 * Query keys for invoice operations
 */
export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: InvoiceFilters) => [...invoiceKeys.lists(), filters] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
  count: () => [...invoiceKeys.all, 'count'] as const,
  stats: () => [...invoiceKeys.all, 'stats'] as const,
  overdue: () => [...invoiceKeys.all, 'overdue'] as const,
};

/**
 * Hook to get invoice service instance
 */
function useInvoiceService() {
  const storage = useStorage();
  return new InvoiceService(storage);
}

/**
 * Hook to get all invoices
 */
export function useInvoices(filters?: InvoiceFilters) {
  const invoiceService = useInvoiceService();

  return useQuery({
    queryKey: filters ? invoiceKeys.list(filters) : invoiceKeys.lists(),
    queryFn: () => filters ? invoiceService.search(filters) : invoiceService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single invoice by ID
 */
export function useInvoice(id: string) {
  const invoiceService = useInvoiceService()

  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => invoiceService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get invoices count
 */
export function useInvoicesCount() {
  const invoiceService = useInvoiceService();

  return useQuery({
    queryKey: invoiceKeys.count(),
    queryFn: () => invoiceService.getCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get invoices statistics
 */
export function useInvoicesStats() {
  const invoiceService = useInvoiceService();

  return useQuery({
    queryKey: invoiceKeys.stats(),
    queryFn: () => invoiceService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get overdue invoices
 */
export function useOverdueInvoices() {
  const invoiceService = useInvoiceService();

  return useQuery({
    queryKey: invoiceKeys.overdue(),
    queryFn: () => invoiceService.getOverdueInvoices(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new invoice
 */
export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const invoiceService = useInvoiceService();

  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => invoiceService.create(input),
    onSuccess: (newInvoice) => {
      // Invalidate and refetch invoice lists
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.count() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() })
      
      // Add the new invoice to the cache
      queryClient.setQueryData(invoiceKeys.detail(newInvoice.id!), newInvoice)
    },
    onError: (error) => {
      console.error('Failed to create invoice:', error);
    },
  });
}

/**
 * Hook to update an invoice
 */
export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  const invoiceService = useInvoiceService();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInvoiceInput }) =>
      invoiceService.update(id, input),
    onSuccess: (updatedInvoice) => {
      // Update the invoice in the cache
      queryClient.setQueryData(invoiceKeys.detail(updatedInvoice.id!), updatedInvoice)
      
      // Invalidate invoice lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() })
    },
    onError: (error) => {
      console.error('Failed to update invoice:', error);
    },
  });
}

/**
 * Hook to delete an invoice
 */
export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  const invoiceService = useInvoiceService();

  return useMutation({
    mutationFn: (id: string) => invoiceService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the invoice from the cache
      queryClient.removeQueries({ queryKey: invoiceKeys.detail(deletedId) });
      
      // Invalidate invoice lists and count
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.count() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() });
    },
    onError: (error) => {
      console.error('Failed to delete invoice:', error);
    },
  });
}

/**
 * Hook to mark invoice as sent
 */
export function useMarkInvoiceAsSent() {
  const queryClient = useQueryClient();
  const invoiceService = useInvoiceService();

  return useMutation({
    mutationFn: (id: string) => invoiceService.markAsSent(id),
    onSuccess: (updatedInvoice) => {
      // Update the invoice in the cache
      queryClient.setQueryData(invoiceKeys.detail(updatedInvoice.id!), updatedInvoice)
      
      // Invalidate invoice lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() })
    },
    onError: (error) => {
      console.error('Failed to mark invoice as sent:', error);
    },
  });
}

/**
 * Hook to mark invoice as paid
 */
export function useMarkInvoiceAsPaid() {
  const queryClient = useQueryClient();
  const invoiceService = useInvoiceService();

  return useMutation({
    mutationFn: ({ id, paymentMethod, paymentDate }: { id: string; paymentMethod?: string; paymentDate?: string }) =>
      invoiceService.markAsPaid(id, paymentMethod, paymentDate),
    onSuccess: (updatedInvoice) => {
      // Update the invoice in the cache
      queryClient.setQueryData(invoiceKeys.detail(updatedInvoice.id!), updatedInvoice)
      
      // Invalidate invoice lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() })
      queryClient.invalidateQueries({ queryKey: invoiceKeys.overdue() })
    },
    onError: (error) => {
      console.error('Failed to mark invoice as paid:', error);
    },
  });
}

/**
 * Hook to generate invoice number
 */
export function useGenerateInvoiceNumber() {
  const invoiceService = useInvoiceService();

  return useQuery({
    queryKey: ['invoices', 'generate-number'],
    queryFn: () => invoiceService.generateInvoiceNumber(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to prefetch an invoice
 */
export function usePrefetchInvoice() {
  const queryClient = useQueryClient()
  const invoiceService = useInvoiceService()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: invoiceKeys.detail(id),
      queryFn: () => invoiceService.getById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}
