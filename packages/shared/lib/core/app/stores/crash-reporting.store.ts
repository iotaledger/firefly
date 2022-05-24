import { persistent } from '@lib/helpers'

/**
 * The store containing a boolean value for if the user has already been prompted to choose
 * between sending or not sending crash reports.
 */
export const isAwareOfCrashReporting = persistent<boolean>('isAwareOfCrashReporting', false)
