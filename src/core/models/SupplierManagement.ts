import { z } from 'zod';

// --- Supplier Schema ---
export const SupplierSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Supplier name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  taxId: z.string().optional(),
  website: z.string().url().optional(),
  contactPerson: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).default('active'),
  category: z.enum(['manufacturer', 'distributor', 'service_provider', 'consultant', 'other']).default('other'),
  paymentTerms: z.enum(['net_15', 'net_30', 'net_45', 'net_60', 'cash', 'custom']).default('net_30'),
  currency: z.string().default('USD'),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Supplier = z.infer<typeof SupplierSchema>;
export type CreateSupplierInput = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSupplierInput = Partial<CreateSupplierInput>;

// --- Purchase Order Schema ---
export const PurchaseOrderSchema = z.object({
  id: z.string().uuid().optional(),
  supplierId: z.string().uuid(),
  poNumber: z.string().min(1, 'PO number is required'),
  orderDate: z.string().datetime(),
  expectedDeliveryDate: z.string().datetime().optional(),
  actualDeliveryDate: z.string().datetime().optional(),
  status: z.enum(['draft', 'sent', 'confirmed', 'in_transit', 'delivered', 'cancelled', 'returned']).default('draft'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  totalAmount: z.number().min(0).default(0),
  currency: z.string().default('USD'),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
  terms: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    id: z.string().uuid().optional(),
    productName: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    quantity: z.number().int().positive('Quantity must be positive'),
    unitPrice: z.number().min(0, 'Unit price must be non-negative'),
    totalPrice: z.number().min(0, 'Total price must be non-negative'),
    sku: z.string().optional(),
    category: z.string().optional(),
  })).default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>;
export type CreatePurchaseOrderInput = Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePurchaseOrderInput = Partial<CreatePurchaseOrderInput>;

// --- Invoice Schema ---
export const InvoiceSchema = z.object({
  id: z.string().uuid().optional(),
  supplierId: z.string().uuid(),
  purchaseOrderId: z.string().uuid().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  status: z.enum(['draft', 'sent', 'received', 'approved', 'paid', 'overdue', 'disputed', 'cancelled']).default('draft'),
  subtotal: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  totalAmount: z.number().min(0).default(0),
  currency: z.string().default('USD'),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'check', 'cash', 'other']).optional(),
  paymentDate: z.string().datetime().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;
export type CreateInvoiceInput = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInvoiceInput = Partial<CreateInvoiceInput>;

// --- Payment Schema (for supplier payments) ---
export const SupplierPaymentSchema = z.object({
  id: z.string().uuid().optional(),
  supplierId: z.string().uuid(),
  invoiceId: z.string().uuid().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  paymentDate: z.string().datetime(),
  method: z.enum(['credit_card', 'bank_transfer', 'check', 'cash', 'other']).default('bank_transfer'),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']).default('pending'),
  transactionId: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type SupplierPayment = z.infer<typeof SupplierPaymentSchema>;
export type CreateSupplierPaymentInput = Omit<SupplierPayment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSupplierPaymentInput = Partial<CreateSupplierPaymentInput>;

// --- Supplier Performance Metrics Schema ---
export const SupplierMetricsSchema = z.object({
  id: z.string().uuid().optional(),
  supplierId: z.string().uuid(),
  period: z.string().datetime(), // Monthly/Quarterly period
  totalOrders: z.number().int().min(0).default(0),
  completedOrders: z.number().int().min(0).default(0),
  onTimeDeliveries: z.number().int().min(0).default(0),
  lateDeliveries: z.number().int().min(0).default(0),
  totalSpent: z.number().min(0).default(0),
  averageOrderValue: z.number().min(0).default(0),
  qualityRating: z.number().min(1).max(5).optional(),
  communicationRating: z.number().min(1).max(5).optional(),
  reliabilityRating: z.number().min(1).max(5).optional(),
  deliveryTimeDays: z.number().min(0).default(0),
  defectRate: z.number().min(0).max(100).default(0), // Percentage
  returnRate: z.number().min(0).max(100).default(0), // Percentage
  customMetrics: z.record(z.string(), z.number()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type SupplierMetrics = z.infer<typeof SupplierMetricsSchema>;
export type CreateSupplierMetricsInput = Omit<SupplierMetrics, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSupplierMetricsInput = Partial<CreateSupplierMetricsInput>;

// --- Filter Types ---
export type SupplierFilters = {
  search?: string;
  status?: Supplier['status'];
  category?: Supplier['category'];
  paymentTerms?: Supplier['paymentTerms'];
  rating?: number;
};

export type PurchaseOrderFilters = {
  supplierId?: string;
  status?: PurchaseOrder['status'];
  priority?: PurchaseOrder['priority'];
  orderDateFrom?: string;
  orderDateTo?: string;
  expectedDeliveryFrom?: string;
  expectedDeliveryTo?: string;
};

export type InvoiceFilters = {
  supplierId?: string;
  purchaseOrderId?: string;
  status?: Invoice['status'];
  invoiceDateFrom?: string;
  invoiceDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
};

export type SupplierPaymentFilters = {
  supplierId?: string;
  invoiceId?: string;
  status?: SupplierPayment['status'];
  method?: SupplierPayment['method'];
  paymentDateFrom?: string;
  paymentDateTo?: string;
};

export type SupplierMetricsFilters = {
  supplierId?: string;
  periodFrom?: string;
  periodTo?: string;
};

// --- Dashboard Summary Types ---
export const SupplierDashboardSummarySchema = z.object({
  totalSuppliers: z.number().int().min(0),
  activeSuppliers: z.number().int().min(0),
  pendingSuppliers: z.number().int().min(0),
  totalPurchaseOrders: z.number().int().min(0),
  pendingOrders: z.number().int().min(0),
  overdueOrders: z.number().int().min(0),
  totalInvoices: z.number().int().min(0),
  unpaidInvoices: z.number().int().min(0),
  overdueInvoices: z.number().int().min(0),
  totalSpent: z.number().min(0),
  averageOrderValue: z.number().min(0),
  topSuppliers: z.array(z.object({
    supplierId: z.string(),
    supplierName: z.string(),
    totalOrders: z.number(),
    totalSpent: z.number(),
    rating: z.number().optional(),
  })).default([]),
});

export type SupplierDashboardSummary = z.infer<typeof SupplierDashboardSummarySchema>;
