import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AppProviders } from './app/providers'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { SneatLayout } from '@/components/layout/SneatLayout'
import { ClientList } from '@/pages/Clients/ClientList'
import { ClientForm } from '@/pages/Clients/ClientForm'
import { ClientDetails } from '@/pages/Clients/ClientDetails'
import { Settings } from '@/pages/Settings/Settings'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { RegisterPage } from '@/pages/Auth/RegisterPage'
import { useClients } from '@/hooks/useClient'
import { 
  Users, 
  Building2, 
  DollarSign, 
  Database,
  Plus,
  TrendingUp,
  BarChart3,
  Activity,
  ArrowUpRight,
  Eye,
  Settings as SettingsIcon,
  MoreVertical,
  Wallet,
  ChevronUp,
  Clock
} from 'lucide-react'

function Dashboard() {
  const { data: clients = [] } = useClients({})

  // Calculate stats
  const totalClients = clients.length
  const recentClients = clients.filter(client => {
    if (!client.createdAt) return false
    const clientDate = new Date(client.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return clientDate > weekAgo
  }).length

  return (
    <div className="row">
      {/* Welcome Card */}
      <div className="col-lg-8 mb-4 order-0">
        <div className="card">
          <div className="d-flex align-items-end row">
            <div className="col-12">
              <div className="card-body">
                <h5 className="card-title text-primary">Welcome to Flow Management Console! 🎉</h5>
                <p className="mb-4">
                  You have done <span className="fw-bold">{totalClients > 0 ? '100%' : '0%'}</span> more business setup today. 
                  {totalClients === 0 ? ' Start by adding your first client!' : ` You now have ${totalClients} client${totalClients !== 1 ? 's' : ''}.`}
                </p>
                <div className="d-flex gap-2">
                  <Link to="/clients/new" className="btn btn-sm btn-primary">
                    <Plus className="h-4 w-4 me-1" />
                    Add Client
                  </Link>
                  <Link to="/clients" className="btn btn-sm btn-outline-primary">
                    <Eye className="h-4 w-4 me-1" />
                    View All
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="col-lg-4 col-md-4 order-1">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-primary">
                      <Users className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <Link className="dropdown-item" to="/clients">
                        <Eye className="me-2" size={16} /> View All
                      </Link>
                      <Link className="dropdown-item" to="/clients/new">
                        <Plus className="me-2" size={16} /> Add New
                      </Link>
                    </div>
                  </div>
                </div>
                <span className="fw-semibold d-block mb-1">Total Clients</span>
                <h3 className="card-title mb-2">{totalClients}</h3>
                <small className={`fw-semibold ${recentClients > 0 ? 'text-success' : 'text-muted'}`}>
                  <ChevronUp className="h-4 w-4 me-1" /> 
                  {recentClients > 0 ? `+${recentClients} this week` : 'No recent activity'}
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-info">
                      <Building2 className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn p-0"
                      type="button"
                      id="cardOpt6"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt6">
                      <a className="dropdown-item" href="javascript:void(0);">
                        <Eye className="me-2" size={16} /> View More
                      </a>
                      <a className="dropdown-item" href="javascript:void(0);">
                        <Plus className="me-2" size={16} /> Add New
                      </a>
                    </div>
                  </div>
                </div>
                <span>Total Suppliers</span>
                <h3 className="card-title text-nowrap mb-1">0</h3>
                <small className="text-info fw-semibold">
                  <Clock className="h-4 w-4 me-1" /> Coming Soon
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
        <div className="card">
          <div className="row row-bordered g-0">
            <div className="col-md-8">
              <h5 className="card-header m-0 me-2 pb-3">Business Overview</h5>
              <div id="totalRevenueChart" className="px-2 py-4">
                {totalClients > 0 ? (
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-primary mb-3" />
                    <h6 className="text-primary">Business Growing!</h6>
                    <p className="text-muted">You have {totalClients} client{totalClients !== 1 ? 's' : ''} in your system.</p>
                    <div className="mt-3">
                      <Link to="/clients" className="btn btn-sm btn-outline-primary me-2">
                        <Eye className="h-4 w-4 me-1" />
                        View Clients
                      </Link>
                      <Link to="/clients/new" className="btn btn-sm btn-primary">
                        <Plus className="h-4 w-4 me-1" />
                        Add More
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Database className="h-16 w-16 text-muted mb-3" />
                    <h6 className="text-muted">No data available yet</h6>
                    <p className="text-muted">Start by adding clients to see your business overview.</p>
                    <div className="mt-3">
                      <Link to="/clients/new" className="btn btn-sm btn-primary">
                        <Plus className="h-4 w-4 me-1" />
                        Add Your First Client
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="card-body">
                <div className="text-center">
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-primary dropdown-toggle"
                      type="button"
                      id="growthReportId"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {new Date().getFullYear()}
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="growthReportId">
                      <a className="dropdown-item" href="javascript:void(0);">{new Date().getFullYear() - 1}</a>
                      <a className="dropdown-item" href="javascript:void(0);">{new Date().getFullYear() - 2}</a>
                    </div>
                  </div>
                </div>
                <div id="growthChart" className="text-center py-3">
                  <Activity className="h-12 w-12 text-primary mb-2" />
                </div>
                <div className="text-center fw-semibold pt-3 mb-2">
                  {totalClients > 0 ? `${Math.round((totalClients / 10) * 100)}%` : '0%'} Business Growth
                </div>

                <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between">
                         <div className="d-flex">
                           <div className="me-2">
                             <span className="badge bg-label-primary p-2">
                               <DollarSign className="h-4 w-4" style={{ color: '#20b2aa' }} />
                             </span>
                           </div>
                    <div className="d-flex flex-column">
                      <small>{new Date().getFullYear()}</small>
                      <h6 className="mb-0">${totalClients * 1000}</h6>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="me-2">
                      <span className="badge bg-label-info p-2">
                        <Wallet className="h-4 w-4 text-info" />
                      </span>
                    </div>
                    <div className="d-flex flex-column">
                      <small>{new Date().getFullYear() - 1}</small>
                      <h6 className="mb-0">$0</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
        <div className="row">
          <div className="col-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-success">
                      <DollarSign className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn p-0"
                      type="button"
                      id="cardOpt4"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                      <a className="dropdown-item" href="javascript:void(0);">View More</a>
                      <a className="dropdown-item" href="javascript:void(0);">Settings</a>
                    </div>
                  </div>
                </div>
                <span className="d-block mb-1">Revenue</span>
                <h3 className="card-title text-nowrap mb-2">${totalClients * 1000}</h3>
                <small className={`fw-semibold ${totalClients > 0 ? 'text-success' : 'text-muted'}`}>
                  <ChevronUp className="h-4 w-4 me-1" /> 
                  {totalClients > 0 ? `+${totalClients * 100}%` : 'No data'}
                </small>
              </div>
            </div>
          </div>
          <div className="col-6 mb-4">
      <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-warning">
                      <TrendingUp className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn p-0"
                      type="button"
                      id="cardOpt1"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <MoreVertical className="h-4 w-4" />
        </button>
                    <div className="dropdown-menu" aria-labelledby="cardOpt1">
                      <a className="dropdown-item" href="javascript:void(0);">View More</a>
                      <a className="dropdown-item" href="javascript:void(0);">Settings</a>
                    </div>
                  </div>
                </div>
                <span className="fw-semibold d-block mb-1">Growth</span>
                <h3 className="card-title mb-2">{totalClients > 0 ? Math.round((totalClients / 10) * 100) : 0}%</h3>
                <small className={`fw-semibold ${totalClients > 0 ? 'text-success' : 'text-muted'}`}>
                  <ChevronUp className="h-4 w-4 me-1" /> 
                  {totalClients > 0 ? '+100%' : 'No data'}
                </small>
              </div>
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between flex-sm-row flex-column gap-3">
                  <div className="d-flex flex-sm-column flex-row align-items-start justify-content-between">
                    <div className="card-title">
                      <h5 className="text-nowrap mb-2">Quick Actions</h5>
                      <span className="badge bg-label-primary rounded-pill">Ready to use</span>
                    </div>
                    <div className="mt-sm-auto">
                      <small className={`text-nowrap fw-semibold ${totalClients > 0 ? 'text-success' : 'text-muted'}`}>
                        <ChevronUp className="h-4 w-4 me-1" /> 
                        {totalClients > 0 ? 'Active' : 'Setup'}
                      </small>
                      <h3 className="mb-0">{totalClients}</h3>
                    </div>
                  </div>
                  <div id="profileReportChart" className="text-center">
                    <div className="d-grid gap-2">
                      <Link to="/clients/new" className="btn btn-sm btn-primary">
                        <Plus className="h-4 w-4 me-1" />
                        Add Client
                      </Link>
                      <Link to="/settings" className="btn btn-sm btn-outline-secondary">
                        <SettingsIcon className="h-4 w-4 me-1" />
                        Settings
                      </Link>
                    </div>
                  </div>
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
              <ClientList />
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
          <Route path="/suppliers" element={
            <ProtectedRoute>
              <div className="row">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <Building2 className="h-20 w-20 text-primary mb-4" />
                      <h4 className="mb-3">Suppliers Module</h4>
                      <p className="text-muted mb-4">Coming Soon!</p>
                      <p className="text-muted">
                        We are actively working on this feature. Supplier management will be available shortly.
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