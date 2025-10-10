import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Edit, 
  ArrowLeft, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Plus,
  Eye,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useClient, useContractsByClient, usePaymentsByClient, useUsageMetricsByClient, useNotificationsByClient } from '@/hooks/useClientManagement';
import { useTimeRegion } from '@/hooks/useTimeRegion';
import type { Contract, Payment, UsageMetrics, Notification } from '@/core/models/ClientManagement';

export function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'contracts' | 'billing' | 'metrics' | 'notifications'>('overview');

  const { data: client, isLoading: clientLoading } = useClient(id || '');
  const { data: contracts = [] } = useContractsByClient(id || '');
  const { data: payments = [] } = usePaymentsByClient(id || '');
  const { data: metrics = [] } = useUsageMetricsByClient(id || '');
  const { data: notifications = [] } = useNotificationsByClient(id || '');
  const { formatDate, formatCurrency, formatNumber } = useTimeRegion();

  if (clientLoading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <AlertCircle className="h-16 w-16 text-muted mb-3" />
          <h5 className="text-muted">Client not found</h5>
          <p className="text-muted">The client you're looking for doesn't exist.</p>
          <Link to="/clients" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4 me-1" />
            Back to Clients
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'success', icon: CheckCircle },
      inactive: { color: 'secondary', icon: Clock },
      suspended: { color: 'danger', icon: AlertCircle },
      pending: { color: 'warning', icon: Clock },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`badge bg-label-${config.color} text-${config.color}`}>
        <Icon className="h-3 w-3 me-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      basic: { color: 'info', label: 'Basic' },
      professional: { color: 'primary', label: 'Professional' },
      enterprise: { color: 'warning', label: 'Enterprise' },
      custom: { color: 'secondary', label: 'Custom' },
    };
    
    const config = tierConfig[tier as keyof typeof tierConfig];
    
    return (
      <span className={`badge bg-label-${config.color} text-${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'success', icon: CheckCircle },
      pending: { color: 'warning', icon: Clock },
      failed: { color: 'danger', icon: XCircle },
      refunded: { color: 'info', icon: ArrowLeft },
      cancelled: { color: 'secondary', icon: XCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`badge bg-label-${config.color} text-${config.color}`}>
        <Icon className="h-3 w-3 me-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const totalRevenue = payments
    .filter(payment => payment.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingPayments = payments.filter(payment => payment.status === 'pending').length;

  return (
    <div className="container-fluid details-page">
      {/* Page Header */}
      <PageHeader 
        title={client.name}
        subtitle={`${client.company} • ${client.email}`}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Clients', path: '/clients' },
          { label: client.name, active: true }
        ]}
      />

      {/* Client Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-lg me-3">
                      <span className="avatar-initial rounded bg-label-primary fs-4">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="mb-1">{client.name}</h4>
                      <p className="text-muted mb-2">{client.company}</p>
                      <div className="d-flex gap-2">
                        {getStatusBadge(client.status)}
                        {getTierBadge(client.tier)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="d-flex gap-2 justify-content-md-end">
                    <Link 
                      to={`/clients/${client.id}/edit`}
                      className="btn btn-outline-primary"
                    >
                      <Edit className="h-4 w-4 me-1" />
                      Edit Client
                    </Link>
                    <Link 
                      to="/clients"
                      className="btn btn-outline-secondary"
                    >
                      <ArrowLeft className="h-4 w-4 me-1" />
                      Back to Clients
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-success">
                    <FileText className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-success">{contracts.length}</h4>
                  <p className="text-muted mb-0">Contracts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-primary">
                    <DollarSign className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-primary">{formatCurrency(totalRevenue)}</h4>
                  <p className="text-muted mb-0">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-warning">
                    <Clock className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-warning">{pendingPayments}</h4>
                  <p className="text-muted mb-0">Pending Payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-info">
                    <Bell className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-info">{notifications.length}</h4>
                  <p className="text-muted mb-0">Notifications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pb-0">
              <ul className="nav nav-tabs nav-fill" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                    type="button"
                  >
                    <User className="h-4 w-4 me-2" />
                    Overview
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'contracts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('contracts')}
                    type="button"
                  >
                    <FileText className="h-4 w-4 me-2" />
                    Contracts ({contracts.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'billing' ? 'active' : ''}`}
                    onClick={() => setActiveTab('billing')}
                    type="button"
                  >
                    <CreditCard className="h-4 w-4 me-2" />
                    Billing ({payments.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'metrics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('metrics')}
                    type="button"
                  >
                    <BarChart3 className="h-4 w-4 me-2" />
                    Metrics ({metrics.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                    type="button"
                  >
                    <Bell className="h-4 w-4 me-2" />
                    Notifications ({notifications.length})
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="mb-3">Contact Information</h6>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <Mail className="h-4 w-4 text-muted me-2" />
                        <span className="fw-medium">Email:</span>
                      </div>
                      <p className="text-muted ms-4">{client.email}</p>
                    </div>
                    {client.phone && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <Phone className="h-4 w-4 text-muted me-2" />
                          <span className="fw-medium">Phone:</span>
                        </div>
                        <p className="text-muted ms-4">{client.phone}</p>
                      </div>
                    )}
                    {client.address && (
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <MapPin className="h-4 w-4 text-muted me-2" />
                          <span className="fw-medium">Address:</span>
                        </div>
                        <div className="text-muted ms-4">
                          {client.address.street && <div>{client.address.street}</div>}
                          {client.address.city && <div>{client.address.city}</div>}
                          {client.address.state && <div>{client.address.state}</div>}
                          {client.address.zipCode && <div>{client.address.zipCode}</div>}
                          {client.address.country && <div>{client.address.country}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6 className="mb-3">Account Information</h6>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <Calendar className="h-4 w-4 text-muted me-2" />
                        <span className="fw-medium">Created:</span>
                      </div>
                      <p className="text-muted ms-4">
                        {client.createdAt ? formatDate(client.createdAt) : 'N/A'}
                      </p>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <Building2 className="h-4 w-4 text-muted me-2" />
                        <span className="fw-medium">Company:</span>
                      </div>
                      <p className="text-muted ms-4">{client.company}</p>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <TrendingUp className="h-4 w-4 text-muted me-2" />
                        <span className="fw-medium">Tier:</span>
                      </div>
                      <div className="ms-4">{getTierBadge(client.tier)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contracts Tab */}
              {activeTab === 'contracts' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Contracts & Subscriptions</h6>
                    <button className="btn btn-primary btn-sm">
                      <Plus className="h-4 w-4 me-1" />
                      Add Contract
                    </button>
                  </div>
                  {contracts.length === 0 ? (
                    <div className="text-center py-4">
                      <FileText className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No contracts found</p>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="h-4 w-4 me-1" />
                        Create First Contract
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Contract</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Period</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contracts.map((contract) => (
                            <tr key={contract.id}>
                              <td>
                                <div>
                                  <h6 className="mb-0">{contract.name}</h6>
                                  <small className="text-muted">
                                    {contract.startDate ? formatDate(contract.startDate) : 'N/A'}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-label-info">
                                  {contract.type.charAt(0).toUpperCase() + contract.type.slice(1)}
                                </span>
                              </td>
                              <td>{getStatusBadge(contract.status)}</td>
                              <td>{formatCurrency(contract.amount)}</td>
                              <td>{contract.billingCycle}</td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Payment History</h6>
                    <button className="btn btn-primary btn-sm">
                      <Plus className="h-4 w-4 me-1" />
                      Record Payment
                    </button>
                  </div>
                  {payments.length === 0 ? (
                    <div className="text-center py-4">
                      <CreditCard className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No payments found</p>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="h-4 w-4 me-1" />
                        Record First Payment
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Payment</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Method</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment.id}>
                              <td>
                                <div>
                                  <h6 className="mb-0">{payment.description || 'Payment'}</h6>
                                  {payment.invoiceNumber && (
                                    <small className="text-muted">Invoice: {payment.invoiceNumber}</small>
                                  )}
                                </div>
                              </td>
                              <td>{formatCurrency(payment.amount)}</td>
                              <td>{getPaymentStatusBadge(payment.status)}</td>
                              <td>
                                <span className="badge bg-label-secondary">
                                  {payment.method.replace('_', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td>
                                {payment.paymentDate ? formatDate(payment.paymentDate) : 'N/A'}
                              </td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Metrics Tab */}
              {activeTab === 'metrics' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Usage Metrics</h6>
                    <button className="btn btn-primary btn-sm">
                      <Plus className="h-4 w-4 me-1" />
                      Add Metrics
                    </button>
                  </div>
                  {metrics.length === 0 ? (
                    <div className="text-center py-4">
                      <BarChart3 className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No metrics found</p>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="h-4 w-4 me-1" />
                        Add First Metrics
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Period</th>
                            <th>API Calls</th>
                            <th>Active Users</th>
                            <th>Storage Used</th>
                            <th>Bandwidth</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {metrics.map((metric) => (
                            <tr key={metric.id}>
                              <td>{metric.period}</td>
                              <td>{formatNumber(metric.apiCalls)}</td>
                              <td>{formatNumber(metric.activeUsers)}</td>
                              <td>{(metric.storageUsed / 1024).toFixed(2)} GB</td>
                              <td>{(metric.bandwidthUsed / 1024).toFixed(2)} GB</td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Notifications</h6>
                    <button className="btn btn-primary btn-sm">
                      <Plus className="h-4 w-4 me-1" />
                      Send Notification
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="text-center py-4">
                      <Bell className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No notifications found</p>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="h-4 w-4 me-1" />
                        Send First Notification
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Sent</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notifications.map((notification) => (
                            <tr key={notification.id}>
                              <td>
                                <div>
                                  <h6 className="mb-0">{notification.title}</h6>
                                  <small className="text-muted">{notification.message}</small>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-label-info">
                                  {notification.type.replace('_', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td>{getStatusBadge(notification.status)}</td>
                              <td>
                                <span className={`badge bg-label-${
                                  notification.priority === 'urgent' ? 'danger' :
                                  notification.priority === 'high' ? 'warning' :
                                  notification.priority === 'medium' ? 'info' : 'secondary'
                                }`}>
                                  {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)}
                                </span>
                              </td>
                              <td>
                                {notification.sentAt ? formatDate(notification.sentAt) : 'Not sent'}
                              </td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}