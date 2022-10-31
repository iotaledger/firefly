import { writable } from 'svelte/store'

import { Currencies } from '../types'

export const currencies = writable<Currencies>({} as Currencies)
