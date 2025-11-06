# Learning Journey Refactor - Complete Documentation

## Overview

Refactored Learning Journey feature dengan modern patterns, reusable components, dan Tailwind v4.

## 📁 File Structure

```
moleawiz-web-refactor/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── Badge.jsx              # Reusable badge component (NEW, Deadline, Overdue)
│   │       ├── FilterRadio.jsx        # Radio filter component
│   │       └── index.js
│   ├── features/
│   │   └── journey/
│   │       ├── components/
│   │       │   ├── JourneyCard.jsx    # Journey card component (desktop & mobile)
│   │       │   └── index.js
│   │       └── hooks/
│   │           ├── useJourneyFilters.js  # Custom hook untuk filtering & sorting
│   │           └── index.js
│   ├── pages/
│   │   └── journey/
│   │       └── LearningJourneyPage.jsx  # Main journey page
│   ├── utils/
│   │   └── journeyHelpers.js           # Helper functions
│   └── styles/
│       └── tailwind.css                # Custom Tailwind classes
```

## 🎯 Key Changes

### 1. **Component Architecture**

#### Before:

- Monolithic component dengan inline styling
- Logic tercampur dengan UI
- Tidak ada separation of concerns

#### After:

- **Reusable Components**: Badge, FilterRadio, JourneyCard
- **Custom Hooks**: useJourneyFilters untuk data management
- **Utility Functions**: journeyHelpers untuk pure logic
- **Clean separation**: UI, Logic, dan Data layer terpisah

### 2. **State Management**

#### Before:

```javascript
// Manual state dengan useEffect
const [catJourney, setCatJourney] = useState([])
const [filterState, setFilterState] = useState('')
```

#### After:

```javascript
// Custom hook dengan memoization
const { allJourneys, filterByCategory } = useJourneyFilters(
  listJourney,
  loading
)
```

### 3. **Styling Approach**

#### Before:

```javascript
// Inline styles object
const styles = {
  cardLearningJourney: {
    padding: 0,
    boxShadow: '3px 0 16px rgba(0, 0, 0, 0.1)',
  },
}
```

#### After:

```jsx
// Tailwind CSS classes
<div className="flex flex-col p-3.5 gap-2">
```

**Custom Tailwind Classes**:

```css
.journey-card {
  box-shadow: 3px 0 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
```

### 4. **Date Handling**

#### Before:

```javascript
// moment.js
import moment from 'moment'
let duration = moment.duration(thisDay.diff(endDateDay))
```

#### After:

```javascript
// date-fns (modern, tree-shakeable)
import { parseISO, differenceInDays, isAfter } from 'date-fns'
const daysRemaining = differenceInDays(endDate, today)
```

## 📦 Components Detail

### 1. Badge Component

**Location**: `src/components/ui/Badge.jsx`

**Purpose**: Reusable badge untuk menampilkan status (NEW, Deadline, Overdue)

**Props**:

```typescript
{
  variant: 'new' | 'deadline' | 'overdue' | 'custom'
  children: ReactNode
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}
```

**Usage**:

```jsx
<Badge variant="deadline" position="top-left">
  5 days left
</Badge>
```

### 2. FilterRadio Component

**Location**: `src/components/ui/FilterRadio.jsx`

**Purpose**: Radio button filter untuk kategori journey

**Props**:

```typescript
{
  onChange: (value: string) => void
  defaultValue?: string
  isMobile?: boolean
}
```

**Usage**:

```jsx
<FilterRadio
  onChange={handleFilterChange}
  defaultValue="all"
  isMobile={false}
/>
```

### 3. JourneyCard Component

**Location**: `src/features/journey/components/JourneyCard.jsx`

**Purpose**: Card untuk menampilkan journey dengan responsive design

**Props**:

```typescript
{
  journey: {
    id: string | number
    name: string
    description?: string
    thumbnail?: string
    is_new: number
    is_completed: number
    days_left?: number | 'overdue'
    badge_new?: boolean
    module_completed: number
    total_module: number
    course?: Array
  }
  isMobile?: boolean
  index?: number
}
```

**Features**:

- Desktop: 228px width dengan action button
- Mobile: Full width, entire card clickable
- Auto badges (NEW, Deadline, Overdue)
- Progress calculation
- Fallback image support

## 🔧 Custom Hooks

### useJourneyFilters

**Location**: `src/features/journey/hooks/useJourneyFilters.js`

**Purpose**: Handle filtering, sorting, dan enrichment data journey

**Returns**:

```typescript
{
  isLoading: boolean
  allJourneys: Journey[]
  filterByCategory: (category: string) => Journey[]
  categories: {
    all: Journey[]
    ongoing: Journey[]
    new: Journey[]
    finish: Journey[]
  }
}
```

**Logic**:

1. **Enrichment**: Add badges, calculate days_left
2. **Sorting**: Overdue → Urgent → Normal
3. **Categorization**: All, Ongoing, New, Finished
4. **Memoization**: Optimal re-render dengan useMemo

## 🛠️ Utility Functions

### journeyHelpers.js

**Location**: `src/utils/journeyHelpers.js`

**Functions**:

1. **calculateProgress(completed, total)**: Calculate percentage
2. **getButtonConfig(isNew, isCompleted, t)**: Get button styling
3. **getProgressColor(completed, total)**: Get progress bar color
4. **formatDaysLeft(daysLeft, t)**: Format countdown text
5. **getEmptyStateMessage(filterState)**: Get empty state message
6. **countCourses(journey)**: Count courses in journey
7. **formatCourseCount(count, t)**: Format course count text

## 🎨 Tailwind Custom Classes

### Journey Card Styles

```css
.journey-card {
  box-shadow: 3px 0 16px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.journey-card:hover {
  transform: translateY(-2px);
  box-shadow: 3px 2px 20px rgba(0, 0, 0, 0.15);
}
```

### Filter Radio Styles

```css
.radio-button-my-learning-journey .ant-radio-button-wrapper {
  min-width: 92px;
  text-align: center;
  border-color: #123fa0;
  border-radius: 50px;
}
```

## 📱 Responsive Design

### Desktop (≥768px)

- Grid layout with 228px cards
- Filter radio inline dengan title
- Action button visible di setiap card
- Hover effects active

### Mobile (<768px)

- Full-width cards
- Horizontal layout (image kiri, content kanan)
- Entire card clickable (tanpa button)
- Compact filter radio

**Implementation**:

```jsx
const { isMobile } = useResponsive()

<div className={`flex ${isMobile ? 'flex-row' : 'flex-col'} w-full`}>
```

## 🔄 Migration Guide

### From Old to New

**Old Pattern**:

```jsx
import styles from './styles'
const cardStyle = styles.cardLearningJourney
<Card style={cardStyle}>...</Card>
```

**New Pattern**:

```jsx
<JourneyCard journey={journey} isMobile={isMobile} />
```

### Breaking Changes

- ✅ No breaking changes - fully backward compatible
- ✅ Context API tetap sama
- ✅ Routing tetap sama (`/my-learning-journey`)

## ✅ Testing Checklist

- [x] Desktop layout renders correctly
- [x] Mobile layout renders correctly
- [x] Filter buttons work (All, Ongoing, New, Completed)
- [x] Badges display correctly (NEW, Deadline, Overdue)
- [x] Progress calculation accurate
- [x] Empty states show proper messages
- [x] Card hover effects work
- [x] Links navigate correctly
- [x] Responsive breakpoints tested
- [x] Loading states handled

## 📊 Performance Improvements

1. **Memoization**: useMemo untuk expensive calculations
2. **Tree-shaking**: date-fns instead of moment.js
3. **CSS-in-CSS**: Tailwind classes instead of inline styles
4. **Component Reusability**: Reduce duplicate code

## 🚀 Next Steps

1. Add unit tests untuk helpers
2. Add integration tests untuk components
3. Add Storybook documentation
4. Implement skeleton loaders
5. Add error boundaries
6. Optimize images with lazy loading

## 📝 Notes

- All colors dari `config/constant/color`
- All translations dari i18n
- Icons dari Ant Design
- Images dari assets folder
- Default fallback image available

---

**Last Updated**: October 31, 2025  
**Refactored By**: AI Assistant  
**Status**: ✅ Complete & Production Ready
