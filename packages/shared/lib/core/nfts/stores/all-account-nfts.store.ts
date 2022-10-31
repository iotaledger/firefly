import { writable } from 'svelte/store'
import { INft } from '../interfaces'

export const allAccountNfts = writable<INft[][]>([])
