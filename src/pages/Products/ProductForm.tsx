import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Package, 
  Image,
  Tag,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProduct';
import { useTimeRegion } from '@/hooks/useTimeRegion';
import type { CreateProductInput, UpdateProductInput, CreateModuleInput, CreateSubmoduleInput, ModulePricingSummary } from '@/core/models/Product';
import { calculateModulePricing } from '@/core/models/Product';

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { settings, formatCurrency } = useTimeRegion();

  const [formData, setFormData] = useState<CreateProductInput>({
    name: '',
    description: '',
    logo: '',
    category: '',
    version: '',
    modules: [],
    isActive: true,
    tags: [],
    metadata: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);
  const [editingSubmoduleIndex, setEditingSubmoduleIndex] = useState<number | null>(null);

  const { data: product, isLoading } = useProduct(id || '');
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  useEffect(() => {
    if (isEditing && product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        logo: product.logo || '',
        category: product.category || '',
        version: product.version || '',
        modules: product.modules || [],
        isActive: product.isActive,
        tags: product.tags || [],
        metadata: product.metadata || {},
      });
    }
  }, [isEditing, product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddModule = (moduleData: CreateModuleInput) => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, moduleData]
    }));
    setShowModuleForm(false);
  };

  const handleUpdateModule = (index: number, moduleData: Partial<CreateModuleInput>) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === index ? { ...module, ...moduleData } : module
      )
    }));
    setEditingModuleIndex(null);
  };

  const handleDeleteModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };

  const handleAddSubmodule = (moduleIndex: number, submoduleData: CreateSubmoduleInput) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? { ...module, submodules: [...module.submodules, submoduleData] }
          : module
      )
    }));
    setEditingSubmoduleIndex(null);
  };

  const handleUpdateSubmodule = (moduleIndex: number, submoduleIndex: number, submoduleData: Partial<CreateSubmoduleInput>) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              submodules: module.submodules.map((submodule, j) => 
                j === submoduleIndex ? { ...submodule, ...submoduleData } : submodule
              )
            }
          : module
      )
    }));
    setEditingSubmoduleIndex(null);
  };

  const handleDeleteSubmodule = (moduleIndex: number, submoduleIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) => 
        i === moduleIndex 
          ? {
              ...module,
              submodules: module.submodules.filter((_, j) => j !== submoduleIndex)
            }
          : module
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.logo && !/^https?:\/\/.+/.test(formData.logo)) {
      newErrors.logo = 'Please enter a valid URL';
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
        await updateProductMutation.mutateAsync({
          id: id!,
          input: formData as UpdateProductInput
        });
      } else {
        await createProductMutation.mutateAsync(formData);
      }
      
      navigate('/products');
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSubmitting(false);
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
              <h6 className="text-muted">Loading product...</h6>
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
        title={isEditing ? 'Edit Product' : 'Add Product'}
        subtitle={isEditing ? 'Update product information' : 'Create a new SaaS product'}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Products', path: '/products' },
          { label: isEditing ? 'Edit' : 'Add', active: true }
        ]}
      >
        <button 
          type="button" 
          className="btn btn-outline-secondary me-2"
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="h-4 w-4 me-2" />
          Back
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Basic Information */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <Package className="h-5 w-5 me-2" />
                  Basic Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">
                        <AlertCircle className="h-4 w-4 me-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="e.g., CRM, Analytics, Marketing"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="version" className="form-label">
                      Version
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="version"
                      value={formData.version}
                      onChange={(e) => handleInputChange('version', e.target.value)}
                      placeholder="e.g., 1.0.0"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="logo" className="form-label">
                      <Image className="h-4 w-4 me-1" />
                      Logo URL
                    </label>
                    <input
                      type="url"
                      className={`form-control ${errors.logo ? 'is-invalid' : ''}`}
                      id="logo"
                      value={formData.logo}
                      onChange={(e) => handleInputChange('logo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    {errors.logo && (
                      <div className="invalid-feedback">
                        <AlertCircle className="h-4 w-4 me-1" />
                        {errors.logo}
                      </div>
                    )}
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your product..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <Package className="h-5 w-5 me-2" />
                  Modules & Pricing
                </h5>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowModuleForm(true)}
                >
                  <Plus className="h-4 w-4 me-2" />
                  Add Module
                </button>
              </div>
              <div className="card-body">
                {formData.modules.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="avatar avatar-lg mx-auto mb-3">
                      <span className="avatar-initial rounded bg-label-secondary">
                        <Package className="h-6 w-6" />
                      </span>
                    </div>
                    <h6 className="text-muted mb-2">No modules added yet</h6>
                    <p className="text-muted mb-3">Add modules to define your product's features and pricing</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setShowModuleForm(true)}
                    >
                      <Plus className="h-4 w-4 me-2" />
                      Add First Module
                    </button>
                  </div>
                ) : (
                  <div className="row">
                    {formData.modules.map((module, moduleIndex) => {
                      const modulePricing = calculateModulePricing(module);
                      return (
                        <div key={moduleIndex} className="col-md-6 mb-4">
                          <div className="card border">
                            <div className="card-header d-flex justify-content-between align-items-center">
                              <h6 className="mb-0">{module.name}</h6>
                              <div className="d-flex gap-1">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => setEditingModuleIndex(moduleIndex)}
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDeleteModule(moduleIndex)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            <div className="card-body">
                              {module.description && (
                                <p className="text-muted small mb-2">{module.description}</p>
                              )}
                              <div className="d-flex align-items-center mb-2">
                                <DollarSign className="h-4 w-4 me-1 text-success" />
                                <span className="fw-semibold">
                                  {formatCurrency(modulePricing.totalPrice)}
                                </span>
                                <span className="badge ms-2 bg-label-info">
                                  Total
                                </span>
                              </div>
                              {modulePricing.submoduleCount > 0 && (
                                <div className="mb-2">
                                  <small className="text-muted d-block mb-1">Breakdown:</small>
                                  {modulePricing.oneTimePrice > 0 && (
                                    <div className="d-flex justify-content-between align-items-center">
                                      <small className="text-muted">One-time:</small>
                                      <small className="text-info">{formatCurrency(modulePricing.oneTimePrice)}</small>
                                    </div>
                                  )}
                                  {modulePricing.recurringPrice > 0 && (
                                    <div className="d-flex justify-content-between align-items-center">
                                      <small className="text-muted">Recurring:</small>
                                      <small className="text-warning">{formatCurrency(modulePricing.recurringPrice)}</small>
                                    </div>
                                  )}
                                </div>
                              )}
                            {module.submodules.length > 0 && (
                              <div>
                                <small className="text-muted">Submodules:</small>
                                <ul className="list-unstyled mt-1">
                                  {module.submodules.map((submodule, submoduleIndex) => (
                                    <li key={submoduleIndex} className="d-flex justify-content-between align-items-center py-1">
                                      <span className="small">{submodule.name}</span>
                                      <div className="d-flex gap-1">
                                        <button
                                          type="button"
                                          className="btn btn-xs btn-outline-secondary"
                                          onClick={() => setEditingSubmoduleIndex(moduleIndex * 1000 + submoduleIndex)}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-xs btn-outline-danger"
                                          onClick={() => handleDeleteSubmodule(moduleIndex, submoduleIndex)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary w-100 mt-2"
                              onClick={() => setEditingSubmoduleIndex(moduleIndex * 1000 + 999)}
                            >
                              <Plus className="h-3 w-3 me-1" />
                              Add Submodule
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Tags */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <Tag className="h-5 w-5 me-2" />
                  Tags
                </h5>
              </div>
              <div className="card-body">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAddTag}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="badge bg-label-primary d-flex align-items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        style={{ fontSize: '0.7em' }}
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">Status</h5>
              </div>
              <div className="card-body">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="isActive">
                    Active Product
                  </label>
                </div>
                <small className="text-muted">
                  Inactive products won't be available for new subscriptions
                </small>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
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
                        <Save className="h-4 w-4 me-2" />
                        {isEditing ? 'Update Product' : 'Create Product'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/products')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Module Form Modal */}
      {showModuleForm && (
        <ModuleFormModal
          onSave={handleAddModule}
          onCancel={() => setShowModuleForm(false)}
          currency={settings.currency}
        />
      )}

      {/* Edit Module Modal */}
      {editingModuleIndex !== null && (
        <ModuleFormModal
          module={formData.modules[editingModuleIndex]}
          onSave={(moduleData) => handleUpdateModule(editingModuleIndex, moduleData)}
          onCancel={() => setEditingModuleIndex(null)}
          currency={settings.currency}
        />
      )}

      {/* Submodule Form Modal */}
      {editingSubmoduleIndex !== null && (
        <SubmoduleFormModal
          moduleIndex={Math.floor(editingSubmoduleIndex / 1000)}
          onSave={(submoduleData) => handleAddSubmodule(Math.floor(editingSubmoduleIndex / 1000), submoduleData)}
          onCancel={() => setEditingSubmoduleIndex(null)}
          currency={settings.currency}
        />
      )}
    </div>
  );
}

// Module Form Modal Component
function ModuleFormModal({ 
  module, 
  onSave, 
  onCancel, 
  currency 
}: { 
  module?: CreateModuleInput; 
  onSave: (data: CreateModuleInput) => void; 
  onCancel: () => void; 
  currency: string;
}) {
  const [formData, setFormData] = useState<CreateModuleInput>({
    name: module?.name || '',
    description: module?.description || '',
    submodules: module?.submodules || [],
    isActive: module?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {module ? 'Edit Module' : 'Add Module'}
            </h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Module Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              <div className="alert alert-info">
                <small>
                  <strong>Note:</strong> Module pricing will be calculated automatically from the sum of all submodules you add to this module.
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {module ? 'Update Module' : 'Add Module'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Submodule Form Modal Component
function SubmoduleFormModal({ 
  moduleIndex,
  onSave, 
  onCancel, 
  currency 
}: { 
  moduleIndex: number;
  onSave: (data: CreateSubmoduleInput) => void; 
  onCancel: () => void; 
  currency: string;
}) {
  const [formData, setFormData] = useState<CreateSubmoduleInput>({
    name: '',
    description: '',
    pricing: {
      type: 'recurring',
      amount: 0,
      currency: currency,
      billingCycle: 'monthly'
    },
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Submodule</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Submodule Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Price *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.pricing.amount}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      pricing: { ...prev.pricing, amount: parseFloat(e.target.value) || 0 }
                    }))}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pricing Type *</label>
                  <select
                    className="form-select"
                    value={formData.pricing.type}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      pricing: { ...prev.pricing, type: e.target.value as 'one-time' | 'recurring' }
                    }))}
                    required
                  >
                    <option value="one-time">One-time</option>
                    <option value="recurring">Recurring</option>
                  </select>
                </div>
                {formData.pricing.type === 'recurring' && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Billing Cycle</label>
                    <select
                      className="form-select"
                      value={formData.pricing.billingCycle || 'monthly'}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        pricing: { ...prev.pricing, billingCycle: e.target.value as any }
                      }))}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                )}
                <div className="col-12 mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Submodule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
