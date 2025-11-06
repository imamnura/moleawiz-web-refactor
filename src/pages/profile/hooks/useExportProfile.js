import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FileSaver from 'file-saver'
import { getAccessToken } from '@/utils'
import baseUrl from '@config/config'

/**
 * Hook for exporting profile to PDF
 */
export function useExportProfile() {
  const { i18n } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)

  const locale = i18n.language === 'en' ? 'en' : 'id'

  const handleExport = async () => {
    setIsExporting(true)
    setExportError(null)

    try {
      const token = getAccessToken()
      const exportUrl = `${baseUrl}/profile/export?token=${token}&lang=${locale}`

      // Use FileSaver to trigger download
      FileSaver.saveAs(exportUrl, `profile-${Date.now()}.pdf`)

      setIsExporting(false)
      return { success: true }
    } catch (error) {
      console.error('Failed to export profile:', error)
      setExportError(error)
      setIsExporting(false)
      return { success: false, error }
    }
  }

  return {
    handleExport,
    isExporting,
    exportError,
  }
}
