import { Writable, writable } from 'svelte/store'
import { IChain } from '../interfaces'

export const selectedChain: Writable<IChain> = writable(undefined)

export function setSelectedChain(chain: IChain): void {
    selectedChain.set(chain)
}

export function clearSelectedChain(): void {
    selectedChain.set(undefined)
}
