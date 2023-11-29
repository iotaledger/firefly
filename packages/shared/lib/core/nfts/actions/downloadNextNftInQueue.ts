import { Platform } from '@core/app'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeNftFromDownloadQueue } from '../stores'
import { getIpfsUri } from '../utils'

export async function downloadNextNftInQueue(): Promise<void> {
    const nextDownload = get(nftDownloadQueue)?.[0]
    if (!nextDownload || get(downloadingNftId)) {
        return
    }

    try {
        // eslint-disable-next-line prefer-const
        let { downloadUrl, path, nft, accountIndex } = nextDownload
        downloadingNftId.set(nft.id)
        const ipfsUri = await getIpfsUri({ hash: downloadUrl })

        if (ipfsUri) {
            downloadUrl = ipfsUri
        }

        await Platform.downloadNft(downloadUrl, path, nft.id, accountIndex)
    } catch (error) {
        downloadingNftId.set(undefined)
        removeNftFromDownloadQueue(get(downloadingNftId))
    }
}
