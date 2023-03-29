import { writable } from 'svelte/store'
import { DownloadQueueNftItem } from '../interfaces'

export const nftDownloadQueue = writable<DownloadQueueNftItem[]>([])

export function addNftToDownloadQueue(item: DownloadQueueNftItem): void {
    nftDownloadQueue.update((state) => {
        if (!state.some((item2) => item2.nft.id === item.nft.id)) {
            state = [...state, item]
        }
        return state
    })
}

export function removeNftFromDownloadQueue(nftId: string): void {
    nftDownloadQueue.update((state) => state.filter((item) => item.nft.id !== nftId))
}

export function resetNftDownloadQueue(): void {
    nftDownloadQueue.set([])
}
