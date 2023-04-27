import { writable } from 'svelte/store'
import { INetwork } from '../interfaces'

export const network = writable<INetwork>(null)

export function resetNetwork(): void {
    network.set(null)
}
