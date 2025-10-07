import { z } from 'zod';

/**
 * Client model schema validation
 */
export const ClientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Client type inferred from schema
 */
export type Client = z.infer<typeof ClientSchema>;

/**
 * Client creation input (without id and timestamps)
 */
export type CreateClientInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Client update input (partial, without timestamps)
 */
export type UpdateClientInput = Partial<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Client list item (minimal data for list views)
 */
export type ClientListItem = Pick<Client, 'id' | 'name' | 'email' | 'company'>;

/**
 * Client search filters
 */
export interface ClientFilters {
  search?: string;
  company?: string;
  createdAfter?: string;
  createdBefore?: string;
}
