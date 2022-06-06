import { writable } from 'svelte/store'
import { IProfileManager } from '../interfaces'

export const profileManager = writable<IProfileManager>(null)
