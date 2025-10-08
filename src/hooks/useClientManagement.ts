import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStorage } from '@/hooks/useStorage';
import { ClientManagementService } from '@/core/services/clientManagementService';
import type {
  Client, CreateClientInput, UpdateClientInput, ClientFilters,
  Contract, CreateContractInput, UpdateContractInput, ContractFilters,
  Payment, CreatePaymentInput, UpdatePaymentInput, PaymentFilters,
  UsageMetrics, CreateUsageMetricsInput, UpdateUsageMetricsInput, UsageMetricsFilters,
  Notification, CreateNotificationInput, UpdateNotificationInput, NotificationFilters,
  ClientDashboardSummary
} from '@/core/models/ClientManagement';

export const clientManagementKeys = {
  all: ['clientManagement'] as const,
  clients: {
    all: () => [...clientManagementKeys.all, 'clients'] as const,
    lists: () => [...clientManagementKeys.clients.all(), 'list'] as const,
    list: (filters: ClientFilters) => [...clientManagementKeys.clients.lists(), filters] as const,
    details: () => [...clientManagementKeys.clients.all(), 'detail'] as const,
    detail: (id: string) => [...clientManagementKeys.clients.details(), id] as const,
    count: () => [...clientManagementKeys.clients.all(), 'count'] as const,
  },
  contracts: {
    all: () => [...clientManagementKeys.all, 'contracts'] as const,
    lists: () => [...clientManagementKeys.contracts.all(), 'list'] as const,
    list: (filters: ContractFilters) => [...clientManagementKeys.contracts.lists(), filters] as const,
    details: () => [...clientManagementKeys.contracts.all(), 'detail'] as const,
    detail: (id: string) => [...clientManagementKeys.contracts.details(), id] as const,
    byClient: (clientId: string) => [...clientManagementKeys.contracts.all(), 'byClient', clientId] as const,
  },
  payments: {
    all: () => [...clientManagementKeys.all, 'payments'] as const,
    lists: () => [...clientManagementKeys.payments.all(), 'list'] as const,
    list: (filters: PaymentFilters) => [...clientManagementKeys.payments.lists(), filters] as const,
    details: () => [...clientManagementKeys.payments.all(), 'detail'] as const,
    detail: (id: string) => [...clientManagementKeys.payments.details(), id] as const,
    byClient: (clientId: string) => [...clientManagementKeys.payments.all(), 'byClient', clientId] as const,
  },
  usageMetrics: {
    all: () => [...clientManagementKeys.all, 'usageMetrics'] as const,
    lists: () => [...clientManagementKeys.usageMetrics.all(), 'list'] as const,
    list: (filters: UsageMetricsFilters) => [...clientManagementKeys.usageMetrics.lists(), filters] as const,
    details: () => [...clientManagementKeys.usageMetrics.all(), 'detail'] as const,
    detail: (id: string) => [...clientManagementKeys.usageMetrics.details(), id] as const,
    byClient: (clientId: string) => [...clientManagementKeys.usageMetrics.all(), 'byClient', clientId] as const,
  },
  notifications: {
    all: () => [...clientManagementKeys.all, 'notifications'] as const,
    lists: () => [...clientManagementKeys.notifications.all(), 'list'] as const,
    list: (filters: NotificationFilters) => [...clientManagementKeys.notifications.lists(), filters] as const,
    details: () => [...clientManagementKeys.notifications.all(), 'detail'] as const,
    detail: (id: string) => [...clientManagementKeys.notifications.details(), id] as const,
    byClient: (clientId: string) => [...clientManagementKeys.notifications.all(), 'byClient', clientId] as const,
  },
  dashboard: () => [...clientManagementKeys.all, 'dashboard'] as const,
};

function useClientManagementService() {
  const storage = useStorage();
  return new ClientManagementService(storage);
}

// --- Client Hooks ---
export function useClients(filters?: ClientFilters) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.clients.list(filters || {}),
    queryFn: () => service.getAllClients(filters),
  });
}

export function useClient(id: string) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.clients.detail(id),
    queryFn: () => service.getClientById(id),
    enabled: !!id,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (input: CreateClientInput) => service.createClient(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.clients.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.dashboard() });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateClientInput }) => 
      service.updateClient(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.clients.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.clients.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.dashboard() });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (id: string) => service.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.clients.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.dashboard() });
    },
  });
}

// --- Contract Hooks ---
export function useContracts(filters?: ContractFilters) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.contracts.list(filters || {}),
    queryFn: () => service.getAllContracts(filters),
  });
}

export function useContract(id: string) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.contracts.detail(id),
    queryFn: () => service.getContractById(id),
    enabled: !!id,
  });
}

export function useContractsByClient(clientId: string) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.contracts.byClient(clientId),
    queryFn: () => service.getContractsByClientId(clientId),
    enabled: !!clientId,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (input: CreateContractInput) => service.createContract(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.contracts.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.contracts.byClient(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.dashboard() });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateContractInput }) => 
      service.updateContract(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.contracts.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.contracts.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.dashboard() });
    },
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (id: string) => service.deleteContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.contracts.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.dashboard() });
    },
  });
}

// --- Payment Hooks ---
export function usePayments(filters?: PaymentFilters) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.payments.list(filters || {}),
    queryFn: () => service.getAllPayments(filters),
  });
}

export function usePayment(id: string) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.payments.detail(id),
    queryFn: () => service.getPaymentById(id),
    enabled: !!id,
  });
}

export function usePaymentsByClient(clientId: string) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.payments.byClient(clientId),
    queryFn: () => service.getPaymentsByClientId(clientId),
    enabled: !!clientId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (input: CreatePaymentInput) => service.createPayment(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.payments.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.payments.byClient(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.dashboard() });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePaymentInput }) => 
      service.updatePayment(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.payments.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.payments.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.dashboard() });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (id: string) => service.deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.payments.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.dashboard() });
    },
  });
}

// --- Usage Metrics Hooks ---
export function useUsageMetrics(filters?: UsageMetricsFilters) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.usageMetrics.list(filters || {}),
    queryFn: () => service.getAllUsageMetrics(filters),
  });
}

export function useUsageMetricsById(id: string) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.usageMetrics.detail(id),
    queryFn: () => service.getUsageMetricsById(id),
    enabled: !!id,
  });
}

export function useUsageMetricsByClient(clientId: string) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.usageMetrics.byClient(clientId),
    queryFn: () => service.getUsageMetricsByClientId(clientId),
    enabled: !!clientId,
  });
}

export function useCreateUsageMetrics() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (input: CreateUsageMetricsInput) => service.createUsageMetrics(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.usageMetrics.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.usageMetrics.byClient(variables.clientId) });
    },
  });
}

export function useUpdateUsageMetrics() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUsageMetricsInput }) => 
      service.updateUsageMetrics(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.usageMetrics.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.usageMetrics.all() });
    },
  });
}

export function useDeleteUsageMetrics() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (id: string) => service.deleteUsageMetrics(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.usageMetrics.all() });
    },
  });
}

// --- Notification Hooks ---
export function useNotifications(filters?: NotificationFilters) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.notifications.list(filters || {}),
    queryFn: () => service.getAllNotifications(filters),
  });
}

export function useNotification(id: string) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.notifications.detail(id),
    queryFn: () => service.getNotificationById(id),
    enabled: !!id,
  });
}

export function useNotificationsByClient(clientId: string) {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.notifications.byClient(clientId),
    queryFn: () => service.getNotificationsByClientId(clientId),
    enabled: !!clientId,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (input: CreateNotificationInput) => service.createNotification(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.notifications.all() });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.notifications.byClient(variables.clientId) });
    },
  });
}

export function useUpdateNotification() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateNotificationInput }) => 
      service.updateNotification(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.notifications.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.notifications.all() });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const service = useClientManagementService();
  
  return useMutation({
    mutationFn: (id: string) => service.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientManagementKeys.notifications.all() });
    },
  });
}

// --- Dashboard Hooks ---
export function useClientDashboardSummary() {
  const service = useClientManagementService();
  return useQuery({
    queryKey: clientManagementKeys.dashboard(),
    queryFn: () => service.getDashboardSummary(),
  });
}
