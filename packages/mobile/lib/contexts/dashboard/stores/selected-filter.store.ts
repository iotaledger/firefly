import { writable } from 'svelte/store'
import type { Filter } from '@core/utils/types'

export const selectedFilter = writable<Filter>(null)
