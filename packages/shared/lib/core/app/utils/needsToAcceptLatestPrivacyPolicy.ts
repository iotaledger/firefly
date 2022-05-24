import { get } from 'svelte/store'

import { PRIVACY_POLICY_VERSION } from '../constants'
import { lastAcceptedPrivacyPolicy } from '../stores'

/**
 * Returns true if the user has NOT accepted the latest version of the Privacy Policy.
 */
export const needsToAcceptLatestPrivacyPolicy = (): boolean => get(lastAcceptedPrivacyPolicy) < PRIVACY_POLICY_VERSION
