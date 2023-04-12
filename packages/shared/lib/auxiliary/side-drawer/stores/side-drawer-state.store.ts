import { writable } from 'svelte/store'
import { ISideDrawerState } from '../interfaces'
import { DEFAULT_SIDE_DRAWER_STATE } from '../constants'

export const sideDrawerState = writable<ISideDrawerState>(DEFAULT_SIDE_DRAWER_STATE)
