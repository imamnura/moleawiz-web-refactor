import { useState, useCallback } from 'react'

/**
 * Custom hook untuk toggle boolean values
 * @param {boolean} initialValue - Initial value
 * @returns {array} [value, toggle, setValue]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])

  return [value, toggle, setValue]
}

export default useToggle
