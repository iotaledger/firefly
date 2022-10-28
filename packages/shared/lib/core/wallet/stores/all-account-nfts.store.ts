import { writable } from 'svelte/store'
import { INftMetadata, IStoredNft } from '../interfaces'

export const allAccountNfts = writable<IStoredNft[][]>([])

export function setAccountNftsInAllAccountNfts(accountIndex: number, accountNfts: IStoredNft[]): void {
    allAccountNfts.update((state) => {
        state[accountIndex] = accountNfts
        return state
    })
}

export function updateNftInAllAccountNfts(accountIndex: number, nftId: string, partialNft: Partial<IStoredNft>): void {
    allAccountNfts.update((state) => {
        const nft = state[accountIndex]?.find((_nft) => _nft.nftMetadata.id === nftId)
        if (nft) {
            Object.assign(nft, partialNft)
        }
        return state
    })
}

export function addOrUpdateNftInAllAccountNfts(
    accountIndex: number,
    nftMetadata: INftMetadata,
    partialNft?: Partial<IStoredNft>
): void {
    allAccountNfts.update((state) => {
        const nft = state[accountIndex].find((_nft) => _nft.nftMetadata.id === nftMetadata.id)
        if (nft) {
            Object.assign(nft, partialNft)
        } else {
            state[accountIndex].push({ nftMetadata, isUnspent: true, ...partialNft })
        }
        return state
    })
}
