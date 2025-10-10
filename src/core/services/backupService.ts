import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter';

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    clients: any[];
    suppliers: any[];
    products: any[];
    transactions: any[];
    invoices: any[];
    bills: any[];
    userGroups: any[];
    productSubscriptions: any[];
    contractTemplates: any[];
    settings: any;
  };
  metadata: {
    totalRecords: number;
    exportedBy: string;
    exportedAt: string;
    applicationVersion: string;
  };
}

export class BackupService {
  private readonly storage: StorageAdapter;

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Export all data as JSON backup
   */
  async exportBackup(): Promise<BackupData> {
    try {
      // Get all data from storage
      const clients = await this.getAllDataByPrefix('clients');
      const suppliers = await this.getAllDataByPrefix('suppliers');
      const products = await this.getAllDataByPrefix('products');
      const transactions = await this.getAllDataByPrefix('transactions');
      const invoices = await this.getAllDataByPrefix('invoices');
      const bills = await this.getAllDataByPrefix('bills');
      const userGroups = await this.getAllDataByPrefix('user_groups');
      const productSubscriptions = await this.getAllDataByPrefix('product_subscriptions');
      const contractTemplates = await this.getAllDataByPrefix('contract_templates');
      const settings = await this.getAllDataByPrefix('settings');

      const totalRecords = 
        clients.length + 
        suppliers.length + 
        products.length + 
        transactions.length + 
        invoices.length + 
        bills.length + 
        userGroups.length + 
        productSubscriptions.length + 
        contractTemplates.length + 
        settings.length;

      const backup: BackupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          clients,
          suppliers,
          products,
          transactions,
          invoices,
          bills,
          userGroups,
          productSubscriptions,
          contractTemplates,
          settings
        },
        metadata: {
          totalRecords,
          exportedBy: 'Flow Management Console',
          exportedAt: new Date().toISOString(),
          applicationVersion: '1.0.0'
        }
      };

      return backup;
    } catch (error) {
      console.error('Failed to export backup:', error);
      throw new Error('Failed to export backup data');
    }
  }

  /**
   * Import data from JSON backup
   */
  async importBackup(backupData: BackupData, options: {
    overwriteExisting?: boolean;
    skipInvalidRecords?: boolean;
  } = {}): Promise<{
    success: boolean;
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    const result = {
      success: true,
      imported: 0,
      skipped: 0,
      errors: [] as string[]
    };

    try {
      // Validate backup format
      if (!this.validateBackupFormat(backupData)) {
        throw new Error('Invalid backup format');
      }

      // Import each data type
      const dataTypes = [
        { key: 'clients', prefix: 'clients' },
        { key: 'suppliers', prefix: 'suppliers' },
        { key: 'products', prefix: 'products' },
        { key: 'transactions', prefix: 'transactions' },
        { key: 'invoices', prefix: 'invoices' },
        { key: 'bills', prefix: 'bills' },
        { key: 'userGroups', prefix: 'user_groups' },
        { key: 'productSubscriptions', prefix: 'product_subscriptions' },
        { key: 'contractTemplates', prefix: 'contract_templates' },
        { key: 'settings', prefix: 'settings' }
      ];

      for (const dataType of dataTypes) {
        const records = backupData.data[dataType.key as keyof typeof backupData.data] as any[];
        
        for (const record of records) {
          try {
            const key = `${dataType.prefix}:${record.id}`;
            
            // Check if record already exists
            const existing = await this.storage.get(key);
            if (existing && !options.overwriteExisting) {
              result.skipped++;
              continue;
            }

            // Import the record
            await this.storage.set(key, record);
            result.imported++;
          } catch (error) {
            if (options.skipInvalidRecords) {
              result.errors.push(`Failed to import ${dataType.key} record ${record.id}: ${error}`);
              result.skipped++;
            } else {
              throw error;
            }
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Failed to import backup:', error);
      result.success = false;
      result.errors.push(`Import failed: ${error}`);
      return result;
    }
  }

  /**
   * Download backup as JSON file
   */
  async downloadBackup(): Promise<void> {
    try {
      const backup = await this.exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `flow-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download backup:', error);
      throw new Error('Failed to download backup file');
    }
  }

  /**
   * Get backup statistics
   */
  async getBackupStats(): Promise<{
    totalRecords: number;
    dataTypes: Record<string, number>;
    lastBackup?: string;
  }> {
    try {
      const clients = await this.getAllDataByPrefix('clients');
      const suppliers = await this.getAllDataByPrefix('suppliers');
      const products = await this.getAllDataByPrefix('products');
      const transactions = await this.getAllDataByPrefix('transactions');
      const invoices = await this.getAllDataByPrefix('invoices');
      const bills = await this.getAllDataByPrefix('bills');
      const userGroups = await this.getAllDataByPrefix('user_groups');
      const productSubscriptions = await this.getAllDataByPrefix('product_subscriptions');
      const contractTemplates = await this.getAllDataByPrefix('contract_templates');
      const settings = await this.getAllDataByPrefix('settings');

      const dataTypes = {
        clients: clients.length,
        suppliers: suppliers.length,
        products: products.length,
        transactions: transactions.length,
        invoices: invoices.length,
        bills: bills.length,
        userGroups: userGroups.length,
        productSubscriptions: productSubscriptions.length,
        contractTemplates: contractTemplates.length,
        settings: settings.length
      };

      const totalRecords = Object.values(dataTypes).reduce((sum, count) => sum + count, 0);

      return {
        totalRecords,
        dataTypes,
        lastBackup: undefined // Could be stored in settings
      };
    } catch (error) {
      console.error('Failed to get backup stats:', error);
      throw new Error('Failed to get backup statistics');
    }
  }

  /**
   * Helper method to get all data by prefix
   */
  private async getAllDataByPrefix(prefix: string): Promise<any[]> {
    try {
      const allKeys = await this.storage.getAllKeys();
      const filteredKeys = allKeys.filter(key => key.startsWith(`${prefix}:`));
      
      const data = [];
      for (const key of filteredKeys) {
        const value = await this.storage.get(key);
        if (value) {
          data.push(value);
        }
      }
      
      return data;
    } catch (error) {
      console.error(`Failed to get data for prefix ${prefix}:`, error);
      return [];
    }
  }

  /**
   * Validate backup format
   */
  private validateBackupFormat(backup: any): backup is BackupData {
    return (
      backup &&
      typeof backup === 'object' &&
      typeof backup.version === 'string' &&
      typeof backup.timestamp === 'string' &&
      typeof backup.data === 'object' &&
      typeof backup.metadata === 'object' &&
      typeof backup.metadata.totalRecords === 'number'
    );
  }
}

