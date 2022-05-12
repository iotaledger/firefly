import { ProfileManager } from '@lib/typings/profileManager'
import { writable } from 'svelte/store'

export const profileManager = writable<ProfileManager>(null)
