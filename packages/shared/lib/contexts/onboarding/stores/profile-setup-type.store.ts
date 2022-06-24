import { writable } from 'svelte/store'

import { ProfileSetupType } from '../enums'

export const profileSetupType = writable<ProfileSetupType>(null)
