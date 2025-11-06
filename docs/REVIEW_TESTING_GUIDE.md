# Review Feature - Testing Implementation Guide

## Phase 2-5 Testing Roadmap

**Status:** Phase 2 In Progress (20% → 100%)  
**Date:** November 5, 2025

---

## Completed Tests ✅

### Utils (107 tests - ALL PASSING)
- ✅ formatters.test.js (42 tests)
- ✅ dataProcessing.test.js (42 tests)
- ✅ localStorage.test.js (23 tests)

### Hooks (20 tests - IN PROGRESS)
- ✅ useModulesData.test.js (8 tests)
- ✅ useUserSubmissions.test.js (12 tests)
- 🔄 useSubmissionReview.test.js (NEXT)
- 🔄 useReviewSubmission.test.js (NEXT)

---

## Phase 2: Hooks Tests (Remaining)

### File: useSubmissionReview.test.js (10 tests)

**Test Cases:**
```javascript
describe('useSubmissionReview', () => {
  // Initial state
  ✓ should return initial state with empty reviews
  ✓ should return loading state initially
  
  // Fetch current submission
  ✓ should fetch current submission successfully
  ✓ should process current review data
  ✓ should handle current fetch error
  
  // Fetch previous submission  
  ✓ should fetch previous submission successfully
  ✓ should process previous review data
  
  // Fetch both submissions
  ✓ should fetch both submissions simultaneously
  ✓ should count review decisions correctly
  
  // Reset functionality
  ✓ should reset review data
})
```

### File: useReviewSubmission.test.js (10 tests)

**Test Cases:**
```javascript
describe('useReviewSubmission', () => {
  // Form management
  ✓ should initialize form instance
  ✓ should generate correct form key
  
  // localStorage operations
  ✓ should load saved form data
  ✓ should save form data on change
  ✓ should clear form data on success
  
  // Submission
  ✓ should submit review successfully
  ✓ should handle submit error
  ✓ should call onSuccess callback
  ✓ should call onError callback
  
  // Status decision
  ✓ should set status decision correctly
})
```

**Implementation Pattern:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { reviewApi } from '@/services/api/reviewApi'
import { useSubmissionReview } from '../../hooks/useSubmissionReview'

// Mock localStorage
beforeEach(() => {
  global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  }
})

// Test implementation...
```

---

## Phase 3: Components Tests (95 tests)

### Small Components (8-10 tests each)

#### 1. ModuleCard.test.jsx (10 tests)
```javascript
✓ should render module information
✓ should display thumbnail with fallback
✓ should show module name and journey name
✓ should format deadline correctly
✓ should show need review count
✓ should call onClick when clicked
✓ should show delete icon when deletable
✓ should call onDelete when delete clicked
✓ should apply active styling
✓ should render mobile layout correctly
```

#### 2. UserCard.test.jsx (8 tests)
```javascript
✓ should render user information
✓ should display submission number
✓ should format submission date
✓ should show correct status badge (need_review)
✓ should show approved badge with green color
✓ should show declined badge with red color
✓ should call onClick when clicked
✓ should not render if user hasn't submitted
```

#### 3. PreviousAnswerPopover.test.jsx (8 tests)
```javascript
✓ should render popover trigger (desktop)
✓ should render collapse (mobile)
✓ should display text answer correctly
✓ should display image answer correctly
✓ should toggle popover on click
✓ should change icon when opened
✓ should return null if no previous answer
✓ should handle file links
```

### Medium Components (10-12 tests each)

#### 4. ModuleList.test.jsx (10 tests)
```javascript
✓ should render list of modules
✓ should show loading state
✓ should show empty state message
✓ should auto-navigate to first module (desktop)
✓ should not auto-navigate on mobile
✓ should pass module data to ModuleCard
✓ should call onDeleteModule
✓ should render Card component (desktop)
✓ should render without Card (mobile)
✓ should handle modules without data gracefully
```

#### 5. UserList.test.jsx (10 tests)
```javascript
✓ should render filter radio buttons
✓ should show correct status counts
✓ should filter by need_review
✓ should filter by approved
✓ should filter by declined
✓ should show all users
✓ should display loading state in counts
✓ should show empty message
✓ should call onFilterChange
✓ should render mobile layout correctly
```

#### 6. ReviewModals.test.jsx (10 tests)
```javascript
// ModalCloseFormReview
✓ should render quit modal
✓ should call onClose when clicking No
✓ should call onConfirm when clicking Yes

// ModalIncompleteReview
✓ should render incomplete modal
✓ should call onClose when clicking OK

// ModalConfirmSubmitReview
✓ should render submit confirmation
✓ should display accept/reject counts
✓ should show approved/declined status

// ModalDeleteModule
✓ should render delete confirmation
✓ should display module name
```

### Complex Components (12-15 tests each)

#### 7. ReviewFormStage.test.jsx (12 tests)
```javascript
✓ should render question text
✓ should render text answer
✓ should render image answer
✓ should render file link answer
✓ should show previous answer popover
✓ should render accept/reject radio
✓ should render comment textarea
✓ should show character count
✓ should handle radio change
✓ should apply required validation on reject
✓ should render dividers correctly
✓ should open image modal on mobile
```

#### 8. ReviewPreview.test.jsx (10 tests)
```javascript
✓ should render user information
✓ should display overall feedback
✓ should show approved status badge
✓ should show declined status badge
✓ should render review stages
✓ should display accept/reject icons
✓ should show comments
✓ should render answers correctly
✓ should handle image zoom (mobile)
✓ should call onClose
```

#### 9. ReviewForm.test.jsx (15 tests)
```javascript
✓ should render form header
✓ should load saved form data
✓ should save form data on change
✓ should fetch current and previous submissions
✓ should render ReviewFormStage components
✓ should show overall feedback textarea
✓ should update placeholder when radio changes (accept)
✓ should update placeholder when radio changes (reject)
✓ should set required validation dynamically
✓ should call onSubmit on form submit
✓ should call onOpenIncompleteModal on validation fail
✓ should call onOpenSubmitModal with correct data
✓ should call onOpenQuitModal on close
✓ should reset form when modal closes
✓ should render mobile layout correctly
```

---

## Phase 4: Integration Tests (20 tests)

### File: ReviewPage.test.jsx

```javascript
describe('ReviewPage', () => {
  // Component rendering
  ✓ should render HomeTitle component
  ✓ should render ModuleList component
  ✓ should render UserList component (desktop)
  ✓ should not render UserList on mobile
  
  // Data loading
  ✓ should fetch modules on mount
  ✓ should show loading state
  ✓ should handle fetch error
  
  // User interactions
  ✓ should open review form when user clicked
  ✓ should open preview when reviewed user clicked
  ✓ should open delete modal when delete clicked
  
  // Modal management
  ✓ should open and close review form modal
  ✓ should open and close quit modal
  ✓ should open and close incomplete modal
  ✓ should open and close submit modal
  ✓ should open and close delete modal
  
  // Review submission
  ✓ should submit review successfully
  ✓ should handle submit error
  ✓ should invalidate cache after submit
  
  // Module deletion
  ✓ should delete module successfully
  ✓ should navigate after successful delete
})
```

**Test Pattern:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ReviewPage from '../ReviewPage'

// Mock all child components and hooks
vi.mock('../components/ModuleList', () => ({
  default: vi.fn(() => <div>ModuleList Mock</div>)
}))

// Test implementation...
```

---

## Testing Best Practices

### 1. Mock Patterns

**API Mocking:**
```javascript
vi.spyOn(reviewApi.endpoints.getModulesNeedReview, 'useQuery')
  .mockReturnValue({
    data: mockData,
    isLoading: false,
    isError: false,
  })
```

**Component Mocking:**
```javascript
vi.mock('../components/ModuleCard', () => ({
  default: vi.fn(({ module, onClick }) => (
    <div onClick={() => onClick(module)}>
      {module.module_name}
    </div>
  ))
}))
```

**localStorage Mocking:**
```javascript
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
```

### 2. Async Testing

**Wait for data:**
```javascript
await waitFor(() => {
  expect(result.current.modules).toHaveLength(2)
})
```

**User events:**
```javascript
await userEvent.click(screen.getByText('Submit'))
await userEvent.type(screen.getByLabelText('Comment'), 'Good work')
```

### 3. Assertion Patterns

**Component rendering:**
```javascript
expect(screen.getByText('Module Name')).toBeInTheDocument()
expect(screen.queryByText('Not Exists')).not.toBeInTheDocument()
```

**Function calls:**
```javascript
expect(mockOnClick).toHaveBeenCalledWith(expectedData)
expect(mockOnClick).toHaveBeenCalledTimes(1)
```

**State updates:**
```javascript
expect(result.current.filterStatus).toBe('approved')
expect(result.current.modules).toEqual(expectedModules)
```

---

## Execution Commands

### Run All Hooks Tests
```bash
npm test src/pages/review/__tests__/hooks --run
```
Expected: 40 tests passing

### Run All Components Tests
```bash
npm test src/pages/review/__tests__/components --run
```
Expected: 95 tests passing

### Run Integration Tests
```bash
npm test src/pages/review/__tests__/ReviewPage --run
```
Expected: 20 tests passing

### Run All Review Tests
```bash
npm test src/pages/review/__tests__ --run
```
Expected: 262 tests passing (100% when complete)

---

## Progress Tracking

```
Phase 1: Utils Tests         ████████████████████ 100% (107/107) ✅
Phase 2: Hooks Tests          ████████████░░░░░░░░  50% (20/40)  🔄
Phase 3: Components Tests     ░░░░░░░░░░░░░░░░░░░░   0% (0/95)   📋
Phase 4: Integration Tests    ░░░░░░░░░░░░░░░░░░░░   0% (0/20)   📋
─────────────────────────────────────────────────────────────────
Total Progress:               ████████░░░░░░░░░░░░  49% (127/262)
```

---

## Next Steps

1. **Immediate (Today)**
   - ✅ Complete useUserSubmissions.test.js
   - 🔄 Create useSubmissionReview.test.js
   - 🔄 Create useReviewSubmission.test.js
   - Target: Complete Phase 2 (40 hooks tests)

2. **This Week**
   - 📋 Create all 9 component tests
   - Target: Complete Phase 3 (95 component tests)

3. **Next Week**
   - 📋 Create ReviewPage integration test
   - Target: Complete Phase 4 (20 integration tests)

4. **Final**
   - 📋 Run all 262 tests
   - 📋 Generate coverage report
   - 📋 Update documentation
   - Target: 100% coverage achieved

---

**Document Status:** Active Implementation Guide  
**Last Updated:** November 5, 2025  
**Current Phase:** Phase 2 (Hooks) - 50% Complete
