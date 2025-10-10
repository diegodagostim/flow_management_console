import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/useProduct';
import { useDeleteProduct } from '@/hooks/useProduct';
import { useTimeRegion } from '@/hooks/useTimeRegion';
import { Plus, Search, Edit, Trash2, Eye, Package, DollarSign, Tag } from 'lucide-react';
import { PageHeader } from '@/components/navigation/PageHeader';

export function ProductList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const { data: products = [], isLoading, error } = useProducts({ search: searchTerm, category: categoryFilter })
  const deleteProductMutation = useDeleteProduct()
  const { formatCurrency } = useTimeRegion()

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  if (isLoading) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h6 className="text-muted">Loading products...</h6>
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
              <h6 className="text-danger mb-2">Error loading products</h6>
              <p className="text-muted">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <PageHeader 
        title="Products"
        subtitle="Manage your SaaS products and modules"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Products', active: true }
        ]}
      >
        <Link to="/products/new">
          <button className="btn btn-primary">
            <Plus className="h-4 w-4 me-2" />
            Add Product
          </button>
        </Link>
      </PageHeader>

      <div className="row">
        <div className="col-12">

        {/* Search and Filters */}
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
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <Package className="h-5 w-5 me-2" />
              Products ({products.length})
            </h5>
          </div>
          <div className="card-body p-0">
            {products.length === 0 ? (
              <div className="text-center py-5">
                <div className="avatar avatar-xl mx-auto mb-3">
                  <span className="avatar-initial rounded bg-label-secondary">
                    <Package className="h-6 w-6" />
                  </span>
                </div>
                <h6 className="text-muted mb-2">No products found</h6>
                <p className="text-muted mb-4">Get started by creating your first product</p>
                <Link to="/products/new">
                  <button className="btn btn-primary">
                    <Plus className="h-4 w-4 me-2" />
                    Add Product
                  </button>
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Modules</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const totalModules = product.modules.length
                      const totalSubmodules = product.modules.reduce((acc, module) => acc + module.submodules.length, 0)
                      
                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {product.logo ? (
                                <img 
                                  src={product.logo} 
                                  alt={product.name}
                                  className="rounded me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div className="avatar avatar-sm me-3">
                                  <span className="avatar-initial rounded bg-label-primary">
                                    <Package className="h-4 w-4" />
                                  </span>
                                </div>
                              )}
                              <div>
                                <h6 className="mb-0">{product.name}</h6>
                                {product.description && (
                                  <small className="text-muted">{product.description}</small>
                                )}
                                {product.tags.length > 0 && (
                                  <div className="mt-1">
                                    {product.tags.slice(0, 2).map(tag => (
                                      <span key={tag} className="badge bg-label-secondary me-1">
                                        <Tag className="h-3 w-3 me-1" />
                                        {tag}
                                      </span>
                                    ))}
                                    {product.tags.length > 2 && (
                                      <span className="badge bg-label-secondary">
                                        +{product.tags.length - 2}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {product.category ? (
                              <span className="badge bg-label-info">{product.category}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <div>
                              <span className="badge bg-label-primary me-1">
                                {totalModules} modules
                              </span>
                              {totalSubmodules > 0 && (
                                <span className="badge bg-label-secondary">
                                  {totalSubmodules} submodules
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${product.isActive ? 'bg-label-success' : 'bg-label-danger'}`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link to={`/products/${product.id}`}>
                                <button className="btn btn-sm btn-outline-primary">
                                  <Eye className="h-4 w-4" />
                                </button>
                              </Link>
                              <Link to={`/products/${product.id}/edit`}>
                                <button className="btn btn-sm btn-outline-secondary">
                                  <Edit className="h-4 w-4" />
                                </button>
                              </Link>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(product.id!)}
                                disabled={deleteProductMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
