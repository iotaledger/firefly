import { persistent } from '@lib/helpers'

/**
 * A persisted boolean value indicating whether the user has already been prompted to choose
 * between sending or not sending crash reports.
 */
export const isAwareOfCrashReporting = persistent<boolean>('isAwareOfCrashReporting', false)
