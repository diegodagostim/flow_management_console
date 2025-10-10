import React, { useState, useMemo } from 'react'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useTransactions, useUnreconciledTransactions } from '@/hooks/useTransaction'
import { useMarkTransactionAsReconciled } from '@/hooks/useTransaction'
import { useTimeRegion } from '@/hooks/useTimeRegion'
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Upload,
  Settings,
  Zap,
  CreditCard,
  DollarSign,
  Calendar,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  Activity
} from 'lucide-react'

interface ReconciliationRule {
  id: string
  name: string
  processor: 'stripe' | 'paypal' | 'square' | 'bank' | 'manual'
  fieldMappings: Record<string, string>
  autoMatch: boolean
  isActive: boolean
}

interface ExternalTransaction {
  id: string
  processor: 'stripe' | 'paypal' | 'square' | 'bank' | 'manual'
  processorTransactionId: string
  amount: number
  currency: string
  description: string
  transactionDate: string
  status: string
  matchedTransactionId?: string
  reconciliationStatus: 'pending' | 'matched' | 'unmatched' | 'ignored'
}

export function AutomatedReconciliation() {
  const [selectedProcessor, setSelectedProcessor] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMatchedOnly, setShowMatchedOnly] = useState(false)
  
  const { data: allTransactions = [] } = useTransactions()
  const { data: unreconciledTransactions = [] } = useUnreconciledTransactions()
  const markAsReconciled = useMarkTransactionAsReconciled()
  const { formatCurrency } = useTimeRegion()

  // Reconciliation rules will be loaded from API
  const reconciliationRules: ReconciliationRule[] = [
    {
      id: '1',
      name: 'Stripe Payment Matching',
      processor: 'stripe',
      fieldMappings: {
        amount: 'amount',
        date: 'created',
        description: 'description'
      },
      autoMatch: true,
      isActive: true
    },
    {
      id: '2',
      name: 'PayPal Transaction Matching',
      processor: 'paypal',
      fieldMappings: {
        amount: 'gross_amount',
        date: 'time_created',
        description: 'item_name'
      },
      autoMatch: true,
      isActive: true
    },
    {
      id: '3',
      name: 'Bank Transfer Matching',
      processor: 'bank',
      fieldMappings: {
        amount: 'amount',
        date: 'date',
        description: 'memo'
      },
      autoMatch: false,
      isActive: true
    }
  ]

  // External transactions will be loaded from API
  const externalTransactions: ExternalTransaction[] = []

  // Filter external transactions
  const filteredExternalTransactions = useMemo(() => {
    return externalTransactions.filter(transaction => {
      if (selectedProcessor && transaction.processor !== selectedProcessor) return false
      if (selectedStatus && transaction.reconciliationStatus !== selectedStatus) return false
      if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) return false
      if (showMatchedOnly && transaction.reconciliationStatus !== 'matched') return false
      return true
    })
  }, [selectedProcessor, selectedStatus, searchTerm, showMatchedOnly])

  // Calculate reconciliation statistics
  const reconciliationStats = useMemo(() => {
    const total = externalTransactions.length
    const matched = externalTransactions.filter(t => t.reconciliationStatus === 'matched').length
    const pending = externalTransactions.filter(t => t.reconciliationStatus === 'pending').length
    const unmatched = externalTransactions.filter(t => t.reconciliationStatus === 'unmatched').length
    const matchRate = total > 0 ? (matched / total) * 100 : 0

    return {
      total,
      matched,
      pending,
      unmatched,
      matchRate
    }
  }, [externalTransactions])


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'success'
      case 'pending': return 'warning'
      case 'unmatched': return 'danger'
      case 'ignored': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'unmatched': return <XCircle className="h-4 w-4" />
      case 'ignored': return <X className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getProcessorIcon = (processor: string) => {
    switch (processor) {
      case 'stripe': return <CreditCard className="h-4 w-4" />
      case 'paypal': return <DollarSign className="h-4 w-4" />
      case 'square': return <Activity className="h-4 w-4" />
      case 'bank': return <DollarSign className="h-4 w-4" />
      default: return <CreditCard className="h-4 w-4" />
    }
  }

  const handleAutoReconcile = () => {
    // TODO: Implement auto-reconciliation process
    console.log('Starting auto-reconciliation...')
  }

  const handleManualMatch = (externalTransactionId: string, transactionId: string) => {
    // TODO: Implement manual matching process
    console.log(`Matching external transaction ${externalTransactionId} with transaction ${transactionId}`)
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <PageHeader 
        title="Automated Reconciliation"
        subtitle="Automatically match transactions with payment processor data"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Finance', path: '/finance' },
          { label: 'Reconciliation', active: true }
        ]}
      />

      {/* Statistics Overview */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-primary">
                    <Activity className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h6 className="mb-0">{reconciliationStats.total}</h6>
                  <small className="text-muted">Total Transactions</small>
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
                  <span className="avatar-initial rounded bg-label-success">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h6 className="mb-0">{reconciliationStats.matched}</h6>
                  <small className="text-muted">Matched</small>
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
                  <span className="avatar-initial rounded bg-label-warning">
                    <Clock className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h6 className="mb-0">{reconciliationStats.pending}</h6>
                  <small className="text-muted">Pending</small>
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
                    <Zap className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h6 className="mb-0">{reconciliationStats.matchRate.toFixed(1)}%</h6>
                  <small className="text-muted">Match Rate</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2">
                  <button className="btn btn-primary w-100" onClick={handleAutoReconcile}>
                    <RefreshCw className="h-4 w-4 me-1" />
                    Auto Reconcile
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-outline-secondary w-100">
                    <Upload className="h-4 w-4 me-1" />
                    Import Data
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-outline-secondary w-100">
                    <Download className="h-4 w-4 me-1" />
                    Export Report
                  </button>
                </div>
                <div className="col-md-2">
                  <button className="btn btn-outline-secondary w-100">
                    <Settings className="h-4 w-4 me-1" />
                    Rules
                  </button>
                </div>
                <div className="col-md-4">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="showMatchedOnly"
                      checked={showMatchedOnly}
                      onChange={(e) => setShowMatchedOnly(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="showMatchedOnly">
                      Show matched only
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-2">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="col-md-3 mb-2">
                  <select
                    className="form-select"
                    value={selectedProcessor}
                    onChange={(e) => setSelectedProcessor(e.target.value)}
                  >
                    <option value="">All Processors</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                    <option value="square">Square</option>
                    <option value="bank">Bank</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                
                <div className="col-md-3 mb-2">
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="matched">Matched</option>
                    <option value="unmatched">Unmatched</option>
                    <option value="ignored">Ignored</option>
                  </select>
                </div>
                
                <div className="col-md-2 mb-2">
                  <button className="btn btn-outline-secondary w-100">
                    <Filter className="h-4 w-4 me-1" />
                    More Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reconciliation Rules */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <Settings className="h-5 w-5 me-2" />
                Reconciliation Rules
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                {reconciliationRules.map((rule) => (
                  <div key={rule.id} className="col-md-4 mb-3">
                    <div className="card border h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-0">{rule.name}</h6>
                          <span className={`badge bg-${rule.isActive ? 'success' : 'secondary'}`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-muted small mb-2">
                          Processor: {rule.processor.charAt(0).toUpperCase() + rule.processor.slice(1)}
                        </p>
                        <p className="text-muted small mb-3">
                          Auto-match: {rule.autoMatch ? 'Enabled' : 'Disabled'}
                        </p>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary">
                            <Eye className="h-3 w-3" />
                          </button>
                          <button className="btn btn-sm btn-outline-secondary">
                            <Settings className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Transactions Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <Activity className="h-5 w-5 me-2" />
                External Transactions
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Processor</th>
                      <th>Transaction ID</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Reconciliation</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExternalTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {getProcessorIcon(transaction.processor)}
                            <span className="ms-2 text-capitalize">{transaction.processor}</span>
                          </div>
                        </td>
                        <td>
                          <code className="small">{transaction.processorTransactionId}</code>
                        </td>
                        <td>
                          <span className="fw-medium">{formatCurrency(transaction.amount)}</span>
                        </td>
                        <td>{transaction.description}</td>
                        <td>{formatDate(transaction.transactionDate)}</td>
                        <td>
                          <span className={`badge bg-${transaction.status === 'succeeded' || transaction.status === 'completed' ? 'success' : 'warning'}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusColor(transaction.reconciliationStatus)} d-flex align-items-center gap-1`}>
                            {getStatusIcon(transaction.reconciliationStatus)}
                            {transaction.reconciliationStatus.charAt(0).toUpperCase() + transaction.reconciliationStatus.slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {transaction.reconciliationStatus === 'pending' && (
                              <>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  title="Match"
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  title="Ignore"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </>
                            )}
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              title="View Details"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                          </div>
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
