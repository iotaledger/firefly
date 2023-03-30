import { Platform } from '@core/app'
import { get } from 'svelte/store'
import { downloadingNftId, resetNftDownloadQueue } from '../stores'

export async function clearNftMediaDownloading(): Promise<void> {
    await Platform.cancelDownload(get(downloadingNftId))
    downloadingNftId.set(undefined)
    resetNftDownloadQueue()
}
