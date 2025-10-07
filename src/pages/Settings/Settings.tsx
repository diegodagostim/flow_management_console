import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAdapter } from '@/app/store'
import type { RootState } from '@/app/store'
import { GDPRCompliance } from '@/components/common/GDPRCompliance'
import { Database, Settings as SettingsIcon, User, Building2, Shield, Save } from 'lucide-react'

export function Settings() {
  const dispatch = useDispatch();
  const currentAdapter = useSelector((state: RootState) => state.storage.adapter);
  const [supabaseUrl, setSupabaseUrl] = useState(import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || '');

  const handleAdapterChange = (adapter: 'local' | 'supabase') => {
    dispatch(setAdapter(adapter))
  }

  return (
    <div className="row">
      <div className="col-12">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <div className="avatar avatar-sm me-3">
            <span className="avatar-initial rounded bg-label-primary">
              <SettingsIcon className="h-4 w-4" />
            </span>
          </div>
          <div>
            <h4 className="mb-1">Settings</h4>
            <p className="text-muted mb-0">Manage your application configuration</p>
          </div>
        </div>

        <div className="row">
          {/* Application Registration */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="card-title mb-0">
                  <SettingsIcon className="h-4 w-4 me-2" />
                  Application Registration
                </h6>
                <p className="text-muted small mb-0">Configure data storage and application settings</p>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6 className="mb-3">Data Storage</h6>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="storage"
                        id="local"
                        value="local"
                        checked={currentAdapter === 'local'}
                        onChange={() => handleAdapterChange('local')}
                      />
                      <label className="form-check-label d-flex align-items-center" htmlFor="local">
                        <Database className="h-4 w-4 me-2" />
                        Local Storage (Browser)
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="storage"
                        id="supabase"
                        value="supabase"
                        checked={currentAdapter === 'supabase'}
                        onChange={() => handleAdapterChange('supabase')}
                      />
                      <label className="form-check-label d-flex align-items-center" htmlFor="supabase">
                        <Database className="h-4 w-4 me-2" />
                        Supabase (Cloud Database)
                      </label>
                    </div>
                  </div>
                  <div className="alert alert-info">
                    <small>
                      {currentAdapter === 'local' 
                        ? 'Data is stored locally in your browser. This is perfect for personal use and testing.'
                        : 'Data is stored in the cloud using Supabase. This allows for data synchronization across devices.'
                      }
                    </small>
                  </div>
                </div>

                {currentAdapter === 'supabase' && (
                  <div>
                    <h6 className="mb-3">Supabase Configuration</h6>
                    <div className="mb-3">
                      <label htmlFor="supabase-url" className="form-label">Supabase URL</label>
                      <input
                        type="text"
                        className="form-control"
                        id="supabase-url"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://your-project.supabase.co"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="supabase-key" className="form-label">Supabase Anon Key</label>
                      <input
                        type="password"
                        className="form-control"
                        id="supabase-key"
                        value={supabaseKey}
                        onChange={(e) => setSupabaseKey(e.target.value)}
                        placeholder="Your Supabase anon key"
                      />
                    </div>
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        console.log('Supabase configuration saved');
                      }}
                    >
                      <Save className="h-4 w-4 me-2" />
                      Save Configuration
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="card-title mb-0">
                  <Building2 className="h-4 w-4 me-2" />
                  Company Details
                </h6>
                <p className="text-muted small mb-0">Manage your company information and branding</p>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="company-name" className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="company-name"
                    placeholder="Enter company name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="company-email" className="form-label">Company Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="company-email"
                    placeholder="Enter company email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="company-phone" className="form-label">Company Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="company-phone"
                    placeholder="Enter company phone"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="company-address" className="form-label">Company Address</label>
                  <textarea
                    className="form-control"
                    id="company-address"
                    rows={4}
                    placeholder="Enter company address"
                  />
                </div>
                <button className="btn btn-primary">
                  <Save className="h-4 w-4 me-2" />
                  Save Company Details
                </button>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="card-title mb-0">
                  <User className="h-4 w-4 me-2" />
                  User Management
                </h6>
                <p className="text-muted small mb-0">Manage user accounts and permissions</p>
              </div>
              <div className="card-body">
                <div className="text-center py-4">
                  <User className="h-12 w-12 text-muted mb-3" />
                  <p className="text-muted mb-3">
                    User management features will be available when authentication is implemented.
                  </p>
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-primary" disabled>
                      Add User
                    </button>
                    <button className="btn btn-outline-secondary" disabled>
                      Manage Permissions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="card-title mb-0">
                  <Shield className="h-4 w-4 me-2" />
                  Privacy & Security
                </h6>
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
  );
}