/**
 * Copy text to clipboard with fallback for older browsers
 * @param {string} text - Text to copy
 * @param {boolean} isMobile - Is mobile device
 * @returns {Promise<boolean>} - Success status
 *
 * Features:
 * - Uses modern Clipboard API if available
 * - Falls back to document.execCommand for older browsers
 * - Mobile-friendly implementation
 */
export const copyToClipboard = async (text, isMobile = false) => {
  try {
    if (isMobile) {
      // Mobile: Try modern API first, fallback to execCommand
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        return fallbackCopy(text)
      }
    } else {
      // Desktop: Use modern API
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (error) {
    console.error('Clipboard error:', error)
    return fallbackCopy(text)
  }
}

/**
 * Fallback copy method using textarea + execCommand
 * @param {string} text - Text to copy
 * @returns {boolean} - Success status
 */
const fallbackCopy = (text) => {
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)

    const selected =
      document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false

    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)

    if (selected) {
      document.getSelection().removeAllRanges()
      document.getSelection().addRange(selected)
    }

    console.log('Copied using fallback method')
    return true
  } catch (error) {
    console.error('Fallback copy error:', error)
    return false
  }
}

/**
 * Get copy button element for hidden input
 * @param {string} elementId - ID of the input element
 * @returns {HTMLElement|null} - Input element
 */
export const getCopyInput = (elementId) => {
  return document.getElementById(elementId)
}
