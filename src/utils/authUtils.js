/**
 * Authentication Utilities
 * Helper functions for Auth0 and authentication operations
 */

import { Auth0Client } from '@auth0/auth0-spa-js'

// Auth0 Configuration
export const auth0Config = {
  domain: import.meta.env.VITE_DOMAIN_AUTH0 || '',
  clientId: import.meta.env.VITE_CLIENT_ID_AUTH0 || '',
  redirectUri:
    import.meta.env.VITE_REDIRECT_URI_AUTH0 || window.location.origin,
}

/**
 * Auth0 Client Instance
 */
export const auth0Handler = new Auth0Client({
  domain: auth0Config.domain,
  clientId: auth0Config.clientId,
  authorizationParams: {
    redirect_uri: auth0Config.redirectUri,
  },
})

/**
 * Initialize Auth0 login redirect
 */
export const loginWithAuth0 = async () => {
  try {
    await auth0Handler.loginWithRedirect()
  } catch (error) {
    console.error('Auth0 login error:', error)
    throw error
  }
}

/**
 * Handle Auth0 callback
 * @returns {Promise<{user: object, token: string}>}
 */
export const handleAuth0Callback = async () => {
  try {
    await auth0Handler.handleRedirectCallback()
    const user = await auth0Handler.getUser()
    const token = await auth0Handler.getTokenSilently()

    return {
      user,
      token,
      isAuth0: true,
    }
  } catch (error) {
    console.error('Auth0 callback error:', error)
    throw error
  }
}

/**
 * Logout from Auth0
 */
export const logoutFromAuth0 = async () => {
  try {
    await auth0Handler.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  } catch (error) {
    console.error('Auth0 logout error:', error)
    throw error
  }
}

/**
 * Check if user is authenticated with Auth0
 * @returns {Promise<boolean>}
 */
export const isAuth0Authenticated = async () => {
  try {
    return await auth0Handler.isAuthenticated()
  } catch (error) {
    console.error('Auth0 check authentication error:', error)
    return false
  }
}

/**
 * Get special date background configuration
 * @returns {string} Background CSS
 */
export const getSpecialDateBackground = () => {
  const specialDate = import.meta.env.VITE_SPECIAL_DATE || ''

  // Get current date
  const date = new Date().getDate()
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  const today = `${month + 1}-${date < 9 ? '0' + date : date}-${year}`

  // Default background count (you can configure this)
  const countLoginBackgroundDefault = 5
  const countLoginBackgroundSpecial = 3

  if (specialDate === '') {
    // Random default background
    const number = Math.floor(Math.random() * countLoginBackgroundDefault)
    return {
      background: `url(/assets/login/background/default/BG-Default-${number + 1}.png)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom',
    }
  }

  // Check if special date range or single date
  const find = specialDate.indexOf('/')

  if (find > -1) {
    // Date range
    const special = specialDate.split('/')
    if (today >= special[0] && today <= special[1]) {
      // Special background
      const number = Math.floor(Math.random() * countLoginBackgroundSpecial)
      return {
        background: `url(/assets/login/background/special/BG-Special-${number + 1}.png)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
      }
    }
  } else {
    // Single date
    if (today === specialDate) {
      const number = Math.floor(Math.random() * countLoginBackgroundSpecial)
      return {
        background: `url(/assets/login/background/special/BG-Special-${number + 1}.png)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
      }
    }
  }

  // Default background
  const number = Math.floor(Math.random() * countLoginBackgroundDefault)
  return {
    background: `url(/assets/login/background/default/BG-Default-${number + 1}.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom',
  }
}

/**
 * Generate random color for profile
 * @returns {string} Hex color
 */
export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
export const validatePassword = (password) => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const isValid =
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar

  return {
    isValid,
    requirements: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    },
  }
}

/**
 * Format auth error message
 * @param {object} error - Error object
 * @returns {string} Formatted error message
 */
export const formatAuthError = (error) => {
  if (error?.data?.message) {
    return error.data.message
  }

  if (error?.message) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}
