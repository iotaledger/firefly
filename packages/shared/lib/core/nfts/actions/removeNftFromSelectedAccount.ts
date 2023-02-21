import { allAccountNfts } from '../stores'

export function removeNftFromSelectedAccount(accountIndex: number, nftId: string): void {
    allAccountNfts.update((nfts) => {
        const selectedAccountNfts = nfts[accountIndex]
        nfts[accountIndex] = selectedAccountNfts.filter((nft) => nft.id !== nftId)
        return nfts
    })
}
