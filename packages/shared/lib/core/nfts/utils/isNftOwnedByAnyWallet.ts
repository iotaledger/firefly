import { get } from 'svelte/store'
import { allWalletNfts } from '../stores'

export function isNftOwnedByAnyWallet(nftId: string): boolean {
    for (const walletNfts of Object.values(get(allWalletNfts) ?? {})) {
        const nft = walletNfts.find((nft) => nft.id === nftId)
        if (nft?.isSpendable) {
            return true
        }
    }
    return false
}
