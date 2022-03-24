import { persistent } from '@core/utils/storage'

/**
 * A persisted boolean value indicating whether the user has already been prompted to choose
 * between sending or not sending crash reports.
 */
export const isAwareOfCrashReporting = persistent<boolean>('isAwareOfCrashReporting', false)

/**
 * The version of the privacy policy that the user last accepted
 *
 * Note: The initial value must be set to 1 to support existing users and alert them
 */
export const lastAcceptedPrivacyPolicy = persistent<number>('lastAcceptedPrivacyPolicy', 1)

/**
 * The version of the Terms of Service that the user last accepted
 *
 * Note: The initial value must be set to 1 to support existing users and alert them
 */
export const lastAcceptedTos = persistent<number>('lastAcceptedTos', 1)
