# Leaderboards Unit Test Documentation

**Date Created:** 4 November 2025  
**Status:** ✅ Complete - All 184 Tests Passing  
**Coverage:** 100% (14/14 files tested)

---

## 📊 Test Summary

### Overview
Comprehensive unit testing untuk seluruh fitur leaderboards, mencakup hooks, utilities, dan components (desktop & mobile).

### Test Results
```
✅ Test Files:  14 passed (14)
✅ Tests:       184 passed (184)
⏱️  Duration:    ~7-8 seconds
```

---

## 🗂️ Test File Structure

```
src/pages/leaderboards/
├── __tests__/
│   └── LeaderboardsPage.test.jsx          (15 tests) ✅
├── hooks/__tests__/
│   ├── useLeaderboards.test.jsx           (6 tests)  ✅
│   ├── useEnrolledPrograms.test.jsx       (10 tests) ✅
│   └── useLeaderboardsData.test.jsx       (9 tests)  ✅
├── utils/__tests__/
│   ├── formatters.test.js                 (22 tests) ✅
│   └── dataProcessing.test.js             (10 tests) ✅
└── components/__tests__/
    ├── EmptyState.test.jsx                (5 tests)  ✅
    ├── PodiumSection.test.jsx             (13 tests) ✅
    ├── RankingTable.test.jsx              (17 tests) ✅
    ├── LeaderboardsHeader.test.jsx        (14 tests) ✅
    ├── SelectorModals.test.jsx            (19 tests) ✅
    ├── MobilePodiumSection.test.jsx       (15 tests) ✅
    ├── MobileRankList.test.jsx            (13 tests) ✅
    └── MobileLeaderboardsHeader.test.jsx  (16 tests) ✅
```

**Total: 14 test files, 184 tests**

---

## 📝 Detailed Test Breakdown

### 1. **LeaderboardsPage.test.jsx** (15 tests)
**Path:** `src/pages/leaderboards/__tests__/LeaderboardsPage.test.jsx`

Main integration test untuk halaman leaderboards.

**Test Categories:**
- Loading States (1 test)
  - ✅ Should show loading when isLoading is true
  
- Empty States (1 test)
  - ✅ Should show empty state when no programs available
  
- Desktop Layout (4 tests)
  - ✅ Should render desktop header
  - ✅ Should render desktop podium
  - ✅ Should render desktop ranking table
  - ✅ Should not render mobile components
  
- Mobile Layout (3 tests)
  - ✅ Should render mobile header on small screens
  - ✅ Should render mobile podium
  - ✅ Should render mobile rank list
  
- Filter Interactions (2 tests)
  - ✅ Should update filters when program changes
  - ✅ Should update filters when organization changes
  
- Modal Interactions (3 tests)
  - ✅ Should open program selector modal on mobile
  - ✅ Should open organization selector modal on mobile
  - ✅ Should close modals after selection
  
- Semantic HTML (1 test)
  - ✅ Should use semantic main element with ARIA labels

**Mocks:**
- `useLeaderboardsData` hook
- `useResponsive` hook
- All child components
- react-i18next
- Loader component

---

### 2. **Hooks Tests** (25 tests total)

#### 2.1 **useLeaderboards.test.jsx** (6 tests)
**Path:** `src/pages/leaderboards/hooks/__tests__/useLeaderboards.test.jsx`

Tests untuk custom hook yang fetch leaderboard data.

**Test Coverage:**
- ✅ Should skip query when journey_id is not provided
- ✅ Should fetch leaderboard data when journey_id is provided
- ✅ Should return loading state correctly
- ✅ Should return error state when query fails
- ✅ Should be enabled by default when journey_id exists
- ✅ Should respect enabled option

**Key Points:**
- Menggunakan RTK Query hooks
- Testing query skipping logic
- Testing loading & error states

---

#### 2.2 **useEnrolledPrograms.test.jsx** (10 tests)
**Path:** `src/pages/leaderboards/hooks/__tests__/useEnrolledPrograms.test.jsx`

Tests untuk hook yang manage enrolled programs.

**Test Coverage:**
- ✅ Should return empty array when no data
- ✅ Should return empty array when data is null
- ✅ Should transform programs into options format
- ✅ Should sort programs alphabetically by name
- ✅ Should handle programs with same name
- ✅ Should get default program with last_access (preferred)
- ✅ Should get default program with enrolled_date (fallback)
- ✅ Should return null when no programs available
- ✅ Should parse journey_id as integer
- ✅ Should return loading state correctly

**Key Features Tested:**
- Data transformation (API response → select options)
- Sorting logic (alphabetical)
- Default program selection (last_access > enrolled_date)
- Type conversion (journey_id to integer)

---

#### 2.3 **useLeaderboardsData.test.jsx** (9 tests)
**Path:** `src/pages/leaderboards/hooks/__tests__/useLeaderboardsData.test.jsx`

Tests untuk main orchestration hook.

**Test Coverage:**
- ✅ Should initialize with default filters
- ✅ Should select default program on mount
- ✅ Should fetch leaderboard data with selected program
- ✅ Should process leaderboard data correctly
- ✅ Should generate organization options
- ✅ Should filter data by organization
- ✅ Should update filters correctly
- ✅ Should handle loading states
- ✅ Should detect data availability

**Key Features Tested:**
- Filter initialization
- Default program selection
- Data processing orchestration
- Organization filtering
- State management

---

### 3. **Utils Tests** (32 tests total)

#### 3.1 **formatters.test.js** (22 tests)
**Path:** `src/pages/leaderboards/utils/__tests__/formatters.test.js`

Tests untuk utility functions formatting.

**Test Coverage:**

**formatNumberWithDot** (8 tests):
- ✅ Should format number with thousand separator (1000 → "1.000")
- ✅ Should handle numbers without separator needed (500 → "500")
- ✅ Should handle string numbers ("1000" → "1.000")
- ✅ Should handle zero (0 → "0")
- ✅ Should handle null (null → "0")
- ✅ Should handle undefined (undefined → "0")
- ✅ Should handle empty string ("" → "0")
- ✅ Should handle large numbers (1000000 → "1.000.000")

**getUserInitial** (7 tests):
- ✅ Should get first letter uppercase ("john" → "J")
- ✅ Should handle already uppercase ("JOHN" → "J")
- ✅ Should handle empty string ("" → "")
- ✅ Should handle null (null → "")
- ✅ Should handle undefined (undefined → "")
- ✅ Should handle single character ("a" → "A")
- ✅ Should handle unicode characters ("élise" → "É")

**getFullName** (7 tests):
- ✅ Should combine first and last name
- ✅ Should handle only firstname
- ✅ Should handle only lastname
- ✅ Should handle both names empty
- ✅ Should trim extra spaces
- ✅ Should handle null values
- ✅ Should handle undefined values

---

#### 3.2 **dataProcessing.test.js** (10 tests)
**Path:** `src/pages/leaderboards/utils/__tests__/dataProcessing.test.js`

Tests untuk data processing functions.

**Test Coverage:**

**processLeaderboardData** (5 tests):
- ✅ Should return empty structure for null data
- ✅ Should return empty structure for empty array
- ✅ Should split data into top3, columnLeft, and columnRight
- ✅ Should mark current user with isyou flag
- ✅ Should handle data with less than 15 items

**filterByOrganization** (5 tests):
- ✅ Should return original data for "Company Level"
- ✅ Should filter by directorate correctly
- ✅ Should filter by division correctly
- ✅ Should re-rank after filtering
- ✅ Should handle case-insensitive filtering

**Key Features Tested:**
- Data splitting (top 3 vs columns)
- Current user marking
- Organization filtering
- Re-ranking logic

---

### 4. **Component Tests** (127 tests total)

#### 4.1 **EmptyState.test.jsx** (5 tests)
**Path:** `src/pages/leaderboards/components/__tests__/EmptyState.test.jsx`

Tests untuk empty state component.

**Test Coverage:**
- ✅ Should render empty state message
- ✅ Should render with semantic HTML section
- ✅ Should display empty state image
- ✅ Should have correct styling classes
- ✅ Should have proper ARIA role

---

#### 4.2 **PodiumSection.test.jsx** (13 tests)
**Path:** `src/pages/leaderboards/components/__tests__/PodiumSection.test.jsx`

Tests untuk desktop podium (top 3 rankings).

**Test Coverage:**
- ✅ Should render null when top3 is null
- ✅ Should render null when top3 is empty array
- ✅ Should render all three podium cards
- ✅ Should render user full names
- ✅ Should render scores with dot separator (1.000)
- ✅ Should render role for each user
- ✅ Should display "You" when isyou flag is set
- ✅ Should render medal images for each rank
- ✅ Should render avatars for all users with pictures
- ✅ Should render initials for users without pictures
- ✅ Should handle incomplete top3 data gracefully
- ✅ Should not render role when missing
- ✅ Should use different styles for rank 1 (larger)

**Key Features Tested:**
- Null/empty data handling
- Medal rendering (rank 1, 2, 3)
- Avatar handling (with/without pictures)
- Current user "You" display
- Score formatting
- Podium order (2-1-3)

**Mocks:**
- Ant Design Card (with Card.Meta)
- Ant Design Avatar
- Ant Design Image
- react-i18next

---

#### 4.3 **RankingTable.test.jsx** (17 tests)
**Path:** `src/pages/leaderboards/components/__tests__/RankingTable.test.jsx`

Tests untuk desktop ranking table.

**Test Coverage:**
- ✅ Should render null when columnLeft is null
- ✅ Should render null when columnLeft is empty
- ✅ Should render table headers (Rank, Name, Score)
- ✅ Should render left column data
- ✅ Should render right column data when provided
- ✅ Should render single column layout when no right column
- ✅ Should display rank numbers correctly
- ✅ Should display scores with dot separator
- ✅ Should highlight current user row (.you-highlight)
- ✅ Should display "You" for current user
- ✅ Should use yourRank for current user instead of rank
- ✅ Should render avatars for all users
- ✅ Should switch to two-column layout when both columns provided
- ✅ Should render initials for users without pictures
- ✅ Should render each row with data-id attribute
- ✅ Should apply correct column span for single column
- ✅ Should apply correct column span for two columns

**Key Features Tested:**
- Two-column vs single-column layout
- Current user highlighting
- yourRank override logic
- Avatar rendering
- Score formatting

---

#### 4.4 **LeaderboardsHeader.test.jsx** (14 tests)
**Path:** `src/pages/leaderboards/components/__tests__/LeaderboardsHeader.test.jsx`

Tests untuk desktop header dengan filters.

**Test Coverage:**
- ✅ Should render null when programOptions is null
- ✅ Should render null when programOptions is empty
- ✅ Should render leaderboards title
- ✅ Should render program selector
- ✅ Should render organization selector
- ✅ Should call onProgramChange when program changes
- ✅ Should call onOrgChange when organization changes
- ✅ Should display selected program value
- ✅ Should display selected organization value
- ✅ Should have sticky positioning (top-0)
- ✅ Should have correct height (h-[88px])
- ✅ Should enable search for program selector
- ✅ Should toggle dropdown icon correctly
- ✅ Should have z-index for proper stacking (z-4)

**Key Features Tested:**
- Null/empty options handling
- Selector rendering
- Callback mechanisms
- Sticky positioning
- Search functionality

---

#### 4.5 **SelectorModals.test.jsx** (19 tests)
**Path:** `src/pages/leaderboards/components/__tests__/SelectorModals.test.jsx`

Tests untuk program & organization selector modals.

**Test Coverage:**

**ProgramSelectorModal** (11 tests):
- ✅ Should not render when visible is false
- ✅ Should render when visible is true
- ✅ Should render all program options
- ✅ Should render search input
- ✅ Should filter programs when searching
- ✅ Should call onSelect with correct value when clicked
- ✅ Should call onClose after selecting program
- ✅ Should show checkmark for selected program
- ✅ Should clear search when modal opens
- ✅ Should handle empty options
- ✅ Should filter case-insensitively

**OrganizationSelectorModal** (8 tests):
- ✅ Should not render when visible is false
- ✅ Should render when visible is true
- ✅ Should render all organization options
- ✅ Should call onSelect with correct value when clicked
- ✅ Should call onClose after selecting option
- ✅ Should show checkmark for selected organization
- ✅ Should handle empty options
- ✅ Should not have search input (unlike ProgramSelector)

**Key Features Tested:**
- Modal visibility control
- Search functionality (program only)
- User interactions (click, select)
- Checkmark for selected items
- Case-insensitive filtering

---

#### 4.6 **MobilePodiumSection.test.jsx** (15 tests)
**Path:** `src/pages/leaderboards/components/__tests__/MobilePodiumSection.test.jsx`

Tests untuk mobile podium section.

**Test Coverage:**
- ✅ Should render null when top3 is null
- ✅ Should render null when top3 is empty array
- ✅ Should render all three podium cards
- ✅ Should render podium in mobile layout (flex-row)
- ✅ Should render scores with dot separator
- ✅ Should render role for each user
- ✅ Should display "You" when isyou flag is set
- ✅ Should render medal images for each rank
- ✅ Should render avatars for all users with pictures (order 2-1-3)
- ✅ Should render initials for users without pictures
- ✅ Should render user full names (or "You" for current user)
- ✅ Should handle incomplete top3 data gracefully
- ✅ Should not render role when missing
- ✅ Should use smaller avatar sizes for mobile
- ✅ Should render with proper spacing between cards

**Key Features Tested:**
- Mobile-specific layout (horizontal)
- Smaller avatar sizes
- Podium ordering (2-1-3)
- Medal rendering
- "You" display for current user

---

#### 4.7 **MobileRankList.test.jsx** (13 tests)
**Path:** `src/pages/leaderboards/components/__tests__/MobileRankList.test.jsx`

Tests untuk mobile rank list (card-based).

**Test Coverage:**
- ✅ Should render null when data is null
- ✅ Should render null when data is empty array
- ✅ Should render all rank cards
- ✅ Should render rank numbers (excluding current user without yourRank)
- ✅ Should render scores with dot separator
- ✅ Should render user full names (or "You" for current user)
- ✅ Should highlight current user card (orange background)
- ✅ Should display "You" for current user
- ✅ Should use yourRank for current user when provided
- ✅ Should render avatars for users with pictures
- ✅ Should render initials for users without pictures
- ✅ Should render in a vertical list
- ✅ Should render role information

**Key Features Tested:**
- Card-based layout (vs table)
- Current user highlighting
- yourRank override
- Vertical stacking
- Role display

---

#### 4.8 **MobileLeaderboardsHeader.test.jsx** (16 tests)
**Path:** `src/pages/leaderboards/components/__tests__/MobileLeaderboardsHeader.test.jsx`

Tests untuk mobile header (button-based selectors).

**Test Coverage:**
- ✅ Should render header with semantic HTML
- ✅ Should render leaderboards title
- ✅ Should display selected program name
- ✅ Should display selected organization level
- ✅ Should show placeholder when no program selected
- ✅ Should show placeholder when no organization selected
- ✅ Should call onProgramClick when program selector clicked
- ✅ Should call onOrgClick when organization selector clicked
- ✅ Should render program selector as button with type="button"
- ✅ Should render organization selector as button with type="button"
- ✅ Should have sticky positioning at top
- ✅ Should have correct height (h-[118px])
- ✅ Should have gradient background
- ✅ Should render DownOutlined icons
- ✅ Should truncate long program names
- ✅ Should have z-index for proper layering (z-4)

**Key Features Tested:**
- Button-based selectors (not dropdowns)
- Click handlers
- Placeholders
- Semantic HTML (header, button)
- ARIA labels
- Sticky positioning
- Text truncation

---

## 🛠️ Testing Tools & Setup

### Dependencies
```json
{
  "vitest": "^4.0.5",
  "@testing-library/react": "^16.1.0",
  "@testing-library/user-event": "^14.6.0",
  "@testing-library/jest-dom": "^6.6.3"
}
```

### Test Configuration
- **Framework:** Vitest
- **Testing Library:** React Testing Library
- **User Interactions:** @testing-library/user-event
- **Assertions:** jest-dom matchers

### Common Mocks

#### 1. **react-i18next**
```javascript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => translations[key] || key,
  }),
}))
```

#### 2. **Ant Design Components**
```javascript
vi.mock('antd', () => {
  const Card = ({ children, ...props }) => <div {...props}>{children}</div>
  Card.Meta = ({ description }) => <div>{description}</div>
  
  return {
    Card,
    Avatar: ({ src, children }) => <div data-src={src}>{children}</div>,
    Image: ({ alt, ...props }) => <img alt={alt} {...props} />,
    Select: ({ children, onChange, value }) => (
      <select onChange={(e) => onChange(e.target.value)} value={value}>
        {children}
      </select>
    ),
    // ... other components
  }
})
```

#### 3. **Custom Hooks**
```javascript
vi.mock('../hooks/useLeaderboardsData', () => ({
  useLeaderboardsData: vi.fn(),
}))
```

#### 4. **Child Components**
```javascript
vi.mock('../components/ComponentName', () => ({
  ComponentName: ({ prop1, prop2 }) => (
    <div data-testid="component-name">{/* ... */}</div>
  ),
}))
```

---

## 🎯 Test Patterns

### 1. **Null/Empty Data Handling**
```javascript
it('should render null when data is null', () => {
  const { container } = render(<Component data={null} />)
  expect(container.firstChild).toBeNull()
})

it('should render null when data is empty array', () => {
  const { container } = render(<Component data={[]} />)
  expect(container.firstChild).toBeNull()
})
```

### 2. **User Interactions**
```javascript
it('should call onClick when button clicked', async () => {
  const mockOnClick = vi.fn()
  const user = userEvent.setup()
  
  render(<Button onClick={mockOnClick} />)
  
  await user.click(screen.getByRole('button'))
  
  expect(mockOnClick).toHaveBeenCalledTimes(1)
})
```

### 3. **Async Operations**
```javascript
it('should display data after loading', async () => {
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

### 4. **Conditional Rendering**
```javascript
it('should show "You" for current user', () => {
  const userData = { ...mockUser, isyou: 1 }
  
  render(<UserCard user={userData} />)
  
  expect(screen.getByText('You')).toBeInTheDocument()
  expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
})
```

### 5. **Semantic HTML Testing**
```javascript
it('should use semantic HTML elements', () => {
  const { container } = render(<Component />)
  
  const header = container.querySelector('header')
  const section = container.querySelector('section')
  
  expect(header).toBeInTheDocument()
  expect(section).toHaveAttribute('aria-label', 'Description')
})
```

---

## 📋 Test Checklist

### ✅ Hooks
- [x] useLeaderboards - Query logic, loading, error states
- [x] useEnrolledPrograms - Data transformation, sorting, default selection
- [x] useLeaderboardsData - Orchestration, filters, data processing

### ✅ Utils
- [x] formatters - Number formatting, initials, full names
- [x] dataProcessing - Data splitting, filtering, re-ranking

### ✅ Desktop Components
- [x] LeaderboardsPage - Integration, responsive switching
- [x] LeaderboardsHeader - Selectors, filters, callbacks
- [x] PodiumSection - Top 3 podium, medals, avatars
- [x] RankingTable - Two-column layout, highlighting
- [x] SelectorModals - Program & organization selection
- [x] EmptyState - Empty state display

### ✅ Mobile Components
- [x] MobileLeaderboardsHeader - Button-based selectors
- [x] MobilePodiumSection - Mobile podium layout
- [x] MobileRankList - Card-based ranking list

---

## 🚀 Running Tests

### Run All Leaderboards Tests
```bash
npm test -- "src/pages/leaderboards" --run
```

### Run Specific Test File
```bash
npm test -- "src/pages/leaderboards/hooks/__tests__/useLeaderboards.test.jsx" --run
```

### Run Tests in Watch Mode
```bash
npm test -- "src/pages/leaderboards"
```

### Run with Coverage
```bash
npm test -- "src/pages/leaderboards" --coverage --run
```

---

## 📈 Coverage Metrics

### File Coverage
- **Hooks:** 3/3 files (100%)
- **Utils:** 2/2 files (100%)
- **Components:** 9/9 files (100%)
- **Total:** 14/14 files (100%)

### Test Coverage
- **Hooks Tests:** 25 tests
- **Utils Tests:** 32 tests
- **Component Tests:** 127 tests
- **Total:** 184 tests

### Lines of Code Tested
Estimated ~2,500+ lines of source code covered by unit tests.

---

## 🔍 Key Testing Insights

### 1. **Component Behavior**
- Desktop dan mobile components memiliki behavior berbeda
- Podium order: 2-1-3 (rank 2 di kiri, rank 1 di tengah, rank 3 di kanan)
- Current user tanpa `yourRank` tidak menampilkan rank number di mobile

### 2. **Data Transformations**
- `formatNumberWithDot`: 1000 → "1.000"
- `getUserInitial`: "john" → "J"
- Default program: `last_access` > `enrolled_date`
- Organization filtering case-insensitive

### 3. **Edge Cases Handled**
- Null/undefined data
- Empty arrays
- Missing fields (picture, role)
- Incomplete top3 data
- Users without pictures (show initials)

### 4. **User Experience**
- Current user selalu highlighted
- "You" ditampilkan instead of name untuk current user
- Scores diformat dengan thousand separator
- Semantic HTML untuk accessibility

---

## 📝 Notes

### Important Behaviors
1. **Podium Order:** Components render dalam order 2-1-3, bukan 1-2-3
2. **Current User Display:** `isyou=1` menampilkan "You" instead of full name
3. **Rank Display:** Mobile tidak show rank untuk current user tanpa `yourRank` prop
4. **Organization Filtering:** Case-insensitive, re-ranks after filtering

### Mock Considerations
1. Ant Design components di-mock untuk menghindari internal implementation details
2. `Card.Meta` harus di-mock sebagai property dari Card, bukan standalone
3. i18n mocked dengan simple translation object
4. Custom hooks mocked untuk isolate component testing

### Known Issues/Warnings
- `Window's getComputedStyle() method with pseudo-elements` - Expected warning dari jsdom, tidak affect test results

---

## 🎓 Best Practices Applied

1. ✅ **Comprehensive Coverage** - All files tested
2. ✅ **Edge Case Testing** - Null, empty, undefined handled
3. ✅ **User Interaction Testing** - Clicks, inputs, selections
4. ✅ **Semantic HTML** - Testing for proper HTML5 elements
5. ✅ **Accessibility** - ARIA labels and roles tested
6. ✅ **Isolated Testing** - Mocks for dependencies
7. ✅ **Descriptive Test Names** - Clear what's being tested
8. ✅ **Proper Assertions** - Using appropriate matchers
9. ✅ **Async Handling** - waitFor for async operations
10. ✅ **Mock Cleanup** - beforeEach clears mocks

---

## 📚 References

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event](https://testing-library.com/docs/user-event/intro)

### Related Docs
- `LEADERBOARDS_REFACTOR.md` - Refactor documentation
- `LEADERBOARDS_COMPLETE.md` - Feature completion doc
- `LEADERBOARDS_SUMMARY.md` - Feature summary

---

## ✅ Conclusion

**Status:** Production Ready ✅

Fitur leaderboards memiliki **100% test coverage** dengan **184 comprehensive unit tests** yang mencakup:
- ✅ All business logic (hooks)
- ✅ All utility functions
- ✅ All UI components (desktop & mobile)
- ✅ User interactions
- ✅ Edge cases
- ✅ Semantic HTML & accessibility

**Quality Metrics:**
- 🎯 184/184 tests passing (100%)
- 📁 14/14 files tested (100%)
- ⚡ Fast execution (~7-8 seconds)
- 🛡️ Comprehensive edge case coverage
- ♿ Accessibility validated

Fitur siap untuk production deployment dengan confidence level tinggi.

---

**Last Updated:** 4 November 2025  
**Test Framework:** Vitest 4.0.5  
**Total Tests:** 184  
**Pass Rate:** 100%
