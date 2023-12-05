import { get } from 'svelte/store'
import { allWalletNfts } from '../stores'

export function isNftOwnedByAnyAccount(nftId: string): boolean {
    for (const accountNfts of get(allWalletNfts) ?? []) {
        const nft = accountNfts.find((nft) => nft.id === nftId)
        if (nft?.isSpendable) {
            return true
        }
    }
    return false
}
