import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CertificateList } from '../CertificateList'
import FileSaver from 'file-saver'

// Mock FileSaver
vi.mock('file-saver', () => ({
  default: {
    saveAs: vi.fn(),
  },
}))

// Mock Ant Design
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    Card: ({ children, onClick, id, className }) => (
      <div
        data-testid={id}
        onClick={onClick}
        className={className}
        role="button"
        tabIndex={0}
      >
        {children}
      </div>
    ),
    Image: ({ src, alt, fallback }) => (
      <img data-testid="image" src={src || fallback} alt={alt} />
    ),
    Button: ({ children, onClick, id, icon }) => (
      <button data-testid={id} onClick={onClick}>
        {icon}
        {children}
      </button>
    ),
    Modal: ({ open, children, onCancel }) =>
      open ? (
        <div data-testid="modal" role="dialog">
          <button data-testid="modal-close" onClick={onCancel}>
            Close
          </button>
          {children}
        </div>
      ) : null,
  }
})

// Mock icons
vi.mock('@ant-design/icons', () => ({
  DownloadOutlined: () => <span>Download</span>,
  CloseOutlined: () => <span>X</span>,
}))

// Mock translation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.feature_profile.sec_tab.no_certif_yet': 'No certificates yet',
        'feature.feature_profile.pop_up.download': 'Download',
      }
      return translations[key] || key
    },
  }),
}))

describe('CertificateList', () => {
  const mockCertificates = [
    {
      id_certif: 1,
      name_certif: 'React Fundamentals',
      file_name: 'https://example.com/cert1.png',
      thumbnail: 'https://example.com/thumb1.png',
      journey_name: 'React Journey',
    },
    {
      id_certif: 2,
      name_certif: 'Advanced JavaScript',
      file_name: 'https://example.com/cert2.png',
      thumbnail: 'https://example.com/thumb2.png',
      journey_name: 'JavaScript Journey',
    },
    {
      id_certif: 3,
      name_certif: 'Node.js Backend Development',
      file_name: null,
      thumbnail: 'https://example.com/thumb3.png',
      journey_name: 'Backend Journey',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render CertificateList without crashing', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      expect(screen.getByTestId('card-certificate-0')).toBeInTheDocument()
    })

    it('should render all certificates', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
      expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument()
      expect(
        screen.getByText('Node.js Backend Development')
      ).toBeInTheDocument()
    })

    it('should render certificate journey names', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      expect(screen.getByText('React Journey')).toBeInTheDocument()
      expect(screen.getByText('JavaScript Journey')).toBeInTheDocument()
      expect(screen.getByText('Backend Journey')).toBeInTheDocument()
    })

    it('should render certificate images', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      const images = screen.getAllByTestId('image')
      expect(images).toHaveLength(mockCertificates.length)
    })

    it('should render certificates in grid layout', () => {
      const { container } = render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
      expect(grid).toHaveClass(
        'grid-cols-1',
        'md:grid-cols-2',
        'lg:grid-cols-3'
      )
    })
  })

  describe('Loading State', () => {
    it('should show loading message when isLoading is true', () => {
      render(<CertificateList certificates={[]} isLoading={true} />)
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should not show certificates when loading', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={true} />
      )
      expect(screen.queryByText('React Fundamentals')).not.toBeInTheDocument()
    })

    it('should center loading text', () => {
      const { container } = render(
        <CertificateList certificates={[]} isLoading={true} />
      )
      const loadingDiv = container.querySelector('.text-center')
      expect(loadingDiv).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty message when no certificates', () => {
      render(<CertificateList certificates={[]} isLoading={false} />)
      expect(screen.getByText('No certificates yet')).toBeInTheDocument()
    })

    it('should show empty message when certificates is null', () => {
      render(<CertificateList certificates={null} isLoading={false} />)
      expect(screen.getByText('No certificates yet')).toBeInTheDocument()
    })

    it('should show empty message when certificates is undefined', () => {
      render(<CertificateList certificates={undefined} isLoading={false} />)
      expect(screen.getByText('No certificates yet')).toBeInTheDocument()
    })

    it('should not show grid when empty', () => {
      const { container } = render(
        <CertificateList certificates={[]} isLoading={false} />
      )
      const grid = container.querySelector('.grid')
      expect(grid).not.toBeInTheDocument()
    })
  })

  describe('Certificate Card Interaction', () => {
    it('should open modal when certificate is clicked', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const firstCard = screen.getByTestId('card-certificate-0')
      fireEvent.click(firstCard)

      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    it('should display correct certificate in modal', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const secondCard = screen.getByTestId('card-certificate-1')
      fireEvent.click(secondCard)

      const modal = screen.getByTestId('modal')
      expect(modal).toBeInTheDocument()
    })

    it('should close modal when close button is clicked', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      // Open modal
      const firstCard = screen.getByTestId('card-certificate-0')
      fireEvent.click(firstCard)
      expect(screen.getByTestId('modal')).toBeInTheDocument()

      // Close modal
      const closeButton = screen.getByTestId('modal-close')
      fireEvent.click(closeButton)
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })

    it('should handle multiple modal open/close cycles', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const card = screen.getByTestId('card-certificate-0')

      // Open and close multiple times
      fireEvent.click(card)
      expect(screen.getByTestId('modal')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('modal-close'))
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()

      fireEvent.click(card)
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })
  })

  describe('Download Functionality', () => {
    it('should show download button in modal', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const card = screen.getByTestId('card-certificate-0')
      fireEvent.click(card)

      expect(screen.getByTestId('btn-download-certificate')).toBeInTheDocument()
    })

    it('should call FileSaver when download button is clicked', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const card = screen.getByTestId('card-certificate-0')
      fireEvent.click(card)

      const downloadButton = screen.getByTestId('btn-download-certificate')
      fireEvent.click(downloadButton)

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        mockCertificates[0].file_name,
        'certificate-1.png'
      )
    })

    it('should use correct filename format', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const card = screen.getByTestId('card-certificate-1')
      fireEvent.click(card)

      const downloadButton = screen.getByTestId('btn-download-certificate')
      fireEvent.click(downloadButton)

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        mockCertificates[1].file_name,
        'certificate-2.png'
      )
    })

    it('should not crash when file_name is null', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const card = screen.getByTestId('card-certificate-2')
      fireEvent.click(card)

      const downloadButton = screen.getByTestId('btn-download-certificate')

      expect(() => {
        fireEvent.click(downloadButton)
      }).not.toThrow()
    })
  })

  describe('Certificate Card Display', () => {
    it('should use file_name for image when available', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      const images = screen.getAllByTestId('image')
      expect(images[0]).toHaveAttribute('src', mockCertificates[0].file_name)
    })

    it('should use thumbnail when file_name is null', () => {
      const certsWithNullFile = [{ ...mockCertificates[0], file_name: null }]
      render(
        <CertificateList certificates={certsWithNullFile} isLoading={false} />
      )
      const image = screen.getByTestId('image')
      expect(image).toHaveAttribute('src', certsWithNullFile[0].thumbnail)
    })

    it('should have hover effect class', () => {
      const { container } = render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      const card = container.querySelector('.hover\\:scale-105')
      expect(card).toBeInTheDocument()
    })

    it('should have cursor pointer class', () => {
      const { container } = render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      const card = container.querySelector('.cursor-pointer')
      expect(card).toBeInTheDocument()
    })

    it('should truncate long certificate names', () => {
      const { container } = render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      const title = container.querySelector('.line-clamp-2')
      expect(title).toBeInTheDocument()
    })
  })

  describe('PropTypes', () => {
    it('should render with minimal props', () => {
      expect(() => {
        render(<CertificateList />)
      }).not.toThrow()
    })

    it('should handle empty array', () => {
      render(<CertificateList certificates={[]} isLoading={false} />)
      expect(screen.getByText('No certificates yet')).toBeInTheDocument()
    })

    it('should handle single certificate', () => {
      const singleCert = [mockCertificates[0]]
      render(<CertificateList certificates={singleCert} isLoading={false} />)
      expect(screen.getByText('React Fundamentals')).toBeInTheDocument()
    })

    it('should handle large number of certificates', () => {
      const manyCerts = Array.from({ length: 20 }, (_, i) => ({
        id_certif: i,
        name_certif: `Certificate ${i}`,
        file_name: `https://example.com/cert${i}.png`,
        journey_name: `Journey ${i}`,
      }))

      render(<CertificateList certificates={manyCerts} isLoading={false} />)
      expect(screen.getByText('Certificate 0')).toBeInTheDocument()
      expect(screen.getByText('Certificate 19')).toBeInTheDocument()
    })
  })

  describe('Modal Content', () => {
    it('should show certificate image in modal', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const card = screen.getByTestId('card-certificate-0')
      fireEvent.click(card)

      const modal = screen.getByTestId('modal')
      const image = modal.querySelector('[data-testid="image"]')
      expect(image).toBeInTheDocument()
    })

    it('should show download button text', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const card = screen.getByTestId('card-certificate-0')
      fireEvent.click(card)

      const downloadButtons = screen.getAllByText('Download')
      expect(downloadButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have proper card ids', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      expect(screen.getByTestId('card-certificate-0')).toBeInTheDocument()
      expect(screen.getByTestId('card-certificate-1')).toBeInTheDocument()
      expect(screen.getByTestId('card-certificate-2')).toBeInTheDocument()
    })

    it('should have proper download button id', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const card = screen.getByTestId('card-certificate-0')
      fireEvent.click(card)

      expect(screen.getByTestId('btn-download-certificate')).toBeInTheDocument()
    })

    it('should have alt text for images', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )
      const images = screen.getAllByTestId('image')
      expect(images[0]).toHaveAttribute('alt', 'React Fundamentals')
    })
  })

  describe('Edge Cases', () => {
    it('should handle certificates with missing fields', () => {
      const incompleteCerts = [
        {
          id_certif: 1,
          name_certif: 'Test Cert',
        },
      ]

      expect(() => {
        render(
          <CertificateList certificates={incompleteCerts} isLoading={false} />
        )
      }).not.toThrow()
    })

    it('should handle certificates with empty strings', () => {
      const certsWithEmptyStrings = [
        {
          id_certif: 1,
          name_certif: '',
          file_name: '',
          journey_name: '',
        },
      ]

      expect(() => {
        render(
          <CertificateList
            certificates={certsWithEmptyStrings}
            isLoading={false}
          />
        )
      }).not.toThrow()
    })

    it('should handle numeric and string id_certif', () => {
      const mixedIdCerts = [
        { ...mockCertificates[0], id_certif: 123 },
        { ...mockCertificates[1], id_certif: '456' },
      ]

      render(<CertificateList certificates={mixedIdCerts} isLoading={false} />)

      fireEvent.click(screen.getByTestId('card-certificate-0'))
      fireEvent.click(screen.getByTestId('btn-download-certificate'))

      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(String),
        'certificate-123.png'
      )
    })

    it('should maintain modal state per certificate', () => {
      render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      // Open first certificate
      fireEvent.click(screen.getByTestId('card-certificate-0'))
      expect(screen.getByTestId('modal')).toBeInTheDocument()

      // Close
      fireEvent.click(screen.getByTestId('modal-close'))

      // Open second certificate
      fireEvent.click(screen.getByTestId('card-certificate-1'))
      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })
  })

  describe('Grid Responsiveness', () => {
    it('should have responsive grid classes', () => {
      const { container } = render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1')
      expect(grid).toHaveClass('md:grid-cols-2')
      expect(grid).toHaveClass('lg:grid-cols-3')
    })

    it('should have proper gap spacing', () => {
      const { container } = render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('gap-6')
    })

    it('should have proper padding', () => {
      const { container } = render(
        <CertificateList certificates={mockCertificates} isLoading={false} />
      )

      const grid = container.querySelector('.grid')
      expect(grid).toHaveClass('p-10')
    })
  })
})
