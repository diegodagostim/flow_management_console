import { z } from 'zod';

// Base Client Model
export const ClientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().min(1, 'Company name is required'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'pending']).default('active'),
  tier: z.enum(['basic', 'professional', 'enterprise', 'custom']).default('basic'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Client = z.infer<typeof ClientSchema>;
export type CreateClientInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateClientInput = Partial<CreateClientInput>;

// Contract/Subscription Model
export const ContractSchema = z.object({
  id: z.string().uuid().optional(),
  clientId: z.string().uuid(),
  name: z.string().min(1, 'Contract name is required'),
  type: z.enum(['subscription', 'one-time', 'recurring', 'custom']).default('subscription'),
  status: z.enum(['active', 'expired', 'cancelled', 'pending', 'suspended']).default('active'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  billingCycle: z.enum(['monthly', 'quarterly', 'yearly', 'custom']).default('monthly'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  autoRenew: z.boolean().default(true),
  terms: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Contract = z.infer<typeof ContractSchema>;
export type CreateContractInput = Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateContractInput = Partial<CreateContractInput>;

// Billing & Payment Model
export const PaymentSchema = z.object({
  id: z.string().uuid().optional(),
  clientId: z.string().uuid(),
  contractId: z.string().uuid().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  status: z.enum(['pending', 'completed', 'failed', 'refunded', 'cancelled']).default('pending'),
  method: z.enum(['credit_card', 'bank_transfer', 'paypal', 'stripe', 'check', 'cash']).default('credit_card'),
  transactionId: z.string().optional(),
  paymentDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  description: z.string().optional(),
  invoiceNumber: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePaymentInput = Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePaymentInput = Partial<CreatePaymentInput>;

// Usage Metrics Model
export const UsageMetricsSchema = z.object({
  id: z.string().uuid().optional(),
  clientId: z.string().uuid(),
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Period must be in YYYY-MM format'),
  apiCalls: z.number().min(0).default(0),
  activeUsers: z.number().min(0).default(0),
  storageUsed: z.number().min(0).default(0), // in MB
  bandwidthUsed: z.number().min(0).default(0), // in MB
  customMetrics: z.record(z.number()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type UsageMetrics = z.infer<typeof UsageMetricsSchema>;
export type CreateUsageMetricsInput = Omit<UsageMetrics, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUsageMetricsInput = Partial<CreateUsageMetricsInput>;

// Notification Model
export const NotificationSchema = z.object({
  id: z.string().uuid().optional(),
  clientId: z.string().uuid(),
  type: z.enum(['payment_due', 'payment_failed', 'contract_expiry', 'usage_limit', 'renewal_reminder', 'custom']),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  status: z.enum(['pending', 'sent', 'delivered', 'failed', 'read']).default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  channels: z.array(z.enum(['email', 'sms', 'push', 'in_app'])).default(['email']),
  scheduledAt: z.string().datetime().optional(),
  sentAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotificationInput = Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateNotificationInput = Partial<CreateNotificationInput>;

// Filter Types
export type ClientFilters = {
  search?: string;
  status?: Client['status'];
  tier?: Client['tier'];
  company?: string;
};

export type ContractFilters = {
  clientId?: string;
  status?: Contract['status'];
  type?: Contract['type'];
  billingCycle?: Contract['billingCycle'];
};

export type PaymentFilters = {
  clientId?: string;
  status?: Payment['status'];
  method?: Payment['method'];
  dateFrom?: string;
  dateTo?: string;
};

export type UsageMetricsFilters = {
  clientId?: string;
  period?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type NotificationFilters = {
  clientId?: string;
  type?: Notification['type'];
  status?: Notification['status'];
  priority?: Notification['priority'];
};

// Dashboard Summary Types
export type ClientDashboardSummary = {
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  pendingPayments: number;
  expiringContracts: number;
  recentActivity: Array<{
    type: 'client_created' | 'payment_received' | 'contract_signed' | 'notification_sent';
    clientId: string;
    clientName: string;
    amount?: number;
    timestamp: string;
  }>;
};
