import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useBills, useBillsStats, useOverdueBills } from '@/hooks/useBill'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign,
  Calendar,
  AlertTriangle,
  TrendingUp,
  FileText,
  CreditCard
} from 'lucide-react'

export function BillsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  
  const { data: bills = [], isLoading: billsLoading } = useBills({
    search: searchTerm || undefined,
    status: statusFilter || undefined,
    category: categoryFilter || undefined,
  })
  
  const { data: stats } = useBillsStats()
  const { data: overdueBills = [] } = useOverdueBills()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'pending': return 'warning'
      case 'overdue': return 'danger'
      case 'draft': return 'secondary'
      case 'cancelled': return 'dark'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CreditCard className="h-4 w-4" />
      case 'pending': return <Calendar className="h-4 w-4" />
      case 'overdue': return <AlertTriangle className="h-4 w-4" />
      case 'draft': return <FileText className="h-4 w-4" />
      case 'cancelled': return <Trash2 className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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
        title="Bills & Expenses"
        subtitle="Manage your business expenses and vendor bills"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Finance', path: '/finance' },
          { label: 'Bills', active: true }
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
                    <h6 className="mb-0">{stats.totalBills}</h6>
                    <small className="text-muted">Total Bills</small>
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
                    <small className="text-muted">Total Amount</small>
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

      {/* Overdue Bills Alert */}
      {overdueBills.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <AlertTriangle className="h-5 w-5 me-2" />
                <div>
                  <h6 className="alert-heading mb-1">Overdue Bills Alert</h6>
                  <p className="mb-0">
                    You have {overdueBills.length} overdue bill{overdueBills.length !== 1 ? 's' : ''} totaling {formatCurrency(overdueBills.reduce((sum, bill) => sum + bill.total, 0))}.
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
                <h5 className="card-title mb-0">All Bills</h5>
                <div className="d-flex gap-2">
                  <Link to="/finance/bills/new" className="btn btn-primary">
                    <Plus className="h-4 w-4 me-1" />
                    Add Bill
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
                      placeholder="Search bills..."
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
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="col-md-3 mb-2">
                  <select
                    className="form-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="office_supplies">Office Supplies</option>
                    <option value="rent">Rent</option>
                    <option value="utilities">Utilities</option>
                    <option value="marketing">Marketing</option>
                    <option value="software">Software</option>
                    <option value="travel">Travel</option>
                    <option value="meals">Meals</option>
                    <option value="equipment">Equipment</option>
                    <option value="professional_services">Professional Services</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="col-md-2 mb-2">
                  <button className="btn btn-outline-secondary w-100">
                    <Download className="h-4 w-4 me-1" />
                    Export
                  </button>
                </div>
              </div>

              {/* Bills Table */}
              {billsLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : bills.length === 0 ? (
                <div className="text-center py-5">
                  <FileText className="h-12 w-12 text-muted mb-3" />
                  <h6 className="text-muted mb-2">No bills found</h6>
                  <p className="text-muted mb-4">
                    {searchTerm || statusFilter || categoryFilter 
                      ? 'Try adjusting your filters to see more results.'
                      : 'Start by adding your first bill to track expenses.'
                    }
                  </p>
                  {!searchTerm && !statusFilter && !categoryFilter && (
                    <Link to="/finance/bills/new" className="btn btn-primary">
                      <Plus className="h-4 w-4 me-1" />
                      Add First Bill
                    </Link>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Bill Number</th>
                        <th>Vendor</th>
                        <th>Date</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map((bill) => (
                        <tr key={bill.id}>
                          <td>
                            <div className="fw-medium">{bill.billNumber}</div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-medium">{bill.vendorName}</div>
                              {bill.vendorEmail && (
                                <small className="text-muted">{bill.vendorEmail}</small>
                              )}
                            </div>
                          </td>
                          <td>{formatDate(bill.billDate)}</td>
                          <td>{formatDate(bill.dueDate)}</td>
                          <td>
                            <span className="fw-medium">{formatCurrency(bill.total)}</span>
                          </td>
                          <td>
                            <span className={`badge bg-${getStatusColor(bill.status)} d-flex align-items-center gap-1`}>
                              {getStatusIcon(bill.status)}
                              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <span className="text-capitalize">
                              {bill.category.replace('_', ' ')}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <Link 
                                to={`/finance/bills/${bill.id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="View"
                              >
                                <Eye className="h-3 w-3" />
                              </Link>
                              <Link 
                                to={`/finance/bills/${bill.id}/edit`}
                                className="btn btn-sm btn-outline-secondary"
                                title="Edit"
                              >
                                <Edit className="h-3 w-3" />
                              </Link>
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
