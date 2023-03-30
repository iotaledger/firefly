import { selectedAccountIndex } from '@core/account'
import { Platform } from '@core/app'
import { MILLISECONDS_PER_SECOND, sleep } from '@core/utils'
import { get } from 'svelte/store'
import { MAX_DOWNLOADING_TIME_IN_SECONDS } from '../constants'
import { DownloadWarningType } from '../enums'
import { downloadingNftId, selectedAccountNfts } from '../stores'
import { updateNftInAllAccountNfts } from './updateNftInAllAccountNfts'

export async function interruptNftDownloadAfterTimeout(): Promise<void> {
    const currentlyDownloadingNft = get(downloadingNftId)

    await sleep(MAX_DOWNLOADING_TIME_IN_SECONDS * MILLISECONDS_PER_SECOND)
    const updatedDownloadingNft = get(downloadingNftId)

    if (currentlyDownloadingNft && currentlyDownloadingNft === updatedDownloadingNft) {
        await Platform.cancelDownload(currentlyDownloadingNft)

        const alreadyLoaded = get(selectedAccountNfts)?.find((nft) => nft.id === currentlyDownloadingNft)
            ?.downloadMetadata?.isLoaded
        if (!alreadyLoaded) {
            updateNftInAllAccountNfts(get(selectedAccountIndex), currentlyDownloadingNft, {
                downloadMetadata: { isLoaded: false, warning: { type: DownloadWarningType.DownloadTooLong } },
            })
        }
    }
}
