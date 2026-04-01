import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

export const ProtectedRoute = () => {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
