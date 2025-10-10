import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStorage } from '@/hooks/useStorage';
import { ProductSubscriptionService } from '@/core/services/productSubscriptionService';
import type { 
  ProductSubscription, 
  CreateProductSubscriptionInput, 
  UpdateProductSubscriptionInput, 
  ProductSubscriptionFilters,
  ContractTemplate,
  CreateContractTemplateInput,
  UpdateContractTemplateInput,
  ContractTemplateFilters
} from '@/core/models/ClientManagement';
import type { Product } from '@/core/models/Product';

/**
 * Hook to get ProductSubscriptionService instance
 */
function useProductSubscriptionService() {
  const storage = useStorage();
  return new ProductSubscriptionService(storage);
}

// Query Keys
export const productSubscriptionKeys = {
  all: ['productSubscriptions'] as const,
  lists: () => [...productSubscriptionKeys.all, 'list'] as const,
  list: (filters: ProductSubscriptionFilters) => [...productSubscriptionKeys.lists(), { filters }] as const,
  details: () => [...productSubscriptionKeys.all, 'detail'] as const,
  detail: (id: string) => [...productSubscriptionKeys.details(), id] as const,
  byClient: (clientId: string) => [...productSubscriptionKeys.all, 'client', clientId] as const,
};

export const contractTemplateKeys = {
  all: ['contractTemplates'] as const,
  lists: () => [...contractTemplateKeys.all, 'list'] as const,
  list: (filters: ContractTemplateFilters) => [...contractTemplateKeys.lists(), { filters }] as const,
  details: () => [...contractTemplateKeys.all, 'detail'] as const,
  detail: (id: string) => [...contractTemplateKeys.details(), id] as const,
};

// Product Subscription Hooks

/**
 * Get all product subscriptions
 */
export function useProductSubscriptions(filters?: ProductSubscriptionFilters) {
  const productSubscriptionService = useProductSubscriptionService();

  return useQuery({
    queryKey: productSubscriptionKeys.list(filters || {}),
    queryFn: () => productSubscriptionService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get product subscription by ID
 */
export function useProductSubscription(id: string) {
  const productSubscriptionService = useProductSubscriptionService();

  return useQuery({
    queryKey: productSubscriptionKeys.detail(id),
    queryFn: () => productSubscriptionService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get product subscriptions by client ID
 */
export function useProductSubscriptionsByClient(clientId: string) {
  const productSubscriptionService = useProductSubscriptionService();

  return useQuery({
    queryKey: productSubscriptionKeys.byClient(clientId),
    queryFn: () => productSubscriptionService.getByClientId(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a new product subscription
 */
export function useCreateProductSubscription() {
  const queryClient = useQueryClient();
  const productSubscriptionService = useProductSubscriptionService();

  return useMutation({
    mutationFn: (input: CreateProductSubscriptionInput) => productSubscriptionService.create(input),
    onSuccess: (newSubscription) => {
      // Invalidate and refetch subscription lists
      queryClient.invalidateQueries({ queryKey: productSubscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productSubscriptionKeys.byClient(newSubscription.clientId) });

      // Add the new subscription to the cache
      queryClient.setQueryData(productSubscriptionKeys.detail(newSubscription.id!), newSubscription);
    },
    onError: (error) => {
      console.error('Failed to create product subscription:', error);
    },
  });
}

/**
 * Update an existing product subscription
 */
export function useUpdateProductSubscription() {
  const queryClient = useQueryClient();
  const productSubscriptionService = useProductSubscriptionService();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductSubscriptionInput }) => 
      productSubscriptionService.update(id, input),
    onSuccess: (updatedSubscription) => {
      // Update the subscription in cache
      queryClient.setQueryData(productSubscriptionKeys.detail(updatedSubscription.id!), updatedSubscription);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: productSubscriptionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productSubscriptionKeys.byClient(updatedSubscription.clientId) });
    },
    onError: (error) => {
      console.error('Failed to update product subscription:', error);
    },
  });
}

/**
 * Delete a product subscription
 */
export function useDeleteProductSubscription() {
  const queryClient = useQueryClient();
  const productSubscriptionService = useProductSubscriptionService();

  return useMutation({
    mutationFn: (id: string) => productSubscriptionService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productSubscriptionKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: productSubscriptionKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete product subscription:', error);
    },
  });
}

/**
 * Calculate subscription pricing
 */
export function useCalculateSubscriptionPricing() {
  const productSubscriptionService = useProductSubscriptionService();

  return useMutation({
    mutationFn: ({ 
      product, 
      selectedModules 
    }: { 
      product: Product; 
      selectedModules: Array<{ moduleId: string; selectedSubmodules: string[] }> 
    }) => productSubscriptionService.calculatePricing(product, selectedModules),
    onError: (error) => {
      console.error('Failed to calculate subscription pricing:', error);
    },
  });
}

/**
 * Generate contract document
 */
export function useGenerateContract() {
  const productSubscriptionService = useProductSubscriptionService();

  return useMutation({
    mutationFn: ({ 
      subscription, 
      template 
    }: { 
      subscription: ProductSubscription; 
      template?: ContractTemplate 
    }) => productSubscriptionService.generateContract(subscription, template),
    onError: (error) => {
      console.error('Failed to generate contract:', error);
    },
  });
}

// Contract Template Hooks

/**
 * Get all contract templates
 */
export function useContractTemplates(filters?: ContractTemplateFilters) {
  const productSubscriptionService = useProductSubscriptionService();

  return useQuery({
    queryKey: contractTemplateKeys.list(filters || {}),
    queryFn: () => productSubscriptionService.getAllTemplates(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get contract template by ID
 */
export function useContractTemplate(id: string) {
  const productSubscriptionService = useProductSubscriptionService();

  return useQuery({
    queryKey: contractTemplateKeys.detail(id),
    queryFn: () => productSubscriptionService.getTemplateById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Create a new contract template
 */
export function useCreateContractTemplate() {
  const queryClient = useQueryClient();
  const productSubscriptionService = useProductSubscriptionService();

  return useMutation({
    mutationFn: (input: CreateContractTemplateInput) => productSubscriptionService.createTemplate(input),
    onSuccess: (newTemplate) => {
      // Invalidate and refetch template lists
      queryClient.invalidateQueries({ queryKey: contractTemplateKeys.lists() });

      // Add the new template to the cache
      queryClient.setQueryData(contractTemplateKeys.detail(newTemplate.id!), newTemplate);
    },
    onError: (error) => {
      console.error('Failed to create contract template:', error);
    },
  });
}

/**
 * Update an existing contract template
 */
export function useUpdateContractTemplate() {
  const queryClient = useQueryClient();
  const productSubscriptionService = useProductSubscriptionService();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateContractTemplateInput }) => 
      productSubscriptionService.updateTemplate(id, input),
    onSuccess: (updatedTemplate) => {
      // Update the template in cache
      queryClient.setQueryData(contractTemplateKeys.detail(updatedTemplate.id!), updatedTemplate);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: contractTemplateKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update contract template:', error);
    },
  });
}

/**
 * Delete a contract template
 */
export function useDeleteContractTemplate() {
  const queryClient = useQueryClient();
  const productSubscriptionService = useProductSubscriptionService();

  return useMutation({
    mutationFn: (id: string) => productSubscriptionService.deleteTemplate(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: contractTemplateKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: contractTemplateKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete contract template:', error);
    },
  });
}
