# Rewards Testing Guide - Quick Reference

**Last Updated:** 3 November 2025  
**Status:** ✅ Production Ready

---

## 🚀 Quick Start

### Run All Tests
```bash
npm test -- "src/pages/rewards" --run
```

### Run Specific Category
```bash
# Utils only
npm test -- "src/pages/rewards/utils" --run

# Hooks only  
npm test -- "src/pages/rewards/hooks" --run

# Components only
npm test -- "src/pages/rewards/components" --run
```

### Run Single File
```bash
npm test -- formatters.test --run
npm test -- useRedeemFlow.test --run
npm test -- OTPVerificationModal.test --run
```

---

## 📋 Test Checklist untuk New Features

Ketika menambah feature baru di Rewards, pastikan:

### 1. Utils Testing
- [ ] Test semua edge cases (null, undefined, empty)
- [ ] Test dengan data valid & invalid
- [ ] Test numeric calculations dengan precision
- [ ] Test date/time formatting untuk berbagai timezone
- [ ] Test error handling & fallbacks

### 2. Hook Testing  
- [ ] Test loading states (initial, refetch)
- [ ] Test success dengan valid data
- [ ] Test error states (network, API errors)
- [ ] Test data transformations
- [ ] Test cache invalidation & refetching
- [ ] Test cleanup pada unmount

### 3. Component Testing
- [ ] Test rendering dengan props minimal & complete
- [ ] Test user interactions (click, input, form submit)
- [ ] Test conditional rendering (loading, error, empty states)
- [ ] Test accessibility (roles, labels, alt text)
- [ ] Test mobile vs desktop layouts
- [ ] Test callbacks execution dengan correct parameters
- [ ] Test keyboard navigation

### 4. Modal Testing
- [ ] Test open/close states
- [ ] Test backdrop clicks
- [ ] Test escape key
- [ ] Test form submissions
- [ ] Test validation errors
- [ ] Test success & error callbacks

---

## 🎯 Common Testing Patterns

### Pattern 1: Testing Component dengan Props
```javascript
describe('MyComponent', () => {
  const defaultProps = {
    title: 'Test Title',
    onClose: vi.fn(),
    // ... other required props
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with default props', () => {
    render(<MyComponent {...defaultProps} />)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should handle missing optional props', () => {
    const { title, ...requiredOnly } = defaultProps
    render(<MyComponent {...requiredOnly} />)
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })
})
```

### Pattern 2: Testing User Interactions
```javascript
it('should call callback on button click', async () => {
  const mockCallback = vi.fn()
  const user = userEvent.setup()
  
  render(<MyComponent onClick={mockCallback} />)
  
  const button = screen.getByRole('button', { name: /submit/i })
  await user.click(button)
  
  expect(mockCallback).toHaveBeenCalledTimes(1)
  expect(mockCallback).toHaveBeenCalledWith(expectedData)
})
```

### Pattern 3: Testing Form Input
```javascript
it('should update input value on change', async () => {
  const user = userEvent.setup()
  render(<MyForm />)
  
  const input = screen.getByLabelText(/email/i)
  await user.type(input, 'test@example.com')
  
  expect(input).toHaveValue('test@example.com')
})
```

### Pattern 4: Testing Async Operations
```javascript
it('should show loading then success', async () => {
  render(<MyComponent />)
  
  // Initially loading
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  // Wait for success
  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument()
  })
  
  // Loading should be gone
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})
```

### Pattern 5: Testing RTK Query Hooks
```javascript
import { renderHook, waitFor } from '@testing-library/react'

it('should fetch data successfully', async () => {
  const mockData = { id: 1, name: 'Test' }
  useGetDataQuery.mockReturnValue({
    data: mockData,
    isLoading: false,
    isSuccess: true,
    isError: false,
  })
  
  const { result } = renderHook(() => useMyHook())
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true)
  })
  
  expect(result.current.data).toEqual(mockData)
})
```

### Pattern 6: Testing Conditional Rendering
```javascript
describe('Conditional States', () => {
  it('should show loading spinner when loading', () => {
    render(<MyComponent isLoading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should show error message when error', () => {
    render(<MyComponent error="Something went wrong" />)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('should show empty state when no data', () => {
    render(<MyComponent data={[]} />)
    expect(screen.getByText(/no data available/i)).toBeInTheDocument()
  })

  it('should show content when data available', () => {
    render(<MyComponent data={[{ id: 1 }]} />)
    expect(screen.getByText(/data content/i)).toBeInTheDocument()
  })
})
```

---

## 🔧 Common Mock Setups

### Mock Ant Design Components
```javascript
vi.mock('antd', () => ({
  Modal: ({ children, open, onCancel }) =>
    open ? (
      <div data-testid="modal" role="dialog" onClick={onCancel}>
        {children}
      </div>
    ) : null,
  
  Button: ({ children, onClick, disabled, loading, htmlType }) => (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      type={htmlType}
    >
      {loading ? 'Loading...' : children}
    </button>
  ),
  
  Input: ({ value, onChange, placeholder, maxLength }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  ),
  
  Form: Object.assign(
    ({ children, onFinish }) => (
      <form onSubmit={(e) => { e.preventDefault(); onFinish?.() }}>
        {children}
      </form>
    ),
    {
      Item: ({ children, label }) => (
        <div>
          {label && <label>{label}</label>}
          {children}
        </div>
      ),
    }
  ),
  
  Row: ({ children }) => <div>{children}</div>,
  Col: ({ children }) => <div>{children}</div>,
  Flex: ({ children }) => <div style={{ display: 'flex' }}>{children}</div>,
  Space: ({ children }) => <div>{children}</div>,
}))
```

### Mock i18next
```javascript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'feature.rewards.title': 'Rewards',
        'feature.rewards.button.redeem': 'Redeem',
        // Add all your translation keys
      }
      return translations[key] || key
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}))
```

### Mock React Router
```javascript
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/rewards' }),
  useParams: () => ({ id: '1' }),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}))
```

### Mock RTK Query
```javascript
const mockUseGetRewardsQuery = vi.fn()
const mockUseRedeemMutation = vi.fn()

vi.mock('@/redux/api/rewardApi', () => ({
  useGetRewardsQuery: () => mockUseGetRewardsQuery(),
  useRedeemRewardMutation: () => mockUseRedeemMutation(),
}))

// In test:
beforeEach(() => {
  mockUseGetRewardsQuery.mockReturnValue({
    data: mockData,
    isLoading: false,
    isSuccess: true,
    refetch: vi.fn(),
  })
  
  mockUseRedeemMutation.mockReturnValue([
    vi.fn().mockResolvedValue({ data: mockResult }),
    { isLoading: false, isSuccess: false },
  ])
})
```

### Mock Redux Store
```javascript
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: () => ({
        profile: { points: 1000, ...initialState.user },
      }),
      // other reducers
    },
  })
}

// In test:
const renderWithStore = (component, initialState) => {
  return render(
    <Provider store={createMockStore(initialState)}>
      {component}
    </Provider>
  )
}
```

---

## ⚠️ Common Pitfalls & Solutions

### Pitfall 1: Text Not Found (Multi-element Text)
**Problem:**
```javascript
// Fails: text split across elements
screen.getByText('Total points: 1000')
```

**Solution:**
```javascript
// Use regex
screen.getByText(/total points.*1000/i)

// Or custom matcher
screen.getByText((content, element) => {
  return element.textContent === 'Total points: 1000'
})
```

### Pitfall 2: Async State Not Updated
**Problem:**
```javascript
await user.click(button)
expect(screen.getByText('Success')).toBeInTheDocument() // Fails
```

**Solution:**
```javascript
await user.click(button)
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### Pitfall 3: Mock Not Called
**Problem:**
```javascript
const mockFn = vi.fn()
render(<Component onClick={mockFn} />)
fireEvent.click(screen.getByRole('button'))
expect(mockFn).toHaveBeenCalled() // Sometimes fails
```

**Solution:**
```javascript
// Use userEvent instead of fireEvent
const user = userEvent.setup()
await user.click(screen.getByRole('button'))
expect(mockFn).toHaveBeenCalled()
```

### Pitfall 4: Hidden Elements
**Problem:**
```javascript
// Fails: element has aria-hidden="true"
screen.getByRole('status')
```

**Solution:**
```javascript
// Add hidden: true option
screen.getByRole('status', { hidden: true })

// Or use different query
screen.getByTestId('loading-spinner')
```

### Pitfall 5: Wrong Mock Order
**Problem:**
```javascript
mockUnwrap
  .mockResolvedValueOnce(data1) // Called 2nd
  .mockResolvedValueOnce(data2) // Called 1st
```

**Solution:**
```javascript
// Ensure order matches actual call sequence
mockUnwrap
  .mockResolvedValueOnce(data2) // 1st call
  .mockResolvedValueOnce(data1) // 2nd call
```

---

## 🐛 Debugging Tips

### 1. Check Rendered HTML
```javascript
import { screen } from '@testing-library/react'

// See what's actually rendered
screen.debug()

// See specific element
screen.debug(screen.getByRole('button'))

// See with full element tree
screen.debug(undefined, Infinity)
```

### 2. Check Available Queries
```javascript
// See all available roles
screen.logTestingPlaygroundURL()

// See what queries are available
import { prettyDOM } from '@testing-library/react'
console.log(prettyDOM(screen.getByRole('dialog')))
```

### 3. Check Mock Calls
```javascript
console.log('Mock called:', mockFn.mock.calls)
console.log('Call count:', mockFn.mock.calls.length)
console.log('First call args:', mockFn.mock.calls[0])
```

### 4. Use Test ID Fallback
```javascript
// In component
<div data-testid="reward-card">...</div>

// In test
screen.getByTestId('reward-card')
```

---

## 📊 Coverage Requirements

### Minimum Coverage Targets
- **Utils:** 90%+ (Pure functions, easy to test)
- **Hooks:** 80%+ (Business logic critical)
- **Components:** 75%+ (UI can have edge cases)
- **Pages:** 60%+ (Integration tests)

### What to Prioritize
1. **Critical paths:** Redemption flow, point calculations
2. **Error handling:** All error states should be tested
3. **User interactions:** All clickable elements
4. **Edge cases:** Empty states, null values, large numbers
5. **Accessibility:** ARIA roles, keyboard navigation

### What Can Be Skipped
- Pure UI styling (visual regression better)
- Third-party library internals
- Mock implementations
- Constants/configs
- Type definitions

---

## 🎓 Best Practices

### DO ✅
- Clear test descriptions: `it('should display error when API fails')`
- One assertion per test (when possible)
- Use `beforeEach` for setup
- Mock external dependencies
- Test user behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility
- Keep tests independent

### DON'T ❌
- Test implementation details
- Use `setTimeout` instead of `waitFor`
- Share state between tests
- Make tests dependent on each other
- Test third-party libraries
- Skip error cases
- Forget to cleanup mocks
- Use `.only()` in committed code

---

## 📞 Need Help?

1. **Check this guide** for common patterns
2. **Read error messages** carefully - they're usually descriptive
3. **Check test files** yang sudah ada sebagai reference
4. **Review main documentation** di `REWARDS_TEST_FIXES.md`
5. **Debug step by step** dengan `screen.debug()`

---

## 🎉 Summary

Testing rewards feature adalah tentang:
- ✅ Ensuring user flows work correctly
- ✅ Catching bugs before production
- ✅ Documenting expected behavior
- ✅ Enabling confident refactoring
- ✅ Maintaining code quality

**Happy Testing! 🚀**
