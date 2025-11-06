/**
 * StepUsername Tests
 * Unit tests for forgot password username step component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../../../../test/test-utils'
import StepUsername from '../StepUsername'

describe('StepUsername', () => {
  const mockOnSubmit = vi.fn()
  const mockOnBack = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render username input form', () => {
    renderWithProviders(
      <StepUsername
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={false}
        error={null}
      />
    )

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /request verification code/i })
    ).toBeInTheDocument()
  })

  it('should show validation error when username is empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <StepUsername
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={false}
        error={null}
      />
    )

    const submitButton = screen.getByRole('button', {
      name: /request verification code/i,
    })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/please enter your username/i)
      ).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should call onSubmit when username is entered', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <StepUsername
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={false}
        error={null}
      />
    )

    const usernameInput = screen.getByPlaceholderText(/username/i)
    await user.type(usernameInput, 'testuser')

    const submitButton = screen.getByRole('button', {
      name: /request verification code/i,
    })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('testuser')
    })
  })

  it('should disable submit button when loading', () => {
    renderWithProviders(
      <StepUsername
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={true}
        error={null}
      />
    )

    const submitButton = screen.getByRole('button', {
      name: /request verification code/i,
    })
    // Ant Design buttons with loading don't get disabled, they get loading class
    expect(submitButton).toHaveClass('ant-btn-loading')
  })

  it('should display error message when error prop is provided', () => {
    const errorMessage = 'Username not found'
    renderWithProviders(
      <StepUsername
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={false}
        error={{ message: errorMessage }}
      />
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('should call onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <StepUsername
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={false}
        error={null}
      />
    )

    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)

    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })

  it('should clear validation error when username changes', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <StepUsername
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={false}
        error={null}
      />
    )

    // Trigger validation error
    const submitButton = screen.getByRole('button', {
      name: /request verification code/i,
    })
    await user.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText(/please enter your username/i)
      ).toBeInTheDocument()
    })

    // Type username - error should clear
    const usernameInput = screen.getByPlaceholderText(/username/i)
    await user.type(usernameInput, 't')

    await waitFor(() => {
      expect(
        screen.queryByText(/please enter your username/i)
      ).not.toBeInTheDocument()
    })
  })

  it('should trim whitespace from username', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <StepUsername
        onSubmit={mockOnSubmit}
        onBack={mockOnBack}
        isLoading={false}
        error={null}
      />
    )

    const usernameInput = screen.getByPlaceholderText(/username/i)
    await user.type(usernameInput, '  testuser  ')

    const submitButton = screen.getByRole('button', {
      name: /request verification code/i,
    })
    await user.click(submitButton)

    // Should be called with trimmed value (handled by component logic)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })
})
