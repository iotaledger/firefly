import { Platform } from '@core/app'
import { get } from 'svelte/store'
import { downloadingNftId, nftDownloadQueue, removeItemFromNftDownloadQueue } from '../stores'
import { sleep } from '@core/utils'
import {
    CHECK_CURRENTLY_DOWNLOADING_INTERVAL,
    CHECK_CURRENTLY_DOWNLOADING_MAX_COUNT,
} from '../constants/check-currently-downloading.constants'

export async function downloadNextNftInQueue(): Promise<void> {
    const nextDownload = get(nftDownloadQueue)?.[0]
    if (!nextDownload) {
        return
    }

    try {
        const { downloadUrl, path, nft, accountIndex } = nextDownload
        await waitForDownloadToBeFinished()
        downloadingNftId.set(nft.id)
        await Platform.downloadFile(downloadUrl, path, nft.id, accountIndex)
    } catch (error) {
        removeItemFromNftDownloadQueue(get(downloadingNftId))
        downloadingNftId.set(undefined)
    }
}

async function waitForDownloadToBeFinished(): Promise<void> {
    for (let count = 0; count < CHECK_CURRENTLY_DOWNLOADING_MAX_COUNT; count++) {
        if (!get(downloadingNftId)) {
            return Promise.resolve()
        }
        await sleep(CHECK_CURRENTLY_DOWNLOADING_INTERVAL)
    }
    return Promise.reject()
}
