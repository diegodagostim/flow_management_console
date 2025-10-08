import { z } from 'zod';

/**
 * Bill status enumeration
 */
export const BillStatus = z.enum(['draft', 'pending', 'paid', 'overdue', 'cancelled']);
export type BillStatus = z.infer<typeof BillStatus>;

/**
 * Bill category enumeration
 */
export const BillCategory = z.enum([
  'office_supplies',
  'rent',
  'utilities',
  'marketing',
  'software',
  'travel',
  'meals',
  'equipment',
  'professional_services',
  'insurance',
  'other'
]);
export type BillCategory = z.infer<typeof BillCategory>;

/**
 * Bill line item schema
 */
export const BillLineItemSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  total: z.number().min(0, 'Total must be positive'),
  category: BillCategory.optional(),
});

/**
 * Bill model schema validation
 */
export const BillSchema = z.object({
  id: z.string().uuid().optional(),
  billNumber: z.string().min(1, 'Bill number is required'),
  vendorName: z.string().min(1, 'Vendor name is required'),
  vendorEmail: z.string().email('Invalid email address').optional(),
  vendorAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  billDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  status: BillStatus,
  category: BillCategory,
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100').optional(),
  taxAmount: z.number().min(0, 'Tax amount must be positive').optional(),
  total: z.number().min(0, 'Total must be positive'),
  currency: z.string().default('USD'),
  paymentMethod: z.string().optional(),
  paymentDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  lineItems: z.array(BillLineItemSchema).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Bill type inferred from schema
 */
export type Bill = z.infer<typeof BillSchema>;
export type BillLineItem = z.infer<typeof BillLineItemSchema>;

/**
 * Bill creation input (without id and timestamps)
 */
export type CreateBillInput = Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Bill update input (partial, without timestamps)
 */
export type UpdateBillInput = Partial<Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Bill list item (minimal data for list views)
 */
export type BillListItem = Pick<Bill, 'id' | 'billNumber' | 'vendorName' | 'total' | 'status' | 'dueDate'>;

/**
 * Bill search filters
 */
export interface BillFilters {
  search?: string;
  status?: BillStatus;
  category?: BillCategory;
  vendorName?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

/**
 * Bill statistics
 */
export interface BillStats {
  totalBills: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  averageBillAmount: number;
  billsByStatus: Record<BillStatus, number>;
  billsByCategory: Record<BillCategory, number>;
}
