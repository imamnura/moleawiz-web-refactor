import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/localize/i18n'
import {
  ModalCloseFormReview,
  ModalIncompleteReview,
  ModalConfirmSubmitReview,
  ModalDeleteModule,
} from '../../components/ReviewModals'

// Mock Ant Design components
vi.mock('antd', () => ({
  Modal: ({ children, footer, open }) =>
    open ? (
      <div data-testid="modal">
        <div data-testid="modal-content">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
      </div>
    ) : null,
  Button: ({ children, onClick, type, className }) => (
    <button
      onClick={onClick}
      data-type={type}
      className={className}
      data-testid="modal-button"
    >
      {children}
    </button>
  ),
  Row: ({ children, className }) => (
    <div className={className} data-testid="modal-row">
      {children}
    </div>
  ),
}))

describe('ReviewModals', () => {
  const mockOnClose = vi.fn()
  const mockOnConfirm = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ModalCloseFormReview', () => {
    const renderModal = (props = {}) => {
      return render(
        <I18nextProvider i18n={i18n}>
          <ModalCloseFormReview
            open={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
            {...props}
          />
        </I18nextProvider>
      )
    }

    it('should render when open is true', () => {
      renderModal()

      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    it('should not render when open is false', () => {
      renderModal({ open: false })

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })

    it('should display quit confirmation title', () => {
      const { container } = renderModal()

      const title = container.querySelector('.text-gray-900.font-medium')
      expect(title).toBeInTheDocument()
    })

    it('should display quit description', () => {
      const { container } = renderModal()

      const description = container.querySelector('.text-gray-700')
      expect(description).toBeInTheDocument()
    })

    it('should render No and Yes buttons', () => {
      renderModal()

      const buttons = screen.getAllByTestId('modal-button')
      expect(buttons).toHaveLength(2)
    })

    it('should call onClose when No button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()

      const buttons = screen.getAllByTestId('modal-button')
      const noButton = buttons[0] // First button is No
      await user.click(noButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onConfirm when Yes button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()

      const buttons = screen.getAllByTestId('modal-button')
      const yesButton = buttons[1] // Second button is Yes
      await user.click(yesButton)

      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })

    it('should render footer with correct layout', () => {
      renderModal()

      const footer = screen.getByTestId('modal-footer')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('ModalIncompleteReview', () => {
    const renderModal = (props = {}) => {
      return render(
        <I18nextProvider i18n={i18n}>
          <ModalIncompleteReview
            open={true}
            onClose={mockOnClose}
            {...props}
          />
        </I18nextProvider>
      )
    }

    it('should render when open is true', () => {
      renderModal()

      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    it('should not render when open is false', () => {
      renderModal({ open: false })

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })

    it('should display incomplete review title', () => {
      const { container } = renderModal()

      const title = container.querySelector('.text-gray-900.font-medium')
      expect(title).toBeInTheDocument()
    })

    it('should display incomplete review description', () => {
      const { container } = renderModal()

      const description = container.querySelector('.text-gray-700')
      expect(description).toBeInTheDocument()
    })

    it('should render OK button only', () => {
      renderModal()

      const buttons = screen.getAllByTestId('modal-button')
      expect(buttons).toHaveLength(1)
    })

    it('should call onClose when OK button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()

      const okButton = screen.getByTestId('modal-button')
      await user.click(okButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should center the OK button', () => {
      renderModal()

      const row = screen.getByTestId('modal-row')
      expect(row).toHaveClass('justify-center')
    })
  })

  describe('ModalConfirmSubmitReview', () => {
    const renderModal = (props = {}) => {
      return render(
        <I18nextProvider i18n={i18n}>
          <ModalConfirmSubmitReview
            open={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
            acceptCount={8}
            rejectCount={2}
            isApproved={true}
            {...props}
          />
        </I18nextProvider>
      )
    }

    it('should render when open is true', () => {
      renderModal()

      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    it('should not render when open is false', () => {
      renderModal({ open: false })

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })

    it('should display confirmation title', () => {
      const { container } = renderModal()

      const title = container.querySelector('.text-gray-900.font-medium')
      expect(title).toBeInTheDocument()
    })

    it('should display accept count', () => {
      renderModal()

      expect(screen.getByText(/accepted.*8/i)).toBeInTheDocument()
    })

    it('should display reject count', () => {
      renderModal()

      expect(screen.getByText(/rejected.*2/i)).toBeInTheDocument()
    })

    it('should display approved status when isApproved is true', () => {
      renderModal({ isApproved: true })

      const approvedText = screen.getByText(/approved/i)
      expect(approvedText).toBeInTheDocument()
      expect(approvedText).toHaveClass('text-green-600')
    })

    it('should display declined status when isApproved is false', () => {
      renderModal({ isApproved: false })

      const declinedText = screen.getByText(/declined/i)
      expect(declinedText).toBeInTheDocument()
      expect(declinedText).toHaveClass('text-red-600')
    })

    it('should render Cancel and Submit buttons', () => {
      renderModal()

      const buttons = screen.getAllByTestId('modal-button')
      expect(buttons).toHaveLength(2)
    })

    it('should call onClose when Cancel button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()

      const buttons = screen.getAllByTestId('modal-button')
      const cancelButton = buttons[0] // First button is Cancel
      await user.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onConfirm when Submit button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()

      const buttons = screen.getAllByTestId('modal-button')
      const submitButton = buttons[1] // Second button is Submit
      await user.click(submitButton)

      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })

    it('should use default values for counts', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ModalConfirmSubmitReview
            open={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
          />
        </I18nextProvider>
      )

      expect(screen.getByText(/accepted.*0/i)).toBeInTheDocument()
      expect(screen.getByText(/rejected.*0/i)).toBeInTheDocument()
    })

    it('should display result summary in gray box', () => {
      const { container } = renderModal()

      const summaryBox = container.querySelector('.bg-gray-100')
      expect(summaryBox).toBeInTheDocument()
    })
  })

  describe('ModalDeleteModule', () => {
    const renderModal = (props = {}) => {
      return render(
        <I18nextProvider i18n={i18n}>
          <ModalDeleteModule
            open={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
            moduleName="JavaScript Fundamentals"
            {...props}
          />
        </I18nextProvider>
      )
    }

    it('should render when open is true', () => {
      renderModal()

      expect(screen.getByTestId('modal')).toBeInTheDocument()
    })

    it('should not render when open is false', () => {
      renderModal({ open: false })

      expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    })

    it('should display module name in title', () => {
      renderModal()

      expect(
        screen.getByText(/delete.*"JavaScript Fundamentals"/i)
      ).toBeInTheDocument()
    })

    it('should display warning description', () => {
      renderModal()

      expect(
        screen.getByText(/once deleted.*no longer have.*access/i)
      ).toBeInTheDocument()
    })

    it('should render No and Yes buttons', () => {
      renderModal()

      const buttons = screen.getAllByTestId('modal-button')
      expect(buttons).toHaveLength(2)
      expect(screen.getByText(/^No$/)).toBeInTheDocument()
      expect(screen.getByText(/^Yes$/)).toBeInTheDocument()
    })

    it('should call onClose when No button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()

      const noButton = screen.getByText(/^No$/)
      await user.click(noButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should call onConfirm when Yes button is clicked', async () => {
      const user = userEvent.setup()
      renderModal()

      const yesButton = screen.getByText(/^Yes$/)
      await user.click(yesButton)

      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })

    it('should use empty string as default module name', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ModalDeleteModule
            open={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
          />
        </I18nextProvider>
      )

      expect(screen.getByText(/delete.*""/i)).toBeInTheDocument()
    })

    it('should handle long module names', () => {
      renderModal({
        moduleName: 'Very Long Module Name That Should Be Displayed Correctly',
      })

      expect(
        screen.getByText(
          /Very Long Module Name That Should Be Displayed Correctly/i
        )
      ).toBeInTheDocument()
    })
  })

  describe('Modal Styling and Layout', () => {
    it('should apply correct button widths in ModalCloseFormReview', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ModalCloseFormReview
            open={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
          />
        </I18nextProvider>
      )

      const buttons = screen.getAllByTestId('modal-button')
      buttons.forEach((button) => {
        expect(button).toHaveClass('w-[170px]')
      })
    })

    it('should apply primary type to Yes button in ModalCloseFormReview', () => {
      render(
        <I18nextProvider i18n={i18n}>
          <ModalCloseFormReview
            open={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
          />
        </I18nextProvider>
      )

      const buttons = screen.getAllByTestId('modal-button')
      const yesButton = buttons[1] // Second button is Yes
      expect(yesButton).toHaveAttribute('data-type', 'primary')
    })

    it('should center content in all modals', () => {
      const { container: container1 } = render(
        <I18nextProvider i18n={i18n}>
          <ModalCloseFormReview
            open={true}
            onClose={mockOnClose}
            onConfirm={mockOnConfirm}
          />
        </I18nextProvider>
      )

      const content = container1.querySelector('.text-center')
      expect(content).toBeInTheDocument()
    })
  })
})
