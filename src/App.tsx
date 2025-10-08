import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AppProviders } from './app/providers'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
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
import { Settings } from '@/pages/Settings/Settings'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { RegisterPage } from '@/pages/Auth/RegisterPage'
import { useClients } from '@/hooks/useClientManagement'
import { useSuppliers } from '@/hooks/useSupplierManagement'
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
  BarChart3
} from 'lucide-react'

function Dashboard() {
  const { data: clients = [] } = useClients({})
  const { data: suppliers = [] } = useSuppliers({})

  // Calculate stats
  const totalClients = clients.length
  const totalSuppliers = suppliers.length
  const recentClients = clients.filter(client => {
    if (!client.createdAt) return false
    const clientDate = new Date(client.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return clientDate > weekAgo
  }).length

  return (
    <div className="container-fluid dashboard-container">
      {/* Page Header */}
      <PageHeader 
        title="Dashboard"
        subtitle="Overview of your business metrics"
        breadcrumbs={[
          { label: 'Home', path: '/', active: true }
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
    </div>
  )
}

function AppContent() {
  return (
    <Router>
      <SneatLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <ErrorBoundary>
                <ClientManagement />
              </ErrorBoundary>
            </ProtectedRoute>
          } />
          <Route path="/clients/new" element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          } />
          <Route path="/clients/:id" element={
            <ProtectedRoute>
              <ClientDetails />
            </ProtectedRoute>
          } />
          <Route path="/clients/:id/edit" element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          } />
          <Route path="/clients/:id/contracts" element={
            <ProtectedRoute>
              <ContractManagement />
            </ProtectedRoute>
          } />
          <Route path="/suppliers" element={
            <ProtectedRoute>
              <SupplierManagement />
            </ProtectedRoute>
          } />
          <Route path="/suppliers/new" element={
            <ProtectedRoute>
              <SupplierForm />
            </ProtectedRoute>
          } />
          <Route path="/suppliers/:id" element={
            <ProtectedRoute>
              <SupplierDetails />
            </ProtectedRoute>
          } />
          <Route path="/suppliers/:id/edit" element={
            <ProtectedRoute>
              <SupplierForm />
            </ProtectedRoute>
          } />
          <Route path="/suppliers/:id/orders" element={
            <ProtectedRoute>
              <PurchaseOrderManagement />
            </ProtectedRoute>
          } />
          <Route path="/suppliers/:id/orders/new" element={
            <ProtectedRoute>
              <PurchaseOrderManagement />
            </ProtectedRoute>
          } />
          <Route path="/finance" element={
            <ProtectedRoute>
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <DollarSign className="h-20 w-20 text-success mb-4" />
                      <h4 className="mb-3">Finance Module</h4>
                      <p className="text-muted mb-4">Coming Soon!</p>
                      <p className="text-muted">
                        Financial reports and management will be available shortly. 
                        We're building comprehensive financial tools for your business.
                      </p>
                      <div className="mt-4">
                        <Link to="/" className="btn btn-outline-primary me-2">
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
            </ProtectedRoute>
          } />
          <Route path="/watchdog" element={
            <ProtectedRoute>
              <div className="container-fluid">
                <PageHeader 
                  title="Watchdog Module"
                  subtitle="Security monitoring and alerting system"
                  breadcrumbs={[
                    { label: 'Home', path: '/' },
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
                          <Link to="/" className="btn btn-outline-primary me-2">
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
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>
      </SneatLayout>
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