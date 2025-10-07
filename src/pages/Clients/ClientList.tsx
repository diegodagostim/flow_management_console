import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '@/hooks/useClient';
import { useDeleteClient } from '@/hooks/useClient';
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react';

export function ClientList() {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: clients = [], isLoading, error } = useClients({ search: searchTerm })
  const deleteClientMutation = useDeleteClient()

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClientMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete client:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h6 className="text-muted">Loading clients...</h6>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="text-danger mb-3">
                <i className="bx bx-error-circle h1"></i>
              </div>
              <h6 className="text-danger mb-2">Error loading clients</h6>
              <p className="text-muted">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-12">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-1">Clients</h4>
            <p className="text-muted">Manage your client relationships</p>
          </div>
          <Link to="/clients/new">
            <button className="btn btn-primary">
              <Plus className="h-4 w-4 me-2" />
              Add Client
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {clients.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="mb-4">
                <Users className="h-20 w-20 text-primary" />
              </div>
              <h5 className="mb-3">No clients found</h5>
              <p className="text-muted mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first client to begin managing your business relationships.'}
              </p>
              <Link to="/clients/new">
                <button className="btn btn-primary">
                  <Plus className="h-4 w-4 me-2" />
                  Add Your First Client
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="row">
            {clients.map((client) => (
              <div key={client.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="flex-grow-1">
                        <h6 className="card-title mb-1">{client.name}</h6>
                        {client.company && (
                          <p className="text-muted small mb-0">{client.company}</p>
                        )}
                      </div>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary" type="button" data-bs-toggle="dropdown">
                          <i className="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <Link className="dropdown-item" to={`/clients/${client.id}`}>
                              <Eye className="h-4 w-4 me-2" />
                              View
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" to={`/clients/${client.id}/edit`}>
                              <Edit className="h-4 w-4 me-2" />
                              Edit
                            </Link>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleDelete(client.id!)}
                              disabled={deleteClientMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 me-2" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {client.email && (
                        <div className="d-flex align-items-center text-muted small mb-2">
                          <i className="bx bx-envelope me-2"></i>
                          {client.email}
                        </div>
                      )}
                      {client.phone && (
                        <div className="d-flex align-items-center text-muted small mb-2">
                          <i className="bx bx-phone me-2"></i>
                          {client.phone}
                        </div>
                      )}
                      {client.address && (client.address.city || client.address.state) && (
                        <div className="d-flex align-items-center text-muted small">
                          <i className="bx bx-map me-2"></i>
                          {[client.address.city, client.address.state].filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}