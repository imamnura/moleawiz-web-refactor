# Learning Journey - Complete Feature Refactor Plan

## 📋 Full Feature Structure

### Original Structure (Old Project)

```
LearningJourney/
├── index.jsx                          # Main list page
├── hooks/useActions.js                # Filtering & sorting logic
├── styles.js                          # Inline styles
├── constant.js                        # Constants
├── lib/SearchMobileLearningJourney.jsx
└── LearningPages/                     # Detail pages container
    ├── index.jsx                      # Sidebar + Outlet layout (1486 lines!)
    ├── hooks/useActions.js            # Journey/Course/Module data
    ├── styles.js
    └── SubPages/
        ├── Journey/                   # Journey detail
        │   ├── index.jsx              # Journey info & description
        │   ├── hooks/useActions.js
        │   ├── styles.js
        │   └── modal/
        │       ├── ModalDetailJourneyMobile.jsx
        │       └── ModalDetailJourneyMobileContent.jsx
        ├── Course/                    # Course detail
        │   ├── index.jsx              # Course info & modules list
        │   ├── hooks/useActions.js
        │   ├── styles.js
        │   ├── CourseDescriptionMobile.jsx
        │   └── modal/
        │       ├── ModalDetailCourseMobile.jsx
        │       └── ModalDetailCourseMobileContent.jsx
        └── Module/                    # Module detail & player
            ├── index.jsx              # Module info & controls (1168 lines!)
            ├── hooks/useActions.js
            ├── styles.js
            ├── modal/
            │   ├── ModalDetailModuleMobile.jsx
            │   └── ModalDetailModuleMobileContent.jsx
            └── StreamSCORM/           # SCORM player
                ├── index.jsx
                ├── hooks/useActions.js, constant.js
                └── styles.js
```

### New Structure (Refactored)

```
features/journey/
├── pages/
│   ├── LearningJourneyListPage.jsx   # Main list (already done ✅)
│   ├── JourneyDetailPage.jsx         # Journey detail with courses
│   ├── CourseDetailPage.jsx          # Course detail with modules
│   └── ModuleDetailPage.jsx          # Module detail & description
├── components/
│   ├── JourneyCard.jsx               # Card component (done ✅)
│   ├── JourneyDetail/
│   │   ├── JourneyHeader.jsx         # Journey title, image, badges
│   │   ├── JourneyDescription.jsx    # Description section
│   │   ├── JourneyStats.jsx          # Progress, courses count
│   │   └── CourseList.jsx            # List of courses in journey
│   ├── CourseDetail/
│   │   ├── CourseHeader.jsx
│   │   ├── CourseDescription.jsx
│   │   └── ModuleList.jsx            # Collapsible module list
│   ├── ModuleDetail/
│   │   ├── ModuleHeader.jsx
│   │   ├── ModuleDescription.jsx
│   │   ├── ModuleActions.jsx         # Start/Continue/Complete buttons
│   │   └── SCORMPlayer.jsx           # SCORM content player
│   ├── Sidebar/
│   │   ├── JourneySidebar.jsx        # Sidebar with course/module tree
│   │   ├── CourseItem.jsx            # Collapsible course item
│   │   └── ModuleItem.jsx            # Module list item with status
│   └── Mobile/
│       ├── JourneyMobileModal.jsx
│       ├── CourseMobileModal.jsx
│       └── ModuleMobileModal.jsx
├── hooks/
│   ├── useJourneyFilters.js          # List filtering (done ✅)
│   ├── useJourneyDetail.js           # Journey detail data
│   ├── useCourseDetail.js            # Course detail data
│   ├── useModuleDetail.js            # Module detail data
│   ├── useModuleProgress.js          # Module progress tracking
│   └── useSCORMPlayer.js             # SCORM player logic
└── utils/
    ├── journeyHelpers.js             # General helpers (done ✅)
    ├── moduleHelpers.js              # Module-specific helpers
    └── scormHelpers.js               # SCORM utilities
```

## 🎯 Refactor Phases

### Phase 1: Foundation (COMPLETED ✅)

- [x] Journey List Page
- [x] Journey Card Component
- [x] Filter Radio
- [x] Badge Component
- [x] Journey Filters Hook
- [x] Journey Helpers

### Phase 2: Sidebar & Navigation Structure

- [ ] Create JourneySidebar layout component
- [ ] Create CourseItem collapsible component
- [ ] Create ModuleItem with status indicators
- [ ] Implement nested routing structure
- [ ] Add navigation state management

### Phase 3: Journey Detail Page

- [ ] JourneyDetailPage main container
- [ ] JourneyHeader component (image, title, badges)
- [ ] JourneyDescription component
- [ ] JourneyStats component (progress, counts)
- [ ] CourseList component
- [ ] useJourneyDetail hook (TanStack Query)
- [ ] Mobile modal for journey detail

### Phase 4: Course Detail Page

- [ ] CourseDetailPage main container
- [ ] CourseHeader component
- [ ] CourseDescription component
- [ ] ModuleList collapsible component
- [ ] useCourseDetail hook
- [ ] Mobile modal for course detail

### Phase 5: Module Detail Page

- [ ] ModuleDetailPage main container
- [ ] ModuleHeader component
- [ ] ModuleDescription component
- [ ] ModuleActions component (button logic)
- [ ] useModuleDetail hook
- [ ] useModuleProgress hook
- [ ] Mobile modal for module detail

### Phase 6: SCORM Player

- [ ] SCORMPlayer component
- [ ] SCORM API implementation
- [ ] Progress tracking integration
- [ ] useSCORMPlayer hook
- [ ] SCORM utilities (scormHelpers.js)
- [ ] Fullscreen mode support

### Phase 7: Integration & Polish

- [ ] API integration dengan backend
- [ ] Redux state management cleanup
- [ ] Error boundaries
- [ ] Loading states optimization
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing

### Phase 8: Documentation & Testing

- [ ] Component documentation (Storybook)
- [ ] API documentation
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance optimization

## 🔧 Technical Decisions

### Routing Strategy

```javascript
// Nested routes with outlet pattern
/my-learning-journey                    → List Page
/my-learning-journey/journey/:journeyId → Journey Detail (with sidebar)
  ├─ /course/:courseId                  → Course Detail
  └─ /course/:courseId/module/:moduleId → Module Detail
```

### State Management

- **TanStack Query**: Server state (journey, course, module data)
- **React Context**: UI state (sidebar collapse, active items)
- **Redux**: Global state (user progress, refetch triggers)
- **Local State**: Component-specific state

### Component Architecture

- **Container/Presenter Pattern**: Separate logic from UI
- **Compound Components**: Flexible composition
- **Render Props**: For complex data sharing
- **Custom Hooks**: Reusable logic

### Styling Approach

- **Tailwind First**: Use utility classes
- **Custom Classes**: Complex components in tailwind.css
- **Ant Design**: Base UI components
- **Responsive**: Mobile-first approach

## 📦 Key Components to Build

### 1. JourneySidebar

**Purpose**: Navigation sidebar showing course/module tree
**Features**:

- Collapsible course sections
- Module status indicators (locked, completed, current)
- Progress tracking
- Auto-scroll to active module
- Responsive collapse on mobile

### 2. CourseList

**Purpose**: Display courses in journey detail
**Features**:

- Card layout with progress
- Module count
- Completion status
- Click to navigate

### 3. ModuleList

**Purpose**: Display modules in course detail
**Features**:

- Collapsible by course
- Lock/unlock status
- Progress indicators
- Click to open module

### 4. SCORMPlayer

**Purpose**: Play SCORM content
**Features**:

- Fullscreen mode
- Progress tracking
- API communication
- Resume capability
- Completion tracking

## 🚧 Complexity Areas

### High Complexity

1. **SCORM Player** - Complex API, state management
2. **Sidebar Navigation** - Nested state, auto-scroll
3. **Progress Tracking** - Real-time updates, sync
4. **Module Locking** - Sequential unlock logic

### Medium Complexity

1. **Journey Detail** - Multiple data sources
2. **Course Detail** - Module list management
3. **Mobile Modals** - Responsive layouts

### Low Complexity

1. **Headers** - Static info display
2. **Descriptions** - Text rendering
3. **Stats** - Simple calculations

## 📊 Estimated Effort

| Phase     | Components         | Estimated Time |
| --------- | ------------------ | -------------- |
| Phase 2   | 3 components       | 2-3 days       |
| Phase 3   | 6 components       | 3-4 days       |
| Phase 4   | 5 components       | 2-3 days       |
| Phase 5   | 6 components       | 3-4 days       |
| Phase 6   | 5 components       | 4-5 days       |
| Phase 7   | Integration        | 2-3 days       |
| Phase 8   | Testing & Docs     | 3-4 days       |
| **Total** | **30+ components** | **3-4 weeks**  |

## 🎬 Immediate Next Steps

1. **Create Sidebar Structure** (Most Critical)
   - JourneySidebar container
   - CourseItem component
   - ModuleItem component
   - Navigation state hook

2. **Setup Nested Routing**
   - Update router configuration
   - Create outlet layout
   - Add route params handling

3. **Build Journey Detail Page**
   - Header, description, stats
   - Course list
   - API integration

## 📝 Notes

- Keep backward compatibility during transition
- Test each phase before moving to next
- Document as you go
- Regular commits per component
- Mobile testing throughout

---

**Status**: Phase 1 Complete ✅ | Starting Phase 2  
**Last Updated**: October 31, 2025
