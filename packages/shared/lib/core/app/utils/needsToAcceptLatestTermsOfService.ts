import { get } from 'svelte/store'

import { TERMS_OF_SERVICE_VERSION } from '../constants'
import { lastAcceptedTermsOfService } from '../stores'

/**
 * Returns true if the user has NOT accepted the latest version of the Terms of Service.
 */
export const needsToAcceptLatestTermsOfService = (): boolean =>
    get(lastAcceptedTermsOfService) < TERMS_OF_SERVICE_VERSION
