
import type {SimpleProfile} from '../../shared/types'
import { writable } from 'svelte/store'

export const profile = writable<SimpleProfile>(null)
