import { useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Image, Button, Modal } from 'antd'
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import FileSaver from 'file-saver'
import defaultImage from '@assets/images/png/general/img_thumb_default.png'

/**
 * Certificate List Component
 * Displays list of certificates in card grid
 */
export function CertificateList({ certificates, isLoading }) {
  const { t } = useTranslation()
  const [selectedCertif, setSelectedCertif] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleViewCertificate = (certif) => {
    setSelectedCertif(certif)
    setShowModal(true)
  }

  const handleDownload = () => {
    if (selectedCertif?.file_name) {
      FileSaver.saveAs(
        selectedCertif.file_name,
        `certificate-${selectedCertif.id_certif}.png`
      )
    }
  }

  if (isLoading) {
    return <div className="p-10 text-center text-gray-600">Loading...</div>
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600">
        {t('feature.feature_profile.sec_tab.no_certif_yet')}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 p-10 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certif, index) => (
          <Card
            key={index}
            className="cursor-pointer overflow-hidden rounded-lg border-none shadow-md transition-transform hover:scale-105"
            onClick={() => handleViewCertificate(certif)}
            id={`card-certificate-${index}`}
            bodyStyle={{ padding: 0 }}
          >
            <Image
              width="100%"
              height={200}
              className="object-cover"
              src={certif.file_name || certif.thumbnail}
              preview={false}
              fallback={defaultImage}
              alt={certif.name_certif}
            />

            <div className="p-4">
              <div className="mb-2 text-sm font-medium leading-tight text-gray-800 line-clamp-2">
                {certif.name_certif}
              </div>
              <div className="text-xs text-gray-600">{certif.journey_name}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Certificate Modal */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={800}
        centered
        className="certificate-modal"
        closeIcon={
          <div className="rounded-full bg-gray-100 p-2">
            <CloseOutlined className="text-sm text-gray-600" />
          </div>
        }
      >
        {selectedCertif && (
          <div className="p-8 text-center">
            <Image
              src={selectedCertif.file_name || selectedCertif.thumbnail}
              preview={false}
              fallback={defaultImage}
              alt={selectedCertif.name_certif}
              className="mb-5 w-full rounded-lg"
            />

            <Button
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
              className="w-full max-w-[330px]"
              id="btn-download-certificate"
            >
              {t('feature.feature_profile.pop_up.download')}
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}

CertificateList.propTypes = {
  certificates: PropTypes.arrayOf(
    PropTypes.shape({
      id_certif: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name_certif: PropTypes.string,
      file_name: PropTypes.string,
      thumbnail: PropTypes.string,
      journey_name: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
}

CertificateList.defaultProps = {
  certificates: [],
  isLoading: false,
}
