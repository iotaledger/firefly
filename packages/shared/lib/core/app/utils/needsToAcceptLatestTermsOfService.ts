import { get } from 'svelte/store'

import { TERMS_OF_SERVICE_VERSION } from '../constants'
import { lastAcceptedTermsOfService } from '../stores'

export const needsToAcceptLatestTermsOfService = (): boolean =>
    get(lastAcceptedTermsOfService) < TERMS_OF_SERVICE_VERSION
