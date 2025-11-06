import { useGetEnrolledProgramsQuery } from '@services/api'
import { parseISO, differenceInMilliseconds } from 'date-fns'

/**
 * Fetch enrolled programs with RTK Query
 */
export function useEnrolledPrograms() {
  return useGetEnrolledProgramsQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      data: data
        ? [...data].sort((a, b) => a.journey_name.localeCompare(b.journey_name))
        : [],
    }),
    refetchOnMountOrArgChange: 600, // 10 minutes
  })
}

/**
 * Get default program based on last access or enrollment date
 */
export function getDefaultProgram(programs) {
  if (!programs || programs.length === 0) return null

  const currentDateTime = new Date()

  // Check if any program has last_access_journey
  const hasLastAccess = programs.some((p) => p.last_access_journey)

  if (hasLastAccess) {
    // Find nearest last access program
    let nearestProgram = null
    let cachedDiff = Infinity

    programs.forEach((program) => {
      if (!program.last_access_journey) return

      const lastAccessDate =
        typeof program.last_access_journey === 'string'
          ? parseISO(program.last_access_journey)
          : program.last_access_journey

      const diff = differenceInMilliseconds(currentDateTime, lastAccessDate)

      if (diff > 0 && diff < cachedDiff) {
        cachedDiff = diff
        nearestProgram = program
      }
    })

    if (nearestProgram) {
      return parseInt(nearestProgram.journey_id)
    }
  }

  // Fallback to nearest enrollment date
  let nearestProgram = null
  let cachedDiff = Infinity

  programs.forEach((program) => {
    const enrolledDate =
      typeof program.enrolled_date === 'string'
        ? parseISO(program.enrolled_date)
        : program.enrolled_date

    const diff = differenceInMilliseconds(currentDateTime, enrolledDate)

    if (diff > 0 && diff < cachedDiff) {
      cachedDiff = diff
      nearestProgram = program
    }
  })

  return nearestProgram ? parseInt(nearestProgram.journey_id) : null
}
