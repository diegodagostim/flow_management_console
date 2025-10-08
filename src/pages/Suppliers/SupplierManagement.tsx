import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useSuppliers, useDeleteSupplier } from '@/hooks/useSupplierManagement';
import type { SupplierFilters } from '@/core/models/SupplierManagement';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  MoreVertical,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

export function SupplierManagement() {
  const [filters, setFilters] = useState<SupplierFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: suppliers = [], isLoading, error } = useSuppliers(filters);
  const deleteSupplierMutation = useDeleteSupplier();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (key: keyof SupplierFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteSupplier = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete supplier "${name}"? This action cannot be undone.`)) {
      try {
        await deleteSupplierMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete supplier:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'success', icon: CheckCircle },
      inactive: { color: 'secondary', icon: XCircle },
      suspended: { color: 'danger', icon: AlertCircle },
      pending: { color: 'warning', icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span className={`badge bg-label-${config.color}`}>
        <Icon className="h-3 w-3 me-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      manufacturer: { color: 'primary' },
      distributor: { color: 'info' },
      service_provider: { color: 'success' },
      consultant: { color: 'warning' },
      other: { color: 'secondary' },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.other;

    return (
      <span className={`badge bg-label-${config.color}`}>
        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  if (error) {
    console.error('SupplierManagement error:', error);
    return (
      <div className="container-fluid">
        <PageHeader
          title="Supplier Management"
          subtitle="Manage your suppliers and vendor relationships"
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Suppliers', active: true }
          ]}
        />
        <div className="alert alert-danger">
          <AlertCircle className="h-4 w-4 me-2" />
          Failed to load suppliers. Please try again.
          <details className="mt-2">
            <summary>Error Details</summary>
            <pre className="mt-2 text-small">
              {error.message || 'Unknown error occurred'}
            </pre>
          </details>
          <div className="mt-3">
            <Link to="/suppliers/new" className="btn btn-primary">
              <Plus className="h-4 w-4 me-1" />
              Add First Supplier
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <PageHeader
        title="Supplier Management"
        subtitle="Manage your suppliers and vendor relationships"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Suppliers', active: true }
        ]}
      />

      {/* Search and Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <form onSubmit={handleSearch} className="d-flex gap-2">
                <div className="input-group flex-grow-1">
                  <span className="input-group-text">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search suppliers by name, email, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </form>
            </div>
            <div className="col-md-4 text-end">
              <div className="d-flex gap-2 justify-content-end">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 me-1" />
                  Filters
                </button>
                <Link to="/suppliers/new" className="btn btn-primary">
                  <Plus className="h-4 w-4 me-1" />
                  Add Supplier
                </Link>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="row mt-3 pt-3 border-top">
              <div className="col-md-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                >
                  <option value="">All Categories</option>
                  <option value="manufacturer">Manufacturer</option>
                  <option value="distributor">Distributor</option>
                  <option value="service_provider">Service Provider</option>
                  <option value="consultant">Consultant</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Payment Terms</label>
                <select
                  className="form-select"
                  value={filters.paymentTerms || ''}
                  onChange={(e) => handleFilterChange('paymentTerms', e.target.value || undefined)}
                >
                  <option value="">All Terms</option>
                  <option value="net_15">Net 15</option>
                  <option value="net_30">Net 30</option>
                  <option value="net_45">Net 45</option>
                  <option value="net_60">Net 60</option>
                  <option value="cash">Cash</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Min Rating</label>
                <select
                  className="form-select"
                  value={filters.rating || ''}
                  onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)}
                >
                  <option value="">Any Rating</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suppliers List */}
      <div className="card supplier-management-table">
        <div className="card-header">
          <h6 className="card-title mb-0">
            Suppliers ({suppliers.length})
          </h6>
        </div>
        <div className="card-body p-0">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading suppliers...</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-5">
              <Building2 className="h-12 w-12 text-muted mb-3" />
              <h6 className="text-muted">No suppliers found</h6>
              <p className="text-muted mb-3">
                {Object.keys(filters).length > 0
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by adding your first supplier.'}
              </p>
              <Link to="/suppliers/new" className="btn btn-primary">
                <Plus className="h-4 w-4 me-1" />
                Add First Supplier
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Supplier</th>
                    <th>Contact</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Payment Terms</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded bg-label-primary">
                              {supplier.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h6 className="mb-0">{supplier.name}</h6>
                            <small className="text-muted">{supplier.company}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          {supplier.email && (
                            <div className="d-flex align-items-center mb-1">
                              <Mail className="h-3 w-3 me-1 text-muted" />
                              <span>{supplier.email}</span>
                            </div>
                          )}
                          {supplier.phone && (
                            <div className="d-flex align-items-center mb-1">
                              <Phone className="h-3 w-3 me-1 text-muted" />
                              <span>{supplier.phone}</span>
                            </div>
                          )}
                          {supplier.address && (
                            <div className="d-flex align-items-center">
                              <MapPin className="h-3 w-3 me-1 text-muted" />
                              <span>{supplier.address}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{getCategoryBadge(supplier.category)}</td>
                      <td>{getStatusBadge(supplier.status)}</td>
                      <td>
                        {supplier.rating ? (
                          <div className="d-flex align-items-center">
                            <Star className="h-3 w-3 text-warning me-1" />
                            <span>{supplier.rating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="text-muted">No rating</span>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-label-info">
                          {supplier.paymentTerms.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/suppliers/${supplier.id}`}
                              >
                                <Eye className="h-4 w-4 me-2" />
                                View Details
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/suppliers/${supplier.id}/edit`}
                              >
                                <Edit className="h-4 w-4 me-2" />
                                Edit
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/suppliers/${supplier.id}/orders`}
                              >
                                <FileText className="h-4 w-4 me-2" />
                                Purchase Orders
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/suppliers/${supplier.id}/invoices`}
                              >
                                <DollarSign className="h-4 w-4 me-2" />
                                Invoices
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="dropdown-item"
                                to={`/suppliers/${supplier.id}/metrics`}
                              >
                                <Calendar className="h-4 w-4 me-2" />
                                Performance
                              </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDeleteSupplier(supplier.id!, supplier.name)}
                                disabled={deleteSupplierMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 me-2" />
                                Delete
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
  );
}
