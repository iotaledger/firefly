import { downloadingNftId, removeNftFromDownloadQueue, updateNftInAllWalletNfts } from '@core/nfts'
import { Platform } from '../classes'

/**
 * Registers all event handlers for nft downloads.
 */
export function registerNftDownloadEvents(): void {
    Platform.onEvent('nft-download-done', ({ nftId, walletId }) => {
        updateNftInAllWalletNfts(walletId, nftId, { downloadMetadata: { isLoaded: true } })
        downloadingNftId.set(undefined)
        removeNftFromDownloadQueue(nftId)
    })
    Platform.onEvent('nft-download-interrupted', ({ nftId }) => {
        downloadingNftId.set(undefined)
        removeNftFromDownloadQueue(nftId)
    })
}
