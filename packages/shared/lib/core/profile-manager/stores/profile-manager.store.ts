import { get, writable } from 'svelte/store'
import { IProfileManager } from '../interfaces'

export const profileManager = writable<IProfileManager>(null)

export function getProfileManager(): IProfileManager {
    return get(profileManager)
}
