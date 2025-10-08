import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter';
import type {
  Supplier, CreateSupplierInput, UpdateSupplierInput, SupplierFilters,
  PurchaseOrder, CreatePurchaseOrderInput, UpdatePurchaseOrderInput, PurchaseOrderFilters,
  Invoice, CreateInvoiceInput, UpdateInvoiceInput, InvoiceFilters,
  SupplierPayment, CreateSupplierPaymentInput, UpdateSupplierPaymentInput, SupplierPaymentFilters,
  SupplierMetrics, CreateSupplierMetricsInput, UpdateSupplierMetricsInput, SupplierMetricsFilters,
  SupplierDashboardSummary
} from '@/core/models/SupplierManagement';
import {
  SupplierSchema, PurchaseOrderSchema, InvoiceSchema, SupplierPaymentSchema, SupplierMetricsSchema
} from '@/core/models/SupplierManagement';

export class SupplierManagementService {
  private readonly storage: StorageAdapter;
  private readonly supplierEntityKey = 'suppliers';
  private readonly purchaseOrderEntityKey = 'purchase_orders';
  private readonly invoiceEntityKey = 'invoices';
  private readonly supplierPaymentEntityKey = 'supplier_payments';
  private readonly supplierMetricsEntityKey = 'supplier_metrics';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  // --- Supplier Operations ---
  async getAllSuppliers(filters?: SupplierFilters): Promise<Supplier[]> {
    try {
      const suppliers = await this.storage.list<Supplier>(this.supplierEntityKey);

      if (!filters) return suppliers;

      const filteredSuppliers = suppliers.filter(supplier => {
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          if (!supplier.name.toLowerCase().includes(searchLower) &&
              !supplier.email.toLowerCase().includes(searchLower) &&
              !supplier.company.toLowerCase().includes(searchLower)) {
            return false;
          }
        }
        if (filters.status && supplier.status !== filters.status) return false;
        if (filters.category && supplier.category !== filters.category) return false;
        if (filters.paymentTerms && supplier.paymentTerms !== filters.paymentTerms) return false;
        if (filters.rating && (!supplier.rating || supplier.rating < filters.rating)) return false;
        return true;
      });
      
      return filteredSuppliers;
    } catch (error) {
      console.error('Error in getAllSuppliers:', error);
      throw error;
    }
  }

  async getSupplierById(id: string): Promise<Supplier | null> {
    return await this.storage.get<Supplier>(`${this.supplierEntityKey}:${id}`);
  }

  async createSupplier(input: CreateSupplierInput): Promise<Supplier> {
    const supplier: Supplier = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedSupplier = SupplierSchema.parse(supplier);
    await this.storage.set(`${this.supplierEntityKey}:${validatedSupplier.id}`, validatedSupplier);
    return validatedSupplier;
  }

  async updateSupplier(id: string, input: UpdateSupplierInput): Promise<Supplier> {
    const existingSupplier = await this.getSupplierById(id);
    if (!existingSupplier) {
      throw new Error(`Supplier with id ${id} not found`);
    }

    const updatedSupplier: Supplier = {
      ...existingSupplier,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedSupplier = SupplierSchema.parse(updatedSupplier);
    await this.storage.set(`${this.supplierEntityKey}:${id}`, validatedSupplier);
    return validatedSupplier;
  }

  async deleteSupplier(id: string): Promise<void> {
    // Also delete related data
    await Promise.all([
      this.storage.delete(`${this.supplierEntityKey}:${id}`),
      this.deletePurchaseOrdersBySupplierId(id),
      this.deleteInvoicesBySupplierId(id),
      this.deleteSupplierPaymentsBySupplierId(id),
      this.deleteSupplierMetricsBySupplierId(id),
    ]);
  }

  async getSuppliersCount(): Promise<number> {
    const suppliers = await this.storage.list<Supplier>(this.supplierEntityKey);
    return suppliers.length;
  }

  // --- Purchase Order Operations ---
  async getAllPurchaseOrders(filters?: PurchaseOrderFilters): Promise<PurchaseOrder[]> {
    const orders = await this.storage.list<PurchaseOrder>(this.purchaseOrderEntityKey);

    if (!filters) return orders;

    return orders.filter(order => {
      if (filters.supplierId && order.supplierId !== filters.supplierId) return false;
      if (filters.status && order.status !== filters.status) return false;
      if (filters.priority && order.priority !== filters.priority) return false;
      if (filters.orderDateFrom && new Date(order.orderDate) < new Date(filters.orderDateFrom)) return false;
      if (filters.orderDateTo && new Date(order.orderDate) > new Date(filters.orderDateTo)) return false;
      return true;
    });
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder | null> {
    return await this.storage.get<PurchaseOrder>(`${this.purchaseOrderEntityKey}:${id}`);
  }

  async getPurchaseOrdersBySupplierId(supplierId: string): Promise<PurchaseOrder[]> {
    const orders = await this.storage.list<PurchaseOrder>(this.purchaseOrderEntityKey);
    return orders.filter(order => order.supplierId === supplierId);
  }

  async createPurchaseOrder(input: CreatePurchaseOrderInput): Promise<PurchaseOrder> {
    const order: PurchaseOrder = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedOrder = PurchaseOrderSchema.parse(order);
    await this.storage.set(`${this.purchaseOrderEntityKey}:${validatedOrder.id}`, validatedOrder);
    return validatedOrder;
  }

  async updatePurchaseOrder(id: string, input: UpdatePurchaseOrderInput): Promise<PurchaseOrder> {
    const existingOrder = await this.getPurchaseOrderById(id);
    if (!existingOrder) {
      throw new Error(`Purchase order with id ${id} not found`);
    }

    const updatedOrder: PurchaseOrder = {
      ...existingOrder,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedOrder = PurchaseOrderSchema.parse(updatedOrder);
    await this.storage.set(`${this.purchaseOrderEntityKey}:${id}`, validatedOrder);
    return validatedOrder;
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    await this.storage.delete(`${this.purchaseOrderEntityKey}:${id}`);
  }

  private async deletePurchaseOrdersBySupplierId(supplierId: string): Promise<void> {
    const orders = await this.getPurchaseOrdersBySupplierId(supplierId);
    await Promise.all(orders.map(order => this.deletePurchaseOrder(order.id!)));
  }

  // --- Invoice Operations ---
  async getAllInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
    const invoices = await this.storage.list<Invoice>(this.invoiceEntityKey);

    if (!filters) return invoices;

    return invoices.filter(invoice => {
      if (filters.supplierId && invoice.supplierId !== filters.supplierId) return false;
      if (filters.purchaseOrderId && invoice.purchaseOrderId !== filters.purchaseOrderId) return false;
      if (filters.status && invoice.status !== filters.status) return false;
      if (filters.invoiceDateFrom && new Date(invoice.invoiceDate) < new Date(filters.invoiceDateFrom)) return false;
      if (filters.invoiceDateTo && new Date(invoice.invoiceDate) > new Date(filters.invoiceDateTo)) return false;
      return true;
    });
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return await this.storage.get<Invoice>(`${this.invoiceEntityKey}:${id}`);
  }

  async getInvoicesBySupplierId(supplierId: string): Promise<Invoice[]> {
    const invoices = await this.storage.list<Invoice>(this.invoiceEntityKey);
    return invoices.filter(invoice => invoice.supplierId === supplierId);
  }

  async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    const invoice: Invoice = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedInvoice = InvoiceSchema.parse(invoice);
    await this.storage.set(`${this.invoiceEntityKey}:${validatedInvoice.id}`, validatedInvoice);
    return validatedInvoice;
  }

  async updateInvoice(id: string, input: UpdateInvoiceInput): Promise<Invoice> {
    const existingInvoice = await this.getInvoiceById(id);
    if (!existingInvoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    const updatedInvoice: Invoice = {
      ...existingInvoice,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedInvoice = InvoiceSchema.parse(updatedInvoice);
    await this.storage.set(`${this.invoiceEntityKey}:${id}`, validatedInvoice);
    return validatedInvoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    await this.storage.delete(`${this.invoiceEntityKey}:${id}`);
  }

  private async deleteInvoicesBySupplierId(supplierId: string): Promise<void> {
    const invoices = await this.getInvoicesBySupplierId(supplierId);
    await Promise.all(invoices.map(invoice => this.deleteInvoice(invoice.id!)));
  }

  // --- Supplier Payment Operations ---
  async getAllSupplierPayments(filters?: SupplierPaymentFilters): Promise<SupplierPayment[]> {
    const payments = await this.storage.list<SupplierPayment>(this.supplierPaymentEntityKey);

    if (!filters) return payments;

    return payments.filter(payment => {
      if (filters.supplierId && payment.supplierId !== filters.supplierId) return false;
      if (filters.invoiceId && payment.invoiceId !== filters.invoiceId) return false;
      if (filters.status && payment.status !== filters.status) return false;
      if (filters.method && payment.method !== filters.method) return false;
      return true;
    });
  }

  async getSupplierPaymentById(id: string): Promise<SupplierPayment | null> {
    return await this.storage.get<SupplierPayment>(`${this.supplierPaymentEntityKey}:${id}`);
  }

  async getSupplierPaymentsBySupplierId(supplierId: string): Promise<SupplierPayment[]> {
    const payments = await this.storage.list<SupplierPayment>(this.supplierPaymentEntityKey);
    return payments.filter(payment => payment.supplierId === supplierId);
  }

  async createSupplierPayment(input: CreateSupplierPaymentInput): Promise<SupplierPayment> {
    const payment: SupplierPayment = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedPayment = SupplierPaymentSchema.parse(payment);
    await this.storage.set(`${this.supplierPaymentEntityKey}:${validatedPayment.id}`, validatedPayment);
    return validatedPayment;
  }

  async updateSupplierPayment(id: string, input: UpdateSupplierPaymentInput): Promise<SupplierPayment> {
    const existingPayment = await this.getSupplierPaymentById(id);
    if (!existingPayment) {
      throw new Error(`Supplier payment with id ${id} not found`);
    }

    const updatedPayment: SupplierPayment = {
      ...existingPayment,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedPayment = SupplierPaymentSchema.parse(updatedPayment);
    await this.storage.set(`${this.supplierPaymentEntityKey}:${id}`, validatedPayment);
    return validatedPayment;
  }

  async deleteSupplierPayment(id: string): Promise<void> {
    await this.storage.delete(`${this.supplierPaymentEntityKey}:${id}`);
  }

  private async deleteSupplierPaymentsBySupplierId(supplierId: string): Promise<void> {
    const payments = await this.getSupplierPaymentsBySupplierId(supplierId);
    await Promise.all(payments.map(payment => this.deleteSupplierPayment(payment.id!)));
  }

  // --- Supplier Metrics Operations ---
  async getAllSupplierMetrics(filters?: SupplierMetricsFilters): Promise<SupplierMetrics[]> {
    const metrics = await this.storage.list<SupplierMetrics>(this.supplierMetricsEntityKey);

    if (!filters) return metrics;

    return metrics.filter(metric => {
      if (filters.supplierId && metric.supplierId !== filters.supplierId) return false;
      if (filters.periodFrom && new Date(metric.period) < new Date(filters.periodFrom)) return false;
      if (filters.periodTo && new Date(metric.period) > new Date(filters.periodTo)) return false;
      return true;
    });
  }

  async getSupplierMetricsById(id: string): Promise<SupplierMetrics | null> {
    return await this.storage.get<SupplierMetrics>(`${this.supplierMetricsEntityKey}:${id}`);
  }

  async getSupplierMetricsBySupplierId(supplierId: string): Promise<SupplierMetrics[]> {
    const metrics = await this.storage.list<SupplierMetrics>(this.supplierMetricsEntityKey);
    return metrics.filter(metric => metric.supplierId === supplierId);
  }

  async createSupplierMetrics(input: CreateSupplierMetricsInput): Promise<SupplierMetrics> {
    const metrics: SupplierMetrics = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedMetrics = SupplierMetricsSchema.parse(metrics);
    await this.storage.set(`${this.supplierMetricsEntityKey}:${validatedMetrics.id}`, validatedMetrics);
    return validatedMetrics;
  }

  async updateSupplierMetrics(id: string, input: UpdateSupplierMetricsInput): Promise<SupplierMetrics> {
    const existingMetrics = await this.getSupplierMetricsById(id);
    if (!existingMetrics) {
      throw new Error(`Supplier metrics with id ${id} not found`);
    }

    const updatedMetrics: SupplierMetrics = {
      ...existingMetrics,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedMetrics = SupplierMetricsSchema.parse(updatedMetrics);
    await this.storage.set(`${this.supplierMetricsEntityKey}:${id}`, validatedMetrics);
    return validatedMetrics;
  }

  async deleteSupplierMetrics(id: string): Promise<void> {
    await this.storage.delete(`${this.supplierMetricsEntityKey}:${id}`);
  }

  private async deleteSupplierMetricsBySupplierId(supplierId: string): Promise<void> {
    const metrics = await this.getSupplierMetricsBySupplierId(supplierId);
    await Promise.all(metrics.map(metric => this.deleteSupplierMetrics(metric.id!)));
  }

  // --- Dashboard Summary Operations ---
  async getSupplierDashboardSummary(): Promise<SupplierDashboardSummary> {
    const suppliers = await this.getAllSuppliers();
    const purchaseOrders = await this.getAllPurchaseOrders();
    const invoices = await this.getAllInvoices();
    const payments = await this.getAllSupplierPayments();

    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
    const pendingSuppliers = suppliers.filter(s => s.status === 'pending').length;

    const totalPurchaseOrders = purchaseOrders.length;
    const pendingOrders = purchaseOrders.filter(o => ['draft', 'sent', 'confirmed'].includes(o.status)).length;
    const overdueOrders = purchaseOrders.filter(o => 
      o.expectedDeliveryDate && new Date(o.expectedDeliveryDate) < new Date() && o.status !== 'delivered'
    ).length;

    const totalInvoices = invoices.length;
    const unpaidInvoices = invoices.filter(i => ['draft', 'sent', 'received', 'approved'].includes(i.status)).length;
    const overdueInvoices = invoices.filter(i => 
      new Date(i.dueDate) < new Date() && !['paid', 'cancelled'].includes(i.status)
    ).length;

    const totalSpent = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const averageOrderValue = totalPurchaseOrders > 0 
      ? purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0) / totalPurchaseOrders 
      : 0;

    // Calculate top suppliers by total spent
    const supplierSpending = new Map<string, { name: string; orders: number; spent: number; rating?: number }>();
    
    purchaseOrders.forEach(order => {
      const supplier = suppliers.find(s => s.id === order.supplierId);
      if (supplier) {
        const existing = supplierSpending.get(supplier.id!) || { name: supplier.name, orders: 0, spent: 0, rating: supplier.rating };
        existing.orders += 1;
        existing.spent += order.totalAmount;
        existing.rating = supplier.rating;
        supplierSpending.set(supplier.id!, existing);
      }
    });

    const topSuppliers = Array.from(supplierSpending.entries())
      .map(([supplierId, data]) => ({
        supplierId,
        supplierName: data.name,
        totalOrders: data.orders,
        totalSpent: data.spent,
        rating: data.rating,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    return {
      totalSuppliers,
      activeSuppliers,
      pendingSuppliers,
      totalPurchaseOrders,
      pendingOrders,
      overdueOrders,
      totalInvoices,
      unpaidInvoices,
      overdueInvoices,
      totalSpent,
      averageOrderValue,
      topSuppliers,
    };
  }
}
