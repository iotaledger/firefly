import { writable } from 'svelte/store'
import { IDrawerState } from '../interfaces'
import { DEFAULT_DRAWER_STATE } from '../constants'

export const drawerState = writable<IDrawerState>(DEFAULT_DRAWER_STATE)
