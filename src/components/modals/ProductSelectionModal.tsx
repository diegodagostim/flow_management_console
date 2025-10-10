import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Check, 
  DollarSign, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useProducts } from '@/hooks/useProduct';
import { useCreateProductSubscription, useCalculateSubscriptionPricing } from '@/hooks/useProductSubscription';
import { useTimeRegion } from '@/hooks/useTimeRegion';
import type { Product, Module, Submodule } from '@/core/models/Product';
import type { CreateProductSubscriptionInput } from '@/core/models/ClientManagement';

interface ProductSelectionModalProps {
  clientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductSelectionModal({ clientId, onClose, onSuccess }: ProductSelectionModalProps) {
  const { formatCurrency } = useTimeRegion();
  const { data: products = [] } = useProducts({});
  const createSubscriptionMutation = useCreateProductSubscription();
  const calculatePricingMutation = useCalculateSubscriptionPricing();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedModules, setSelectedModules] = useState<Array<{
    moduleId: string;
    moduleName: string;
    isActive: boolean;
    selectedSubmodules: string[];
  }>>([]);
  const [contractLength, setContractLength] = useState({
    duration: 12,
    unit: 'months' as 'months' | 'years',
    startDate: new Date().toISOString().split('T')[0],
  });
  const [calculatedPricing, setCalculatedPricing] = useState<{
    oneTimeCharges: number;
    recurringCharges: number;
    totalAmount: number;
    currency: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing when modules/submodules change
  useEffect(() => {
    if (selectedProduct && selectedModules.length > 0) {
      const moduleSelections = selectedModules.map(module => ({
        moduleId: module.moduleId,
        selectedSubmodules: module.selectedSubmodules
      }));

      calculatePricingMutation.mutate(
        { product: selectedProduct, selectedModules: moduleSelections },
        {
          onSuccess: (pricing) => {
            setCalculatedPricing(pricing);
          }
        }
      );
    } else {
      setCalculatedPricing(null);
    }
  }, [selectedProduct, selectedModules]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSelectedModules([]);
    setCalculatedPricing(null);
  };

  const handleModuleToggle = (module: Module) => {
    setSelectedModules(prev => {
      const existingIndex = prev.findIndex(m => m.moduleId === module.id);
      
      if (existingIndex >= 0) {
        // Remove module
        return prev.filter(m => m.moduleId !== module.id);
      } else {
        // Add module
        return [...prev, {
          moduleId: module.id!,
          moduleName: module.name,
          isActive: true,
          selectedSubmodules: []
        }];
      }
    });
  };

  const handleSubmoduleToggle = (moduleId: string, submoduleId: string) => {
    setSelectedModules(prev => 
      prev.map(module => {
        if (module.moduleId === moduleId) {
          const submoduleIndex = module.selectedSubmodules.indexOf(submoduleId);
          if (submoduleIndex >= 0) {
            // Remove submodule
            return {
              ...module,
              selectedSubmodules: module.selectedSubmodules.filter(id => id !== submoduleId)
            };
          } else {
            // Add submodule
            return {
              ...module,
              selectedSubmodules: [...module.selectedSubmodules, submoduleId]
            };
          }
        }
        return module;
      })
    );
  };

  const calculateEndDate = () => {
    const startDate = new Date(contractLength.startDate);
    const endDate = new Date(startDate);
    
    if (contractLength.unit === 'months') {
      endDate.setMonth(endDate.getMonth() + contractLength.duration);
    } else {
      endDate.setFullYear(endDate.getFullYear() + contractLength.duration);
    }
    
    return endDate.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || selectedModules.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const subscriptionData: CreateProductSubscriptionInput = {
        clientId,
        productId: selectedProduct.id!,
        productName: selectedProduct.name,
        selectedModules: selectedModules.map(module => ({
          moduleId: module.moduleId,
          moduleName: module.moduleName,
          isActive: module.isActive,
          selectedSubmodules: module.selectedSubmodules.map(submoduleId => {
            const submodule = selectedProduct.modules
              .find(m => m.id === module.moduleId)
              ?.submodules.find(s => s.id === submoduleId);
            return {
              submoduleId,
              submoduleName: submodule?.name || '',
              isActive: true
            };
          })
        })),
        contractLength: {
          duration: contractLength.duration,
          unit: contractLength.unit,
          startDate: new Date(contractLength.startDate).toISOString(),
          endDate: calculateEndDate()
        },
        pricing: calculatedPricing ? {
          totalAmount: calculatedPricing.totalAmount,
          currency: calculatedPricing.currency,
          billingCycle: 'monthly', // Default, can be made configurable
          oneTimeCharges: calculatedPricing.oneTimeCharges,
          recurringCharges: calculatedPricing.recurringCharges
        } : {
          totalAmount: 0,
          currency: 'USD',
          billingCycle: 'monthly',
          oneTimeCharges: 0,
          recurringCharges: 0
        },
        status: 'pending'
      };

      await createSubscriptionMutation.mutateAsync(subscriptionData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create product subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable" style={{ marginTop: '2rem' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <Package className="h-5 w-5 me-2" />
              Add Product Subscription
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Product Selection */}
                <div className="col-md-4">
                  <h6 className="mb-3">Select Product</h6>
                  <div className="list-group">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        className={`list-group-item list-group-item-action ${
                          selectedProduct?.id === product.id ? 'active' : ''
                        }`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{product.name}</h6>
                          {selectedProduct?.id === product.id && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                        <p className="mb-1 small text-muted">{product.description}</p>
                        <small>{product.modules.length} modules</small>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Module/Submodule Selection */}
                <div className="col-md-5">
                  {selectedProduct ? (
                    <div>
                      <h6 className="mb-3">Select Modules & Submodules</h6>
                      <div className="accordion" id="modulesAccordion">
                        {selectedProduct.modules.map((module, moduleIndex) => (
                          <div key={module.id} className="accordion-item">
                            <h2 className="accordion-header">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#module-${moduleIndex}`}
                              >
                                <div className="d-flex align-items-center w-100">
                                  <input
                                    type="checkbox"
                                    className="form-check-input me-2"
                                    checked={selectedModules.some(m => m.moduleId === module.id)}
                                    onChange={() => handleModuleToggle(module)}
                                  />
                                  <span className="fw-semibold">{module.name}</span>
                                  <span className="badge bg-label-info ms-auto">
                                    {module.submodules.length} submodules
                                  </span>
                                </div>
                              </button>
                            </h2>
                            <div
                              id={`module-${moduleIndex}`}
                              className="accordion-collapse collapse"
                              data-bs-parent="#modulesAccordion"
                            >
                              <div className="accordion-body">
                                {selectedModules.some(m => m.moduleId === module.id) ? (
                                  <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <small className="text-success">
                                        <CheckCircle className="h-3 w-3 me-1" />
                                        Module selected - Choose submodules:
                                      </small>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => {
                                          const moduleSelection = selectedModules.find(m => m.moduleId === module.id);
                                          if (moduleSelection) {
                                            const allSubmoduleIds = module.submodules.map(s => s.id!);
                                            setSelectedModules(prev => 
                                              prev.map(m => 
                                                m.moduleId === module.id 
                                                  ? { ...m, selectedSubmodules: allSubmoduleIds }
                                                  : m
                                              )
                                            );
                                          }
                                        }}
                                      >
                                        Select All
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mb-2">
                                    <small className="text-muted">
                                      <AlertCircle className="h-3 w-3 me-1" />
                                      Select the module above to choose submodules
                                    </small>
                                  </div>
                                )}
                                {module.submodules.map((submodule) => {
                                  const isSelected = selectedModules
                                    .find(m => m.moduleId === module.id)
                                    ?.selectedSubmodules.includes(submodule.id!);
                                  const isModuleSelected = selectedModules.some(m => m.moduleId === module.id && m.isActive);
                                  
                                  return (
                                    <div key={submodule.id} className={`form-check mb-2 ${!isModuleSelected ? 'opacity-50' : ''}`}>
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={isSelected || false}
                                        onChange={() => handleSubmoduleToggle(module.id!, submodule.id!)}
                                        disabled={!isModuleSelected}
                                      />
                                      <label className="form-check-label d-flex justify-content-between align-items-center">
                                        <span>{submodule.name}</span>
                                        <div className="d-flex align-items-center">
                                          <span className="small text-success me-2">
                                            {formatCurrency(submodule.pricing.amount)}
                                          </span>
                                          <span className={`badge badge-sm ${
                                            submodule.pricing.type === 'one-time' ? 'bg-label-info' : 'bg-label-warning'
                                          }`}>
                                            {submodule.pricing.type === 'one-time' ? 'One-time' : 'Recurring'}
                                          </span>
                                        </div>
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <Package className="h-12 w-12 text-muted mb-2" />
                      <p className="text-muted">Select a product to configure modules</p>
                    </div>
                  )}
                </div>

                {/* Contract & Pricing Summary */}
                <div className="col-md-3">
                  <h6 className="mb-3">Contract Details</h6>
                  
                  {/* Contract Length */}
                  <div className="mb-3">
                    <label className="form-label">Contract Duration</label>
                    <div className="row">
                      <div className="col-8">
                        <input
                          type="number"
                          className="form-control"
                          value={contractLength.duration}
                          onChange={(e) => setContractLength(prev => ({
                            ...prev,
                            duration: parseInt(e.target.value) || 1
                          }))}
                          min="1"
                        />
                      </div>
                      <div className="col-4">
                        <select
                          className="form-select"
                          value={contractLength.unit}
                          onChange={(e) => setContractLength(prev => ({
                            ...prev,
                            unit: e.target.value as 'months' | 'years'
                          }))}
                        >
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={contractLength.startDate}
                      onChange={(e) => setContractLength(prev => ({
                        ...prev,
                        startDate: e.target.value
                      }))}
                    />
                  </div>

                  {/* Pricing Summary */}
                  {calculatedPricing && (
                    <div className="card border">
                      <div className="card-header">
                        <h6 className="mb-0">
                          <DollarSign className="h-4 w-4 me-1" />
                          Pricing Summary
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                          <small className="text-muted">One-time:</small>
                          <small className="text-info">
                            {formatCurrency(calculatedPricing.oneTimeCharges)}
                          </small>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <small className="text-muted">Recurring:</small>
                          <small className="text-warning">
                            {formatCurrency(calculatedPricing.recurringCharges)}
                          </small>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                          <strong>Total:</strong>
                          <strong className="text-success">
                            {formatCurrency(calculatedPricing.totalAmount)}
                          </strong>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!selectedProduct || selectedModules.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 me-1" />
                    Create Subscription
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
