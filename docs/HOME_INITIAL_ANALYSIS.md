# Home Feature Analysis - Initial Assessment

## Date: November 1, 2025

## 1. Folder Structure ✅

```
home/
├── HomePage.jsx (Main page)
└── components/
    ├── HomeTitleText.jsx
    ├── Banner/
    │   └── index.jsx
    ├── OngoingCourse/
    │   ├── index.jsx
    │   └── hooks/useActions.js
    ├── NewPrograms/
    │   ├── index.jsx
    │   └── hooks/useActions.js
    ├── ExpiringProgram/
    │   ├── index.jsx
    │   └── hooks/useActions.js
    ├── OngoingPrograms/
    │   ├── index.jsx
    │   └── hooks/useActions.js
    └── UpcomingEvents/
        ├── index.jsx
        └── hooks/useActions.js
```

## 2. API & Environment Configuration ✅

### Environment Variables (.env.example)

- `VITE_API_BASE_URL` - API base URL
- `VITE_API_TIMEOUT` - API timeout
- `VITE_CRYPTO_KEY` - Encryption key (32 bytes)
- `VITE_CRYPTO_IV` - Encryption IV (16 bytes)
- Other configs for Auth0, special dates, etc.

### API Implementation (homeApi.js)

Using RTK Query with proper endpoints:

- ✅ `getUserProfile` - Get user profile data
- ✅ `getAllJourneyData` - Get all journey data with transform
- ✅ `getOngoingCourses` - Get ongoing courses
- ✅ `getNewPrograms` - Get new programs
- ✅ `getExpiringPrograms` - Get expiring programs
- ✅ `getOngoingPrograms` - Get ongoing programs
- ✅ `getUpcomingEvents` - Get upcoming events
- ✅ Multiple mutations for ratings, badges, points, etc.

### Base API Configuration (baseApi.js)

- ✅ Uses RTK Query
- ✅ Proper authorization headers (Bearer token + TOKEN header)
- ✅ Content-Type set to application/json
- ✅ Token from Redux state or localStorage fallback
- ✅ Comprehensive tag types for cache invalidation

## 3. State Management ✅

### Redux Slice (homeSlice.js)

Clean implementation with:

- ✅ Proper initial state
- ✅ All necessary reducers (setJourneyData, setOngoingCourses, etc.)
- ✅ Loading and error states
- ✅ Modal states for Upcoming Events
- ✅ Layout states (isOneCol, isMobileVersion)
- ✅ Selectors exported

## 4. Components Analysis

### HomePage.jsx

**Current Issues:**

- ❌ Uses generic `<div>` instead of semantic HTML
- ❌ Should use `<main>` for main content
- ❌ Should use `<section>` for different content areas
- ⚠️ Loading state good but can be improved
- ⚠️ Hardcoded empty props (needs real data integration)

**Good Points:**

- ✅ Uses RTK Query hooks properly
- ✅ Proper loading state handling
- ✅ Clean component structure
- ✅ Tailwind CSS for styling

### Banner Component

**Current Issues:**

- ❌ Uses `<Col>` and generic `<div>`
- ❌ No PropTypes validation
- ❌ Should use `<section>` or `<header>`
- ⚠️ Carousel accessibility needs improvement

**Good Points:**

- ✅ Has PropTypes (basic)
- ✅ Responsive design
- ✅ Clean carousel implementation
- ✅ Proper image handling

### HomeTitleText Component

**Good Points:**

- ✅ Has complete PropTypes
- ✅ Loading state with Skeleton
- ✅ Responsive (mobile/desktop variants)
- ✅ Uses translation

**Issues:**

- ❌ Returns fragment, should be wrapped in semantic element
- ❌ Should use `<h1>` or `<header>`

### Other Components (OngoingCourse, NewPrograms, etc.)

**Common Issues:**

- ❌ All use generic `<div>` tags
- ❌ Missing semantic HTML5 (section, article, aside)
- ❌ Some missing PropTypes
- ❌ Complex components without proper structure
- ⚠️ Accessibility attributes missing

## 5. Code Quality Assessment

### ✅ Good Practices Found:

1. Uses RTK Query for data fetching
2. Proper separation of concerns (hooks, components, services)
3. Translation support (i18next)
4. Loading states handled
5. Tailwind CSS for consistent styling
6. PropTypes in some components

### ❌ Issues Found:

1. **Semantic HTML**: Almost no semantic HTML5 usage
2. **Accessibility**: Missing ARIA attributes, roles
3. **PropTypes**: Inconsistent - some components have it, others don't
4. **Component Structure**: Too many generic divs
5. **Hardcoded Data**: HomePage has hardcoded empty arrays/props
6. **No Unit Tests**: No test files found in home folder

## 6. Comparison with Old Version

### Old Version (moleawiz_web):

- Uses inline styles instead of Tailwind
- More complex state management
- Similar component structure
- Also lacks semantic HTML
- Has separate mobile components

### New Version (Better):

- ✅ Cleaner with Tailwind CSS
- ✅ Better API architecture (RTK Query)
- ✅ Cleaner state management (Redux Toolkit)
- ✅ More maintainable code
- ❌ Still needs semantic HTML
- ❌ Needs PropTypes everywhere
- ❌ Needs unit tests

## 7. Priority Actions Needed

### High Priority:

1. **Add Semantic HTML5** to all components
   - HomePage: use `<main>`, `<section>`
   - Banner: use `<section>` or `<header>`
   - All cards: use `<article>`
   - HomeTitleText: use `<h1>` or `<header>`

2. **Add PropTypes** to all components
   - OngoingCourse
   - NewPrograms
   - ExpiringProgram
   - OngoingPrograms
   - UpcomingEvents

3. **Add Accessibility**
   - ARIA labels
   - Proper roles
   - Keyboard navigation
   - Focus management

### Medium Priority:

4. **Create Unit Tests**
   - Component tests
   - Hook tests
   - Integration tests

5. **Fix Data Integration**
   - Remove hardcoded empty props in HomePage
   - Connect real data to components

### Low Priority:

6. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Memoization

## 8. Next Steps

1. Start with HomePage - convert to semantic HTML
2. Update HomeTitleText with semantic structure
3. Update Banner with semantic structure
4. Update all section components (OngoingCourse, NewPrograms, etc.)
5. Add PropTypes to all components
6. Add accessibility attributes
7. Create comprehensive unit tests
8. Validate with old version functionality

## Encryption Note

Need to verify if any encryption is used in home feature data flow.
From old version, encryption was mainly in:

- Authentication
- Sensitive user data
- API requests

Home feature seems to use standard API calls without special encryption.
Need to verify this assumption.
