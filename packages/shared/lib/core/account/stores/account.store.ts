import { StardustAccount } from '@lib/typings/account'
import { writable } from 'svelte/store'

export const account = writable<StardustAccount>(null)
