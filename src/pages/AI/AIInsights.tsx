import { useState, useEffect } from 'react'
import { 
  Brain, 
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
  Calendar,
  DollarSign,
  Users,
  Building2,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useTimeRegion } from '@/hooks/useTimeRegion'

interface AnomalyDetection {
  id: string
  type: 'financial' | 'operational' | 'behavioral'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  detectedAt: string
  confidence: number
  impact: string
  recommendation: string
  status: 'new' | 'investigating' | 'resolved' | 'false_positive'
}

interface SmartSummary {
  id: string
  category: 'financial' | 'operational' | 'strategic'
  title: string
  summary: string
  keyInsights: string[]
  trends: {
    metric: string
    direction: 'up' | 'down' | 'stable'
    percentage: number
    period: string
  }[]
  generatedAt: string
  confidence: number
}

interface PredictiveAnalytics {
  id: string
  metric: string
  currentValue: number
  predictedValue: number
  confidence: number
  timeframe: string
  factors: string[]
  riskLevel: 'low' | 'medium' | 'high'
  recommendation: string
  lastUpdated: string
}

export function AIInsights() {
  const { formatCurrency, formatNumber } = useTimeRegion()
  const [activeTab, setActiveTab] = useState<'anomalies' | 'summaries' | 'predictions'>('anomalies')
  const [loading, setLoading] = useState(false)
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([])
  const [summaries, setSummaries] = useState<SmartSummary[]>([])
  const [predictions, setPredictions] = useState<PredictiveAnalytics[]>([])

  // Mock data generation
  useEffect(() => {
    generateMockData()
  }, [])

  const generateMockData = () => {
    // Generate mock anomalies
    const mockAnomalies: AnomalyDetection[] = [
      {
        id: '1',
        type: 'financial',
        severity: 'high',
        title: 'Unusual Expense Spike Detected',
        description: 'Office supplies expenses increased by 340% compared to last month',
        detectedAt: new Date().toISOString(),
        confidence: 0.92,
        impact: 'High - Could indicate budget overrun',
        recommendation: 'Review recent purchases and implement approval workflow',
        status: 'new'
      },
      {
        id: '2',
        type: 'operational',
        severity: 'medium',
        title: 'Client Payment Delay Pattern',
        description: 'Client ABC Corp has delayed payments 3 times in the last 2 months',
        detectedAt: new Date(Date.now() - 86400000).toISOString(),
        confidence: 0.78,
        impact: 'Medium - Cash flow impact',
        recommendation: 'Follow up with client and consider payment terms adjustment',
        status: 'investigating'
      },
      {
        id: '3',
        type: 'behavioral',
        severity: 'low',
        title: 'Unusual Login Activity',
        description: 'Multiple login attempts from new IP addresses',
        detectedAt: new Date(Date.now() - 172800000).toISOString(),
        confidence: 0.65,
        impact: 'Low - Security monitoring',
        recommendation: 'Verify user identity and consider 2FA implementation',
        status: 'resolved'
      }
    ]

    // Generate mock summaries
    const mockSummaries: SmartSummary[] = [
      {
        id: '1',
        category: 'financial',
        title: 'Monthly Financial Performance Summary',
        summary: 'Your business shows strong revenue growth of 15% month-over-month, with improved profit margins. However, operational expenses have increased significantly.',
        keyInsights: [
          'Revenue increased by 15% compared to last month',
          'Profit margins improved by 3.2%',
          'Operational expenses rose by 22%',
          'Cash flow remains positive despite expense increases'
        ],
        trends: [
          { metric: 'Revenue', direction: 'up', percentage: 15.2, period: 'vs last month' },
          { metric: 'Profit Margin', direction: 'up', percentage: 3.2, period: 'vs last month' },
          { metric: 'Operational Expenses', direction: 'up', percentage: 22.1, period: 'vs last month' }
        ],
        generatedAt: new Date().toISOString(),
        confidence: 0.89
      },
      {
        id: '2',
        category: 'operational',
        title: 'Client Relationship Health Analysis',
        summary: 'Client satisfaction scores are above average, but payment delays are increasing. Focus on improving payment processes.',
        keyInsights: [
          'Client satisfaction score: 4.2/5.0',
          'Payment delay rate increased by 8%',
          'Top 3 clients account for 45% of revenue',
          'Average payment time: 28 days'
        ],
        trends: [
          { metric: 'Client Satisfaction', direction: 'stable', percentage: 0.5, period: 'vs last quarter' },
          { metric: 'Payment Delays', direction: 'up', percentage: 8.3, period: 'vs last quarter' },
          { metric: 'Revenue Concentration', direction: 'stable', percentage: 2.1, period: 'vs last quarter' }
        ],
        generatedAt: new Date(Date.now() - 3600000).toISOString(),
        confidence: 0.76
      }
    ]

    // Generate mock predictions
    const mockPredictions: PredictiveAnalytics[] = [
      {
        id: '1',
        metric: 'Monthly Revenue',
        currentValue: 125000,
        predictedValue: 142000,
        confidence: 0.87,
        timeframe: 'Next Month',
        factors: ['Seasonal trends', 'Client growth', 'Market conditions'],
        riskLevel: 'low',
        recommendation: 'Continue current growth strategies',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        metric: 'Cash Flow',
        currentValue: 45000,
        predictedValue: 38000,
        confidence: 0.73,
        timeframe: 'Next 30 Days',
        factors: ['Payment delays', 'Expense increases', 'Seasonal patterns'],
        riskLevel: 'medium',
        recommendation: 'Monitor payment collections closely',
        lastUpdated: new Date().toISOString()
      },
      {
        id: '3',
        metric: 'Client Churn Rate',
        currentValue: 0.05,
        predictedValue: 0.08,
        confidence: 0.81,
        timeframe: 'Next Quarter',
        factors: ['Payment delays', 'Service quality', 'Competition'],
        riskLevel: 'high',
        recommendation: 'Implement client retention program',
        lastUpdated: new Date().toISOString()
      }
    ]

    setAnomalies(mockAnomalies)
    setSummaries(mockSummaries)
    setPredictions(mockPredictions)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'danger'
      case 'high': return 'warning'
      case 'medium': return 'info'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-danger" />
      case 'high': return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-info" />
      case 'low': return <AlertTriangle className="h-4 w-4 text-secondary" />
      default: return <AlertTriangle className="h-4 w-4 text-secondary" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4 text-primary" />
      case 'investigating': return <Eye className="h-4 w-4 text-warning" />
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success" />
      case 'false_positive': return <XCircle className="h-4 w-4 text-muted" />
      default: return <Clock className="h-4 w-4 text-primary" />
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-success" />
      case 'down': return <ArrowDownRight className="h-4 w-4 text-danger" />
      default: return <Activity className="h-4 w-4 text-muted" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'secondary'
    }
  }

  return (
    <div className="container-fluid ai-insights-page">
      <PageHeader 
        title="AI & Insights"
        subtitle="Leverage artificial intelligence for anomaly detection, smart summaries, and predictive analytics"
      />

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-lg">
            <div className="card-header border-0 px-0 pt-4 pb-0">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${activeTab === 'anomalies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('anomalies')}
                  >
                    <AlertTriangle className="h-4 w-4 me-2" />
                    Anomaly Detection
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${activeTab === 'summaries' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summaries')}
                  >
                    <Lightbulb className="h-4 w-4 me-2" />
                    Smart BI Summaries
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${activeTab === 'predictions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('predictions')}
                  >
                    <Target className="h-4 w-4 me-2" />
                    Predictive Analytics
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content">
                {/* Anomaly Detection Tab */}
                <div className={`tab-pane ${activeTab === 'anomalies' ? 'active' : ''}`}>
                  {activeTab === 'anomalies' && (
                <div className="anomaly-detection">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="mb-1">Anomaly Detection</h5>
                      <p className="text-muted small mb-0">AI-powered detection of unusual patterns in your business data</p>
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
                      <button className="btn btn-primary btn-sm" onClick={generateMockData}>
                        <RefreshCw className="h-4 w-4 me-1" />
                        Refresh
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Anomaly</th>
                          <th>Severity</th>
                          <th>Status</th>
                          <th>Confidence</th>
                          <th>Impact</th>
                          <th>Detected</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {anomalies.map((anomaly) => (
                          <tr key={anomaly.id}>
                            <td>
                              <div>
                                <div className="fw-medium">{anomaly.title}</div>
                                <small className="text-muted">{anomaly.description}</small>
                                <div className="mt-1">
                                  <small className="text-muted">
                                    <strong>Recommendation:</strong> {anomaly.recommendation}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {getSeverityIcon(anomaly.severity)}
                                <span className={`badge bg-${getSeverityColor(anomaly.severity)} ms-2`}>
                                  {anomaly.severity.toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {getStatusIcon(anomaly.status)}
                                <span className="ms-2 small text-muted">{anomaly.status.replace('_', ' ')}</span>
                              </div>
                            </td>
                            <td>
                              <div className="small">
                                <div className="fw-medium">{(anomaly.confidence * 100).toFixed(1)}%</div>
                                <div className="progress" style={{ height: '3px' }}>
                                  <div 
                                    className="progress-bar bg-primary" 
                                    style={{ width: `${anomaly.confidence * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <small className="text-dark">{anomaly.impact}</small>
                            </td>
                            <td>
                              <small className="text-muted">
                                <Calendar className="h-3 w-3 me-1" />
                                {new Date(anomaly.detectedAt).toLocaleDateString()}
                              </small>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary">Investigate</button>
                                <button className="btn btn-outline-secondary">Dismiss</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                  )}
                </div>

                {/* Smart BI Summaries Tab */}
                <div className={`tab-pane ${activeTab === 'summaries' ? 'active' : ''}`}>
                  {activeTab === 'summaries' && (
                <div className="smart-summaries">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="mb-1">Smart BI Summaries</h5>
                      <p className="text-muted small mb-0">AI-generated insights and summaries of your business intelligence data</p>
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
                      <button className="btn btn-primary btn-sm" onClick={generateMockData}>
                        <RefreshCw className="h-4 w-4 me-1" />
                        Generate New
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Summary</th>
                          <th>Category</th>
                          <th>Confidence</th>
                          <th>Key Insights</th>
                          <th>Trends</th>
                          <th>Generated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summaries.map((summary) => (
                          <tr key={summary.id}>
                            <td>
                              <div>
                                <div className="fw-medium">{summary.title}</div>
                                <small className="text-muted">{summary.summary}</small>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Brain className="h-4 w-4 me-2 text-primary" />
                                <span className="badge bg-primary">{summary.category.toUpperCase()}</span>
                              </div>
                            </td>
                            <td>
                              <div className="small">
                                <div className="fw-medium">{(summary.confidence * 100).toFixed(1)}%</div>
                                <div className="progress" style={{ height: '3px' }}>
                                  <div 
                                    className="progress-bar bg-primary" 
                                    style={{ width: `${summary.confidence * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="small">
                                <ul className="list-unstyled mb-0">
                                  {summary.keyInsights.slice(0, 2).map((insight, index) => (
                                    <li key={index} className="mb-1">
                                      <CheckCircle className="h-3 w-3 me-2 text-success" />
                                      {insight}
                                    </li>
                                  ))}
                                  {summary.keyInsights.length > 2 && (
                                    <li className="text-muted">
                                      +{summary.keyInsights.length - 2} more insights
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </td>
                            <td>
                              <div className="small">
                                {summary.trends.slice(0, 2).map((trend, index) => (
                                  <div key={index} className="d-flex justify-content-between align-items-center mb-1">
                                    <div className="d-flex align-items-center">
                                      {getTrendIcon(trend.direction)}
                                      <span className="ms-2">{trend.metric}</span>
                                    </div>
                                    <div className="text-end">
                                      <span className={`small fw-medium ${trend.direction === 'up' ? 'text-success' : trend.direction === 'down' ? 'text-danger' : 'text-muted'}`}>
                                        {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}{trend.percentage}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                                {summary.trends.length > 2 && (
                                  <div className="text-muted">
                                    +{summary.trends.length - 2} more trends
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">
                                <Calendar className="h-3 w-3 me-1" />
                                {new Date(summary.generatedAt).toLocaleDateString()}
                              </small>
                            </td>
                            <td>
                              <button className="btn btn-outline-primary btn-sm">
                                <Eye className="h-4 w-4 me-1" />
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                  )}
                </div>

                {/* Predictive Analytics Tab */}
                <div className={`tab-pane ${activeTab === 'predictions' ? 'active' : ''}`}>
                  {activeTab === 'predictions' && (
                <div className="predictive-analytics">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="mb-1">Predictive Analytics</h5>
                      <p className="text-muted small mb-0">AI-powered predictions and forecasting for your business metrics</p>
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
                      <button className="btn btn-primary btn-sm" onClick={generateMockData}>
                        <RefreshCw className="h-4 w-4 me-1" />
                        Update Predictions
                      </button>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Metric</th>
                          <th>Timeframe</th>
                          <th>Current Value</th>
                          <th>Predicted Value</th>
                          <th>Confidence</th>
                          <th>Risk Level</th>
                          <th>Factors</th>
                          <th>Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {predictions.map((prediction) => (
                          <tr key={prediction.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <Target className="h-4 w-4 me-2 text-primary" />
                                <div className="fw-medium">{prediction.metric}</div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-info">{prediction.timeframe}</span>
                            </td>
                            <td>
                              <div className="fw-medium">
                                {prediction.metric.includes('Rate') || prediction.metric.includes('Rate') 
                                  ? `${(prediction.currentValue * 100).toFixed(1)}%`
                                  : prediction.metric.includes('Revenue') || prediction.metric.includes('Cash Flow')
                                  ? formatCurrency(prediction.currentValue)
                                  : formatNumber(prediction.currentValue)
                                }
                              </div>
                            </td>
                            <td>
                              <div className="fw-medium text-primary">
                                {prediction.metric.includes('Rate') || prediction.metric.includes('Rate') 
                                  ? `${(prediction.predictedValue * 100).toFixed(1)}%`
                                  : prediction.metric.includes('Revenue') || prediction.metric.includes('Cash Flow')
                                  ? formatCurrency(prediction.predictedValue)
                                  : formatNumber(prediction.predictedValue)
                                }
                              </div>
                            </td>
                            <td>
                              <div className="small">
                                <div className="fw-medium">{(prediction.confidence * 100).toFixed(1)}%</div>
                                <div className="progress" style={{ height: '3px' }}>
                                  <div 
                                    className="progress-bar bg-primary" 
                                    style={{ width: `${prediction.confidence * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge bg-${getRiskColor(prediction.riskLevel)}`}>
                                {prediction.riskLevel.toUpperCase()} RISK
                              </span>
                            </td>
                            <td>
                              <div className="small">
                                <ul className="list-unstyled mb-0">
                                  {prediction.factors.slice(0, 2).map((factor, index) => (
                                    <li key={index} className="mb-1">
                                      <Zap className="h-3 w-3 me-2 text-warning" />
                                      {factor}
                                    </li>
                                  ))}
                                  {prediction.factors.length > 2 && (
                                    <li className="text-muted">
                                      +{prediction.factors.length - 2} more factors
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">
                                <Calendar className="h-3 w-3 me-1" />
                                {new Date(prediction.lastUpdated).toLocaleDateString()}
                              </small>
                            </td>
                            <td>
                              <button className="btn btn-outline-primary btn-sm">
                                <Eye className="h-4 w-4 me-1" />
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
