# Content Library Refactor - Comprehensive Analysis

## Overview

Content Library adalah fitur untuk menampilkan daftar learning content yang tersedia di platform, dengan 2 tab utama:

1. **Content Library Tab** - Menampilkan academy/learning programs yang tersedia
2. **Collection Tab** - Menampilkan program/course/module yang telah disimpan user

## Old Implementation Structure

### Main Files

```
ContentLibrary/
├── index.jsx (270 lines) - Main container dengan tabs
├── hooks/
│   └── useActions.js (40 lines) - Get notifications
├── tabcontents/
│   ├── Library/
│   │   ├── index.jsx (270 lines) - Content Library tab content
│   │   ├── hooks/useActions.js - Fetch academy data
│   │   └── styles.js - Inline styles
│   └── Collection/
│       ├── index.jsx (430 lines) - Collection tab content
│       ├── hooks/useActions.js - Fetch & delete collection
│       └── styles.js - Inline styles
└── pages/
    ├── Academy/ - Academy detail pages
    └── LearningLibraryPages/ - Learning journey pages
```

### Key Features

#### 1. Content Library Tab

- **Display**: Grid of academy cards (desktop) atau list (mobile)
- **Card Info**:
  - Thumbnail image
  - Academy name
  - Description
  - Total programs count
  - "Enter" button
- **Navigation**: Click card → `/content-library/academy/:id`
- **Empty State**: "No content available yet"

#### 2. Collection Tab

- **Filter Options** (Radio buttons):
  - All
  - Program
  - Course
  - Module
- **Card Info**:
  - Type badge (PROGRAM/COURSE/MODULE)
  - Completion badge (if completed)
  - Thumbnail
  - Title
  - Description
  - "Enter" button
  - Delete icon (desktop only)
- **Actions**:
  - Delete from collection
  - Navigate to content detail
- **Empty States**:
  - No collection: "You have no collection"
  - Filter empty: "No [programs/courses/modules] found"

### API Endpoints (Old)

```javascript
// From repositories.js

// 1. Get Academies (Content Library)
GET /content-library
Response: [
  {
    id: number,
    name: string,
    note: string,
    thumbnail: string,
    total_program: number
  }
]

// 2. Get Collections
GET /collection?filter=all|journey|course|module
Response: [
  {
    id: number,
    type: "journey"|"course"|"module",
    name: string (journey/course) | fullname: string (module),
    description: string,
    thumbnail: string,
    content_library_id: number,
    journey_id: number,
    course_id: number (for course/module),
    is_completed_collection: 0|1
  }
]

// 3. Delete Collection
DELETE /collection/:id?type=journey|course|module
Response: { status: 200, message: "success" }

// 4. Get Notifications (Content Library)
GET /notification/type?type=content_library
Response: notification data
```

### Component Behavior

#### Desktop Layout

- **Tabs**: Positioned at top with 22px font size
- **Filter Radio**: Absolute positioned top-right (only on Collection tab when has data)
- **Cards**: Grid with gap, max-width 228px per card
- **Card Style**:
  - Image: 228x156px
  - Padding: 16px
  - Border radius on image
  - "Enter" button at bottom
  - Delete icon on Collection cards

#### Mobile Layout

- **Tabs**: 14px font size
- **Filter Radio**: Below tabs, horizontal scroll (only on Collection tab when has data)
- **Cards**: Full width list
- **Card Style**:
  - Horizontal layout
  - Image: 124x144px (Library) or 124x107px (Collection)
  - Text on right side
  - Click entire card to navigate
  - No delete button (swipe action in future?)

### State Management

```javascript
// Main States
- activeTab: 'contentlibrary' | 'collection'
- filter: 'allcl' | 'programcl' | 'coursecl' | 'modulecl'
- hideRadio: boolean - Show/hide filter based on data availability
- dataFilterAllLength: number - Total items in 'all' filter

// Loading States
- loadingContentLibrary: boolean
- loadingCollection: boolean
- loadingDelete: boolean

// Data States
- contentLibData: array of academies
- collectionData: array of collections
```

### Navigation Flow

```
/content-library
├── Tab: Content Library
│   └── Card Click → /content-library/academy/:academyId
│       └── (Academy detail pages)
└── Tab: Collection
    └── Card Click → Based on type:
        ├── Journey → /content-library/academy/:academyId/journey/:journeyId
        ├── Course → /content-library/academy/:academyId/journey/:journeyId/course/:courseId
        └── Module → /content-library/academy/:academyId/journey/:journeyId/course/:courseId/module/:moduleId
```

### Styling Patterns

**Colors:**

- Primary: ColorPrimary (from constant)
- Card Background: backgroundCard
- Text Title Mobile: colorTextTitleMobile
- Completion Badge: Green background
- Delete Icon: Red on hover

**Responsive Breakpoints:**

- isMobileVersion prop dari parent

**Typography:**

- Font Family: Roboto
- Desktop Title: 22px
- Mobile Title: 14px
- Program Name: Bold, 2-line ellipsis
- Description: 2-line ellipsis

### Complex Logic

#### 1. Hide/Show Filter Radio

```javascript
// Show radio when:
- activeTab === 'collection'
- dataFilterAllLength > 0 (has any collection)

// Hide radio when:
- activeTab === 'contentlibrary'
- No collection data
```

#### 2. Dynamic Empty States

```javascript
// Based on filter value:
- allcl → "You have no collection"
- programcl → "No programs found"
- coursecl → "No courses found"
- modulecl → "No modules found"

// Each has different message for mobile (split into 2 lines)
```

#### 3. Collection Delete with DOM Manipulation

```javascript
// After delete API success:
1. Remove card from DOM using ref-note-collection
2. Count remaining cards
3. If no cards left:
   - If availableAllCollectionLength === 0 → Show "no collection"
   - If filter !== 'allcl' → Show filter-specific empty state
```

#### 4. Type-based Content Display

```javascript
// checkType(type, element, data)
// Returns different data based on type:
- journey: name, description, thumbnail
- course: name, description, thumbnail
- module: fullname, description, thumbnail (no thumbnail in API)
```

### Issues in Old Code

1. **Direct DOM Manipulation**: Uses querySelector, innerHTML manipulation
2. **Inline Styles**: All styles in styles.js objects, not reusable
3. **No Date Formatting**: (Not heavily used in this feature)
4. **Tight Coupling**: Components depend on parent state
5. **Large Files**: Main components >250 lines
6. **Redundant Code**: Desktop & mobile render logic duplicated

## Refactor Goals

### Architecture

1. **RTK Query API Layer**: contentLibraryApi.js
   - getAcademies()
   - getCollections(filter)
   - deleteCollection(id, type)
2. **Custom Hooks**:
   - useAcademies() - Fetch academies with loading
   - useCollections(filter) - Fetch collections with filter
   - useDeleteCollection() - Delete mutation with optimistic update

3. **Utilities**:
   - collectionUtils.js - checkType, getNavigationPath helper
   - emptyStateUtils.js - Get empty state text based on filter

4. **Reusable Components**:
   - AcademyCard.jsx - For Content Library tab
   - CollectionCard.jsx - For Collection tab
   - CollectionFilter.jsx - Radio button filter
   - EmptyState.jsx - Generic empty state
   - ContentLibraryTabs.jsx - Tab container

### Component Structure

```
src/pages/content-library/
├── ContentLibraryPage.jsx - Main page with tabs
├── components/
│   ├── AcademyCard.jsx
│   ├── CollectionCard.jsx
│   ├── CollectionFilter.jsx
│   ├── EmptyState.jsx
│   └── DeleteConfirmModal.jsx
├── hooks/
│   ├── useAcademies.js
│   ├── useCollections.js
│   └── useDeleteCollection.js
├── utils/
│   ├── collectionUtils.js
│   └── emptyStateUtils.js
└── index.js - Barrel export
```

### Key Improvements

1. **Remove DOM Manipulation**: Use React state & conditional rendering
2. **Tailwind CSS**: Replace all inline styles
3. **Optimistic Updates**: Delete collection without page reload
4. **Better Empty States**: Conditional rendering based on data
5. **Responsive**: Mobile-first with responsive classes
6. **Clean Code**: <150 lines per component
7. **Type Safety**: PropTypes or TypeScript interfaces

### Data Flow

```
ContentLibraryPage
├── Tab: Content Library
│   ├── useAcademies() → AcademyCard (grid/list)
│   └── EmptyState (if no data)
└── Tab: Collection
    ├── CollectionFilter (if has data)
    ├── useCollections(filter) → CollectionCard (grid/list)
    ├── useDeleteCollection() → DeleteConfirmModal
    └── EmptyState (filter-based message)
```

## Implementation Plan

### Phase 1: API & Utilities (30 mins)

- [ ] Create contentLibraryApi.js with 3 endpoints
- [ ] Create collectionUtils.js (checkType, getNavigationPath)
- [ ] Create emptyStateUtils.js (getEmptyStateText)

### Phase 2: Hooks (30 mins)

- [ ] Create useAcademies.js
- [ ] Create useCollections.js
- [ ] Create useDeleteCollection.js

### Phase 3: Components (1.5 hours)

- [ ] AcademyCard.jsx (desktop & mobile variants)
- [ ] CollectionCard.jsx (with delete action)
- [ ] CollectionFilter.jsx (radio buttons)
- [ ] EmptyState.jsx (with icon + message)
- [ ] DeleteConfirmModal.jsx

### Phase 4: Main Page (1 hour)

- [ ] ContentLibraryPage.jsx (tabs + layout)
- [ ] Integrate all components
- [ ] Handle tab switching
- [ ] Handle filter state

### Phase 5: Testing & Review (30 mins)

- [ ] Test both tabs
- [ ] Test filter functionality
- [ ] Test delete collection
- [ ] Test navigation
- [ ] Compare with old version
- [ ] Test responsive behavior

**Total Estimated Time: 3.5-4 hours**

## Success Criteria

- ✅ All API calls use RTK Query
- ✅ Zero inline styles (100% Tailwind)
- ✅ No direct DOM manipulation
- ✅ Components <150 lines each
- ✅ Filter works correctly
- ✅ Delete with optimistic update
- ✅ Same UX as old version
- ✅ Responsive (mobile & desktop)
- ✅ Clean code, well-organized
