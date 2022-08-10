import { writable } from 'svelte/store'

import { IProfileManager } from '@core/profile-manager'

export const iotaProfileManager = writable<IProfileManager>(null)
