import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter'

/**
 * Storage context for providing the current storage adapter
 */
export const StorageContext = createContext<StorageAdapter | null>(null)

/**
 * Storage provider component
 */
export interface StorageProviderProps {
  children: ReactNode
  adapter: StorageAdapter
}

export function StorageProvider({ children, adapter }: StorageProviderProps) {
  return (
    <StorageContext.Provider value={adapter}>
      {children}
    </StorageContext.Provider>
  )
}

/**
 * Hook to access the current storage adapter
 */
export function useStorage(): StorageAdapter {
  const adapter = useContext(StorageContext)
  
  if (!adapter) {
    throw new Error('useStorage must be used within a StorageProvider')
  }
  
  return adapter
}