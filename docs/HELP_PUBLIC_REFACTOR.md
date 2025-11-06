# HelpPublic Refactor - Implementation Guide

## Overview

Refactored the public help center pages from old implementation to modern architecture using React 19, Tailwind CSS v4, and modular component patterns.

## Architecture

### Folder Structure

```
src/pages/help-public/
├── HelpPublicPage.jsx           # Main page orchestrator
├── components/                   # Shared components
│   ├── HelpPublicSidebar.jsx    # Desktop sidebar navigation
│   ├── HelpPublicMobileHeader.jsx # Mobile sticky header
│   ├── TopicSelectModal.jsx     # Mobile topic selector modal
│   └── HelpPublicContentWrapper.jsx # Reusable content container
├── hooks/                        # Custom hooks
│   ├── useHelpPublicNavigation.js # Topic navigation logic
│   └── useEmailContact.js       # Email contact handler
├── data/                         # Configuration
│   └── helpPublicTopics.js      # All 11 topics config
└── topics/                       # Individual topic pages
    ├── FAQPage.jsx              # FAQ page
    ├── LoginHelpPage.jsx        # Login help page
    └── PrivacyPolicyPage.jsx    # Privacy policy page
    # TODO: Add 8 remaining topic pages
```

### Key Components

#### 1. HelpPublicPage.jsx

Main layout orchestrator with:

- Desktop sidebar navigation (390px width)
- Mobile sticky header with dropdown
- Responsive layout switching
- Auto-redirect `/help-public` → `/help-public/faq`
- Scroll to top on topic change

#### 2. HelpPublicSidebar.jsx

Desktop sidebar with:

- Topic list navigation
- Active state highlighting
- Email contact section at bottom
- Tailwind CSS styling

#### 3. HelpPublicMobileHeader.jsx

Mobile/tablet header with:

- Sticky positioning (z-4)
- Banner background image
- Topic dropdown selector
- Responsive sizing

#### 4. TopicSelectModal.jsx

Mobile topic selector with:

- List of all 11 topics
- Current topic checkmark
- Smooth navigation on select
- Responsive width

#### 5. HelpPublicContentWrapper.jsx

Reusable content wrapper with:

- Desktop banner (130px height)
- Mobile header spacer
- Ant Design Collapse component
- Email contact section (mobile only)
- ConfigProvider theming

### Custom Hooks

#### useHelpPublicNavigation

```javascript
const { currentTopic, navigateToTopic } = useHelpPublicNavigation()
```

- Gets current topic from URL path
- Provides navigation function
- Handles i18n translations

#### useEmailContact

```javascript
const { contactEmail, handleEmailClick, loading } = useEmailContact()
```

- Opens email client with pre-filled subject/body
- Simple implementation for public pages
- No user profile data required

### Data Configuration

#### helpPublicTopics.js

```javascript
export const helpPublicTopics = [
  { key: 'faq', path: '/help-public/faq', label: '...' },
  { key: 'login', path: '/help-public/login', label: 'Login' },
  // ... 9 more topics
]
```

## Responsive Design

### Breakpoints

- **Mobile**: `screens.xs` (Ant Design breakpoint)
- **Scaling**: `window.innerWidth <= 991 && >= 768` or `581px`
- **Desktop**: All other sizes

### Layout Differences

| Feature       | Desktop           | Mobile/Scaling        |
| ------------- | ----------------- | --------------------- |
| Navigation    | Sidebar (390px)   | Sticky header + modal |
| Banner        | 130px full banner | 118px mobile banner   |
| Topic Title   | On banner         | In dropdown           |
| Email Contact | Sidebar bottom    | After collapse items  |
| Font Size     | 14px (base)       | 12px (base)           |

## Styling

### Tailwind CSS v4 Patterns

```jsx
// Correct syntax for v4
className = 'z-4' // Not z-[4]
className = '-mt-3.5' // Not mt-[-14px]
className = 'p-0!' // Not !p-0
```

### Color System

Using constants from `@config/constant/color`:

- Primary: Blue-600
- Background: Gray-50
- Sidebar: White with shadow
- Collapse Header: Gray-100 (#FAFAFA)
- Collapse Content: White

## Topic Pages Pattern

### Structure

```jsx
export default function TopicPage() {
  const { t, i18n } = useTranslation()
  const { isMobile, isScaling } = useOutletContext()

  const items = [
    {
      key: '1',
      label: <div className={listCollapseStyling}>Title</div>,
      children: <div className={contentTextSize}>Content</div>,
    },
    // ... more items
  ]

  return (
    <HelpPublicContentWrapper
      topicTitle={t('translation.key')}
      items={items}
      isMobile={isMobile}
      isScaling={isScaling}
    />
  )
}
```

### Responsive Styling Classes

```javascript
const listCollapseStyling =
  isMobile || isScaling ? 'text-xs font-medium leading-[15px]' : 'font-medium'

const contentTextSize = isMobile || isScaling ? 'text-xs' : 'text-sm'
```

## Routing

### Route Configuration

```javascript
{
  path: '/help-public',
  element: <HelpPublicPage />,
  children: [
    { path: 'faq', element: <FAQPage /> },
    { path: 'login', element: <LoginHelpPage /> },
    { path: 'privacypolicy', element: <PrivacyPolicyPage /> },
    // TODO: Add 8 remaining topics
  ],
}
```

### Public Access

- No authentication required
- No ProtectedRoute wrapper
- Accessible at `/help-public/*`

## Implementation Status

### ✅ Completed (3/11 Topics)

1. FAQ Page - 5 collapse items with images
2. Login Help Page - 3 collapse items with images
3. Privacy Policy Page - 5 collapse items (simplified)

### 📋 Remaining Topics (8/11)

4. Profile & Contacts
5. My Learning Journey
6. Learning Activity
7. Learning Point
8. Supervisor & Reviewer
9. Account Data & Security
10. Others
11. Terms of Service

## Features Preserved

### From Old Implementation

✅ Sidebar navigation (desktop)  
✅ Modal dropdown (mobile)  
✅ Responsive banner  
✅ Collapse/accordion content  
✅ Email contact integration  
✅ Translation support (i18n)  
✅ Active topic highlighting  
✅ Scroll to top on change  
✅ Image support in content

### Improvements Made

🎯 Tailwind CSS v4 (modern utility classes)  
🎯 Reusable components (DRY principle)  
🎯 Custom hooks (separation of concerns)  
🎯 Clean folder structure  
🎯 Type-safe navigation  
🎯 Consistent responsive patterns  
🎯 Reduced inline styles  
🎯 Better code readability

## Next Steps

### To Complete Remaining Topics:

1. Copy existing topic page template (FAQPage.jsx)
2. Update translation keys
3. Add collapse items with content
4. Import images (if needed)
5. Add route to router/index.jsx
6. Test responsive design

### Example Template:

```jsx
import { useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HelpPublicContentWrapper } from '../components/HelpPublicContentWrapper'

export default function NewTopicPage() {
  const { t } = useTranslation()
  const { isMobile, isScaling } = useOutletContext()

  const items = [
    // Add your collapse items here
  ]

  return (
    <HelpPublicContentWrapper
      topicTitle={t('your.translation.key')}
      items={items}
      isMobile={isMobile}
      isScaling={isScaling}
    />
  )
}
```

## Testing Checklist

- [ ] Desktop sidebar navigation works
- [ ] Mobile dropdown selector works
- [ ] All topic links navigate correctly
- [ ] Banner displays correctly (desktop/mobile)
- [ ] Collapse items expand/collapse
- [ ] Email contact link works
- [ ] Responsive breakpoints correct
- [ ] Images load properly
- [ ] Translations work (EN/ID)
- [ ] Auto-redirect to FAQ works
- [ ] Scroll to top on change works

## Dependencies

### New (None - using existing)

All dependencies already installed:

- Ant Design 5.27.6
- Tailwind CSS 4.1.16
- React Router v6
- i18next

### Assets Required

Images from old implementation:

- Banner: `img_banner_help.png`, `img_banner_help_mobile.svg`
- Topic images: Located in `@assets/images/png/help/element/`
- Icons: `ic_email_helptopics.svg`

## Notes

### Special Cases

- **Login topic**: Not translated (keeps "Login" in both EN/ID)
- **Supervisor & Reviewer**: Combines two translation keys
- **Email function**: Simplified for public (no user profile needed)

### Performance

- Lazy loading not needed (small bundle size)
- Images use Ant Design Image component (built-in optimization)
- Collapse destroyInactivePanel={true} (unmount on close)

### Accessibility

- Keyboard navigation supported (Ant Design default)
- Focus indicators preserved
- ARIA labels on interactive elements
- Semantic HTML structure

## Comparison with Old Implementation

| Aspect          | Old                       | New                    |
| --------------- | ------------------------- | ---------------------- |
| Styling         | Inline styles + constants | Tailwind CSS classes   |
| Components      | Single file (600+ lines)  | Modular (4 components) |
| Navigation      | Hardcoded switch          | Config-driven          |
| Email Logic     | Redux + API call          | Simple hook            |
| Responsiveness  | Inline calculations       | Tailwind breakpoints   |
| Reusability     | Low                       | High                   |
| Maintainability | Medium                    | High                   |

---

**Created**: 2024  
**Status**: 3/11 topics complete  
**Next**: Implement remaining 8 topic pages
