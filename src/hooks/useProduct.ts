import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useStorage } from '@/hooks/useStorage'
import { ProductService } from '@/core/services/productService'
import type { 
  CreateProductInput, 
  UpdateProductInput, 
  ProductFilters,
  CreateModuleInput,
  CreateSubmoduleInput
} from '@/core/models/Product'

/**
 * Query keys for product operations
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  count: () => [...productKeys.all, 'count'] as const,
  pricingSummary: (id: string) => [...productKeys.detail(id), 'pricing'] as const,
};

/**
 * Hook to get product service instance
 */
function useProductService() {
  const storage = useStorage();
  return new ProductService(storage);
}

/**
 * Hook to get all products
 */
export function useProducts(filters?: ProductFilters) {
  const productService = useProductService();

  return useQuery({
    queryKey: filters ? productKeys.list(filters) : productKeys.lists(),
    queryFn: () => filters ? productService.search(filters) : productService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get a single product by ID
 */
export function useProduct(id: string) {
  const productService = useProductService()

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get products count
 */
export function useProductsCount() {
  const productService = useProductService();

  return useQuery({
    queryKey: productKeys.count(),
    queryFn: () => productService.getCount(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get product pricing summary
 */
export function useProductPricingSummary(productId: string) {
  const productService = useProductService();

  return useQuery({
    queryKey: productKeys.pricingSummary(productId),
    queryFn: () => productService.getPricingSummary(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: (input: CreateProductInput) => productService.create(input),
    onSuccess: (newProduct) => {
      // Invalidate and refetch product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.count() })
      
      // Add the new product to the cache
      queryClient.setQueryData(productKeys.detail(newProduct.id!), newProduct)
    },
    onError: (error) => {
      console.error('Failed to create product:', error);
    },
  });
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      productService.update(id, input),
    onSuccess: (updatedProduct) => {
      // Update the product in the cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id!), updatedProduct)
      
      // Invalidate product lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      
      // Invalidate pricing summary
      queryClient.invalidateQueries({ queryKey: productKeys.pricingSummary(updatedProduct.id!) })
    },
    onError: (error) => {
      console.error('Failed to update product:', error);
    },
  });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the product from the cache
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) });
      queryClient.removeQueries({ queryKey: productKeys.pricingSummary(deletedId) });
      
      // Invalidate product lists and count
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.count() });
    },
    onError: (error) => {
      console.error('Failed to delete product:', error);
    },
  });
}

/**
 * Hook to add a module to a product
 */
export function useAddModule() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: ({ productId, moduleInput }: { productId: string; moduleInput: CreateModuleInput }) =>
      productService.addModule(productId, moduleInput),
    onSuccess: (updatedProduct) => {
      // Update the product in the cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id!), updatedProduct)
      
      // Invalidate product lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      
      // Invalidate pricing summary
      queryClient.invalidateQueries({ queryKey: productKeys.pricingSummary(updatedProduct.id!) })
    },
    onError: (error) => {
      console.error('Failed to add module:', error);
    },
  });
}

/**
 * Hook to update a module
 */
export function useUpdateModule() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: ({ productId, moduleId, moduleInput }: { productId: string; moduleId: string; moduleInput: Partial<CreateModuleInput> }) =>
      productService.updateModule(productId, moduleId, moduleInput),
    onSuccess: (updatedProduct) => {
      // Update the product in the cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id!), updatedProduct)
      
      // Invalidate product lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      
      // Invalidate pricing summary
      queryClient.invalidateQueries({ queryKey: productKeys.pricingSummary(updatedProduct.id!) })
    },
    onError: (error) => {
      console.error('Failed to update module:', error);
    },
  });
}

/**
 * Hook to delete a module
 */
export function useDeleteModule() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: ({ productId, moduleId }: { productId: string; moduleId: string }) =>
      productService.deleteModule(productId, moduleId),
    onSuccess: (updatedProduct) => {
      // Update the product in the cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id!), updatedProduct)
      
      // Invalidate product lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      
      // Invalidate pricing summary
      queryClient.invalidateQueries({ queryKey: productKeys.pricingSummary(updatedProduct.id!) })
    },
    onError: (error) => {
      console.error('Failed to delete module:', error);
    },
  });
}

/**
 * Hook to add a submodule to a module
 */
export function useAddSubmodule() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: ({ productId, moduleId, submoduleInput }: { productId: string; moduleId: string; submoduleInput: CreateSubmoduleInput }) =>
      productService.addSubmodule(productId, moduleId, submoduleInput),
    onSuccess: (updatedProduct) => {
      // Update the product in the cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id!), updatedProduct)
      
      // Invalidate product lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      
      // Invalidate pricing summary
      queryClient.invalidateQueries({ queryKey: productKeys.pricingSummary(updatedProduct.id!) })
    },
    onError: (error) => {
      console.error('Failed to add submodule:', error);
    },
  });
}

/**
 * Hook to update a submodule
 */
export function useUpdateSubmodule() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: ({ productId, moduleId, submoduleId, submoduleInput }: { productId: string; moduleId: string; submoduleId: string; submoduleInput: Partial<CreateSubmoduleInput> }) =>
      productService.updateSubmodule(productId, moduleId, submoduleId, submoduleInput),
    onSuccess: (updatedProduct) => {
      // Update the product in the cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id!), updatedProduct)
      
      // Invalidate product lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      
      // Invalidate pricing summary
      queryClient.invalidateQueries({ queryKey: productKeys.pricingSummary(updatedProduct.id!) })
    },
    onError: (error) => {
      console.error('Failed to update submodule:', error);
    },
  });
}

/**
 * Hook to delete a submodule
 */
export function useDeleteSubmodule() {
  const queryClient = useQueryClient();
  const productService = useProductService();

  return useMutation({
    mutationFn: ({ productId, moduleId, submoduleId }: { productId: string; moduleId: string; submoduleId: string }) =>
      productService.deleteSubmodule(productId, moduleId, submoduleId),
    onSuccess: (updatedProduct) => {
      // Update the product in the cache
      queryClient.setQueryData(productKeys.detail(updatedProduct.id!), updatedProduct)
      
      // Invalidate product lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      
      // Invalidate pricing summary
      queryClient.invalidateQueries({ queryKey: productKeys.pricingSummary(updatedProduct.id!) })
    },
    onError: (error) => {
      console.error('Failed to delete submodule:', error);
    },
  });
}

/**
 * Hook to prefetch a product
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient()
  const productService = useProductService()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () => productService.getById(id),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }
}
