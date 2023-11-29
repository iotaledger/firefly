import { writable } from 'svelte/store'

import { IProfileManager } from '@core/profile-manager'

// TODO(2.0) Fix this
export const shimmerClaimingProfileManager = writable<IProfileManager>(null)
