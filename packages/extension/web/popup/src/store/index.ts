import { writable } from 'svelte/store'
import type {Origin} from '../../../shared/types'

export type Page = '' | 
    'init' | 
    'link' | 
    'wallet' | 
    'origin' | // not connected to:
    'connect' | // connect now!
    'manage'

export const page = writable<string>('init')

export const darkMode = writable<boolean>(false)

export const drawerOpen = writable<boolean>(false)

export const origins = writable<Origin[]>([])

export const availableBalance = writable<number>(0)