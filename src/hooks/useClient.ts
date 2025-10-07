import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useStorage } from '@/hooks/useStorage'
import { ClientService } from '@/core/services/clientService'
import type { CreateClientInput, UpdateClientInput, ClientFilters } from '@/core/models/Client'

/**
 * Query keys for client operations
 */
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: ClientFilters) => [...clientKeys.lists(), filters] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  count: () => [...clientKeys.all, 'count'] as const,
};

/**
 * Hook to get client service instance
 */
function useClientService() {
  const storage = useStorage();
  return new ClientService(storage);
}

/**
 * Hook to get all clients
 */
export function useClients(filters?: ClientFilters) {
  const clientService = useClientService();

  return useQuery({
    queryKey: filters ? clientKeys.list(filters) : clientKeys.lists(),
    queryFn: () => filters ? clientService.search(filters) : clientService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single client by ID
 */
export function useClient(id: string) {
  const clientService = useClientService()

  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get clients count
 */
export function useClientsCount() {
  const clientService = useClientService();

  return useQuery({
    queryKey: clientKeys.count(),
    queryFn: () => clientService.getCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new client
 */
export function useCreateClient() {
  const queryClient = useQueryClient();
  const clientService = useClientService();

  return useMutation({
    mutationFn: (input: CreateClientInput) => clientService.create(input),
    onSuccess: (newClient) => {
      // Invalidate and refetch client lists
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
      queryClient.invalidateQueries({ queryKey: clientKeys.count() })
      
      // Add the new client to the cache
      queryClient.setQueryData(clientKeys.detail(newClient.id!), newClient)
    },
    onError: (error) => {
      console.error('Failed to create client:', error);
    },
  });
}

/**
 * Hook to update a client
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();
  const clientService = useClientService();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateClientInput }) =>
      clientService.update(id, input),
    onSuccess: (updatedClient) => {
      // Update the client in the cache
      queryClient.setQueryData(clientKeys.detail(updatedClient.id!), updatedClient)
      
      // Invalidate client lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to update client:', error);
    },
  });
}

/**
 * Hook to delete a client
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();
  const clientService = useClientService();

  return useMutation({
    mutationFn: (id: string) => clientService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the client from the cache
      queryClient.removeQueries({ queryKey: clientKeys.detail(deletedId) });
      
      // Invalidate client lists and count
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.count() });
    },
    onError: (error) => {
      console.error('Failed to delete client:', error);
    },
  });
}

/**
 * Hook to prefetch a client
 */
export function usePrefetchClient() {
  const queryClient = useQueryClient()
  const clientService = useClientService()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: clientKeys.detail(id),
      queryFn: () => clientService.getById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}
