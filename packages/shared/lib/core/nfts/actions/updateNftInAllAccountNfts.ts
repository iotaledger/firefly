import { INft } from '../interfaces'
import { allAccountNfts } from '../stores'
import { getIpfsUri, getIPFSHash } from '../utils'

export function updateNftInAllAccountNfts(accountIndex: number, nftId: string, partialNft: Partial<INft>): void {
    allAccountNfts.update((state) => {
        if (!state[accountIndex]) {
            state[accountIndex] = []
        }
        const nft = state[accountIndex].find((_nft) => _nft.id === nftId)
        if (nft) {
            const downloadUrl = nft.downloadUrl
            const ipfsHash = getIPFSHash(downloadUrl)
            if (ipfsHash) {
                void getIpfsUri({ hash: downloadUrl }).then((ipfsUri) => {
                    if (ipfsUri) {
                        nft.downloadUrl = ipfsUri
                        nft.composedUrl = ipfsUri
                    }
                })
            }
            Object.assign(nft, { ...nft, ...partialNft })
        }
        return state
    })
}
