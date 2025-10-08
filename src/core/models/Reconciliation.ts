import { z } from 'zod';

/**
 * Reconciliation status enumeration
 */
export const ReconciliationStatus = z.enum(['pending', 'matched', 'unmatched', 'ignored']);
export type ReconciliationStatus = z.infer<typeof ReconciliationStatus>;

/**
 * Payment processor enumeration
 */
export const PaymentProcessor = z.enum(['stripe', 'paypal', 'square', 'bank', 'manual']);
export type PaymentProcessor = z.infer<typeof PaymentProcessor>;

/**
 * Reconciliation rule schema
 */
export const ReconciliationRuleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Rule name is required'),
  processor: PaymentProcessor,
  fieldMappings: z.record(z.string(), z.string()),
  autoMatch: z.boolean().default(false),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Reconciliation rule type inferred from schema
 */
export type ReconciliationRule = z.infer<typeof ReconciliationRuleSchema>;

/**
 * External transaction schema (from payment processors)
 */
export const ExternalTransactionSchema = z.object({
  id: z.string().uuid().optional(),
  processor: PaymentProcessor,
  processorTransactionId: z.string().min(1, 'Processor transaction ID is required'),
  amount: z.number(),
  currency: z.string().default('USD'),
  description: z.string(),
  transactionDate: z.string().datetime(),
  status: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
  matchedTransactionId: z.string().uuid().optional(),
  reconciliationStatus: ReconciliationStatus.default('pending'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * External transaction type inferred from schema
 */
export type ExternalTransaction = z.infer<typeof ExternalTransactionSchema>;

/**
 * Reconciliation batch schema
 */
export const ReconciliationBatchSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Batch name is required'),
  processor: PaymentProcessor,
  dateFrom: z.string().datetime(),
  dateTo: z.string().datetime(),
  totalTransactions: z.number().default(0),
  matchedTransactions: z.number().default(0),
  unmatchedTransactions: z.number().default(0),
  status: ReconciliationStatus.default('pending'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Reconciliation batch type inferred from schema
 */
export type ReconciliationBatch = z.infer<typeof ReconciliationBatchSchema>;

/**
 * Reconciliation creation input types
 */
export type CreateReconciliationRuleInput = Omit<ReconciliationRule, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateExternalTransactionInput = Omit<ExternalTransaction, 'id' | 'createdAt' | 'updatedAt'>;
export type CreateReconciliationBatchInput = Omit<ReconciliationBatch, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Reconciliation update input types
 */
export type UpdateReconciliationRuleInput = Partial<Omit<ReconciliationRule, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateExternalTransactionInput = Partial<Omit<ExternalTransaction, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateReconciliationBatchInput = Partial<Omit<ReconciliationBatch, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Reconciliation search filters
 */
export interface ReconciliationFilters {
  processor?: PaymentProcessor;
  status?: ReconciliationStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

/**
 * Reconciliation statistics
 */
export interface ReconciliationStats {
  totalBatches: number;
  totalExternalTransactions: number;
  matchedTransactions: number;
  unmatchedTransactions: number;
  matchRate: number;
  batchesByProcessor: Record<PaymentProcessor, number>;
  transactionsByStatus: Record<ReconciliationStatus, number>;
}
