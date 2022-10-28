import { persistent } from '@core/utils/store'

/**
 * The store containing the last accepted version of the Privacy Policy.
 *
 * Note: The initial value must be set to 1 to support existing users and alert them
 */
export const lastAcceptedPrivacyPolicy = persistent<number>('lastAcceptedPrivacyPolicy', 1)
