import { writable } from 'svelte/store'
import { DownloadQueueNftItem } from '../interfaces'

export const nftDownloadQueue = writable<DownloadQueueNftItem[]>([])

export function addItemsToNftDownloadQueue(items: DownloadQueueNftItem[]): void {
    nftDownloadQueue.update((state) => {
        for (const item of items) {
            if (!state.some((item2) => item2.nft.id === item.nft.id)) {
                state = [...state, item]
            }
        }
        return state
    })
}

export function removeItemFromNftDownloadQueue(nftId: string): void {
    nftDownloadQueue.update((state) => state.filter((item) => item.nft.id !== nftId))
}
