import { Platform } from '@core/app'
import { get } from 'svelte/store'
import { deletingNftId, nftDeleteQueue, removeNftFromDeleteQueue } from '../stores'

export async function deleteNextNftInQueue(): Promise<void> {
    const nextDelete = get(nftDeleteQueue)?.[0]
    if (!nextDelete || get(deletingNftId)) {
        return
    }

    try {
        const { path, nft, accountIndex } = nextDelete
        deletingNftId.set(nft.id)
        await Platform.deleteNft(path, accountIndex, nft.id)
    } catch (error) {
        deletingNftId.set(undefined)
        removeNftFromDeleteQueue(get(deletingNftId))
    }
}
