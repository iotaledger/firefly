import { writable } from 'svelte/store'
import { IPersistedProfile } from '../interfaces'

export const newProfile = writable<IPersistedProfile>(null)
