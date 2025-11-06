import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getAccessToken } from '@/utils'
import TabToTap from '@/components/TabToTap'

/**
 * RequireAuth Component
 * Protected route wrapper that requires authentication
 * Redirects to login if no access token found
 *
 * @component
 * @example
 * <Route element={<RequireAuth />}>
 *   <Route path="/home" element={<Home />} />
 * </Route>
 */
const RequireAuth = () => {
  const location = useLocation()

  // Apply app body classes
  useEffect(() => {
    const body = document.querySelector('body')

    body.classList.remove('page-style1', 'bg-style', 'error-page')
    body.classList.add('main-body', 'app', 'sidebar-mini', 'light-mode', 'ltr')

    return () => {
      body.classList.remove(
        'main-body',
        'app',
        'sidebar-mini',
        'light-mode',
        'ltr'
      )
    }
  }, [])

  // Check authentication
  if (!getAccessToken()) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <div>
        <Outlet />
      </div>
      {/* Show scroll to top button on profile detail page */}
      {location.pathname === '/profile/detail' && <TabToTap />}
    </div>
  )
}

RequireAuth.propTypes = {}

export default RequireAuth
