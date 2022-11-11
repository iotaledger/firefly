import { writable } from 'svelte/store'

import { IRouterManager } from '../interfaces'

export const routerManager = writable<IRouterManager>(null)
