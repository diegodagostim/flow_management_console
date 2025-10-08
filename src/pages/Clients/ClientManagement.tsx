import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useClients, useDeleteClient } from '@/hooks/useClientManagement';
import type { Client, ClientFilters } from '@/core/models/ClientManagement';

export function ClientManagement() {
  const [filters, setFilters] = useState<ClientFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Client['status'] | ''>('');
  const [selectedTier, setSelectedTier] = useState<Client['tier'] | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: clients = [], isLoading, error } = useClients(filters);
  const deleteClientMutation = useDeleteClient();

  if (error) {
    return (
      <div className="container-fluid">
        <PageHeader
          title="Client Management"
          subtitle="Manage your clients and customer relationships"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Clients', active: true }
          ]}
        />
        <div className="alert alert-danger">
          <AlertCircle className="h-4 w-4 me-2" />
          Failed to load clients. Please try again.
        </div>
      </div>
    );
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const handleStatusFilter = (status: Client['status'] | '') => {
    setSelectedStatus(status);
    setFilters(prev => ({ ...prev, status: status || undefined }));
  };

  const handleTierFilter = (tier: Client['tier'] | '') => {
    setSelectedTier(tier);
    setFilters(prev => ({ ...prev, tier: tier || undefined }));
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete client "${name}"? This action cannot be undone.`)) {
      try {
        await deleteClientMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  const getStatusBadge = (status: Client['status']) => {
    const statusConfig = {
      active: { color: 'success', icon: CheckCircle },
      inactive: { color: 'secondary', icon: Clock },
      suspended: { color: 'danger', icon: AlertCircle },
      pending: { color: 'warning', icon: Clock },
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;
    
    return (
      <span className={`badge bg-label-${config.color}`}>
        <Icon className="h-3 w-3 me-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTierBadge = (tier: Client['tier']) => {
    const tierConfig = {
      basic: { color: 'info', label: 'Basic' },
      professional: { color: 'primary', label: 'Professional' },
      enterprise: { color: 'warning', label: 'Enterprise' },
      custom: { color: 'secondary', label: 'Custom' },
    };
    
    const config = tierConfig[tier] || tierConfig.basic;
    
    return (
      <span className={`badge bg-label-${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <PageHeader 
        title="Client Management"
        subtitle="Manage your clients, contracts, billing, and analytics"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Clients', active: true }
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
                    <Users className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-primary">{clients.length}</h4>
                  <p className="text-muted mb-0">Total Clients</p>
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
                  <h4 className="mb-1 text-success">
                    {clients.filter(c => c.status === 'active').length}
                  </h4>
                  <p className="text-muted mb-0">Active Clients</p>
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
                  <h4 className="mb-1 text-warning">
                    {clients.filter(c => c.status === 'pending').length}
                  </h4>
                  <p className="text-muted mb-0">Pending</p>
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
                    <Building2 className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-info">
                    {clients.filter(c => c.tier === 'enterprise').length}
                  </h4>
                  <p className="text-muted mb-0">Enterprise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="d-flex gap-2">
                    <Link to="/clients/new" className="btn btn-primary">
                      <Plus className="h-4 w-4 me-1" />
                      Add Client
                    </Link>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 me-1" />
                      Filters
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <Search className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="row mt-3 pt-3 border-top">
                  <div className="col-md-4">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select"
                      value={selectedStatus}
                      onChange={(e) => handleStatusFilter(e.target.value as Client['status'] | '')}
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Tier</label>
                    <select 
                      className="form-select"
                      value={selectedTier}
                      onChange={(e) => handleTierFilter(e.target.value as Client['tier'] | '')}
                    >
                      <option value="">All Tiers</option>
                      <option value="basic">Basic</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setFilters({});
                        setSearchTerm('');
                        setSelectedStatus('');
                        setSelectedTier('');
                      }}
                    >
                      <X className="h-4 w-4 me-1" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm client-management-table">
            <div className="card-header bg-transparent border-0 pb-2">
              <h6 className="card-title mb-0">Clients</h6>
            </div>
            <div className="card-body p-0">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted mt-2">Loading clients...</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center py-5">
                  <Users className="h-16 w-16 text-muted mb-3" />
                  <h5 className="text-muted">No clients found</h5>
                  <p className="text-muted">Get started by adding your first client.</p>
                  <Link to="/clients/new" className="btn btn-primary">
                    <Plus className="h-4 w-4 me-1" />
                    Add First Client
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Client</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Tier</th>
                        <th>Contact</th>
                        <th>Created</th>
                        <th width="100">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar avatar-sm me-3">
                                <span className="avatar-initial rounded bg-label-primary">
                                  {client.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h6 className="mb-0">{client.name}</h6>
                                <small className="text-muted">{client.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-medium">{client.company}</span>
                          </td>
                          <td>
                            {getStatusBadge(client.status || 'inactive')}
                          </td>
                          <td>
                            {getTierBadge(client.tier || 'basic')}
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              {client.phone && (
                                <small className="text-muted d-flex align-items-center">
                                  <Phone className="h-3 w-3 me-1" />
                                  {client.phone}
                                </small>
                              )}
                              {client.address?.city && (
                                <small className="text-muted d-flex align-items-center">
                                  <MapPin className="h-3 w-3 me-1" />
                                  {client.address.city}
                                </small>
                              )}
                            </div>
                          </td>
                          <td>
                            <small className="text-muted d-flex align-items-center">
                              <Calendar className="h-3 w-3 me-1" />
                              {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'N/A'}
                            </small>
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
                                  <Link 
                                    className="dropdown-item d-flex align-items-center"
                                    to={`/clients/${client.id}`}
                                  >
                                    <Eye className="h-4 w-4 me-2" />
                                    View Details
                                  </Link>
                                </li>
                                <li>
                                  <Link 
                                    className="dropdown-item d-flex align-items-center"
                                    to={`/clients/${client.id}/edit`}
                                  >
                                    <Edit className="h-4 w-4 me-2" />
                                    Edit Client
                                  </Link>
                                </li>
                                <li>
                                  <Link 
                                    className="dropdown-item d-flex align-items-center"
                                    to={`/clients/${client.id}/contracts`}
                                  >
                                    <FileText className="h-4 w-4 me-2" />
                                    Contracts
                                  </Link>
                                </li>
                                <li>
                                  <Link 
                                    className="dropdown-item d-flex align-items-center"
                                    to={`/clients/${client.id}/billing`}
                                  >
                                    <CreditCard className="h-4 w-4 me-2" />
                                    Billing
                                  </Link>
                                </li>
                                <li>
                                  <Link 
                                    className="dropdown-item d-flex align-items-center"
                                    to={`/clients/${client.id}/metrics`}
                                  >
                                    <BarChart3 className="h-4 w-4 me-2" />
                                    Metrics
                                  </Link>
                                </li>
                                <li>
                                  <Link 
                                    className="dropdown-item d-flex align-items-center"
                                    to={`/clients/${client.id}/notifications`}
                                  >
                                    <Bell className="h-4 w-4 me-2" />
                                    Notifications
                                  </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                  <button 
                                    className="dropdown-item d-flex align-items-center text-danger"
                                    onClick={() => handleDeleteClient(client.id!, client.name)}
                                  >
                                    <Trash2 className="h-4 w-4 me-2" />
                                    Delete Client
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
