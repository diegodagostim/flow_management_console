import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useClient, useCreateClient, useUpdateClient } from '@/hooks/useClientManagement';
import type { CreateClientInput, UpdateClientInput } from '@/core/models/ClientManagement';

export function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<CreateClientInput>({
    name: '',
    email: '',
    company: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    status: 'active',
    tier: 'basic',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: client, isLoading } = useClient(id || '');
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  useEffect(() => {
    if (isEditing && client) {
      setFormData({
        name: client.name,
        email: client.email,
        company: client.company,
        phone: client.phone || '',
        address: client.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        status: client.status,
        tier: client.tier,
      });
    }
  }, [isEditing, client]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateClientMutation.mutateAsync({
          id: id!,
          input: formData as UpdateClientInput,
        });
      } else {
        await createClientMutation.mutateAsync(formData);
      }
      navigate('/clients');
    } catch (error) {
      console.error('Failed to save client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">Loading client data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid client-form-page form-page">
      {/* Page Header */}
      <PageHeader 
        title={isEditing ? 'Edit Client' : 'Add New Client'}
        subtitle={isEditing ? 'Update client information' : 'Create a new client profile'}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Clients', path: '/clients' },
          { label: isEditing ? 'Edit Client' : 'Add Client', active: true }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Basic Information */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0 pb-2">
                <h6 className="card-title mb-0 d-flex align-items-center">
                  <User className="h-5 w-5 text-primary me-2" />
                  Basic Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Client Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter client name"
                    />
                    {errors.name && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <AlertCircle className="h-4 w-4 me-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <AlertCircle className="h-4 w-4 me-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Company <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.company ? 'is-invalid' : ''}`}
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Enter company name"
                    />
                    {errors.company && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <AlertCircle className="h-4 w-4 me-1" />
                        {errors.company}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0 pb-2">
                <h6 className="card-title mb-0 d-flex align-items-center">
                  <MapPin className="h-5 w-5 text-primary me-2" />
                  Address Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address?.street || ''}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address?.city || ''}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State/Province</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address?.state || ''}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label className="form-label">ZIP/Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address?.zipCode || ''}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address?.country || ''}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Settings */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0 pb-2">
                <h6 className="card-title mb-0 d-flex align-items-center">
                  <Building2 className="h-5 w-5 text-primary me-2" />
                  Client Settings
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Tier</label>
                  <select
                    className="form-select"
                    value={formData.tier}
                    onChange={(e) => handleInputChange('tier', e.target.value)}
                  >
                    <option value="basic">Basic</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card border-0 shadow-sm form-actions">
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Saving...</span>
                        </div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 me-1" />
                        {isEditing ? 'Update Client' : 'Create Client'}
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/clients')}
                  >
                    <ArrowLeft className="h-4 w-4 me-1" />
                    Back to Clients
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}