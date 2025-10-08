import React, { useState, useMemo } from 'react'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useInvoicesStats } from '@/hooks/useInvoice'
import { useBillsStats, useBills } from '@/hooks/useBill'
import { useTransactionsStats, useTransactions } from '@/hooks/useTransaction'
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
  Target,
  AlertCircle
} from 'lucide-react'

interface ProfitLossData {
  period: string
  revenue: number
  expenses: number
  grossProfit: number
  netProfit: number
  profitMargin: number
}

export function ProfitLossReport() {
  const [selectedPeriod, setSelectedPeriod] = useState('12m')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  
  const { data: invoiceStats } = useInvoicesStats()
  const { data: billStats } = useBillsStats()
  const { data: transactionStats } = useTransactionsStats()
  const { formatCurrency } = useTimeRegion()
  
  const { data: allBills = [] } = useBills()
  const { data: allTransactions = [] } = useTransactions()

  // Calculate profit & loss data
  const profitLossData = useMemo(() => {
    const currentDate = new Date()
    const periods: ProfitLossData[] = []
    
    // Generate data for the selected period
    const monthsToShow = selectedPeriod === '12m' ? 12 : selectedPeriod === '6m' ? 6 : 3
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const periodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const periodEnd = new Date(periodDate.getFullYear(), periodDate.getMonth() + 1, 0)
      
      const periodStart = periodDate.toISOString()
      const periodEndStr = periodEnd.toISOString()
      
      // Filter transactions for this period
      const periodTransactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.transactionDate)
        return transactionDate >= periodDate && transactionDate <= periodEnd
      })
      
      // Calculate revenue (income transactions)
      const revenue = periodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      // Calculate expenses (expense transactions)
      const expenses = periodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const grossProfit = revenue - expenses
      const netProfit = grossProfit // Simplified - could include taxes, etc.
      const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0
      
      periods.push({
        period: periodDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue,
        expenses,
        grossProfit,
        netProfit,
        profitMargin
      })
    }
    
    return periods
  }, [selectedPeriod, allTransactions])

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalRevenue = profitLossData.reduce((sum, p) => sum + p.revenue, 0)
    const totalExpenses = profitLossData.reduce((sum, p) => sum + p.expenses, 0)
    const totalProfit = totalRevenue - totalExpenses
    const averageProfitMargin = profitLossData.length > 0 
      ? profitLossData.reduce((sum, p) => sum + p.profitMargin, 0) / profitLossData.length 
      : 0
    
    // Calculate growth rates
    const currentPeriod = profitLossData[profitLossData.length - 1]
    const previousPeriod = profitLossData[profitLossData.length - 2]
    
    const revenueGrowth = previousPeriod && previousPeriod.revenue > 0
      ? ((currentPeriod.revenue - previousPeriod.revenue) / previousPeriod.revenue) * 100
      : 0
    
    const profitGrowth = previousPeriod && previousPeriod.netProfit !== 0
      ? ((currentPeriod.netProfit - previousPeriod.netProfit) / Math.abs(previousPeriod.netProfit)) * 100
      : 0
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      averageProfitMargin,
      revenueGrowth,
      profitGrowth
    }
  }, [profitLossData])


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
        title="Profit & Loss Report"
        subtitle="Analyze your business profitability and financial performance"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Finance', path: '/finance' },
          { label: 'P&L Report', active: true }
        ]}
      />

      {/* Controls */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-4">
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
                <div className="col-md-4">
                  <label className="form-label">Year</label>
                  <select 
                    className="form-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                  </select>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button className="btn btn-outline-primary">
                    <Download className="h-4 w-4 me-1" />
                    Export Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
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
                  <h6 className="mb-0">{formatCurrency(summaryMetrics.totalRevenue)}</h6>
                  <small className="text-muted">Total Revenue</small>
                  <div className="d-flex align-items-center mt-1">
                    <span className={`text-${getGrowthColor(summaryMetrics.revenueGrowth)}`}>
                      {getGrowthIcon(summaryMetrics.revenueGrowth)}
                    </span>
                    <small className={`text-${getGrowthColor(summaryMetrics.revenueGrowth)} ms-1`}>
                      {formatPercentage(summaryMetrics.revenueGrowth)}
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
                    <TrendingDown className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{formatCurrency(summaryMetrics.totalExpenses)}</h6>
                  <small className="text-muted">Total Expenses</small>
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
                  <span className={`avatar-initial rounded bg-label-${summaryMetrics.totalProfit >= 0 ? 'success' : 'danger'}`}>
                    <TrendingUp className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{formatCurrency(summaryMetrics.totalProfit)}</h6>
                  <small className="text-muted">Net Profit</small>
                  <div className="d-flex align-items-center mt-1">
                    <span className={`text-${getGrowthColor(summaryMetrics.profitGrowth)}`}>
                      {getGrowthIcon(summaryMetrics.profitGrowth)}
                    </span>
                    <small className={`text-${getGrowthColor(summaryMetrics.profitGrowth)} ms-1`}>
                      {formatPercentage(summaryMetrics.profitGrowth)}
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
                  <span className="avatar-initial rounded bg-label-primary">
                    <Target className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0">{summaryMetrics.averageProfitMargin.toFixed(1)}%</h6>
                  <small className="text-muted">Avg Profit Margin</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analysis */}
      <div className="row">
        {/* Profit & Loss Chart */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <BarChart3 className="h-5 w-5 me-2" />
                Profit & Loss Trend
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center py-5">
                <BarChart3 className="h-16 w-16 text-primary mb-3" />
                <h6 className="text-primary mb-2">Chart Visualization</h6>
                <p className="text-muted mb-0">
                  Interactive charts will be implemented with a charting library like Chart.js or Recharts.
                  This would show the revenue, expenses, and profit trends over time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <PieChart className="h-5 w-5 me-2" />
                Expense Breakdown
              </h5>
            </div>
            <div className="card-body">
              {transactionStats && (
                <div className="space-y-3">
                  {Object.entries(transactionStats.transactionsByCategory)
                    .filter(([_, count]) => count > 0)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 8)
                    .map(([category, count]) => {
                      const categoryExpenses = allTransactions
                        .filter(t => t.type === 'expense' && t.category === category)
                        .reduce((sum, t) => sum + t.amount, 0)
                      
                      const percentage = summaryMetrics.totalExpenses > 0 
                        ? (categoryExpenses / summaryMetrics.totalExpenses) * 100 
                        : 0
                      
                      return (
                        <div key={category} className="d-flex justify-content-between align-items-center">
                          <div className="flex-grow-1">
                            <div className="fw-medium text-capitalize">
                              {category.replace('_', ' ')}
                            </div>
                            <div className="progress mt-1" style={{ height: '4px' }}>
                              <div 
                                className="progress-bar bg-primary" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-end ms-3">
                            <div className="fw-medium">{formatCurrency(categoryExpenses)}</div>
                            <small className="text-muted">{percentage.toFixed(1)}%</small>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed P&L Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <Activity className="h-5 w-5 me-2" />
                Detailed Profit & Loss Statement
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th className="text-end">Revenue</th>
                      <th className="text-end">Expenses</th>
                      <th className="text-end">Gross Profit</th>
                      <th className="text-end">Net Profit</th>
                      <th className="text-end">Profit Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitLossData.map((period, index) => (
                      <tr key={period.period}>
                        <td className="fw-medium">{period.period}</td>
                        <td className="text-end text-success">{formatCurrency(period.revenue)}</td>
                        <td className="text-end text-danger">{formatCurrency(period.expenses)}</td>
                        <td className="text-end">{formatCurrency(period.grossProfit)}</td>
                        <td className={`text-end ${period.netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                          {formatCurrency(period.netProfit)}
                        </td>
                        <td className={`text-end ${period.profitMargin >= 0 ? 'text-success' : 'text-danger'}`}>
                          {period.profitMargin.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <td className="fw-bold">Total</td>
                      <td className="text-end text-success fw-bold">{formatCurrency(summaryMetrics.totalRevenue)}</td>
                      <td className="text-end text-danger fw-bold">{formatCurrency(summaryMetrics.totalExpenses)}</td>
                      <td className="text-end fw-bold">{formatCurrency(summaryMetrics.totalProfit)}</td>
                      <td className={`text-end fw-bold ${summaryMetrics.totalProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(summaryMetrics.totalProfit)}
                      </td>
                      <td className={`text-end fw-bold ${summaryMetrics.averageProfitMargin >= 0 ? 'text-success' : 'text-danger'}`}>
                        {summaryMetrics.averageProfitMargin.toFixed(1)}%
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
