import { downloadingNftId, removeNftFromDownloadQueue, updateNftInAllAccountNfts } from '@core/nfts'
import { Platform } from '../classes'

/**
 * Registers all event handlers for nft downloads.
 */
export function registerNftMediaDownloadEvents(): void {
    Platform.onEvent('download-done', ({ nftId, accountIndex }) => {
        updateNftInAllAccountNfts(accountIndex, nftId, { downloadMetadata: { isLoaded: true } })
        downloadingNftId.set(undefined)
        removeNftFromDownloadQueue(nftId)
    })
    Platform.onEvent('download-interrupted', ({ nftId }) => {
        downloadingNftId.set(undefined)
        removeNftFromDownloadQueue(nftId)
    })
}
