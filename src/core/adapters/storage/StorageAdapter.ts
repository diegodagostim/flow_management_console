/**
 * StorageAdapter interface for flexible data sources
 * Implements the Adapter pattern to switch between LocalStorage and Supabase
 */
export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
  list<T>(prefix?: string): Promise<T[]>
  clear(): Promise<void>
}

/**
 * Error class for storage operations
 */
export class StorageError extends Error {
  public readonly code?: string
  
  constructor(message: string, code?: string) {
    super(message)
    this.name = 'StorageError'
    this.code = code
  }
}
