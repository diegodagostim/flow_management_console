import React from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useInvoicesStats } from '@/hooks/useInvoice'
import { useBillsStats } from '@/hooks/useBill'
import { useTransactionsStats } from '@/hooks/useTransaction'
import { useTimeRegion } from '@/hooks/useTimeRegion'
import { 
  DollarSign, 
  FileText, 
  CreditCard, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertTriangle,
  Target,
  Users,
  Brain
} from 'lucide-react'

export function FinanceDashboard() {
  const { data: invoiceStats } = useInvoicesStats()
  const { data: billStats } = useBillsStats()
  const { data: transactionStats } = useTransactionsStats()
  const { formatCurrency } = useTimeRegion()

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const netProfit = (invoiceStats?.totalAmount || 0) - (billStats?.totalAmount || 0)
  const profitMargin = invoiceStats?.totalAmount ? (netProfit / invoiceStats.totalAmount) * 100 : 0

  const financeModules = [
    {
      title: 'Bills & Expenses',
      description: 'Manage vendor bills and business expenses',
      icon: <FileText className="h-8 w-8" />,
      color: 'danger',
      path: '/finance/bills',
      stats: {
        total: billStats?.totalBills || 0,
        amount: billStats?.totalAmount || 0,
        pending: billStats?.pendingAmount || 0
      }
    },
    {
      title: 'Sales Invoices',
      description: 'Create and track sales invoices',
      icon: <CreditCard className="h-8 w-8" />,
      color: 'success',
      path: '/finance/invoices',
      stats: {
        total: invoiceStats?.totalInvoices || 0,
        amount: invoiceStats?.totalAmount || 0,
        pending: invoiceStats?.pendingAmount || 0
      }
    },
    {
      title: 'Profit & Loss',
      description: 'Analyze profitability and financial performance',
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'primary',
      path: '/finance/profit-loss',
      stats: {
        profit: netProfit,
        margin: profitMargin,
        growth: 0, // Will be calculated from real data
      }
    },
    {
      title: 'Cashflow Dashboard',
      description: 'Monitor cash flow and liquidity',
      icon: <Activity className="h-8 w-8" />,
      color: 'info',
      path: '/finance/cashflow',
      stats: {
        income: transactionStats?.totalIncome || 0,
        expenses: transactionStats?.totalExpenses || 0,
        net: transactionStats?.netAmount || 0
      }
    },
    {
      title: 'Business Intelligence',
      description: 'Advanced analytics and insights',
      icon: <Brain className="h-8 w-8" />,
      color: 'warning',
      path: '/finance/business-intelligence',
      stats: {
        clients: 0, // Would be calculated
        growth: 0, // Will be calculated from real data
        efficiency: 0 // Will be calculated from real data
      }
    },
    {
      title: 'Reconciliation',
      description: 'Automated transaction matching',
      icon: <Zap className="h-8 w-8" />,
      color: 'secondary',
      path: '/finance/reconciliation',
      stats: {
        matched: transactionStats?.reconciledCount || 0,
        pending: transactionStats?.unreconciledCount || 0,
        rate: 0 // Will be calculated from real data
      }
    }
  ]

  return (
    <div className="container-fluid finance-dashboard">
      {/* Page Header */}
      <PageHeader 
        title="Finance Dashboard"
        subtitle="Comprehensive financial management and analytics"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Finance', active: true }
        ]}
      />

      {/* Key Financial Metrics */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-success">
                    <DollarSign className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{formatCurrency(invoiceStats?.totalAmount || 0)}</h6>
                  <small className="text-muted">Total Revenue</small>
                  <div className="d-flex align-items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 text-success" />
                    <small className="text-success ms-1">+12.5%</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-danger">
                    <ArrowDownRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{formatCurrency(billStats?.totalAmount || 0)}</h6>
                  <small className="text-muted">Total Expenses</small>
                  <div className="d-flex align-items-center mt-1">
                    <ArrowDownRight className="h-3 w-3 text-danger" />
                    <small className="text-danger ms-1">+5.2%</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className={`avatar-initial rounded bg-label-${netProfit >= 0 ? 'success' : 'danger'}`}>
                    <TrendingUp className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{formatCurrency(netProfit)}</h6>
                  <small className="text-muted">Net Profit</small>
                  <div className="d-flex align-items-center mt-1">
                    <Target className="h-3 w-3 text-primary" />
                    <small className="text-primary ms-1">{formatPercentage(profitMargin)}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-info">
                    <Activity className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{transactionStats?.totalTransactions || 0}</h6>
                  <small className="text-muted">Total Transactions</small>
                  <div className="d-flex align-items-center mt-1">
                    <Calendar className="h-3 w-3 text-info" />
                    <small className="text-info ms-1">This month</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(billStats?.overdueAmount || 0) > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <AlertTriangle className="h-5 w-5 me-2" />
                <div>
                  <h6 className="alert-heading mb-1">Financial Alerts</h6>
                  <p className="mb-0">
                    You have overdue bills totaling {formatCurrency(billStats?.overdueAmount || 0)}. 
                    Review your cash flow and payment schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finance Modules Grid */}
      <div className="row">
        {financeModules.map((module, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <Link to={module.path} className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100 finance-module-card">
                <div className="card-body">
                  <div className="d-flex align-items-start mb-3">
                    <div className={`avatar avatar-lg me-3 bg-label-${module.color}`}>
                      <span className={`avatar-initial rounded bg-label-${module.color}`}>
                        {module.icon}
                      </span>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">{module.title}</h5>
                      <p className="text-muted small mb-0">{module.description}</p>
                    </div>
                  </div>
                  
                  <div className="row text-center">
                    {module.title === 'Bills & Expenses' && (
                      <>
                        <div className="col-4">
                          <div className="fw-medium text-danger">{module.stats.total}</div>
                          <small className="text-muted">Bills</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium">{formatCurrency(module.stats.amount)}</div>
                          <small className="text-muted">Total</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium text-warning">{formatCurrency(module.stats.pending)}</div>
                          <small className="text-muted">Pending</small>
                        </div>
                      </>
                    )}
                    
                    {module.title === 'Sales Invoices' && (
                      <>
                        <div className="col-4">
                          <div className="fw-medium text-success">{module.stats.total}</div>
                          <small className="text-muted">Invoices</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium">{formatCurrency(module.stats.amount)}</div>
                          <small className="text-muted">Revenue</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium text-warning">{formatCurrency(module.stats.pending)}</div>
                          <small className="text-muted">Pending</small>
                        </div>
                      </>
                    )}
                    
                    {module.title === 'Profit & Loss' && (
                      <>
                        <div className="col-4">
                          <div className={`fw-medium ${module.stats.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                            {formatCurrency(module.stats.profit)}
                          </div>
                          <small className="text-muted">Profit</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium text-primary">{formatPercentage(module.stats.margin)}</div>
                          <small className="text-muted">Margin</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium text-success">+{formatPercentage(module.stats.growth)}</div>
                          <small className="text-muted">Growth</small>
                        </div>
                      </>
                    )}
                    
                    {module.title === 'Cashflow Dashboard' && (
                      <>
                        <div className="col-4">
                          <div className="fw-medium text-success">{formatCurrency(module.stats.income)}</div>
                          <small className="text-muted">Income</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium text-danger">{formatCurrency(module.stats.expenses)}</div>
                          <small className="text-muted">Expenses</small>
                        </div>
                        <div className="col-4">
                          <div className={`fw-medium ${module.stats.net >= 0 ? 'text-success' : 'text-danger'}`}>
                            {formatCurrency(module.stats.net)}
                          </div>
                          <small className="text-muted">Net</small>
                        </div>
                      </>
                    )}
                    
                    {module.title === 'Business Intelligence' && (
                      <>
                        <div className="col-4">
                          <div className="fw-medium text-primary">{module.stats.clients}</div>
                          <small className="text-muted">Clients</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium text-success">+{formatPercentage(module.stats.growth)}</div>
                          <small className="text-muted">Growth</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium text-info">{formatPercentage(module.stats.efficiency)}</div>
                          <small className="text-muted">Efficiency</small>
                        </div>
                      </>
                    )}
                    
                    {module.title === 'Reconciliation' && (
                      <>
                        <div className="col-4">
                          <div className="fw-medium text-success">{module.stats.matched}</div>
                          <small className="text-muted">Matched</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium text-warning">{module.stats.pending}</div>
                          <small className="text-muted">Pending</small>
                        </div>
                        <div className="col-4">
                          <div className="fw-medium text-info">{formatPercentage(module.stats.rate)}</div>
                          <small className="text-muted">Rate</small>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-2">
                  <Link to="/finance/invoices/new" className="btn btn-success w-100">
                    <CreditCard className="h-4 w-4 me-1" />
                    Create Invoice
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/finance/bills/new" className="btn btn-danger w-100">
                    <FileText className="h-4 w-4 me-1" />
                    Add Bill
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/finance/profit-loss" className="btn btn-primary w-100">
                    <BarChart3 className="h-4 w-4 me-1" />
                    View P&L Report
                  </Link>
                </div>
                <div className="col-md-3 mb-2">
                  <Link to="/finance/reconciliation" className="btn btn-info w-100">
                    <Zap className="h-4 w-4 me-1" />
                    Run Reconciliation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
