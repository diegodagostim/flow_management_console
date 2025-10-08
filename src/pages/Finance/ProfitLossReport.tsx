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
              <ProfitLossTrendChart data={profitLossData} />
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
              <ExpenseBreakdownChart 
                transactions={allTransactions} 
                totalExpenses={summaryMetrics.totalExpenses}
                formatCurrency={formatCurrency}
              />
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

// Profit & Loss Trend Chart Component
function ProfitLossTrendChart({ data }: { data: ProfitLossData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <BarChart3 className="h-16 w-16 text-muted mb-3" />
        <h6 className="text-muted mb-2">No Data Available</h6>
        <p className="text-muted mb-0">No profit & loss data found for the selected period.</p>
      </div>
    )
  }

  const maxValue = Math.max(
    ...data.map(d => Math.max(d.revenue, d.expenses, d.netProfit))
  )

  const chartHeight = 300
  const chartWidth = 100
  const padding = 20

  return (
    <div className="profit-loss-chart">
      <div className="chart-container" style={{ height: `${chartHeight}px` }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e9ecef"
              strokeWidth="0.5"
            />
          ))}

          {/* Revenue line */}
          <polyline
            fill="none"
            stroke="#28a745"
            strokeWidth="2"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * (chartWidth - 2 * padding) + padding
              const y = chartHeight - padding - ((d.revenue / maxValue) * (chartHeight - 2 * padding))
              return `${x},${y}`
            }).join(' ')}
          />

          {/* Expenses line */}
          <polyline
            fill="none"
            stroke="#dc3545"
            strokeWidth="2"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * (chartWidth - 2 * padding) + padding
              const y = chartHeight - padding - ((d.expenses / maxValue) * (chartHeight - 2 * padding))
              return `${x},${y}`
            }).join(' ')}
          />

          {/* Net Profit line */}
          <polyline
            fill="none"
            stroke="#007bff"
            strokeWidth="2"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * (chartWidth - 2 * padding) + padding
              const y = chartHeight - padding - ((d.netProfit / maxValue) * (chartHeight - 2 * padding))
              return `${x},${y}`
            }).join(' ')}
          />

          {/* Data points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * (chartWidth - 2 * padding) + padding
            return (
              <g key={i}>
                {/* Revenue point */}
                <circle
                  cx={x}
                  cy={chartHeight - padding - ((d.revenue / maxValue) * (chartHeight - 2 * padding))}
                  r="3"
                  fill="#28a745"
                />
                {/* Expenses point */}
                <circle
                  cx={x}
                  cy={chartHeight - padding - ((d.expenses / maxValue) * (chartHeight - 2 * padding))}
                  r="3"
                  fill="#dc3545"
                />
                {/* Net Profit point */}
                <circle
                  cx={x}
                  cy={chartHeight - padding - ((d.netProfit / maxValue) * (chartHeight - 2 * padding))}
                  r="3"
                  fill="#007bff"
                />
              </g>
            )
          })}

          {/* X-axis labels */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * (chartWidth - 2 * padding) + padding
            return (
              <text
                key={i}
                x={x}
                y={chartHeight - 5}
                textAnchor="middle"
                fontSize="8"
                fill="#6c757d"
              >
                {d.period}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="chart-legend mt-3">
        <div className="row">
          <div className="col-4">
            <div className="d-flex align-items-center">
              <div className="legend-color me-2" style={{ width: '12px', height: '12px', backgroundColor: '#28a745', borderRadius: '2px' }}></div>
              <small className="text-muted">Revenue</small>
            </div>
          </div>
          <div className="col-4">
            <div className="d-flex align-items-center">
              <div className="legend-color me-2" style={{ width: '12px', height: '12px', backgroundColor: '#dc3545', borderRadius: '2px' }}></div>
              <small className="text-muted">Expenses</small>
            </div>
          </div>
          <div className="col-4">
            <div className="d-flex align-items-center">
              <div className="legend-color me-2" style={{ width: '12px', height: '12px', backgroundColor: '#007bff', borderRadius: '2px' }}></div>
              <small className="text-muted">Net Profit</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Expense Breakdown Chart Component
function ExpenseBreakdownChart({ 
  transactions, 
  totalExpenses, 
  formatCurrency 
}: { 
  transactions: any[]
  totalExpenses: number
  formatCurrency: (amount: number) => string
}) {
  // Calculate expense breakdown by category
  const expenseBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Other'
      acc[category] = (acc[category] || 0) + transaction.amount
      return acc
    }, {} as Record<string, number>)

  const sortedExpenses = Object.entries(expenseBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)

  if (sortedExpenses.length === 0) {
    return (
      <div className="text-center py-5">
        <PieChart className="h-16 w-16 text-muted mb-3" />
        <h6 className="text-muted mb-2">No Expense Data</h6>
        <p className="text-muted mb-0">No expense transactions found for the selected period.</p>
      </div>
    )
  }

  const colors = [
    '#007bff', '#28a745', '#ffc107', '#dc3545', 
    '#6f42c1', '#fd7e14', '#20c997', '#6c757d'
  ]

  return (
    <div className="expense-breakdown-chart">
      {/* Pie Chart SVG */}
      <div className="pie-chart-container mb-4">
        <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto d-block">
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#e9ecef"
            strokeWidth="2"
          />
          
          {sortedExpenses.map(([category, amount], index) => {
            const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
            const angle = (percentage / 100) * 360
            const startAngle = sortedExpenses.slice(0, index).reduce((sum, [, amt]) => {
              return sum + ((amt / totalExpenses) * 360)
            }, 0)
            
            const endAngle = startAngle + angle
            
            // Convert angles to radians
            const startRad = (startAngle - 90) * (Math.PI / 180)
            const endRad = (endAngle - 90) * (Math.PI / 180)
            
            // Calculate path for pie slice
            const x1 = 100 + 80 * Math.cos(startRad)
            const y1 = 100 + 80 * Math.sin(startRad)
            const x2 = 100 + 80 * Math.cos(endRad)
            const y2 = 100 + 80 * Math.sin(endRad)
            
            const largeArcFlag = angle > 180 ? 1 : 0
            
            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')
            
            return (
              <path
                key={category}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth="1"
              />
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="expense-legend">
        {sortedExpenses.map(([category, amount], index) => {
          const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
          return (
            <div key={category} className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <div 
                  className="legend-color me-2" 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: colors[index % colors.length], 
                    borderRadius: '2px' 
                  }}
                ></div>
                <small className="text-capitalize">
                  {category.replace('_', ' ')}
                </small>
              </div>
              <div className="text-end">
                <small className="fw-medium">{formatCurrency(amount)}</small>
                <br />
                <small className="text-muted">{percentage.toFixed(1)}%</small>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
