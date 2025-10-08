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
        const services = [
          'https://ipapi.co/json/',
          'https://ipinfo.io/json',
          'https://api.ipify.org?format=json'
        ];
        
        let data = null;
        let lastError = null;
        
        for (const service of services) {
          try {
            const response = await fetch(service, {
              timeout: 5000, // 5 second timeout
            });
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            
            data = await response.json();
            break; // Success, exit the loop
          } catch (error) {
            lastError = error;
            console.warn(`Failed to fetch from ${service}:`, error);
            continue; // Try next service
          }
        }
        
        if (!data) {
          throw lastError || new Error('All IP services failed');
        }
        
        // Handle different response formats from different services
        let ip, city, region, country, countryCode, timezone, isp;
        
        if (data.ipapi) {
          // ipapi.co format
          ip = data.ip;
          city = data.city;
          region = data.region;
          country = data.country_name;
          countryCode = data.country_code;
          timezone = data.timezone;
          isp = data.org;
        } else if (data.ipinfo) {
          // ipinfo.io format
          ip = data.ip;
          city = data.city;
          region = data.region;
          country = data.country;
          countryCode = data.country;
          timezone = data.timezone;
          isp = data.org;
        } else {
          // Generic format or ipify
          ip = data.ip || 'Unknown';
          city = data.city || 'Unknown';
          region = data.region || 'Unknown';
          country = data.country || 'Unknown';
          countryCode = data.country_code || 'Unknown';
          timezone = data.timezone || 'Unknown';
          isp = data.org || 'Unknown';
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
