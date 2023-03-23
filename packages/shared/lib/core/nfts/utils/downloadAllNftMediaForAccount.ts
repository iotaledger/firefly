import { get } from 'svelte/store'

import { updateNftInAllAccountNfts } from '../actions'
import {
    CHECK_CURRENTLY_DOWNLOADING_INTERVAL,
    CHECK_CURRENTLY_DOWNLOADING_MAX_COUNT,
} from '../constants/check-currently-downloading.constants'
import { INft } from '../interfaces'
import { allAccountNfts, downloadingNftId } from '../stores'
import { validateNftMedia } from './validateNftMedia'

import { Platform } from '@core/app'
import { activeProfile } from '@core/profile'
import { sleep } from '@core/utils'
interface DownloadQueueItem {
    nft: INft
    downloadUrl: string
    path: string
    accountIndex: number
}

export async function downloadAllNftMediaForAccount(accountIndex: number): Promise<void> {
    const downloadQueuePromises: Promise<DownloadQueueItem>[] = []
    for (const nft of get(allAccountNfts)[accountIndex]) {
        const isAlreadyValidated =
            nft.downloadMetadata.isLoaded || nft.downloadMetadata.error || nft.downloadMetadata.warning
        if (!isAlreadyValidated) {
            downloadQueuePromises.push(validateNft(accountIndex, nft))
        }
    }
    const downloadQueue: DownloadQueueItem[] = await Promise.all(downloadQueuePromises)

    for (const { nft, accountIndex, downloadUrl, path } of downloadQueue.filter((item) => !!item)) {
        if (!get(activeProfile)?.loggedIn) {
            break
        }
        try {
            await waitForDownloadToBeFinished()
            downloadingNftId.set(nft.id)
            await Platform.downloadFile(downloadUrl, path, nft.id, accountIndex)
        } catch (error) {
            downloadingNftId.set(undefined)
        }
    }
}

function validateNft(accountIndex, nft): Promise<DownloadQueueItem> {
    const promise = new Promise<DownloadQueueItem>((resolve) => {
        void validateNftMedia(nft).then(({ needsDownload, downloadMetadata, downloadUrl }) => {
            let downloadQueueItem: DownloadQueueItem = undefined
            if (needsDownload) {
                nft.downloadMetadata = { isLoaded: false }
                downloadQueueItem = { nft: nft, downloadUrl, path: nft.filePath, accountIndex }
            } else {
                nft.downloadMetadata = downloadMetadata
            }
            updateNftInAllAccountNfts(accountIndex, nft.id, { downloadMetadata })
            resolve(downloadQueueItem)
        })
    })

    return promise
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
