import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Time & Region formatting utilities
export interface TimeRegionSettings {
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  language: string;
  country: string;
  weekStart: string;
}

export function formatDate(date: Date | string, settings: TimeRegionSettings): string {
  const { timezone, dateFormat, language } = settings;
  
  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  // Use the language setting for formatting
  const locale = language === 'en' ? 'en-US' : `${language}-${settings.country}`;
  let formatted = new Intl.DateTimeFormat(locale, options).format(dateObj);
  
  // Apply custom formatting based on dateFormat
  if (dateFormat === 'DD/MM/YYYY' || dateFormat === 'DD-MM-YYYY') {
    // Swap month and day for DD/MM/YYYY format
    const parts = formatted.split(/[\/\-]/);
    if (parts.length === 3) {
      const [month, day, year] = parts;
      formatted = dateFormat === 'DD/MM/YYYY' 
        ? `${day}/${month}/${year}`
        : `${day}-${month}-${year}`;
    }
  } else if (dateFormat === 'YYYY-MM-DD') {
    // Ensure YYYY-MM-DD format
    const parts = formatted.split(/[\/\-]/);
    if (parts.length === 3) {
      const [month, day, year] = parts;
      formatted = `${year}-${month}-${day}`;
    }
  } else if (dateFormat === 'MM-DD-YYYY') {
    // Ensure MM-DD-YYYY format
    const parts = formatted.split(/[\/\-]/);
    if (parts.length === 3) {
      const [month, day, year] = parts;
      formatted = `${month}-${day}-${year}`;
    }
  }

  return formatted;
}

export function formatTime(date: Date | string, settings: TimeRegionSettings): string {
  const { timezone, timeFormat, language } = settings;
  
  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour12: timeFormat === '12h',
    hour: '2-digit',
    minute: '2-digit',
  };

  // Use the language setting for formatting
  const locale = language === 'en' ? 'en-US' : `${language}-${settings.country}`;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

export function formatCurrency(amount: number, settings: TimeRegionSettings): string {
  const { currency, language, country } = settings;
  
  // Use the language and country for proper locale formatting
  const locale = language === 'en' ? 'en-US' : `${language}-${country}`;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatNumber(number: number, settings: TimeRegionSettings): string {
  const { language, country } = settings;
  
  // Use the language and country for proper locale formatting
  const locale = language === 'en' ? 'en-US' : `${language}-${country}`;
  
  return new Intl.NumberFormat(locale).format(number);
}

export function formatDateTime(date: Date | string, settings: TimeRegionSettings): string {
  const dateStr = formatDate(date, settings);
  const timeStr = formatTime(date, settings);
  return `${dateStr} ${timeStr}`;
}

export function getCurrentDateTime(settings: TimeRegionSettings): {
  date: string;
  time: string;
  fullDateTime: string;
} {
  const now = new Date();
  const date = formatDate(now, settings);
  const time = formatTime(now, settings);
  const fullDateTime = `${date} ${time}`;
  
  return { date, time, fullDateTime };
}

export function loadTimeRegionSettings(): TimeRegionSettings {
  const defaultSettings: TimeRegionSettings = {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    language: 'en',
    country: 'US',
    weekStart: 'monday'
  };

  try {
    const saved = localStorage.getItem('timeRegionSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load time region settings:', error);
  }

  return defaultSettings;
}

export function saveTimeRegionSettings(settings: TimeRegionSettings): void {
  try {
    localStorage.setItem('timeRegionSettings', JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save time region settings:', error);
  }
}