import { useState, useEffect } from 'react';

interface UserLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  timezone: string;
  isp: string;
  loading: boolean;
  error: string | null;
}

// Helper function to fetch with timeout
const fetchWithTimeout = async (url: string, timeoutMs: number = 5000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors', // Explicitly set CORS mode
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation>({
    ip: '',
    city: '',
    region: '',
    country: '',
    countryCode: '',
    timezone: '',
    isp: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        setLocation(prev => ({ ...prev, loading: true, error: null }));
        
        // Try multiple IP geolocation services as fallbacks
        // Using services that are known to work well with CORS
        const services = [
          'https://ipapi.co/json/',
          'https://ipinfo.io/json',
          'https://api.db-ip.com/v2/free/self',
          'https://ipapi.co/json/'
        ];
        
        let data = null;
        let lastError = null;
        
        for (const service of services) {
          try {
            const response = await fetchWithTimeout(service, 8000); // Increased timeout
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            
            data = await response.json();
            console.log(`Successfully fetched from ${service}:`, data);
            break; // Success, exit the loop
          } catch (error) {
            lastError = error;
            console.warn(`Failed to fetch from ${service}:`, error);
            continue; // Try next service
          }
        }
        
        if (!data) {
          // If all external services fail, provide a basic fallback
          console.warn('All IP services failed, using fallback data');
          setLocation({
            ip: 'Local Network',
            city: 'Unknown',
            region: 'Unknown',
            country: 'Unknown',
            countryCode: 'Unknown',
            timezone: 'Unknown',
            isp: 'Local',
            loading: false,
            error: null,
          });
          return;
        }
        
        // Handle different response formats from different services
        let ip, city, region, country, countryCode, timezone, isp;
        
        // Check for ipapi.co format
        if (data.ip && data.city && data.country_name) {
          ip = data.ip;
          city = data.city;
          region = data.region;
          country = data.country_name;
          countryCode = data.country_code;
          timezone = data.timezone;
          isp = data.org;
        }
        // Check for ipinfo.io format
        else if (data.ip && data.city && data.country) {
          ip = data.ip;
          city = data.city;
          region = data.region;
          country = data.country;
          countryCode = data.country;
          timezone = data.timezone;
          isp = data.org;
        }
        // Check for db-ip.com format
        else if (data.ipAddress && data.city && data.countryName) {
          ip = data.ipAddress;
          city = data.city;
          region = data.stateProv;
          country = data.countryName;
          countryCode = data.countryCode;
          timezone = data.timeZone;
          isp = data.organization;
        }
        // Generic fallback
        else {
          ip = data.ip || data.ipAddress || 'Unknown';
          city = data.city || 'Unknown';
          region = data.region || data.stateProv || 'Unknown';
          country = data.country || data.country_name || data.countryName || 'Unknown';
          countryCode = data.country_code || data.countryCode || 'Unknown';
          timezone = data.timezone || data.timeZone || 'Unknown';
          isp = data.org || data.organization || 'Unknown';
        }
        
        setLocation({
          ip: ip || 'Unknown',
          city: city || 'Unknown',
          region: region || 'Unknown',
          country: country || 'Unknown',
          countryCode: countryCode || 'Unknown',
          timezone: timezone || 'Unknown',
          isp: isp || 'Unknown',
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching user location:', error);
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch location',
        }));
      }
    };

    fetchUserLocation();
  }, []);

  return location;
}
