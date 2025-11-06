# Profile Feature - Comprehensive Analysis & Audit

**Date:** 2 November 2025  
**Feature:** Profile Page  
**Status:** ✅ Code Review Complete

---

## 📊 Executive Summary

### Feature Overview

Profile feature menampilkan informasi user dengan:

- **User Info Card** - Avatar, name, role, username, registered date
- **Profile Tabs** - Certificates, Programs, Achievements, Additional Certificates
- **Export Function** - Export profile to PDF
- **Profile Picture Upload** - Change user avatar

### Architecture Quality

- ✅ **RTK Query** - Modern data fetching
- ✅ **Custom Hooks** - Clean separation of concerns
- ✅ **Utility Functions** - Reusable formatters & processors
- ✅ **Component-based** - Modular, maintainable structure
- ⚠️ **PropTypes** - MISSING (needs to be added)
- ⚠️ **Semantic HTML** - PARTIAL (needs improvement)

---

## 🗂️ Feature Structure

```
src/pages/profile/
├── ProfilePage.jsx                    # Main page component
├── components/
│   ├── UserProfileCard.jsx           # User info card with avatar
│   ├── ProfileTabs.jsx               # Tab container
│   ├── CertificateList.jsx          # Certificate grid + modal
│   ├── ProgramList.jsx              # Program grid + modal
│   ├── AchievementList.jsx          # Badge grid + modal
│   └── AdditionalCertificateList.jsx # Wrapper for CertificateList
├── hooks/
│   ├── useProfileData.js            # Main data fetching hook
│   └── useExportProfile.js          # PDF export functionality
└── utils/
    ├── dataProcessing.js            # Data transformation utils
    └── formatters.js                # Date & text formatters
```

**Total Files:** 11 (1 page + 6 components + 2 hooks + 2 utils)

---

## 🔍 Code Quality Analysis

### 1. ProfilePage.jsx ✅

**Purpose:** Main container page

**Code Quality:**

```jsx
✅ Clean component structure
✅ Proper hook usage (useProfileData, useExportProfile)
✅ Loading state handling
✅ Props properly passed to children
❌ NO PropTypes validation
⚠️  Uses generic div wrapper (should be semantic)
⚠️  Missing h1 for page title (uses div)
```

**Issues Identified:**

1. **Semantic HTML:** Not using semantic tags (section, article, header)
2. **PropTypes:** Missing entirely
3. **Page Title:** h1 should be used instead of div
4. **Main tag:** Correctly NOT using `<main>` (already in layout)

**Recommended Changes:**

```jsx
// Current (BAD)
<div className="min-h-screen bg-gray-50 p-10">
  <div className="mb-5">
    <h1 className="text-[22px] font-medium text-gray-800">...</h1>
  </div>
  ...
</div>

// Improved (GOOD)
<div className="min-h-screen bg-gray-50 p-10">
  <header className="mb-5">
    <h1 className="text-[22px] font-medium text-gray-800">...</h1>
  </header>

  <section aria-label="User Profile Information">
    <UserProfileCard ... />
  </section>

  <section aria-label="Profile Content Tabs">
    <ProfileTabs ... />
  </section>
</div>
```

---

### 2. UserProfileCard.jsx ⚠️

**Purpose:** Display user avatar, info, and export button

**Code Quality:**

```jsx
✅ Good component structure
✅ Uses useRef for file input
✅ Proper event handlers
✅ i18n support
✅ Utility functions for formatting
❌ NO PropTypes validation
⚠️  Generic div wrapper (should be article/section)
⚠️  No semantic structure for user info
⚠️  Avatar change has no accessibility feedback
```

**Data Flow:**

- Receives: `user`, `profileDetail`, `onPictureChange`, `onExport`, loading states
- Displays: Avatar with upload, user info (name, role, username, date)
- Actions: Upload picture, export profile

**Issues:**

1. **PropTypes:** Missing
2. **Semantic HTML:** Using divs instead of semantic tags
3. **Accessibility:**
   - File input hidden but needs better label
   - Avatar change success/error feedback missing
   - Export button needs aria-label

**Recommended Changes:**

```jsx
// Add PropTypes
UserProfileCard.propTypes = {
  user: PropTypes.object,
  profileDetail: PropTypes.object,
  onPictureChange: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  isExporting: PropTypes.bool,
  isChangingPicture: PropTypes.bool,
}

// Improve semantic HTML
<article className="rounded-lg bg-white p-10..." aria-label="User Profile Card">
  <div className="flex items-center justify-between">
    <section className="flex items-center" aria-label="User Information">
      {/* Avatar */}
      {/* User details */}
    </section>

    <aside aria-label="Profile Actions">
      {/* Export button */}
    </aside>
  </div>
</article>
```

---

### 3. ProfileTabs.jsx ✅

**Purpose:** Tab container for certificates, programs, achievements

**Code Quality:**

```jsx
✅ Clean tab structure
✅ Ant Design Tabs properly used
✅ i18n for tab labels
✅ Props properly passed to children
❌ NO PropTypes validation
⚠️  Generic div wrapper
```

**Issues:**

1. **PropTypes:** Missing
2. **Semantic HTML:** Could use nav for tabs, section for content

---

### 4. CertificateList.jsx ⚠️

**Purpose:** Display certificate grid with view/download modal

**Code Quality:**

```jsx
✅ Good grid layout
✅ Modal for certificate detail
✅ File download functionality
✅ Loading & empty states
✅ Proper event handlers
❌ NO PropTypes validation
⚠️  Generic div wrapper
⚠️  No semantic structure for grid items
⚠️  FileSaver used directly (good)
```

**Features:**

- Grid display (responsive: 1/2/3 columns)
- Click to view certificate
- Download button in modal
- Fallback image handling

**Issues:**

1. **PropTypes:** Missing
2. **Semantic HTML:** Grid items should be articles
3. **Accessibility:**
   - Cards need aria-label
   - Modal needs aria-describedby
   - Download button needs better label

---

### 5. ProgramList.jsx ⚠️

**Purpose:** Display completed programs with detail modal

**Code Quality:**

```jsx
✅ Good grid layout (4 columns)
✅ Modal with program details
✅ Date formatting
✅ Pluralization for points/courses
✅ Loading & empty states
❌ NO PropTypes validation
⚠️  Generic div wrapper
⚠️  No semantic structure
```

**Features:**

- Program cards with thumbnail
- Detail modal with description
- Points earned display
- Course count
- Completed date

**Issues:**

1. **PropTypes:** Missing
2. **Semantic HTML:** Cards should be articles with proper headers
3. **Fixed height:** `.h-[35px]` on title might cut text

---

### 6. AchievementList.jsx ⚠️

**Purpose:** Display badges/achievements grid

**Code Quality:**

```jsx
✅ Grid layout (6 columns)
✅ Modal for badge detail
✅ Fallback image
✅ Loading & empty states
❌ NO PropTypes validation
⚠️  Generic div wrapper
⚠️  No semantic structure
```

**Features:**

- Badge images (120x120)
- Click to view details
- Module name, received date
- Description in modal

**Issues:**

1. **PropTypes:** Missing
2. **Semantic HTML:** Badge items should be figures with figcaption
3. **Accessibility:** Badge names need better structure

---

### 7. AdditionalCertificateList.jsx ✅

**Purpose:** Wrapper for additional certificates

**Code Quality:**

```jsx
✅ Simple wrapper component
✅ Reuses CertificateList (DRY principle)
❌ NO PropTypes validation
```

---

## 🔧 Hooks Analysis

### useProfileData.js ✅

**Purpose:** Centralized data fetching for profile

**Quality:**

```jsx
✅ RTK Query hooks properly used
✅ useMemo for processed data
✅ Proper skip conditions
✅ Combined loading states
✅ Error handling
✅ Mutation for picture upload
```

**API Endpoints Used:**

1. `useGetProfileDetailQuery(userId)` - Profile details
2. `useGetAchievementsQuery()` - Badges
3. `useGetCertificatesQuery()` - Certificates
4. `useGetCompletedJourneyProfileQuery()` - Completed programs
5. `useGetAdditionalCertificatesQuery(userId)` - Extra certificates
6. `useChangeProfilePictureMutation()` - Upload avatar

**Data Processing:**

- `sortCertificates()` - Sort by date
- `filterCompletedJourney()` - Filter completed only

**Return Values:**

```javascript
{
  // Processed data
  profileDetail,
  achievements,
  certificates,
  completedJourneys,
  additionalCertificates,
  user,

  // Loading states
  isLoading, isLoadingDetail, isLoadingAchievements,
  isLoadingCertificates, isLoadingJourneys, isLoadingAdditional,
  isChangingPicture,

  // Actions
  handlePictureChange,

  // Error
  errorDetail,
}
```

**Issues:** ✅ No issues - well structured

---

### useExportProfile.js ⚠️

**Purpose:** Export profile to PDF

**Quality:**

```jsx
✅ Loading state management
✅ Error handling
✅ Token from utils
✅ Locale support
⚠️  Direct baseUrl import (should use RTK Query)
⚠️  FileSaver.saveAs with URL (may not work for auth)
```

**Current Implementation:**

```javascript
const exportUrl = `${baseUrl}/profile/export?token=${token}&lang=${locale}`
FileSaver.saveAs(exportUrl, `profile-${Date.now()}.pdf`)
```

**Issues:**

1. **Authentication:** Token in URL query param (not ideal)
2. **Should use RTK Query:** There's `exportProfile` endpoint in API but not used
3. **Error handling:** FileSaver may fail silently

**Recommended:**

```javascript
// Use RTK Query endpoint
const [exportProfile, { isLoading }] = useLazyExportProfileQuery()

const handleExport = async () => {
  try {
    const blob = await exportProfile({ token, lang: locale }).unwrap()
    FileSaver.saveAs(blob, `profile-${Date.now()}.pdf`)
  } catch (error) {
    // Handle error
  }
}
```

---

## 🛠️ Utility Functions Analysis

### dataProcessing.js ✅

**Functions:**

1. **sortCertificates(certificates)** ✅
   - Sorts by `recived`/`received` date (newest first)
   - Uses date-fns `compareDesc`
   - Handles string and Date objects
   - Safe: returns empty array if no data

2. **filterCompletedJourney(journeys)** ✅
   - Filters: `is_new === 0 && is_completed === 1`
   - Sorts by `completed_date` (newest first)
   - Safe: returns empty array if no data

3. **groupCertificatesByJourney(certificates)** ⚠️
   - Groups by `journey_id`
   - **Not used anywhere** (dead code?)

4. **calculateTotalPoints(achievements)** ⚠️
   - Sums `point` field from achievements
   - **Not used anywhere** (dead code?)

5. **filterAchievementsByType(achievements, type)** ⚠️
   - Filters by `type` field
   - **Not used anywhere** (dead code?)

**Issues:**

- 3 unused functions (dead code)
- Missing unit tests

---

### formatters.js ✅

**Functions:**

1. **formatProfileDate(date, locale, formatStr)** ✅
   - Uses date-fns for formatting
   - Locale support (id/en)
   - Safe: returns '-' if no date
   - Default format: 'dd MMMM yyyy'

2. **getUserInitial(firstname)** ✅
   - Gets first letter of name
   - Safe: returns '?' if no name
   - Uses `Array.from()` for emoji safety

3. **getFullName(user)** ⚠️
   - Combines firstname + lastname
   - **Not used anywhere** (dead code?)

4. **formatEmptyValue(value, fallback)** ✅
   - Returns fallback for null/undefined/empty
   - Default fallback: '-'
   - Used in UserProfileCard

**Issues:**

- 1 unused function (dead code)
- Missing unit tests

---

## 📡 API Integration Analysis

### profileApi.js ✅

**Endpoints:**

| Endpoint                     | Method | Purpose       | Tags                   | Transform        |
| ---------------------------- | ------ | ------------- | ---------------------- | ---------------- |
| `getProfileDetail`           | GET    | User profile  | ProfileDetail          | -                |
| `getAchievements`            | GET    | Badges        | Achievements           | -                |
| `getCertificates`            | GET    | Certificates  | Certificates           | ✅ Flatten array |
| `getCompletedJourneyProfile` | GET    | Programs      | CompletedJourney       | -                |
| `getAdditionalCertificates`  | GET    | Extra certs   | AdditionalCertificates | -                |
| `changeProfilePicture`       | POST   | Upload avatar | ProfileDetail, User    | -                |
| `exportProfile`              | GET    | PDF export    | -                      | Blob response    |

**Quality:**

```jsx
✅ baseApi.injectEndpoints (proper pattern)
✅ provideTags for cache invalidation
✅ transformResponse for getCertificates (flattens nested array)
✅ responseHandler for blob (exportProfile)
✅ invalidatesTags on mutation
```

**Transform Response Example:**

```javascript
transformResponse: (response) => {
  // Input: [{ certificates: [...] }, { certificates: [...] }]
  // Output: [...all certificates flattened]
  return [].concat(...response.map(({ certificates }) => certificates || []))
}
```

**Issues:** ✅ No issues - well implemented

---

## 🎨 Styling Analysis

### Tailwind Usage ✅

- Consistent utility classes
- Responsive breakpoints (md:, lg:)
- Grid layouts (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Shadow utilities
- Hover effects (hover:scale-105)

### Ant Design Components ✅

- Avatar - Profile picture
- Button - Actions (upload, export, download)
- Modal - Detail views
- Image - With fallback
- Tabs - Profile tabs
- Card - Certificate/Program cards

**No Issues** - Good balance between Tailwind and Ant Design

---

## 🚨 Issues Summary

### Critical Issues (Must Fix)

1. ❌ **NO PropTypes** - All components missing validation
2. ⚠️ **Semantic HTML** - Using divs instead of semantic tags
3. ⚠️ **Dead Code** - 4 unused utility functions

### Medium Issues (Should Fix)

4. ⚠️ **useExportProfile** - Should use RTK Query endpoint
5. ⚠️ **Accessibility** - Missing ARIA labels, feedback
6. ⚠️ **Fixed Heights** - Some text truncation without ellipsis

### Low Issues (Nice to Have)

7. 💡 **Unit Tests** - No tests exist yet
8. 💡 **Error Boundaries** - No error boundary component
9. 💡 **Loading Skeletons** - Using simple "Loading..." text

---

## ✅ Strengths

1. **Clean Architecture** - Hooks, utils, components well separated
2. **RTK Query** - Modern data fetching with cache
3. **Reusability** - AdditionalCertificateList reuses CertificateList
4. **i18n** - Full translation support
5. **Date Formatting** - Proper locale handling
6. **Responsive** - Grid layouts adapt to screen size
7. **Error Handling** - Try/catch in mutations
8. **Loading States** - All data fetching has loading

---

## 📋 Refactoring Checklist

### Phase 1: PropTypes (1-2 hours)

- [ ] Add PropTypes to ProfilePage
- [ ] Add PropTypes to UserProfileCard
- [ ] Add PropTypes to ProfileTabs
- [ ] Add PropTypes to CertificateList
- [ ] Add PropTypes to ProgramList
- [ ] Add PropTypes to AchievementList
- [ ] Add PropTypes to AdditionalCertificateList

### Phase 2: Semantic HTML (2-3 hours)

- [ ] ProfilePage: Add header, section tags
- [ ] UserProfileCard: Use article, section structure
- [ ] ProfileTabs: Add nav for tab bar
- [ ] CertificateList: Use article for cards
- [ ] ProgramList: Use article with header
- [ ] AchievementList: Use figure + figcaption
- [ ] Add ARIA labels throughout

### Phase 3: Clean Up (1 hour)

- [ ] Remove unused functions from dataProcessing.js
- [ ] Remove unused functions from formatters.js
- [ ] Fix useExportProfile to use RTK Query
- [ ] Add error feedback for avatar upload

### Phase 4: Unit Tests (4-6 hours)

- [ ] Test ProfilePage
- [ ] Test UserProfileCard
- [ ] Test ProfileTabs
- [ ] Test CertificateList
- [ ] Test ProgramList
- [ ] Test AchievementList
- [ ] Test useProfileData hook
- [ ] Test useExportProfile hook
- [ ] Test dataProcessing utils
- [ ] Test formatters utils

---

## 🎯 Recommendations

### Immediate Actions

1. **Add PropTypes** - Critical for type safety
2. **Semantic HTML** - Improve accessibility and SEO
3. **Remove Dead Code** - Clean up unused functions
4. **Fix Export Hook** - Use RTK Query properly

### Future Improvements

1. **Add Loading Skeletons** - Better UX than "Loading..."
2. **Add Error Boundary** - Catch component errors gracefully
3. **Add Success Toasts** - Feedback for avatar upload
4. **Optimize Images** - Lazy loading, srcset for responsive
5. **Add Analytics** - Track export downloads, badge views

---

## 📊 Comparison with Old Version

**Note:** Old version not accessible in current workspace

**Assumptions based on refactored code:**

- ✅ **New:** RTK Query (vs old manual fetch)
- ✅ **New:** Custom hooks (vs inline logic)
- ✅ **New:** Utility functions (vs duplicate code)
- ✅ **New:** Tailwind (vs inline styles?)
- ✅ **New:** Better file structure (vs monolithic?)
- ❌ **Both:** No PropTypes
- ❌ **Both:** Generic HTML structure

**Verdict:** New version architecture is superior, but needs PropTypes and semantic HTML

---

## 🎓 Learning Points

### Good Patterns Observed

1. **Hook Composition** - useProfileData combines multiple queries
2. **Data Processing** - Separate utils for transformation
3. **Component Reuse** - AdditionalCertificateList wraps CertificateList
4. **RTK Query Tags** - Proper cache invalidation

### Anti-patterns to Avoid

1. **Missing PropTypes** - Type safety gap
2. **Dead Code** - Unused utility functions
3. **Direct baseUrl** - Should use configured API
4. **Generic Divs** - Missing semantic meaning

---

**Analysis Complete**  
**Next Steps:** Add PropTypes → Semantic HTML → Unit Tests  
**Estimated Total Time:** 8-12 hours for complete refactoring
