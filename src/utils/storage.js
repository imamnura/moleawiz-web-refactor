/**
 * Storage Utilities
 * Helper functions for localStorage operations with encryption/decryption
 */

import CryptoJS from 'crypto-js'

const KEY = import.meta.env.VITE_CRYPTO_KEY // 32 bytes
const IV = import.meta.env.VITE_CRYPTO_IV // 16 bytes

// Storage key names (encrypted for security)
const STORAGE_KEYS = {
  fullname: 'KL908fdkn',
  accessToken: 'JKLjfkj789',
  accessTokenAuth0: 'hjvGVhk',
  currentPage: 'pageTable',
  username: 'rememberme',
  userId: '3q0sw',
  language: '1OoFf',
  colorProfile: '#F16F24',
  isShowVirtualAssistant: 'isShowVirtualAssistant',
}

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @returns {string | null} Stored value or null
 */
export const getLocalStorage = (key) => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Error getting localStorage:', error)
    return null
  }
}

/**
 * Set item to localStorage
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 */
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error('Error setting localStorage:', error)
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing localStorage:', error)
  }
}

/**
 * Clear all localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Encrypt data using AES encryption (matching old version)
 * @param {any} data - Data to encrypt
 * @returns {string} Encrypted string
 */
export const encryptData = (data) => {
  try {
    if (!KEY || !IV) {
      console.warn('Crypto KEY or IV not found in environment, using fallback')
      // Fallback to Base64 if no keys
      return btoa(JSON.stringify(data))
    }

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      CryptoJS.enc.Utf8.parse(KEY),
      {
        iv: CryptoJS.enc.Utf8.parse(IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    )

    return encrypted.toString()
  } catch (error) {
    console.error('Error encrypting data:', error)
    return ''
  }
}

/**
 * Decrypt data using AES decryption (matching old version)
 * @param {string} encryptedData - Encrypted string
 * @returns {any} Decrypted data
 */
export const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return null

    if (!KEY || !IV) {
      console.warn('Crypto KEY or IV not found, using fallback')
      // Fallback to Base64
      return JSON.parse(atob(encryptedData))
    }

    const decryptedWA = CryptoJS.AES.decrypt(
      encryptedData,
      CryptoJS.enc.Utf8.parse(KEY),
      {
        iv: CryptoJS.enc.Utf8.parse(IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    )

    const decryptedB64 = decryptedWA.toString(CryptoJS.enc.Utf8)
    const decrypted = CryptoJS.enc.Utf8.parse(decryptedB64).toString(
      CryptoJS.enc.Utf8
    )

    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Error decrypting data:', error)
    return null
  }
}

/**
 * Store encrypted data in localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to encrypt and store
 */
export const setEncryptedStorage = (key, data) => {
  const encrypted = encryptData(data)
  setLocalStorage(key, encrypted)
}

/**
 * Get and decrypt data from localStorage
 * @param {string} key - Storage key
 * @returns {any} Decrypted data or null
 */
export const getEncryptedStorage = (key) => {
  const encrypted = getLocalStorage(key)
  return decryptData(encrypted)
}

/**
 * Get company name from environment or default
 * @returns {string} Company name
 */
export const getCompanyName = () => {
  return import.meta.env.VITE_COMPANY_NAME || 'digima Asia'
}

/**
 * Get app name from environment or default
 * @returns {string} App name
 */
export const getAppName = () => {
  return import.meta.env.VITE_PROJECT_TITLE || 'MoLeaWiz'
}

/**
 * Get access token from localStorage
 * @returns {string | null} Access token
 */
export const getAccessToken = () => {
  return (
    getLocalStorage(STORAGE_KEYS.accessToken) ||
    getLocalStorage(STORAGE_KEYS.accessTokenAuth0) ||
    getLocalStorage('token')
  )
}

/**
 * Set access token to localStorage
 * @param {string} token - Access token
 */
export const setAccessToken = (token) => {
  setLocalStorage(STORAGE_KEYS.accessToken, token)
}

/**
 * Set Auth0 access token to localStorage
 * @param {string} token - Auth0 access token
 */
export const setAccessTokenAuth0 = (token) => {
  setLocalStorage(STORAGE_KEYS.accessTokenAuth0, token)
}

/**
 * Get fullname from localStorage
 * @returns {string | null} Full name
 */
export const getFullname = () => {
  return getLocalStorage(STORAGE_KEYS.fullname)
}

/**
 * Set fullname to localStorage
 * @param {string} value - Full name
 */
export const setFullname = (value) => {
  setLocalStorage(STORAGE_KEYS.fullname, value)
}

/**
 * Get username from localStorage (for remember me)
 * @returns {string | null} Username
 */
export const getUsername = () => {
  return getLocalStorage(STORAGE_KEYS.username)
}

/**
 * Set username to localStorage (for remember me)
 * @param {string} value - Username
 */
export const setUsername = (value) => {
  setLocalStorage(STORAGE_KEYS.username, value)
}

/**
 * Clear auth-related storage
 */
export const clearAuthStorage = () => {
  removeLocalStorage(STORAGE_KEYS.fullname)
  removeLocalStorage(STORAGE_KEYS.accessToken)
  removeLocalStorage(STORAGE_KEYS.accessTokenAuth0)
  removeLocalStorage(STORAGE_KEYS.currentPage)
  removeLocalStorage(STORAGE_KEYS.isShowVirtualAssistant)
  removeLocalStorage('token')
  removeLocalStorage('user')
  removeLocalStorage('search_cl')
  removeLocalStorage('search_mylj')
}

/**
 * Extract initials from name
 * @param {string} name - Full name
 * @returns {string | null} Initials
 */
export const extractInitial = (name) => {
  if (!name) return null

  const words = name.split(' ')
  const firstName = words[0].charAt(0)
  let middleName = ''

  if (words[1]) {
    middleName = words[1].charAt(0)
  }

  const initial = `${firstName}${middleName}`
  return initial.toUpperCase()
}

/**
 * Clean object by removing null, undefined, and empty string properties
 * @param {object} obj - Object to clean
 * @returns {object} Cleaned object
 */
export function cleanObject(obj) {
  const normalize = { ...obj }
  const propNames = Object.getOwnPropertyNames(normalize)

  for (let i = 0; i < propNames.length; i++) {
    const propName = propNames[i]
    if (
      normalize[propName] === null ||
      normalize[propName] === undefined ||
      normalize[propName] === ''
    ) {
      delete normalize[propName]
    }
  }

  return normalize
}

/**
 * Replace special characters
 * @param {string} value - String value
 * @returns {string} Cleaned string
 */
export const replaceSpecialChart = (value) => {
  return value.replace(/[\^]/g, '')
}

/**
 * Set virtual assistant visibility
 * @param {boolean} value - Visibility state
 */
export const setVirtualAssistant = (value) => {
  setLocalStorage(STORAGE_KEYS.isShowVirtualAssistant, String(value))
}

/**
 * Get virtual assistant visibility
 * @returns {boolean} Visibility state
 */
export const getVirtualAssistant = () => {
  const value = getLocalStorage(STORAGE_KEYS.isShowVirtualAssistant)
  return value === 'true'
}

// Export storage keys for use in other modules
export { STORAGE_KEYS }
