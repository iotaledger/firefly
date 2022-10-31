import { writable, get } from 'svelte/store'
import { INft } from '../interfaces'

export const allAccountNfts = writable<INft[][]>([])

export function getNftByIdFromAllAccountNfts(accountIndex: number, nftId: string): INft {
    return get(allAccountNfts)[accountIndex]?.find((_nft) => _nft.id === nftId)
}

export function setAccountNftsInAllAccountNfts(accountIndex: number, accountNfts: INft[]): void {
    allAccountNfts.update((state) => {
        state[accountIndex] = accountNfts
        return state
    })
}

export function updateNftInAllAccountNfts(accountIndex: number, nftId: string, partialNft: Partial<INft>): void {
    allAccountNfts.update((state) => {
        const nft = state[accountIndex]?.find((_nft) => _nft.id === nftId)
        if (nft) {
            Object.assign(nft, partialNft)
        }
        return state
    })
}

export function addNftInAllAccountNfts(accountIndex: number, nft: INft): void {
    allAccountNfts.update((state) => {
        const alreadyExists = state[accountIndex].some((_nft) => _nft.id === nft.id)
        if (!alreadyExists) {
            state[accountIndex].push(nft)
        }
        return state
    })
}

export function addOrUpdateNftInAllAccountNfts(accountIndex: number, newNft: INft): void {
    allAccountNfts.update((state) => {
        const nft = state[accountIndex].find((_nft) => _nft.id === newNft.id)
        if (nft) {
            Object.assign(nft, newNft)
        } else {
            state[accountIndex].push(newNft)
        }
        return state
    })
}
