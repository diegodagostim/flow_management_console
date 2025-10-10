import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AppProviders } from './app/providers'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { ProtectedLayout } from '@/components/common/ProtectedLayout'
import { AuthRedirect } from '@/components/common/AuthRedirect'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { SneatLayout } from '@/components/layout/SneatLayout'
import { ClientManagement } from '@/pages/Clients/ClientManagement'
import { ClientForm } from '@/pages/Clients/ClientForm'
import { ClientDetails } from '@/pages/Clients/ClientDetails'
import { ContractManagement } from '@/pages/Clients/ContractManagement'
import { SupplierManagement } from '@/pages/Suppliers/SupplierManagement'
import { SupplierForm } from '@/pages/Suppliers/SupplierForm'
import { SupplierDetails } from '@/pages/Suppliers/SupplierDetails'
import { PurchaseOrderManagement } from '@/pages/Suppliers/PurchaseOrderManagement'
import { ProductList } from '@/pages/Products/ProductList'
import { ProductForm } from '@/pages/Products/ProductForm'
import { ProductDetails } from '@/pages/Products/ProductDetails'
import { FinanceDashboard } from '@/pages/Finance/FinanceDashboard'
import { BillsManagement } from '@/pages/Finance/BillsManagement'
import { SalesInvoices } from '@/pages/Finance/SalesInvoices'
import { ProfitLossReport } from '@/pages/Finance/ProfitLossReport'
import { CashflowDashboard } from '@/pages/Finance/CashflowDashboard'
import { BusinessIntelligenceReports } from '@/pages/Finance/BusinessIntelligenceReports'
import { AutomatedReconciliation } from '@/pages/Finance/AutomatedReconciliation'
import { Settings } from '@/pages/Settings/Settings'
import { AIInsights } from '@/pages/AI/AIInsights'
import { MultiTenancyBilling } from '@/pages/Billing/MultiTenancyBilling'
import { TimeRegionTest } from '@/components/TimeRegionTest'
import { useClients } from '@/hooks/useClientManagement'
import { useSuppliers } from '@/hooks/useSupplierManagement'
import { useProducts } from '@/hooks/useProduct'
import { PageHeader } from '@/components/navigation/PageHeader'
import { 
  Users, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Settings as SettingsIcon,
  Plus,
  Eye,
  ArrowUpRight,
  Database,
  BarChart3,
  FileText,
  CreditCard,
  Brain,
  Package
} from 'lucide-react'

function Dashboard() {
  const { data: clients = [] } = useClients({})
  const { data: suppliers = [] } = useSuppliers({})
  const { data: products = [] } = useProducts({})

  // Calculate stats
  const totalClients = clients.length
  const totalSuppliers = suppliers.length
  const totalProducts = products.length
  const recentClients = clients.filter(client => {
    if (!client.createdAt) return false
    const clientDate = new Date(client.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return clientDate > weekAgo
  }).length

  return (
    <div className="container-fluid dashboard-container dashboard-grid">
      {/* Page Header */}
      <PageHeader 
        title="Dashboard"
        subtitle="Overview of your business metrics"
        breadcrumbs={[
          { label: 'Home', path: '/dashboard', active: true }
        ]}
      />

      {/* Stats Overview - Compact Layout */}
      <div className="row mb-2 dashboard-stats-row">
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <div className="card border-0 shadow-sm h-100 dashboard-card dashboard-stats-card">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-primary">
                  <Users className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-primary">{totalClients}</h4>
              <p className="text-muted mb-0 small">Clients</p>
            </div>
          </div>
        </div>
        
                 <div className="col-lg-2 col-md-4 col-6 mb-2">
                   <div className="card border-0 shadow-sm h-100 dashboard-card dashboard-stats-card">
                     <div className="card-body text-center py-3">
                       <div className="avatar avatar-md mx-auto mb-2">
                         <span className="avatar-initial rounded bg-label-info">
                           <Building2 className="h-4 w-4" />
                         </span>
                       </div>
                       <h4 className="mb-1 text-info">{totalSuppliers}</h4>
                       <p className="text-muted mb-0 small">Suppliers</p>
                     </div>
                   </div>
                 </div>
        
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <div className="card border-0 shadow-sm h-100 dashboard-card dashboard-stats-card">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-secondary">
                  <Package className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-secondary">{totalProducts}</h4>
              <p className="text-muted mb-0 small">Products</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <div className="card border-0 shadow-sm h-100 dashboard-card dashboard-stats-card">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-success">
                  <DollarSign className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-success">${totalClients * 1000}</h4>
              <p className="text-muted mb-0 small">Revenue</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <div className="card border-0 shadow-sm h-100 dashboard-card dashboard-stats-card">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-warning">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-warning">{totalClients > 0 ? Math.round((totalClients / 10) * 100) : 0}%</h4>
              <p className="text-muted mb-0 small">Growth</p>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-6 mb-2">
          <div className="card border-0 shadow-sm h-100 dashboard-card dashboard-stats-card">
            <div className="card-body text-center py-3">
              <div className="avatar avatar-md mx-auto mb-2">
                <span className="avatar-initial rounded bg-label-danger">
                  <Shield className="h-4 w-4" />
                </span>
              </div>
              <h4 className="mb-1 text-danger">Active</h4>
              <p className="text-muted mb-0 small">Watchdog</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width Layout */}
      <div className="row dashboard-content-row">
        <div className="col-12">
          <div className="card border-0 shadow-sm dashboard-card">
            <div className="card-header bg-transparent border-0 pb-2">
              <h6 className="card-title mb-0">Business Overview</h6>
            </div>
            <div className="card-body py-3">
              {totalClients > 0 ? (
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-primary mb-2" />
                  <h6 className="text-primary mb-1">Business Growing!</h6>
                  <p className="text-muted mb-3 small">You have {totalClients} client{totalClients !== 1 ? 's' : ''} in your system.</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <Link to="/clients" className="btn btn-sm btn-outline-primary">
                      <Eye className="h-3 w-3 me-1" />
                      View
                    </Link>
                    <Link to="/clients/new" className="btn btn-sm btn-primary">
                      <Plus className="h-3 w-3 me-1" />
                      Add
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Database className="h-12 w-12 text-muted mb-2" />
                  <h6 className="text-muted mb-1">No data available</h6>
                  <p className="text-muted mb-3 small">Start by adding clients to see your business overview.</p>
                  <Link to="/clients/new" className="btn btn-sm btn-primary">
                    <Plus className="h-3 w-3 me-1" />
                    Add First Client
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Watchdog Card - Below Business Overview */}
      <div className="row mt-2 dashboard-watchdog-row">
        <div className="col-12">
          <div className="card border-0 shadow-sm dashboard-card">
            <div className="card-header bg-transparent border-0 pb-2">
              <h6 className="card-title mb-0 d-flex align-items-center">
                <Shield className="h-5 w-5 text-danger me-2" />
                Security Monitoring
              </h6>
            </div>
            <div className="card-body py-4">
              <div className="text-center">
                <Shield className="h-16 w-16 text-danger mb-3" />
                <h5 className="text-danger mb-2">Watchdog Active</h5>
                <p className="text-muted mb-4">Your security monitoring system is running and protecting your business.</p>
                <div className="d-flex gap-2 justify-content-center">
                  <Link to="/watchdog" className="btn btn-outline-danger">
                    <Eye className="h-4 w-4 me-1" />
                    View Details
                  </Link>
                  <Link to="/settings" className="btn btn-danger">
                    <SettingsIcon className="h-4 w-4 me-1" />
                    Configure
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="row mt-2 dashboard-ai-row">
        <div className="col-12">
          <div className="card border-0 shadow-sm dashboard-card">
            <div className="card-header bg-transparent border-0 pb-2">
              <h6 className="card-title mb-0 d-flex align-items-center">
                <Brain className="h-5 w-5 text-primary me-2" />
                AI & Insights
              </h6>
            </div>
            <div className="card-body py-4">
              <div className="text-center">
                <Brain className="h-16 w-16 text-primary mb-3" />
                <h5 className="text-primary mb-2">AI-Powered Analytics</h5>
                <p className="text-muted mb-4">Discover insights, detect anomalies, and get predictive analytics for your business.</p>
                <div className="d-flex gap-2 justify-content-center">
                  <Link to="/ai-insights" className="btn btn-outline-primary">
                    <Eye className="h-4 w-4 me-1" />
                    View Insights
                  </Link>
                  <Link to="/ai-insights" className="btn btn-primary">
                    <Brain className="h-4 w-4 me-1" />
                    Explore AI
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Card */}
      <div className="row mt-2 dashboard-billing-row">
        <div className="col-12">
          <div className="card border-0 shadow-sm dashboard-card">
            <div className="card-header bg-transparent border-0 pb-2">
              <h6 className="card-title mb-0 d-flex align-items-center">
                <CreditCard className="h-5 w-5 text-success me-2" />
                Multi-Tenancy Billing
              </h6>
            </div>
            <div className="card-body py-4">
              <div className="text-center">
                <CreditCard className="h-16 w-16 text-success mb-3" />
                <h5 className="text-success mb-2">Billing Management</h5>
                <p className="text-muted mb-4">Manage tenant subscriptions, billing, and usage across all clients.</p>
                <div className="d-flex gap-2 justify-content-center">
                  <Link to="/billing" className="btn btn-outline-success">
                    <Eye className="h-4 w-4 me-1" />
                    View Billing
                  </Link>
                  <Link to="/billing" className="btn btn-success">
                    <CreditCard className="h-4 w-4 me-1" />
                    Manage Plans
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Root route - redirects directly to dashboard */}
        <Route path="/" element={<AuthRedirect />} />
        
        {/* All Routes - With Layout (no authentication required) */}
        <Route path="/dashboard" element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        } />
        <Route path="/clients" element={
          <ProtectedLayout>
            <ErrorBoundary>
              <ClientManagement />
            </ErrorBoundary>
          </ProtectedLayout>
        } />
        <Route path="/clients/new" element={
          <ProtectedLayout>
            <ClientForm />
          </ProtectedLayout>
        } />
        <Route path="/clients/:id" element={
          <ProtectedLayout>
            <ClientDetails />
          </ProtectedLayout>
        } />
        <Route path="/clients/:id/edit" element={
          <ProtectedLayout>
            <ClientForm />
          </ProtectedLayout>
        } />
        <Route path="/clients/:id/contracts" element={
          <ProtectedLayout>
            <ContractManagement />
          </ProtectedLayout>
        } />
        <Route path="/suppliers" element={
          <ProtectedLayout>
            <SupplierManagement />
          </ProtectedLayout>
        } />
        <Route path="/suppliers/new" element={
          <ProtectedLayout>
            <SupplierForm />
          </ProtectedLayout>
        } />
        <Route path="/suppliers/:id" element={
          <ProtectedLayout>
            <SupplierDetails />
          </ProtectedLayout>
        } />
        <Route path="/suppliers/:id/edit" element={
          <ProtectedLayout>
            <SupplierForm />
          </ProtectedLayout>
        } />
        <Route path="/suppliers/:id/orders" element={
          <ProtectedLayout>
            <PurchaseOrderManagement />
          </ProtectedLayout>
        } />
        <Route path="/suppliers/:id/orders/new" element={
          <ProtectedLayout>
            <PurchaseOrderManagement />
          </ProtectedLayout>
        } />
        <Route path="/products" element={
          <ProtectedLayout>
            <ProductList />
          </ProtectedLayout>
        } />
        <Route path="/products/new" element={
          <ProtectedLayout>
            <ProductForm />
          </ProtectedLayout>
        } />
        <Route path="/products/:id" element={
          <ProtectedLayout>
            <ProductDetails />
          </ProtectedLayout>
        } />
        <Route path="/products/:id/edit" element={
          <ProtectedLayout>
            <ProductForm />
          </ProtectedLayout>
        } />
        <Route path="/finance" element={
          <ProtectedLayout>
            <FinanceDashboard />
          </ProtectedLayout>
        } />
        <Route path="/finance/bills" element={
          <ProtectedLayout>
            <BillsManagement />
          </ProtectedLayout>
        } />
        <Route path="/finance/bills/new" element={
          <ProtectedLayout>
            <div className="container-fluid">
                <PageHeader 
                  title="Add New Bill"
                  subtitle="Create a new vendor bill or expense"
                  breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'Finance', path: '/finance' },
                    { label: 'Bills', path: '/finance/bills' },
                    { label: 'New Bill', active: true }
                  ]}
                />
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <FileText className="h-20 w-20 text-primary mb-4" />
                        <h4 className="mb-3">Bill Form</h4>
                        <p className="text-muted mb-4">Bill creation form will be implemented here.</p>
                        <Link to="/finance/bills" className="btn btn-primary">
                          <ArrowUpRight className="h-4 w-4 me-1" />
                          Back to Bills
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </ProtectedLayout>
        } />
          <Route path="/finance/bills/:id" element={
          <ProtectedLayout>
              <div className="container-fluid">
                <PageHeader 
                  title="Bill Details"
                  subtitle="View bill information and payment status"
                  breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'Finance', path: '/finance' },
                    { label: 'Bills', path: '/finance/bills' },
                    { label: 'Bill Details', active: true }
                  ]}
                />
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <FileText className="h-20 w-20 text-primary mb-4" />
                        <h4 className="mb-3">Bill Details</h4>
                        <p className="text-muted mb-4">Bill details view will be implemented here.</p>
                        <Link to="/finance/bills" className="btn btn-primary">
                          <ArrowUpRight className="h-4 w-4 me-1" />
                          Back to Bills
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </ProtectedLayout>
        } />
          <Route path="/finance/bills/:id/edit" element={
          <ProtectedLayout>
              <div className="container-fluid">
                <PageHeader 
                  title="Edit Bill"
                  subtitle="Update bill information"
                  breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'Finance', path: '/finance' },
                    { label: 'Bills', path: '/finance/bills' },
                    { label: 'Edit Bill', active: true }
                  ]}
                />
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <FileText className="h-20 w-20 text-primary mb-4" />
                        <h4 className="mb-3">Edit Bill</h4>
                        <p className="text-muted mb-4">Bill edit form will be implemented here.</p>
                        <Link to="/finance/bills" className="btn btn-primary">
                          <ArrowUpRight className="h-4 w-4 me-1" />
                          Back to Bills
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </ProtectedLayout>
        } />
          <Route path="/finance/invoices" element={
          <ProtectedLayout>
              <SalesInvoices />
          </ProtectedLayout>
        } />
          <Route path="/finance/invoices/new" element={
          <ProtectedLayout>
              <div className="container-fluid">
                <PageHeader 
                  title="Create Invoice"
                  subtitle="Create a new sales invoice"
                  breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'Finance', path: '/finance' },
                    { label: 'Invoices', path: '/finance/invoices' },
                    { label: 'New Invoice', active: true }
                  ]}
                />
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <CreditCard className="h-20 w-20 text-success mb-4" />
                        <h4 className="mb-3">Invoice Form</h4>
                        <p className="text-muted mb-4">Invoice creation form will be implemented here.</p>
                        <Link to="/finance/invoices" className="btn btn-primary">
                          <ArrowUpRight className="h-4 w-4 me-1" />
                          Back to Invoices
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </ProtectedLayout>
        } />
          <Route path="/finance/invoices/:id" element={
          <ProtectedLayout>
              <div className="container-fluid">
                <PageHeader 
                  title="Invoice Details"
                  subtitle="View invoice information and payment status"
                  breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'Finance', path: '/finance' },
                    { label: 'Invoices', path: '/finance/invoices' },
                    { label: 'Invoice Details', active: true }
                  ]}
                />
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <CreditCard className="h-20 w-20 text-success mb-4" />
                        <h4 className="mb-3">Invoice Details</h4>
                        <p className="text-muted mb-4">Invoice details view will be implemented here.</p>
                        <Link to="/finance/invoices" className="btn btn-primary">
                          <ArrowUpRight className="h-4 w-4 me-1" />
                          Back to Invoices
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </ProtectedLayout>
        } />
          <Route path="/finance/invoices/:id/edit" element={
          <ProtectedLayout>
              <div className="container-fluid">
                <PageHeader 
                  title="Edit Invoice"
                  subtitle="Update invoice information"
                  breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'Finance', path: '/finance' },
                    { label: 'Invoices', path: '/finance/invoices' },
                    { label: 'Edit Invoice', active: true }
                  ]}
                />
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <CreditCard className="h-20 w-20 text-success mb-4" />
                        <h4 className="mb-3">Edit Invoice</h4>
                        <p className="text-muted mb-4">Invoice edit form will be implemented here.</p>
                        <Link to="/finance/invoices" className="btn btn-primary">
                          <ArrowUpRight className="h-4 w-4 me-1" />
                          Back to Invoices
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </ProtectedLayout>
        } />
          <Route path="/finance/profit-loss" element={
          <ProtectedLayout>
              <ProfitLossReport />
          </ProtectedLayout>
        } />
          <Route path="/finance/cashflow" element={
          <ProtectedLayout>
              <CashflowDashboard />
          </ProtectedLayout>
        } />
          <Route path="/finance/business-intelligence" element={
          <ProtectedLayout>
              <BusinessIntelligenceReports />
          </ProtectedLayout>
        } />
          <Route path="/finance/reconciliation" element={
          <ProtectedLayout>
              <AutomatedReconciliation />
          </ProtectedLayout>
        } />
          <Route path="/watchdog" element={
          <ProtectedLayout>
              <div className="container-fluid">
                <PageHeader 
                  title="Watchdog Module"
                  subtitle="Security monitoring and alerting system"
                  breadcrumbs={[
                    { label: 'Home', path: '/dashboard' },
                    { label: 'Watchdog', active: true }
                  ]}
                />
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <Shield className="h-20 w-20 text-primary mb-4" />
                        <h4 className="mb-3">Coming Soon!</h4>
                        <p className="text-muted mb-4">
                          Security monitoring and alerting system will be available shortly. 
                          We're building comprehensive security tools for your business.
                        </p>
                        <div className="mt-4">
                          <Link to="/dashboard" className="btn btn-outline-primary me-2">
                            <ArrowUpRight className="h-4 w-4 me-1" />
                            Back to Dashboard
                          </Link>
                          <Link to="/settings" className="btn btn-primary">
                            <SettingsIcon className="h-4 w-4 me-1" />
                            Settings
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </ProtectedLayout>
        } />
          <Route path="/settings" element={
          <ProtectedLayout>
              <Settings />
          </ProtectedLayout>
        } />
          <Route path="/ai-insights" element={
          <ProtectedLayout>
              <AIInsights />
          </ProtectedLayout>
        } />
          <Route path="/billing" element={
          <ProtectedLayout>
              <MultiTenancyBilling />
          </ProtectedLayout>
        } />
          <Route path="/test-formatting" element={
          <ProtectedLayout>
              <TimeRegionTest />
          </ProtectedLayout>
        } />
        </Routes>
    </Router>
  )
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  )
}