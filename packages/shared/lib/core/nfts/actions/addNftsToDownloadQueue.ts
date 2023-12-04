import { updateNftInAllAccountNfts } from '.'
import { INft } from '../interfaces'
import { addNftToDownloadQueue } from '../stores'
import { checkIfNftShouldBeDownloaded } from '../utils/checkIfNftShouldBeDownloaded'

// TODO(2.0) Use wallets instead of acounts
export function addNftsToDownloadQueue(walletId: string, nfts: INft[], forceDownload: boolean = true): void {
    for (const nft of nfts) {
        const shouldNotDownloadNft =
            nft?.downloadMetadata?.isLoaded || !!nft?.downloadMetadata?.error || !!nft?.downloadMetadata?.warning
        if (shouldNotDownloadNft && !forceDownload) {
            continue
        } else {
            void validateNftThenAddToQueue(walletId, nft)
        }
    }
}

async function validateNftThenAddToQueue(walletId: string, nft: INft): Promise<void> {
    try {
        const { shouldDownload, downloadMetadata, downloadUrl } = await checkIfNftShouldBeDownloaded(nft)
        nft.downloadMetadata = downloadMetadata
        nft.downloadUrl = downloadUrl
        updateNftInAllAccountNfts(walletId, nft.id, { downloadMetadata })

        if (shouldDownload) {
            addNftToDownloadQueue({ nft: nft, downloadUrl, path: nft.filePath, walletId })
        }
    } catch (error) {
        console.error(error)
    }
}
