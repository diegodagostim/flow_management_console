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

export function formatDate(date: Date, settings: TimeRegionSettings): string {
  const { timezone, dateFormat } = settings;
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
  };

  switch (dateFormat) {
    case 'MM/DD/YYYY':
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
      break;
    case 'DD/MM/YYYY':
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
      break;
    case 'YYYY-MM-DD':
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
      break;
    case 'DD-MM-YYYY':
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
      break;
    case 'MM-DD-YYYY':
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
      break;
    default:
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
  }

  let formatted = new Intl.DateTimeFormat('en-US', options).format(date);
  
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
    const parts = formatted.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      formatted = `${year}-${month}-${day}`;
    }
  }

  return formatted;
}

export function formatTime(date: Date, settings: TimeRegionSettings): string {
  const { timezone, timeFormat } = settings;
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour12: timeFormat === '12h',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function formatCurrency(amount: number, settings: TimeRegionSettings): string {
  const { currency, language } = settings;
  
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: currency,
  }).format(amount);
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