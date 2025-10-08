import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/navigation/PageHeader';
import { usePurchaseOrdersBySupplier, useCreatePurchaseOrder, useUpdatePurchaseOrder, useDeletePurchaseOrder } from '@/hooks/useSupplierManagement';
import { useTimeRegion } from '@/hooks/useTimeRegion';
import type { CreatePurchaseOrderInput, UpdatePurchaseOrderInput } from '@/core/models/SupplierManagement';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  Calendar,
  DollarSign,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Truck,
  FileText,
  User
} from 'lucide-react';

export function PurchaseOrderManagement() {
  const { id: supplierId } = useParams<{ id: string }>();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const { settings } = useTimeRegion();
  const [formData, setFormData] = useState<CreatePurchaseOrderInput>({
    supplierId: supplierId || '',
    poNumber: '',
    orderDate: new Date().toISOString(),
    expectedDeliveryDate: '',
    status: 'draft',
    priority: 'medium',
    totalAmount: 0,
    currency: settings.currency,
    shippingAddress: '',
    billingAddress: '',
    terms: '',
    notes: '',
    items: [],
  });

  const { data: purchaseOrders = [], isLoading } = usePurchaseOrdersBySupplier(supplierId || '');
  const createOrderMutation = useCreatePurchaseOrder();
  const updateOrderMutation = useUpdatePurchaseOrder();
  const deleteOrderMutation = useDeletePurchaseOrder();
  const { formatDate, formatCurrency } = useTimeRegion();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'secondary', icon: FileText },
      sent: { color: 'info', icon: Clock },
      confirmed: { color: 'primary', icon: CheckCircle },
      in_transit: { color: 'warning', icon: Truck },
      delivered: { color: 'success', icon: CheckCircle },
      cancelled: { color: 'danger', icon: XCircle },
      returned: { color: 'danger', icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`badge bg-label-${config.color}`}>
        <Icon className="h-3 w-3 me-1" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'success' },
      medium: { color: 'warning' },
      high: { color: 'danger' },
      urgent: { color: 'danger' },
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return (
      <span className={`badge bg-label-${config.color}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrderMutation.mutateAsync(formData);
      setShowCreateForm(false);
      setFormData({
        supplierId: supplierId || '',
        poNumber: '',
        orderDate: new Date().toISOString(),
        expectedDeliveryDate: '',
        status: 'draft',
        priority: 'medium',
        totalAmount: 0,
        currency: settings.currency,
        shippingAddress: '',
        billingAddress: '',
        terms: '',
        notes: '',
        items: [],
      });
    } catch (error) {
      console.error('Failed to create purchase order:', error);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      await updateOrderMutation.mutateAsync({
        id: editingOrder,
        input: formData as UpdatePurchaseOrderInput,
      });
      setEditingOrder(null);
    } catch (error) {
      console.error('Failed to update purchase order:', error);
    }
  };

  const handleDeleteOrder = async (id: string, poNumber: string) => {
    if (window.confirm(`Are you sure you want to delete purchase order "${poNumber}"? This action cannot be undone.`)) {
      try {
        await deleteOrderMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete purchase order:', error);
      }
    }
  };

  const handleEditOrder = (order: any) => {
    setFormData({
      supplierId: order.supplierId,
      poNumber: order.poNumber,
      orderDate: order.orderDate,
      expectedDeliveryDate: order.expectedDeliveryDate || '',
      status: order.status,
      priority: order.priority,
      totalAmount: order.totalAmount,
      currency: order.currency,
      shippingAddress: order.shippingAddress || '',
      billingAddress: order.billingAddress || '',
      terms: order.terms || '',
      notes: order.notes || '',
      items: order.items || [],
    });
    setEditingOrder(order.id);
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <PageHeader
          title="Purchase Orders"
          subtitle="Manage purchase orders for this supplier"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Suppliers', path: '/suppliers' },
            { label: 'Purchase Orders', active: true }
          ]}
        />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading purchase orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage purchase orders for this supplier"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Suppliers', path: '/suppliers' },
          { label: 'Purchase Orders', active: true }
        ]}
      />

      {/* Actions */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Purchase Orders ({purchaseOrders.length})</h6>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 me-1" />
              New Purchase Order
            </button>
          </div>
        </div>
      </div>

      {/* Purchase Orders List */}
      <div className="card">
        <div className="card-body p-0">
          {purchaseOrders.length === 0 ? (
            <div className="text-center py-5">
              <Package className="h-12 w-12 text-muted mb-3" />
              <h6 className="text-muted">No purchase orders</h6>
              <p className="text-muted mb-3">Create your first purchase order for this supplier.</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 me-1" />
                Create First Order
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>PO Number</th>
                    <th>Order Date</th>
                    <th>Expected Delivery</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Total Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <div className="fw-medium">{order.poNumber}</div>
                        <small className="text-muted">{order.items?.length || 0} items</small>
                      </td>
                      <td>{formatDate(order.orderDate)}</td>
                      <td>
                        {order.expectedDeliveryDate
                          ? formatDate(order.expectedDeliveryDate)
                          : 'Not set'}
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{getPriorityBadge(order.priority)}</td>
                      <td>{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit className="h-4 w-4 me-2" />
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDeleteOrder(order.id!, order.poNumber)}
                                disabled={deleteOrderMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 me-2" />
                                Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateForm || editingOrder) && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingOrder ? 'Edit Purchase Order' : 'Create Purchase Order'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingOrder(null);
                  }}
                ></button>
              </div>
              <form onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">PO Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.poNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, poNumber: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Order Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.orderDate.split('T')[0]}
                        onChange={(e) => setFormData(prev => ({ ...prev, orderDate: e.target.value + 'T00:00:00' }))}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Expected Delivery Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.expectedDeliveryDate ? formData.expectedDeliveryDate.split('T')[0] : ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, expectedDeliveryDate: e.target.value ? e.target.value + 'T00:00:00' : '' }))}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Currency</label>
                      <select
                        className="form-select"
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Shipping Address</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.shippingAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingOrder(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={createOrderMutation.isPending || updateOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending || updateOrderMutation.isPending
                      ? 'Saving...'
                      : editingOrder
                      ? 'Update Order'
                      : 'Create Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
