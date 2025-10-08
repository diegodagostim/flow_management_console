import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useSupplier, usePurchaseOrdersBySupplier, useInvoicesBySupplier, useSupplierPaymentsBySupplier, useSupplierMetricsBySupplier } from '@/hooks/useSupplierManagement';
import { useTimeRegion } from '@/hooks/useTimeRegion';
import {
  Edit,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  CreditCard,
  Star,
  FileText,
  DollarSign,
  Calendar,
  TrendingUp,
  Package,
  Receipt,
  BarChart3,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

export function SupplierDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: supplier, isLoading: supplierLoading } = useSupplier(id || '');
  const { data: purchaseOrders = [] } = usePurchaseOrdersBySupplier(id || '');
  const { data: invoices = [] } = useInvoicesBySupplier(id || '');
  const { data: payments = [] } = useSupplierPaymentsBySupplier(id || '');
  const { data: metrics = [] } = useSupplierMetricsBySupplier(id || '');
  const { formatDate, formatCurrency, formatNumber } = useTimeRegion();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'success', icon: CheckCircle },
      inactive: { color: 'secondary', icon: XCircle },
      suspended: { color: 'danger', icon: AlertCircle },
      pending: { color: 'warning', icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span className={`badge bg-label-${config.color}`}>
        <Icon className="h-3 w-3 me-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      manufacturer: { color: 'primary' },
      distributor: { color: 'info' },
      service_provider: { color: 'success' },
      consultant: { color: 'warning' },
      other: { color: 'secondary' },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;

    return (
      <span className={`badge bg-label-${config.color}`}>
        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  if (supplierLoading) {
    return (
      <div className="container-fluid">
        <PageHeader
          title="Supplier Details"
          subtitle="View supplier information and performance"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Suppliers', path: '/suppliers' },
            { label: 'Details', active: true }
          ]}
        />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading supplier data...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container-fluid">
        <PageHeader
          title="Supplier Details"
          subtitle="View supplier information and performance"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Suppliers', path: '/suppliers' },
            { label: 'Details', active: true }
          ]}
        />
        <div className="alert alert-danger">
          <AlertCircle className="h-4 w-4 me-2" />
          Supplier not found.
        </div>
      </div>
    );
  }

  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const averageOrderValue = purchaseOrders.length > 0
    ? purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0) / purchaseOrders.length
    : 0;

  const onTimeDeliveryRate = purchaseOrders.length > 0
    ? (purchaseOrders.filter(o => o.status === 'delivered' && o.actualDeliveryDate && o.expectedDeliveryDate && new Date(o.actualDeliveryDate) <= new Date(o.expectedDeliveryDate)).length / purchaseOrders.filter(o => o.status === 'delivered').length) * 100
    : 0;

  return (
    <div className="container-fluid details-page">
      <PageHeader
        title={supplier.name}
        subtitle={`${supplier.company} • ${getCategoryBadge(supplier.category)}`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Suppliers', path: '/suppliers' },
          { label: supplier.name, active: true }
        ]}
      />

      {/* Supplier Header */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-lg me-3">
                  <span className="avatar-initial rounded bg-label-primary fs-4">
                    {supplier.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="mb-1">{supplier.name}</h4>
                  <p className="text-muted mb-2">{supplier.company}</p>
                  <div className="d-flex align-items-center gap-3">
                    {getStatusBadge(supplier.status)}
                    {supplier.rating && (
                      <div className="d-flex align-items-center">
                        <Star className="h-4 w-4 text-warning me-1" />
                        <span className="fw-medium">{supplier.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex gap-2 justify-content-end">
                <Link to={`/suppliers/${supplier.id}/edit`} className="btn btn-outline-primary">
                  <Edit className="h-4 w-4 me-1" />
                  Edit
                </Link>
                <Link to={`/suppliers/${supplier.id}/orders/new`} className="btn btn-primary">
                  <Plus className="h-4 w-4 me-1" />
                  New Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-primary">
                  <Package className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-primary">{purchaseOrders.length}</h4>
              <p className="text-muted mb-0 small">Purchase Orders</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-success">
                  <Receipt className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-success">{invoices.length}</h4>
              <p className="text-muted mb-0 small">Invoices</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-info">
                  <DollarSign className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-info">{formatCurrency(totalSpent)}</h4>
              <p className="text-muted mb-0 small">Total Spent</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-warning">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-warning">{onTimeDeliveryRate.toFixed(0)}%</h4>
              <p className="text-muted mb-0 small">On-Time Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-header">
          <ul className="nav nav-tabs card-header-tabs" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Building2 className="h-4 w-4 me-1" />
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package className="h-4 w-4 me-1" />
                Purchase Orders ({purchaseOrders.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'invoices' ? 'active' : ''}`}
                onClick={() => setActiveTab('invoices')}
              >
                <Receipt className="h-4 w-4 me-1" />
                Invoices ({invoices.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                <DollarSign className="h-4 w-4 me-1" />
                Payments ({payments.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'metrics' ? 'active' : ''}`}
                onClick={() => setActiveTab('metrics')}
              >
                <BarChart3 className="h-4 w-4 me-1" />
                Performance
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="row">
              <div className="col-lg-6">
                <h6 className="mb-3">Contact Information</h6>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <Mail className="h-4 w-4 me-2 text-muted" />
                    <span>{supplier.email}</span>
                  </div>
                  {supplier.phone && (
                    <div className="d-flex align-items-center mb-2">
                      <Phone className="h-4 w-4 me-2 text-muted" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.website && (
                    <div className="d-flex align-items-center mb-2">
                      <Globe className="h-4 w-4 me-2 text-muted" />
                      <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                        {supplier.website}
                        <ArrowUpRight className="h-3 w-3 ms-1" />
                      </a>
                    </div>
                  )}
                  {supplier.contactPerson && (
                    <div className="d-flex align-items-center mb-2">
                      <User className="h-4 w-4 me-2 text-muted" />
                      <span>{supplier.contactPerson}</span>
                    </div>
                  )}
                </div>

                {supplier.address && (
                  <>
                    <h6 className="mb-3">Address</h6>
                    <div className="d-flex align-items-start mb-2">
                      <MapPin className="h-4 w-4 me-2 text-muted mt-1" />
                      <div>
                        <div>{supplier.address}</div>
                        {supplier.city && <div>{supplier.city}</div>}
                        {supplier.state && <div>{supplier.state}</div>}
                        {supplier.postalCode && <div>{supplier.postalCode}</div>}
                        {supplier.country && <div>{supplier.country}</div>}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="col-lg-6">
                <h6 className="mb-3">Business Information</h6>
                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small text-muted">Status</label>
                    <div>{getStatusBadge(supplier.status)}</div>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small text-muted">Category</label>
                    <div>{getCategoryBadge(supplier.category)}</div>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small text-muted">Payment Terms</label>
                    <div className="badge bg-label-info">
                      {supplier.paymentTerms.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small text-muted">Currency</label>
                    <div className="badge bg-label-secondary">{supplier.currency}</div>
                  </div>
                  {supplier.taxId && (
                    <div className="col-12 mb-3">
                      <label className="form-label small text-muted">Tax ID</label>
                      <div>{supplier.taxId}</div>
                    </div>
                  )}
                </div>

                {supplier.notes && (
                  <>
                    <h6 className="mb-3">Notes</h6>
                    <p className="text-muted">{supplier.notes}</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Purchase Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Purchase Orders</h6>
                <Link to={`/suppliers/${supplier.id}/orders/new`} className="btn btn-sm btn-primary">
                  <Plus className="h-4 w-4 me-1" />
                  New Order
                </Link>
              </div>
              {purchaseOrders.length === 0 ? (
                <div className="text-center py-4">
                  <Package className="h-12 w-12 text-muted mb-3" />
                  <h6 className="text-muted">No purchase orders</h6>
                  <p className="text-muted mb-3">Create your first purchase order for this supplier.</p>
                  <Link to={`/suppliers/${supplier.id}/orders/new`} className="btn btn-primary">
                    <Plus className="h-4 w-4 me-1" />
                    Create Order
                  </Link>
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
                        <th>Total Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <div className="fw-medium">{order.poNumber}</div>
                            <small className="text-muted">{order.priority}</small>
                          </td>
                          <td>{formatDate(order.orderDate)}</td>
                          <td>
                            {order.expectedDeliveryDate
                              ? formatDate(order.expectedDeliveryDate)
                              : 'Not set'}
                          </td>
                          <td>
                            <span className={`badge bg-label-${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                          <td>
                            <Link
                              to={`/suppliers/${supplier.id}/orders/${order.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Invoices</h6>
                <Link to={`/suppliers/${supplier.id}/invoices/new`} className="btn btn-sm btn-primary">
                  <Plus className="h-4 w-4 me-1" />
                  New Invoice
                </Link>
              </div>
              {invoices.length === 0 ? (
                <div className="text-center py-4">
                  <Receipt className="h-12 w-12 text-muted mb-3" />
                  <h6 className="text-muted">No invoices</h6>
                  <p className="text-muted mb-3">No invoices have been created for this supplier yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Invoice Number</th>
                        <th>Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="fw-medium">{invoice.invoiceNumber}</td>
                          <td>{formatDate(invoice.invoiceDate)}</td>
                          <td>{formatDate(invoice.dueDate)}</td>
                          <td>
                            <span className={`badge bg-label-${invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'danger' : 'warning'}`}>
                              {invoice.status.toUpperCase()}
                            </span>
                          </td>
                          <td>{formatCurrency(invoice.totalAmount)}</td>
                          <td>
                            <Link
                              to={`/suppliers/${supplier.id}/invoices/${invoice.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Payments</h6>
                <Link to={`/suppliers/${supplier.id}/payments/new`} className="btn btn-sm btn-primary">
                  <Plus className="h-4 w-4 me-1" />
                  New Payment
                </Link>
              </div>
              {payments.length === 0 ? (
                <div className="text-center py-4">
                  <DollarSign className="h-12 w-12 text-muted mb-3" />
                  <h6 className="text-muted">No payments</h6>
                  <p className="text-muted mb-3">No payments have been recorded for this supplier yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Payment Date</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Reference</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{formatDate(payment.paymentDate)}</td>
                          <td>{formatCurrency(payment.amount)}</td>
                          <td>
                            <span className="badge bg-label-info">
                              {payment.method.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span className={`badge bg-label-${payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'danger' : 'warning'}`}>
                              {payment.status.toUpperCase()}
                            </span>
                          </td>
                          <td>{payment.reference || '-'}</td>
                          <td>
                            <Link
                              to={`/suppliers/${supplier.id}/payments/${payment.id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Performance Metrics Tab */}
          {activeTab === 'metrics' && (
            <div>
              <h6 className="mb-3">Performance Metrics</h6>
              {metrics.length === 0 ? (
                <div className="text-center py-4">
                  <BarChart3 className="h-12 w-12 text-muted mb-3" />
                  <h6 className="text-muted">No performance data</h6>
                  <p className="text-muted mb-3">Performance metrics will appear here as data is collected.</p>
                </div>
              ) : (
                <div className="row">
                  {metrics.map((metric) => (
                    <div key={metric.id} className="col-md-6 mb-3">
                      <div className="card border">
                        <div className="card-body">
                          <h6 className="card-title">{formatDate(metric.period)}</h6>
                          <div className="row text-center">
                            <div className="col-4">
                              <div className="fw-bold text-primary">{metric.totalOrders}</div>
                              <small className="text-muted">Orders</small>
                            </div>
                            <div className="col-4">
                              <div className="fw-bold text-success">{metric.onTimeDeliveries}</div>
                              <small className="text-muted">On-Time</small>
                            </div>
                            <div className="col-4">
                              <div className="fw-bold text-info">{formatCurrency(metric.totalSpent)}</div>
                              <small className="text-muted">Spent</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
