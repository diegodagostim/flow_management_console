import { useState, useEffect, useCallback } from 'react';
import type { TimeRegionSettings } from '@/lib/utils';
import { 
  loadTimeRegionSettings, 
  saveTimeRegionSettings,
  formatDate,
  formatTime,
  formatCurrency,
  getCurrentDateTime
} from '@/lib/utils';

export function useTimeRegion() {
  const [settings, setSettings] = useState<TimeRegionSettings>(() => loadTimeRegionSettings());
  const [currentDateTime, setCurrentDateTime] = useState(() => getCurrentDateTime(settings));

  // Update current date/time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime(settings));
    }, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<TimeRegionSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveTimeRegionSettings(updatedSettings);
  }, [settings]);

  const formatDateWithSettings = useCallback((date: Date) => {
    return formatDate(date, settings);
  }, [settings]);

  const formatTimeWithSettings = useCallback((date: Date) => {
    return formatTime(date, settings);
  }, [settings]);

  const formatCurrencyWithSettings = useCallback((amount: number) => {
    return formatCurrency(amount, settings);
  }, [settings]);

  return {
    settings,
    currentDateTime,
    updateSettings,
    formatDate: formatDateWithSettings,
    formatTime: formatTimeWithSettings,
    formatCurrency: formatCurrencyWithSettings,
  };
}
