import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useInvoices, useInvoicesStats, useOverdueInvoices } from '@/hooks/useInvoice'
import { useTimeRegion } from '@/hooks/useTimeRegion'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Send,
  CreditCard,
  Calendar,
  AlertTriangle,
  TrendingUp,
  FileText,
  DollarSign,
  Trash2
} from 'lucide-react'

export function SalesInvoices() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [clientFilter, setClientFilter] = useState<string>('')
  
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices({
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    clientName: clientFilter || undefined,
  })
  
  const { data: stats } = useInvoicesStats()
  const { data: overdueInvoices = [] } = useOverdueInvoices()
  const { formatCurrency } = useTimeRegion()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'sent': return 'info'
      case 'viewed': return 'primary'
      case 'overdue': return 'danger'
      case 'draft': return 'secondary'
      case 'cancelled': return 'dark'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CreditCard className="h-4 w-4" />
      case 'sent': return <Send className="h-4 w-4" />
      case 'viewed': return <Eye className="h-4 w-4" />
      case 'overdue': return <AlertTriangle className="h-4 w-4" />
      case 'draft': return <FileText className="h-4 w-4" />
      case 'cancelled': return <Trash2 className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <PageHeader 
        title="Sales Invoices"
        subtitle="Manage your sales invoices and track payments"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Finance', path: '/finance' },
          { label: 'Invoices', active: true }
        ]}
      />

      {/* Stats Overview */}
      {stats && (
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-md me-3">
                    <span className="avatar-initial rounded bg-label-primary">
                      <FileText className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <h6 className="mb-0">{stats.totalInvoices}</h6>
                    <small className="text-muted">Total Invoices</small>
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
                      <DollarSign className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <h6 className="mb-0">{formatCurrency(stats.totalAmount)}</h6>
                    <small className="text-muted">Total Revenue</small>
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
                      <Calendar className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <h6 className="mb-0">{formatCurrency(stats.pendingAmount)}</h6>
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
                    <span className="avatar-initial rounded bg-label-danger">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <h6 className="mb-0">{formatCurrency(stats.overdueAmount)}</h6>
                    <small className="text-muted">Overdue</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Invoices Alert */}
      {overdueInvoices.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <AlertTriangle className="h-5 w-5 me-2" />
                <div>
                  <h6 className="alert-heading mb-1">Overdue Invoices Alert</h6>
                  <p className="mb-0">
                    You have {overdueInvoices.length} overdue invoice{overdueInvoices.length !== 1 ? 's' : ''} totaling {formatCurrency(overdueInvoices.reduce((sum, invoice) => sum + invoice.total, 0))}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">All Invoices</h5>
                <div className="d-flex gap-2">
                  <Link to="/finance/invoices/new" className="btn btn-primary">
                    <Plus className="h-4 w-4 me-1" />
                    Create Invoice
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-4 mb-2">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search invoices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="col-md-3 mb-2">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="viewed">Viewed</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="col-md-3 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Client name..."
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                  />
                </div>
                
                <div className="col-md-2 mb-2">
                  <button className="btn btn-outline-secondary w-100">
                    <Download className="h-4 w-4 me-1" />
                    Export
                  </button>
                </div>
              </div>

              {/* Invoices Table */}
              {invoicesLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-5">
                  <FileText className="h-12 w-12 text-muted mb-3" />
                  <h6 className="text-muted mb-2">No invoices found</h6>
                  <p className="text-muted mb-4">
                    {searchTerm || statusFilter || clientFilter 
                      ? 'Try adjusting your filters to see more results.'
                      : 'Start by creating your first invoice to track sales.'
                    }
                  </p>
                  {!searchTerm && !statusFilter && !clientFilter && (
                    <Link to="/finance/invoices/new" className="btn btn-primary">
                      <Plus className="h-4 w-4 me-1" />
                      Create First Invoice
                    </Link>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Invoice Number</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td>
                            <div className="fw-medium">{invoice.invoiceNumber}</div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium">{invoice.clientName}</div>
                              <small className="text-muted">{invoice.clientEmail}</small>
                            </div>
                          </td>
                          <td>{formatDate(invoice.invoiceDate)}</td>
                          <td>{formatDate(invoice.dueDate)}</td>
                          <td>
                            <span className="fw-medium">{formatCurrency(invoice.total)}</span>
                          </td>
                          <td>
                            <span className={`badge bg-${getStatusColor(invoice.status)} d-flex align-items-center gap-1`}>
                              {getStatusIcon(invoice.status)}
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Link 
                                to={`/finance/invoices/${invoice.id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="View"
                              >
                                <Eye className="h-3 w-3" />
                              </Link>
                              <Link 
                                to={`/finance/invoices/${invoice.id}/edit`}
                                className="btn btn-sm btn-outline-secondary"
                                title="Edit"
                              >
                                <Edit className="h-3 w-3" />
                              </Link>
                              {invoice.status === 'draft' && (
                                <button 
                                  className="btn btn-sm btn-outline-info"
                                  title="Send"
                                >
                                  <Send className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
