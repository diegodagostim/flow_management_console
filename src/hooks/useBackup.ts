import { useState } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { BackupService } from '@/core/services/backupService';
import type { BackupData } from '@/core/services/backupService';

export function useBackup() {
  const storage = useStorage();
  const backupService = new BackupService(storage);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Export backup data
   */
  const exportBackup = async (): Promise<BackupData | null> => {
    setIsExporting(true);
    setError(null);
    
    try {
      const backup = await backupService.exportBackup();
      return backup;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export backup';
      setError(errorMessage);
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Download backup as JSON file
   */
  const downloadBackup = async (): Promise<boolean> => {
    setIsExporting(true);
    setError(null);
    
    try {
      await backupService.downloadBackup();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download backup';
      setError(errorMessage);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Import backup data from file
   */
  const importBackup = async (
    file: File,
    options: {
      overwriteExisting?: boolean;
      skipInvalidRecords?: boolean;
    } = {}
  ): Promise<{
    success: boolean;
    imported: number;
    skipped: number;
    errors: string[];
  }> => {
    setIsImporting(true);
    setError(null);
    
    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);
      
      const result = await backupService.importBackup(backupData, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import backup';
      setError(errorMessage);
      return {
        success: false,
        imported: 0,
        skipped: 0,
        errors: [errorMessage]
      };
    } finally {
      setIsImporting(false);
    }
  };

  /**
   * Get backup statistics
   */
  const getBackupStats = async () => {
    try {
      return await backupService.getBackupStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get backup stats';
      setError(errorMessage);
      return null;
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    isExporting,
    isImporting,
    error,
    
    // Actions
    exportBackup,
    downloadBackup,
    importBackup,
    getBackupStats,
    clearError
  };
}

