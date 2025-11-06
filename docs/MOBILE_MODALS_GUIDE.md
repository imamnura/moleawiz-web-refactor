# Mobile Modals - Integration Guide

## Overview

Mobile modals (Drawers) untuk menampilkan detail Journey, Course, dan Module di perangkat mobile dengan UX yang optimal.

## Components Created

### 1. ModalJourneyDetailMobile

**Path:** `/src/features/journey/components/modals/ModalJourneyDetailMobile.jsx`

Bottom drawer untuk menampilkan journey detail di mobile.

**Props:**

```typescript
{
  open: boolean;           // Drawer visibility
  onClose: () => void;     // Close handler
  journey: Object;         // Journey data
  journeyId: string;       // Journey ID
}
```

**Features:**

- Full screen drawer (90% height)
- Journey thumbnail dengan badges (Days Left, Overdue)
- Stats (total courses, progress %)
- Description section
- Module completion info
- Action button (Start/View Courses)

**Usage:**

```jsx
import { ModalJourneyDetailMobile } from '@/features/journey/components'
import { useMobileModals } from '@/features/journey/hooks'

const MyComponent = () => {
  const { journeyModalOpen, openJourneyModal, closeJourneyModal } =
    useMobileModals()
  const journey = {
    /* journey data */
  }

  return (
    <>
      <Button onClick={openJourneyModal}>View Details</Button>

      <ModalJourneyDetailMobile
        open={journeyModalOpen}
        onClose={closeJourneyModal}
        journey={journey}
        journeyId={journey.id}
      />
    </>
  )
}
```

---

### 2. ModalCourseDetailMobile

**Path:** `/src/features/journey/components/modals/ModalCourseDetailMobile.jsx`

Bottom drawer untuk menampilkan course detail di mobile.

**Props:**

```typescript
{
  open: boolean;
  onClose: () => void;
  course: Object;          // Course data
  journeyId: string;
  courseId: string;
}
```

**Features:**

- Course thumbnail dengan completed badge
- Progress bar (essential modules)
- HTML description rendering
- Module summary
- Supporting modules count
- Action button (Start/Continue/View Modules)

**Usage:**

```jsx
import { ModalCourseDetailMobile } from '@/features/journey/components'

const CourseCard = ({ course }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card onClick={() => setOpen(true)}>{/* Card content */}</Card>

      <ModalCourseDetailMobile
        open={open}
        onClose={() => setOpen(false)}
        course={course}
        journeyId={journeyId}
        courseId={course.id}
      />
    </>
  )
}
```

---

### 3. ModalModuleDetailMobile

**Path:** `/src/features/journey/components/modals/ModalModuleDetailMobile.jsx`

Bottom drawer untuk menampilkan module detail di mobile.

**Props:**

```typescript
{
  open: boolean;
  onClose: () => void;
  module: Object;          // Module data
  journeyId: string;
  courseId: string;
  moduleId: string;
  onStart?: () => void;    // Start module handler
  onContinue?: () => void; // Continue module handler
}
```

**Features:**

- Status badge (Completed, Locked, In Progress)
- Module thumbnail (optional)
- Module info (category, duration, type)
- HTML content rendering
- Learning objectives list
- Action buttons (Start/Continue/Review/Locked)
- "View Full Details" link

**Usage:**

```jsx
import { ModalModuleDetailMobile } from '@/features/journey/components'

const ModuleItem = ({ module }) => {
  const [open, setOpen] = useState(false)

  const handleStart = () => {
    // Start module logic
    navigate(`/journey/${journeyId}/course/${courseId}/module/${moduleId}/play`)
  }

  return (
    <>
      <ListItem onClick={() => setOpen(true)}>{/* Module item */}</ListItem>

      <ModalModuleDetailMobile
        open={open}
        onClose={() => setOpen(false)}
        module={module}
        journeyId={journeyId}
        courseId={courseId}
        moduleId={module.id}
        onStart={handleStart}
        onContinue={handleStart}
      />
    </>
  )
}
```

---

### 4. useMobileModals Hook

**Path:** `/src/features/journey/hooks/useMobileModals.js`

Centralized hook untuk manage semua mobile modal states.

**Returns:**

```typescript
{
  // States
  journeyModalOpen: boolean;
  courseModalOpen: boolean;
  moduleModalOpen: boolean;

  // Journey handlers
  openJourneyModal: () => void;
  closeJourneyModal: () => void;

  // Course handlers
  openCourseModal: () => void;
  closeCourseModal: () => void;

  // Module handlers
  openModuleModal: () => void;
  closeModuleModal: () => void;

  // Utility
  closeAllModals: () => void;
}
```

**Usage:**

```jsx
import { useMobileModals } from '@/features/journey/hooks'

const JourneyPage = () => {
  const {
    journeyModalOpen,
    courseModalOpen,
    moduleModalOpen,
    openJourneyModal,
    closeJourneyModal,
    openCourseModal,
    closeCourseModal,
    openModuleModal,
    closeModuleModal,
    closeAllModals,
  } = useMobileModals()

  return (
    <div>
      {/* Journey List */}
      <JourneyCard onClick={openJourneyModal} />
      <ModalJourneyDetailMobile
        open={journeyModalOpen}
        onClose={closeJourneyModal}
        journey={journey}
        journeyId={journey.id}
      />

      {/* Course List */}
      <CourseCard onClick={openCourseModal} />
      <ModalCourseDetailMobile
        open={courseModalOpen}
        onClose={closeCourseModal}
        course={course}
        journeyId={journeyId}
        courseId={course.id}
      />

      {/* Module List */}
      <ModuleCard onClick={openModuleModal} />
      <ModalModuleDetailMobile
        open={moduleModalOpen}
        onClose={closeModuleModal}
        module={module}
        journeyId={journeyId}
        courseId={courseId}
        moduleId={module.id}
      />
    </div>
  )
}
```

---

## Integration Examples

### Example 1: Journey List Page with Modal

```jsx
import { useState } from 'react'
import { ModalJourneyDetailMobile } from '@/features/journey/components'
import { useResponsive } from '@/hooks/useResponsive'

const LearningJourneyPage = () => {
  const { isMobile } = useResponsive()
  const [selectedJourney, setSelectedJourney] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleCardClick = (journey) => {
    if (isMobile) {
      setSelectedJourney(journey)
      setModalOpen(true)
    } else {
      // Navigate to detail page for desktop
      navigate(`/journey/${journey.id}`)
    }
  }

  return (
    <>
      {journeys.map((journey) => (
        <JourneyCard
          key={journey.id}
          journey={journey}
          onClick={() => handleCardClick(journey)}
        />
      ))}

      {isMobile && (
        <ModalJourneyDetailMobile
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          journey={selectedJourney}
          journeyId={selectedJourney?.id}
        />
      )}
    </>
  )
}
```

### Example 2: Course List with Modal Trigger

```jsx
const CourseListItem = ({ course }) => {
  const { isMobile } = useResponsive()
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => {
    if (isMobile) {
      setModalOpen(true)
    } else {
      navigate(`/journey/${journeyId}/course/${course.id}`)
    }
  }

  return (
    <>
      <Card onClick={handleClick}>
        <h3>{course.name}</h3>
        <p>{course.description}</p>
      </Card>

      {isMobile && (
        <ModalCourseDetailMobile
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          course={course}
          journeyId={journeyId}
          courseId={course.id}
        />
      )}
    </>
  )
}
```

### Example 3: Module Item with Inline Action

```jsx
const ModuleItem = ({ module }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { startModule } = useModuleProgress()

  const handleStart = async () => {
    await startModule(module.id)
    navigate(
      `/journey/${journeyId}/course/${courseId}/module/${module.id}/play`
    )
  }

  return (
    <>
      <div onClick={() => setModalOpen(true)}>
        <ModuleIcon status={module.is_complete} />
        <span>{module.fullname}</span>
      </div>

      <ModalModuleDetailMobile
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        module={module}
        journeyId={journeyId}
        courseId={courseId}
        moduleId={module.id}
        onStart={handleStart}
        onContinue={handleStart}
      />
    </>
  )
}
```

---

## Responsive Behavior

### Mobile (xs breakpoint)

- **Show:** Bottom drawer (90% height)
- **Animation:** Slide up from bottom
- **Close:** Swipe down or close button
- **Scroll:** Internal scrolling dalam drawer

### Desktop/Tablet

- **Show:** Navigate to full page
- **No Modal:** Karena ada space untuk full content
- **Navigation:** React Router navigation

### Detection

```jsx
import { useResponsive } from '@/hooks/useResponsive'

const MyComponent = () => {
  const { isMobile } = useResponsive()

  return isMobile ? (
    <ModalJourneyDetailMobile {...props} />
  ) : (
    <Navigate to="/journey/:id" />
  )
}
```

---

## Styling

### Drawer Customization

```jsx
<Drawer
  placement="bottom"
  height="90%"
  styles={{
    body: { padding: '20px 16px' },
  }}
  className="journey-detail-mobile-drawer"
>
  {/* Content */}
</Drawer>
```

### Custom CSS Classes

- `.journey-detail-mobile-drawer`
- `.course-detail-mobile-drawer`
- `.module-detail-mobile-drawer`

Add to `/src/styles/components/modals.css`:

```css
.journey-detail-mobile-drawer .ant-drawer-body {
  display: flex;
  flex-direction: column;
}

.course-detail-mobile-drawer .ant-drawer-header {
  border-bottom: none;
}

.module-detail-mobile-drawer .prose {
  font-size: 14px;
}
```

---

## Features Summary

### ModalJourneyDetailMobile

✅ Full screen drawer (90%)
✅ Journey thumbnail + badges
✅ Progress stats
✅ HTML description
✅ Action button (Start/View)
✅ Navigation on action

### ModalCourseDetailMobile

✅ Course thumbnail
✅ Progress bar
✅ Module completion stats
✅ HTML description rendering
✅ Supporting modules info
✅ Action button

### ModalModuleDetailMobile

✅ Status badges
✅ Module info (duration, category, type)
✅ HTML content rendering
✅ Learning objectives list
✅ Locked/Unlocked state
✅ Multiple action buttons
✅ "View Full Details" link

---

## API Integration

All modals expect data from existing hooks:

- `useJourneyDetail(journeyId)`
- `useCourseDetail(journeyId, courseId)`
- `useModuleDetail(journeyId, courseId, moduleId)`

No additional API calls needed!

---

## Best Practices

1. **Conditional Rendering:**

   ```jsx
   {
     isMobile && <ModalDetailMobile {...props} />
   }
   ```

2. **State Management:**

   ```jsx
   const { modalOpen, openModal, closeModal } = useMobileModals()
   ```

3. **Action Handlers:**

   ```jsx
   const handleStart = () => {
     onClose(); // Close modal first
     // Then perform action
     navigate(...);
   };
   ```

4. **Error Handling:**

   ```jsx
   if (!journey) return null // Guard clause
   ```

5. **Loading States:**
   ```jsx
   {
     isLoading ? <Skeleton /> : <ModalContent />
   }
   ```

---

## Testing Checklist

- [ ] Modal opens on mobile card click
- [ ] Modal closes on swipe down
- [ ] Modal closes on close button
- [ ] Action buttons navigate correctly
- [ ] Content scrolls properly
- [ ] Images load with fallback
- [ ] Badges show correctly
- [ ] HTML content renders safely
- [ ] Locked modules show disabled state
- [ ] Responsive breakpoints work

---

## Migration from Old Code

### Old Pattern (Modal with complex state)

```jsx
const [isOpenModalDetailCourse, _setOpenModalDetailCourse] = useState(false)
const setOpenModalDetailCourse = () => {
  _setOpenModalDetailCourse(!isOpenModalDetailCourse)
}
```

### New Pattern (Simple hook)

```jsx
const { courseModalOpen, openCourseModal, closeCourseModal } = useMobileModals()
```

### Old Pattern (Complex modal content)

```jsx
<ModalDetailCourseMobile
  isOpen={isOpen}
  onClose={onClose}
  data={data}
  wraperStyle={...}
  rowImageStyle={...}
  // ... many props
/>
```

### New Pattern (Clean props)

```jsx
<ModalCourseDetailMobile
  open={open}
  onClose={onClose}
  course={course}
  journeyId={journeyId}
  courseId={courseId}
/>
```

---

## Next Steps

1. **Integrate modals into existing pages** (Optional)
   - Update JourneyCard to open modal on mobile
   - Update CourseListItem for modal trigger
   - Update ModuleItem for modal

2. **Add animations** (Optional)
   - Drawer slide transition
   - Content fade in
   - Loading skeleton

3. **Add analytics** (Optional)
   - Track modal opens
   - Track action button clicks
   - Track navigation events

4. **Add accessibility** (Future)
   - Focus management
   - Keyboard navigation
   - Screen reader support

---

## Files Created

1. `ModalJourneyDetailMobile.jsx` - Journey detail drawer
2. `ModalCourseDetailMobile.jsx` - Course detail drawer
3. `ModalModuleDetailMobile.jsx` - Module detail drawer
4. `modals/index.js` - Modal exports
5. `useMobileModals.js` - Modal state hook

**Total: 5 files**

## Files Updated

1. `components/index.js` - Export modals
2. `hooks/index.js` - Export useMobileModals

**Total: 2 files**

---

Ready untuk digunakan! 🚀
