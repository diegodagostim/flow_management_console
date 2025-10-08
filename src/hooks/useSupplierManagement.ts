import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStorage } from '@/hooks/useStorage';
import { SupplierManagementService } from '@/core/services/supplierManagementService';
import type {
  Supplier, CreateSupplierInput, UpdateSupplierInput, SupplierFilters,
  PurchaseOrder, CreatePurchaseOrderInput, UpdatePurchaseOrderInput, PurchaseOrderFilters,
  Invoice, CreateInvoiceInput, UpdateInvoiceInput, InvoiceFilters,
  SupplierPayment, CreateSupplierPaymentInput, UpdateSupplierPaymentInput, SupplierPaymentFilters,
  SupplierMetrics, CreateSupplierMetricsInput, UpdateSupplierMetricsInput, SupplierMetricsFilters,
  SupplierDashboardSummary
} from '@/core/models/SupplierManagement';

// Query Keys
const SUPPLIER_KEYS = {
  all: ['suppliers'] as const,
  lists: () => [...SUPPLIER_KEYS.all, 'list'] as const,
  list: (filters: SupplierFilters) => [...SUPPLIER_KEYS.lists(), filters] as const,
  details: () => [...SUPPLIER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPPLIER_KEYS.details(), id] as const,
  count: () => [...SUPPLIER_KEYS.all, 'count'] as const,
};

const PURCHASE_ORDER_KEYS = {
  all: ['purchase-orders'] as const,
  lists: () => [...PURCHASE_ORDER_KEYS.all, 'list'] as const,
  list: (filters: PurchaseOrderFilters) => [...PURCHASE_ORDER_KEYS.lists(), filters] as const,
  details: () => [...PURCHASE_ORDER_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PURCHASE_ORDER_KEYS.details(), id] as const,
  bySupplier: (supplierId: string) => [...PURCHASE_ORDER_KEYS.all, 'supplier', supplierId] as const,
};

const INVOICE_KEYS = {
  all: ['invoices'] as const,
  lists: () => [...INVOICE_KEYS.all, 'list'] as const,
  list: (filters: InvoiceFilters) => [...INVOICE_KEYS.lists(), filters] as const,
  details: () => [...INVOICE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...INVOICE_KEYS.details(), id] as const,
  bySupplier: (supplierId: string) => [...INVOICE_KEYS.all, 'supplier', supplierId] as const,
};

const SUPPLIER_PAYMENT_KEYS = {
  all: ['supplier-payments'] as const,
  lists: () => [...SUPPLIER_PAYMENT_KEYS.all, 'list'] as const,
  list: (filters: SupplierPaymentFilters) => [...SUPPLIER_PAYMENT_KEYS.lists(), filters] as const,
  details: () => [...SUPPLIER_PAYMENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPPLIER_PAYMENT_KEYS.details(), id] as const,
  bySupplier: (supplierId: string) => [...SUPPLIER_PAYMENT_KEYS.all, 'supplier', supplierId] as const,
};

const SUPPLIER_METRICS_KEYS = {
  all: ['supplier-metrics'] as const,
  lists: () => [...SUPPLIER_METRICS_KEYS.all, 'list'] as const,
  list: (filters: SupplierMetricsFilters) => [...SUPPLIER_METRICS_KEYS.lists(), filters] as const,
  details: () => [...SUPPLIER_METRICS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPPLIER_METRICS_KEYS.details(), id] as const,
  bySupplier: (supplierId: string) => [...SUPPLIER_METRICS_KEYS.all, 'supplier', supplierId] as const,
};

const DASHBOARD_KEYS = {
  supplierSummary: ['supplier-dashboard-summary'] as const,
};

// Supplier Hooks
export function useSuppliers(filters: SupplierFilters = {}) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: SUPPLIER_KEYS.list(filters),
    queryFn: () => service.getAllSuppliers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSupplier(id: string) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: SUPPLIER_KEYS.detail(id),
    queryFn: () => service.getSupplierById(id),
    enabled: !!id,
  });
}

export function useSuppliersCount() {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: SUPPLIER_KEYS.count(),
    queryFn: () => service.getSuppliersCount(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: (input: CreateSupplierInput) => service.createSupplier(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSupplierInput }) =>
      service.updateSupplier(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      queryClient.setQueryData(SUPPLIER_KEYS.detail(data.id!), data);
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: (id: string) => service.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SUPPLIER_PAYMENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SUPPLIER_METRICS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

// Purchase Order Hooks
export function usePurchaseOrders(filters: PurchaseOrderFilters = {}) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: PURCHASE_ORDER_KEYS.list(filters),
    queryFn: () => service.getAllPurchaseOrders(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePurchaseOrder(id: string) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: PURCHASE_ORDER_KEYS.detail(id),
    queryFn: () => service.getPurchaseOrderById(id),
    enabled: !!id,
  });
}

export function usePurchaseOrdersBySupplier(supplierId: string) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: PURCHASE_ORDER_KEYS.bySupplier(supplierId),
    queryFn: () => service.getPurchaseOrdersBySupplierId(supplierId),
    enabled: !!supplierId,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: (input: CreatePurchaseOrderInput) => service.createPurchaseOrder(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.bySupplier(data.supplierId) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePurchaseOrderInput }) =>
      service.updatePurchaseOrder(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.all });
      queryClient.setQueryData(PURCHASE_ORDER_KEYS.detail(data.id!), data);
      queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.bySupplier(data.supplierId) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: (id: string) => service.deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

// Invoice Hooks
export function useInvoices(filters: InvoiceFilters = {}) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: INVOICE_KEYS.list(filters),
    queryFn: () => service.getAllInvoices(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInvoice(id: string) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: INVOICE_KEYS.detail(id),
    queryFn: () => service.getInvoiceById(id),
    enabled: !!id,
  });
}

export function useInvoicesBySupplier(supplierId: string) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: INVOICE_KEYS.bySupplier(supplierId),
    queryFn: () => service.getInvoicesBySupplierId(supplierId),
    enabled: !!supplierId,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: (input: CreateInvoiceInput) => service.createInvoice(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.bySupplier(data.supplierId) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInvoiceInput }) =>
      service.updateInvoice(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      queryClient.setQueryData(INVOICE_KEYS.detail(data.id!), data);
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.bySupplier(data.supplierId) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: (id: string) => service.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

// Supplier Payment Hooks
export function useSupplierPayments(filters: SupplierPaymentFilters = {}) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: SUPPLIER_PAYMENT_KEYS.list(filters),
    queryFn: () => service.getAllSupplierPayments(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupplierPayment(id: string) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: SUPPLIER_PAYMENT_KEYS.detail(id),
    queryFn: () => service.getSupplierPaymentById(id),
    enabled: !!id,
  });
}

export function useSupplierPaymentsBySupplier(supplierId: string) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: SUPPLIER_PAYMENT_KEYS.bySupplier(supplierId),
    queryFn: () => service.getSupplierPaymentsBySupplierId(supplierId),
    enabled: !!supplierId,
  });
}

export function useCreateSupplierPayment() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: (input: CreateSupplierPaymentInput) => service.createSupplierPayment(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_PAYMENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SUPPLIER_PAYMENT_KEYS.bySupplier(data.supplierId) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

export function useUpdateSupplierPayment() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSupplierPaymentInput }) =>
      service.updateSupplierPayment(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_PAYMENT_KEYS.all });
      queryClient.setQueryData(SUPPLIER_PAYMENT_KEYS.detail(data.id!), data);
      queryClient.invalidateQueries({ queryKey: SUPPLIER_PAYMENT_KEYS.bySupplier(data.supplierId) });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

export function useDeleteSupplierPayment() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: (id: string) => service.deleteSupplierPayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_PAYMENT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.supplierSummary });
    },
  });
}

// Supplier Metrics Hooks
export function useSupplierMetrics(filters: SupplierMetricsFilters = {}) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: SUPPLIER_METRICS_KEYS.list(filters),
    queryFn: () => service.getAllSupplierMetrics(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupplierMetricsBySupplier(supplierId: string) {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: SUPPLIER_METRICS_KEYS.bySupplier(supplierId),
    queryFn: () => service.getSupplierMetricsBySupplierId(supplierId),
    enabled: !!supplierId,
  });
}

export function useCreateSupplierMetrics() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: (input: CreateSupplierMetricsInput) => service.createSupplierMetrics(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_METRICS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SUPPLIER_METRICS_KEYS.bySupplier(data.supplierId) });
    },
  });
}

export function useUpdateSupplierMetrics() {
  const queryClient = useQueryClient();
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateSupplierMetricsInput }) =>
      service.updateSupplierMetrics(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SUPPLIER_METRICS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SUPPLIER_METRICS_KEYS.bySupplier(data.supplierId) });
    },
  });
}

// Dashboard Hooks
export function useSupplierDashboardSummary() {
  const storage = useStorage();
  const service = new SupplierManagementService(storage);

  return useQuery({
    queryKey: DASHBOARD_KEYS.supplierSummary,
    queryFn: () => service.getSupplierDashboardSummary(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
