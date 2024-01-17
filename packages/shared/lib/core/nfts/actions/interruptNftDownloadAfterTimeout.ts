import { Platform } from '@core/app'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { get } from 'svelte/store'
import { DownloadWarningType } from '../enums'
import { downloadingNftId } from '../stores'
import { updateNftInAllWalletNfts } from './updateNftInAllWalletNfts'
import { activeProfile } from '@core/profile/stores'

export async function interruptNftDownloadAfterTimeout(walletId: string): Promise<void> {
    const currentlyDownloadingNft = get(downloadingNftId)

    const downloadTimeout = get(activeProfile).settings.maxMediaDownloadTimeInSeconds * MILLISECONDS_PER_SECOND
    await sleep(downloadTimeout)
    const updatedDownloadingNft = get(downloadingNftId)

    if (currentlyDownloadingNft && currentlyDownloadingNft === updatedDownloadingNft) {
        await Platform.cancelNftDownload(currentlyDownloadingNft)
        updateNftInAllWalletNfts(walletId, currentlyDownloadingNft, {
            downloadMetadata: { isLoaded: false, warning: { type: DownloadWarningType.DownloadTooLong } },
        })
    }
}
