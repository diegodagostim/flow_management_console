import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAdapter } from '@/app/store'
import type { RootState } from '@/app/store'
import { GDPRCompliance } from '@/components/common/GDPRCompliance'
import { UserGroupManagement } from '@/components/UserGroupManagement'
import { PageHeader } from '@/components/navigation/PageHeader'
import { useTimeRegion } from '@/hooks/useTimeRegion'
import { 
  Database, 
  Settings as SettingsIcon, 
  Building2, 
  Save, 
  Server,
  Globe,
  Users,
  Key,
  Mail,
  Phone,
  MapPin,
  Clock,
  Map,
  Calendar,
  DollarSign
} from 'lucide-react'

export function Settings() {
  const dispatch = useDispatch();
  const currentAdapter = useSelector((state: RootState) => state.storage.adapter);
  const { settings: timeRegionSettings, updateSettings: updateTimeRegionSettings } = useTimeRegion();
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

  const handleTimeRegionChange = (field: string, value: string) => {
    updateTimeRegionSettings({ [field]: value });
  }

  const handleSaveTimeRegion = () => {
    console.log('Time & Region settings saved:', timeRegionSettings);
  }

  return (
    <div className="container-fluid settings-page">
      <PageHeader 
        title="Settings"
        subtitle="Manage your application configuration and preferences"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Settings', active: true }
        ]}
      />

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
                    id="time-region-tab" 
                    data-bs-toggle="tab" 
                    data-bs-target="#time-region" 
                    type="button" 
                    role="tab"
                    aria-controls="time-region"
                    aria-selected="false"
                  >
                    <Clock className="h-4 w-4 me-2" />
                    Time & Region
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              <div className="tab-content" id="settingsTabContent">
                <div className="tab-pane fade show active" id="general" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8 mb-4">
                      <div className="mb-4">
                        <h5 className="mb-2 d-flex align-items-center">
                          <Database className="h-5 w-5 me-2 text-primary" />
                          Data Storage Configuration
                        </h5>
                        <p className="text-muted small mb-3">Choose how your data is stored and managed</p>
                        <div className="row">
                          <div className="col-md-6 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                              <div className="card-body text-center">
                                <div className="avatar avatar-xl mx-auto mb-3">
                                  <span className="avatar-initial rounded bg-label-primary">
                                    <Server className="h-6 w-6" />
                                  </span>
                                </div>
                                <h6 className="mb-2">Local Storage</h6>
                                <p className="text-muted small mb-3">Store data in your browser's local storage</p>
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
                                  placeholder="e.g., https://your-project-id.supabase.co"
                                />
                              </div>
                              <div className="col-md-6 mb-3">
                                <label htmlFor="supabase-key" className="form-label">Anon Key</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="supabase-key"
                                  value={supabaseKey}
                                  onChange={(e) => setSupabaseKey(e.target.value)}
                                  placeholder="Your Supabase anon key"
                                />
                              </div>
                            </div>
                            <div className="d-flex justify-content-end">
                              <button className="btn btn-primary" onClick={handleSaveSupabase}>
                                <Save className="h-4 w-4 me-2" />
                                Save Supabase Config
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4 mb-4">
                      <div className="mb-4">
                        <h6 className="mb-3">GDPR Compliance</h6>
                        <GDPRCompliance />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-pane fade" id="company" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="mb-4">
                        <h5 className="mb-2 d-flex align-items-center">
                          <Building2 className="h-5 w-5 me-2 text-primary" />
                          Company Information
                        </h5>
                        <p className="text-muted small mb-3">Manage your company details and branding</p>
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
                            ></textarea>
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

                <div className="tab-pane fade" id="users" role="tabpanel">
                  <UserGroupManagement />
                </div>

                <div className="tab-pane fade" id="time-region" role="tabpanel">
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="mb-4">
                        <h5 className="mb-2 d-flex align-items-center">
                          <Clock className="h-5 w-5 me-2 text-primary" />
                          Time & Region Settings
                        </h5>
                        <p className="text-muted small mb-3">Configure timezone, date formats, and regional preferences</p>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label htmlFor="timezone" className="form-label">
                              <Clock className="h-4 w-4 me-1" />
                              Timezone
                            </label>
                            <select
                              className="form-select"
                              id="timezone"
                              value={timeRegionSettings.timezone}
                              onChange={(e) => handleTimeRegionChange('timezone', e.target.value)}
                            >
                              <option value="UTC">UTC (Coordinated Universal Time)</option>
                              <option value="America/New_York">Eastern Time (ET) - New York</option>
                              <option value="America/Chicago">Central Time (CT) - Chicago</option>
                              <option value="America/Denver">Mountain Time (MT) - Denver</option>
                              <option value="America/Los_Angeles">Pacific Time (PT) - Los Angeles</option>
                              <option value="Europe/London">Greenwich Mean Time (GMT) - London</option>
                              <option value="Europe/Paris">Central European Time (CET) - Paris</option>
                              <option value="Asia/Tokyo">Japan Standard Time (JST) - Tokyo</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="dateFormat" className="form-label">
                              <Calendar className="h-4 w-4 me-1" />
                              Date Format
                            </label>
                            <select
                              className="form-select"
                              id="dateFormat"
                              value={timeRegionSettings.dateFormat}
                              onChange={(e) => handleTimeRegionChange('dateFormat', e.target.value)}
                            >
                              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY (EU)</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                              <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                              <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="timeFormat" className="form-label">
                              <Clock className="h-4 w-4 me-1" />
                              Time Format
                            </label>
                            <select
                              className="form-select"
                              id="timeFormat"
                              value={timeRegionSettings.timeFormat}
                              onChange={(e) => handleTimeRegionChange('timeFormat', e.target.value)}
                            >
                              <option value="12h">12-hour (AM/PM)</option>
                              <option value="24h">24-hour</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="currency" className="form-label">
                              <DollarSign className="h-4 w-4 me-1" />
                              Currency
                            </label>
                            <select
                              className="form-select"
                              id="currency"
                              value={timeRegionSettings.currency}
                              onChange={(e) => handleTimeRegionChange('currency', e.target.value)}
                            >
                              <option value="USD">USD - US Dollar</option>
                              <option value="EUR">EUR - Euro</option>
                              <option value="GBP">GBP - British Pound Sterling</option>
                              <option value="JPY">JPY - Japanese Yen</option>
                              <option value="CAD">CAD - Canadian Dollar</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="language" className="form-label">
                              <Globe className="h-4 w-4 me-1" />
                              Language
                            </label>
                            <select
                              className="form-select"
                              id="language"
                              value={timeRegionSettings.language}
                              onChange={(e) => handleTimeRegionChange('language', e.target.value)}
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                              <option value="it">Italian</option>
                            </select>
                          </div>

                          <div className="col-md-6 mb-3">
                            <label htmlFor="country" className="form-label">
                              <Map className="h-4 w-4 me-1" />
                              Country
                            </label>
                            <select
                              className="form-select"
                              id="country"
                              value={timeRegionSettings.country}
                              onChange={(e) => handleTimeRegionChange('country', e.target.value)}
                            >
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="GB">United Kingdom</option>
                              <option value="DE">Germany</option>
                              <option value="FR">France</option>
                              <option value="JP">Japan</option>
                            </select>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <button className="btn btn-primary" onClick={handleSaveTimeRegion}>
                            <Save className="h-4 w-4 me-2" />
                            Save Time & Region Settings
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="mb-4">
                        <h6 className="mb-3">Current Settings</h6>
                        <div className="d-flex align-items-center mb-3">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded bg-label-primary">
                              <Clock className="h-4 w-4" />
                            </span>
                          </div>
                          <div>
                            <p className="mb-0 fw-semibold">Timezone</p>
                            <small className="text-muted">{timeRegionSettings.timezone}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded bg-label-success">
                              <Calendar className="h-4 w-4" />
                            </span>
                          </div>
                          <div>
                            <p className="mb-0 fw-semibold">Date Format</p>
                            <small className="text-muted">{timeRegionSettings.dateFormat}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded bg-label-info">
                              <DollarSign className="h-4 w-4" />
                            </span>
                          </div>
                          <div>
                            <p className="mb-0 fw-semibold">Currency</p>
                            <small className="text-muted">{timeRegionSettings.currency}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm me-3">
                            <span className="avatar-initial rounded bg-label-warning">
                              <Globe className="h-4 w-4" />
                            </span>
                          </div>
                          <div>
                            <p className="mb-0 fw-semibold">Language</p>
                            <small className="text-muted">{timeRegionSettings.language.toUpperCase()}</small>
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
    </div>
  );
}