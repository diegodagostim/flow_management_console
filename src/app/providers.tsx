import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from './store';
import { StorageProvider } from '@/hooks/useStorage'
import { AuthProvider } from '@/hooks/useAuth'
import { LocalStorageAdapter } from '@/core/adapters/storage/LocalStorageAdapter';
import { SupabaseAdapter } from '@/core/adapters/storage/SupabaseAdapter';
import { useSelector } from 'react-redux';
import type { RootState } from './store'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Storage adapter selector component
function StorageAdapterProvider({ children }: { children: React.ReactNode }) {
  const adapter = useSelector((state: RootState) => state.storage.adapter);
  
  const storageAdapter = adapter === 'supabase' 
    ? new SupabaseAdapter(
        import.meta.env.VITE_SUPABASE_URL || '',
        import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        'flow_management_data'
      )
    : new LocalStorageAdapter('flow_management_');

  return (
    <StorageProvider adapter={storageAdapter}>
      {children}
    </StorageProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider 
          supabaseUrl={import.meta.env.VITE_SUPABASE_URL || ''}
          supabaseKey={import.meta.env.VITE_SUPABASE_ANON_KEY || ''}
        >
          <StorageAdapterProvider>
            {children}
          </StorageAdapterProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  )
}
