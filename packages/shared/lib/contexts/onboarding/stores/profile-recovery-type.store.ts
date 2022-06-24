import { writable } from 'svelte/store'

import { ProfileRecoveryType } from '../enums'

export const profileRecoveryType = writable<ProfileRecoveryType>(null)
