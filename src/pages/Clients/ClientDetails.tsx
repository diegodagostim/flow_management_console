import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClient, useDeleteClient } from '@/hooks/useClient';
import { ArrowLeft, Edit, Trash2, Mail, Phone, Building2, MapPin, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';

export function ClientDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading, error } = useClient(id || '');
  const deleteClientMutation = useDeleteClient();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClientMutation.mutateAsync(id!);
        navigate('/clients');
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h6 className="text-muted">Loading client details...</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="text-danger mb-3">
                <i className="bx bx-error-circle h1"></i>
              </div>
              <h6 className="text-danger mb-2">Client not found</h6>
              <p className="text-muted">The client you're looking for doesn't exist or has been deleted.</p>
              <Link to="/clients" className="btn btn-primary mt-3">
                <ArrowLeft className="h-4 w-4 me-2" />
                Back to Clients
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <PageHeader 
        title={client.name}
        subtitle={client.company || 'Client Details'}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Clients', path: '/clients' },
          { label: client.name, active: true }
        ]}
      >
        <div className="d-flex gap-2">
          <Link to={`/clients/${client.id}/edit`} className="btn btn-outline-primary">
            <Edit className="h-4 w-4 me-2" />
            Edit
          </Link>
          <button
            className="btn btn-outline-danger"
            onClick={handleDelete}
            disabled={deleteClientMutation.isPending}
          >
            <Trash2 className="h-4 w-4 me-2" />
            Delete
          </button>
        </div>
      </PageHeader>

      <div className="row">
        <div className="col-12">

        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8 mb-4">
            {/* Contact Information */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="card-title mb-0">
                  <i className="bx bx-user me-2"></i>
                  Contact Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  {client.email && (
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm me-3">
                          <span className="avatar-initial rounded bg-label-primary">
                            <Mail className="h-4 w-4" />
                          </span>
                        </div>
                        <div>
                          <p className="text-muted small mb-0">Email</p>
                          <p className="mb-0 fw-semibold">{client.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {client.phone && (
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm me-3">
                          <span className="avatar-initial rounded bg-label-success">
                            <Phone className="h-4 w-4" />
                          </span>
                        </div>
                        <div>
                          <p className="text-muted small mb-0">Phone</p>
                          <p className="mb-0 fw-semibold">{client.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {client.company && (
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="avatar avatar-sm me-3">
                          <span className="avatar-initial rounded bg-label-info">
                            <Building2 className="h-4 w-4" />
                          </span>
                        </div>
                        <div>
                          <p className="text-muted small mb-0">Company</p>
                          <p className="mb-0 fw-semibold">{client.company}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            {client.address && (
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="card-title mb-0">
                    <i className="bx bx-map me-2"></i>
                    Address
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-start">
                    <div className="avatar avatar-sm me-3">
                      <span className="avatar-initial rounded bg-label-warning">
                        <MapPin className="h-4 w-4" />
                      </span>
                    </div>
                    <div>
                      {client.address.street && (
                        <p className="mb-1 fw-semibold">{client.address.street}</p>
                      )}
                      <div className="d-flex flex-wrap gap-2 mb-1">
                        {client.address.city && <span className="badge bg-label-secondary">{client.address.city}</span>}
                        {client.address.state && <span className="badge bg-label-secondary">{client.address.state}</span>}
                        {client.address.zipCode && <span className="badge bg-label-secondary">{client.address.zipCode}</span>}
                      </div>
                      {client.address.country && (
                        <p className="text-muted small mb-0">{client.address.country}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {client.notes && (
              <div className="card">
                <div className="card-header">
                  <h6 className="card-title mb-0">
                    <i className="bx bx-note me-2"></i>
                    Notes
                  </h6>
                </div>
                <div className="card-body">
                  <p className="mb-0">{client.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Client Details */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="card-title mb-0">
                  <i className="bx bx-info-circle me-2"></i>
                  Client Details
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar avatar-sm me-3">
                    <span className="avatar-initial rounded bg-label-primary">
                      <Calendar className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-muted small mb-0">Created</p>
                    <p className="mb-0 fw-semibold">
                      {client.createdAt ? new Date(client.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <div className="avatar avatar-sm me-3">
                    <span className="avatar-initial rounded bg-label-success">
                      <Calendar className="h-4 w-4" />
                    </span>
                  </div>
                  <div>
                    <p className="text-muted small mb-0">Last Updated</p>
                    <p className="mb-0 fw-semibold">
                      {client.updatedAt ? new Date(client.updatedAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h6 className="card-title mb-0">
                  <i className="bx bx-bolt me-2"></i>
                  Quick Actions
                </h6>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to={`/clients/${client.id}/edit`} className="btn btn-outline-primary">
                    <Edit className="h-4 w-4 me-2" />
                    Edit Client
                  </Link>
                  
                  {client.email && (
                    <a
                      href={`mailto:${client.email}`}
                      className="btn btn-outline-success"
                    >
                      <Mail className="h-4 w-4 me-2" />
                      Send Email
                    </a>
                  )}
                  
                  {client.phone && (
                    <a
                      href={`tel:${client.phone}`}
                      className="btn btn-outline-info"
                    >
                      <Phone className="h-4 w-4 me-2" />
                      Call Client
                    </a>
                  )}
                  
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleDelete}
                    disabled={deleteClientMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 me-2" />
                    Delete Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}