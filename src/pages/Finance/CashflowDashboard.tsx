import React, { useState, useMemo } from 'react'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useTransactionsStats, useTransactions } from '@/hooks/useTransaction'
import { useInvoicesStats, useOverdueInvoices } from '@/hooks/useInvoice'
import { useBillsStats, useOverdueBills } from '@/hooks/useBill'
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
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react'

interface CashflowData {
  period: string
  cashIn: number
  cashOut: number
  netCashflow: number
  runningBalance: number
}

export function CashflowDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('12m')
  const [viewType, setViewType] = useState('monthly') // monthly, weekly, daily
  
  const { data: transactionStats } = useTransactionsStats()
  const { data: allTransactions = [] } = useTransactions()
  const { data: invoiceStats } = useInvoicesStats()
  const { data: billStats } = useBillsStats()
  const { data: overdueInvoices = [] } = useOverdueInvoices()
  const { data: overdueBills = [] } = useOverdueBills()
  const { formatCurrency } = useTimeRegion()

  // Calculate cashflow data
  const cashflowData = useMemo(() => {
    const currentDate = new Date()
    const periods: CashflowData[] = []
    
    // Generate data for the selected period
    const periodsToShow = selectedPeriod === '12m' ? 12 : selectedPeriod === '6m' ? 6 : 3
    
    let runningBalance = 0
    
    for (let i = periodsToShow - 1; i >= 0; i--) {
      const periodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const periodEnd = new Date(periodDate.getFullYear(), periodDate.getMonth() + 1, 0)
      
      // Filter transactions for this period
      const periodTransactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.transactionDate)
        return transactionDate >= periodDate && transactionDate <= periodEnd
      })
      
      // Calculate cash in (income transactions)
      const cashIn = periodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      // Calculate cash out (expense transactions)
      const cashOut = periodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const netCashflow = cashIn - cashOut
      runningBalance += netCashflow
      
      periods.push({
        period: periodDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        cashIn,
        cashOut,
        netCashflow,
        runningBalance
      })
    }
    
    return periods
  }, [selectedPeriod, allTransactions])

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalCashIn = cashflowData.reduce((sum, p) => sum + p.cashIn, 0)
    const totalCashOut = cashflowData.reduce((sum, p) => sum + p.cashOut, 0)
    const totalNetCashflow = totalCashIn - totalCashOut
    const currentBalance = cashflowData[cashflowData.length - 1]?.runningBalance || 0
    
    // Calculate growth rates
    const currentPeriod = cashflowData[cashflowData.length - 1]
    const previousPeriod = cashflowData[cashflowData.length - 2]
    
    const cashInGrowth = previousPeriod && previousPeriod.cashIn > 0
      ? ((currentPeriod.cashIn - previousPeriod.cashIn) / previousPeriod.cashIn) * 100
      : 0
    
    const cashOutGrowth = previousPeriod && previousPeriod.cashOut > 0
      ? ((currentPeriod.cashOut - previousPeriod.cashOut) / previousPeriod.cashOut) * 100
      : 0
    
    return {
      totalCashIn,
      totalCashOut,
      totalNetCashflow,
      currentBalance,
      cashInGrowth,
      cashOutGrowth
    }
  }, [cashflowData])

  // Calculate upcoming cashflow
  const upcomingCashflow = useMemo(() => {
    const today = new Date()
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    
    // Calculate expected income from pending invoices
    const expectedIncome = overdueInvoices
      .filter(invoice => invoice.status === 'sent' || invoice.status === 'viewed')
      .reduce((sum, invoice) => sum + invoice.total, 0)
    
    // Calculate expected expenses from pending bills
    const expectedExpenses = overdueBills
      .filter(bill => bill.status === 'pending')
      .reduce((sum, bill) => sum + bill.total, 0)
    
    return {
      expectedIncome,
      expectedExpenses,
      netExpected: expectedIncome - expectedExpenses
    }
  }, [overdueInvoices, overdueBills])


  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'success' : 'danger'
  }

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <PageHeader 
        title="Cashflow Dashboard"
        subtitle="Monitor your cash flow and financial liquidity"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Finance', path: '/finance' },
          { label: 'Cashflow', active: true }
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
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">View Type</label>
                  <select 
                    className="form-select"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div className="col-md-6 d-flex align-items-end">
                  <button className="btn btn-outline-primary me-2">
                    <Download className="h-4 w-4 me-1" />
                    Export
                  </button>
                  <button className="btn btn-outline-secondary">
                    <Filter className="h-4 w-4 me-1" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-success">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{formatCurrency(summaryMetrics.totalCashIn)}</h6>
                  <small className="text-muted">Cash In</small>
                  <div className="d-flex align-items-center mt-1">
                    <span className={`text-${getGrowthColor(summaryMetrics.cashInGrowth)}`}>
                      {getGrowthIcon(summaryMetrics.cashInGrowth)}
                    </span>
                    <small className={`text-${getGrowthColor(summaryMetrics.cashInGrowth)} ms-1`}>
                      {formatPercentage(summaryMetrics.cashInGrowth)}
                    </small>
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
                  <h6 className="mb-0">{formatCurrency(summaryMetrics.totalCashOut)}</h6>
                  <small className="text-muted">Cash Out</small>
                  <div className="d-flex align-items-center mt-1">
                    <span className={`text-${getGrowthColor(-summaryMetrics.cashOutGrowth)}`}>
                      {getGrowthIcon(-summaryMetrics.cashOutGrowth)}
                    </span>
                    <small className={`text-${getGrowthColor(-summaryMetrics.cashOutGrowth)} ms-1`}>
                      {formatPercentage(summaryMetrics.cashOutGrowth)}
                    </small>
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
                  <span className={`avatar-initial rounded bg-label-${summaryMetrics.totalNetCashflow >= 0 ? 'success' : 'danger'}`}>
                    <Activity className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{formatCurrency(summaryMetrics.totalNetCashflow)}</h6>
                  <small className="text-muted">Net Cashflow</small>
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
                  <span className={`avatar-initial rounded bg-label-${summaryMetrics.currentBalance >= 0 ? 'success' : 'danger'}`}>
                    <DollarSign className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{formatCurrency(summaryMetrics.currentBalance)}</h6>
                  <small className="text-muted">Current Balance</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Warnings */}
      {(overdueInvoices.length > 0 || overdueBills.length > 0) && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <AlertTriangle className="h-5 w-5 me-2" />
                <div className="flex-grow-1">
                  <h6 className="alert-heading mb-1">Cashflow Alerts</h6>
                  <p className="mb-0">
                    {overdueInvoices.length > 0 && (
                      <span>{overdueInvoices.length} overdue invoice{overdueInvoices.length !== 1 ? 's' : ''} ({formatCurrency(overdueInvoices.reduce((sum, inv) => sum + inv.total, 0))})</span>
                    )}
                    {overdueInvoices.length > 0 && overdueBills.length > 0 && <span> • </span>}
                    {overdueBills.length > 0 && (
                      <span>{overdueBills.length} overdue bill{overdueBills.length !== 1 ? 's' : ''} ({formatCurrency(overdueBills.reduce((sum, bill) => sum + bill.total, 0))})</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts and Analysis */}
      <div className="row">
        {/* Cashflow Chart */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <BarChart3 className="h-5 w-5 me-2" />
                Cashflow Trend
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <BarChart3 className="h-16 w-16 text-primary mb-3" />
                <h6 className="text-primary mb-2">Interactive Cashflow Chart</h6>
                <p className="text-muted mb-0">
                  This would display a comprehensive cashflow chart showing cash in, cash out, 
                  and net cashflow trends over time with interactive features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Cashflow */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <Clock className="h-5 w-5 me-2" />
                Upcoming Cashflow
              </h5>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <ArrowUpRight className="h-4 w-4 text-success me-2" />
                    <span>Expected Income</span>
                  </div>
                  <span className="fw-medium text-success">
                    {formatCurrency(upcomingCashflow.expectedIncome)}
                  </span>
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <ArrowDownRight className="h-4 w-4 text-danger me-2" />
                    <span>Expected Expenses</span>
                  </div>
                  <span className="fw-medium text-danger">
                    {formatCurrency(upcomingCashflow.expectedExpenses)}
                  </span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Activity className={`h-4 w-4 me-2 ${upcomingCashflow.netExpected >= 0 ? 'text-success' : 'text-danger'}`} />
                    <span className="fw-medium">Net Expected</span>
                  </div>
                  <span className={`fw-bold ${upcomingCashflow.netExpected >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(upcomingCashflow.netExpected)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Cashflow Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <Activity className="h-5 w-5 me-2" />
                Detailed Cashflow Statement
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th className="text-end">Cash In</th>
                      <th className="text-end">Cash Out</th>
                      <th className="text-end">Net Cashflow</th>
                      <th className="text-end">Running Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashflowData.map((period, index) => (
                      <tr key={period.period}>
                        <td className="fw-medium">{period.period}</td>
                        <td className="text-end text-success">{formatCurrency(period.cashIn)}</td>
                        <td className="text-end text-danger">{formatCurrency(period.cashOut)}</td>
                        <td className={`text-end ${period.netCashflow >= 0 ? 'text-success' : 'text-danger'}`}>
                          {formatCurrency(period.netCashflow)}
                        </td>
                        <td className={`text-end ${period.runningBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                          {formatCurrency(period.runningBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td className="fw-bold">Total</td>
                      <td className="text-end text-success fw-bold">{formatCurrency(summaryMetrics.totalCashIn)}</td>
                      <td className="text-end text-danger fw-bold">{formatCurrency(summaryMetrics.totalCashOut)}</td>
                      <td className={`text-end fw-bold ${summaryMetrics.totalNetCashflow >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(summaryMetrics.totalNetCashflow)}
                      </td>
                      <td className={`text-end fw-bold ${summaryMetrics.currentBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(summaryMetrics.currentBalance)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
