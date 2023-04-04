import { get, writable } from 'svelte/store'
import { DeleteQueueNftItem } from '../interfaces'
import { deletingNftId } from './deleting-nft.store'

export const nftDeleteQueue = writable<DeleteQueueNftItem[]>([])

export function addNftToDeleteQueue(item: DeleteQueueNftItem): void {
    nftDeleteQueue.update((state) => {
        if (!state.some((item2) => item2.nft.id === item.nft.id)) {
            state = [...state, item]
        }
        return state
    })
}

export function removeNftFromDeleteQueue(nftId: string): void {
    nftDeleteQueue.update((state) => state.filter((item) => item.nft.id !== nftId))
}

export function resetNftDeleteQueue(keepCurrentlyDeletingNft: boolean = false): void {
    if (keepCurrentlyDeletingNft) {
        nftDeleteQueue.update((state) => state.filter((item) => item.nft.id === get(deletingNftId)))
    } else {
        nftDeleteQueue.set([])
    }
}
