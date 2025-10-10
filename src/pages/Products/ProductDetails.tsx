import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Package, 
  DollarSign, 
  Calendar,
  Tag,
  Image,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';
import { useProduct, useProductPricingSummary, useAddModule, useAddSubmodule, useUpdateModule, useUpdateSubmodule, useDeleteModule, useDeleteSubmodule } from '@/hooks/useProduct';
import { useTimeRegion } from '@/hooks/useTimeRegion';
import type { CreateModuleInput, CreateSubmoduleInput, ModulePricingSummary } from '@/core/models/Product';
import { calculateModulePricing } from '@/core/models/Product';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { formatCurrency } = useTimeRegion();
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModuleIndex, setEditingModuleIndex] = useState<number | null>(null);
  const [editingSubmoduleIndex, setEditingSubmoduleIndex] = useState<number | null>(null);

  const { data: product, isLoading, error } = useProduct(id || '');
  const { data: pricingSummary } = useProductPricingSummary(id || '');
  
  const addModuleMutation = useAddModule();
  const addSubmoduleMutation = useAddSubmodule();
  const updateModuleMutation = useUpdateModule();
  const updateSubmoduleMutation = useUpdateSubmodule();
  const deleteModuleMutation = useDeleteModule();
  const deleteSubmoduleMutation = useDeleteSubmodule();

  const handleAddModule = async (moduleData: CreateModuleInput) => {
    if (!id) return;
    try {
      await addModuleMutation.mutateAsync({ productId: id, moduleInput: moduleData });
      setShowModuleForm(false);
    } catch (error) {
      console.error('Failed to add module:', error);
    }
  };

  const handleUpdateModule = async (moduleIndex: number, moduleData: Partial<CreateModuleInput>) => {
    if (!id || !product) return;
    const module = product.modules[moduleIndex];
    if (!module.id) return;
    
    try {
      await updateModuleMutation.mutateAsync({ 
        productId: id, 
        moduleId: module.id, 
        moduleInput: moduleData 
      });
      setEditingModuleIndex(null);
    } catch (error) {
      console.error('Failed to update module:', error);
    }
  };

  const handleDeleteModule = async (moduleIndex: number) => {
    if (!id || !product) return;
    const module = product.modules[moduleIndex];
    if (!module.id) return;
    
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await deleteModuleMutation.mutateAsync({ productId: id, moduleId: module.id });
      } catch (error) {
        console.error('Failed to delete module:', error);
      }
    }
  };

  const handleAddSubmodule = async (moduleIndex: number, submoduleData: CreateSubmoduleInput) => {
    if (!id || !product) return;
    const module = product.modules[moduleIndex];
    if (!module.id) return;
    
    try {
      await addSubmoduleMutation.mutateAsync({ 
        productId: id, 
        moduleId: module.id, 
        submoduleInput: submoduleData 
      });
      setEditingSubmoduleIndex(null);
    } catch (error) {
      console.error('Failed to add submodule:', error);
    }
  };

  const handleUpdateSubmodule = async (moduleIndex: number, submoduleIndex: number, submoduleData: Partial<CreateSubmoduleInput>) => {
    if (!id || !product) return;
    const module = product.modules[moduleIndex];
    const submodule = module.submodules[submoduleIndex];
    if (!module.id || !submodule.id) return;
    
    try {
      await updateSubmoduleMutation.mutateAsync({ 
        productId: id, 
        moduleId: module.id, 
        submoduleId: submodule.id, 
        submoduleInput: submoduleData 
      });
      setEditingSubmoduleIndex(null);
    } catch (error) {
      console.error('Failed to update submodule:', error);
    }
  };

  const handleDeleteSubmodule = async (moduleIndex: number, submoduleIndex: number) => {
    if (!id || !product) return;
    const module = product.modules[moduleIndex];
    const submodule = module.submodules[submoduleIndex];
    if (!module.id || !submodule.id) return;
    
    if (window.confirm('Are you sure you want to delete this submodule?')) {
      try {
        await deleteSubmoduleMutation.mutateAsync({ 
          productId: id, 
          moduleId: module.id, 
          submoduleId: submodule.id 
        });
      } catch (error) {
        console.error('Failed to delete submodule:', error);
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
              <h6 className="text-muted">Loading product...</h6>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="text-danger mb-3">
                <i className="bx bx-error-circle h1"></i>
              </div>
              <h6 className="text-danger mb-2">Product not found</h6>
              <p className="text-muted">The product you're looking for doesn't exist</p>
              <Link to="/products">
                <button className="btn btn-primary">
                  <ArrowLeft className="h-4 w-4 me-2" />
                  Back to Products
                </button>
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
        title={product.name}
        subtitle="Product details and module management"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Products', path: '/products' },
          { label: product.name, active: true }
        ]}
      >
        <Link to="/products">
          <button className="btn btn-outline-secondary me-2">
            <ArrowLeft className="h-4 w-4 me-2" />
            Back
          </button>
        </Link>
        <Link to={`/products/${product.id}/edit`}>
          <button className="btn btn-primary">
            <Edit className="h-4 w-4 me-2" />
            Edit Product
          </button>
        </Link>
      </PageHeader>

      <div className="row">
        {/* Product Overview */}
        <div className="col-lg-8">
          {/* Basic Information */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <Package className="h-5 w-5 me-2" />
                Product Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="d-flex align-items-start mb-3">
                    {product.logo ? (
                      <img 
                        src={product.logo} 
                        alt={product.name}
                        className="rounded me-3"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="avatar avatar-lg me-3">
                        <span className="avatar-initial rounded bg-label-primary">
                          <Package className="h-6 w-6" />
                        </span>
                      </div>
                    )}
                    <div className="flex-grow-1">
                      <h4 className="mb-1">{product.name}</h4>
                      {product.description && (
                        <p className="text-muted mb-2">{product.description}</p>
                      )}
                      <div className="d-flex align-items-center gap-3">
                        {product.category && (
                          <span className="badge bg-label-info">{product.category}</span>
                        )}
                        {product.version && (
                          <span className="badge bg-label-secondary">v{product.version}</span>
                        )}
                        <span className={`badge ${product.isActive ? 'bg-label-success' : 'bg-label-danger'}`}>
                          {product.isActive ? (
                            <>
                              <CheckCircle className="h-3 w-3 me-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 me-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {product.tags.length > 0 && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-2">
                        <Tag className="h-4 w-4 me-1" />
                        Tags
                      </small>
                      <div className="d-flex flex-wrap gap-2">
                        {product.tags.map((tag, index) => (
                          <span key={index} className="badge bg-label-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-4">
                  <div className="text-end">
                    <small className="text-muted d-block mb-1">Created</small>
                    <div className="d-flex align-items-center justify-content-end">
                      <Calendar className="h-4 w-4 me-1 text-muted" />
                      <span>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}</span>
                    </div>
                    {product.updatedAt && product.updatedAt !== product.createdAt && (
                      <>
                        <small className="text-muted d-block mb-1 mt-2">Last Updated</small>
                        <div className="d-flex align-items-center justify-content-end">
                          <Calendar className="h-4 w-4 me-1 text-muted" />
                          <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                  </div>
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
                className="btn btn-primary btn-sm"
                onClick={() => setShowModuleForm(true)}
              >
                <Plus className="h-4 w-4 me-2" />
                Add Module
              </button>
            </div>
            <div className="card-body">
              {product.modules.length === 0 ? (
                <div className="text-center py-4">
                  <div className="avatar avatar-lg mx-auto mb-3">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <Package className="h-6 w-6" />
                    </span>
                  </div>
                  <h6 className="text-muted mb-2">No modules added yet</h6>
                  <p className="text-muted mb-3">Add modules to define your product's features and pricing</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowModuleForm(true)}
                  >
                    <Plus className="h-4 w-4 me-2" />
                    Add First Module
                  </button>
                </div>
              ) : (
                <div className="row">
                  {product.modules.map((module, moduleIndex) => {
                    const modulePricing = calculateModulePricing(module);
                    return (
                      <div key={module.id || moduleIndex} className="col-md-6 mb-4">
                        <div className="card border h-100">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">{module.name}</h6>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setEditingModuleIndex(moduleIndex)}
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteModule(moduleIndex)}
                                disabled={deleteModuleMutation.isPending}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="card-body">
                            {module.description && (
                              <p className="text-muted small mb-3">{module.description}</p>
                            )}
                            
                            <div className="d-flex align-items-center mb-3">
                              <DollarSign className="h-4 w-4 me-1 text-success" />
                              <span className="fw-semibold h6 mb-0">
                                {formatCurrency(modulePricing.totalPrice)}
                              </span>
                              <span className="badge ms-2 bg-label-info">
                                Total
                              </span>
                            </div>

                            {modulePricing.submoduleCount > 0 && (
                              <div className="mb-3">
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
                            <div className="mb-3">
                              <small className="text-muted d-block mb-2">Submodules:</small>
                              <div className="list-group list-group-flush">
                                {module.submodules.map((submodule, submoduleIndex) => (
                                  <div key={submodule.id || submoduleIndex} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                                    <div>
                                      <div className="fw-semibold small">{submodule.name}</div>
                                      <div className="d-flex align-items-center">
                                        <span className="small text-success me-2">
                                          {formatCurrency(submodule.pricing.amount)}
                                        </span>
                                        <span className={`badge badge-sm ${submodule.pricing.type === 'one-time' ? 'bg-label-info' : 'bg-label-warning'}`}>
                                          {submodule.pricing.type === 'one-time' ? 'One-time' : 'Recurring'}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="d-flex gap-1">
                                      <button
                                        className="btn btn-xs btn-outline-secondary"
                                        onClick={() => setEditingSubmoduleIndex(moduleIndex * 1000 + submoduleIndex)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </button>
                                      <button
                                        className="btn btn-xs btn-outline-danger"
                                        onClick={() => handleDeleteSubmodule(moduleIndex, submoduleIndex)}
                                        disabled={deleteSubmoduleMutation.isPending}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <button
                            className="btn btn-sm btn-outline-primary w-100"
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
          {/* Pricing Summary */}
          {pricingSummary && (
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <DollarSign className="h-5 w-5 me-2" />
                  Pricing Summary
                </h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6 mb-3">
                    <div className="border-end">
                      <h4 className="text-primary mb-1">{pricingSummary.totalModules}</h4>
                      <small className="text-muted">Modules</small>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <h4 className="text-info mb-1">{pricingSummary.totalSubmodules}</h4>
                    <small className="text-muted">Submodules</small>
                  </div>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">One-time Revenue:</span>
                  <span className="fw-semibold text-success">
                    {formatCurrency(pricingSummary.oneTimeRevenue)}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Recurring Revenue:</span>
                  <span className="fw-semibold text-warning">
                    {formatCurrency(pricingSummary.recurringRevenue)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to={`/products/${product.id}/edit`}>
                  <button className="btn btn-primary w-100">
                    <Edit className="h-4 w-4 me-2" />
                    Edit Product
                  </button>
                </Link>
                <button 
                  className="btn btn-outline-primary w-100"
                  onClick={() => setShowModuleForm(true)}
                >
                  <Plus className="h-4 w-4 me-2" />
                  Add Module
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Form Modal */}
      {showModuleForm && (
        <ModuleFormModal
          onSave={handleAddModule}
          onCancel={() => setShowModuleForm(false)}
          currency={formatCurrency(0).replace(/[\d.,]/g, '').trim()}
        />
      )}

      {/* Edit Module Modal */}
      {editingModuleIndex !== null && (
        <ModuleFormModal
          module={product.modules[editingModuleIndex]}
          onSave={(moduleData) => handleUpdateModule(editingModuleIndex, moduleData)}
          onCancel={() => setEditingModuleIndex(null)}
          currency={formatCurrency(0).replace(/[\d.,]/g, '').trim()}
        />
      )}

      {/* Submodule Form Modal */}
      {editingSubmoduleIndex !== null && (
        <SubmoduleFormModal
          moduleIndex={Math.floor(editingSubmoduleIndex / 1000)}
          onSave={(submoduleData) => handleAddSubmodule(Math.floor(editingSubmoduleIndex / 1000), submoduleData)}
          onCancel={() => setEditingSubmoduleIndex(null)}
          currency={formatCurrency(0).replace(/[\d.,]/g, '').trim()}
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
  module?: any; 
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
