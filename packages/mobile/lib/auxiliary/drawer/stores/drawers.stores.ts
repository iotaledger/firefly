import { writable } from 'svelte/store'
import { IDrawer } from '../interfaces'

export const drawersStore = writable<IDrawer[]>([])
