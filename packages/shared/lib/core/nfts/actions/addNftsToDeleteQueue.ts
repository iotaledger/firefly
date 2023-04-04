import { INft } from '../interfaces'
import { addNftToDeleteQueue } from '../stores'

export function addNftsToDeleteQueue(accountIndex: number, nfts: INft[]): void {
    for (const nft of nfts) {
        addNftToDeleteQueue({ nft: nft, path: nft.filePath, accountIndex })
    }
}
