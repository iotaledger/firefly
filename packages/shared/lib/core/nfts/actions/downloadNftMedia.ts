import { Platform } from '@core/app'
import { activeProfile, getStorageDirectoryOfProfiles } from '@core/profile'
import { get } from 'svelte/store'
import { addOrUpdateNftInAllAccountNfts } from '.'
import { BYTES_PER_MEGABYTE } from '../constants'
import { DownloadErrorType, DownloadWarningType, HttpHeader } from '../enums'
import { NftDownloadMetadata, INft } from '../interfaces'

export async function downloadNftMedia(nft: INft, accountIndex: number): Promise<void> {
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE

    const downloadMetadata: NftDownloadMetadata = { isLoaded: false }
    try {
        const alreadyDownloaded = await isFileAlreadyDownloaded(nft)

        if (!alreadyDownloaded) {
            if (nft.composedUrl) {
                const response = await fetch(nft.composedUrl, { method: 'HEAD', cache: 'force-cache' })
                let headers = response.headers

                const hasOldSoonaverseStructure =
                    headers.get(HttpHeader.ContentType) !== nft.parsedMetadata?.type &&
                    nft.parsedMetadata?.issuerName === 'Soonaverse'
                if (hasOldSoonaverseStructure) {
                    const backupUrl = nft.composedUrl + '/' + encodeURIComponent(nft?.parsedMetadata?.name)
                    const backupResponse = await fetch(backupUrl, { method: 'HEAD', cache: 'force-cache' })
                    headers = backupResponse.headers
                }

                const isValidMediaType = headers.get(HttpHeader.ContentType) !== nft.parsedMetadata?.type
                const hasValidFileSize =
                    MAX_FILE_SIZE_IN_BYTES > 0 && Number(headers.get(HttpHeader.ContentLength)) > MAX_FILE_SIZE_IN_BYTES
                if (isValidMediaType) {
                    downloadMetadata.error = { type: DownloadErrorType.NotMatchingFileTypes }
                } else if (hasValidFileSize) {
                    downloadMetadata.warning = { type: DownloadWarningType.FileTooLarge }
                } else {
                    await Platform.downloadFile(nft.composedUrl, nft.filePath)
                    downloadMetadata.isLoaded = true
                }
            } else {
                downloadMetadata.isLoaded = true
                downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
            }
        } else {
            downloadMetadata.isLoaded = true
        }
    } catch (err) {
        downloadMetadata.error = { type: DownloadErrorType.Generic, message: err.message }
    }
    nft.downloadMetadata = downloadMetadata
    addOrUpdateNftInAllAccountNfts(accountIndex, nft)
}

async function isFileAlreadyDownloaded(nft: INft): Promise<boolean> {
    const basePath =
        process.env.NODE_ENV === 'development' ? 'build/__storage__' : await getStorageDirectoryOfProfiles()

    let status
    try {
        const localFile = await fetch(`${basePath}/${nft.filePath}/original`)
        status = localFile.status
    } catch (err) {
        status = undefined
    }

    return status === 200 || status === 304
}
