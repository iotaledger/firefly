import { Platform } from '@core/app'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { get } from 'svelte/store'
import { MAX_DOWNLOADING_TIME_IN_SECONDS } from '../constants'
import { downloadingNftId } from '../stores'

export async function startInterruptTimer(): Promise<void> {
    const currentlyDownloadingNft = get(downloadingNftId)

    await sleep(MAX_DOWNLOADING_TIME_IN_SECONDS * MILLISECONDS_PER_SECOND)
    const updatedDownloadingNft = get(downloadingNftId)

    if (currentlyDownloadingNft && currentlyDownloadingNft === updatedDownloadingNft) {
        await Platform.cancelDownload(currentlyDownloadingNft)
    }
}
