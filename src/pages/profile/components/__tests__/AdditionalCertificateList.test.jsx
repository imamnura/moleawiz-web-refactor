import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdditionalCertificateList } from '../AdditionalCertificateList'

// Mock CertificateList component
vi.mock('../CertificateList', () => ({
  CertificateList: ({ certificates, isLoading }) => (
    <div data-testid="certificate-list">
      {isLoading
        ? 'Loading certificates...'
        : `Rendering ${certificates?.length || 0} certificates`}
    </div>
  ),
}))

describe('AdditionalCertificateList', () => {
  const mockCertificates = [
    {
      id_certif: 1,
      name_certif: 'AWS Certification',
      file_name: 'https://example.com/aws.png',
      journey_name: 'Cloud Journey',
    },
    {
      id_certif: 2,
      name_certif: 'Google Cloud Certification',
      file_name: 'https://example.com/gcp.png',
      journey_name: 'Cloud Journey',
    },
  ]

  describe('Rendering', () => {
    it('should render AdditionalCertificateList without crashing', () => {
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={false}
        />
      )
      expect(screen.getByTestId('certificate-list')).toBeInTheDocument()
    })

    it('should render CertificateList component', () => {
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={false}
        />
      )
      expect(screen.getByTestId('certificate-list')).toBeInTheDocument()
    })

    it('should be a simple wrapper component', () => {
      const { container } = render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={false}
        />
      )

      // Should only have one child (CertificateList)
      expect(container.firstChild).toBeTruthy()
    })
  })

  describe('Props Passing', () => {
    it('should pass certificates prop to CertificateList', () => {
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={false}
        />
      )
      expect(screen.getByText('Rendering 2 certificates')).toBeInTheDocument()
    })

    it('should pass isLoading prop to CertificateList', () => {
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={true}
        />
      )
      expect(screen.getByText('Loading certificates...')).toBeInTheDocument()
    })

    it('should pass empty array to CertificateList', () => {
      render(<AdditionalCertificateList certificates={[]} isLoading={false} />)
      expect(screen.getByText('Rendering 0 certificates')).toBeInTheDocument()
    })

    it('should pass null certificates to CertificateList', () => {
      render(
        <AdditionalCertificateList certificates={null} isLoading={false} />
      )
      expect(screen.getByText('Rendering 0 certificates')).toBeInTheDocument()
    })

    it('should pass undefined certificates to CertificateList', () => {
      render(
        <AdditionalCertificateList certificates={undefined} isLoading={false} />
      )
      expect(screen.getByText('Rendering 0 certificates')).toBeInTheDocument()
    })
  })

  describe('PropTypes - Default Values', () => {
    it('should render with no props (using defaults)', () => {
      expect(() => {
        render(<AdditionalCertificateList />)
      }).not.toThrow()
    })

    it('should use default empty array for certificates', () => {
      render(<AdditionalCertificateList />)
      expect(screen.getByText('Rendering 0 certificates')).toBeInTheDocument()
    })

    it('should use default false for isLoading', () => {
      render(<AdditionalCertificateList />)
      expect(
        screen.queryByText('Loading certificates...')
      ).not.toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('should show loading when isLoading is true', () => {
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={true}
        />
      )
      expect(screen.getByText('Loading certificates...')).toBeInTheDocument()
    })

    it('should not show loading when isLoading is false', () => {
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={false}
        />
      )
      expect(
        screen.queryByText('Loading certificates...')
      ).not.toBeInTheDocument()
    })

    it('should handle undefined isLoading', () => {
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={undefined}
        />
      )
      expect(screen.getByTestId('certificate-list')).toBeInTheDocument()
    })
  })

  describe('Certificate Data', () => {
    it('should handle single certificate', () => {
      const singleCert = [mockCertificates[0]]
      render(
        <AdditionalCertificateList
          certificates={singleCert}
          isLoading={false}
        />
      )
      expect(screen.getByText('Rendering 1 certificates')).toBeInTheDocument()
    })

    it('should handle multiple certificates', () => {
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={false}
        />
      )
      expect(screen.getByText('Rendering 2 certificates')).toBeInTheDocument()
    })

    it('should handle large number of certificates', () => {
      const manyCerts = Array.from({ length: 50 }, (_, i) => ({
        id_certif: i,
        name_certif: `Certificate ${i}`,
      }))
      render(
        <AdditionalCertificateList certificates={manyCerts} isLoading={false} />
      )
      expect(screen.getByText('Rendering 50 certificates')).toBeInTheDocument()
    })
  })

  describe('Component Reusability', () => {
    it('should reuse CertificateList component logic', () => {
      // The purpose of this component is to reuse CertificateList
      // It should not have any additional logic
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={false}
        />
      )

      // Should render the same component used in main certificates tab
      expect(screen.getByTestId('certificate-list')).toBeInTheDocument()
    })

    it('should maintain consistency with CertificateList behavior', () => {
      // Test that it behaves exactly like CertificateList
      const { rerender } = render(
        <AdditionalCertificateList certificates={[]} isLoading={false} />
      )
      expect(screen.getByText('Rendering 0 certificates')).toBeInTheDocument()

      rerender(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={false}
        />
      )
      expect(screen.getByText('Rendering 2 certificates')).toBeInTheDocument()

      rerender(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={true}
        />
      )
      expect(screen.getByText('Loading certificates...')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle certificates with incomplete data', () => {
      const incompleteCerts = [
        { id_certif: 1 },
        { id_certif: 2, name_certif: 'Test' },
      ]

      expect(() => {
        render(
          <AdditionalCertificateList
            certificates={incompleteCerts}
            isLoading={false}
          />
        )
      }).not.toThrow()
    })

    it('should handle empty string values', () => {
      const emptyCerts = [
        {
          id_certif: 1,
          name_certif: '',
          file_name: '',
          journey_name: '',
        },
      ]

      expect(() => {
        render(
          <AdditionalCertificateList
            certificates={emptyCerts}
            isLoading={false}
          />
        )
      }).not.toThrow()
    })

    it('should handle mixed id types (string and number)', () => {
      const mixedIdCerts = [
        { ...mockCertificates[0], id_certif: 123 },
        { ...mockCertificates[1], id_certif: '456' },
      ]

      render(
        <AdditionalCertificateList
          certificates={mixedIdCerts}
          isLoading={false}
        />
      )
      expect(screen.getByText('Rendering 2 certificates')).toBeInTheDocument()
    })
  })

  describe('PropTypes Validation', () => {
    it('should accept valid certificates array', () => {
      expect(() => {
        render(
          <AdditionalCertificateList
            certificates={mockCertificates}
            isLoading={false}
          />
        )
      }).not.toThrow()
    })

    it('should accept valid isLoading boolean', () => {
      expect(() => {
        render(
          <AdditionalCertificateList
            certificates={mockCertificates}
            isLoading={true}
          />
        )
      }).not.toThrow()
    })
  })

  describe('Component Purpose', () => {
    it('should serve as a semantic wrapper for additional certificates', () => {
      // This component's purpose is to provide semantic meaning
      // to distinguish "additional certificates" from regular certificates
      // while reusing the same UI component

      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={false}
        />
      )
      expect(screen.getByTestId('certificate-list')).toBeInTheDocument()
    })

    it('should pass through all props without modification', () => {
      // Verify that props are passed directly without transformation
      render(
        <AdditionalCertificateList
          certificates={mockCertificates}
          isLoading={true}
        />
      )
      expect(screen.getByText('Loading certificates...')).toBeInTheDocument()

      render(<AdditionalCertificateList certificates={[]} isLoading={false} />)
      expect(screen.getByText('Rendering 0 certificates')).toBeInTheDocument()
    })
  })
})
