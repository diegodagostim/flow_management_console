import { useState, useEffect } from 'react'
import { 
  Plug, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Save, 
  Eye, 
  EyeOff,
  Key,
  Mail,
  Server,
  Database,
  Globe,
  Settings as SettingsIcon,
  RefreshCw,
  TestTube,
  Phone
} from 'lucide-react'

interface IntegrationConfig {
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey: string
    enabled: boolean
    status: 'connected' | 'disconnected' | 'error' | 'testing'
  }
  email: {
    provider: 'smtp' | 'sendgrid' | 'mailgun' | 'ses'
    smtpHost: string
    smtpPort: string
    smtpUser: string
    smtpPassword: string
    apiKey: string
    enabled: boolean
    status: 'connected' | 'disconnected' | 'error' | 'testing'
  }
  apiKeys: {
    stripe: string
    paypal: string
    twilio: string
    googleMaps: string
    openai: string
  }
}

export function IntegrationSettings() {
  const [config, setConfig] = useState<IntegrationConfig>({
    supabase: {
      url: '',
      anonKey: '',
      serviceRoleKey: '',
      enabled: false,
      status: 'disconnected'
    },
    email: {
      provider: 'smtp',
      smtpHost: '',
      smtpPort: '587',
      smtpUser: '',
      smtpPassword: '',
      apiKey: '',
      enabled: false,
      status: 'disconnected'
    },
    apiKeys: {
      stripe: '',
      paypal: '',
      twilio: '',
      googleMaps: '',
      openai: ''
    }
  })

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({
    supabaseAnon: false,
    supabaseService: false,
    smtpPassword: false,
    stripe: false,
    paypal: false,
    twilio: false,
    googleMaps: false,
    openai: false
  })

  const [testing, setTesting] = useState<Record<string, boolean>>({})

  // Load saved configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('integration-config')
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig))
      } catch (error) {
        console.error('Failed to load integration config:', error)
      }
    }
  }, [])

  // Save configuration to localStorage
  const saveConfig = () => {
    localStorage.setItem('integration-config', JSON.stringify(config))
  }

  // Test connection for a specific service
  const testConnection = async (service: string) => {
    setTesting(prev => ({ ...prev, [service]: true }))
    
    try {
      // TODO: Implement actual API testing logic
      // This would make real API calls to test the connection
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For now, just set to connected if basic config is present
      const isConfigured = service === 'supabase' 
        ? config.supabase.url && config.supabase.anonKey
        : service === 'email'
        ? config.email.smtpHost && config.email.smtpUser
        : false

      setConfig(prev => ({
        ...prev,
        [service]: {
          ...prev[service as keyof IntegrationConfig],
          status: isConfigured ? 'connected' : 'error'
        }
      }))
    } catch (error) {
      console.error(`Failed to test ${service} connection:`, error)
      setConfig(prev => ({
        ...prev,
        [service]: {
          ...prev[service as keyof IntegrationConfig],
          status: 'error'
        }
      }))
    } finally {
      setTesting(prev => ({ ...prev, [service]: false }))
      saveConfig()
    }
  }

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'error':
        return <XCircle className="h-4 w-4 text-danger" />
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-warning animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'error':
        return 'Error'
      case 'testing':
        return 'Testing...'
      default:
        return 'Not Connected'
    }
  }

  return (
    <div className="integration-settings">
      <div className="row">
        <div className="col-lg-8">
          {/* Supabase Integration */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Database className="h-5 w-5 me-2 text-primary" />
                <h5 className="mb-0">Supabase Integration</h5>
              </div>
              <div className="d-flex align-items-center">
                {getStatusIcon(config.supabase.status)}
                <span className="ms-2 small text-muted">{getStatusText(config.supabase.status)}</span>
                <button 
                  className="btn btn-sm btn-outline-primary ms-3"
                  onClick={() => testConnection('supabase')}
                  disabled={testing.supabase}
                >
                  <TestTube className="h-4 w-4 me-1" />
                  Test Connection
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="supabase-url" className="form-label">
                    <Server className="h-4 w-4 me-1" />
                    Supabase URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    id="supabase-url"
                    value={config.supabase.url}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      supabase: { ...prev.supabase, url: e.target.value }
                    }))}
                    placeholder="https://your-project-id.supabase.co"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="supabase-anon-key" className="form-label">
                    <Key className="h-4 w-4 me-1" />
                    Anon Key
                  </label>
                  <div className="input-group">
                    <input
                      type={showKeys.supabaseAnon ? 'text' : 'password'}
                      className="form-control"
                      id="supabase-anon-key"
                      value={config.supabase.anonKey}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        supabase: { ...prev.supabase, anonKey: e.target.value }
                      }))}
                      placeholder="Your Supabase anon key"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleKeyVisibility('supabaseAnon')}
                    >
                      {showKeys.supabaseAnon ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="supabase-service-key" className="form-label">
                    <Shield className="h-4 w-4 me-1" />
                    Service Role Key
                  </label>
                  <div className="input-group">
                    <input
                      type={showKeys.supabaseService ? 'text' : 'password'}
                      className="form-control"
                      id="supabase-service-key"
                      value={config.supabase.serviceRoleKey}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        supabase: { ...prev.supabase, serviceRoleKey: e.target.value }
                      }))}
                      placeholder="Your Supabase service role key"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleKeyVisibility('supabaseService')}
                    >
                      {showKeys.supabaseService ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="supabase-enabled"
                      checked={config.supabase.enabled}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        supabase: { ...prev.supabase, enabled: e.target.checked }
                      }))}
                    />
                    <label className="form-check-label" htmlFor="supabase-enabled">
                      Enable Supabase Integration
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Integration */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Mail className="h-5 w-5 me-2 text-primary" />
                <h5 className="mb-0">Email Integration</h5>
              </div>
              <div className="d-flex align-items-center">
                {getStatusIcon(config.email.status)}
                <span className="ms-2 small text-muted">{getStatusText(config.email.status)}</span>
                <button 
                  className="btn btn-sm btn-outline-primary ms-3"
                  onClick={() => testConnection('email')}
                  disabled={testing.email}
                >
                  <TestTube className="h-4 w-4 me-1" />
                  Test Connection
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="email-provider" className="form-label">
                    <SettingsIcon className="h-4 w-4 me-1" />
                    Email Provider
                  </label>
                  <select
                    className="form-select"
                    id="email-provider"
                    value={config.email.provider}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      email: { ...prev.email, provider: e.target.value as any }
                    }))}
                  >
                    <option value="smtp">SMTP</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="ses">Amazon SES</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="smtp-host" className="form-label">
                    <Server className="h-4 w-4 me-1" />
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="smtp-host"
                    value={config.email.smtpHost}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpHost: e.target.value }
                    }))}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="smtp-port" className="form-label">
                    <Globe className="h-4 w-4 me-1" />
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="smtp-port"
                    value={config.email.smtpPort}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpPort: e.target.value }
                    }))}
                    placeholder="587"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="smtp-user" className="form-label">
                    <Mail className="h-4 w-4 me-1" />
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="smtp-user"
                    value={config.email.smtpUser}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      email: { ...prev.email, smtpUser: e.target.value }
                    }))}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="smtp-password" className="form-label">
                    <Key className="h-4 w-4 me-1" />
                    SMTP Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showKeys.smtpPassword ? 'text' : 'password'}
                      className="form-control"
                      id="smtp-password"
                      value={config.email.smtpPassword}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        email: { ...prev.email, smtpPassword: e.target.value }
                      }))}
                      placeholder="Your SMTP password"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleKeyVisibility('smtpPassword')}
                    >
                      {showKeys.smtpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="email-enabled"
                      checked={config.email.enabled}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        email: { ...prev.email, enabled: e.target.checked }
                      }))}
                    />
                    <label className="form-check-label" htmlFor="email-enabled">
                      Enable Email Integration
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <Key className="h-5 w-5 me-2 text-primary" />
                <h5 className="mb-0">API Keys</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="stripe-key" className="form-label">
                    <Shield className="h-4 w-4 me-1" />
                    Stripe API Key
                  </label>
                  <div className="input-group">
                    <input
                      type={showKeys.stripe ? 'text' : 'password'}
                      className="form-control"
                      id="stripe-key"
                      value={config.apiKeys.stripe}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, stripe: e.target.value }
                      }))}
                      placeholder="sk_test_..."
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleKeyVisibility('stripe')}
                    >
                      {showKeys.stripe ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="paypal-key" className="form-label">
                    <Shield className="h-4 w-4 me-1" />
                    PayPal API Key
                  </label>
                  <div className="input-group">
                    <input
                      type={showKeys.paypal ? 'text' : 'password'}
                      className="form-control"
                      id="paypal-key"
                      value={config.apiKeys.paypal}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, paypal: e.target.value }
                      }))}
                      placeholder="Your PayPal API key"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleKeyVisibility('paypal')}
                    >
                      {showKeys.paypal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="twilio-key" className="form-label">
                    <Phone className="h-4 w-4 me-1" />
                    Twilio API Key
                  </label>
                  <div className="input-group">
                    <input
                      type={showKeys.twilio ? 'text' : 'password'}
                      className="form-control"
                      id="twilio-key"
                      value={config.apiKeys.twilio}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, twilio: e.target.value }
                      }))}
                      placeholder="Your Twilio API key"
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleKeyVisibility('twilio')}
                    >
                      {showKeys.twilio ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="google-maps-key" className="form-label">
                    <Globe className="h-4 w-4 me-1" />
                    Google Maps API Key
                  </label>
                  <div className="input-group">
                    <input
                      type={showKeys.googleMaps ? 'text' : 'password'}
                      className="form-control"
                      id="google-maps-key"
                      value={config.apiKeys.googleMaps}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, googleMaps: e.target.value }
                      }))}
                      placeholder="AIza..."
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleKeyVisibility('googleMaps')}
                    >
                      {showKeys.googleMaps ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="openai-key" className="form-label">
                    <SettingsIcon className="h-4 w-4 me-1" />
                    OpenAI API Key
                  </label>
                  <div className="input-group">
                    <input
                      type={showKeys.openai ? 'text' : 'password'}
                      className="form-control"
                      id="openai-key"
                      value={config.apiKeys.openai}
                      onChange={(e) => setConfig(prev => ({
                        ...prev,
                        apiKeys: { ...prev.apiKeys, openai: e.target.value }
                      }))}
                      placeholder="sk-..."
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => toggleKeyVisibility('openai')}
                    >
                      {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={saveConfig}>
              <Save className="h-4 w-4 me-2" />
              Save Integration Settings
            </button>
          </div>
        </div>

        {/* Integration Status Sidebar */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <div className="d-flex align-items-center">
                <Plug className="h-5 w-5 me-2 text-primary" />
                <h5 className="mb-0">Integration Status</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-medium">Supabase</span>
                  {getStatusIcon(config.supabase.status)}
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div 
                    className={`progress-bar ${config.supabase.status === 'connected' ? 'bg-success' : config.supabase.status === 'error' ? 'bg-danger' : 'bg-secondary'}`}
                    style={{ width: config.supabase.status === 'connected' ? '100%' : config.supabase.status === 'error' ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-medium">Email</span>
                  {getStatusIcon(config.email.status)}
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div 
                    className={`progress-bar ${config.email.status === 'connected' ? 'bg-success' : config.email.status === 'error' ? 'bg-danger' : 'bg-secondary'}`}
                    style={{ width: config.email.status === 'connected' ? '100%' : config.email.status === 'error' ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small fw-medium">API Keys</span>
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="mt-4">
                <h6 className="small fw-medium mb-2">Quick Actions</h6>
                <div className="d-grid gap-2">
                  <button className="btn btn-sm btn-outline-primary">
                    <RefreshCw className="h-4 w-4 me-1" />
                    Test All Connections
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    <SettingsIcon className="h-4 w-4 me-1" />
                    Export Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
