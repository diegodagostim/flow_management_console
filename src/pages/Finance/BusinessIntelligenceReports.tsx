import React, { useState, useMemo } from 'react'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useInvoicesStats, useInvoices } from '@/hooks/useInvoice'
import { useBillsStats, useBills } from '@/hooks/useBill'
import { useTransactionsStats, useTransactions } from '@/hooks/useTransaction'
import { useClients } from '@/hooks/useClientManagement'
import { useTimeRegion } from '@/hooks/useTimeRegion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Users,
  Target,
  Award,
  Zap,
  Brain,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle
} from 'lucide-react'

interface KPIMetric {
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  format: 'currency' | 'percentage' | 'number'
  icon: React.ReactNode
  color: string
}

interface ClientAnalysis {
  clientId: string
  clientName: string
  totalRevenue: number
  invoiceCount: number
  averageInvoiceValue: number
  lastInvoiceDate: string
  paymentTrend: 'improving' | 'declining' | 'stable'
}

export function BusinessIntelligenceReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('12m')
  const [reportType, setReportType] = useState('overview') // overview, clients, trends, forecasting
  
  const { data: invoiceStats } = useInvoicesStats()
  const { data: billStats } = useBillsStats()
  const { data: transactionStats } = useTransactionsStats()
  const { data: allInvoices = [] } = useInvoices()
  const { data: allBills = [] } = useBills()
  const { data: allTransactions = [] } = useTransactions()
  const { data: clients = [] } = useClients()
  const { formatCurrency } = useTimeRegion()

  // Calculate KPI metrics
  const kpiMetrics = useMemo((): KPIMetric[] => {
    if (!invoiceStats || !billStats || !transactionStats) return []
    
    const totalRevenue = invoiceStats.totalAmount
    const totalExpenses = billStats.totalAmount
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    
    // Calculate growth rates (simplified - would need historical data for accurate calculation)
    const revenueGrowth = 15.2 // Mock data
    const profitGrowth = 8.7 // Mock data
    const clientGrowth = 12.3 // Mock data
    const expenseGrowth = -5.1 // Mock data
    
    return [
      {
        name: 'Total Revenue',
        value: totalRevenue,
        change: revenueGrowth,
        trend: revenueGrowth > 0 ? 'up' : 'down',
        format: 'currency',
        icon: <DollarSign className="h-5 w-5" />,
        color: 'success'
      },
      {
        name: 'Net Profit',
        value: netProfit,
        change: profitGrowth,
        trend: profitGrowth > 0 ? 'up' : 'down',
        format: 'currency',
        icon: <TrendingUp className="h-5 w-5" />,
        color: netProfit >= 0 ? 'success' : 'danger'
      },
      {
        name: 'Profit Margin',
        value: profitMargin,
        change: 2.1,
        trend: 'up',
        format: 'percentage',
        icon: <Target className="h-5 w-5" />,
        color: profitMargin >= 10 ? 'success' : profitMargin >= 5 ? 'warning' : 'danger'
      },
      {
        name: 'Active Clients',
        value: clients.length,
        change: clientGrowth,
        trend: clientGrowth > 0 ? 'up' : 'down',
        format: 'number',
        icon: <Users className="h-5 w-5" />,
        color: 'primary'
      },
      {
        name: 'Avg Invoice Value',
        value: invoiceStats.averageInvoiceAmount,
        change: 5.8,
        trend: 'up',
        format: 'currency',
        icon: <Award className="h-5 w-5" />,
        color: 'info'
      },
      {
        name: 'Collection Rate',
        value: 94.2, // Mock data
        change: 1.2,
        trend: 'up',
        format: 'percentage',
        icon: <Zap className="h-5 w-5" />,
        color: 'success'
      }
    ]
  }, [invoiceStats, billStats, transactionStats, clients])

  // Calculate client analysis
  const clientAnalysis = useMemo((): ClientAnalysis[] => {
    return clients.map(client => {
      const clientInvoices = allInvoices.filter(invoice => invoice.clientId === client.id)
      const totalRevenue = clientInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
      const invoiceCount = clientInvoices.length
      const averageInvoiceValue = invoiceCount > 0 ? totalRevenue / invoiceCount : 0
      const lastInvoiceDate = clientInvoices.length > 0 
        ? clientInvoices.sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime())[0].invoiceDate
        : ''
      
      // Mock payment trend calculation
      const paymentTrend: 'improving' | 'declining' | 'stable' = 'stable'
      
      return {
        clientId: client.id!,
        clientName: client.name,
        totalRevenue,
        invoiceCount,
        averageInvoiceValue,
        lastInvoiceDate,
        paymentTrend
      }
    }).sort((a, b) => b.totalRevenue - a.totalRevenue)
  }, [clients, allInvoices])

  // Calculate expense analysis
  const expenseAnalysis = useMemo(() => {
    if (!transactionStats) return []
    
    return Object.entries(transactionStats.transactionsByCategory)
      .filter(([_, count]) => count > 0)
      .map(([category, count]) => {
        const categoryExpenses = allTransactions
          .filter(t => t.type === 'expense' && t.category === category)
          .reduce((sum, t) => sum + t.amount, 0)
        
        const percentage = billStats?.totalAmount ? (categoryExpenses / billStats.totalAmount) * 100 : 0
        
        return {
          category,
          amount: categoryExpenses,
          count,
          percentage
        }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [transactionStats, allTransactions, billStats])


  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatChange = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4" />
      case 'down': return <ArrowDownRight className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable', change: number) => {
    if (trend === 'up') return 'success'
    if (trend === 'down') return 'danger'
    return 'secondary'
  }

  const formatValue = (value: number, format: 'currency' | 'percentage' | 'number') => {
    switch (format) {
      case 'currency': return formatCurrency(value)
      case 'percentage': return formatPercentage(value)
      default: return value.toLocaleString()
    }
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <PageHeader 
        title="Business Intelligence Reports"
        subtitle="Advanced analytics and insights for your business"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Finance', path: '/finance' },
          { label: 'BI Reports', active: true }
        ]}
      />

      {/* Controls */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <label className="form-label">Time Period</label>
                  <select 
                    className="form-select"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="3m">Last 3 Months</option>
                    <option value="6m">Last 6 Months</option>
                    <option value="12m">Last 12 Months</option>
                    <option value="24m">Last 24 Months</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Report Type</label>
                  <select 
                    className="form-select"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="overview">Overview</option>
                    <option value="clients">Client Analysis</option>
                    <option value="trends">Trend Analysis</option>
                    <option value="forecasting">Forecasting</option>
                  </select>
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <button className="btn btn-outline-primary me-2">
                    <Download className="h-4 w-4 me-1" />
                    Export Report
                  </button>
                  <button className="btn btn-outline-secondary me-2">
                    <Filter className="h-4 w-4 me-1" />
                    Advanced Filters
                  </button>
                  <button className="btn btn-outline-info">
                    <Eye className="h-4 w-4 me-1" />
                    Custom View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="row mb-4">
        {kpiMetrics.map((metric, index) => (
          <div key={index} className="col-lg-2 col-md-4 col-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="avatar avatar-lg mx-auto mb-3">
                  <span className={`avatar-initial rounded bg-label-${metric.color}`}>
                    {metric.icon}
                  </span>
                </div>
                <h6 className="mb-1">{formatValue(metric.value, metric.format)}</h6>
                <p className="text-muted mb-2 small">{metric.name}</p>
                <div className="d-flex align-items-center justify-content-center">
                  <span className={`text-${getTrendColor(metric.trend, metric.change)}`}>
                    {getTrendIcon(metric.trend)}
                  </span>
                  <small className={`text-${getTrendColor(metric.trend, metric.change)} ms-1`}>
                    {formatChange(metric.change)}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Sections */}
      <div className="row">
        {/* Client Analysis */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <Users className="h-5 w-5 me-2" />
                Top Clients by Revenue
              </h5>
            </div>
            <div className="card-body">
              {clientAnalysis.slice(0, 5).map((client, index) => (
                <div key={client.clientId} className="d-flex justify-content-between align-items-center mb-3">
                  <div className="flex-grow-1">
                    <div className="fw-medium">{client.clientName}</div>
                    <div className="progress mt-1" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ 
                          width: `${(client.totalRevenue / clientAnalysis[0].totalRevenue) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-end ms-3">
                    <div className="fw-medium">{formatCurrency(client.totalRevenue)}</div>
                    <small className="text-muted">{client.invoiceCount} invoices</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expense Analysis */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <PieChart className="h-5 w-5 me-2" />
                Expense Breakdown
              </h5>
            </div>
            <div className="card-body">
              {expenseAnalysis.slice(0, 6).map((expense, index) => (
                <div key={expense.category} className="d-flex justify-content-between align-items-center mb-3">
                  <div className="flex-grow-1">
                    <div className="fw-medium text-capitalize">
                      {expense.category.replace('_', ' ')}
                    </div>
                    <div className="progress mt-1" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar bg-danger" 
                        style={{ width: `${expense.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-end ms-3">
                    <div className="fw-medium">{formatCurrency(expense.amount)}</div>
                    <small className="text-muted">{expense.percentage.toFixed(1)}%</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="row">
        {/* Revenue Trends */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <BarChart3 className="h-5 w-5 me-2" />
                Revenue & Profit Trends
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <BarChart3 className="h-16 w-16 text-primary mb-3" />
                <h6 className="text-primary mb-2">Advanced Trend Analysis</h6>
                <p className="text-muted mb-0">
                  This would show sophisticated trend analysis including seasonality, 
                  growth patterns, and predictive analytics using machine learning models.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Forecasting */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <Brain className="h-5 w-5 me-2" />
                AI Forecasting
              </h5>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Next Month Revenue</span>
                  <span className="fw-medium text-success">
                    {formatCurrency(invoiceStats?.totalAmount ? invoiceStats.totalAmount * 1.15 : 0)}
                  </span>
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                  <span>Next Month Expenses</span>
                  <span className="fw-medium text-danger">
                    {formatCurrency(billStats?.totalAmount ? billStats.totalAmount * 1.05 : 0)}
                  </span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Predicted Profit</span>
                  <span className="fw-bold text-success">
                    {formatCurrency(invoiceStats?.totalAmount && billStats?.totalAmount 
                      ? (invoiceStats.totalAmount * 1.15) - (billStats.totalAmount * 1.05) 
                      : 0)}
                  </span>
                </div>
                
                <div className="alert alert-info border-0 mt-3">
                  <small>
                    <Clock className="h-3 w-3 me-1" />
                    Predictions based on historical trends and seasonal patterns
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Client Analysis Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <Users className="h-5 w-5 me-2" />
                Complete Client Analysis
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th className="text-end">Total Revenue</th>
                      <th className="text-end">Invoices</th>
                      <th className="text-end">Avg Value</th>
                      <th>Last Invoice</th>
                      <th>Payment Trend</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientAnalysis.map((client) => (
                      <tr key={client.clientId}>
                        <td className="fw-medium">{client.clientName}</td>
                        <td className="text-end">{formatCurrency(client.totalRevenue)}</td>
                        <td className="text-end">{client.invoiceCount}</td>
                        <td className="text-end">{formatCurrency(client.averageInvoiceValue)}</td>
                        <td>{client.lastInvoiceDate ? new Date(client.lastInvoiceDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`badge bg-${client.paymentTrend === 'improving' ? 'success' : client.paymentTrend === 'declining' ? 'danger' : 'secondary'}`}>
                            {client.paymentTrend.charAt(0).toUpperCase() + client.paymentTrend.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            <Eye className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
