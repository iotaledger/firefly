import { Platform } from '@core/app'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { get } from 'svelte/store'
import { MAX_NFT_DOWNLOADING_TIME_IN_SECONDS } from '../constants'
import { DownloadWarningType } from '../enums'
import { downloadingNftId } from '../stores'
import { updateNftInAllAccountNfts } from './updateNftInAllAccountNfts'

export async function interruptNftDownloadAfterTimeout(accountIndex: number): Promise<void> {
    const currentlyDownloadingNft = get(downloadingNftId)

    await sleep(MAX_NFT_DOWNLOADING_TIME_IN_SECONDS * MILLISECONDS_PER_SECOND)
    const updatedDownloadingNft = get(downloadingNftId)

    if (currentlyDownloadingNft && currentlyDownloadingNft === updatedDownloadingNft) {
        await Platform.cancelNftDownload(currentlyDownloadingNft)
        updateNftInAllAccountNfts(accountIndex, currentlyDownloadingNft, {
            downloadMetadata: { isLoaded: false, warning: { type: DownloadWarningType.DownloadTooLong } },
        })
    }
}
