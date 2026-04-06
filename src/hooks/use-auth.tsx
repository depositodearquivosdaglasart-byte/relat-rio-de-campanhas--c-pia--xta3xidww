import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: any | null
  session: any | null
  signUp: (email: string, password: string, options?: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>({
    id: '00000000-0000-0000-0000-000000000000',
    email: 'default@local',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Auto-login logic to bypass authentication while providing a valid user object
    // for components that depend on `user.id` to query data
    const fetchDefaultUser = async () => {
      try {
        const { data } = await supabase.from('usuarios').select('*').limit(1)
        if (data && data.length > 0) {
          setUser(data[0])
        }
      } catch (e) {
        console.error('Error fetching default user', e)
      }
    }

    fetchDefaultUser()
  }, [])

  // Dummy methods to satisfy the interface without throwing errors
  const signUp = async () => ({ error: null })
  const signIn = async () => ({ error: null })
  const signOut = async () => ({ error: null })

  return (
    <AuthContext.Provider
      value={{ user, session: user ? { user } : null, signUp, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
