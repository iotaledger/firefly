import { writable } from 'svelte/store'
import { activeProfile } from '@core/profile'
import { IAccountState } from '../interfaces'

export const selectedAccount = writable<IAccountState>(null)
