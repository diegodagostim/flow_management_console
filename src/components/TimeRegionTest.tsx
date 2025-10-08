import React from 'react';
import { useTimeRegion } from '@/hooks/useTimeRegion';

export function TimeRegionTest() {
  const { settings, formatDate, formatTime, formatCurrency, formatNumber, formatDateTime } = useTimeRegion();
  
  const testDate = new Date('2024-01-15T14:30:00Z');
  const testAmount = 1234567.89;
  const testNumber = 1234567;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Time & Region Formatting Test</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Current Settings</h6>
                  <ul className="list-unstyled">
                    <li><strong>Timezone:</strong> {settings.timezone}</li>
                    <li><strong>Date Format:</strong> {settings.dateFormat}</li>
                    <li><strong>Time Format:</strong> {settings.timeFormat}</li>
                    <li><strong>Currency:</strong> {settings.currency}</li>
                    <li><strong>Language:</strong> {settings.language}</li>
                    <li><strong>Country:</strong> {settings.country}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Formatted Output</h6>
                  <ul className="list-unstyled">
                    <li><strong>Date:</strong> {formatDate(testDate)}</li>
                    <li><strong>Time:</strong> {formatTime(testDate)}</li>
                    <li><strong>Date & Time:</strong> {formatDateTime(testDate)}</li>
                    <li><strong>Currency:</strong> {formatCurrency(testAmount)}</li>
                    <li><strong>Number:</strong> {formatNumber(testNumber)}</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4">
                <h6>Test Instructions</h6>
                <ol>
                  <li>Go to Settings → Time & Region</li>
                  <li>Change the timezone, date format, time format, currency, language, or country</li>
                  <li>Save the settings</li>
                  <li>Return to this page to see the formatting changes</li>
                  <li>Check other pages (Clients, Suppliers) to see consistent formatting</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
