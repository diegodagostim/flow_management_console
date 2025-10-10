import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  FileText, 
  Calendar, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useClient, useContractsByClient, useCreateContract, useUpdateContract, useDeleteContract } from '@/hooks/useClientManagement';
import { useTimeRegion } from '@/hooks/useTimeRegion';
import type { Contract, CreateContractInput, UpdateContractInput } from '@/core/models/ClientManagement';

export function ContractManagement() {
  const { id } = useParams<{ id: string }>();
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const { settings } = useTimeRegion();
  const [formData, setFormData] = useState<CreateContractInput>({
    clientId: id || '',
    name: '',
    type: 'subscription',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    billingCycle: 'monthly',
    amount: 0,
    currency: settings.currency,
    autoRenew: true,
    terms: '',
    notes: '',
  });

  const { data: client } = useClient(id || '');
  const { data: contracts = [], isLoading } = useContractsByClient(id || '');
  const createContractMutation = useCreateContract();
  const updateContractMutation = useUpdateContract();
  const deleteContractMutation = useDeleteContract();
  const { formatDate, formatCurrency } = useTimeRegion();

  const handleInputChange = (field: keyof CreateContractInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContract) {
        await updateContractMutation.mutateAsync({
          id: editingContract.id!,
          input: formData as UpdateContractInput,
        });
      } else {
        await createContractMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingContract(null);
      setFormData({
        clientId: id || '',
        name: '',
        type: 'subscription',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        billingCycle: 'monthly',
        amount: 0,
        currency: settings.currency,
        autoRenew: true,
        terms: '',
        notes: '',
      });
    } catch (error) {
      console.error('Failed to save contract:', error);
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      clientId: contract.clientId,
      name: contract.name,
      type: contract.type,
      status: contract.status,
      startDate: contract.startDate.split('T')[0],
      endDate: contract.endDate ? contract.endDate.split('T')[0] : '',
      billingCycle: contract.billingCycle,
      amount: contract.amount,
      currency: contract.currency,
      autoRenew: contract.autoRenew,
      terms: contract.terms || '',
      notes: contract.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (contractId: string, contractName: string) => {
    if (window.confirm(`Are you sure you want to delete contract "${contractName}"?`)) {
      try {
        await deleteContractMutation.mutateAsync(contractId);
      } catch (error) {
        console.error('Failed to delete contract:', error);
      }
    }
  };

  const getStatusBadge = (status: Contract['status']) => {
    const statusConfig = {
      active: { color: 'success', icon: CheckCircle },
      expired: { color: 'secondary', icon: Clock },
      cancelled: { color: 'danger', icon: XCircle },
      pending: { color: 'warning', icon: Clock },
      suspended: { color: 'info', icon: AlertCircle },
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`badge bg-label-${config.color} text-${config.color}`}>
        <Icon className="h-3 w-3 me-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: Contract['type']) => {
    const typeConfig = {
      subscription: { color: 'primary', label: 'Subscription' },
      'one-time': { color: 'info', label: 'One-time' },
      recurring: { color: 'success', label: 'Recurring' },
      custom: { color: 'secondary', label: 'Custom' },
    };
    
    const config = typeConfig[type];
    
    return (
      <span className={`badge bg-label-${config.color} text-${config.color}`}>
        {config.label}
      </span>
    );
  };

  const totalValue = contracts.reduce((sum, contract) => sum + contract.amount, 0);
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const expiringContracts = contracts.filter(c => {
    if (!c.endDate) return false;
    const endDate = new Date(c.endDate);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return endDate <= thirtyDaysFromNow && c.status === 'active';
  }).length;

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <PageHeader 
        title={`Contracts - ${client?.name || 'Client'}`}
        subtitle="Manage client contracts and subscriptions"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Clients', path: '/clients' },
          { label: client?.name || 'Client', path: `/clients/${id}` },
          { label: 'Contracts', active: true }
        ]}
      />

      {/* Stats Overview */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-primary">
                    <FileText className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-primary">{contracts.length}</h4>
                  <p className="text-muted mb-0">Total Contracts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-success">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-success">{activeContracts}</h4>
                  <p className="text-muted mb-0">Active Contracts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-warning">
                    <AlertCircle className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-warning">{expiringContracts}</h4>
                  <p className="text-muted mb-0">Expiring Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar avatar-md me-3">
                  <span className="avatar-initial rounded bg-label-info">
                    <DollarSign className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-info">{formatCurrency(totalValue)}</h4>
                  <p className="text-muted mb-0">Total Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Contract Management</h6>
                  <p className="text-muted mb-0">Manage all contracts and subscriptions for this client</p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="h-4 w-4 me-1" />
                    Refresh
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingContract(null);
                      setShowForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 me-1" />
                    Add Contract
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Form Modal */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingContract ? 'Edit Contract' : 'Add New Contract'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowForm(false);
                    setEditingContract(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Contract Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Type *</label>
                      <select
                        className="form-select"
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        required
                      >
                        <option value="subscription">Subscription</option>
                        <option value="one-time">One-time</option>
                        <option value="recurring">Recurring</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status *</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        required
                      >
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Billing Cycle *</label>
                      <select
                        className="form-select"
                        value={formData.billingCycle}
                        onChange={(e) => handleInputChange('billingCycle', e.target.value)}
                        required
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Start Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Amount *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.amount}
                          onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Currency</label>
                      <select
                        className="form-select"
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.autoRenew}
                          onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
                        />
                        <label className="form-check-label">
                          Auto-renewal enabled
                        </label>
                      </div>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Terms & Conditions</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.terms}
                        onChange={(e) => handleInputChange('terms', e.target.value)}
                        placeholder="Enter contract terms..."
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Additional notes..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingContract(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={createContractMutation.isPending || updateContractMutation.isPending}
                  >
                    {(createContractMutation.isPending || updateContractMutation.isPending) ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Saving...</span>
                        </div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 me-1" />
                        {editingContract ? 'Update Contract' : 'Create Contract'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contracts Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 pb-2">
              <h6 className="card-title mb-0">Contracts</h6>
            </div>
            <div className="card-body p-0">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-2">Loading contracts...</p>
                </div>
              ) : contracts.length === 0 ? (
                <div className="text-center py-5">
                  <FileText className="h-16 w-16 text-muted mb-3" />
                  <h5 className="text-muted">No contracts found</h5>
                  <p className="text-muted">Get started by creating the first contract for this client.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingContract(null);
                      setShowForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 me-1" />
                    Create First Contract
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Contract</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Period</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Auto Renew</th>
                        <th width="100">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contracts.map((contract) => (
                        <tr key={contract.id}>
                          <td>
                            <div>
                              <h6 className="mb-0">{contract.name}</h6>
                              {contract.notes && (
                                <small className="text-muted">{contract.notes}</small>
                              )}
                            </div>
                          </td>
                          <td>{getTypeBadge(contract.type)}</td>
                          <td>{getStatusBadge(contract.status)}</td>
                          <td>
                            <span className="fw-medium">
                              {formatCurrency(contract.amount)} {contract.currency}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-label-info">
                              {contract.billingCycle.charAt(0).toUpperCase() + contract.billingCycle.slice(1)}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatDate(contract.startDate)}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {contract.endDate ? formatDate(contract.endDate) : 'N/A'}
                            </small>
                          </td>
                          <td>
                            {contract.autoRenew ? (
                              <span className="badge bg-label-success">
                                <CheckCircle className="h-3 w-3 me-1" />
                                Yes
                              </span>
                            ) : (
                              <span className="badge bg-label-secondary">
                                <XCircle className="h-3 w-3 me-1" />
                                No
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button 
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() => handleEdit(contract)}
                                  >
                                    <Edit className="h-4 w-4 me-2" />
                                    Edit Contract
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item d-flex align-items-center">
                                    <Eye className="h-4 w-4 me-2" />
                                    View Details
                                  </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <button 
                                    className="dropdown-item d-flex align-items-center text-danger"
                                    onClick={() => handleDelete(contract.id!, contract.name)}
                                  >
                                    <Trash2 className="h-4 w-4 me-2" />
                                    Delete Contract
                                  </button>
                                </li>
                              </ul>
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
  );
}
