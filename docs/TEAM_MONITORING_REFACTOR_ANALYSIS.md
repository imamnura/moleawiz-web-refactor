# Team Monitoring Feature - Refactor Analysis

## Overview

Analisis lengkap implementasi lama Team Monitoring untuk persiapan refactor ke modern React architecture dengan RTK Query dan Tailwind CSS.

## Old Implementation Structure

### File Structure (~3,000+ lines total)

```
TeamMonitoring/
├── index.jsx (330 lines) - Main layout & routing
├── styles.js - Inline styles
├── elements/
│   ├── CardOngoingProgramsMobile/
│   ├── DropdownMobile/
│   ├── LearningEventItem/
│   ├── LearningStatusItem/
│   ├── ModalDetailEvent/
│   ├── ModalListOngoingProgram/
│   ├── SectionTitleMobile/
│   └── Sections/
│       ├── SectionsDesktop/
│       │   ├── DashboardTeamDesktop/
│       │   ├── LearningEventDesktop/ (350 lines)
│       │   └── LearningStatusDesktop/ (380 lines)
│       └── SectionsMobile/
│           ├── DashboardTeam/
│           ├── LearningEvent/
│           └── LearningStatus/
└── pages/
    ├── pagesDesktop/
    │   ├── CalendarEventDesktop/ (385 lines)
    │   ├── SelectedProgramsDesktop/ (240 lines)
    │   └── TeamLearningStatusDetailDesktop/
    └── pagesMobile/
        ├── CalendarEvent/
        ├── SelectedPrograms/
        └── TeamLearningStatusDetail/
```

## Main Features

### 1. Dashboard / Overview

**Location:** `index.jsx` + `elements/Sections/*/DashboardTeam*/`

**Features:**

- Team member count display
- "Show Team Profile" button
- Conditional rendering based on empty states
- Responsive layout (desktop: 2-column, mobile: stacked)

**Data:**

- `count_team` - Total team members
- `programs` - List of ongoing programs

**API Endpoint:**

- `GET /overview` (getOverview)

### 2. Learning Status Section

**Location:** `elements/Sections/*/LearningStatus*/`

**Desktop Features (~380 lines):**

- Scrollable list of team members
- Infinite scroll pagination (12 items per page)
- Click member → Opens modal with program details
- Shows ongoing program count per member
- Modal displays all ongoing programs with progress circles

**Mobile Features:**

- Similar to desktop but different styling
- Card-based layout
- Bottom sheet modal

**Data Structure:**

```javascript
{
  teams: [
    {
      user_id: number,
      fullname: string,
      total_ongoing: number,
      journeys: [
        {
          name: string,
          progress: number,
          is_completed: number
        }
      ]
    }
  ],
  total_ongoing: number
}
```

**API Endpoints:**

- `GET /team-status` (getTeamStatus) - List of team members with ongoing count
- `GET /selected-programs` (selectedPrograms) - All programs detail for modal

**Complex Logic:**

- Infinite scroll with FE pagination
- Sort by total_ongoing (descending)
- Filter incomplete programs in modal
- Sort programs by progress

### 3. Learning Event Section

**Location:** `elements/Sections/*/LearningEvent*/`

**Desktop Features (~350 lines):**

- Scrollable list of upcoming events
- Click event → Opens modal with event details
- "Show Calendar" button → Navigate to calendar page
- Event info: title, date range, time range, member count

**Modal Features:**

- Event description
- Date range, location, time range, trainer
- Member status lists:
  - Confirmed (accepted)
  - Not Confirmed (tentatively/null)
  - Declined

**Data Structure:**

```javascript
{
  id: number,
  title: string,
  start_date: string,
  end_date: string,
  start_time: string,
  end_time: string,
  date_range: string, // formatted
  time_range: string, // formatted
  total_users: number,
  description: string,
  location: string,
  trainer: string,
  members: [
    {
      id: number,
      firstname: string,
      lastname: string,
      status: "accepted" | "declined" | "tentatively" | null
    }
  ]
}
```

**API Endpoints:**

- `GET /list-event` (getListEvent) - List of events
- `GET /event-detail/:id` (getEventDetail) - Event detail

**Complex Logic:**

- Date formatting with moment.js (localized EN/ID)
- Time range formatting (HH:MM - HH:MM)
- Smart date range display:
  - Same day: "20 March 2024"
  - Same month/year: "20 - 25 March 2024"
  - Different month: "20 March - 5 April 2024"
  - Different year: "20 March 2024 - 5 January 2025"
- Member status categorization

### 4. Selected Programs Page

**Location:** `pages/*/SelectedPrograms*/`

**Desktop Features (~240 lines):**

- Table with columns: No, Team Member, Progress, Role, Last Access
- Row selection (disabled for 100% progress)
- Filter dropdown: All Progress, Ongoing, Completed
- "Send Notification" button → Generate email with selected members
- Progress circle per member

**Mobile Features:**

- Card-based layout instead of table
- Similar filtering
- Checkbox selection

**Data Structure:**

```javascript
{
  fullname: string,
  progress: number,
  role: string,
  last_access: string,
  email: string,
  end_date: string,
  days_left: number | "Overdue" | "-"
}
```

**API Endpoints:**

- `GET /selected-programs?journey_id={id}` - All members in program
- `GET /selected-programs?journey_id={id}&status=ongoing` - Filter ongoing
- `GET /selected-programs?journey_id={id}&status=completed` - Filter completed
- `GET /overview` - Get program name from programs array

**Complex Logic:**

- Calculate days_left for overdue detection (30-day window)
- Sort: incomplete first (by progress), then complete (alphabetically)
- Generate mailto: link with multiple recipients
- Date formatting for last_access

### 5. Calendar Event Page

**Location:** `pages/*/CalendarEvent*/`

**Desktop Features (~385 lines):**

- FullCalendar component (dayGrid view)
- Month navigation (prev, next, today)
- Event click → Opens detail modal (same as Learning Event modal)
- Localized calendar (EN/ID)
- Tooltip for long event titles

**Data Structure:**

```javascript
{
  id: number,
  title: string,
  start: string, // YYYY-MM-DD
  end: string,   // YYYY-MM-DD
  color: string, // Event color
  textColor: string
}
```

**API Endpoints:**

- `GET /calendar-events?start={date}&end={date}` - Events in date range
- `GET /event-detail/:id` - Event detail on click

**Dependencies:**

- @fullcalendar/react
- @fullcalendar/daygrid
- @fullcalendar/timegrid
- @fullcalendar/interaction

### 6. Team Profile / Learning Status Detail Page

**Location:** `pages/*/TeamLearningStatusDetail*/`

**Features:**

- Search members
- Filter by progress status
- Table/List view per member
- View member certificate
- Show member profile

**API Endpoints:**

- `GET /team-learning-status-detail`
- `GET /member-profile/:id`
- `GET /member-certificates/:id`

## API Endpoints Summary

### Team Monitoring APIs

1. **GET /overview**
   - Returns: `{ count_team, programs: [] }`
   - Used for: Dashboard, program names

2. **GET /team-status**
   - Returns: `{ teams: [], total_ongoing }`
   - Used for: Learning Status section

3. **GET /selected-programs?journey_id={id}&status={status}**
   - Params: journey_id (required), status (optional: ongoing|completed)
   - Returns: Array of members with progress
   - Used for: Selected Programs page, Learning Status modal

4. **GET /list-event**
   - Returns: Array of events
   - Used for: Learning Event section

5. **GET /event-detail/:id**
   - Returns: Event object with members
   - Used for: Event detail modal

6. **GET /calendar-events?start={date}&end={date}**
   - Returns: Array of events for calendar
   - Used for: Calendar page

7. **GET /team-learning-status-detail?filter={filter}&search={search}**
   - Returns: Detailed member list
   - Used for: Team Profile page

## Key UI/UX Patterns

### Responsive Design

- **Desktop (≥1024px):**
  - 2-column layout (main content + sidebar)
  - Tables for data display
  - Larger modals (462px - 564px)
- **Mobile (<1024px):**
  - Stacked layout
  - Card-based design
  - Full-width modals (90% width)
  - Bottom navigation

### Empty States

- Check `isEmptyDashboard`, `isEmptyStatus`, `isEmptyEvent`
- If all empty → Show central empty state with illustration
- If partial → Hide specific sections

### Loading States

- Skeleton loaders for modals
- `<Loader />` component for lists
- Loading indicators in tables

### Modals

- Ant Design Modal component
- Custom close icon with wrapper
- Centered positioning
- Fade transition
- ESC key to close

### Infinite Scroll

- Used in Learning Status section
- react-infinite-scroll-component library
- 12 items per page (FE pagination)
- Skeleton loader for next page

### Date/Time Formatting

- moment.js with localization (EN/ID)
- Smart date range formatting
- Time in HH:MM format

### Email Generation

- mailto: links for notifications
- Join selected member emails with semicolon
- Pre-filled subject and body

## Styling Approach

### Current (Old)

- Inline styles (styles.js files)
- Separate mobile/desktop components
- Color constants from config
- Manual responsive checks

### Target (New)

- Tailwind CSS utility classes
- Responsive classes (sm:, md:, lg:)
- Single component with responsive props
- Ant Design theming with ConfigProvider

## Color Scheme

```javascript
ColorPrimary: '#0066CC'
ColorSecondary: '#F16F24'
progressBarTeamMonitoring: '#0066CC'
progressCompleteColor: '#52C41A'
colorTextTitle: '#212121'
colorTextDesc: '#757575'
teamMonitoringText: '#424242'
```

## Translation Keys

### Team Monitoring

- `feature.feature_tm.team_monitoring`
- `feature.feature_tm.member`
- `feature.feature_tm.show_team_profile`
- `feature.feature_tm.learning_status`
- `feature.feature_tm.ongoing_program`
- `feature.feature_tm.learning_event`
- `feature.feature_tm.show_calendar`
- `feature.feature_tm.calendar`
- `feature.feature_tm.today`
- `feature.feature_tm.confirmed`
- `feature.feature_tm.not_confirmed`
- `feature.feature_tm.declined`

### Selected Programs

- `feature.feature_tm.selected_member`
- `feature.feature_tm.send_notification`
- `feature.feature_tm.all_progress`
- `feature.feature_tm.ongoing`
- `feature.feature_tm.completed`
- `feature.feature_tm.team_member`
- `feature.feature_tm.progress`
- `feature.feature_tm.role`
- `feature.feature_tm.last_access`

### Empty States

- `feature.feature_tm.member_no_program`

## Complex Business Logic

### 1. Days Left Calculation (Selected Programs)

```javascript
// Check if end_date is within 30 days from now
// If yes: Calculate days left
// If past: Mark as "Overdue"
// If future (>30 days): Show "-"
```

### 2. Data Sorting (Selected Programs)

```javascript
// Step 1: Sort all by progress (ascending)
// Step 2: Separate incomplete (<100%) and complete (>=100%)
// Step 3: Sort complete alphabetically by fullname
// Step 4: Combine: incomplete first, then complete
```

### 3. Member Status Categorization (Events)

```javascript
// Confirmed: status === "accepted"
// Not Confirmed: status === "tentatively" || status === null
// Declined: status === "declined"
```

### 4. Date Range Formatting

```javascript
// Same date: "20 March 2024"
// Same month & year: "20 - 25 March 2024"
// Different month, same year: "20 March - 5 April 2024"
// Different year: "20 March 2024 - 5 January 2025"
```

## Component Reusability Opportunities

### Reusable Components

1. **EventCard** - Event item display (list/calendar)
2. **MemberCard** - Member info with progress
3. **EventDetailModal** - Event detail display
4. **ProgramDetailModal** - Member programs modal
5. **ProgressCircle** - Progress indicator
6. **MemberList** - Categorized member lists (confirmed/not/declined)
7. **FilterDropdown** - Progress filter
8. **EmptyState** - No data display
9. **SectionCard** - Section wrapper

### Reusable Hooks

1. **useTeamOverview** - Fetch overview data
2. **useTeamStatus** - Fetch learning status
3. **useTeamEvents** - Fetch events list
4. **useEventDetail** - Fetch event detail
5. **useSelectedProgram** - Fetch program members
6. **useInfiniteScroll** - Scroll pagination logic

### Reusable Utilities

1. **formatDateRange** - Smart date range formatting
2. **formatTimeRange** - Time formatting
3. **calculateDaysLeft** - Days calculation
4. **categorizeMemberStatus** - Status grouping
5. **generateEmailLink** - mailto: link generation
6. **sortProgramMembers** - Complex sorting logic

## Migration Challenges

### High Complexity

1. **FullCalendar Integration** - Need to maintain calendar functionality
2. **Infinite Scroll** - FE pagination with data manipulation
3. **Complex Date Logic** - Multiple date formatting scenarios
4. **Email Generation** - mailto: link with multiple recipients
5. **Nested Modals** - Modal opening from list items

### Medium Complexity

1. **Progress Filtering** - Multiple filter states
2. **Member Selection** - Table row selection with conditions
3. **Empty State Logic** - Multiple empty state checks
4. **Responsive Layouts** - Desktop vs mobile completely different

### Low Complexity

1. **Basic Data Display** - Lists, cards
2. **Navigation** - Routing to sub-pages
3. **Loading States** - Standard loaders

## Refactor Goals

### Architecture

- ✅ RTK Query for all API calls
- ✅ Custom hooks for business logic
- ✅ Reusable components (single source, responsive)
- ✅ Tailwind CSS for all styling
- ✅ TypeScript-ready structure

### Code Quality

- ✅ Remove inline styles
- ✅ Consolidate desktop/mobile components
- ✅ Extract date/time utilities
- ✅ Simplify state management
- ✅ Better error handling

### Performance

- ✅ RTK Query caching
- ✅ Optimized re-renders
- ✅ Lazy loading for modals
- ✅ Memoized computations

### Developer Experience

- ✅ Clear file structure
- ✅ Comprehensive documentation
- ✅ Easy to test
- ✅ Easy to extend

## Estimated File Count

### New Structure

```
src/pages/team-monitoring/
├── index.js (exports)
├── TeamMonitoringPage.jsx
├── SelectedProgramPage.jsx
├── CalendarEventPage.jsx
├── TeamProfilePage.jsx
├── components/
│   ├── TeamOverview.jsx
│   ├── LearningStatusSection.jsx
│   ├── LearningEventSection.jsx
│   ├── EventCard.jsx
│   ├── MemberCard.jsx
│   ├── EventDetailModal.jsx
│   ├── MemberProgramsModal.jsx
│   ├── SelectedProgramTable.jsx
│   ├── CalendarView.jsx
│   └── TeamProfileTable.jsx
├── hooks/
│   ├── useTeamOverview.js
│   ├── useTeamStatus.js
│   ├── useTeamEvents.js
│   ├── useEventDetail.js
│   ├── useSelectedProgram.js
│   └── useInfiniteScroll.js
└── utils/
    ├── dateFormatters.js
    ├── emailUtils.js
    └── sortingUtils.js

src/services/api/
└── teamMonitoringApi.js (RTK Query)
```

**Total Estimated:** ~25-30 files vs ~50+ old files
**Lines of Code:** ~2,500 clean lines vs ~3,000+ with duplication

## Priority Features for MVP

### Phase 1 (Critical)

1. ✅ Team Overview (count + button)
2. ✅ Learning Status section
3. ✅ Learning Event section
4. ✅ Selected Programs page

### Phase 2 (Important)

5. ✅ Calendar Event page
6. ✅ Event Detail modal
7. ✅ Member Programs modal

### Phase 3 (Nice to Have)

8. ⏳ Team Profile page
9. ⏳ Member certificates
10. ⏳ Advanced filtering

## Dependencies to Install

### Keep

- moment (date formatting)
- react-infinite-scroll-component (infinite scroll)
- @fullcalendar/react (calendar)
- @fullcalendar/daygrid
- @fullcalendar/timegrid
- @fullcalendar/interaction

### New

- None (all others already in project)

## Summary

Team Monitoring adalah fitur yang cukup kompleks dengan:

- **6 main pages/sections**
- **7 API endpoints**
- **Multiple modals**
- **Complex date/time logic**
- **Infinite scroll**
- **Calendar integration**
- **Email generation**
- **Responsive desktop/mobile**

Refactor akan menghasilkan:

- **~25-30 files** (vs 50+)
- **~2,500 lines** (vs 3,000+)
- **100% Tailwind CSS**
- **RTK Query caching**
- **Reusable components**
- **Better maintainability**

Estimated time: **8-12 hours** untuk complete refactor.
