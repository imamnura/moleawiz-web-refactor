# Leaderboards Refactor - Complete Documentation

## 📋 Overview

Leaderboards feature refactor dari implementasi lama (2159 baris monolitik) ke arsitektur modern dengan reusable components, custom hooks, dan TanStack Query untuk data fetching.

**Status:** ✅ **COMPLETE**

---

## 🏗️ Architecture

### Folder Structure

```
src/pages/leaderboards/
├── components/           # 8 Reusable UI Components
│   ├── EmptyState.jsx
│   ├── LeaderboardsHeader.jsx
│   ├── MobileLeaderboardsHeader.jsx
│   ├── MobilePodiumSection.jsx
│   ├── MobileRankList.jsx
│   ├── PodiumSection.jsx
│   ├── RankingTable.jsx
│   └── SelectorModals.jsx
├── hooks/               # 3 Custom Hooks (TanStack Query)
│   ├── useEnrolledPrograms.js
│   ├── useLeaderboards.js
│   └── useLeaderboardsData.js
├── utils/               # 2 Utility Modules
│   ├── dataProcessing.js
│   └── formatters.js
└── LeaderboardsPage.jsx # Main Page Component
```

### Component Hierarchy

```
LeaderboardsPage
├── LeaderboardsHeader (Desktop)
│   ├── Title
│   ├── Program Selector Dropdown
│   └── Organization Level Dropdown
├── MobileLeaderboardsHeader (Mobile)
│   ├── Title
│   ├── Program Selector Button
│   └── Organization Selector Button
├── PodiumSection (Desktop)
│   └── PodiumCard × 3 (Rank 1-3)
├── MobilePodiumSection (Mobile)
│   └── MobilePodiumCard × 3 (Rank 1-3)
├── RankingTable (Desktop)
│   ├── RankColumn (Left) - Rank 4-9
│   │   └── RankRow × n
│   └── RankColumn (Right) - Rank 10-15
│       └── RankRow × n
├── MobileRankList (Mobile)
│   └── Rank Card × n (Rank 4+)
├── SelectorModals (Mobile Only)
│   ├── ProgramSelectorModal
│   └── OrganizationSelectorModal
└── EmptyState (Conditional)
```

---

## 📦 Components

### 1. **LeaderboardsPage.jsx**

Main page component yang mengatur layout responsif dan state management.

**Features:**

- Responsive layout switching (Desktop/Mobile)
- Filter management (program & organization level)
- Modal handling untuk mobile
- Loading states dengan Loader component
- Empty states handling
- Your Rank display di mobile (fixed bottom bar)

**Key Logic:**

```jsx
const {
  top3,
  columnLeft,
  columnRight,
  yourRank,
  programOptions,
  organizationOptions,
  filters,
  setFilters,
  isLoading,
  hasData,
  hasPrograms,
} = useLeaderboardsData()
```

**Responsive Behavior:**

- Desktop: Header + Podium + 2-column Table
- Mobile: Sticky Header + Mobile Podium + Card List + Fixed Your Rank Bar

---

### 2. **LeaderboardsHeader.jsx** (Desktop)

Desktop header dengan title dan filter dropdowns.

**Props:**

```tsx
{
  programOptions: Array<{label: string, value: number}>
  organizationOptions: Array<{label: string, value: string}>
  selectedProgram: number
  selectedOrg: string
  onProgramChange: (value: number) => void
  onOrgChange: (value: string) => void
}
```

**Features:**

- Sticky positioning
- Searchable program dropdown
- Organization level dropdown
- Translation support

---

### 3. **MobileLeaderboardsHeader.jsx** (Mobile)

Mobile header dengan title dan button untuk open modals.

**Props:**

```tsx
{
  selectedProgram: string
  selectedOrg: string
  onProgramClick: () => void
  onOrgClick: () => void
}
```

**Features:**

- Sticky top positioning
- Button untuk open modals
- Compact layout
- Translation support

---

### 4. **PodiumSection.jsx** (Desktop)

Desktop podium dengan 3 cards (Rank 1-3).

**Props:**

```tsx
{
  podiumData: Array<{
    rank: number
    user_id: number
    firstname: string
    lastname: string
    role: string
    leaderboards_point: number
    photo: string
  }>
}
```

**Features:**

- 3 cards layout: 280px (2nd), 340px (1st), 280px (3rd)
- Medal icons (Medalion1, Medalion2, Medalion3)
- Avatar display
- "You" highlighting
- Score formatting dengan Indonesian format (10.000)

**Subcomponent:**

```jsx
<PodiumCard rank={rank} data={data} isFirst={rank === 1} />
```

---

### 5. **MobilePodiumSection.jsx** (Mobile)

Mobile podium dengan 3 responsive cards.

**Props:** Same as PodiumSection

**Features:**

- Flex layout dengan aspect ratio 3/4
- Mobile medal icons (Medalion_mobile1/2/3)
- Smaller avatars (56px)
- Responsive font sizes
- "You" highlighting

**Subcomponent:**

```jsx
<MobilePodiumCard rank={rank} data={data} isFirst={rank === 1} />
```

---

### 6. **RankingTable.jsx** (Desktop)

Desktop ranking table dengan 2 kolom (Rank 4-15).

**Props:**

```tsx
{
  columnLeft: Array<LeaderboardData> // Rank 4-9
  columnRight: Array<LeaderboardData> // Rank 10-15
}
```

**Features:**

- 2-column layout (Row with 2 Cols)
- Single column fallback jika data < 6
- "You" row highlighting dengan custom padding
- Responsive table structure

**Subcomponents:**

```jsx
<RankColumn data={data} columnLabel="Rank 4 - 9" />
  └── <RankRow
        rank={rank}
        data={data}
        isYou={isYou}
      />
```

**RankRow Structure:**

- Rank number (width: 60px)
- Avatar (40px)
- Name + Role (flex-1)
- Score (width: 100px)

---

### 7. **MobileRankList.jsx** (Mobile)

Mobile card list untuk ranking (Rank 4+).

**Props:**

```tsx
{
  data: Array<LeaderboardData>
}
```

**Features:**

- Card-based layout
- Avatar + Name + Role + Score
- "You" card highlighting
- Compact spacing

**Card Structure:**

```jsx
<Card>
  <Rank Number>
  <Avatar>
  <Name + Role>
  <Score>
</Card>
```

---

### 8. **SelectorModals.jsx** (Mobile)

Modal components untuk program & organization selector.

**Props:**

```tsx
{
  // Program Modal
  showProgramModal: boolean
  programOptions: Array<Option>
  selectedProgram: number
  onProgramClose: () => void
  onProgramSelect: (value: number) => void

  // Organization Modal
  showOrgModal: boolean
  orgOptions: Array<Option>
  selectedOrg: string
  onOrgClose: () => void
  onOrgSelect: (value: string) => void
}
```

**Features:**

- 2 modals: ProgramSelectorModal, OrganizationSelectorModal
- Searchable program list (Input.Search)
- Checkmark icon untuk selected item
- Full height (70vh)
- Scrollable list

---

### 9. **EmptyState.jsx**

Empty state component ketika tidak ada data leaderboards.

**Features:**

- Centered layout
- Empty illustration
- Translated message
- Graceful fallback

---

## 🪝 Custom Hooks

### 1. **useLeaderboards.js**

TanStack Query hook untuk fetch leaderboards data.

**Parameters:**

```tsx
{
  journeyId: number
  enabled: boolean
}
```

**Returns:**

```tsx
{
  data: Array<LeaderboardData>
  isLoading: boolean
  error: Error | null
}
```

**Features:**

- Auto-refetch on stale (5 minutes)
- Cache time: 10 minutes
- Error handling dengan invalidToken dispatch
- Disabled jika journeyId null

**API Call:**

```js
getAllLeaderboards({
  data: {
    journey_id: journeyId,
    platform: 'web',
  },
})
```

---

### 2. **useEnrolledPrograms.js**

TanStack Query hook untuk fetch enrolled programs.

**Returns:**

```tsx
{
  data: Array<{
    journey_id: number
    journey_name: string
    enrolled_date: string
    last_access_journey: string
  }>
  isLoading: boolean
  error: Error | null
}
```

**Features:**

- Auto-refetch on stale (10 minutes)
- Cache time: 30 minutes
- Filter last 12 months (temporarily disabled for production)
- Sort alphabetically by journey_name
- **getDefaultProgram()** helper function

**getDefaultProgram() Logic:**

1. Cek jika ada program dengan `last_access_journey`
   - Pilih program dengan last_access paling dekat dengan current time
2. Fallback: Pilih program dengan `enrolled_date` paling dekat

---

### 3. **useLeaderboardsData.js**

Main hook yang menggabungkan semua logic leaderboards.

**Returns:**

```tsx
{
  // Processed Data
  top3: Array<LeaderboardData>           // Rank 1-3
  columnLeft: Array<LeaderboardData>     // Rank 4-9
  columnRight: Array<LeaderboardData>    // Rank 10-15
  yourRank: LeaderboardData | null

  // Program Options
  enrolledPrograms: Array<Program>
  programOptions: Array<{label, value, dataIndex}>

  // Organization Options
  organizationOptions: Array<{label, value}>

  // Filters
  filters: {
    filtPro: number | null
    filtOrg: 'company' | 'directorate' | 'division' | 'department' | 'group' | 'role'
  }
  setFilters: (filters) => void

  // Loading States
  isLoading: boolean
  isLoadingPrograms: boolean
  isLoadingLeaderboards: boolean

  // Status Flags
  hasData: boolean
  hasPrograms: boolean
}
```

**Key Features:**

- Combine useEnrolledPrograms + useLeaderboards
- Auto-select default program on first load
- Process data dengan `processLeaderboardsData()` utility
- Generate organization options dari user profile
- Memoized values untuk performance

**Organization Options Logic:**

```js
const options = [
  { label: 'Company Level - Telkom Indonesia', value: 'company' },
  // Conditional options based on profileUserData:
  { label: 'Directorate Level - DIR NAME', value: 'directorate' },
  { label: 'Division Level - DIV NAME', value: 'division' },
  { label: 'Department Level - DEPT NAME', value: 'department' },
  { label: 'Group Level - GROUP NAME', value: 'group' },
  { label: 'Role - ROLE NAME', value: 'role' },
]
```

---

## 🛠️ Utilities

### 1. **formatters.js**

Formatting utilities untuk display data.

**Functions:**

**formatNumberWithDot(value)**

```js
formatNumberWithDot(10000) // "10.000"
formatNumberWithDot(1234567) // "1.234.567"
```

- Indonesian number format
- Adds dots untuk thousand separators

**getUserInitial(firstname)**

```js
getUserInitial('John') // "J"
getUserInitial('') // "?"
```

- Get first letter dari nama
- Fallback "?" jika empty

**getFullName(user)**

```js
getFullName({ firstname: 'John', lastname: 'Doe' }) // "John Doe"
getFullName({ firstname: 'John' }) // "John"
```

- Combine firstname + lastname
- Handle missing lastname

---

### 2. **dataProcessing.js**

Core utilities untuk process leaderboards data.

**Functions:**

**processLeaderboardsData(data, userId, filters, profileData)**

Main processing function. Flow:

1. Apply organization filter → `applyOrgFilter()`
2. Mark user's rank → `markUserRank()`
3. Split into sections → `splitDataIntoSections()`

Returns:

```tsx
{
  top3: Array<LeaderboardData> // Rank 1-3
  columnLeft: Array<LeaderboardData> // Rank 4-9
  columnRight: Array<LeaderboardData> // Rank 10-15
  yourRank: LeaderboardData | null
}
```

**applyOrgFilter(boards, current, filterType, profileData)**

Filter leaderboards berdasarkan organization level.

Filter Types:

- `'company'`: Tidak filter (semua data)
- `'directorate'`: Filter by profileData.directorate
- `'division'`: Filter by profileData.division
- `'department'`: Filter by profileData.department
- `'group'`: Filter by profileData.group
- `'role'`: Filter by profileData.role

**markUserRank(boards, current, userId)**

Tandai ranking user di dalam leaderboards.

Returns:

```tsx
{
  boards: Array<LeaderboardData>
  yourRank: LeaderboardData | null
}
```

**splitDataIntoSections(boards, yourRank)**

Split leaderboards data ke 4 sections:

1. **top3**: Rank 1-3 untuk podium
2. **columnLeft**: Rank 4-9 untuk kolom kiri table
3. **columnRight**: Rank 10-15 untuk kolom kanan table
4. **remaining**: Rank 16+ (unused)

Logic:

```js
const top3 = boards.slice(0, 3)
const remaining = boards.slice(3, 15) // max 12 items

if (remaining.length > 6) {
  columnLeft = remaining.slice(0, 6)
  columnRight = remaining.slice(6, 12)
} else {
  columnLeft = remaining
  columnRight = []
}
```

---

## 🔄 Data Flow

### 1. **Initial Load**

```
LeaderboardsPage Mount
  ↓
useLeaderboardsData() Hook
  ↓
useEnrolledPrograms() → Fetch programs from API
  ↓
getDefaultProgram() → Select default program (last accessed or enrolled)
  ↓
setFilters({ filtPro: defaultProgram, filtOrg: 'company' })
  ↓
useLeaderboards(filtPro) → Fetch leaderboards from API
  ↓
processLeaderboardsData() → Process & split data
  ↓
Render Components with Data
```

### 2. **Filter Change**

```
User Changes Program Filter
  ↓
handleProgramChange(newProgram)
  ↓
setFilters({ ...filters, filtPro: newProgram })
  ↓
useLeaderboards(newProgram) → Auto refetch
  ↓
processLeaderboardsData() → Reprocess data
  ↓
Re-render with New Data
```

### 3. **Organization Filter**

```
User Changes Org Filter
  ↓
handleOrgChange(newOrgLevel)
  ↓
setFilters({ ...filters, filtOrg: newOrgLevel })
  ↓
applyOrgFilter() in processLeaderboardsData()
  ↓
Filter data by organization
  ↓
Re-render with Filtered Data
```

---

## 🎨 Responsive Design

### Desktop Layout (>= 768px)

```
┌─────────────────────────────────────┐
│ LeaderboardsHeader (Sticky)         │
│ - Title                             │
│ - Program Dropdown | Org Dropdown   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ PodiumSection                       │
│ ┌────┐  ┌──────┐  ┌────┐           │
│ │ 2  │  │  1   │  │ 3  │           │
│ └────┘  └──────┘  └────┘           │
└─────────────────────────────────────┘
┌──────────────────┬──────────────────┐
│ RankColumn Left  │ RankColumn Right │
│ Rank 4 - 9       │ Rank 10 - 15     │
│ ┌──────────────┐ │ ┌──────────────┐ │
│ │ 4. John Doe  │ │ │ 10. Jane Doe │ │
│ │ 5. ...       │ │ │ 11. ...      │ │
│ └──────────────┘ │ └──────────────┘ │
└──────────────────┴──────────────────┘
```

### Mobile Layout (< 768px)

```
┌─────────────────────────────────────┐
│ MobileLeaderboardsHeader (Sticky)   │
│ - Title                             │
│ - [Program Button] [Org Button]     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ MobilePodiumSection                 │
│ ┌──────┐  ┌──────┐  ┌──────┐       │
│ │  2   │  │  1   │  │  3   │       │
│ └──────┘  └──────┘  └──────┘       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ MobileRankList                      │
│ ┌─────────────────────────────────┐ │
│ │ 4. John Doe        1,250 points │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 5. Jane Doe        1,100 points │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ Your Rank: #12 (Fixed Bottom)      │
└─────────────────────────────────────┘
```

### Breakpoints

- Mobile: `< 768px`
- Desktop: `>= 768px`
- Using: `useResponsive()` hook from `@hooks/useResponsive`

---

## 🚀 API Integration

### 1. **getAllLeaderboards**

**Endpoint:** (From `@services/api`)

**Request:**

```js
{
  data: {
    journey_id: number,
    platform: 'web'
  }
}
```

**Response:**

```ts
{
  status: 200,
  data: Array<{
    rank: number
    user_id: number
    firstname: string
    lastname: string
    role: string
    leaderboards_point: number
    photo: string
    directorate: string
    division: string
    department: string
    group: string
  }>
}
```

### 2. **getAllEnrolledProgram**

**Endpoint:** (From `@services/api`)

**Request:** None

**Response:**

```ts
{
  status: 200,
  data: Array<{
    journey_id: number
    journey_name: string
    enrolled_date: string (YYYY-MM-DD)
    last_access_journey: string (YYYY-MM-DD HH:mm:ss) | null
  }>
}
```

---

## 📝 Redux Integration

### Slices Used

**authSlice:**

- `setInvalidToken(status)`: Handle invalid token response

**leaderboardSlice:**

- `getProfileUser()`: Thunk untuk fetch user profile
- `profileUserData`: User organization data

**User Profile Structure:**

```ts
{
  directorate: string | null
  division: string | null
  department: string | null
  group: string | null
  role: string | null
}
```

---

## 🌐 Translation (i18next)

### Translation Keys Used

**Header:**

```
feature.feature_leaderboards.title
feature.feature_leaderboards.header.choose_program
feature.feature_leaderboards.header.search_program
feature.feature_leaderboards.header.choose_organization
feature.feature_leaderboards.header.company_level
feature.feature_leaderboards.header.directorate_level
feature.feature_leaderboards.header.division_level
feature.feature_leaderboards.header.department_level
feature.feature_leaderboards.header.group_level
feature.feature_leaderboards.header.role
```

**Content:**

```
feature.feature_leaderboards.you
feature.feature_leaderboards.your_rank
feature.feature_leaderboards.empty_state.title
feature.feature_leaderboards.empty_state.description
feature.feature_leaderboards.rank_label
feature.feature_leaderboards.points
```

---

## 🧪 Testing Checklist

### Functional Tests

- [ ] Load leaderboards data
- [ ] Display top 3 podium correctly
- [ ] Display ranking table (2 columns)
- [ ] Highlight "Your Rank"
- [ ] Filter by program
- [ ] Filter by organization level
- [ ] Default program selection (last accessed)
- [ ] Empty state display
- [ ] Loading state display

### Responsive Tests

- [ ] Desktop podium layout (280-340-280)
- [ ] Mobile podium layout (3 cards)
- [ ] Desktop 2-column table
- [ ] Mobile card list
- [ ] Sticky header (desktop)
- [ ] Sticky header (mobile)
- [ ] Fixed "Your Rank" bar (mobile)
- [ ] Modal selectors (mobile only)

### Data Tests

- [ ] Indonesian number format (10.000)
- [ ] User initial fallback
- [ ] Full name combine
- [ ] Organization filter accuracy
- [ ] Your rank detection
- [ ] Top3/Left/Right split logic

### Edge Cases

- [ ] No enrolled programs
- [ ] No leaderboards data
- [ ] User not in top 15
- [ ] User in top 3
- [ ] Single column fallback (< 6 items after top 3)
- [ ] Empty organization fields
- [ ] Missing last_access_journey
- [ ] API errors

---

## 📊 Comparison: Old vs New

### Code Metrics

| Metric        | Old            | New              | Improvement                |
| ------------- | -------------- | ---------------- | -------------------------- |
| Lines of Code | 2,159          | ~800             | -63%                       |
| Components    | 1 monolith     | 9 reusable       | +800% modularity           |
| Files         | 4              | 14               | Better organization        |
| Custom Hooks  | 1 (Redux)      | 3 (TanStack)     | Modern patterns            |
| Data Fetching | Redux thunk    | TanStack Query   | Auto-cache, refetch        |
| Styling       | Inline objects | Tailwind classes | Faster dev, smaller bundle |

### Architecture Improvements

**Old:**

- ❌ 2159-line monolithic component
- ❌ Inline styles dengan constant objects
- ❌ Manual data fetching dengan Redux
- ❌ Complex useActions hook (400+ lines)
- ❌ No code reusability
- ❌ Hard to test

**New:**

- ✅ 9 small, focused components
- ✅ Tailwind CSS utility classes
- ✅ TanStack Query dengan auto-cache
- ✅ 3 specialized hooks
- ✅ High reusability
- ✅ Easy to test & maintain

### Features Parity

| Feature                   | Old     | New         |
| ------------------------- | ------- | ----------- |
| Top 3 Podium              | ✅      | ✅          |
| Desktop 2-column Table    | ✅      | ✅          |
| Mobile Card List          | ✅      | ✅          |
| Program Filter            | ✅      | ✅          |
| Organization Filter       | ✅      | ✅          |
| "Your Rank" Highlight     | ✅      | ✅          |
| Default Program Selection | ✅      | ✅          |
| Empty States              | ✅      | ✅          |
| Loading States            | ✅      | ✅          |
| Translation (i18n)        | ✅      | ✅          |
| Responsive Design         | ✅      | ✅          |
| **Auto-refetch**          | ❌      | ✅ NEW      |
| **Data Caching**          | ❌      | ✅ NEW      |
| **Error Handling**        | Partial | ✅ Improved |

---

## 🔧 Maintenance Guide

### Adding New Organization Level

1. Update `organizationOptions` in `useLeaderboardsData.js`:

```js
if (profileUserData.newLevel) {
  options.push({
    label: `${t('feature.feature_leaderboards.header.new_level')} - ${profileUserData.newLevel}`,
    value: 'newLevel',
  })
}
```

2. Update `applyOrgFilter()` in `utils/dataProcessing.js`:

```js
case 'newLevel':
  return boards.filter(
    (item) => item.newLevel === current.newLevel
  );
```

3. Add translation keys

### Modifying Podium Layout

Edit `PodiumSection.jsx` or `MobilePodiumSection.jsx`:

```jsx
// Change card widths
<div className="w-[300px]">  // Previously 280px
```

### Changing Table Split Logic

Edit `splitDataIntoSections()` in `utils/dataProcessing.js`:

```js
const remaining = boards.slice(3, 20) // Show top 20 instead of 15

if (remaining.length > 8) {
  columnLeft = remaining.slice(0, 8)
  columnRight = remaining.slice(8, 16)
}
```

### Adding More Filters

1. Add filter state in `useLeaderboardsData.js`
2. Add filter UI in Header components
3. Update `processLeaderboardsData()` logic

---

## 🐛 Known Issues & Solutions

### Issue 1: Default Program Not Selected

**Symptom:** Program dropdown empty on first load

**Solution:** Ensure `enrolledPrograms` loaded before calling `getDefaultProgram()`

```js
useEffect(() => {
  if (enrolledPrograms.length > 0 && filters.filtPro === null) {
    const defaultProgram = getDefaultProgram(enrolledPrograms)
    if (defaultProgram) {
      setFilters((prev) => ({ ...prev, filtPro: defaultProgram }))
    }
  }
}, [enrolledPrograms, filters.filtPro])
```

### Issue 2: Infinite Re-renders

**Symptom:** Component re-renders continuously

**Solution:** Use `useMemo` untuk processed data

```js
const processedData = useMemo(() => {
  return processLeaderboardsData(
    leaderboardsData,
    userId,
    filters,
    profileUserData
  )
}, [leaderboardsData, userId, filters, profileUserData])
```

### Issue 3: Stale Data After Filter Change

**Symptom:** Data doesn't update after changing filters

**Solution:** TanStack Query automatically refetches when `queryKey` changes

```js
queryKey: ['leaderboards', journeyId], // Auto-refetch when journeyId changes
```

---

## 📚 Dependencies

### Required Packages

```json
{
  "@tanstack/react-query": "^5.90.5",
  "react": "^19.1.1",
  "react-redux": "^9.2.1",
  "react-router-dom": "^7.1.3",
  "react-i18next": "^15.2.0",
  "antd": "^5.27.6",
  "moment": "^2.30.1"
}
```

### Import Paths

```js
// Services
import { getAllLeaderboards, getAllEnrolledProgram } from '@services/api'

// Redux
import { setInvalidToken } from '@store/slices/authSlice'
import { getProfileUser } from '@store/slices/leaderboardSlice'

// Hooks
import { useResponsive } from '@hooks/useResponsive'
import { useTranslation } from 'react-i18next'

// Components
import Loader from '@components/common/Loader'

// Utils
import { getCompanyName } from '@/utils'
```

---

## 🎯 Future Improvements

### Short Term

- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add loading skeletons
- [ ] Implement error retry mechanism
- [ ] Add filter presets (top 10, top 50, etc.)

### Medium Term

- [ ] Add pagination untuk mobile (virtual scroll)
- [ ] Add animation transitions
- [ ] Export leaderboards to CSV/PDF
- [ ] Add search by name

### Long Term

- [ ] Real-time updates (WebSocket)
- [ ] Historical leaderboards (past months)
- [ ] Advanced analytics dashboard
- [ ] Gamification features (badges, achievements)

---

## 📞 Support

**Related Files:**

- Route: `/leaderboards` (protected)
- Redux: `leaderboardSlice`, `authSlice`
- API: `getAllLeaderboards`, `getAllEnrolledProgram`

**Common Questions:**

1. **Q:** Mengapa data tidak muncul?
   **A:** Pastikan user sudah enroll ke program dan ada data leaderboards.

2. **Q:** Bagaimana cara ubah stale time?
   **A:** Edit `staleTime` di `useLeaderboards.js` atau `useEnrolledPrograms.js`.

3. **Q:** Bagaimana cara disable 12-month filter?
   **A:** Sudah disabled for production di `useEnrolledPrograms.js` (commented out).

---

**Documentation Version:** 1.0.0  
**Last Updated:** January 2025  
**Status:** ✅ Production Ready
