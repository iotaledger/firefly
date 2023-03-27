import {
    allAccountNfts,
    downloadingNftId,
    DownloadWarningType,
    removeItemFromNftDownloadQueue,
    updateNftInAllAccountNfts,
} from '@core/nfts'
import { get } from 'svelte/store'
import { Platform } from '../classes'

/**
 * Registers all event handlers for nft downloads.
 */
export function registerDownloadEvents(): void {
    Platform.onEvent('download-done', ({ nftId, accountIndex }) => {
        updateNftInAllAccountNfts(accountIndex, nftId, { downloadMetadata: { isLoaded: true } })
        downloadingNftId.set(undefined)
        removeItemFromNftDownloadQueue(nftId)
    })
    Platform.onEvent('download-interrupted', ({ nftId, accountIndex }) => {
        const alreadyLoaded = get(allAccountNfts)?.[accountIndex]?.find((nft) => nft.id === nftId)?.downloadMetadata
            ?.isLoaded
        if (!alreadyLoaded) {
            updateNftInAllAccountNfts(accountIndex, nftId, {
                downloadMetadata: { isLoaded: false, warning: { type: DownloadWarningType.DownloadTooLong } },
            })
        }
        removeItemFromNftDownloadQueue(nftId)
        downloadingNftId.set(undefined)
    })
}
