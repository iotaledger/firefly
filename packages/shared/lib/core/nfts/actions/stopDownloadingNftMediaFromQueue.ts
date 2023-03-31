import { Platform } from '@core/app'
import { get } from 'svelte/store'
import { downloadingNftId, resetNftDownloadQueue } from '../stores'

export async function stopDownloadingNftMediaFromQueue(): Promise<void> {
    resetNftDownloadQueue()
    await Platform.cancelNftDownload(get(downloadingNftId))
    downloadingNftId.set(undefined)
}
