import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// Storage adapter slice
interface StorageState {
  adapter: 'local' | 'supabase'
  isInitialized: boolean
}

const initialState: StorageState = {
  adapter: 'local',
  isInitialized: false,
}

export const setAdapter = (adapter: 'local' | 'supabase') => ({
  type: 'storage/setAdapter' as const,
  payload: adapter,
})

export const setInitialized = (isInitialized: boolean) => ({
  type: 'storage/setInitialized' as const,
  payload: isInitialized,
})

export const store = configureStore({
  reducer: {
    storage: (state = initialState, action) => {
      switch (action.type) {
        case 'storage/setAdapter':
          return { ...state, adapter: action.payload }
        case 'storage/setInitialized':
          return { ...state, isInitialized: action.payload }
        default:
          return state
      }
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
