import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter'
import type { Bill, CreateBillInput, UpdateBillInput, BillFilters, BillStats } from '@/core/models/Bill'
import { BillSchema } from '@/core/models/Bill'

/**
 * Bill service for CRUD operations
 * Implements business logic for bill management
 */
export class BillService {
  private readonly storage: StorageAdapter;
  private readonly entityKey = 'bills';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Get all bills
   */
  async getAll(): Promise<Bill[]> {
    try {
      const bills = await this.storage.list<Bill>(this.entityKey);
      return bills.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Failed to get all bills:', error);
      throw new Error('Failed to fetch bills');
    }
  }

  /**
   * Get bill by ID
   */
  async getById(id: string): Promise<Bill | null> {
    try {
      if (!id) {
        throw new Error('Bill ID is required');
      }
      
      const bill = await this.storage.get<Bill>(`${this.entityKey}:${id}`);
      return bill;
    } catch (error) {
      console.error('Failed to get bill by ID:', error);
      throw new Error('Failed to fetch bill');
    }
  }

  /**
   * Create a new bill
   */
  async create(input: CreateBillInput): Promise<Bill> {
    try {
      // Validate input
      const validatedInput = BillSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(input);
      
      const bill: Bill = {
        ...validatedInput,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${bill.id}`, bill);
      return bill;
    } catch (error) {
      console.error('Failed to create bill:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to create bill');
    }
  }

  /**
   * Update an existing bill
   */
  async update(id: string, input: UpdateBillInput): Promise<Bill> {
    try {
      if (!id) {
        throw new Error('Bill ID is required');
      }

      const existingBill = await this.getById(id);
      if (!existingBill) {
        throw new Error('Bill not found');
      }

      // Validate input
      const validatedInput = BillSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().parse(input);
      
      const updatedBill: Bill = {
        ...existingBill,
        ...validatedInput,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${id}`, updatedBill);
      return updatedBill;
    } catch (error) {
      console.error('Failed to update bill:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to update bill');
    }
  }

  /**
   * Delete a bill
   */
  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Bill ID is required');
      }

      const existingBill = await this.getById(id);
      if (!existingBill) {
        throw new Error('Bill not found');
      }

      await this.storage.delete(`${this.entityKey}:${id}`);
    } catch (error) {
      console.error('Failed to delete bill:', error);
      throw new Error('Failed to delete bill');
    }
  }

  /**
   * Search bills with filters
   */
  async search(filters: BillFilters): Promise<Bill[]> {
    try {
      const allBills = await this.getAll();
      
      return allBills.filter(bill => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            bill.billNumber.toLowerCase().includes(searchLower) ||
            bill.vendorName.toLowerCase().includes(searchLower) ||
            bill.vendorEmail?.toLowerCase().includes(searchLower);
          
          if (!matchesSearch) return false;
        }

        // Status filter
        if (filters.status) {
          if (bill.status !== filters.status) return false;
        }

        // Category filter
        if (filters.category) {
          if (bill.category !== filters.category) return false;
        }

        // Vendor name filter
        if (filters.vendorName) {
          if (bill.vendorName !== filters.vendorName) return false;
        }

        // Date filters
        if (filters.dateFrom) {
          const dateFrom = new Date(filters.dateFrom);
          const billDate = new Date(bill.billDate);
          if (billDate < dateFrom) return false;
        }

        if (filters.dateTo) {
          const dateTo = new Date(filters.dateTo);
          const billDate = new Date(bill.billDate);
          if (billDate > dateTo) return false;
        }

        // Amount filters
        if (filters.amountMin !== undefined) {
          if (bill.total < filters.amountMin) return false;
        }

        if (filters.amountMax !== undefined) {
          if (bill.total > filters.amountMax) return false;
        }

        return true;
      });
    } catch (error) {
      console.error('Failed to search bills:', error);
      throw new Error('Failed to search bills');
    }
  }

  /**
   * Get bills count
   */
  async getCount(): Promise<number> {
    try {
      const bills = await this.getAll();
      return bills.length;
    } catch (error) {
      console.error('Failed to get bills count:', error);
      throw new Error('Failed to get bills count');
    }
  }

  /**
   * Get bills statistics
   */
  async getStats(): Promise<BillStats> {
    try {
      const bills = await this.getAll();
      
      const stats: BillStats = {
        totalBills: bills.length,
        totalAmount: bills.reduce((sum, bill) => sum + bill.total, 0),
        paidAmount: bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.total, 0),
        pendingAmount: bills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.total, 0),
        overdueAmount: bills.filter(bill => bill.status === 'overdue').reduce((sum, bill) => sum + bill.total, 0),
        averageBillAmount: bills.length > 0 ? bills.reduce((sum, bill) => sum + bill.total, 0) / bills.length : 0,
        billsByStatus: {
          draft: bills.filter(bill => bill.status === 'draft').length,
          pending: bills.filter(bill => bill.status === 'pending').length,
          paid: bills.filter(bill => bill.status === 'paid').length,
          overdue: bills.filter(bill => bill.status === 'overdue').length,
          cancelled: bills.filter(bill => bill.status === 'cancelled').length,
        },
        billsByCategory: {
          office_supplies: bills.filter(bill => bill.category === 'office_supplies').length,
          rent: bills.filter(bill => bill.category === 'rent').length,
          utilities: bills.filter(bill => bill.category === 'utilities').length,
          marketing: bills.filter(bill => bill.category === 'marketing').length,
          software: bills.filter(bill => bill.category === 'software').length,
          travel: bills.filter(bill => bill.category === 'travel').length,
          meals: bills.filter(bill => bill.category === 'meals').length,
          equipment: bills.filter(bill => bill.category === 'equipment').length,
          professional_services: bills.filter(bill => bill.category === 'professional_services').length,
          insurance: bills.filter(bill => bill.category === 'insurance').length,
          other: bills.filter(bill => bill.category === 'other').length,
        },
      };

      return stats;
    } catch (error) {
      console.error('Failed to get bills stats:', error);
      throw new Error('Failed to get bills stats');
    }
  }

  /**
   * Mark bill as paid
   */
  async markAsPaid(id: string, paymentMethod?: string, paymentDate?: string): Promise<Bill> {
    try {
      const bill = await this.getById(id);
      if (!bill) {
        throw new Error('Bill not found');
      }

      const updatedBill = await this.update(id, {
        status: 'paid',
        paymentMethod: paymentMethod || bill.paymentMethod,
        paymentDate: paymentDate || new Date().toISOString(),
      });

      return updatedBill;
    } catch (error) {
      console.error('Failed to mark bill as paid:', error);
      throw new Error('Failed to mark bill as paid');
    }
  }

  /**
   * Get overdue bills
   */
  async getOverdueBills(): Promise<Bill[]> {
    try {
      const bills = await this.getAll();
      const today = new Date();
      
      return bills.filter(bill => {
        const dueDate = new Date(bill.dueDate);
        return dueDate < today && bill.status !== 'paid' && bill.status !== 'cancelled';
      });
    } catch (error) {
      console.error('Failed to get overdue bills:', error);
      throw new Error('Failed to get overdue bills');
    }
  }
}
