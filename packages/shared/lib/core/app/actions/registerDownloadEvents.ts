import { downloadingNftId, updateNftInAllAccountNfts } from '@core/nfts'
import { Platform } from '../classes'

/**
 * Registers all event handlers for nft downloads.
 */
export function registerDownloadEvents(): void {
    Platform.onEvent('download-done', ({ nftId, accountIndex }) => {
        updateNftInAllAccountNfts(accountIndex, nftId, { downloadMetadata: { isLoaded: true } })
        downloadingNftId.set(undefined)
    })
    Platform.onEvent('download-interrupted', ({ nftId, accountIndex }) => {
        updateNftInAllAccountNfts(accountIndex, nftId, { downloadMetadata: { isLoaded: false } })
        downloadingNftId.set(undefined)
    })
}
