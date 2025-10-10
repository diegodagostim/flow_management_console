import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { createClient, type User, type Session } from '@supabase/supabase-js'

/**
 * Authentication context
 */
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Authentication provider component
 */
export interface AuthProviderProps {
  children: ReactNode
  supabaseUrl: string
  supabaseKey: string
}

export function AuthProvider({ children, supabaseUrl, supabaseKey }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Create Supabase client only if URL and key are provided
  const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

  useEffect(() => {
    if (!supabase) {
      setUser(null)
      setSession(null)
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please check your environment variables.')
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please check your environment variables.')
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (!supabase) {
      throw new Error('Supabase client not configured. Please check your environment variables.')
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please configure Supabase URL and key in Settings.')
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
