import { get, writable } from 'svelte/store'
import { IChain } from '../interfaces'

export const chains = writable<IChain[]>([])

export function addChain(chain: IChain): void {
    chains.update((_chains) => [..._chains, chain])
}

export function getChain(chainId: number): IChain {
    return get(chains).find((chain) => chain.getMetadata().chainId === chainId)
}

export function removeChain(chainId: number): void {
    chains.update((_chains) =>
        _chains.filter((_chain) => _chain.getMetadata().chainId === chainId)
    )
}
