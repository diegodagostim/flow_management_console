import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  Database, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Info,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useBackup } from '@/hooks/useBackup';
import { useTimeRegion } from '@/hooks/useTimeRegion';

interface BackupStats {
  totalRecords: number;
  dataTypes: Record<string, number>;
  lastBackup?: string;
}

export function BackupRestore() {
  const { 
    isExporting, 
    isImporting, 
    error, 
    downloadBackup, 
    importBackup, 
    getBackupStats, 
    clearError 
  } = useBackup();
  
  const { formatCurrency } = useTimeRegion();
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [importOptions, setImportOptions] = useState({
    overwriteExisting: false,
    skipInvalidRecords: true
  });
  const [importResult, setImportResult] = useState<{
    success: boolean;
    imported: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  // Load backup statistics on component mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const backupStats = await getBackupStats();
      setStats(backupStats);
    } catch (error) {
      console.error('Failed to load backup stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleDownloadBackup = async () => {
    const success = await downloadBackup();
    if (success) {
      // Refresh stats after successful export
      await loadStats();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.json')) {
      alert('Please select a JSON file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const result = await importBackup(file, importOptions);
    setImportResult(result);
    
    if (result.success) {
      // Refresh stats after successful import
      await loadStats();
    }

    // Clear the file input
    event.target.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="backup-restore">
      <div className="row">
        {/* Backup Statistics */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 d-flex align-items-center">
                <Database className="h-4 w-4 me-2 text-primary" />
                Data Overview
              </h6>
            </div>
            <div className="card-body">
              {loadingStats ? (
                <div className="text-center py-3">
                  <RefreshCw className="h-6 w-6 text-muted animate-spin" />
                  <p className="text-muted mt-2">Loading statistics...</p>
                </div>
              ) : stats ? (
                <div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-muted">Total Records</span>
                      <span className="fw-semibold">{stats.totalRecords}</span>
                    </div>
                    <div className="progress" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar bg-primary" 
                        style={{ width: `${Math.min((stats.totalRecords / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="small mb-2">Data Types</h6>
                    <div className="row">
                      {Object.entries(stats.dataTypes).map(([type, count]) => (
                        <div key={type} className="col-6 mb-1">
                          <div className="d-flex justify-content-between">
                            <small className="text-muted text-capitalize">{type}</small>
                            <small className="fw-semibold">{count}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {stats.lastBackup && (
                    <div className="mt-3 pt-3 border-top">
                      <small className="text-muted">Last Backup</small>
                      <div className="small">{new Date(stats.lastBackup).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-3">
                  <AlertTriangle className="h-6 w-6 text-muted mb-2" />
                  <p className="text-muted">Unable to load statistics</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Export Backup */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 d-flex align-items-center">
                <Download className="h-4 w-4 me-2 text-success" />
                Export Backup
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <p className="text-muted small mb-3">
                  Create a complete backup of all your data as a JSON file. This includes clients, suppliers, products, transactions, and all other data.
                </p>
                
                <div className="alert alert-info">
                  <Info className="h-4 w-4 me-2" />
                  <small>
                    The backup file will be downloaded automatically and can be used to restore your data later.
                  </small>
                </div>
              </div>

              <button 
                className="btn btn-success w-100"
                onClick={handleDownloadBackup}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 me-2 animate-spin" />
                    Creating Backup...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 me-2" />
                    Download Backup
                  </>
                )}
              </button>

              {stats && (
                <div className="mt-3 pt-3 border-top">
                  <small className="text-muted">Estimated file size</small>
                  <div className="small fw-semibold">
                    ~{formatFileSize(stats.totalRecords * 500)} {/* Rough estimate */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Import Backup */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 d-flex align-items-center">
                <Upload className="h-4 w-4 me-2 text-warning" />
                Restore Backup
              </h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <p className="text-muted small mb-3">
                  Restore your data from a previously exported backup file. This will import all data from the backup.
                </p>

                <div className="alert alert-warning">
                  <AlertTriangle className="h-4 w-4 me-2" />
                  <small>
                    <strong>Warning:</strong> This will overwrite existing data if the option is enabled.
                  </small>
                </div>
              </div>

              {/* Import Options */}
              <div className="mb-3">
                <h6 className="small mb-2">Import Options</h6>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="overwriteExisting"
                    checked={importOptions.overwriteExisting}
                    onChange={(e) => setImportOptions(prev => ({ 
                      ...prev, 
                      overwriteExisting: e.target.checked 
                    }))}
                  />
                  <label className="form-check-label small" htmlFor="overwriteExisting">
                    Overwrite existing records
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="skipInvalidRecords"
                    checked={importOptions.skipInvalidRecords}
                    onChange={(e) => setImportOptions(prev => ({ 
                      ...prev, 
                      skipInvalidRecords: e.target.checked 
                    }))}
                  />
                  <label className="form-check-label small" htmlFor="skipInvalidRecords">
                    Skip invalid records
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={isImporting}
                />
              </div>

              {isImporting && (
                <div className="text-center py-2">
                  <RefreshCw className="h-4 w-4 text-warning animate-spin me-2" />
                  <small className="text-muted">Importing backup...</small>
                </div>
              )}

              {importResult && (
                <div className={`alert ${importResult.success ? 'alert-success' : 'alert-danger'} mt-3`}>
                  <div className="d-flex align-items-center mb-2">
                    {importResult.success ? (
                      <CheckCircle className="h-4 w-4 me-2" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 me-2" />
                    )}
                    <strong>
                      {importResult.success ? 'Import Successful' : 'Import Failed'}
                    </strong>
                  </div>
                  <div className="small">
                    <div>Imported: {importResult.imported} records</div>
                    <div>Skipped: {importResult.skipped} records</div>
                    {importResult.errors.length > 0 && (
                      <div className="mt-2">
                        <strong>Errors:</strong>
                        <ul className="mb-0 mt-1">
                          {importResult.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <AlertTriangle className="h-4 w-4 me-2" />
                <span>{error}</span>
              </div>
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={clearError}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h6 className="mb-0 d-flex align-items-center">
                <FileText className="h-4 w-4 me-2 text-info" />
                Backup Instructions
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="small mb-2">Creating Backups</h6>
                  <ul className="small text-muted mb-0">
                    <li>Click "Download Backup" to create a complete backup</li>
                    <li>Backup files are saved as JSON format</li>
                    <li>Include all your data: clients, suppliers, products, etc.</li>
                    <li>Store backup files in a safe location</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="small mb-2">Restoring Backups</h6>
                  <ul className="small text-muted mb-0">
                    <li>Select a previously exported JSON backup file</li>
                    <li>Choose import options before restoring</li>
                    <li>Review the import results carefully</li>
                    <li>Refresh the page after successful import</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

