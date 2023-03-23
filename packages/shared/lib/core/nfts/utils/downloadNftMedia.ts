import { get } from 'svelte/store'

import { updateNftInAllAccountNfts } from '../actions'
import { DownloadQueueNftItem, INft, NftDownloadMetadata } from '../interfaces'
import { allAccountNfts, downloadingNftId } from '../stores'
import { validateNftMedia } from './validateNftMedia'
import {
    CHECK_CURRENTLY_DOWNLOADING_INTERVAL,
    CHECK_CURRENTLY_DOWNLOADING_MAX_COUNT,
} from '../constants/check-currently-downloading.constants'

import { Platform } from '@core/app'
import { sleep } from '@core/utils'
import { activeProfile } from '@core/profile'

export async function downloadNftMedia(accountIndex: number, nft?: INft): Promise<void> {
    const downloadQueuePromises: Promise<DownloadQueueNftItem>[] = []
    const nfts = nft ? [nft] : get(allAccountNfts)?.[accountIndex]
    for (const nft of nfts) {
        if (!isValidated(nft.downloadMetadata)) {
            downloadQueuePromises.push(validateNft(accountIndex, nft))
        }
    }
    const downloadQueue: DownloadQueueNftItem[] = await Promise.all(downloadQueuePromises)

    for (const downloadQueueItem of downloadQueue.filter((item) => !!item)) {
        if (!get(activeProfile)?.loggedIn) {
            break
        }
        await tryDownloadNft(downloadQueueItem)
    }
}

async function tryDownloadNft(downloadQueue: DownloadQueueNftItem): Promise<void> {
    try {
        await waitForDownloadToBeFinished()
        const { downloadUrl, path, nft, accountIndex } = downloadQueue
        downloadingNftId.set(nft.id)
        await Platform.downloadFile(downloadUrl, path, nft.id, accountIndex)
    } catch (error) {
        downloadingNftId.set(undefined)
    }
}

function validateNft(accountIndex: number, nft: INft): Promise<DownloadQueueNftItem> {
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

function isValidated(metadata: NftDownloadMetadata): boolean {
    return metadata.isLoaded || !!metadata.error || !!metadata.warning
}
