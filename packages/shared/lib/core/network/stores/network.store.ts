import { writable } from 'svelte/store'
import { INetwork } from '../interfaces'

export const network = writable<INetwork>(null)

export function clearNetwork(): void {
    network.set(null)
}
