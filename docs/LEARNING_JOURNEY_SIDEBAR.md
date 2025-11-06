# Learning Journey Sidebar - Phase 2 Complete ✅

## Overview

Phase 2 of the Learning Journey refactor has successfully implemented a modern, clean sidebar navigation system to replace the complex 1486-line `LearningPages/index.jsx` component.

## Components Created

### 1. **ModuleItem Component**

**Path**: `/src/features/journey/components/ModuleItem.jsx`

**Purpose**: Display individual modules in the sidebar with status indicators

**Features**:

- ✅ Status indicators (Completed ✓, Unlocked, Locked 🔒)
- ✅ Module numbering with translations
- ✅ Category badges
- ✅ Active state highlighting (blue border + background)
- ✅ Locked module prevention (no navigation)
- ✅ Responsive text truncation
- ✅ Mobile-friendly sizing

**Props**:

```typescript
interface ModuleItemProps {
  module: {
    id: string
    fullname: string
    summary: string // Module number
    is_complete: 0 | 1
    isopen: 0 | 1 // Lock status
    category?: string
  }
  journeyId: string
  courseId: string
  isMobile?: boolean
}
```

**Status Logic**:

- `is_complete === 1` → Green checkmark, completed state
- `isopen === 1 && !completed` → Yellow background, unlocked
- `isopen === 0 && !completed` → Gray background, locked (not clickable)

**Styling**:

- Active: `bg-blue-50 border-l-4 border-blue-500`
- Completed: `module-completed` (light green)
- Unlocked: `module-unlocked` (light yellow)
- Locked: `module-locked` (gray, opacity-60)

---

### 2. **CourseItem Component**

**Path**: `/src/features/journey/components/CourseItem.jsx`

**Purpose**: Collapsible course item showing progress and module list

**Features**:

- ✅ Course name with tooltip (auto-truncation)
- ✅ Progress counter (completed/total modules)
- ✅ Module list rendering (sorted by number)
- ✅ Supporting modules section
- ✅ Loading skeleton for modules
- ✅ Empty state handling
- ✅ Mobile course numbering ("COURSE 1")

**Props**:

```typescript
interface CourseItemProps {
  course: {
    id: string
    name: string
    total_completed: number
    total_module: number
  }
  modules?: Module[]
  supportModules?: Module[]
  journeyId: string
  isActive?: boolean
  isMobile?: boolean
  isLoading?: boolean
  courseIndex: number
}
```

**Module Sorting**:

1. Modules with numeric `summary` → sorted ascending
2. Modules without numbers → appended after numbered ones
3. Supporting modules → shown separately below with divider

**Rendering States**:

- **Loading**: Shows 3 skeleton items
- **Empty**: "No modules available" message
- **Data**: ModuleItem components + optional supporting modules section

---

### 3. **JourneySidebar Component**

**Path**: `/src/features/journey/components/JourneySidebar.jsx`

**Purpose**: Main sidebar container with course/module navigation tree

**Features**:

- ✅ Ant Design `Sider` with responsive breakpoints
- ✅ Ant Design `Collapse` for course expansion
- ✅ Auto-expand current course from URL
- ✅ Sticky header with "Course List" title
- ✅ Scroll overflow handling
- ✅ Hidden DOM elements for tooltip calculations (compatibility)
- ✅ Course change callback for parent components

**Props**:

```typescript
interface JourneySidebarProps {
  courses?: Course[]
  modulesByCourse?: Record<string, Module[]>
  supportModulesByCourse?: Record<string, Module[]>
  isLoading?: boolean
  onCourseChange?: (courseId: string) => void
}
```

**Layout**:

```
┌─────────────────────────┐
│   Course List (Sticky)  │
├─────────────────────────┤
│ ▼ Course 1              │
│   Module 1 ✓            │
│   Module 2 🔒           │
│   Module 3              │
│                         │
│ ▶ Course 2              │
│                         │
│ ▼ Course 3              │
│   Module 1              │
│   ...                   │
└─────────────────────────┘
```

**Responsive**:

- Desktop: `280px` fixed width
- Scaling mode: `20vw`
- Mobile: `100%` width
- Collapsed on small screens (`lg` breakpoint)

---

## Hooks Created

### 1. **useJourneySidebarData**

**Path**: `/src/features/journey/hooks/useSidebarData.js`

**Purpose**: Fetch and manage sidebar data (courses + modules)

**Features**:

- ✅ TanStack Query integration
- ✅ Lazy module loading (only for active course)
- ✅ 5-minute stale time
- ✅ Organized data by course ID

**API Calls**:

1. `GET /journey/{journeyId}/courses` → All courses
2. `GET /journey/{journeyId}/course/{courseId}/modules` → Modules when course expanded

**Returns**:

```typescript
{
  courses: Course[]
  modulesByCourse: Record<string, Module[]>
  supportModulesByCourse: Record<string, Module[]>
  isLoading: boolean
  error: Error | null
  activeCourseId: string | null
  setActiveCourseId: (id: string) => void
}
```

---

### 2. **useSidebarNavigation**

**Path**: `/src/features/journey/hooks/useSidebarData.js`

**Purpose**: Handle navigation state and auto-scroll

**Features**:

- ✅ Track active course/module from URL
- ✅ Auto-scroll to active module (smooth scroll)
- ✅ 300ms delay for DOM render

**Returns**:

```typescript
{
  activeCourseId: string
  activeModuleId: string
  scrollToModule: string | null
}
```

---

## Layouts Created

### **LearningJourneyLayout**

**Path**: `/src/features/journey/layouts/LearningJourneyLayout.jsx`

**Purpose**: Main layout wrapper for Learning Journey with sidebar + content

**Features**:

- ✅ Ant Design `Layout` component
- ✅ JourneySidebar integration
- ✅ React Router `Outlet` for nested routes
- ✅ Error boundary for data fetch failures
- ✅ Loading state (Spin component)
- ✅ Context passing to child routes

**Layout Structure**:

```jsx
<Layout>
  <JourneySidebar ... />
  <Content>
    <Outlet context={{ courses, modulesByCourse }} />
  </Content>
</Layout>
```

**Error Handling**:

- Network errors → Show error message with details
- Loading states → Centered spinner

**Context Passed to Children**:

```typescript
{
  courses: Course[]
  modulesByCourse: Record<string, Module[]>
  supportModulesByCourse: Record<string, Module[]>
}
```

---

## API Service

### **learningJourneyAPI**

**Path**: `/src/services/api/learningJourney.js`

**Endpoints Implemented**:

| Method | Endpoint                                | Purpose                     |
| ------ | --------------------------------------- | --------------------------- |
| GET    | `/journey`                              | Get all journeys            |
| GET    | `/journey/{id}`                         | Get journey detail          |
| GET    | `/journey/{id}/courses`                 | Get courses for journey     |
| GET    | `/journey/{id}/course/{id}/modules`     | Get modules for course      |
| GET    | `/journey/{id}/course/{id}/module/{id}` | Get module detail           |
| POST   | `/journey/start`                        | Mark module as started      |
| POST   | `/journey/completion`                   | Mark module as completed    |
| POST   | `/journey/progress`                     | Update module progress      |
| GET    | `/journey/scorm/{moduleId}`             | Get SCORM content URL       |
| GET    | `/check_rating/{moduleId}`              | Check if module has rating  |
| POST   | `/achievement/check_badge`              | Check if user earned badges |

**Auth**: All requests include `TOKEN` header from localStorage

---

## Styling (Tailwind CSS)

### Custom Classes Added to `tailwind.css`:

```css
/* Journey Sidebar */
.journey-sidebar .ant-layout-sider {
  background: white;
}

/* Course Collapse Styling */
.journey-course-collapse .ant-collapse-item {
  border: none;
  border-radius: 8px;
  margin-bottom: 8px;
}

.journey-course-collapse .ant-collapse-header {
  padding: 12px 16px !important;
  background: #f9fafb;
  border-radius: 8px !important;
  transition: all 0.2s;
}

.journey-course-collapse .ant-collapse-header:hover {
  background: #f3f4f6;
}

.journey-course-collapse .ant-collapse-item-active .ant-collapse-header {
  background: #eff6ff;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 8px 8px 0 0 !important;
}

/* Module States */
.module-completed {
  background-color: #f0fdf4; /* Light green */
}

.module-unlocked {
  background-color: #fefce8; /* Light yellow */
}

.module-locked {
  background-color: #f9fafb; /* Light gray */
}

/* Course Active State */
.course-active .title-course {
  color: #123fa0;
  font-weight: 600;
}
```

---

## Translations Added

### English (`/src/localize/en/translation.json`):

```json
{
  "common": {
    "loading": "Loading"
  },
  "feature": {
    "feature_mylj": {
      "side_dpd": {
        "course_list": "Course List",
        "no_modules": "No modules available",
        "no_courses": "No courses available",
        "supporting_modules": "Supporting Modules"
      }
    }
  }
}
```

### Indonesian (`/src/localize/id/translation.json`):

```json
{
  "common": {
    "loading": "Memuat"
  },
  "feature": {
    "feature_mylj": {
      "side_dpd": {
        "course_list": "Daftar Kursus",
        "no_modules": "Tidak ada modul tersedia",
        "no_courses": "Tidak ada kursus tersedia",
        "supporting_modules": "Modul Pendukung"
      }
    }
  }
}
```

---

## Comparison: Old vs New

| Aspect               | Old (LearningPages/index.jsx)        | New (Phase 2)               |
| -------------------- | ------------------------------------ | --------------------------- |
| **Lines of Code**    | 1,486 lines                          | ~400 lines (3 components)   |
| **State Management** | 15+ `useState` hooks                 | TanStack Query + 2 states   |
| **DOM Manipulation** | Heavy (tooltip calculations, scroll) | Minimal (auto-scroll only)  |
| **Styling**          | Inline styles + CSS classes          | Tailwind utility classes    |
| **Dependencies**     | Moment.js, manual state sync         | date-fns, React Query       |
| **Readability**      | ❌ Very complex                      | ✅ Clean, modular           |
| **Testability**      | ❌ Hard to test                      | ✅ Easy to unit test        |
| **Mobile Support**   | ✅ Yes (complex logic)               | ✅ Yes (responsive classes) |
| **Performance**      | ⚠️ Re-renders often                  | ✅ Optimized with Query     |

---

## Migration from Old Code

### Key Changes:

1. **Tooltip Calculation**:
   - **Old**: Complex DOM measurement with hidden spans
   - **New**: Ant Design `Tooltip` with `mouseEnterDelay`

2. **Module Sorting**:
   - **Old**: Complex string parsing and sorting
   - **New**: Clean array sort with number detection

3. **Active State Management**:
   - **Old**: Manual DOM class manipulation
   - **New**: React state + CSS classes

4. **Data Fetching**:
   - **Old**: Redux + manual API calls
   - **New**: TanStack Query with caching

5. **Collapse Management**:
   - **Old**: Manual state sync with URL
   - **New**: `useEffect` syncing `courseId` param → `activeKeys`

---

## Usage Example

### In Route Configuration:

```jsx
import { LearningJourneyLayout } from '@/features/journey/layouts'

const routes = [
  {
    path: '/journey/:journeyId',
    element: <LearningJourneyLayout />,
    children: [
      { index: true, element: <JourneyDetailPage /> },
      { path: 'course/:courseId', element: <CourseDetailPage /> },
      {
        path: 'course/:courseId/module/:moduleId',
        element: <ModuleDetailPage />,
      },
    ],
  },
]
```

### Accessing Outlet Context:

```jsx
import { useOutletContext } from 'react-router-dom'

function JourneyDetailPage() {
  const { courses, modulesByCourse } = useOutletContext()

  return (
    <div>
      <h1>Journey Details</h1>
      {/* Use courses data */}
    </div>
  )
}
```

---

## Testing Checklist

### Manual Testing:

- [x] Sidebar renders with courses
- [x] Course collapses expand/collapse correctly
- [x] Modules load when course expanded
- [x] Active course/module highlighted
- [x] Locked modules are not clickable
- [x] Completed modules show checkmark
- [x] Supporting modules appear below divider
- [x] Tooltips appear on hover
- [x] Mobile responsive (sidebar collapses)
- [x] Loading states show skeleton
- [x] Empty states show messages
- [x] Translations work (EN/ID)

### Unit Testing (TODO Phase 8):

- [ ] ModuleItem renders all status states
- [ ] CourseItem sorts modules correctly
- [ ] JourneySidebar auto-expands from URL
- [ ] useJourneySidebarData fetches data
- [ ] useSidebarNavigation scrolls to module

---

## Performance Optimizations

1. **Lazy Module Loading**: Modules only fetched when course expanded
2. **Query Caching**: 5-minute stale time reduces API calls
3. **Memoization**: CourseItem only re-renders when props change
4. **Virtualization** (Future): For journeys with 100+ modules

---

## Known Limitations

1. **Hidden DOM Elements**: Still uses hidden spans for tooltip calculations (compatibility with original)
2. **No Virtualization**: May be slow with 100+ modules in one course
3. **Manual Scroll**: Auto-scroll uses `setTimeout` (could use `IntersectionObserver`)

---

## Next Steps (Phase 3)

✅ **Phase 2 Complete**: Sidebar navigation

⏭️ **Phase 3 Next**: Journey Detail Page

- JourneyDetailPage component
- JourneyHeader (image, title, badges)
- JourneyDescription
- JourneyStats (progress, course count)
- CourseList grid component
- useJourneyDetail hook

**Estimated Effort**: 3-4 days

---

## Files Summary

### Created (9 files):

1. `/src/features/journey/components/ModuleItem.jsx`
2. `/src/features/journey/components/CourseItem.jsx`
3. `/src/features/journey/components/JourneySidebar.jsx`
4. `/src/features/journey/hooks/useSidebarData.js`
5. `/src/features/journey/layouts/LearningJourneyLayout.jsx`
6. `/src/features/journey/layouts/index.js`
7. `/src/services/api/learningJourney.js`
8. `/docs/LEARNING_JOURNEY_SIDEBAR.md` (this file)

### Modified (5 files):

1. `/src/features/journey/components/index.js` (added exports)
2. `/src/features/journey/hooks/index.js` (added exports)
3. `/src/styles/tailwind.css` (added sidebar styles)
4. `/src/localize/en/translation.json` (added translations)
5. `/src/localize/id/translation.json` (added translations)

---

## Lessons Learned

1. **Incremental Refactoring**: Breaking down 1486 lines into focused components is much cleaner
2. **TanStack Query Power**: Caching and loading states handled automatically
3. **Tailwind v4**: Modern utility-first CSS makes styling fast
4. **Component Composition**: Small, focused components are easier to test and maintain
5. **Translations Early**: Adding i18n from the start prevents tech debt

---

**Status**: ✅ Phase 2 Complete  
**Date**: January 2025  
**Next Phase**: Journey Detail Page (Phase 3)
