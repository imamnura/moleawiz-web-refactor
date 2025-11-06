import { useState } from 'react'
import {
  contactEmail,
  subjectEmail,
  bodyEmail,
} from '@config/constant/customer_support'
import { getAppName } from '@/utils'

export function useEmailContact() {
  const [loading, setLoading] = useState(false)

  const handleEmailClick = async () => {
    try {
      setLoading(true)

      // Simple email link without user profile data for public help
      const replaceSubject = subjectEmail.replace('###', getAppName())
      const body = bodyEmail.replace('###', getAppName())

      window.open(
        `mailto:${contactEmail}?subject=${replaceSubject}&body=${body}`,
        '_self'
      )
    } catch (error) {
      console.error('Email error:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    contactEmail,
    handleEmailClick,
    loading,
  }
}
