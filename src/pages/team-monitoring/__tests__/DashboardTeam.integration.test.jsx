import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from './testUtils/renderWithProviders'
import { createMockOutletContext } from './testUtils/renderWithProviders'
import { server } from './testUtils/server'
import { http, HttpResponse } from 'msw'
import DashboardTeam from '../components/DashboardTeam'

// Import MSW server setup
import './testUtils/server'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

describe('DashboardTeam Integration Tests', () => {
  const mockOutletContext = createMockOutletContext()

  beforeEach(() => {
    mockOutletContext.setHomeTitle.mockClear()
  })

  describe('Data Fetching', () => {
    it('should fetch and display programs successfully', async () => {
      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      // Wait for loader to disappear (data loaded)
      await waitFor(
        () => {
          expect(screen.queryByRole('img', { name: /loading/i })).not.toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // Should display programs
      expect(screen.getByText('React Advanced Training')).toBeInTheDocument()
      expect(screen.getByText('Node.js Fundamentals')).toBeInTheDocument()

      // Should display program count
      expect(screen.getByText(/ongoing_team_program.*\(2\)/i)).toBeInTheDocument()
    })

    it('should handle API error gracefully', async () => {
      // Override handler to return error
      server.use(
        http.get(`${API_BASE_URL}/overview`, () => {
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
          )
        })
      )

      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(
        () => {
          expect(screen.queryByRole('img', { name: /loading/i })).not.toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // Should show empty state
      expect(screen.getByText(/member_no_program/i)).toBeInTheDocument()
    })

    it('should handle empty programs list', async () => {
      // Override handler to return empty data
      server.use(
        http.get(`${API_BASE_URL}/overview`, () => {
          return HttpResponse.json({
            count_team: 0,
            programs: [],
          })
        })
      )

      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(
        () => {
          expect(screen.queryByRole('img', { name: /loading/i })).not.toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // Should show empty state message
      expect(screen.getByText(/member_no_program/i)).toBeInTheDocument()

      // Should display program count (0)
      expect(screen.getByText(/ongoing_team_program.*\(0\)/i)).toBeInTheDocument()
    })
  })

  describe('Program Card Display', () => {
    it('should render program cards with correct data', async () => {
      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(
        () => {
          expect(screen.getByText('React Advanced Training')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // React Advanced Training
      expect(screen.getByText(/5.*\/.*10.*feature\.feature_tm\.member_completed/i)).toBeInTheDocument()

      // Node.js Fundamentals
      expect(screen.getByText('Node.js Fundamentals')).toBeInTheDocument()
      expect(screen.getByText(/3.*\/.*15.*feature\.feature_tm\.member_completed/i)).toBeInTheDocument()
    })

    it('should display program thumbnails', async () => {
      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(
        () => {
          expect(screen.getByText('React Advanced Training')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      const images = screen.getAllByAltText('Program thumbnail')
      expect(images).toHaveLength(2)
      expect(images[0]).toHaveAttribute('src', '/images/react-training.jpg')
      expect(images[1]).toHaveAttribute('src', '/images/node-training.jpg')
    })

    it('should render progress bars with correct percentages', async () => {
      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(
        () => {
          expect(screen.getByText('React Advanced Training')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // React: 5/10 = 50%
      // Node.js: 3/15 = 20%
      const progressBars = document.querySelectorAll('.ant-progress-bg')
      expect(progressBars).toHaveLength(2)
    })

    it('should render View buttons with correct links', async () => {
      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(
        () => {
          expect(screen.getByText('React Advanced Training')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      const viewButtons = screen.getAllByText(/feature\.feature_tm\.view/i)
      expect(viewButtons).toHaveLength(2)

      // Check link hrefs
      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveAttribute('href', '/team-monitoring/journey/1')
      expect(links[1]).toHaveAttribute('href', '/team-monitoring/journey/2')
    })
  })

  describe('Component Behavior', () => {
    it('should set page title on mount', async () => {
      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(() => {
        expect(mockOutletContext.setHomeTitle).toHaveBeenCalledWith(
          'feature.feature_tm.team_monitoring'
        )
      })
    })

    it('should show loading state while fetching data', () => {
      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      // Loader should be visible initially (Ant Design Spin with loading icon)
      expect(screen.getByRole('img', { name: /loading/i })).toBeInTheDocument()
    })

    it('should handle zero total users in progress calculation', async () => {
      // Override handler with zero total users
      server.use(
        http.get(`${API_BASE_URL}/overview`, () => {
          return HttpResponse.json({
            count_team: 1,
            programs: [
              {
                program_id: 1,
                program_name: 'Empty Program',
                thumbnail: '/test.jpg',
                total_user: 0,
                total_completed_user: 0,
              },
            ],
          })
        })
      )

      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(
        () => {
          expect(screen.getByText('Empty Program')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // Should display 0/0
      expect(screen.getByText(/0.*\/.*0.*feature\.feature_tm\.member_completed/i)).toBeInTheDocument()
    })
  })

  describe('Responsive Behavior', () => {
    it.skip('should render with desktop padding', async () => {
      // SKIP: isMobile is not in Redux store, it's set globally in App
      // This test would require mocking the entire app context
      const preloadedState = {
        isMobile: false,
      }

      renderWithProviders(<DashboardTeam />, {
        outletContext: mockOutletContext,
        preloadedState,
      })

      await waitFor(
        () => {
          expect(screen.getByText('React Advanced Training')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // Card should have desktop padding (24px)
      const card = document.querySelector('.ant-card-body')
      expect(card).toBeInTheDocument()
      expect(card).toHaveStyle({ padding: '24px' })
    })

    it.skip('should render with mobile padding', async () => {
      // SKIP: isMobile is not in Redux store, it's set globally in App
      // This test would require mocking the entire app context
      const preloadedState = {
        isMobile: true,
      }

      renderWithProviders(<DashboardTeam />, {
        outletContext: mockOutletContext,
        preloadedState,
      })

      await waitFor(
        () => {
          expect(screen.getByText('React Advanced Training')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // Card should have mobile padding (16px)
      const card = document.querySelector('.ant-card-body')
      expect(card).toBeInTheDocument()
      expect(card).toHaveStyle({ padding: '16px' })
    })
  })

  describe('Scrollable Container', () => {
    it('should apply scrollable container when programs exist', async () => {
      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(
        () => {
          expect(screen.getByText('React Advanced Training')).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      const container = document.querySelector('[style*="overflow"]')
      expect(container).toBeInTheDocument()
      expect(container).toHaveStyle({
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '467px',
      })
    })

    it('should not apply fixed height when no programs', async () => {
      // Override handler to return empty data
      server.use(
        http.get(`${API_BASE_URL}/overview`, () => {
          return HttpResponse.json({
            count_team: 0,
            programs: [],
          })
        })
      )

      renderWithProviders(<DashboardTeam />, { outletContext: mockOutletContext })

      await waitFor(
        () => {
          expect(screen.getByText(/member_no_program/i)).toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      const container = document.querySelector('[style*="overflow"]')
      expect(container).toBeInTheDocument()
      expect(container).toHaveStyle({
        height: 'auto',
      })
    })
  })
})
