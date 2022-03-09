import { AccountRouter } from '@core/router/accountRouter'
import { writable } from 'svelte/store'

export const accountRouter = writable<AccountRouter>(null)
