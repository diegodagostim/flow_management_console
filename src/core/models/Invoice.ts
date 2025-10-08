import { z } from 'zod';

/**
 * Invoice status enumeration
 */
export const InvoiceStatus = z.enum(['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled']);
export type InvoiceStatus = z.infer<typeof InvoiceStatus>;

/**
 * Invoice line item schema
 */
export const InvoiceLineItemSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  total: z.number().min(0, 'Total must be positive'),
  serviceType: z.string().optional(),
});

/**
 * Invoice model schema validation
 */
export const InvoiceSchema = z.object({
  id: z.string().uuid().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  clientId: z.string().uuid('Invalid client ID'),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  invoiceDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  status: InvoiceStatus,
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100').optional(),
  taxAmount: z.number().min(0, 'Tax amount must be positive').optional(),
  discountRate: z.number().min(0).max(100, 'Discount rate must be between 0 and 100').optional(),
  discountAmount: z.number().min(0, 'Discount amount must be positive').optional(),
  total: z.number().min(0, 'Total must be positive'),
  currency: z.string().default('USD'),
  paymentMethod: z.string().optional(),
  paymentDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  lineItems: z.array(InvoiceLineItemSchema).optional(),
  sentDate: z.string().datetime().optional(),
  viewedDate: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Invoice type inferred from schema
 */
export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>;

/**
 * Invoice creation input (without id and timestamps)
 */
export type CreateInvoiceInput = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Invoice update input (partial, without timestamps)
 */
export type UpdateInvoiceInput = Partial<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Invoice list item (minimal data for list views)
 */
export type InvoiceListItem = Pick<Invoice, 'id' | 'invoiceNumber' | 'clientName' | 'total' | 'status' | 'dueDate'>;

/**
 * Invoice search filters
 */
export interface InvoiceFilters {
  search?: string;
  status?: InvoiceStatus;
  clientId?: string;
  clientName?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

/**
 * Invoice statistics
 */
export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  averageInvoiceAmount: number;
  invoicesByStatus: Record<InvoiceStatus, number>;
  invoicesByClient: Record<string, number>;
}
