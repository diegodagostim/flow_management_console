import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  Clock,
  BarChart3,
  Target,
  Zap,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useTimeRegion } from '@/hooks/useTimeRegion';

interface AnomalyDetection {
  id: string
  type: 'financial' | 'operational' | 'behavioral' | 'security'
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
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  period: string
  title: string
  summary: string
  keyMetrics: {
    name: string
    value: number
    change: number
    trend: 'up' | 'down' | 'stable'
  }[]
  insights: string[]
  generatedAt: string
}

interface PredictiveAnalytics {
  id: string
  category: 'revenue' | 'expenses' | 'clients' | 'operations'
  metric: string
  currentValue: number
  predictedValue: number
  confidence: number
  timeframe: string
  factors: string[]
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

  // Initialize empty state
  useEffect(() => {
    setAnomalies([])
    setSummaries([])
    setPredictions([])
  }, [])

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
      case 'critical': return AlertTriangle
      case 'high': return AlertTriangle
      case 'medium': return Clock
      case 'low': return CheckCircle
      default: return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'primary'
      case 'investigating': return 'warning'
      case 'resolved': return 'success'
      case 'false_positive': return 'secondary'
      default: return 'secondary'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp
      case 'down': return TrendingUp
      case 'stable': return BarChart3
      default: return BarChart3
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'success'
      case 'down': return 'danger'
      case 'stable': return 'info'
      default: return 'info'
    }
  }

  const criticalAnomalies = anomalies.filter(a => a.severity === 'critical').length
  const highAnomalies = anomalies.filter(a => a.severity === 'high').length
  const resolvedAnomalies = anomalies.filter(a => a.status === 'resolved').length
  const totalInsights = summaries.length + predictions.length

  return (
    <div className="container-fluid ai-insights-page">
      {/* Page Header */}
      <PageHeader 
        title="AI Insights & Analytics"
        subtitle="Intelligent anomaly detection, smart summaries, and predictive analytics"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'AI & Insights', active: true }
        ]}
      />

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-danger">
                  <AlertTriangle className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-danger">{criticalAnomalies}</h4>
              <p className="text-muted mb-0 small">Critical Issues</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-warning">
                  <AlertTriangle className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-warning">{highAnomalies}</h4>
              <p className="text-muted mb-0 small">High Priority</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-success">
                  <CheckCircle className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-success">{resolvedAnomalies}</h4>
              <p className="text-muted mb-0 small">Resolved</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-primary">
                  <Brain className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-primary">{totalInsights}</h4>
              <p className="text-muted mb-0 small">Total Insights</p>
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
                    className={`nav-link ${activeTab === 'anomalies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('anomalies')}
                    type="button"
                  >
                    <AlertTriangle className="h-4 w-4 me-2" />
                    Anomalies ({anomalies.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'summaries' ? 'active' : ''}`}
                    onClick={() => setActiveTab('summaries')}
                    type="button"
                  >
                    <FileText className="h-4 w-4 me-2" />
                    Summaries ({summaries.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'predictions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('predictions')}
                    type="button"
                  >
                    <TrendingUp className="h-4 w-4 me-2" />
                    Predictions ({predictions.length})
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {/* Anomalies Tab */}
              {activeTab === 'anomalies' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Anomaly Detection</h6>
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-secondary btn-sm">
                        <Filter className="h-4 w-4 me-1" />
                        Filter
                      </button>
                      <button className="btn btn-outline-primary btn-sm">
                        <RefreshCw className="h-4 w-4 me-1" />
                        Refresh
                      </button>
                    </div>
                  </div>
                  {anomalies.length === 0 ? (
                    <div className="text-center py-5">
                      <AlertTriangle className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No anomalies detected</p>
                      <small className="text-muted">AI will automatically detect unusual patterns in your data</small>
                    </div>
                  ) : (
                    <div className="row">
                      {anomalies.map((anomaly) => {
                        const SeverityIcon = getSeverityIcon(anomaly.severity)
                        return (
                          <div key={anomaly.id} className="col-md-6 col-lg-4 mb-3">
                            <div className="card border h-100">
                              <div className="card-header d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                  <SeverityIcon className={`h-4 w-4 me-2 text-${getSeverityColor(anomaly.severity)}`} />
                                  <span className={`badge bg-label-${getSeverityColor(anomaly.severity)}`}>
                                    {anomaly.severity}
                                  </span>
                                </div>
                                <span className={`badge bg-label-${getStatusColor(anomaly.status)}`}>
                                  {anomaly.status}
                                </span>
                              </div>
                              <div className="card-body">
                                <h6 className="card-title">{anomaly.title}</h6>
                                <p className="card-text small text-muted mb-2">{anomaly.description}</p>
                                <div className="mb-2">
                                  <small className="text-muted">Confidence: </small>
                                  <span className="fw-semibold">{Math.round(anomaly.confidence * 100)}%</span>
                                </div>
                                <div className="mb-2">
                                  <small className="text-muted">Impact: </small>
                                  <span className="fw-semibold">{anomaly.impact}</span>
                                </div>
                                <div className="mb-3">
                                  <small className="text-muted">Recommendation:</small>
                                  <p className="small mb-0">{anomaly.recommendation}</p>
                                </div>
                                <div className="d-flex gap-1">
                                  <button className="btn btn-sm btn-outline-primary">
                                    <Eye className="h-3 w-3" />
                                  </button>
                                  <button className="btn btn-sm btn-outline-success">
                                    <CheckCircle className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Summaries Tab */}
              {activeTab === 'summaries' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Smart Summaries</h6>
                    <button className="btn btn-primary btn-sm">
                      <Brain className="h-4 w-4 me-1" />
                      Generate Summary
                    </button>
                  </div>
                  {summaries.length === 0 ? (
                    <div className="text-center py-5">
                      <FileText className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No summaries available</p>
                      <small className="text-muted">Generate AI-powered summaries of your business data</small>
                    </div>
                  ) : (
                    <div className="row">
                      {summaries.map((summary) => (
                        <div key={summary.id} className="col-md-6 mb-3">
                          <div className="card border h-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">{summary.title}</h6>
                              <span className="badge bg-label-info">{summary.type}</span>
                            </div>
                            <div className="card-body">
                              <p className="card-text mb-3">{summary.summary}</p>
                              <div className="mb-3">
                                <h6 className="small mb-2">Key Metrics:</h6>
                                <div className="row">
                                  {summary.keyMetrics.map((metric, index) => {
                                    const TrendIcon = getTrendIcon(metric.trend)
                                    return (
                                      <div key={index} className="col-6 mb-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                          <small className="text-muted">{metric.name}</small>
                                          <div className="d-flex align-items-center">
                                            <TrendIcon className={`h-3 w-3 me-1 text-${getTrendColor(metric.trend)}`} />
                                            <small className={`fw-semibold text-${getTrendColor(metric.trend)}`}>
                                              {metric.change > 0 ? '+' : ''}{metric.change}%
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                              <div className="mb-3">
                                <h6 className="small mb-2">Key Insights:</h6>
                                <ul className="list-unstyled small">
                                  {summary.insights.map((insight, index) => (
                                    <li key={index} className="mb-1">
                                      <Zap className="h-3 w-3 me-1 text-warning" />
                                      {insight}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <small className="text-muted">
                                Generated: {new Date(summary.generatedAt).toLocaleDateString()}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Predictions Tab */}
              {activeTab === 'predictions' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Predictive Analytics</h6>
                    <button className="btn btn-primary btn-sm">
                      <Target className="h-4 w-4 me-1" />
                      Generate Predictions
                    </button>
                  </div>
                  {predictions.length === 0 ? (
                    <div className="text-center py-5">
                      <TrendingUp className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">No predictions available</p>
                      <small className="text-muted">Generate AI-powered predictions based on your historical data</small>
                    </div>
                  ) : (
                    <div className="row">
                      {predictions.map((prediction) => (
                        <div key={prediction.id} className="col-md-6 col-lg-4 mb-3">
                          <div className="card border h-100">
                            <div className="card-header">
                              <h6 className="mb-0">{prediction.metric}</h6>
                              <small className="text-muted">{prediction.category}</small>
                            </div>
                            <div className="card-body">
                              <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <small className="text-muted">Current</small>
                                  <span className="fw-semibold">{formatNumber(prediction.currentValue)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                  <small className="text-muted">Predicted</small>
                                  <span className="fw-semibold text-primary">{formatNumber(prediction.predictedValue)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">Confidence</small>
                                  <span className="fw-semibold">{Math.round(prediction.confidence * 100)}%</span>
                                </div>
                              </div>
                              <div className="mb-3">
                                <small className="text-muted">Timeframe: {prediction.timeframe}</small>
                              </div>
                              <div className="mb-3">
                                <h6 className="small mb-2">Key Factors:</h6>
                                <ul className="list-unstyled small">
                                  {prediction.factors.map((factor, index) => (
                                    <li key={index} className="mb-1">
                                      <Target className="h-3 w-3 me-1 text-info" />
                                      {factor}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="mb-3">
                                <h6 className="small mb-2">Recommendation:</h6>
                                <p className="small mb-0">{prediction.recommendation}</p>
                              </div>
                              <small className="text-muted">
                                Updated: {new Date(prediction.lastUpdated).toLocaleDateString()}
                              </small>
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
      </div>
    </div>
  );
}

