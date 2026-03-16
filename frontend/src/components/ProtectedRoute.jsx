import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        Carregando…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
