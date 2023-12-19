import { allWalletNfts } from '../stores'
import { INft } from '../interfaces'

// TODO(2.0) Fix usages
export function updateNftInAllWalletNfts(walletId: string, nftId: string, partialNft: Partial<INft>): void {
    allWalletNfts.update((state) => {
        if (!state[walletId]) {
            state[walletId] = []
        }
        const nft = state[walletId].find((_nft) => _nft.id === nftId)
        if (nft) {
            Object.assign(nft, { ...nft, ...partialNft })
        }
        return state
    })
}
