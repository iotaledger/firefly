import { allWalletNfts } from '../stores'
import { INft } from '../interfaces'

export function addOrUpdateNftInAllAccountNfts(walletId: string, newNft: INft): void {
    allWalletNfts.update((state) => {
        if (!state[walletId]) {
            state[walletId] = []
        }
        const nft = state[walletId].find((_nft) => _nft.id === newNft.id)
        if (nft) {
            Object.assign(nft, newNft)
        } else {
            state[walletId].push(newNft)
        }
        return state
    })
}
