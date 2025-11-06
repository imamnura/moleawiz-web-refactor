# Testing Guide - Learning Journey Refactor

## Table of Contents

1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [Unit Tests](#unit-tests)
4. [Integration Tests](#integration-tests)
5. [E2E Tests](#e2e-tests)
6. [Test Coverage Goals](#test-coverage-goals)
7. [Running Tests](#running-tests)
8. [Best Practices](#best-practices)

---

## Overview

This guide provides comprehensive testing documentation for the Learning Journey refactor. We use a combination of unit tests, integration tests, and end-to-end tests to ensure code quality and feature parity with the legacy implementation.

### Testing Stack

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Jest + React Testing Library + MSW (Mock Service Worker)
- **E2E Tests**: Playwright / Cypress
- **Coverage Tool**: Istanbul (via Jest)

---

## Testing Strategy

### Test Pyramid

```
           /\
          /E2E\       - Critical user flows
         /------\
        /  INT   \    - Feature integration
       /----------\
      /   UNIT     \  - Component & hook logic
     /--------------\
```

**Priority Levels:**

1. **High**: Core flows (Journey → Course → Module → SCORM Player)
2. **Medium**: CRUD operations, filtering, navigation
3. **Low**: UI interactions, animations, styling

---

## Unit Tests

### Component Tests

#### 1. JourneyCard Component

**File**: `src/features/journey/components/__tests__/JourneyCard.test.jsx`

```javascript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import JourneyCard from '../JourneyCard'

const mockJourney = {
  id: 1,
  name: 'React Advanced Course',
  description: 'Master React patterns',
  thumbnail: '/images/react.jpg',
  is_new: 0,
  is_completed: 0,
  days_left: 5,
  badge_new: false,
  total_course: 3,
  module_completed: 10,
  total_module: 15,
}

describe('JourneyCard', () => {
  const renderCard = (journey = mockJourney, isMobile = false) => {
    return render(
      <BrowserRouter>
        <JourneyCard journey={journey} isMobile={isMobile} index={0} />
      </BrowserRouter>
    )
  }

  test('renders journey title correctly', () => {
    renderCard()
    expect(screen.getByText('React Advanced Course')).toBeInTheDocument()
  })

  test('renders journey description', () => {
    renderCard()
    expect(screen.getByText('Master React patterns')).toBeInTheDocument()
  })

  test('displays correct course count', () => {
    renderCard()
    expect(screen.getByText(/3.*courses/i)).toBeInTheDocument()
  })

  test('shows progress percentage', () => {
    renderCard()
    // 10/15 = 66.67% ≈ 67%
    expect(screen.getByText(/67%/)).toBeInTheDocument()
  })

  test('displays days left badge when present', () => {
    renderCard()
    expect(screen.getByText(/5.*days left/i)).toBeInTheDocument()
  })

  test('shows "Continue" button for ongoing journey', () => {
    renderCard()
    expect(screen.getByText(/continue/i)).toBeInTheDocument()
  })

  test('shows "Start" button for new journey', () => {
    const newJourney = { ...mockJourney, is_new: 1 }
    renderCard(newJourney)
    expect(screen.getByText(/start/i)).toBeInTheDocument()
  })

  test('shows "Restart" button for completed journey', () => {
    const completedJourney = { ...mockJourney, is_new: 0, is_completed: 1 }
    renderCard(completedJourney)
    expect(screen.getByText(/restart/i)).toBeInTheDocument()
  })

  test('renders mobile layout correctly', () => {
    const { container } = renderCard(mockJourney, true)
    expect(container.querySelector('.mobile')).toBeInTheDocument()
  })

  test('navigates to journey detail on click', () => {
    renderCard()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/my-learning-journey/journey/1')
  })
})
```

#### 2. JourneyFilters Component

**File**: `src/features/journey/components/__tests__/JourneyFilters.test.jsx`

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import JourneyFilters from '../JourneyFilters'

describe('JourneyFilters', () => {
  test('renders all filter options', () => {
    render(<JourneyFilters onChange={jest.fn()} />)

    expect(screen.getByText(/all/i)).toBeInTheDocument()
    expect(screen.getByText(/ongoing/i)).toBeInTheDocument()
    expect(screen.getByText(/new/i)).toBeInTheDocument()
    expect(screen.getByText(/completed/i)).toBeInTheDocument()
  })

  test('shows filter label on desktop', () => {
    render(<JourneyFilters onChange={jest.fn()} isMobile={false} />)
    expect(screen.getByText(/filter/i)).toBeInTheDocument()
  })

  test('hides filter label on mobile', () => {
    render(<JourneyFilters onChange={jest.fn()} isMobile={true} />)
    expect(screen.queryByText(/filter/i)).not.toBeInTheDocument()
  })

  test('calls onChange when filter is selected', () => {
    const handleChange = jest.fn()
    render(<JourneyFilters onChange={handleChange} />)

    fireEvent.click(screen.getByText(/ongoing/i))
    expect(handleChange).toHaveBeenCalledWith('ongoing')
  })

  test('displays count badges when provided', () => {
    const stats = { all: 10, ongoing: 5, new: 2, finish: 3 }
    render(<JourneyFilters onChange={jest.fn()} stats={stats} />)

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
```

### Hook Tests

#### 3. useJourneyDetail Hook

**File**: `src/features/journey/hooks/__tests__/useJourneyDetail.test.js`

```javascript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useJourneyDetail from '../useJourneyDetail'
import { learningJourneyService } from '@/services/learningJourney'

jest.mock('@/services/learningJourney')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useJourneyDetail', () => {
  const mockJourneyData = {
    id: 1,
    name: 'React Fundamentals',
    description: 'Learn React basics',
    courses: [{ id: 1, name: 'Intro to React', total_module: 5 }],
  }

  beforeEach(() => {
    learningJourneyService.getJourneyDetail.mockResolvedValue(mockJourneyData)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('fetches journey detail successfully', async () => {
    const { result } = renderHook(() => useJourneyDetail(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockJourneyData)
  })

  test('handles loading state', () => {
    const { result } = renderHook(() => useJourneyDetail(1), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeUndefined()
  })

  test('handles error state', async () => {
    learningJourneyService.getJourneyDetail.mockRejectedValue(
      new Error('Failed to fetch')
    )

    const { result } = renderHook(() => useJourneyDetail(1), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error.message).toBe('Failed to fetch')
  })

  test('does not fetch when journeyId is null', () => {
    renderHook(() => useJourneyDetail(null), {
      wrapper: createWrapper(),
    })

    expect(learningJourneyService.getJourneyDetail).not.toHaveBeenCalled()
  })
})
```

#### 4. useSCORMPlayer Hook

**File**: `src/features/journey/hooks/__tests__/useSCORMPlayer.test.js`

```javascript
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useSCORMPlayer from '../useSCORMPlayer'
import { learningJourneyService } from '@/services/learningJourney'

jest.mock('@/services/learningJourneyService')
jest.useFakeTimers()

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useSCORMPlayer', () => {
  const mockOptions = {
    moduleId: 'module-123',
    studentId: 'user-456',
    studentName: 'John Doe',
    savedData: null,
    onComplete: jest.fn(),
  }

  beforeEach(() => {
    learningJourneyService.updateModuleProgress.mockResolvedValue({
      success: true,
    })
    localStorage.clear()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  test('initializes with default state', () => {
    const { result } = renderHook(() => useSCORMPlayer(mockOptions), {
      wrapper: createWrapper(),
    })

    expect(result.current.isInitialized).toBe(false)
    expect(result.current.isCompleted).toBe(false)
    expect(result.current.scormData).toEqual(mockOptions.savedData || {})
  })

  test('sets initialized state on handleInitialize', () => {
    const { result } = renderHook(() => useSCORMPlayer(mockOptions), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.handleInitialize({})
    })

    expect(result.current.isInitialized).toBe(true)
  })

  test('syncs data automatically every 30 seconds', async () => {
    const { result } = renderHook(() => useSCORMPlayer(mockOptions), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.handleInitialize({})
      result.current.handleSetValue('cmi.core.lesson_status', 'incomplete')
    })

    // Fast-forward 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000)
    })

    await waitFor(() => {
      expect(learningJourneyService.updateModuleProgress).toHaveBeenCalled()
    })
  })

  test('saves data to encrypted localStorage', () => {
    const { result } = renderHook(() => useSCORMPlayer(mockOptions), {
      wrapper: createWrapper(),
    })

    const testData = { 'cmi.core.lesson_status': 'incomplete' }

    act(() => {
      result.current.handleSetValue('cmi.core.lesson_status', 'incomplete')
    })

    const stored = localStorage.getItem(`scorm-${mockOptions.moduleId}`)
    expect(stored).toBeTruthy()
  })

  test('calls onComplete when lesson is completed', async () => {
    const { result } = renderHook(() => useSCORMPlayer(mockOptions), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.handleInitialize({})
      result.current.handleFinish({
        cmi: {
          core: {
            lesson_status: 'completed',
            score: { raw: 100 },
          },
        },
      })
    })

    await waitFor(() => {
      expect(mockOptions.onComplete).toHaveBeenCalled()
    })
  })

  test('calculates session time correctly', () => {
    const { result } = renderHook(() => useSCORMPlayer(mockOptions), {
      wrapper: createWrapper(),
    })

    // Mock session start 90 minutes ago
    const startTime = new Date(Date.now() - 90 * 60 * 1000)

    act(() => {
      result.current.handleInitialize({ sessionStartTime: startTime })
    })

    const progress = result.current.getProgress()
    // Should be approximately "0001:30:00.00" (1 hour 30 minutes)
    expect(progress.session_time).toMatch(/0001:30:/)
  })
})
```

---

## Integration Tests

### Feature Integration Tests

#### 5. Learning Journey List Page Integration

**File**: `src/pages/journey/__tests__/LearningJourneyPage.integration.test.jsx`

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import LearningJourneyPage from '../LearningJourneyPage'
import { learningJourneyService } from '@/services/learningJourney'

jest.mock('@/services/learningJourney')

const mockJourneys = [
  {
    id: 1,
    name: 'React Basics',
    is_new: 1,
    is_completed: 0,
    total_course: 2,
    module_completed: 0,
    total_module: 10,
  },
  {
    id: 2,
    name: 'Advanced React',
    is_new: 0,
    is_completed: 0,
    total_course: 3,
    module_completed: 5,
    total_module: 15,
  },
  {
    id: 3,
    name: 'React Mastery',
    is_new: 0,
    is_completed: 1,
    total_course: 4,
    module_completed: 20,
    total_module: 20,
  },
]

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LearningJourneyPage />} />
          </Routes>
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

describe('LearningJourneyPage Integration', () => {
  beforeEach(() => {
    learningJourneyService.getJourneyList.mockResolvedValue(mockJourneys)
  })

  test('loads and displays all journeys', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument()
      expect(screen.getByText('Advanced React')).toBeInTheDocument()
      expect(screen.getByText('React Mastery')).toBeInTheDocument()
    })
  })

  test('filters journeys by category', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(3)
    })

    // Click "New" filter
    fireEvent.click(screen.getByText(/new/i))

    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument()
      expect(screen.queryByText('Advanced React')).not.toBeInTheDocument()
    })
  })

  test('shows empty state when no journeys match filter', async () => {
    learningJourneyService.getJourneyList.mockResolvedValue([])
    renderPage()

    fireEvent.click(screen.getByText(/ongoing/i))

    await waitFor(() => {
      expect(screen.getByText(/no ongoing programs/i)).toBeInTheDocument()
    })
  })

  test('navigates to journey detail on card click', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument()
    })

    const card = screen.getByText('React Basics').closest('a')
    expect(card).toHaveAttribute('href', '/my-learning-journey/journey/1')
  })
})
```

---

## E2E Tests

### End-to-End User Flows

#### 6. Complete Learning Journey Flow

**File**: `e2e/learning-journey.spec.js` (Playwright)

```javascript
const { test, expect } = require('@playwright/test')

test.describe('Learning Journey E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="username"]', 'testuser')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Wait for navigation to home
    await page.waitForURL('**/home')
  })

  test('User can complete full learning journey flow', async ({ page }) => {
    // Navigate to Learning Journey
    await page.click('text=My Learning Journey')
    await expect(page).toHaveURL('**/my-learning-journey')

    // Filter by "New"
    await page.click('text=New')
    await expect(page.locator('.journey-card')).toHaveCount(1)

    // Click on a journey
    await page.click('.journey-card:first-child')
    await expect(page).toHaveURL(/journey\/\d+$/)

    // Verify journey details loaded
    await expect(page.locator('h1')).toContainText(/React/i)
    await expect(page.locator('.course-list')).toBeVisible()

    // Click on first course
    await page.click('.course-item:first-child')
    await expect(page).toHaveURL(/course\/\d+$/)

    // Verify course details
    await expect(page.locator('.module-list')).toBeVisible()

    // Click on unlocked module
    const unlockedModule = page.locator('.module-unlock').first()
    await unlockedModule.click()
    await expect(page).toHaveURL(/module\/\d+$/)

    // Start module
    await page.click('button:has-text("Start Module")')
    await expect(page).toHaveURL(/play$/)

    // Wait for SCORM player to load
    await expect(page.frameLocator('iframe').locator('body')).toBeVisible()

    // Complete SCORM content (mock interaction)
    const iframe = page.frameLocator('iframe[title="SCORM Content Player"]')
    await iframe.locator('button:has-text("Next")').click()
    await iframe.locator('button:has-text("Complete")').click()

    // Verify completion
    await page.waitForURL(/module\/\d+$/)
    await expect(page.locator('.completion-badge')).toBeVisible()
    await expect(page.locator('.progress')).toContainText('100%')
  })

  test('User can navigate Learning Journey sidebar', async ({ page }) => {
    await page.goto('/my-learning-journey/journey/1')

    // Sidebar should be visible
    await expect(page.locator('.journey-sidebar')).toBeVisible()

    // Click on first course in sidebar
    await page.locator('.course-item:first-child').click()

    // Module list should appear
    await expect(page.locator('.module-item')).toBeVisible()

    // Click on module
    await page.locator('.module-item:first-child').click()

    // Should navigate to module detail
    await expect(page).toHaveURL(/module\/\d+$/)
  })

  test('SCORM player persists progress', async ({ page }) => {
    await page.goto('/my-learning-journey/journey/1/course/1/module/1/play')

    // Wait for SCORM player
    await expect(
      page.locator('iframe[title="SCORM Content Player"]')
    ).toBeVisible()

    // Interact with content
    const iframe = page.frameLocator('iframe[title="SCORM Content Player"]')
    await iframe.locator('button:has-text("Next")').click()

    // Refresh page
    await page.reload()

    // Progress should be restored
    await expect(iframe.locator('.progress-indicator')).toContainText(/50%/)
  })

  test('Mobile responsive navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/my-learning-journey')

    // Mobile filters should be visible
    await expect(page.locator('.journey-filters')).toBeVisible()

    // Cards should render in mobile layout
    const cards = page.locator('.journey-card.mobile')
    await expect(cards).toHaveCount(3)

    // Click journey card (entire card is clickable on mobile)
    await cards.first().click()
    await expect(page).toHaveURL(/journey\/\d+$/)

    // Mobile drawer should be used for sidebar
    await expect(page.locator('.journey-sidebar')).toHaveCSS(
      'position',
      'fixed'
    )
  })
})
```

---

## Test Coverage Goals

### Target Coverage

- **Overall**: 80%+
- **Critical Paths**: 90%+
- **SCORM Player**: 95%+
- **Hooks**: 85%+
- **Components**: 75%+

### Coverage Reports

Run coverage:

```bash
pnpm test:coverage
```

View HTML report:

```bash
open coverage/lcov-report/index.html
```

### Critical Files (Must have 90%+ coverage)

- `useSCORMPlayer.js`
- `scormAPI.js`
- `useJourneyDetail.js`
- `useCourseDetail.js`
- `useModuleDetail.js`
- `LearningJourneyPage.jsx`
- `SCORMPlayerPage.jsx`

---

## Running Tests

### Unit & Integration Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test JourneyCard

# Run with coverage
pnpm test:coverage

# Update snapshots
pnpm test -u
```

### E2E Tests

```bash
# Run all E2E tests (headless)
pnpm test:e2e

# Run E2E with UI
pnpm test:e2e:ui

# Run specific test
pnpm test:e2e learning-journey

# Debug mode
pnpm test:e2e:debug
```

### CI/CD Integration

**GitHub Actions** (`.github/workflows/test.yml`):

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm test:coverage
      - run: pnpm test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Best Practices

### 1. Test Naming Conventions

```javascript
// ✅ Good
test('displays error message when API fails', () => {})
test('navigates to journey detail on card click', () => {})

// ❌ Bad
test('test 1', () => {})
test('it works', () => {})
```

### 2. Arrange-Act-Assert Pattern

```javascript
test('filters journeys correctly', () => {
  // Arrange
  const journeys = [mockNew, mockOngoing, mockCompleted]

  // Act
  const result = filterByCategory(journeys, 'new')

  // Assert
  expect(result).toHaveLength(1)
  expect(result[0]).toEqual(mockNew)
})
```

### 3. Use Data-Testid Sparingly

```javascript
// ✅ Prefer semantic queries
screen.getByRole('button', { name: /start/i })
screen.getByLabelText('Username')

// ⚠️ Use data-testid only when necessary
screen.getByTestId('complex-component-part')
```

### 4. Mock External Dependencies

```javascript
// Mock API calls
jest.mock('@/services/learningJourney')

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock
```

### 5. Clean Up After Tests

```javascript
afterEach(() => {
  jest.clearAllMocks()
  localStorage.clear()
  cleanup() // From @testing-library/react
})
```

### 6. Test User Behavior, Not Implementation

```javascript
// ✅ Good - tests user interaction
test('submits form when user clicks submit', async () => {
  render(<Form />)
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument()
  })
})

// ❌ Bad - tests implementation details
test('calls handleSubmit function', () => {
  const handleSubmit = jest.fn()
  render(<Form onSubmit={handleSubmit} />)
  expect(handleSubmit).not.toHaveBeenCalled()
})
```

---

## Additional Resources

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated:** October 31, 2025  
**Version:** 1.0.0  
**Maintainer:** Development Team
