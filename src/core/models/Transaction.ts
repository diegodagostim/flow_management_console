import { z } from 'zod';

/**
 * Transaction type enumeration
 */
export const TransactionType = z.enum(['income', 'expense', 'transfer', 'refund']);
export type TransactionType = z.infer<typeof TransactionType>;

/**
 * Transaction category enumeration
 */
export const TransactionCategory = z.enum([
  'sales',
  'service_fees',
  'subscription',
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
  'bank_fees',
  'interest',
  'other'
]);
export type TransactionCategory = z.infer<typeof TransactionCategory>;

/**
 * Payment method enumeration
 */
export const PaymentMethod = z.enum([
  'cash',
  'check',
  'credit_card',
  'debit_card',
  'bank_transfer',
  'paypal',
  'stripe',
  'square',
  'crypto',
  'other'
]);
export type PaymentMethod = z.infer<typeof PaymentMethod>;

/**
 * Transaction model schema validation
 */
export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),
  transactionNumber: z.string().min(1, 'Transaction number is required'),
  type: TransactionType,
  category: TransactionCategory,
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().default('USD'),
  description: z.string().min(1, 'Description is required'),
  paymentMethod: PaymentMethod,
  accountId: z.string().optional(),
  accountName: z.string().optional(),
  referenceId: z.string().optional(), // Link to invoice/bill
  referenceType: z.enum(['invoice', 'bill', 'manual']).optional(),
  transactionDate: z.string().datetime(),
  reconciled: z.boolean().default(false),
  reconciledDate: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Transaction type inferred from schema
 */
export type Transaction = z.infer<typeof TransactionSchema>;

/**
 * Transaction creation input (without id and timestamps)
 */
export type CreateTransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Transaction update input (partial, without timestamps)
 */
export type UpdateTransactionInput = Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Transaction list item (minimal data for list views)
 */
export type TransactionListItem = Pick<Transaction, 'id' | 'transactionNumber' | 'type' | 'amount' | 'description' | 'transactionDate'>;

/**
 * Transaction search filters
 */
export interface TransactionFilters {
  search?: string;
  type?: TransactionType;
  category?: TransactionCategory;
  paymentMethod?: PaymentMethod;
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  reconciled?: boolean;
  tags?: string[];
}

/**
 * Transaction statistics
 */
export interface TransactionStats {
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionsByType: Record<TransactionType, number>;
  transactionsByCategory: Record<TransactionCategory, number>;
  transactionsByPaymentMethod: Record<PaymentMethod, number>;
  reconciledCount: number;
  unreconciledCount: number;
}
