import { allAccountNfts } from '../stores'
import { INft } from '../interfaces'

export function addNftInAllAccountNfts(accountIndex: number, nft: INft): void {
    allAccountNfts.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        const alreadyExists = state[accountIndex].some((_nft) => _nft.id === nft.id)
        if (!alreadyExists) {
            state[accountIndex].push(nft)
        }
        return state
    })
}
