import { allAccountNfts } from '../stores'
import { INft } from '../interfaces'

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
