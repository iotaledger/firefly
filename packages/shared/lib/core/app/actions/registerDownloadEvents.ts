import { downloadingNftId } from '@core/nfts'
import { Platform } from '../classes'

/**
 * Registers all event handlers for nft downloads.
 */
export function registerDownloadEvents(): void {
    Platform.onEvent('download-done', () => {
        downloadingNftId.set(undefined)
    })
    Platform.onEvent('download-interrupted', () => {
        downloadingNftId.set(undefined)
    })
}
