import { writable } from 'svelte/store'
import { get } from 'svelte/store'
import { downloadingNftId } from '../stores'
import {
    CHECK_CURRENTLY_DOWNLOADING_INTERVAL,
    CHECK_CURRENTLY_DOWNLOADING_MAX_COUNT,
} from '../constants/check-currently-downloading.constants'
import { Platform } from '@core/app'
import { sleep } from '@core/utils'
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

export async function downloadNextItemInQueue(): Promise<void> {
    const nextDownload = get(nftDownloadQueue)?.[0]
    if (!nextDownload) {
        return
    }

    try {
        const { downloadUrl, path, nft, accountIndex } = nextDownload
        await waitForDownloadToBeFinished()
        downloadingNftId.set(nft.id)
        await Platform.downloadFile(downloadUrl, path, nft.id, accountIndex)
    } catch (error) {
        removeItemFromNftDownloadQueue(get(downloadingNftId))
        downloadingNftId.set(undefined)
    }
}

async function waitForDownloadToBeFinished(): Promise<void> {
    for (let count = 0; count < CHECK_CURRENTLY_DOWNLOADING_MAX_COUNT; count++) {
        if (!get(downloadingNftId)) {
            return Promise.resolve()
        }
        await sleep(CHECK_CURRENTLY_DOWNLOADING_INTERVAL)
    }
    return Promise.reject()
}
