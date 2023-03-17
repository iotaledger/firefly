import { get } from 'svelte/store'
import { allAccountNfts, downloadingNftId } from '../stores'
import { sleep } from '@core/utils'
import { validateNftMedia } from './validateNftMedia'
import { Platform } from '@core/app'
import { addOrUpdateNftInAllAccountNfts } from '../actions'
import { INft } from '../interfaces'
import {
    CHECK_CURRENTLY_DOWNLOADING_INTERVAL,
    CHECK_CURRENTLY_DOWNLOADING_MAX_COUNT,
} from '../constants/check-currently-downloading.constants'
import { activeProfile } from '@core/profile'

export async function downloadAllNftMedia(): Promise<void> {
    const nftsToDownload: { [nftId: string]: { nft: INft; downloadUrl: string; path: string; accountIndex: number } } =
        {}
    const _allAccountNfts = get(allAccountNfts)

    for (const [accountIndex, accountNfts] of get(allAccountNfts).entries()) {
        for (const nft of accountNfts) {
            const { needsDownload, downloadMetadata, downloadUrl } = await validateNftMedia(nft)

            if (needsDownload) {
                const alreadyIncluded = !!nftsToDownload[nft.id]
                if (!alreadyIncluded) {
                    nftsToDownload[nft.id] = { nft: nft, downloadUrl, path: nft.filePath, accountIndex }
                }
                nft.downloadMetadata = { isLoaded: false }
            } else {
                nft.downloadMetadata = downloadMetadata
            }
        }
    }

    allAccountNfts.set(_allAccountNfts)

    for (const { nft, accountIndex, downloadUrl, path } of Object.values(nftsToDownload)) {
        if (!get(activeProfile)?.loggedIn) {
            break
        }
        try {
            await waitForDownloadToBeFinished()
            downloadingNftId.set(nft.id)
            await Platform.downloadFile(downloadUrl, path)

            nft.downloadMetadata.isLoaded = true
            addOrUpdateNftInAllAccountNfts(accountIndex, nft)
        } catch (error) {
            downloadingNftId.set(undefined)
        }
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
