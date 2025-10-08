import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter'
import type { Invoice, CreateInvoiceInput, UpdateInvoiceInput, InvoiceFilters, InvoiceStats } from '@/core/models/Invoice'
import { InvoiceSchema } from '@/core/models/Invoice'

/**
 * Invoice service for CRUD operations
 * Implements business logic for invoice management
 */
export class InvoiceService {
  private readonly storage: StorageAdapter;
  private readonly entityKey = 'invoices';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Get all invoices
   */
  async getAll(): Promise<Invoice[]> {
    try {
      const invoices = await this.storage.list<Invoice>(this.entityKey);
      return invoices.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Failed to get all invoices:', error);
      throw new Error('Failed to fetch invoices');
    }
  }

  /**
   * Get invoice by ID
   */
  async getById(id: string): Promise<Invoice | null> {
    try {
      if (!id) {
        throw new Error('Invoice ID is required');
      }
      
      const invoice = await this.storage.get<Invoice>(`${this.entityKey}:${id}`);
      return invoice;
    } catch (error) {
      console.error('Failed to get invoice by ID:', error);
      throw new Error('Failed to fetch invoice');
    }
  }

  /**
   * Create a new invoice
   */
  async create(input: CreateInvoiceInput): Promise<Invoice> {
    try {
      // Validate input
      const validatedInput = InvoiceSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(input);
      
      const invoice: Invoice = {
        ...validatedInput,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${invoice.id}`, invoice);
      return invoice;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to create invoice');
    }
  }

  /**
   * Update an existing invoice
   */
  async update(id: string, input: UpdateInvoiceInput): Promise<Invoice> {
    try {
      if (!id) {
        throw new Error('Invoice ID is required');
      }

      const existingInvoice = await this.getById(id);
      if (!existingInvoice) {
        throw new Error('Invoice not found');
      }

      // Validate input
      const validatedInput = InvoiceSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().parse(input);
      
      const updatedInvoice: Invoice = {
        ...existingInvoice,
        ...validatedInput,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${id}`, updatedInvoice);
      return updatedInvoice;
    } catch (error) {
      console.error('Failed to update invoice:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to update invoice');
    }
  }

  /**
   * Delete an invoice
   */
  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Invoice ID is required');
      }

      const existingInvoice = await this.getById(id);
      if (!existingInvoice) {
        throw new Error('Invoice not found');
      }

      await this.storage.delete(`${this.entityKey}:${id}`);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw new Error('Failed to delete invoice');
    }
  }

  /**
   * Search invoices with filters
   */
  async search(filters: InvoiceFilters): Promise<Invoice[]> {
    try {
      const allInvoices = await this.getAll();
      
      return allInvoices.filter(invoice => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
            invoice.clientName.toLowerCase().includes(searchLower) ||
            invoice.clientEmail.toLowerCase().includes(searchLower);
          
          if (!matchesSearch) return false;
        }

        // Status filter
        if (filters.status) {
          if (invoice.status !== filters.status) return false;
        }

        // Client filter
        if (filters.clientId) {
          if (invoice.clientId !== filters.clientId) return false;
        }

        if (filters.clientName) {
          if (invoice.clientName !== filters.clientName) return false;
        }

        // Date filters
        if (filters.dateFrom) {
          const dateFrom = new Date(filters.dateFrom);
          const invoiceDate = new Date(invoice.invoiceDate);
          if (invoiceDate < dateFrom) return false;
        }

        if (filters.dateTo) {
          const dateTo = new Date(filters.dateTo);
          const invoiceDate = new Date(invoice.invoiceDate);
          if (invoiceDate > dateTo) return false;
        }

        // Amount filters
        if (filters.amountMin !== undefined) {
          if (invoice.total < filters.amountMin) return false;
        }

        if (filters.amountMax !== undefined) {
          if (invoice.total > filters.amountMax) return false;
        }

        return true;
      });
    } catch (error) {
      console.error('Failed to search invoices:', error);
      throw new Error('Failed to search invoices');
    }
  }

  /**
   * Get invoices count
   */
  async getCount(): Promise<number> {
    try {
      const invoices = await this.getAll();
      return invoices.length;
    } catch (error) {
      console.error('Failed to get invoices count:', error);
      throw new Error('Failed to get invoices count');
    }
  }

  /**
   * Get invoices statistics
   */
  async getStats(): Promise<InvoiceStats> {
    try {
      const invoices = await this.getAll();
      
      const stats: InvoiceStats = {
        totalInvoices: invoices.length,
        totalAmount: invoices.reduce((sum, invoice) => sum + invoice.total, 0),
        paidAmount: invoices.filter(invoice => invoice.status === 'paid').reduce((sum, invoice) => sum + invoice.total, 0),
        pendingAmount: invoices.filter(invoice => invoice.status === 'sent' || invoice.status === 'viewed').reduce((sum, invoice) => sum + invoice.total, 0),
        overdueAmount: invoices.filter(invoice => invoice.status === 'overdue').reduce((sum, invoice) => sum + invoice.total, 0),
        averageInvoiceAmount: invoices.length > 0 ? invoices.reduce((sum, invoice) => sum + invoice.total, 0) / invoices.length : 0,
        invoicesByStatus: {
          draft: invoices.filter(invoice => invoice.status === 'draft').length,
          sent: invoices.filter(invoice => invoice.status === 'sent').length,
          viewed: invoices.filter(invoice => invoice.status === 'viewed').length,
          paid: invoices.filter(invoice => invoice.status === 'paid').length,
          overdue: invoices.filter(invoice => invoice.status === 'overdue').length,
          cancelled: invoices.filter(invoice => invoice.status === 'cancelled').length,
        },
        invoicesByClient: invoices.reduce((acc, invoice) => {
          acc[invoice.clientId] = (acc[invoice.clientId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };

      return stats;
    } catch (error) {
      console.error('Failed to get invoices stats:', error);
      throw new Error('Failed to get invoices stats');
    }
  }

  /**
   * Mark invoice as sent
   */
  async markAsSent(id: string): Promise<Invoice> {
    try {
      const invoice = await this.getById(id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const updatedInvoice = await this.update(id, {
        status: 'sent',
        sentDate: new Date().toISOString(),
      });

      return updatedInvoice;
    } catch (error) {
      console.error('Failed to mark invoice as sent:', error);
      throw new Error('Failed to mark invoice as sent');
    }
  }

  /**
   * Mark invoice as paid
   */
  async markAsPaid(id: string, paymentMethod?: string, paymentDate?: string): Promise<Invoice> {
    try {
      const invoice = await this.getById(id);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const updatedInvoice = await this.update(id, {
        status: 'paid',
        paymentMethod: paymentMethod || invoice.paymentMethod,
        paymentDate: paymentDate || new Date().toISOString(),
      });

      return updatedInvoice;
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
      throw new Error('Failed to mark invoice as paid');
    }
  }

  /**
   * Get overdue invoices
   */
  async getOverdueInvoices(): Promise<Invoice[]> {
    try {
      const invoices = await this.getAll();
      const today = new Date();
      
      return invoices.filter(invoice => {
        const dueDate = new Date(invoice.dueDate);
        return dueDate < today && invoice.status !== 'paid' && invoice.status !== 'cancelled';
      });
    } catch (error) {
      console.error('Failed to get overdue invoices:', error);
      throw new Error('Failed to get overdue invoices');
    }
  }

  /**
   * Generate next invoice number
   */
  async generateInvoiceNumber(): Promise<string> {
    try {
      const invoices = await this.getAll();
      const currentYear = new Date().getFullYear();
      const yearPrefix = `INV-${currentYear}-`;
      
      const yearInvoices = invoices.filter(invoice => 
        invoice.invoiceNumber.startsWith(yearPrefix)
      );
      
      const nextNumber = yearInvoices.length + 1;
      return `${yearPrefix}${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('Failed to generate invoice number:', error);
      throw new Error('Failed to generate invoice number');
    }
  }
}
