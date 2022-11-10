import { allAccountNfts } from '../stores'
import { INft } from '../interfaces'

export function updateNftInAllAccountNfts(accountIndex: number, nftId: string, partialNft: Partial<INft>): void {
    allAccountNfts.update((state) => {
        const nft = state[accountIndex]?.find((_nft) => _nft.id === nftId)
        if (nft) {
            Object.assign(nft, partialNft)
        }
        return state
    })
}
