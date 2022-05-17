import { get } from 'svelte/types/runtime/store'

import { TERMS_OF_SERVICE_VERSION } from '../constants'
import { lastAcceptedTermsOfServiceVersion } from '../stores'

/**
 * Returns true if the user needs to accept the latest Terms of Service.
 */
export function needsToAcceptLatestTermsOfService(): boolean {
    return get(lastAcceptedTermsOfServiceVersion) < TERMS_OF_SERVICE_VERSION
}
