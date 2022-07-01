import { writable } from 'svelte/store'

import { ImportFile } from '../types'

export const importFile = writable<ImportFile>(null)
