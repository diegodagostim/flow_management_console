import { useState, useEffect } from 'react'
import { 
  CreditCard as CreditCardIcon, 
  Users, 
  Building2, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Target,
  Lightbulb,
  RefreshCw,
  Eye,
  Download,
  Filter,
  Settings,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Shield,
  Clock,
  Star,
  Crown,
  Gem,
  Award,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  PlayCircle,
  PauseCircle
} from 'lucide-react'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useTimeRegion } from '@/hooks/useTimeRegion'

interface Tenant {
  id: string
  name: string
  email: string
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'trial' | 'suspended' | 'cancelled'
  trialEndsAt: string | null
  subscriptionId: string | null
  paymentMethod: 'stripe' | 'paypal' | 'none'
  createdAt: string
  lastBillingDate: string | null
  nextBillingDate: string | null
  usage: {
    clients: number
    suppliers: number
    invoices: number
    storage: number // in MB
    apiCalls: number
  }
  limits: {
    clients: number
    suppliers: number
    invoices: number
    storage: number // in MB
    apiCalls: number
  }
}

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
    storage: number
    apiCalls: number
  }
  popular?: boolean
  icon: any
  color: string
}

interface BillingTransaction {
  id: string
  tenantId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  type: 'subscription' | 'usage' | 'upgrade' | 'refund'
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

  // Mock data generation
  useEffect(() => {
    generateMockData()
  }, [])

  const generateMockData = () => {
    // Generate subscription plans
    const mockPlans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'Free',
        description: 'Perfect for getting started',
        price: 0,
        interval: 'monthly',
        features: [
          'Up to 5 clients',
          'Up to 3 suppliers',
          'Basic reporting',
          'Email support',
          '1GB storage'
        ],
        limits: {
          clients: 5,
          suppliers: 3,
          invoices: 50,
          storage: 1024,
          apiCalls: 1000
        },
        icon: Gift,
        color: 'secondary'
      },
      {
        id: 'starter',
        name: 'Starter',
        description: 'Great for small businesses',
        price: 29,
        interval: 'monthly',
        features: [
          'Up to 25 clients',
          'Up to 15 suppliers',
          'Advanced reporting',
          'Priority support',
          '10GB storage',
          'API access'
        ],
        limits: {
          clients: 25,
          suppliers: 15,
          invoices: 500,
          storage: 10240,
          apiCalls: 10000
        },
        icon: Star,
        color: 'primary'
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'For growing businesses',
        price: 79,
        interval: 'monthly',
        features: [
          'Up to 100 clients',
          'Up to 50 suppliers',
          'Advanced analytics',
          'Phone support',
          '50GB storage',
          'Full API access',
          'Custom integrations'
        ],
        limits: {
          clients: 100,
          suppliers: 50,
          invoices: 2000,
          storage: 51200,
          apiCalls: 50000
        },
        popular: true,
        icon: Crown,
        color: 'warning'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large organizations',
        price: 199,
        interval: 'monthly',
        features: [
          'Unlimited clients',
          'Unlimited suppliers',
          'Custom analytics',
          'Dedicated support',
          'Unlimited storage',
          'Full API access',
          'Custom integrations',
          'White-label options'
        ],
        limits: {
          clients: -1, // unlimited
          suppliers: -1,
          invoices: -1,
          storage: -1,
          apiCalls: -1
        },
        icon: Gem,
        color: 'danger'
      }
    ]

    // Generate tenants
    const mockTenants: Tenant[] = [
      {
        id: '1',
        name: 'Acme Corporation',
        email: 'admin@acme.com',
        plan: 'professional',
        status: 'active',
        trialEndsAt: null,
        subscriptionId: 'sub_1234567890',
        paymentMethod: 'stripe',
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        lastBillingDate: new Date(Date.now() - 86400000 * 15).toISOString(),
        nextBillingDate: new Date(Date.now() + 86400000 * 15).toISOString(),
        usage: {
          clients: 45,
          suppliers: 23,
          invoices: 156,
          storage: 12500,
          apiCalls: 12500
        },
        limits: {
          clients: 100,
          suppliers: 50,
          invoices: 2000,
          storage: 51200,
          apiCalls: 50000
        }
      },
      {
        id: '2',
        name: 'TechStart Inc',
        email: 'billing@techstart.com',
        plan: 'starter',
        status: 'trial',
        trialEndsAt: new Date(Date.now() + 86400000 * 7).toISOString(),
        subscriptionId: null,
        paymentMethod: 'none',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        lastBillingDate: null,
        nextBillingDate: null,
        usage: {
          clients: 8,
          suppliers: 5,
          invoices: 23,
          storage: 450,
          apiCalls: 850
        },
        limits: {
          clients: 25,
          suppliers: 15,
          invoices: 500,
          storage: 10240,
          apiCalls: 10000
        }
      },
      {
        id: '3',
        name: 'Global Enterprises',
        email: 'finance@global.com',
        plan: 'enterprise',
        status: 'active',
        trialEndsAt: null,
        subscriptionId: 'sub_0987654321',
        paymentMethod: 'paypal',
        createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
        lastBillingDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        nextBillingDate: new Date(Date.now() + 86400000 * 25).toISOString(),
        usage: {
          clients: 250,
          suppliers: 120,
          invoices: 1250,
          storage: 45000,
          apiCalls: 45000
        },
        limits: {
          clients: -1,
          suppliers: -1,
          invoices: -1,
          storage: -1,
          apiCalls: -1
        }
      },
      {
        id: '4',
        name: 'Small Business Co',
        email: 'owner@smallbiz.com',
        plan: 'free',
        status: 'active',
        trialEndsAt: null,
        subscriptionId: null,
        paymentMethod: 'none',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        lastBillingDate: null,
        nextBillingDate: null,
        usage: {
          clients: 3,
          suppliers: 2,
          invoices: 12,
          storage: 150,
          apiCalls: 200
        },
        limits: {
          clients: 5,
          suppliers: 3,
          invoices: 50,
          storage: 1024,
          apiCalls: 1000
        }
      }
    ]

    // Generate transactions
    const mockTransactions: BillingTransaction[] = [
      {
        id: '1',
        tenantId: '1',
        amount: 79,
        currency: 'USD',
        status: 'completed',
        type: 'subscription',
        description: 'Professional Plan - Monthly',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        paymentMethod: 'stripe',
        invoiceId: 'inv_123456'
      },
      {
        id: '2',
        tenantId: '3',
        amount: 199,
        currency: 'USD',
        status: 'completed',
        type: 'subscription',
        description: 'Enterprise Plan - Monthly',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        paymentMethod: 'paypal',
        invoiceId: 'inv_789012'
      },
      {
        id: '3',
        tenantId: '1',
        amount: 15,
        currency: 'USD',
        status: 'completed',
        type: 'usage',
        description: 'Overage - API Calls (5,000 calls)',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        paymentMethod: 'stripe',
        invoiceId: 'inv_345678'
      },
      {
        id: '4',
        tenantId: '2',
        amount: 29,
        currency: 'USD',
        status: 'pending',
        type: 'upgrade',
        description: 'Upgrade to Starter Plan',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        paymentMethod: 'stripe'
      }
    ]

    setPlans(mockPlans)
    setTenants(mockTenants)
    setTransactions(mockTransactions)
  }

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
      case 'active': return <CheckCircle className="h-4 w-4 text-success" />
      case 'trial': return <Clock className="h-4 w-4 text-warning" />
      case 'suspended': return <XCircle className="h-4 w-4 text-danger" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-secondary" />
      default: return <AlertTriangle className="h-4 w-4 text-secondary" />
    }
  }

  const getPlanIcon = (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    return plan ? plan.icon : Star
  }

  const getPlanColor = (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    return plan ? plan.color : 'primary'
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // unlimited
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'danger'
    if (percentage >= 75) return 'warning'
    return 'success'
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

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription': return <CreditCardIcon className="h-4 w-4" />
      case 'usage': return <Activity className="h-4 w-4" />
      case 'upgrade': return <TrendingUp className="h-4 w-4" />
      case 'refund': return <TrendingDown className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  const handlePlanChange = (tenantId: string, newPlan: string) => {
    setTenants(prev => prev.map(tenant => 
      tenant.id === tenantId 
        ? { ...tenant, plan: newPlan as any }
        : tenant
    ))
  }

  const handleStatusChange = (tenantId: string, newStatus: string) => {
    setTenants(prev => prev.map(tenant => 
      tenant.id === tenantId 
        ? { ...tenant, status: newStatus as any }
        : tenant
    ))
  }

  return (
    <div className="container-fluid billing-page">
      <PageHeader 
        title="Multi-Tenancy Billing"
        subtitle="Manage tenant subscriptions, billing, and usage across all clients"
      />

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-lg">
            <div className="card-header border-0 px-0 pt-4 pb-0">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${activeTab === 'tenants' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tenants')}
                  >
                    <Users className="h-4 w-4 me-2" />
                    Tenants
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${activeTab === 'plans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plans')}
                  >
                    <Crown className="h-4 w-4 me-2" />
                    Plans & Pricing
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                  >
                    <CreditCardIcon className="h-4 w-4 me-2" />
                    Transactions
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
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
                <div className="tenants-management">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="mb-1">Tenant Management</h5>
                      <p className="text-muted small mb-0">Manage client subscriptions, usage, and billing</p>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm">
                        <Filter className="h-4 w-4 me-1" />
                        Filter
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        <Download className="h-4 w-4 me-1" />
                        Export
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => setShowTenantModal(true)}>
                        <Plus className="h-4 w-4 me-1" />
                        Add Tenant
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Tenant</th>
                          <th>Plan</th>
                          <th>Status</th>
                          <th>Usage</th>
                          <th>Billing</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tenants.map((tenant) => {
                          const PlanIcon = getPlanIcon(tenant.plan)
                          const planColor = getPlanColor(tenant.plan)
                          const currentPlan = plans.find(p => p.id === tenant.plan)
                          
                          return (
                            <tr key={tenant.id}>
                              <td>
                                <div>
                                  <div className="fw-medium">{tenant.name}</div>
                                  <small className="text-muted">{tenant.email}</small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <PlanIcon className={`h-4 w-4 me-2 text-${planColor}`} />
                                  <span className={`badge bg-${planColor}`}>
                                    {tenant.plan.toUpperCase()}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {getStatusIcon(tenant.status)}
                                  <span className={`badge bg-${getStatusColor(tenant.status)} ms-2`}>
                                    {tenant.status.toUpperCase()}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="small">
                                  <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Clients:</span>
                                    <span className="fw-medium">
                                      {tenant.usage.clients}/{tenant.limits.clients === -1 ? '∞' : tenant.limits.clients}
                                    </span>
                                  </div>
                                  <div className="progress" style={{ height: '3px' }}>
                                    <div 
                                      className={`progress-bar bg-${getUsageColor(getUsagePercentage(tenant.usage.clients, tenant.limits.clients))}`}
                                      style={{ width: `${getUsagePercentage(tenant.usage.clients, tenant.limits.clients)}%` }}
                                    ></div>
                                  </div>
                                  <div className="d-flex justify-content-between mt-1">
                                    <span className="text-muted">Storage:</span>
                                    <span className="fw-medium">
                                      {Math.round(tenant.usage.storage / 1024)}GB/{tenant.limits.storage === -1 ? '∞' : Math.round(tenant.limits.storage / 1024)}GB
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="small">
                                  <div className="fw-medium">{currentPlan?.name}</div>
                                  <div className="text-muted">
                                    {currentPlan?.price === 0 ? 'Free' : formatCurrency(currentPlan?.price || 0)}
                                  </div>
                                  {tenant.nextBillingDate && (
                                    <div className="text-muted">
                                      Next: {new Date(tenant.nextBillingDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <small className="text-muted">
                                  {new Date(tenant.createdAt).toLocaleDateString()}
                                </small>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-primary">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="btn btn-outline-secondary">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="btn btn-outline-danger">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Plans & Pricing Tab */}
              {activeTab === 'plans' && (
                <div className="plans-pricing">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="mb-1">Subscription Plans</h5>
                      <p className="text-muted small mb-0">Manage subscription tiers and pricing</p>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm">
                        <Settings className="h-4 w-4 me-1" />
                        Configure
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => setShowPlanModal(true)}>
                        <Plus className="h-4 w-4 me-1" />
                        Add Plan
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Plan</th>
                          <th>Price</th>
                          <th>Features</th>
                          <th>Limits</th>
                          <th>Subscribers</th>
                          <th>Revenue</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plans.map((plan) => {
                          const PlanIcon = plan.icon
                          const tenantCount = tenants.filter(t => t.plan === plan.id).length
                          const monthlyRevenue = tenantCount * plan.price
                          
                          return (
                            <tr key={plan.id} className={plan.popular ? 'table-warning' : ''}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <PlanIcon className={`h-5 w-5 me-3 text-${plan.color}`} />
                                  <div>
                                    <div className="fw-medium">{plan.name}</div>
                                    <small className="text-muted">{plan.description}</small>
                                    {plan.popular && (
                                      <div className="mt-1">
                                        <span className="badge bg-warning text-dark">
                                          <Award className="h-3 w-3 me-1" />
                                          Most Popular
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-medium">
                                    {plan.price === 0 ? 'Free' : formatCurrency(plan.price)}
                                  </div>
                                  <small className="text-muted">per {plan.interval}</small>
                                </div>
                              </td>
                              <td>
                                <div className="small">
                                  <div className="mb-1">Key Features:</div>
                                  <ul className="list-unstyled mb-0">
                                    {plan.features.slice(0, 3).map((feature, index) => (
                                      <li key={index} className="mb-1">
                                        <CheckCircle className="h-3 w-3 me-2 text-success" />
                                        {feature}
                                      </li>
                                    ))}
                                    {plan.features.length > 3 && (
                                      <li className="text-muted">
                                        +{plan.features.length - 3} more features
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </td>
                              <td>
                                <div className="small">
                                  <div className="mb-1">Limits:</div>
                                  <div className="text-muted">
                                    <div>Clients: {plan.limits.clients === -1 ? '∞' : plan.limits.clients}</div>
                                    <div>Storage: {plan.limits.storage === -1 ? '∞' : `${Math.round(plan.limits.storage / 1024)}GB`}</div>
                                    <div>API: {plan.limits.apiCalls === -1 ? '∞' : formatNumber(plan.limits.apiCalls)}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <div className="fw-medium">{tenantCount}</div>
                                  <small className="text-muted">subscribers</small>
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <div className="fw-medium">{formatCurrency(monthlyRevenue)}</div>
                                  <small className="text-muted">monthly</small>
                                </div>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-primary">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="btn btn-outline-secondary">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div className="transactions-management">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="mb-1">Billing Transactions</h5>
                      <p className="text-muted small mb-0">Track all billing transactions and payments</p>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm">
                        <Filter className="h-4 w-4 me-1" />
                        Filter
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        <Download className="h-4 w-4 me-1" />
                        Export
                      </button>
                      <button className="btn btn-primary btn-sm">
                        <RefreshCw className="h-4 w-4 me-1" />
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Transaction</th>
                          <th>Tenant</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Type</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => {
                          const tenant = tenants.find(t => t.id === transaction.tenantId)
                          const TypeIcon = getTransactionTypeIcon(transaction.type)
                          
                          return (
                            <tr key={transaction.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <TypeIcon className="h-4 w-4 me-2 text-muted" />
                                  <div>
                                    <div className="fw-medium">{transaction.description}</div>
                                    <small className="text-muted">#{transaction.id}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div className="fw-medium">{tenant?.name}</div>
                                  <small className="text-muted">{tenant?.email}</small>
                                </div>
                              </td>
                              <td>
                                <div className="fw-medium">
                                  {formatCurrency(transaction.amount)} {transaction.currency}
                                </div>
                              </td>
                              <td>
                                <span className={`badge bg-${getTransactionStatusColor(transaction.status)}`}>
                                  {transaction.status.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-info">
                                  {transaction.type.toUpperCase()}
                                </span>
                              </td>
                              <td>
                                <small className="text-muted">
                                  {new Date(transaction.createdAt).toLocaleDateString()}
                                </small>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-primary">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  {transaction.invoiceId && (
                                    <button className="btn btn-outline-secondary">
                                      <ExternalLink className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="billing-analytics">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="mb-1">Billing Analytics</h5>
                      <p className="text-muted small mb-0">Revenue insights and tenant analytics</p>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-primary btn-sm">
                        <Calendar className="h-4 w-4 me-1" />
                        Date Range
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        <Download className="h-4 w-4 me-1" />
                        Export Report
                      </button>
                    </div>
                  </div>

                  <div className="row">
                    {/* Revenue Overview */}
                    <div className="col-lg-8 mb-4">
                      <div className="bg-light rounded p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">Monthly Revenue</h6>
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-center py-4">
                          <h6 className="text-muted mb-2">Revenue Chart</h6>
                          <p className="text-muted mb-0">Monthly revenue trends and projections</p>
                        </div>
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="col-lg-4 mb-4">
                      <div className="bg-light rounded p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">Key Metrics</h6>
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Total Revenue</small>
                            <small className="fw-medium">{formatCurrency(307)}</small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Active Tenants</small>
                            <small className="fw-medium">{tenants.filter(t => t.status === 'active').length}</small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Trial Tenants</small>
                            <small className="fw-medium">{tenants.filter(t => t.status === 'trial').length}</small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div className="progress-bar bg-warning" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Churn Rate</small>
                            <small className="fw-medium">2.5%</small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div className="progress-bar bg-danger" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Plan Distribution */}
                    <div className="col-lg-6 mb-4">
                      <div className="bg-light rounded p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">Plan Distribution</h6>
                          <PieChart className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-center py-3">
                          <h6 className="text-muted mb-2">Plan Usage</h6>
                          <p className="text-muted mb-0">Distribution of tenants across subscription plans</p>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="col-lg-6 mb-4">
                      <div className="bg-light rounded p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h6 className="mb-0">Recent Activity</h6>
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="list-group list-group-flush">
                          {transactions.slice(0, 5).map((transaction) => {
                            const tenant = tenants.find(t => t.id === transaction.tenantId)
                            return (
                              <div key={transaction.id} className="list-group-item border-0 px-0 bg-transparent">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div>
                                    <div className="small fw-medium">{tenant?.name}</div>
                                    <small className="text-muted">{transaction.description}</small>
                                  </div>
                                  <div className="text-end">
                                    <div className="small fw-medium">{formatCurrency(transaction.amount)}</div>
                                    <small className="text-muted">
                                      {new Date(transaction.createdAt).toLocaleDateString()}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
