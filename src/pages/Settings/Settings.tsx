import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAdapter } from '@/app/store'
import type { RootState } from '@/app/store'
import { GDPRCompliance } from '@/components/common/GDPRCompliance'
import { UserGroupManagement } from '@/components/UserGroupManagement'
import { PageHeader } from '@/components/navigation/PageHeader'
import { 
  Database, 
  Settings as SettingsIcon, 
  User, 
  Building2, 
  Shield, 
  Save, 
  Server,
  Globe,
  Users,
  Key,
  Mail,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'

export function Settings() {
  const dispatch = useDispatch();
  const currentAdapter = useSelector((state: RootState) => state.storage.adapter);
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleAdapterChange = (adapter: 'local' | 'supabase') => {
    dispatch(setAdapter(adapter))
  }

  const handleCompanyChange = (field: string, value: string) => {
    setCompanyData(prev => ({ ...prev, [field]: value }));
  }

  const handleSaveCompany = () => {
    console.log('Company details saved:', companyData);
  }

  const handleSaveSupabase = () => {
    console.log('Supabase configuration saved');
  }

  return (
    <div className="container-fluid settings-page">
      {/* Page Header */}
      <PageHeader 
        title="Settings"
        subtitle="Manage your application configuration and preferences"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Settings', active: true }
        ]}
      />

      {/* Settings Tabs */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-lg">
            <div className="card-header border-0 p-0">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link active" 
                    id="general-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#general" 
                    type="button" 
                    role="tab"
                    aria-controls="general"
                    aria-selected="true"
                  >
                    <SettingsIcon className="h-4 w-4 me-2" />
                    General
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link" 
                    id="company-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#company" 
                    type="button" 
                    role="tab"
                    aria-controls="company"
                    aria-selected="false"
                  >
                    <Building2 className="h-4 w-4 me-2" />
                    Company
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link" 
                    id="users-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#users" 
                    type="button" 
                    role="tab"
                    aria-controls="users"
                    aria-selected="false"
                  >
                    <Users className="h-4 w-4 me-2" />
                    User/Groups
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className="nav-link" 
                    id="security-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#security" 
                    type="button" 
                    role="tab"
                    aria-controls="security"
                    aria-selected="false"
                  >
                    <Shield className="h-4 w-4 me-2" />
                    Security
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content" id="settingsTabContent">
                {/* General Settings Tab */}
                <div className="tab-pane fade show active" id="general" role="tabpanel">
                  <div className="row">
                    {/* Data Storage Settings */}
                    <div className="col-lg-8 mb-4">
                      <div className="card border-0 bg-light">
                        <div className="card-header bg-transparent border-0 pb-0">
                          <h5 className="card-title mb-2 d-flex align-items-center">
                            <Database className="h-5 w-5 me-2 text-primary" />
                            Data Storage Configuration
                          </h5>
                          <p className="text-muted small mb-0">Choose how your data is stored and managed</p>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6 mb-4">
                              <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                  <div className="avatar avatar-xl mx-auto mb-3">
                                    <span className="avatar-initial rounded bg-label-info">
                                      <Server className="h-6 w-6" />
                                    </span>
                                  </div>
                                  <h6 className="mb-2">Local Storage</h6>
                                  <p className="text-muted small mb-3">Store data in your browser</p>
                                  <div className="form-check d-flex justify-content-center">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="storage"
                                      id="local"
                                      value="local"
                                      checked={currentAdapter === 'local'}
                                      onChange={() => handleAdapterChange('local')}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="local">
                                      Use Local Storage
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 mb-4">
                              <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body text-center">
                                  <div className="avatar avatar-xl mx-auto mb-3">
                                    <span className="avatar-initial rounded bg-label-success">
                                      <Globe className="h-6 w-6" />
                                    </span>
                                  </div>
                                  <h6 className="mb-2">Supabase Cloud</h6>
                                  <p className="text-muted small mb-3">Store data in the cloud</p>
                                  <div className="form-check d-flex justify-content-center">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="storage"
                                      id="supabase"
                                      value="supabase"
                                      checked={currentAdapter === 'supabase'}
                                      onChange={() => handleAdapterChange('supabase')}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="supabase">
                                      Use Supabase
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Storage Info Alert */}
                          <div className="alert alert-info d-flex align-items-start">
                            <Info className="h-4 w-4 me-2 mt-1" />
                            <div>
                              <strong>Current Storage:</strong> {currentAdapter === 'local' 
                                ? 'Data is stored locally in your browser. Perfect for personal use and testing.'
                                : 'Data is stored in the cloud using Supabase. Allows for data synchronization across devices.'
                              }
                            </div>
                          </div>

                          {/* Supabase Configuration */}
                          {currentAdapter === 'supabase' && (
                            <div className="mt-4">
                              <h6 className="mb-3 d-flex align-items-center">
                                <Key className="h-4 w-4 me-2" />
                                Supabase Configuration
                              </h6>
                              <div className="row">
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="supabase-url" className="form-label">Project URL</label>
                                  <input
                                    type="url"
                                    className="form-control"
                                    id="supabase-url"
                                    value={supabaseUrl}
                                    onChange={(e) => setSupabaseUrl(e.target.value)}
                                    placeholder="https://your-project.supabase.co"
                                  />
                                </div>
                                <div className="col-md-6 mb-3">
                                  <label htmlFor="supabase-key" className="form-label">Anon Key</label>
                                  <input
                                    type="password"
                                    className="form-control"
                                    id="supabase-key"
                                    value={supabaseKey}
                                    onChange={(e) => setSupabaseKey(e.target.value)}
                                    placeholder="Your Supabase anon key"
                                  />
                                </div>
                              </div>
                              <button 
                                className="btn btn-primary"
                                onClick={handleSaveSupabase}
                              >
                                <Save className="h-4 w-4 me-2" />
                                Save Configuration
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="col-lg-4 mb-4">
                      <div className="card border-0 bg-light">
                        <div className="card-header bg-transparent border-0 pb-0">
                          <h6 className="card-title mb-2">Quick Stats</h6>
                        </div>
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className="avatar avatar-sm me-3">
                              <span className="avatar-initial rounded bg-label-success">
                                <CheckCircle className="h-4 w-4" />
                              </span>
                            </div>
                            <div>
                              <p className="mb-0 fw-semibold">Storage Active</p>
                              <small className="text-muted">{currentAdapter === 'local' ? 'Local Storage' : 'Supabase Cloud'}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            <div className="avatar avatar-sm me-3">
                              <span className="avatar-initial rounded bg-label-primary">
                                <Database className="h-4 w-4" />
                              </span>
                            </div>
                            <div>
                              <p className="mb-0 fw-semibold">Data Sync</p>
                              <small className="text-muted">{currentAdapter === 'local' ? 'Disabled' : 'Enabled'}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-sm me-3">
                              <span className="avatar-initial rounded bg-label-warning">
                                <AlertCircle className="h-4 w-4" />
                              </span>
                            </div>
                            <div>
                              <p className="mb-0 fw-semibold">Status</p>
                              <small className="text-muted">All systems operational</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Settings Tab */}
                <div className="tab-pane fade" id="company" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="card border-0 bg-light">
                        <div className="card-header bg-transparent border-0 pb-0">
                          <h5 className="card-title mb-2 d-flex align-items-center">
                            <Building2 className="h-5 w-5 me-2 text-primary" />
                            Company Information
                          </h5>
                          <p className="text-muted small mb-0">Manage your company details and branding</p>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label htmlFor="company-name" className="form-label">
                                <Building2 className="h-4 w-4 me-1" />
                                Company Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                id="company-name"
                                value={companyData.name}
                                onChange={(e) => handleCompanyChange('name', e.target.value)}
                                placeholder="Enter company name"
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="company-email" className="form-label">
                                <Mail className="h-4 w-4 me-1" />
                                Company Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                id="company-email"
                                value={companyData.email}
                                onChange={(e) => handleCompanyChange('email', e.target.value)}
                                placeholder="Enter company email"
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="company-phone" className="form-label">
                                <Phone className="h-4 w-4 me-1" />
                                Company Phone
                              </label>
                              <input
                                type="tel"
                                className="form-control"
                                id="company-phone"
                                value={companyData.phone}
                                onChange={(e) => handleCompanyChange('phone', e.target.value)}
                                placeholder="Enter company phone"
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <label htmlFor="company-address" className="form-label">
                                <MapPin className="h-4 w-4 me-1" />
                                Company Address
                              </label>
                              <textarea
                                className="form-control"
                                id="company-address"
                                rows={3}
                                value={companyData.address}
                                onChange={(e) => handleCompanyChange('address', e.target.value)}
                                placeholder="Enter company address"
                              />
                            </div>
                          </div>
                          <div className="d-flex justify-content-end">
                            <button className="btn btn-primary" onClick={handleSaveCompany}>
                              <Save className="h-4 w-4 me-2" />
                              Save Company Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Users Settings Tab */}
                <div className="tab-pane fade" id="users" role="tabpanel">
                  <UserGroupManagement />
                </div>

                {/* Security Settings Tab */}
                <div className="tab-pane fade" id="security" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="card border-0 bg-light">
                        <div className="card-header bg-transparent border-0 pb-0">
                          <h5 className="card-title mb-2 d-flex align-items-center">
                            <Shield className="h-5 w-5 me-2 text-primary" />
                            Privacy & Security
                          </h5>
                          <p className="text-muted small mb-0">GDPR compliance and data protection settings</p>
                        </div>
                        <div className="card-body">
                          <GDPRCompliance />
                        </div>
                      </div>
                    </div>
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