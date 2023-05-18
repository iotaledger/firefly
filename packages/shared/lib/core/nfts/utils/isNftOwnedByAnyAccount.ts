import { get } from 'svelte/store'
import { allAccountNfts } from '../stores'

export function isNftOwnedByAnyAccount(nftId: string): boolean {
    for (const accountNfts of get(allAccountNfts) ?? []) {
        const nft = accountNfts.find((nft) => nft.id === nftId)
        if (nft?.isSpendable) {
            return true
        }
    }
    return false
}
