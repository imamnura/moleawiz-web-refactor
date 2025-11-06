import PropTypes from 'prop-types'
import { CertificateList } from './CertificateList'

/**
 * Additional Certificate List Component
 * Uses the same component as CertificateList but for additional certificates
 */
export function AdditionalCertificateList({ certificates, isLoading }) {
  return <CertificateList certificates={certificates} isLoading={isLoading} />
}

AdditionalCertificateList.propTypes = {
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

AdditionalCertificateList.defaultProps = {
  certificates: [],
  isLoading: false,
}
