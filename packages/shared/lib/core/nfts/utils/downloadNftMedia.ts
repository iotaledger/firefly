import { get } from 'svelte/store'

import { updateNftInAllAccountNfts } from '../actions'
import { DownloadQueueNftItem, INft } from '../interfaces'
import { downloadingNftId } from '../stores'
import { validateNftMedia } from './validateNftMedia'
import {
    CHECK_CURRENTLY_DOWNLOADING_INTERVAL,
    CHECK_CURRENTLY_DOWNLOADING_MAX_COUNT,
} from '../constants/check-currently-downloading.constants'

import { Platform } from '@core/app'
import { sleep } from '@core/utils'

export async function downloadNftMedia(nft: INft, accountIndex: number): Promise<void> {
    const isAlreadyValidated =
        nft.downloadMetadata.isLoaded || nft.downloadMetadata.error || nft.downloadMetadata.warning
    if (isAlreadyValidated) {
        return
    }
    const validationStatus: DownloadQueueNftItem = await validateNft(accountIndex, nft)

    try {
        await waitForDownloadToBeFinished()
        downloadingNftId.set(nft.id)
        await Platform.downloadFile(validationStatus.downloadUrl, validationStatus.path, nft.id, accountIndex)
    } catch (error) {
        downloadingNftId.set(undefined)
    }
}

function validateNft(accountIndex, nft): Promise<DownloadQueueNftItem> {
    const promise = new Promise<DownloadQueueNftItem>((resolve) => {
        void validateNftMedia(nft).then(({ needsDownload, downloadMetadata, downloadUrl }) => {
            let downloadQueueItem: DownloadQueueNftItem = undefined
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
