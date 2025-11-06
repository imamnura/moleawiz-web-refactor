# Home & Components API Hooks Quick Reference

## 📖 Overview

This guide covers all new API hooks created for Home page and components refactoring.

---

## 🔍 Query Hooks (useQuery)

Query hooks are for **fetching/reading** data. They automatically manage caching, loading, and error states.

### useUserProfile()

**Purpose:** Fetch user profile data

```javascript
import { useUserProfile } from '@/api/hooks'

const MyComponent = () => {
  const { 
    data: userData,      // User profile data
    isLoading,           // Loading state
    isError,             // Error state
    error,               // Error object
    refetch              // Manual refetch function
  } = useUserProfile()

  if (isLoading) return <Loader />
  if (isError) return <div>Error: {error.message}</div>

  return <div>Hello {userData.firstname}!</div>
}
```

**Returns:**
```javascript
{
  id: number,
  firstname: string,
  lastname: string,
  position: string,
  points: number,
  picture: string,
  username: string,
  created_at: string,
  is_supervisor: number,
  directorate: string,
  division: string,
  department: string,
  // ... more fields
}
```

**Cache:** 5 minutes stale time, 10 minutes cache time

---

### useAllJourneyData()

**Purpose:** Fetch all journey data for the user

```javascript
import { useAllJourneyData } from '@/api/hooks'

const MyComponent = () => {
  const { 
    data: journeyData,
    isLoading,
    refetch
  } = useAllJourneyData()

  return (
    <div>
      <p>Total Journeys: {journeyData?.total}</p>
      <p>Completed: {journeyData?.complete}</p>
      {journeyData?.journeys?.map(journey => (
        <div key={journey.id}>{journey.name}</div>
      ))}
    </div>
  )
}
```

**Returns:**
```javascript
{
  journeys: [
    {
      id: number,
      name: string,
      description: string,
      thumbnail: string,
      course: [...],  // Array of courses
      // ... more fields
    }
  ],
  total: number,
  complete: number
}
```

**Cache:** 2 minutes stale time, 5 minutes cache time  
**Auto-invalidates:** When module is completed

---

### useNotifications(type)

**Purpose:** Fetch notifications by type

```javascript
import { useNotifications } from '@/api/hooks'

const MyComponent = () => {
  const { 
    data: notifications = [],
    isLoading 
  } = useNotifications('my_learning_journey')

  // type can be:
  // - 'my_learning_journey'
  // - 'content_library'

  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id}>{notif.message}</div>
      ))}
    </div>
  )
}
```

**Returns:** `Array` of notifications

**Cache:** 1 minute stale time, 3 minutes cache time  
**Conditional:** Only fetches if `type` is provided

---

### useCheckRating(moduleId)

**Purpose:** Check if module has rating requirements

```javascript
import { useCheckRating } from '@/api/hooks'

const ModuleRating = ({ moduleId }) => {
  const { 
    data: ratingData,
    isLoading 
  } = useCheckRating(moduleId)

  if (!ratingData) return null

  return (
    <div>
      <p>Has Rating: {ratingData.has_rating ? 'Yes' : 'No'}</p>
      <p>Is Submitted: {ratingData.is_submit ? 'Yes' : 'No'}</p>
      <p>Is Completed: {ratingData.is_completed ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

**Returns:**
```javascript
{
  has_rating: number,   // 0 or 1
  is_submit: number,    // 0 or 1
  is_completed: number  // 0 or 1
}
```

**Conditional:** Only fetches if `moduleId` is provided

---

### usePointHistory()

**Purpose:** Fetch user's point transaction history

```javascript
import { usePointHistory } from '@/api/hooks'

const PointHistoryModal = () => {
  const { 
    data: pointHistory = [],
    refetch,
    isLoading
  } = usePointHistory({
    enabled: false  // Manual fetch only
  })

  const handleOpen = () => {
    refetch()  // Fetch when modal opens
  }

  return (
    <button onClick={handleOpen}>
      Show Point History
    </button>
  )
}
```

**Returns:** `Array` of point transactions

**Cache:** 1 minute stale time  
**Default:** Manual fetch (`enabled: false`)

---

### useTeamStatus(isMobileVersion)

**Purpose:** Fetch team monitoring status

```javascript
import { useTeamStatus } from '@/api/hooks'

const TeamMonitoring = ({ isMobileVersion }) => {
  const { 
    data: teamStatus,
    isLoading 
  } = useTeamStatus(isMobileVersion)

  return (
    <div>
      {teamStatus?.teams?.map(team => (
        <div key={team.id}>{team.name}</div>
      ))}
    </div>
  )
}
```

**Note:** Uses different API endpoint for mobile vs desktop

**Cache:** 2 minutes stale time

---

### useModuleReviewed()

**Purpose:** Fetch list of reviewed modules

```javascript
import { useModuleReviewed } from '@/api/hooks'

const ReviewsList = () => {
  const { 
    data: modules = [],
    isLoading 
  } = useModuleReviewed()

  return (
    <div>
      {modules.map(module => (
        <div key={module.module_id}>
          {module.module_name}
        </div>
      ))}
    </div>
  )
}
```

**Returns:** `Array` of reviewed modules

**Cache:** 2 minutes stale time

---

## 🔄 Mutation Hooks (useMutation)

Mutation hooks are for **creating/updating/deleting** data. They don't auto-fetch on mount.

### useCheckBadges()

**Purpose:** Check if user earned badges after completing module

```javascript
import { useCheckBadges } from '@/api/hooks'

const ModuleCompletion = () => {
  const checkBadges = useCheckBadges({
    onSuccess: (data) => {
      if (data.length > 0) {
        console.log('Earned badge:', data[0].name)
      }
    },
    onError: (error) => {
      console.error('Error checking badges:', error)
    }
  })

  const handleCheckBadges = () => {
    checkBadges.mutate({
      journey_id: 1,
      course_id: 2,
      scorm_id: 3
    })
  }

  return (
    <button 
      onClick={handleCheckBadges}
      disabled={checkBadges.isLoading}
    >
      {checkBadges.isLoading ? 'Checking...' : 'Check Badges'}
    </button>
  )
}
```

**Payload:**
```javascript
{
  journey_id: number,
  course_id: number,
  scorm_id: number
}
```

**Returns:**
```javascript
[
  {
    id: number,
    journey_id: number,
    course_id: number,
    name: string,
    description: string,
    has_point: number,
    thumbnail: string,
    type: string,
    journey_name: string
  }
]
```

---

### useClaimPoint()

**Purpose:** Claim achievement points for completing a module

```javascript
import { useClaimPoint } from '@/api/hooks'

const ClaimPoints = () => {
  const claimPoint = useClaimPoint({
    onSuccess: (data) => {
      console.log('Points claimed successfully!')
      // User profile is auto-invalidated and refetched
    }
  })

  const handleClaim = () => {
    claimPoint.mutate({
      userId: 123,
      moduleId: 456
    })
  }

  return (
    <button onClick={handleClaim}>
      Claim Points
    </button>
  )
}
```

**Payload:**
```javascript
{
  userId: number,
  moduleId: number
}
```

**Side Effects:**
- ✅ Auto-invalidates `useUserProfile()` cache
- ✅ User points updated automatically

---

### useCompleteModule()

**Purpose:** Mark a module as completed

```javascript
import { useCompleteModule } from '@/api/hooks'

const CompleteModule = () => {
  const completeModule = useCompleteModule({
    onSuccess: () => {
      console.log('Module marked as completed!')
      // Journey data is auto-invalidated and refetched
    }
  })

  const handleComplete = () => {
    completeModule.mutate({
      journey_id: 1,
      scorm_id: 2,
      module_id: 3,
      course_id: 4
    })
  }

  return (
    <button 
      onClick={handleComplete}
      disabled={completeModule.isLoading}
    >
      {completeModule.isLoading ? 'Completing...' : 'Complete Module'}
    </button>
  )
}
```

**Payload:**
```javascript
{
  journey_id: number,
  scorm_id: number,
  module_id: number,
  course_id: number
}
```

**Side Effects:**
- ✅ Auto-invalidates `useAllJourneyData()` cache
- ✅ Journey progress updated automatically

---

## 🎯 Common Patterns

### 1. Loading States

```javascript
const { data, isLoading, isError, error } = useUserProfile()

if (isLoading) return <Skeleton />
if (isError) return <Alert>{error.message}</Alert>

return <div>{data.firstname}</div>
```

### 2. Manual Refetch

```javascript
const { data, refetch } = useAllJourneyData()

const handleRefresh = () => {
  refetch()
}

return <button onClick={handleRefresh}>Refresh</button>
```

### 3. Conditional Queries

```javascript
// Only fetch when user is logged in
const { data } = useUserProfile({
  enabled: isLoggedIn
})

// Only fetch when module ID exists
const { data } = useCheckRating(moduleId, {
  enabled: !!moduleId
})
```

### 4. Mutation with Callbacks

```javascript
const mutation = useCompleteModule({
  onSuccess: (data) => {
    console.log('Success!', data)
    showSuccessMessage()
  },
  onError: (error) => {
    console.error('Error:', error)
    showErrorMessage()
  }
})

mutation.mutate(payload)
```

### 5. Optimistic Updates

```javascript
const claimPoint = useClaimPoint({
  onMutate: async (variables) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(queryKeys.user.profile())
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(queryKeys.user.profile())
    
    // Optimistically update
    queryClient.setQueryData(queryKeys.user.profile(), (old) => ({
      ...old,
      points: old.points + expectedPoints
    }))
    
    return { previous }
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(
      queryKeys.user.profile(), 
      context.previous
    )
  }
})
```

---

## 🔑 Query Keys Reference

```javascript
import { queryKeys } from '@/config/queryClient'

// User queries
queryKeys.user.profile()         // ['user', 'profile']
queryKeys.user.pointHistory()    // ['user', 'point-history']

// Journey queries
queryKeys.journey.all()          // ['journey']
queryKeys.journey.detail(id)     // ['journey', 'detail', id]

// Notifications
queryKeys.notifications.byType('my_learning_journey')
// ['notifications', 'type', 'my_learning_journey']

// Rating
queryKeys.rating.check(moduleId)  // ['rating', 'check', moduleId]

// Team
queryKeys.team.status(false)      // ['team', 'status', 'desktop']

// Review
queryKeys.review.modules()        // ['review', 'modules']
```

---

## 🛠️ Manual Cache Invalidation

```javascript
import { queryClient, queryKeys } from '@/config/queryClient'

// Invalidate specific query
queryClient.invalidateQueries(queryKeys.user.profile())

// Invalidate all user queries
queryClient.invalidateQueries(queryKeys.user.all)

// Invalidate all journey queries
queryClient.invalidateQueries(queryKeys.journey.all())

// Remove query from cache
queryClient.removeQueries(queryKeys.rating.check(moduleId))

// Clear all cache
queryClient.clear()
```

---

## ⚡ Performance Tips

1. **Use proper stale times** - Don't fetch unnecessarily
   ```javascript
   useUserProfile({
     staleTime: 10 * 60 * 1000 // 10 minutes
   })
   ```

2. **Disable auto-refetch** when not needed
   ```javascript
   usePointHistory({
     enabled: false,           // Manual fetch only
     refetchOnMount: false,
     refetchOnWindowFocus: false
   })
   ```

3. **Use conditional queries** for dependent data
   ```javascript
   const { data: user } = useUserProfile()
   const { data: journeys } = useAllJourneyData({
     enabled: !!user?.id  // Only fetch if user exists
   })
   ```

4. **Leverage cache invalidation** instead of manual refetches
   ```javascript
   // ✅ Good - Auto-invalidates on success
   const mutation = useClaimPoint()
   
   // ❌ Bad - Manual refetch
   mutation.mutate(data)
   refetchUserProfile()
   ```

---

## 🐛 Debugging

### React Query Devtools

Already installed! Press the React Query icon in your browser DevTools to:
- Inspect all queries
- See cache state
- Manually refetch
- Clear cache
- Monitor loading states

### Common Issues

**Issue:** Data not updating after mutation

**Solution:** Check if cache is invalidated
```javascript
useCompleteModule({
  onSuccess: () => {
    queryClient.invalidateQueries(queryKeys.journey.all())
  }
})
```

**Issue:** Query not fetching

**Solution:** Check `enabled` option
```javascript
const { data } = useCheckRating(moduleId, {
  enabled: !!moduleId  // Must be truthy to fetch
})
```

**Issue:** Stale data showing

**Solution:** Adjust stale time or force refetch
```javascript
useUserProfile({
  staleTime: 0,  // Always fetch fresh
  // OR
  refetchOnMount: 'always'
})
```

---

*For more information, see the main documentation: `/refactor/HOME_COMPONENTS_REFACTOR.md`*
