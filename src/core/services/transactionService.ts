import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter'
import type { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionFilters, TransactionStats } from '@/core/models/Transaction'
import { TransactionSchema } from '@/core/models/Transaction'

/**
 * Transaction service for CRUD operations
 * Implements business logic for transaction management
 */
export class TransactionService {
  private readonly storage: StorageAdapter;
  private readonly entityKey = 'transactions';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Get all transactions
   */
  async getAll(): Promise<Transaction[]> {
    try {
      const transactions = await this.storage.list<Transaction>(this.entityKey);
      return transactions.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Failed to get all transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  /**
   * Get transaction by ID
   */
  async getById(id: string): Promise<Transaction | null> {
    try {
      if (!id) {
        throw new Error('Transaction ID is required');
      }
      
      const transaction = await this.storage.get<Transaction>(`${this.entityKey}:${id}`);
      return transaction;
    } catch (error) {
      console.error('Failed to get transaction by ID:', error);
      throw new Error('Failed to fetch transaction');
    }
  }

  /**
   * Create a new transaction
   */
  async create(input: CreateTransactionInput): Promise<Transaction> {
    try {
      // Validate input
      const validatedInput = TransactionSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(input);
      
      const transaction: Transaction = {
        ...validatedInput,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${transaction.id}`, transaction);
      return transaction;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to create transaction');
    }
  }

  /**
   * Update an existing transaction
   */
  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    try {
      if (!id) {
        throw new Error('Transaction ID is required');
      }

      const existingTransaction = await this.getById(id);
      if (!existingTransaction) {
        throw new Error('Transaction not found');
      }

      // Validate input
      const validatedInput = TransactionSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().parse(input);
      
      const updatedTransaction: Transaction = {
        ...existingTransaction,
        ...validatedInput,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${id}`, updatedTransaction);
      return updatedTransaction;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to update transaction');
    }
  }

  /**
   * Delete a transaction
   */
  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Transaction ID is required');
      }

      const existingTransaction = await this.getById(id);
      if (!existingTransaction) {
        throw new Error('Transaction not found');
      }

      await this.storage.delete(`${this.entityKey}:${id}`);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw new Error('Failed to delete transaction');
    }
  }

  /**
   * Search transactions with filters
   */
  async search(filters: TransactionFilters): Promise<Transaction[]> {
    try {
      const allTransactions = await this.getAll();
      
      return allTransactions.filter(transaction => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            transaction.transactionNumber.toLowerCase().includes(searchLower) ||
            transaction.description.toLowerCase().includes(searchLower) ||
            transaction.accountName?.toLowerCase().includes(searchLower);
          
          if (!matchesSearch) return false;
        }

        // Type filter
        if (filters.type) {
          if (transaction.type !== filters.type) return false;
        }

        // Category filter
        if (filters.category) {
          if (transaction.category !== filters.category) return false;
        }

        // Payment method filter
        if (filters.paymentMethod) {
          if (transaction.paymentMethod !== filters.paymentMethod) return false;
        }

        // Account filter
        if (filters.accountId) {
          if (transaction.accountId !== filters.accountId) return false;
        }

        // Date filters
        if (filters.dateFrom) {
          const dateFrom = new Date(filters.dateFrom);
          const transactionDate = new Date(transaction.transactionDate);
          if (transactionDate < dateFrom) return false;
        }

        if (filters.dateTo) {
          const dateTo = new Date(filters.dateTo);
          const transactionDate = new Date(transaction.transactionDate);
          if (transactionDate > dateTo) return false;
        }

        // Amount filters
        if (filters.amountMin !== undefined) {
          if (transaction.amount < filters.amountMin) return false;
        }

        if (filters.amountMax !== undefined) {
          if (transaction.amount > filters.amountMax) return false;
        }

        // Reconciled filter
        if (filters.reconciled !== undefined) {
          if (transaction.reconciled !== filters.reconciled) return false;
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
          const hasMatchingTag = filters.tags.some(tag => 
            transaction.tags?.includes(tag)
          );
          if (!hasMatchingTag) return false;
        }

        return true;
      });
    } catch (error) {
      console.error('Failed to search transactions:', error);
      throw new Error('Failed to search transactions');
    }
  }

  /**
   * Get transactions count
   */
  async getCount(): Promise<number> {
    try {
      const transactions = await this.getAll();
      return transactions.length;
    } catch (error) {
      console.error('Failed to get transactions count:', error);
      throw new Error('Failed to get transactions count');
    }
  }

  /**
   * Get transactions statistics
   */
  async getStats(): Promise<TransactionStats> {
    try {
      const transactions = await this.getAll();
      
      const stats: TransactionStats = {
        totalTransactions: transactions.length,
        totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
        netAmount: transactions.reduce((sum, t) => {
          return sum + (t.type === 'income' ? t.amount : -t.amount);
        }, 0),
        transactionsByType: {
          income: transactions.filter(t => t.type === 'income').length,
          expense: transactions.filter(t => t.type === 'expense').length,
          transfer: transactions.filter(t => t.type === 'transfer').length,
          refund: transactions.filter(t => t.type === 'refund').length,
        },
        transactionsByCategory: {
          sales: transactions.filter(t => t.category === 'sales').length,
          service_fees: transactions.filter(t => t.category === 'service_fees').length,
          subscription: transactions.filter(t => t.category === 'subscription').length,
          office_supplies: transactions.filter(t => t.category === 'office_supplies').length,
          rent: transactions.filter(t => t.category === 'rent').length,
          utilities: transactions.filter(t => t.category === 'utilities').length,
          marketing: transactions.filter(t => t.category === 'marketing').length,
          software: transactions.filter(t => t.category === 'software').length,
          travel: transactions.filter(t => t.category === 'travel').length,
          meals: transactions.filter(t => t.category === 'meals').length,
          equipment: transactions.filter(t => t.category === 'equipment').length,
          professional_services: transactions.filter(t => t.category === 'professional_services').length,
          insurance: transactions.filter(t => t.category === 'insurance').length,
          bank_fees: transactions.filter(t => t.category === 'bank_fees').length,
          interest: transactions.filter(t => t.category === 'interest').length,
          other: transactions.filter(t => t.category === 'other').length,
        },
        transactionsByPaymentMethod: {
          cash: transactions.filter(t => t.paymentMethod === 'cash').length,
          check: transactions.filter(t => t.paymentMethod === 'check').length,
          credit_card: transactions.filter(t => t.paymentMethod === 'credit_card').length,
          debit_card: transactions.filter(t => t.paymentMethod === 'debit_card').length,
          bank_transfer: transactions.filter(t => t.paymentMethod === 'bank_transfer').length,
          paypal: transactions.filter(t => t.paymentMethod === 'paypal').length,
          stripe: transactions.filter(t => t.paymentMethod === 'stripe').length,
          square: transactions.filter(t => t.paymentMethod === 'square').length,
          crypto: transactions.filter(t => t.paymentMethod === 'crypto').length,
          other: transactions.filter(t => t.paymentMethod === 'other').length,
        },
        reconciledCount: transactions.filter(t => t.reconciled).length,
        unreconciledCount: transactions.filter(t => !t.reconciled).length,
      };

      return stats;
    } catch (error) {
      console.error('Failed to get transactions stats:', error);
      throw new Error('Failed to get transactions stats');
    }
  }

  /**
   * Mark transaction as reconciled
   */
  async markAsReconciled(id: string): Promise<Transaction> {
    try {
      const transaction = await this.getById(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const updatedTransaction = await this.update(id, {
        reconciled: true,
        reconciledDate: new Date().toISOString(),
      });

      return updatedTransaction;
    } catch (error) {
      console.error('Failed to mark transaction as reconciled:', error);
      throw new Error('Failed to mark transaction as reconciled');
    }
  }

  /**
   * Get unreconciled transactions
   */
  async getUnreconciledTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await this.getAll();
      return transactions.filter(transaction => !transaction.reconciled);
    } catch (error) {
      console.error('Failed to get unreconciled transactions:', error);
      throw new Error('Failed to get unreconciled transactions');
    }
  }

  /**
   * Generate next transaction number
   */
  async generateTransactionNumber(): Promise<string> {
    try {
      const transactions = await this.getAll();
      const currentYear = new Date().getFullYear();
      const yearPrefix = `TXN-${currentYear}-`;
      
      const yearTransactions = transactions.filter(transaction => 
        transaction.transactionNumber.startsWith(yearPrefix)
      );
      
      const nextNumber = yearTransactions.length + 1;
      return `${yearPrefix}${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('Failed to generate transaction number:', error);
      throw new Error('Failed to generate transaction number');
    }
  }
}
