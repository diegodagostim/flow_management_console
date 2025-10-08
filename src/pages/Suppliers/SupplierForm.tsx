import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useSupplier, useCreateSupplier, useUpdateSupplier } from '@/hooks/useSupplierManagement';
import type { CreateSupplierInput, UpdateSupplierInput } from '@/core/models/SupplierManagement';
import {
  Save,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  CreditCard,
  Star,
  FileText,
  AlertCircle
} from 'lucide-react';

export function SupplierForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: supplier, isLoading } = useSupplier(id || '');
  const createSupplierMutation = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();

  const [formData, setFormData] = useState<CreateSupplierInput>({
    name: '',
    email: '',
    company: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    taxId: '',
    website: '',
    contactPerson: '',
    status: 'active',
    category: 'other',
    paymentTerms: 'net_30',
    currency: 'USD',
    rating: undefined,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && supplier) {
      setFormData({
        name: supplier.name,
        email: supplier.email,
        company: supplier.company,
        phone: supplier.phone || '',
        address: supplier.address || '',
        city: supplier.city || '',
        state: supplier.state || '',
        country: supplier.country || '',
        postalCode: supplier.postalCode || '',
        taxId: supplier.taxId || '',
        website: supplier.website || '',
        contactPerson: supplier.contactPerson || '',
        status: supplier.status,
        category: supplier.category,
        paymentTerms: supplier.paymentTerms,
        currency: supplier.currency,
        rating: supplier.rating,
        notes: supplier.notes || '',
      });
    }
  }, [isEditing, supplier]);

  const handleInputChange = (field: keyof CreateSupplierInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid URL (starting with http:// or https://)';
    }

    if (formData.rating && (formData.rating < 1 || formData.rating > 5)) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing) {
        await updateSupplierMutation.mutateAsync({
          id: id!,
          input: formData as UpdateSupplierInput,
        });
      } else {
        await createSupplierMutation.mutateAsync(formData);
      }
      navigate('/suppliers');
    } catch (error) {
      console.error('Failed to save supplier:', error);
    }
  };

  const handleCancel = () => {
    navigate('/suppliers');
  };

  if (isLoading) {
    return (
      <div className="container-fluid">
        <PageHeader
          title={isEditing ? 'Edit Supplier' : 'Add Supplier'}
          subtitle={isEditing ? 'Update supplier information' : 'Create a new supplier'}
          breadcrumbs={[
            { label: 'Home', path: '/' },
            { label: 'Suppliers', path: '/suppliers' },
            { label: isEditing ? 'Edit' : 'Add', active: true }
          ]}
        />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading supplier data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid supplier-form-page">
      <PageHeader
        title={isEditing ? 'Edit Supplier' : 'Add Supplier'}
        subtitle={isEditing ? 'Update supplier information' : 'Create a new supplier'}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Suppliers', path: '/suppliers' },
          { label: isEditing ? 'Edit' : 'Add', active: true }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Basic Information */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="card-title mb-0 d-flex align-items-center">
                  <Building2 className="h-4 w-4 me-2" />
                  Basic Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Supplier Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter supplier name"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
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
                      <div className="invalid-feedback">{errors.company}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Phone className="h-4 w-4" />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Contact Person</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        placeholder="Enter contact person name"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Website</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Globe className="h-4 w-4" />
                      </span>
                      <input
                        type="url"
                        className={`form-control ${errors.website ? 'is-invalid' : ''}`}
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://example.com"
                      />
                    </div>
                    {errors.website && (
                      <div className="invalid-feedback">{errors.website}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="card-title mb-0 d-flex align-items-center">
                  <MapPin className="h-4 w-4 me-2" />
                  Address Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State/Province</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state or province"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      placeholder="Enter postal code"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Enter country"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tax ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.taxId}
                      onChange={(e) => handleInputChange('taxId', e.target.value)}
                      placeholder="Enter tax identification number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="card-title mb-0 d-flex align-items-center">
                  <FileText className="h-4 w-4 me-2" />
                  Additional Information
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter any additional notes about this supplier"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Settings */}
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="card-title mb-0 d-flex align-items-center">
                  <CreditCard className="h-4 w-4 me-2" />
                  Business Settings
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
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="service_provider">Service Provider</option>
                    <option value="consultant">Consultant</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Terms</label>
                  <select
                    className="form-select"
                    value={formData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  >
                    <option value="net_15">Net 15</option>
                    <option value="net_30">Net 30</option>
                    <option value="net_45">Net 45</option>
                    <option value="net_60">Net 60</option>
                    <option value="cash">Cash</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div className="mb-3">
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
                    <option value="AUD">AUD</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Rating (1-5)</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Star className="h-4 w-4" />
                    </span>
                    <input
                      type="number"
                      className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
                      value={formData.rating || ''}
                      onChange={(e) => handleInputChange('rating', e.target.value ? Number(e.target.value) : undefined)}
                      min="1"
                      max="5"
                      step="0.1"
                      placeholder="Enter rating"
                    />
                  </div>
                  {errors.rating && (
                    <div className="invalid-feedback">{errors.rating}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card form-actions">
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={createSupplierMutation.isPending || updateSupplierMutation.isPending}
                  >
                    <Save className="h-4 w-4 me-1" />
                    {createSupplierMutation.isPending || updateSupplierMutation.isPending
                      ? 'Saving...'
                      : isEditing
                      ? 'Update Supplier'
                      : 'Create Supplier'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                  >
                    <ArrowLeft className="h-4 w-4 me-1" />
                    Cancel
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
