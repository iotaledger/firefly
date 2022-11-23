import { Activity } from '@core/wallet'
import { writable } from 'svelte/store'

export const selectedActivity = writable<Activity>(null)
