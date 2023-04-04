import { deletingNftId, removeNftFromDeleteQueue, updateNftInAllAccountNfts } from '@core/nfts'
import { Platform } from '../classes'

export function registerNftDeleteEvents(): void {
    Platform.onEvent('nft-delete-done', ({ accountIndex, nftId }) => {
        updateNftInAllAccountNfts(accountIndex, nftId, { downloadMetadata: { isLoaded: false } })
        deletingNftId.set(undefined)
        removeNftFromDeleteQueue(nftId)
    })
}
