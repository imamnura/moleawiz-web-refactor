# Help Page Refactor - Complete Implementation Guide

**Date**: 31 Oktober 2025  
**Status**: ✅ STRUCTURE COMPLETE - Ready for topic pages implementation

---

## Overview

Help page telah di-refactor dengan arsitektur modern menggunakan:

- ✅ **Feature-based structure** (`src/features/help/`)
- ✅ **Reusable components** (Sidebar, Header, Modal, Content Wrapper)
- ✅ **Custom hooks** (useHelpNavigation, useUserProfile)
- ✅ **Tailwind CSS** untuk styling
- ✅ **Centralized data** (helpTopics.js)

---

## File Structure

```
src/
├── features/help/
│   ├── components/
│   │   ├── HelpSidebar.jsx              ✅ Desktop sidebar navigation
│   │   ├── HelpContentWrapper.jsx       ✅ Desktop/Mobile content wrapper
│   │   ├── MobileHelpHeader.jsx         ✅ Mobile sticky header with topic selector
│   │   ├── MobileContactSection.jsx     ✅ Mobile email contact section
│   │   └── TopicSelectModal.jsx         ✅ Mobile topic selection modal
│   ├── hooks/
│   │   ├── useHelpNavigation.js         ✅ Topic navigation & active state
│   │   └── useUserProfile.js            ✅ User profile for email contact
│   ├── data/
│   │   └── helpTopics.js                ✅ Centralized topic configuration
│   └── pages/                           ⏳ TODO: Topic content pages
│       ├── FAQPage.jsx
│       ├── LoginPage.jsx
│       ├── ProfilePage.jsx
│       ├── MyLearningJourneyPage.jsx
│       ├── LearningActivityPage.jsx
│       ├── LearningPointPage.jsx
│       ├── SupervisorReviewerPage.jsx
│       ├── DataSecurityPage.jsx
│       ├── OthersPage.jsx
│       ├── TermOfServicePage.jsx
│       └── PrivacyPolicyPage.jsx
└── pages/help/
    └── HelpPage.jsx                     ✅ Main layout component
```

---

## Components Created

### 1. HelpPage.jsx (Main Layout)

**Location**: `src/pages/help/HelpPage.jsx`

**Features**:

- Layout dengan Sider (desktop) dan Content area
- Auto-redirect dari `/help` ke `/help/faq`
- Mobile header dengan topic selector
- Responsive sidebar hide/show
- Scroll to top on topic change (mobile)

**Props**: None (uses Outlet context)

---

### 2. HelpSidebar.jsx

**Location**: `src/features/help/components/HelpSidebar.jsx`

**Features**:

- List of 11 help topics
- Email contact section
- Active topic highlighting
- Click handler for menu navigation

**Props**:

```javascript
{
  onMenuClick: Function,     // Menu click handler
  userData: Object,          // User data from context
  userProfile: Object,       // User profile details
  loadingProfile: Boolean    // Loading state
}
```

---

### 3. MobileHelpHeader.jsx

**Location**: `src/features/help/components/MobileHelpHeader.jsx`

**Features**:

- Sticky header with banner background
- Topic selector dropdown
- Responsive design

**Props**:

```javascript
{
  selectedTopic: String,     // Current selected topic label
  onTopicClick: Function     // Handler to open modal
}
```

---

### 4. TopicSelectModal.jsx

**Location**: `src/features/help/components/TopicSelectModal.jsx`

**Features**:

- Modal with topic list
- Checkmark on selected topic
- Close and select handlers

**Props**:

```javascript
{
  visible: Boolean,          // Modal visibility
  onClose: Function,         // Close handler
  onSelect: Function,        // Topic selection handler
  selectedTopic: String,     // Current topic label
  isMobile: Boolean          // Mobile flag for width
}
```

---

### 5. HelpContentWrapper.jsx

**Location**: `src/features/help/components/HelpContentWrapper.jsx`

**Exports**: `DesktopContentWrapper`, `HelpTopicCollapse`

**DesktopContentWrapper Features**:

- Banner with topic title (desktop)
- Background extension (mobile)
- Responsive wrapper

**HelpTopicCollapse Features**:

- Reusable Collapse component
- Consistent styling
- Image support
- Accordion behavior

**Props**:

```javascript
// DesktopContentWrapper
{
  topicLabel: String,        // Topic display label
  children: ReactNode,       // Content
  isMobile: Boolean          // Mobile flag
}

// HelpTopicCollapse
{
  items: Array<{             // Collapse items
    key: String,
    label: String|ReactNode,
    content: ReactNode
  }>,
  isMobile: Boolean          // Mobile flag
}
```

---

### 6. MobileContactSection.jsx

**Location**: `src/features/help/components/MobileContactSection.jsx`

**Features**:

- Email contact button
- User data integration
- Loading skeleton

**Props**:

```javascript
{
  userData: Object,
  userProfile: Object,
  loadingProfile: Boolean
}
```

---

## Custom Hooks

### 1. useHelpNavigation

**Location**: `src/features/help/hooks/useHelpNavigation.js`

**Purpose**: Manage topic navigation state

**Returns**:

```javascript
{
  activeTopic: String,           // Current topic key (e.g., 'faq')
  selectedLabel: String,         // Current topic label (translated)
  modalVisible: Boolean,         // Modal state
  setModalVisible: Function,     // Set modal state
  navigateToTopic: Function,     // Navigate to topic by label
  getCurrentTopic: Function      // Get topic from URL
}
```

---

### 2. useUserProfile

**Location**: `src/features/help/hooks/useUserProfile.js`

**Purpose**: Fetch user profile for email contact

**Returns**:

```javascript
{
  loading: Boolean,              // Loading state
  profile: Object|null,          // User profile details
  userData: Object               // User data from context
}
```

---

## Data Configuration

### helpTopics.js

**Location**: `src/features/help/data/helpTopics.js`

**Exports**:

1. `HELP_TOPICS` - Topic key constants
2. `getHelpTopicItems(t, i18nLanguage)` - Navigation items
3. `getMobileTopicOptions(t)` - Mobile modal options
4. `mapLabelToRoute(label, t)` - Convert label to route
5. `mapRouteToLabel(route, t)` - Convert route to label

**Topic Keys**:

```javascript
{
  FAQ: 'faq',
  LOGIN: 'login',
  PROFILE: 'profile',
  MY_LEARNING_JOURNEY: 'mylearningjourney',
  LEARNING_ACTIVITY: 'learningactivity',
  LEARNING_POINT: 'learningpoint',
  SUPERVISOR_REVIEWER: 'supervisorreviewer',
  DATA_SECURITY: 'datasecurity',
  OTHERS: 'others',
  TERM_OF_SERVICE: 'termofservice',
  PRIVACY_POLICY: 'privacypolicy',
}
```

---

## How to Create Topic Pages

### Template Structure

```jsx
import { useTranslation } from 'react-i18next'
import { useResponsive } from '@/hooks/useResponsive'
import { useUserProfile } from '@features/help/hooks/useUserProfile'
import {
  DesktopContentWrapper,
  HelpTopicCollapse,
} from '@features/help/components/HelpContentWrapper'
import MobileContactSection from '@features/help/components/MobileContactSection'

const TopicPage = () => {
  const { t, i18n } = useTranslation()
  const { isMobile } = useResponsive()
  const { loading, profile, userData } = useUserProfile()

  // Define collapse items
  const items = [
    {
      key: '1',
      label: t('...title'),
      content: (
        <>
          <div>{t('...description')}</div>
          {/* Add images if needed */}
        </>
      ),
    },
    // ... more items
  ]

  return (
    <DesktopContentWrapper
      topicLabel={t('feature.feature_help.side_dpd.topic_name')}
      isMobile={isMobile}
    >
      <HelpTopicCollapse items={items} isMobile={isMobile} />

      {/* Mobile contact section */}
      {isMobile && (
        <MobileContactSection
          userData={userData}
          userProfile={profile}
          loadingProfile={loading}
        />
      )}
    </DesktopContentWrapper>
  )
}

export default TopicPage
```

---

## Example: FAQ Page

```jsx
import { useTranslation, Trans } from 'react-i18next'
import { Image } from 'antd'
import { useResponsive } from '@/hooks/useResponsive'
import { useUserProfile } from '@features/help/hooks/useUserProfile'
import {
  DesktopContentWrapper,
  HelpTopicCollapse,
} from '@features/help/components/HelpContentWrapper'
import MobileContactSection from '@features/help/components/MobileContactSection'
import FaQ1_en from '@/assets/images/png/help/element/EN_1. Frequently Asked Question_1.png'
import FaQ1_id from '@/assets/images/png/help/element/ID_1. Pertanyaan yang Sering Diajukan_1.png'

const FAQPage = () => {
  const { t, i18n } = useTranslation()
  const { isMobile } = useResponsive()
  const { loading, profile, userData } = useUserProfile()

  const imageWidth = isMobile ? '100%' : 500

  const items = [
    {
      key: '1',
      label: <Trans i18nKey="feature.help_content.faq.t_1.title" />,
      content: (
        <>
          <Trans i18nKey="feature.help_content.faq.t_1.desc_1" /> <br />
          <Trans i18nKey="feature.help_content.faq.t_1.desc_2" />
          <Image
            src={i18n.language === 'en' ? FaQ1_en : FaQ1_id}
            preview={false}
            width={imageWidth}
            className="mt-2.5"
          />
        </>
      ),
    },
    {
      key: '2',
      label: t('feature.help_content.faq.t_2.title'),
      content: t('feature.help_content.faq.t_2.desc_1'),
    },
    // ... more items
  ]

  return (
    <DesktopContentWrapper
      topicLabel={t('feature.feature_help.side_dpd.frequently_asked_questions')}
      isMobile={isMobile}
    >
      <HelpTopicCollapse items={items} isMobile={isMobile} />

      {isMobile && (
        <MobileContactSection
          userData={userData}
          userProfile={profile}
          loadingProfile={loading}
        />
      )}
    </DesktopContentWrapper>
  )
}

export default FAQPage
```

---

## Routing Configuration

Add to `src/router/index.jsx`:

```jsx
import HelpPage from '@/pages/help/HelpPage'
import FAQPage from '@features/help/pages/FAQPage'
import LoginPage from '@features/help/pages/LoginPage'
// ... import other topic pages

{
  path: '/help',
  element: <HelpPage />,
  children: [
    { path: 'faq', element: <FAQPage /> },
    { path: 'login', element: <LoginPage /> },
    { path: 'profile', element: <ProfilePage /> },
    { path: 'mylearningjourney', element: <MyLearningJourneyPage /> },
    { path: 'learningactivity', element: <LearningActivityPage /> },
    { path: 'learningpoint', element: <LearningPointPage /> },
    { path: 'supervisorreviewer', element: <SupervisorReviewerPage /> },
    { path: 'datasecurity', element: <DataSecurityPage /> },
    { path: 'others', element: <OthersPage /> },
    { path: 'termofservice', element: <TermOfServicePage /> },
    { path: 'privacypolicy', element: <PrivacyPolicyPage /> },
  ],
}
```

---

## Styling Notes

### Desktop

- Sidebar width: `390px`
- Sidebar background: `#F5F5F5`
- Content padding: `0 42px 25px 42px`
- Banner height: `130px`
- Banner positioned: `-top-[130px]` (negative to overlap)

### Mobile

- Sticky header height: `118px`
- Header z-index: `z-4`
- Content padding: `px-[18px] py-6`
- Background extension height: `48px`
- Negative margin: `-mt-3.5`, `-mt-[57px]`

### Collapse Component

- Border: `border border-[#E5E5E6]`
- Header padding: `20px`
- Content padding: `0 20px 20px 20px`
- Expand icon: Circular background `bg-[#E5E5E6]`

---

## Key Improvements vs Old Implementation

### 1. Code Organization ✅

**Old**: Monolithic index.jsx (300+ lines)  
**New**: Feature-based with 6 reusable components

### 2. Data Management ✅

**Old**: Hardcoded arrays in component  
**New**: Centralized helpTopics.js configuration

### 3. Styling ✅

**Old**: Inline styles object + CSS  
**New**: Tailwind CSS utilities

### 4. State Management ✅

**Old**: Multiple useState in one component  
**New**: Custom hooks (useHelpNavigation, useUserProfile)

### 5. Responsiveness ✅

**Old**: Manual breakpoint checks + isScallingVersion  
**New**: useResponsive hook with clean isMobile flag

### 6. Reusability ✅

**Old**: Duplicate code across 11 topic files  
**New**: Single HelpTopicCollapse component reused

---

## TODO: Topic Pages Implementation

### Required Topic Pages (11 total)

1. **FAQPage.jsx** ⏳
   - 5 collapse items
   - 3 images (FaQ1, FaQ3, FaQ4)
   - Trans components for i18n

2. **LoginPage.jsx** ⏳
   - 3 collapse items
   - 1 image (Login2)
   - Italic for "Login" in Indonesian

3. **ProfilePage.jsx** ⏳
   - Multiple collapse items
   - Profile-related images
   - Contact info

4. **MyLearningJourneyPage.jsx** ⏳
   - 6+ collapse items
   - Multiple images (MLJ series)
   - Journey flow screenshots

5. **LearningActivityPage.jsx** ⏳
   - Activity-related content
   - Images for activity types

6. **LearningPointPage.jsx** ⏳
   - Point system explanation
   - Reward mechanics

7. **SupervisorReviewerPage.jsx** ⏳
   - Supervisor/Reviewer roles
   - Workflow images

8. **DataSecurityPage.jsx** ⏳
   - Security policies
   - Data protection info

9. **OthersPage.jsx** ⏳
   - Miscellaneous topics
   - General help items

10. **TermOfServicePage.jsx** ⏳
    - Legal terms (English only)
    - Multiple sections
    - 400+ lines of content

11. **PrivacyPolicyPage.jsx** ⏳
    - Privacy policies (English only)
    - Multiple sections
    - 1000+ lines of content

---

## Estimated Work Remaining

| Task                     | Time          | Priority |
| ------------------------ | ------------- | -------- |
| Create 11 topic pages    | 4-6 hours     | HIGH     |
| Test all topics          | 1 hour        | HIGH     |
| Test responsive behavior | 30 min        | MEDIUM   |
| Test email contact       | 15 min        | MEDIUM   |
| Add to router            | 15 min        | HIGH     |
| **TOTAL**                | **6-8 hours** |          |

---

## Testing Checklist

### Desktop

- [ ] Sidebar visible and fixed width
- [ ] All 11 topics clickable
- [ ] Active topic highlighted
- [ ] Email contact works
- [ ] Collapse expand/contract
- [ ] Images load correctly
- [ ] Banner displays properly
- [ ] Scroll behavior smooth

### Mobile

- [ ] Sidebar hidden
- [ ] Sticky header visible
- [ ] Topic selector modal opens
- [ ] Modal shows all 11 topics
- [ ] Selected topic has checkmark
- [ ] Navigation works from modal
- [ ] Mobile contact section visible
- [ ] Background extension displays
- [ ] Collapse works on mobile

### Both

- [ ] Translation switches (EN/ID)
- [ ] Images switch by language
- [ ] URL updates on navigation
- [ ] Direct URL access works
- [ ] Redirect from /help to /help/faq
- [ ] No console errors
- [ ] Loading states work
- [ ] User data loads correctly

---

## Next Steps

1. **Create topic pages** (use template above)
2. **Add routing configuration**
3. **Test all flows**
4. **Document any issues**
5. **Mark as complete**

---

**Status**: 🟡 **80% COMPLETE**  
**Blocking**: Topic page content migration (11 files)  
**ETA**: 6-8 hours for full completion
