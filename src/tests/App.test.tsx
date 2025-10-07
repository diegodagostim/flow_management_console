import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { LocalStorageAdapter } from '../core/adapters/storage/LocalStorageAdapter'
import { StorageProvider } from '../hooks/useStorage'

// Mock components for testing
function TestComponent() {
  return <div>Test Component</div>
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StorageProvider adapter={new LocalStorageAdapter()}>
          {children}
        </StorageProvider>
      </QueryClientProvider>
    </Provider>
  )
}

describe('Flow Management Console', () => {
  it('renders test component', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )
    
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('has proper store configuration', () => {
    const state = store.getState()
    expect(state.storage).toBeDefined()
    expect(state.storage.adapter).toBe('local')
    expect(state.storage.isInitialized).toBe(false)
  })
})
