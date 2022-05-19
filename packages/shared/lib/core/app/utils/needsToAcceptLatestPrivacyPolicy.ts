import { get } from 'svelte/store'

import { PRIVACY_POLICY_VERSION } from '../constants'
import { lastAcceptedPrivacyPolicy } from '../stores'

export const needsToAcceptLatestPrivacyPolicy = (): boolean => get(lastAcceptedPrivacyPolicy) < PRIVACY_POLICY_VERSION
