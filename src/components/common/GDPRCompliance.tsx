import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStorage } from '@/hooks/useStorage'
import { Download, Trash2, Shield, Cookie, FileText } from 'lucide-react'

interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export function GDPRCompliance() {
  const storage = useStorage()
  const [consentGiven, setConsentGiven] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    // Load consent preferences from storage
    storage.get<ConsentPreferences>('gdpr_consent').then((saved) => {
      if (saved) {
        setPreferences(saved)
        setConsentGiven(true)
      }
    })
  }, [storage])

  const handleConsentChange = (key: keyof ConsentPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    storage.set('gdpr_consent', newPreferences)
  }

  const handleGiveConsent = () => {
    storage.set('gdpr_consent', preferences)
    setConsentGiven(true)
  }

  const handleRevokeConsent = () => {
    storage.delete('gdpr_consent')
    setConsentGiven(false)
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    })
  }

  const exportData = async () => {
    try {
      const allData = await storage.list()
      const dataStr = JSON.stringify(allData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(dataBlob)
      link.download = `flow-management-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to export data:', error)
    }
  }

  const deleteAllData = async () => {
    if (window.confirm('Are you sure you want to delete ALL your data? This action cannot be undone.')) {
      try {
        await storage.clear()
        alert('All data has been deleted successfully.')
      } catch (error) {
        console.error('Failed to delete data:', error)
        alert('Failed to delete data. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cookie className="h-5 w-5 mr-2" />
            Cookie Consent Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!consentGiven ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                We use cookies to enhance your experience. Please choose your preferences:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Necessary Cookies</h4>
                    <p className="text-sm text-gray-500">Required for basic functionality</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analytics Cookies</h4>
                    <p className="text-sm text-gray-500">Help us understand how you use our app</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => handleConsentChange('analytics', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Cookies</h4>
                    <p className="text-sm text-gray-500">Used to deliver relevant advertisements</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => handleConsentChange('marketing', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Functional Cookies</h4>
                    <p className="text-sm text-gray-500">Enable enhanced features and personalization</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => handleConsentChange('functional', e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                </div>
              </div>

              <Button onClick={handleGiveConsent} className="w-full">
                Accept Preferences
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                <p className="text-sm">Consent preferences saved successfully!</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Current Preferences:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Necessary: {preferences.necessary ? 'Enabled' : 'Disabled'}</li>
                  <li>• Analytics: {preferences.analytics ? 'Enabled' : 'Disabled'}</li>
                  <li>• Marketing: {preferences.marketing ? 'Enabled' : 'Disabled'}</li>
                  <li>• Functional: {preferences.functional ? 'Enabled' : 'Disabled'}</li>
                </ul>
              </div>

              <Button variant="outline" onClick={handleRevokeConsent}>
                Revoke Consent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Data Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Download a copy of all your data stored in the application.
          </p>
          <Button onClick={exportData} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trash2 className="h-5 w-5 mr-2" />
            Data Deletion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete all your data from the application. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={deleteAllData} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Privacy Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Your Rights Under GDPR</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Right to access your personal data</li>
              <li>• Right to rectify inaccurate data</li>
              <li>• Right to erase your data</li>
              <li>• Right to restrict processing</li>
              <li>• Right to data portability</li>
              <li>• Right to object to processing</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Data Protection</h4>
            <p className="text-sm text-gray-600">
              We implement appropriate technical and organizational measures to protect your personal data 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
