import { persistent } from '@lib/helpers'

/**
 * The version of the Terms of Service that the user last accepted
 *
 * Note: The initial value must be set to 1 to support existing users and alert them
 */
export const lastAcceptedTermsOfService = persistent<number>('lastAcceptedTos', 1)
