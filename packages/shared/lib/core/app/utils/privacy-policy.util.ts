import { get } from 'svelte/types/runtime/store'

import { PRIVACY_POLICY_VERSION } from '../constants'
import { lastAcceptedPrivacyPolicyVersion } from '../stores'

/**
 * Returns true if the user needs to accept the latest Privacy Policy.
 */
export function needsToAcceptLatestPrivacyPolicy(): boolean {
    return get(lastAcceptedPrivacyPolicyVersion) < PRIVACY_POLICY_VERSION
}
