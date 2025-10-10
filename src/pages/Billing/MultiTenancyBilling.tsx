import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Crown,
  Gem,
  Gift,
  DollarSign,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useTimeRegion } from '@/hooks/useTimeRegion';

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'monthly' | 'yearly'
  features: string[]
  limits: {
    clients: number
    suppliers: number
    invoices: number
    storage: number // in MB
    apiCalls: number
  }
  popular?: boolean
  icon: any
  color: string
}

interface Tenant {
  id: string
  name: string
  email: string
  plan: string
  status: 'active' | 'trial' | 'suspended' | 'cancelled'
  trialEndsAt: string | null
  subscriptionId: string | null
  paymentMethod: string
  createdAt: string
  lastBillingDate: string | null
  nextBillingDate: string | null
  usage: {
    clients: number
    suppliers: number
    invoices: number
    storage: number
    apiCalls: number
  }
  limits: {
    clients: number
    suppliers: number
    invoices: number
    storage: number
    apiCalls: number
  }
}

interface BillingTransaction {
  id: string
  tenantId: string
  tenantName?: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  type: 'subscription' | 'usage' | 'upgrade' | 'trial'
  description: string
  createdAt: string
  paymentMethod: string
  invoiceId?: string
}

export function MultiTenancyBilling() {
  const { formatCurrency, formatNumber } = useTimeRegion()
  const [activeTab, setActiveTab] = useState<'tenants' | 'plans' | 'transactions' | 'analytics'>('tenants')
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [transactions, setTransactions] = useState<BillingTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showTenantModal, setShowTenantModal] = useState(false)

  // Initialize empty state
  useEffect(() => {
    setPlans([])
    setTenants([])
    setTransactions([])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'trial': return 'warning'
      case 'suspended': return 'danger'
      case 'cancelled': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'trial': return Clock
      case 'suspended': return AlertCircle
      case 'cancelled': return AlertCircle
      default: return Clock
    }
  }

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'pending': return 'warning'
      case 'failed': return 'danger'
      case 'refunded': return 'info'
      default: return 'secondary'
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return Gift
      case 'starter': return Star
      case 'professional': return Crown
      case 'enterprise': return Gem
      default: return Star
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'secondary'
      case 'starter': return 'primary'
      case 'professional': return 'warning'
      case 'enterprise': return 'danger'
      default: return 'primary'
    }
  }

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const activeTenants = tenants.filter(t => t.status === 'active').length
  const trialTenants = tenants.filter(t => t.status === 'trial').length
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length

  return (
    <div className="container-fluid billing-page">
      {/* Page Header */}
      <PageHeader 
        title="Multi-Tenancy Billing"
        subtitle="Manage subscription plans, tenants, and billing transactions"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Billing', active: true }
        ]}
      />

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-success">
                  <Users className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-success">{activeTenants}</h4>
              <p className="text-muted mb-0 small">Active Tenants</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-warning">
                  <Clock className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-warning">{trialTenants}</h4>
              <p className="text-muted mb-0 small">Trial Tenants</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-primary">
                  <DollarSign className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-primary">{formatCurrency(totalRevenue)}</h4>
              <p className="text-muted mb-0 small">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-info">
                  <CreditCard className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-info">{pendingTransactions}</h4>
              <p className="text-muted mb-0 small">Pending Payments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pb-0">
              <ul className="nav nav-tabs nav-fill" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'tenants' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tenants')}
                    type="button"
                  >
                    <Users className="h-4 w-4 me-2" />
                    Tenants ({tenants.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'plans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plans')}
                    type="button"
                  >
                    <Star className="h-4 w-4 me-2" />
                    Plans ({plans.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                    type="button"
                  >
                    <CreditCard className="h-4 w-4 me-2" />
                    Transactions ({transactions.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                    type="button"
                  >
                    <BarChart3 className="h-4 w-4 me-2" />
                    Analytics
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {/* Tenants Tab */}
              {activeTab === 'tenants' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Tenants</h6>
                    <button className="btn btn-primary btn-sm">
                      <Plus className="h-4 w-4 me-1" />
                      Add Tenant
                    </button>
                  </div>
                  {tenants.length === 0 ? (
                    <div className="text-center py-5">
                      <Users className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No tenants found</p>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="h-4 w-4 me-1" />
                        Add First Tenant
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Tenant</th>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Usage</th>
                            <th>Next Billing</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tenants.map((tenant) => {
                            const StatusIcon = getStatusIcon(tenant.status)
                            const PlanIcon = getPlanIcon(tenant.plan)
                            return (
                              <tr key={tenant.id}>
                                <td>
                                  <div>
                                    <h6 className="mb-0">{tenant.name}</h6>
                                    <small className="text-muted">{tenant.email}</small>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <PlanIcon className={`h-4 w-4 me-2 text-${getPlanColor(tenant.plan)}`} />
                                    <span className="text-capitalize">{tenant.plan}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge bg-label-${getStatusColor(tenant.status)}`}>
                                    <StatusIcon className="h-3 w-3 me-1" />
                                    {tenant.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="small">
                                    <div>{tenant.usage.clients}/{tenant.limits.clients === -1 ? '∞' : tenant.limits.clients} clients</div>
                                    <div>{tenant.usage.suppliers}/{tenant.limits.suppliers === -1 ? '∞' : tenant.limits.suppliers} suppliers</div>
                                  </div>
                                </td>
                                <td>
                                  {tenant.nextBillingDate ? (
                                    <small>{new Date(tenant.nextBillingDate).toLocaleDateString()}</small>
                                  ) : (
                                    <small className="text-muted">N/A</small>
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <button className="btn btn-sm btn-outline-primary">
                                      <Eye className="h-3 w-3" />
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary">
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger">
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Plans Tab */}
              {activeTab === 'plans' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Subscription Plans</h6>
                    <button className="btn btn-primary btn-sm">
                      <Plus className="h-4 w-4 me-1" />
                      Add Plan
                    </button>
                  </div>
                  {plans.length === 0 ? (
                    <div className="text-center py-5">
                      <Star className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No subscription plans found</p>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="h-4 w-4 me-1" />
                        Add First Plan
                      </button>
                    </div>
                  ) : (
                    <div className="row">
                      {plans.map((plan) => {
                        const PlanIcon = plan.icon
                        return (
                          <div key={plan.id} className="col-md-6 col-lg-3 mb-4">
                            <div className={`card border h-100 ${plan.popular ? 'border-primary' : ''}`}>
                              {plan.popular && (
                                <div className="card-header bg-primary text-white text-center">
                                  <small className="fw-semibold">Most Popular</small>
                                </div>
                              )}
                              <div className="card-body text-center">
                                <PlanIcon className={`h-8 w-8 mx-auto mb-3 text-${plan.color}`} />
                                <h5 className="card-title">{plan.name}</h5>
                                <p className="text-muted small mb-3">{plan.description}</p>
                                <div className="mb-3">
                                  <span className="h4 text-primary">{formatCurrency(plan.price)}</span>
                                  <small className="text-muted">/{plan.interval}</small>
                                </div>
                                <ul className="list-unstyled small mb-3">
                                  {plan.features.slice(0, 3).map((feature, index) => (
                                    <li key={index} className="mb-1">
                                      <CheckCircle className="h-3 w-3 me-1 text-success" />
                                      {feature}
                                    </li>
                                  ))}
                                  {plan.features.length > 3 && (
                                    <li className="text-muted">+{plan.features.length - 3} more features</li>
                                  )}
                                </ul>
                                <button className="btn btn-outline-primary w-100">
                                  Choose Plan
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Billing Transactions</h6>
                    <button className="btn btn-primary btn-sm">
                      <Plus className="h-4 w-4 me-1" />
                      Add Transaction
                    </button>
                  </div>
                  {transactions.length === 0 ? (
                    <div className="text-center py-5">
                      <CreditCard className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No transactions found</p>
                      <button className="btn btn-primary btn-sm">
                        <Plus className="h-4 w-4 me-1" />
                        Add First Transaction
                      </button>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Transaction</th>
                            <th>Tenant</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                              <td>
                                <div>
                                  <h6 className="mb-0">{transaction.description}</h6>
                                  <small className="text-muted">{transaction.type}</small>
                                </div>
                              </td>
                              <td>
                                <span>{transaction.tenantName || `Tenant ${transaction.tenantId}`}</span>
                              </td>
                              <td>
                                <span className="fw-semibold">{formatCurrency(transaction.amount)}</span>
                              </td>
                              <td>
                                <span className={`badge bg-label-${getTransactionStatusColor(transaction.status)}`}>
                                  {transaction.status}
                                </span>
                              </td>
                              <td>
                                <small>{new Date(transaction.createdAt).toLocaleDateString()}</small>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <button className="btn btn-sm btn-outline-primary">
                                    <Eye className="h-3 w-3" />
                                  </button>
                                  <button className="btn btn-sm btn-outline-secondary">
                                    <Edit className="h-3 w-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div>
                  <h6 className="mb-3">Billing Analytics</h6>
                  <div className="text-center py-5">
                    <BarChart3 className="h-12 w-12 text-muted mb-2" />
                    <p className="text-muted">Analytics will be available when you have billing data</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

