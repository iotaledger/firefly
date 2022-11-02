import { persistent } from '@core/utils/store'

/**
 * The store containing the last accepted version of the Terms of Service.
 *
 * Note: The initial value must be set to 1 to support existing users and alert them
 */
export const lastAcceptedTermsOfService = persistent<number>('lastAcceptedTos', 1)
