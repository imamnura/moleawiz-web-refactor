/**
 * DeleteConfirmModal Component Tests
 * Unit tests for DeleteConfirmModal component
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteConfirmModal } from '../DeleteConfirmModal'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const translations = {
        'feature.feature_cl.delete_modal.confirm': 'Delete',
        'feature.feature_cl.delete_modal.cancel': 'Cancel',
        'feature.feature_cl.delete_modal.title': 'Delete Item',
        'feature.feature_cl.delete_modal.message': `Are you sure you want to delete "${options?.name}"?`,
      }
      return translations[key] || key
    },
  }),
}))

describe('DeleteConfirmModal', () => {
  const defaultProps = {
    open: true,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    itemName: 'Test Item',
  }

  it('should render when open is true', () => {
    render(<DeleteConfirmModal {...defaultProps} />)

    expect(screen.getByText('Delete Item')).toBeInTheDocument()
    expect(
      screen.getByText('Are you sure you want to delete "Test Item"?')
    ).toBeInTheDocument()
  })

  it('should not render when open is false', () => {
    render(<DeleteConfirmModal {...defaultProps} open={false} />)

    expect(screen.queryByText('Delete Item')).not.toBeInTheDocument()
  })

  it('should call onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(<DeleteConfirmModal {...defaultProps} onConfirm={onConfirm} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(<DeleteConfirmModal {...defaultProps} onCancel={onCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('should have danger button for confirm action', () => {
    render(<DeleteConfirmModal {...defaultProps} />)

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toHaveClass('ant-btn-dangerous')
  })

  it('should display correct item name in message', () => {
    render(<DeleteConfirmModal {...defaultProps} itemName="My Special Item" />)

    expect(
      screen.getByText('Are you sure you want to delete "My Special Item"?')
    ).toBeInTheDocument()
  })
})
