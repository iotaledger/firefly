import { Platform } from '@core/app'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeNftFromDownloadQueue } from '../stores'

export async function downloadNextNftInQueue(): Promise<void> {
    const nextDownload = get(nftDownloadQueue)?.[0]
    if (!nextDownload || get(downloadingNftId)) {
        return
    }

    try {
        const { downloadUrl, path, nft, walletId } = nextDownload
        downloadingNftId.set(nft.id)
        await Platform.downloadNft(downloadUrl, path, nft.id, walletId)
    } catch (error) {
        downloadingNftId.set(undefined)
        removeNftFromDownloadQueue(get(downloadingNftId))
    }
}
