import { z } from 'zod';

/**
 * Account type enumeration
 */
export const AccountType = z.enum(['checking', 'savings', 'credit_card', 'investment', 'loan', 'other']);
export type AccountType = z.infer<typeof AccountType>;

/**
 * Account model schema validation
 */
export const AccountSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Account name is required'),
  type: AccountType,
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  balance: z.number().default(0),
  currency: z.string().default('USD'),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Account type inferred from schema
 */
export type Account = z.infer<typeof AccountSchema>;

/**
 * Account creation input (without id and timestamps)
 */
export type CreateAccountInput = Omit<Account, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Account update input (partial, without timestamps)
 */
export type UpdateAccountInput = Partial<Omit<Account, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Account list item (minimal data for list views)
 */
export type AccountListItem = Pick<Account, 'id' | 'name' | 'type' | 'balance' | 'isActive'>;

/**
 * Account search filters
 */
export interface AccountFilters {
  search?: string;
  type?: AccountType;
  isActive?: boolean;
}

/**
 * Account statistics
 */
export interface AccountStats {
  totalAccounts: number;
  totalBalance: number;
  activeAccounts: number;
  accountsByType: Record<AccountType, number>;
  balanceByType: Record<AccountType, number>;
}
