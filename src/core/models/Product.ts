import { z } from 'zod';

/**
 * Pricing type for modules and submodules
 */
export const PricingTypeSchema = z.enum(['one-time', 'recurring']);

/**
 * Pricing configuration schema
 */
export const PricingSchema = z.object({
  type: PricingTypeSchema,
  amount: z.number().min(0, 'Amount must be non-negative'),
  currency: z.string().min(3, 'Currency code is required').max(3, 'Currency code must be 3 characters'),
  billingCycle: z.enum(['monthly', 'yearly', 'quarterly', 'weekly', 'daily']).optional(),
});

/**
 * Submodule schema
 */
export const SubmoduleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Submodule name is required').max(100, 'Submodule name must be less than 100 characters'),
  description: z.string().optional(),
  pricing: PricingSchema,
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Module schema
 */
export const ModuleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Module name is required').max(100, 'Module name must be less than 100 characters'),
  description: z.string().optional(),
  pricing: PricingSchema.optional(), // Optional since it will be calculated from submodules
  submodules: z.array(SubmoduleSchema).default([]),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Product schema validation
 */
export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Product name is required').max(100, 'Product name must be less than 100 characters'),
  description: z.string().optional(),
  logo: z.string().optional().refine((val) => !val || val === '' || /^https?:\/\/.+/.test(val), {
    message: 'Logo must be a valid URL or empty'
  }),
  category: z.string().optional(),
  version: z.string().optional(),
  modules: z.array(ModuleSchema).default([]),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Product type inferred from schema
 */
export type Product = z.infer<typeof ProductSchema>;

/**
 * Module type inferred from schema
 */
export type Module = z.infer<typeof ModuleSchema>;

/**
 * Submodule type inferred from schema
 */
export type Submodule = z.infer<typeof SubmoduleSchema>;

/**
 * Pricing type inferred from schema
 */
export type Pricing = z.infer<typeof PricingSchema>;

/**
 * Pricing type enum
 */
export type PricingType = z.infer<typeof PricingTypeSchema>;

/**
 * Product creation input (without id and timestamps)
 */
export type CreateProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Product update input (partial, without timestamps)
 */
export type UpdateProductInput = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Module creation input
 */
export type CreateModuleInput = Omit<Module, 'id' | 'createdAt' | 'updatedAt' | 'pricing'>;

/**
 * Submodule creation input
 */
export type CreateSubmoduleInput = Omit<Submodule, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Product list item (minimal data for list views)
 */
export type ProductListItem = Pick<Product, 'id' | 'name' | 'description' | 'logo' | 'category' | 'isActive'>;

/**
 * Product search filters
 */
export interface ProductFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  tags?: string[];
}

/**
 * Product pricing summary
 */
export interface ProductPricingSummary {
  totalModules: number;
  totalSubmodules: number;
  oneTimeRevenue: number;
  recurringRevenue: number;
  currency: string;
}

/**
 * Module pricing summary
 */
export interface ModulePricingSummary {
  totalPrice: number;
  oneTimePrice: number;
  recurringPrice: number;
  currency: string;
  submoduleCount: number;
}

/**
 * Calculate module pricing from its submodules
 */
export function calculateModulePricing(module: Module): ModulePricingSummary {
  const currency = module.submodules.length > 0 ? module.submodules[0].pricing.currency : 'USD';
  
  let oneTimePrice = 0;
  let recurringPrice = 0;
  
  module.submodules.forEach(submodule => {
    if (submodule.pricing.type === 'one-time') {
      oneTimePrice += submodule.pricing.amount;
    } else {
      recurringPrice += submodule.pricing.amount;
    }
  });
  
  return {
    totalPrice: oneTimePrice + recurringPrice,
    oneTimePrice,
    recurringPrice,
    currency,
    submoduleCount: module.submodules.length
  };
}
