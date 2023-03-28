import { updateNftInAllAccountNfts } from '.'
import { DownloadQueueNftItem, INft, NftDownloadMetadata } from '../interfaces'
import { addItemsToNftDownloadQueue } from '../stores'
import { validateNftMedia } from '../utils/validateNftMedia'

export async function addNftToDownloadQueue(accountIndex: number, nfts: INft[]): Promise<void> {
    const downloadQueuePromises: Promise<DownloadQueueNftItem>[] = []
    for (const nft of nfts) {
        if (!isValidated(nft.downloadMetadata)) {
            downloadQueuePromises.push(validateNft(accountIndex, nft))
        }
    }
    const downloadQueueItems: DownloadQueueNftItem[] = await Promise.all(downloadQueuePromises)
    const newDownloadQueueItems = downloadQueueItems.filter((item) => !!item)

    if (newDownloadQueueItems.length > 0) {
        addItemsToNftDownloadQueue(newDownloadQueueItems)
    }
}

function validateNft(accountIndex: number, nft: INft): Promise<DownloadQueueNftItem> {
    const promise = new Promise<DownloadQueueNftItem>((resolve) => {
        void validateNftMedia(nft).then(({ needsDownload, downloadMetadata, downloadUrl }) => {
            let downloadQueueItem: DownloadQueueNftItem = undefined
            if (needsDownload) {
                nft.downloadMetadata = { isLoaded: false }
                downloadQueueItem = { nft: nft, downloadUrl, path: nft.filePath, accountIndex }
            } else {
                nft.downloadMetadata = downloadMetadata
            }
            updateNftInAllAccountNfts(accountIndex, nft.id, { downloadMetadata })
            resolve(downloadQueueItem)
        })
    })

    return promise
}

function isValidated(metadata: NftDownloadMetadata): boolean {
    return metadata.isLoaded || !!metadata.error || !!metadata.warning
}
