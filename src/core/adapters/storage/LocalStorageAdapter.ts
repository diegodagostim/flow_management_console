import type { StorageAdapter } from './StorageAdapter'
import { StorageError } from './StorageAdapter'

/**
 * LocalStorage implementation of StorageAdapter
 * Provides local browser storage capabilities
 */
export class LocalStorageAdapter implements StorageAdapter {
  private readonly prefix: string;

  constructor(prefix: string = 'flow_management_') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      throw new StorageError(
        `Failed to get item from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'LOCAL_STORAGE_GET_ERROR'
      );
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      throw new StorageError(
        `Failed to set item in localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'LOCAL_STORAGE_SET_ERROR'
      );
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      throw new StorageError(
        `Failed to delete item from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'LOCAL_STORAGE_DELETE_ERROR'
      );
    }
  }

  async list<T>(prefix?: string): Promise<T[]> {
    try {
      const items: T[] = [];
      const searchPrefix = prefix ? this.getKey(prefix) : this.prefix;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(searchPrefix)) {
          const item = localStorage.getItem(key);
          if (item) {
            try {
              items.push(JSON.parse(item) as T);
            } catch (parseError) {
              console.warn(`Failed to parse localStorage item ${key}:`, parseError);
            }
          }
        }
      }
      
      return items;
    } catch (error) {
      throw new StorageError(
        `Failed to list items from localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'LOCAL_STORAGE_LIST_ERROR'
      );
    }
  }

  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      throw new StorageError(
        `Failed to clear localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'LOCAL_STORAGE_CLEAR_ERROR'
      );
    }
  }
}
