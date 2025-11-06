import { Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@store/slices/authSlice'

export const AuthLayout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return (
    <div className="min-h-screen bg-background-main flex items-center justify-center">
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  )
}
