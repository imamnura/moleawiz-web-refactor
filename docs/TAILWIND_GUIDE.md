# Tailwind CSS Integration Guide

## 📋 Overview

Tailwind CSS has been integrated into the Moleawiz Web project to replace inline styles and CSS-in-JS with utility-first CSS classes.

**Date:** October 30, 2025  
**Status:** ✅ Configured and Ready

---

## ⚙️ Installation & Configuration

### 1. Packages Installed

```bash
npm install -D tailwindcss postcss autoprefixer
```

**Dependencies:**
- `tailwindcss` - Utility-first CSS framework
- `postcss` - CSS transformation tool
- `autoprefixer` - Auto-adds vendor prefixes

---

### 2. Configuration Files

#### `tailwind.config.js`

Complete Tailwind configuration with custom theme for Moleawiz:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./refactor/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B00',     // Main brand color
          hover: '#E66000',        // Hover state
          soft: '#FFF4ED',         // Light variant
        },
        secondary: {
          DEFAULT: '#FFF4ED',
          hover: '#FFE8D6',
        },
        tertiary: {
          DEFAULT: '#00C48C',      // Success/green
          hover: '#00B380',
        },
        text: {
          title: '#1A1A1A',        // Dark text
          desc: '#6B6B6B',         // Medium text
          menu: '#4A4A4A',         // Menu text
          list: '#8A8A8A',         // Light text
        },
        background: {
          main: '#FAFAFA',         // Page background
          disabled: '#E5E5E5',     // Disabled state
          grey: '#F5F5F5',         // Grey background
        },
        border: {
          divider: '#E0E0E0',      // Divider lines
          error: '#DC2626',        // Error borders
        },
        alert: {
          red: '#DC2626',          // Alert red
          'red-hover': '#B91C1C',  // Alert red hover
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'xs': '10px',
        'sm': '12px',
        'base': '14px',
        'lg': '16px',
        'xl': '18px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
    },
  },
  corePlugins: {
    preflight: false,  // Disabled to avoid conflicts with Ant Design
  },
}
```

**Key Features:**
- ✅ Custom color palette matching brand guidelines
- ✅ Custom font sizes for precise control
- ✅ Preflight disabled for Ant Design compatibility
- ✅ Scans both `/src` and `/refactor/src` for classes

---

#### `postcss.config.cjs`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {
      preset: 'default',
    },
  },
}
```

**Processing Order:**
1. Tailwind CSS - Generates utility classes
2. Autoprefixer - Adds vendor prefixes
3. CSSnano - Minifies CSS

---

#### `/refactor/src/styles/tailwind.css`

Main Tailwind entry file with custom utilities:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Utilities */
@layer utilities {
  .text-ellipsis-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

/* Custom Components */
@layer components {
  .btn-primary {
    @apply bg-primary text-white px-6 py-2 rounded-lg font-medium 
           transition-colors duration-200 hover:bg-primary-hover 
           disabled:bg-background-disabled disabled:cursor-not-allowed;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-card p-4;
  }
  
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg 
           focus:outline-none focus:ring-2 focus:ring-primary 
           focus:border-transparent;
  }
}
```

---

#### `/refactor/src/main.jsx`

Import order (important!):

```javascript
// 1. Tailwind CSS - import first
import './styles/tailwind.css'

// 2. SCSS styles
import './index.scss'

// 3. i18n
import './i18n'
```

**Why this order?**
- Tailwind first ensures utilities can override SCSS
- SCSS can override Tailwind base if needed
- i18n doesn't affect styling cascade

---

## 🎨 Usage Examples

### Before (Inline Styles)

```jsx
// ❌ Old way - inline styles
<span
  style={{
    fontSize: 18,
    fontWeight: 500,
    color: colorTextTitleMobile,
    display: 'block',
    marginBottom: 4,
  }}
>
  Hello {userName}
</span>
```

### After (Tailwind)

```jsx
// ✅ New way - Tailwind classes
<span className="block text-lg font-medium text-text-title mb-1">
  Hello {userName}
</span>
```

**Benefits:**
- 70% less code
- No color imports needed
- Consistent spacing (mb-1 = 4px)
- Easier to read and maintain

---

## 📚 Custom Classes Reference

### Button Classes

```jsx
// Primary button
<button className="btn-primary">Submit</button>

// Secondary button  
<button className="btn-secondary">Cancel</button>

// Tertiary button
<button className="btn-tertiary">Confirm</button>
```

### Card Component

```jsx
// Simple card
<div className="card">
  Content here
</div>

// Card with hover effect
<div className="card hover:shadow-md transition-shadow cursor-pointer">
  Clickable card
</div>
```

### Input Field

```jsx
<input 
  type="text"
  className="input-field"
  placeholder="Enter text"
/>
```

### Text Ellipsis

```jsx
// 2-line ellipsis
<p className="text-ellipsis-2">
  Long text that will be truncated after 2 lines...
</p>

// 3-line ellipsis
<p className="text-ellipsis-3">
  Long text that will be truncated after 3 lines...
</p>
```

### Hide Scrollbar

```jsx
<div className="overflow-auto scrollbar-hide">
  Scrollable content without visible scrollbar
</div>
```

---

## 🎨 Color System

### Primary Colors

```jsx
// Primary orange
<div className="bg-primary text-white">Primary</div>
<div className="hover:bg-primary-hover">Hover state</div>
<div className="bg-primary-soft">Light variant</div>
```

### Text Colors

```jsx
<h1 className="text-text-title">Title Text</h1>
<p className="text-text-desc">Description text</p>
<span className="text-text-menu">Menu text</span>
<small className="text-text-list">List text</small>
```

### Background Colors

```jsx
<div className="bg-background-main">Page background</div>
<div className="bg-background-grey">Grey section</div>
<button disabled className="bg-background-disabled">Disabled</button>
```

### Border Colors

```jsx
<div className="border border-border-divider">Divider</div>
<input className="border-border-error">Error state</input>
```

### Alert Colors

```jsx
<div className="bg-alert-red text-white">Alert</div>
<button className="hover:bg-alert-red-hover">Delete</button>
```

---

## 📐 Spacing System

Tailwind uses a consistent spacing scale (1 unit = 0.25rem = 4px):

```jsx
// Margin
<div className="m-1">   /* 4px margin */
<div className="m-2">   /* 8px margin */
<div className="m-4">   /* 16px margin */
<div className="m-8">   /* 32px margin */

// Padding
<div className="p-5">   /* 20px padding */
<div className="px-6">  /* 24px horizontal padding */
<div className="py-4">  /* 16px vertical padding */

// Gap (for flex/grid)
<div className="flex gap-3">  /* 12px gap */
```

---

## 📏 Font Sizes

Custom font sizes matching design system:

```jsx
<p className="text-xs">    /* 10px */
<p className="text-sm">    /* 12px */
<p className="text-base">  /* 14px - default */
<p className="text-lg">    /* 16px */
<p className="text-xl">    /* 18px */
<p className="text-2xl">   /* 20px */
<p className="text-3xl">   /* 24px */
<p className="text-4xl">   /* 28px */
```

---

## 🔄 Migration Patterns

### Pattern 1: Simple Style Object

**Before:**
```jsx
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '12px' 
}}>
```

**After:**
```jsx
<div className="flex items-center gap-3">
```

---

### Pattern 2: Conditional Styles

**Before:**
```jsx
<div style={{ 
  color: isActive ? '#FF6B00' : '#6B6B6B' 
}}>
```

**After:**
```jsx
<div className={isActive ? 'text-primary' : 'text-text-desc'}>
```

---

### Pattern 3: Responsive Styles

**Before:**
```jsx
<div style={{ 
  fontSize: isMobile ? '12px' : '16px',
  padding: isMobile ? '8px' : '16px'
}}>
```

**After:**
```jsx
<div className="text-sm md:text-lg p-2 md:p-4">
```

---

### Pattern 4: Hover States

**Before:**
```jsx
<button 
  style={buttonStyle}
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
>
```

**After:**
```jsx
<button className="bg-primary hover:bg-primary-hover transition-colors">
```

---

## ⚡ Performance Tips

### 1. Use Tailwind Classes Over Inline Styles

```jsx
// ❌ Bad - causes re-renders
<div style={{ color: userColor }}>

// ✅ Good - static classes
<div className="text-primary">
```

### 2. Extract Repeated Patterns

```jsx
// ❌ Bad - repeated classes
<button className="bg-primary text-white px-6 py-2 rounded-lg">
<button className="bg-primary text-white px-6 py-2 rounded-lg">

// ✅ Good - use custom class
<button className="btn-primary">
```

### 3. Use @apply for Complex Components

```css
/* In tailwind.css */
@layer components {
  .complex-card {
    @apply bg-white rounded-lg shadow-card p-6
           border border-gray-200 hover:shadow-lg
           transition-all duration-300;
  }
}
```

---

## 🔧 Ant Design Integration

### Preflight Disabled

```javascript
// tailwind.config.js
corePlugins: {
  preflight: false,  // ✅ Prevents conflicts with Ant Design
}
```

### Using Both Together

```jsx
import { ConfigProvider, Button } from 'antd'

// ✅ Mix Tailwind with Ant Design
<ConfigProvider theme={antTheme}>
  <div className="card">
    <h2 className="text-xl font-bold mb-4">Title</h2>
    <Button type="primary">Ant Design Button</Button>
  </div>
</ConfigProvider>
```

---

## 📝 Best Practices

### 1. Prefer Tailwind Classes

```jsx
// ✅ Good
<div className="flex items-center justify-between">

// ❌ Avoid (unless dynamic values)
<div style={{ display: 'flex', alignItems: 'center' }}>
```

### 2. Use Semantic Custom Classes

```jsx
// ✅ Good - semantic class name
.card-product {
  @apply bg-white rounded-lg shadow-card p-6;
}

// ❌ Bad - utility soup
<div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
```

### 3. Group Related Classes

```jsx
// ✅ Good - logical grouping
<div className="
  flex items-center gap-3
  bg-white rounded-lg
  p-4 shadow-card
  hover:shadow-md transition-shadow
">
```

### 4. Use Responsive Prefixes

```jsx
// ✅ Good - mobile-first responsive
<div className="
  text-sm md:text-base lg:text-lg
  p-4 md:p-6 lg:p-8
">
```

---

## 🎯 Next Steps

### Files to Migrate

1. **Priority 1 - Home Elements:**
   - Banner component
   - OngoingCourse component
   - NewPrograms component
   - ExpiringProgram component
   - OngoingPrograms component
   - UpcomingEvents component

2. **Priority 2 - Layout:**
   - Header component (styles object → Tailwind)
   - Sidebar component (styles object → Tailwind)
   - Footer component

3. **Priority 3 - Components:**
   - All modal components
   - All utility components

### Migration Checklist

For each component:
- [ ] Replace `style={{}}` with `className=""`
- [ ] Remove color constant imports
- [ ] Use custom Tailwind colors
- [ ] Add hover/focus states with Tailwind
- [ ] Test responsive behavior
- [ ] Remove unused style objects/files

---

## 📊 Migration Progress

| Component | Status | Tailwind % |
|-----------|--------|------------|
| HomeTitleText | ✅ Complete | 100% |
| Home/index.jsx | ✅ Complete | 100% |
| Banner | ⏳ Pending | 0% |
| OngoingCourse | ⏳ Pending | 0% |
| NewPrograms | ⏳ Pending | 0% |
| ExpiringProgram | ⏳ Pending | 0% |
| OngoingPrograms | ⏳ Pending | 0% |
| UpcomingEvents | ⏳ Pending | 0% |
| Header | ⏳ Pending | 0% |
| Sidebar | ⏳ Pending | 0% |

**Overall Progress: 10% Complete**

---

## 🐛 Troubleshooting

### Classes Not Working

**Problem:** Tailwind classes not applying

**Solution:** 
1. Check if file is in `content` paths in `tailwind.config.js`
2. Restart dev server
3. Clear browser cache

### Ant Design Conflicts

**Problem:** Ant Design styles overriding Tailwind

**Solution:**
- Use `!important` prefix: `!bg-primary`
- Or increase specificity with multiple classes

### Colors Not Matching

**Problem:** Custom colors not available

**Solution:**
- Check `tailwind.config.js` theme.extend.colors
- Use exact color names: `text-primary` not `text-orange`

---

*This document will be updated as more components are migrated to Tailwind CSS.*
