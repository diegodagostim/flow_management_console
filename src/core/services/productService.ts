import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter'
import type { 
  Product, 
  CreateProductInput, 
  UpdateProductInput, 
  ProductFilters,
  Module,
  Submodule,
  CreateModuleInput,
  CreateSubmoduleInput,
  ProductPricingSummary,
  ModulePricingSummary
} from '@/core/models/Product'
import { ProductSchema, ModuleSchema, SubmoduleSchema, calculateModulePricing } from '@/core/models/Product'

/**
 * Product service for CRUD operations
 * Implements business logic for product management
 */
export class ProductService {
  private readonly storage: StorageAdapter;
  private readonly entityKey = 'products';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    try {
      const products = await this.storage.list<Product>(this.entityKey);
      return products.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Failed to get all products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<Product | null> {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }
      
      const product = await this.storage.get<Product>(`${this.entityKey}:${id}`);
      return product;
    } catch (error) {
      console.error('Failed to get product by ID:', error);
      throw new Error('Failed to fetch product');
    }
  }

  /**
   * Create a new product
   */
  async create(input: CreateProductInput): Promise<Product> {
    try {
      // Validate input
      const validatedInput = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(input);
      
      const product: Product = {
        ...validatedInput,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${product.id}`, product);
      return product;
    } catch (error) {
      console.error('Failed to create product:', error);
      console.error('Input data:', input);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to create product');
    }
  }

  /**
   * Update an existing product
   */
  async update(id: string, input: UpdateProductInput): Promise<Product> {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      const existingProduct = await this.getById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      // Validate input
      const validatedInput = ProductSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().parse(input);
      
      const updatedProduct: Product = {
        ...existingProduct,
        ...validatedInput,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${id}`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Failed to update product:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to update product');
    }
  }

  /**
   * Delete a product
   */
  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      const existingProduct = await this.getById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      await this.storage.delete(`${this.entityKey}:${id}`);
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw new Error('Failed to delete product');
    }
  }

  /**
   * Add a module to a product
   */
  async addModule(productId: string, moduleInput: CreateModuleInput): Promise<Product> {
    try {
      const product = await this.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      // Remove pricing from module input since it will be calculated from submodules
      const { pricing, ...moduleWithoutPricing } = moduleInput;
      const validatedModule = ModuleSchema.omit({ id: true, createdAt: true, updatedAt: true, pricing: true }).parse(moduleWithoutPricing);
      
      const newModule: Module = {
        ...validatedModule,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedProduct: Product = {
        ...product,
        modules: [...product.modules, newModule],
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${productId}`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Failed to add module:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to add module');
    }
  }

  /**
   * Update a module in a product
   */
  async updateModule(productId: string, moduleId: string, moduleInput: Partial<CreateModuleInput>): Promise<Product> {
    try {
      const product = await this.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const moduleIndex = product.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) {
        throw new Error('Module not found');
      }

      const updatedModules = [...product.modules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        ...moduleInput,
        updatedAt: new Date().toISOString(),
      };

      const updatedProduct: Product = {
        ...product,
        modules: updatedModules,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${productId}`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Failed to update module:', error);
      throw new Error('Failed to update module');
    }
  }

  /**
   * Delete a module from a product
   */
  async deleteModule(productId: string, moduleId: string): Promise<Product> {
    try {
      const product = await this.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const updatedModules = product.modules.filter(m => m.id !== moduleId);
      
      const updatedProduct: Product = {
        ...product,
        modules: updatedModules,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${productId}`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Failed to delete module:', error);
      throw new Error('Failed to delete module');
    }
  }

  /**
   * Add a submodule to a module
   */
  async addSubmodule(productId: string, moduleId: string, submoduleInput: CreateSubmoduleInput): Promise<Product> {
    try {
      const product = await this.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const moduleIndex = product.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) {
        throw new Error('Module not found');
      }

      const validatedSubmodule = SubmoduleSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(submoduleInput);
      
      const newSubmodule: Submodule = {
        ...validatedSubmodule,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedModules = [...product.modules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        submodules: [...updatedModules[moduleIndex].submodules, newSubmodule],
        updatedAt: new Date().toISOString(),
      };

      const updatedProduct: Product = {
        ...product,
        modules: updatedModules,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${productId}`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Failed to add submodule:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to add submodule');
    }
  }

  /**
   * Update a submodule in a module
   */
  async updateSubmodule(productId: string, moduleId: string, submoduleId: string, submoduleInput: Partial<CreateSubmoduleInput>): Promise<Product> {
    try {
      const product = await this.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const moduleIndex = product.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) {
        throw new Error('Module not found');
      }

      const submoduleIndex = product.modules[moduleIndex].submodules.findIndex(s => s.id === submoduleId);
      if (submoduleIndex === -1) {
        throw new Error('Submodule not found');
      }

      const updatedModules = [...product.modules];
      const updatedSubmodules = [...updatedModules[moduleIndex].submodules];
      updatedSubmodules[submoduleIndex] = {
        ...updatedSubmodules[submoduleIndex],
        ...submoduleInput,
        updatedAt: new Date().toISOString(),
      };

      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        submodules: updatedSubmodules,
        updatedAt: new Date().toISOString(),
      };

      const updatedProduct: Product = {
        ...product,
        modules: updatedModules,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${productId}`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Failed to update submodule:', error);
      throw new Error('Failed to update submodule');
    }
  }

  /**
   * Delete a submodule from a module
   */
  async deleteSubmodule(productId: string, moduleId: string, submoduleId: string): Promise<Product> {
    try {
      const product = await this.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const moduleIndex = product.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) {
        throw new Error('Module not found');
      }

      const updatedModules = [...product.modules];
      updatedModules[moduleIndex] = {
        ...updatedModules[moduleIndex],
        submodules: updatedModules[moduleIndex].submodules.filter(s => s.id !== submoduleId),
        updatedAt: new Date().toISOString(),
      };

      const updatedProduct: Product = {
        ...product,
        modules: updatedModules,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${productId}`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      console.error('Failed to delete submodule:', error);
      throw new Error('Failed to delete submodule');
    }
  }

  /**
   * Search products with filters
   */
  async search(filters: ProductFilters): Promise<Product[]> {
    try {
      const allProducts = await this.getAll();
      
      return allProducts.filter(product => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            product.name.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower) ||
            product.category?.toLowerCase().includes(searchLower) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchLower));
          
          if (!matchesSearch) return false;
        }

        // Category filter
        if (filters.category) {
          if (product.category !== filters.category) return false;
        }

        // Active status filter
        if (filters.isActive !== undefined) {
          if (product.isActive !== filters.isActive) return false;
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
          const hasMatchingTag = filters.tags.some(tag => product.tags.includes(tag));
          if (!hasMatchingTag) return false;
        }

        // Date filters
        if (filters.createdAfter) {
          const createdAfter = new Date(filters.createdAfter);
          const productCreated = new Date(product.createdAt || 0);
          if (productCreated < createdAfter) return false;
        }

        if (filters.createdBefore) {
          const createdBefore = new Date(filters.createdBefore);
          const productCreated = new Date(product.createdAt || 0);
          if (productCreated > createdBefore) return false;
        }

        return true;
      });
    } catch (error) {
      console.error('Failed to search products:', error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Get products count
   */
  async getCount(): Promise<number> {
    try {
      const products = await this.getAll();
      return products.length;
    } catch (error) {
      console.error('Failed to get products count:', error);
      throw new Error('Failed to get products count');
    }
  }

  /**
   * Get product pricing summary
   */
  async getPricingSummary(productId: string): Promise<ProductPricingSummary> {
    try {
      const product = await this.getById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      let totalModules = product.modules.length;
      let totalSubmodules = 0;
      let oneTimeRevenue = 0;
      let recurringRevenue = 0;
      let currency = 'USD';

      product.modules.forEach(module => {
        totalSubmodules += module.submodules.length;
        
        // Calculate module pricing from submodules
        const modulePricing = calculateModulePricing(module);
        currency = modulePricing.currency;
        oneTimeRevenue += modulePricing.oneTimePrice;
        recurringRevenue += modulePricing.recurringPrice;
      });

      return {
        totalModules,
        totalSubmodules,
        oneTimeRevenue,
        recurringRevenue,
        currency,
      };
    } catch (error) {
      console.error('Failed to get pricing summary:', error);
      throw new Error('Failed to get pricing summary');
    }
  }
}
