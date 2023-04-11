import { Platform } from '@core/app'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE, sleep } from '@core/utils'
import { get } from 'svelte/store'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_MINUTES } from '../constants'
import { DownloadWarningType } from '../enums'
import { downloadingNftId } from '../stores'
import { updateNftInAllAccountNfts } from './updateNftInAllAccountNfts'
import { activeProfile } from '@core/profile'

export async function interruptNftDownloadAfterTimeout(accountIndex: number): Promise<void> {
    const currentlyDownloadingNft = get(downloadingNftId)

    const downloadTimeout =
        (get(activeProfile).settings.maxMediaDownloadTimeInMinutes || DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_MINUTES) *
        SECONDS_PER_MINUTE *
        MILLISECONDS_PER_SECOND
    await sleep(downloadTimeout)
    const updatedDownloadingNft = get(downloadingNftId)

    if (currentlyDownloadingNft && currentlyDownloadingNft === updatedDownloadingNft) {
        await Platform.cancelNftDownload(currentlyDownloadingNft)
        updateNftInAllAccountNfts(accountIndex, currentlyDownloadingNft, {
            downloadMetadata: { isLoaded: false, warning: { type: DownloadWarningType.DownloadTooLong } },
        })
    }
}
