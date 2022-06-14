import { ProfileImportType } from '@core/profile'
import { writable } from 'svelte/store'

export const importType = writable<ProfileImportType>(null)
