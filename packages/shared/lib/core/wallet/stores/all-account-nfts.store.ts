import { writable } from 'svelte/store'
import { INftMetadata } from '../interfaces'

export const allAccountNfts = writable<INftMetadata[][]>([])

export function setAccountNftsInAllAccountNfts(accountIndex: number, accountNfts: INftMetadata[]): void {
    allAccountNfts.update((state) => {
        state[accountIndex] = accountNfts
        return state
    })
}
