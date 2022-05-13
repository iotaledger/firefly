import { writable } from 'svelte/store'
import { IAccount } from '../interfaces'

export const account = writable<IAccount>(null)
