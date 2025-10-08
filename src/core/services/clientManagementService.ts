import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter';
import type {
  Client, CreateClientInput, UpdateClientInput, ClientFilters,
  Contract, CreateContractInput, UpdateContractInput, ContractFilters,
  Payment, CreatePaymentInput, UpdatePaymentInput, PaymentFilters,
  UsageMetrics, CreateUsageMetricsInput, UpdateUsageMetricsInput, UsageMetricsFilters,
  Notification, CreateNotificationInput, UpdateNotificationInput, NotificationFilters,
  ClientDashboardSummary
} from '@/core/models/ClientManagement';
import {
  ClientSchema, ContractSchema, PaymentSchema, UsageMetricsSchema, NotificationSchema
} from '@/core/models/ClientManagement';

export class ClientManagementService {
  private readonly storage: StorageAdapter;
  private readonly clientEntityKey = 'clients';
  private readonly contractEntityKey = 'contracts';
  private readonly paymentEntityKey = 'payments';
  private readonly usageMetricsEntityKey = 'usage_metrics';
  private readonly notificationEntityKey = 'notifications';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  // --- Client Operations ---
  async getAllClients(filters?: ClientFilters): Promise<Client[]> {
    const clients = await this.storage.list<Client>(this.clientEntityKey);
    
    if (!filters) return clients;

    return clients.filter(client => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!client.name.toLowerCase().includes(searchLower) &&
            !client.email.toLowerCase().includes(searchLower) &&
            !client.company.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filters.status && client.status !== filters.status) return false;
      if (filters.tier && client.tier !== filters.tier) return false;
      if (filters.company && !client.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
      return true;
    });
  }

  async getClientById(id: string): Promise<Client | null> {
    return await this.storage.get<Client>(`${this.clientEntityKey}:${id}`);
  }

  async createClient(input: CreateClientInput): Promise<Client> {
    const client: Client = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedClient = ClientSchema.parse(client);
    await this.storage.set(`${this.clientEntityKey}:${validatedClient.id}`, validatedClient);
    return validatedClient;
  }

  async updateClient(id: string, input: UpdateClientInput): Promise<Client> {
    const existingClient = await this.getClientById(id);
    if (!existingClient) {
      throw new Error(`Client with id ${id} not found`);
    }

    const updatedClient: Client = {
      ...existingClient,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedClient = ClientSchema.parse(updatedClient);
    await this.storage.set(`${this.clientEntityKey}:${id}`, validatedClient);
    return validatedClient;
  }

  async deleteClient(id: string): Promise<void> {
    // Also delete related data
    await Promise.all([
      this.storage.delete(`${this.clientEntityKey}:${id}`),
      this.deleteContractsByClientId(id),
      this.deletePaymentsByClientId(id),
      this.deleteUsageMetricsByClientId(id),
      this.deleteNotificationsByClientId(id),
    ]);
  }

  async getClientsCount(): Promise<number> {
    const clients = await this.storage.list<Client>(this.clientEntityKey);
    return clients.length;
  }

  // --- Contract Operations ---
  async getAllContracts(filters?: ContractFilters): Promise<Contract[]> {
    const contracts = await this.storage.list<Contract>(this.contractEntityKey);
    
    if (!filters) return contracts;

    return contracts.filter(contract => {
      if (filters.clientId && contract.clientId !== filters.clientId) return false;
      if (filters.status && contract.status !== filters.status) return false;
      if (filters.type && contract.type !== filters.type) return false;
      if (filters.billingCycle && contract.billingCycle !== filters.billingCycle) return false;
      return true;
    });
  }

  async getContractById(id: string): Promise<Contract | null> {
    return await this.storage.get<Contract>(`${this.contractEntityKey}:${id}`);
  }

  async getContractsByClientId(clientId: string): Promise<Contract[]> {
    const contracts = await this.storage.list<Contract>(this.contractEntityKey);
    return contracts.filter(contract => contract.clientId === clientId);
  }

  async createContract(input: CreateContractInput): Promise<Contract> {
    const contract: Contract = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedContract = ContractSchema.parse(contract);
    await this.storage.set(`${this.contractEntityKey}:${validatedContract.id}`, validatedContract);
    return validatedContract;
  }

  async updateContract(id: string, input: UpdateContractInput): Promise<Contract> {
    const existingContract = await this.getContractById(id);
    if (!existingContract) {
      throw new Error(`Contract with id ${id} not found`);
    }

    const updatedContract: Contract = {
      ...existingContract,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedContract = ContractSchema.parse(updatedContract);
    await this.storage.set(`${this.contractEntityKey}:${id}`, validatedContract);
    return validatedContract;
  }

  async deleteContract(id: string): Promise<void> {
    await this.storage.delete(`${this.contractEntityKey}:${id}`);
  }

  private async deleteContractsByClientId(clientId: string): Promise<void> {
    const contracts = await this.getContractsByClientId(clientId);
    await Promise.all(contracts.map(contract => this.deleteContract(contract.id!)));
  }

  // --- Payment Operations ---
  async getAllPayments(filters?: PaymentFilters): Promise<Payment[]> {
    const payments = await this.storage.list<Payment>(this.paymentEntityKey);
    
    if (!filters) return payments;

    return payments.filter(payment => {
      if (filters.clientId && payment.clientId !== filters.clientId) return false;
      if (filters.status && payment.status !== filters.status) return false;
      if (filters.method && payment.method !== filters.method) return false;
      if (filters.dateFrom && payment.paymentDate && payment.paymentDate < filters.dateFrom) return false;
      if (filters.dateTo && payment.paymentDate && payment.paymentDate > filters.dateTo) return false;
      return true;
    });
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return await this.storage.get<Payment>(`${this.paymentEntityKey}:${id}`);
  }

  async getPaymentsByClientId(clientId: string): Promise<Payment[]> {
    const payments = await this.storage.list<Payment>(this.paymentEntityKey);
    return payments.filter(payment => payment.clientId === clientId);
  }

  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    const payment: Payment = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedPayment = PaymentSchema.parse(payment);
    await this.storage.set(`${this.paymentEntityKey}:${validatedPayment.id}`, validatedPayment);
    return validatedPayment;
  }

  async updatePayment(id: string, input: UpdatePaymentInput): Promise<Payment> {
    const existingPayment = await this.getPaymentById(id);
    if (!existingPayment) {
      throw new Error(`Payment with id ${id} not found`);
    }

    const updatedPayment: Payment = {
      ...existingPayment,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedPayment = PaymentSchema.parse(updatedPayment);
    await this.storage.set(`${this.paymentEntityKey}:${id}`, validatedPayment);
    return validatedPayment;
  }

  async deletePayment(id: string): Promise<void> {
    await this.storage.delete(`${this.paymentEntityKey}:${id}`);
  }

  private async deletePaymentsByClientId(clientId: string): Promise<void> {
    const payments = await this.getPaymentsByClientId(clientId);
    await Promise.all(payments.map(payment => this.deletePayment(payment.id!)));
  }

  // --- Usage Metrics Operations ---
  async getAllUsageMetrics(filters?: UsageMetricsFilters): Promise<UsageMetrics[]> {
    const metrics = await this.storage.list<UsageMetrics>(this.usageMetricsEntityKey);
    
    if (!filters) return metrics;

    return metrics.filter(metric => {
      if (filters.clientId && metric.clientId !== filters.clientId) return false;
      if (filters.period && metric.period !== filters.period) return false;
      if (filters.dateFrom && metric.createdAt && metric.createdAt < filters.dateFrom) return false;
      if (filters.dateTo && metric.createdAt && metric.createdAt > filters.dateTo) return false;
      return true;
    });
  }

  async getUsageMetricsById(id: string): Promise<UsageMetrics | null> {
    return await this.storage.get<UsageMetrics>(`${this.usageMetricsEntityKey}:${id}`);
  }

  async getUsageMetricsByClientId(clientId: string): Promise<UsageMetrics[]> {
    const metrics = await this.storage.list<UsageMetrics>(this.usageMetricsEntityKey);
    return metrics.filter(metric => metric.clientId === clientId);
  }

  async createUsageMetrics(input: CreateUsageMetricsInput): Promise<UsageMetrics> {
    const metrics: UsageMetrics = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedMetrics = UsageMetricsSchema.parse(metrics);
    await this.storage.set(`${this.usageMetricsEntityKey}:${validatedMetrics.id}`, validatedMetrics);
    return validatedMetrics;
  }

  async updateUsageMetrics(id: string, input: UpdateUsageMetricsInput): Promise<UsageMetrics> {
    const existingMetrics = await this.getUsageMetricsById(id);
    if (!existingMetrics) {
      throw new Error(`Usage metrics with id ${id} not found`);
    }

    const updatedMetrics: UsageMetrics = {
      ...existingMetrics,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedMetrics = UsageMetricsSchema.parse(updatedMetrics);
    await this.storage.set(`${this.usageMetricsEntityKey}:${id}`, validatedMetrics);
    return validatedMetrics;
  }

  async deleteUsageMetrics(id: string): Promise<void> {
    await this.storage.delete(`${this.usageMetricsEntityKey}:${id}`);
  }

  private async deleteUsageMetricsByClientId(clientId: string): Promise<void> {
    const metrics = await this.getUsageMetricsByClientId(clientId);
    await Promise.all(metrics.map(metric => this.deleteUsageMetrics(metric.id!)));
  }

  // --- Notification Operations ---
  async getAllNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    const notifications = await this.storage.list<Notification>(this.notificationEntityKey);
    
    if (!filters) return notifications;

    return notifications.filter(notification => {
      if (filters.clientId && notification.clientId !== filters.clientId) return false;
      if (filters.type && notification.type !== filters.type) return false;
      if (filters.status && notification.status !== filters.status) return false;
      if (filters.priority && notification.priority !== filters.priority) return false;
      return true;
    });
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    return await this.storage.get<Notification>(`${this.notificationEntityKey}:${id}`);
  }

  async getNotificationsByClientId(clientId: string): Promise<Notification[]> {
    const notifications = await this.storage.list<Notification>(this.notificationEntityKey);
    return notifications.filter(notification => notification.clientId === clientId);
  }

  async createNotification(input: CreateNotificationInput): Promise<Notification> {
    const notification: Notification = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validatedNotification = NotificationSchema.parse(notification);
    await this.storage.set(`${this.notificationEntityKey}:${validatedNotification.id}`, validatedNotification);
    return validatedNotification;
  }

  async updateNotification(id: string, input: UpdateNotificationInput): Promise<Notification> {
    const existingNotification = await this.getNotificationById(id);
    if (!existingNotification) {
      throw new Error(`Notification with id ${id} not found`);
    }

    const updatedNotification: Notification = {
      ...existingNotification,
      ...input,
      id,
      updatedAt: new Date().toISOString(),
    };

    const validatedNotification = NotificationSchema.parse(updatedNotification);
    await this.storage.set(`${this.notificationEntityKey}:${id}`, validatedNotification);
    return validatedNotification;
  }

  async deleteNotification(id: string): Promise<void> {
    await this.storage.delete(`${this.notificationEntityKey}:${id}`);
  }

  private async deleteNotificationsByClientId(clientId: string): Promise<void> {
    const notifications = await this.getNotificationsByClientId(clientId);
    await Promise.all(notifications.map(notification => this.deleteNotification(notification.id!)));
  }

  // --- Dashboard Summary ---
  async getDashboardSummary(): Promise<ClientDashboardSummary> {
    const [clients, contracts, payments] = await Promise.all([
      this.getAllClients(),
      this.getAllContracts(),
      this.getAllPayments(),
    ]);

    const activeClients = clients.filter(client => client.status === 'active').length;
    const totalRevenue = payments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingPayments = payments.filter(payment => payment.status === 'pending').length;
    
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringContracts = contracts.filter(contract => {
      if (!contract.endDate) return false;
      const endDate = new Date(contract.endDate);
      return endDate <= thirtyDaysFromNow && contract.status === 'active';
    }).length;

    // Recent activity (simplified - in real app, you'd have an activity log)
    const recentActivity = [
      ...clients.slice(-5).map(client => ({
        type: 'client_created' as const,
        clientId: client.id!,
        clientName: client.name,
        timestamp: client.createdAt!,
      })),
      ...payments.slice(-5).map(payment => ({
        type: 'payment_received' as const,
        clientId: payment.clientId,
        clientName: clients.find(c => c.id === payment.clientId)?.name || 'Unknown',
        amount: payment.amount,
        timestamp: payment.paymentDate || payment.createdAt!,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    return {
      totalClients: clients.length,
      activeClients,
      totalRevenue,
      pendingPayments,
      expiringContracts,
      recentActivity,
    };
  }
}