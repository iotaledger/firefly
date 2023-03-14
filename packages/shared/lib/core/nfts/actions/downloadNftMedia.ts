import { Platform } from '@core/app'
import { activeProfile, getStorageDirectoryOfProfiles } from '@core/profile'
import { get } from 'svelte/store'
import { addOrUpdateNftInAllAccountNfts } from '.'
import { BYTES_PER_MEGABYTE } from '../constants'
import { DownloadErrorType, DownloadWarningType, HttpHeader } from '../enums'
import { NftDownloadMetadata, INft } from '../interfaces'

export async function downloadNftMedia(nft: INft, accountIndex: number): Promise<void> {
    let downloadMetadata: NftDownloadMetadata = { isLoaded: false }
    try {
        const alreadyDownloaded = await isFileAlreadyDownloaded(nft)

        if (alreadyDownloaded) {
            downloadMetadata.isLoaded = true
            return
        }

        if (!nft.composedUrl) {
            downloadMetadata.isLoaded = true
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
            return
        }

        let downloadUrl = nft.composedUrl

        const response = await fetch(downloadUrl, { method: 'HEAD', cache: 'force-cache' })
        let headers = response.headers

        const isSoonaverse = nft.parsedMetadata?.issuerName === 'Soonaverse'
        if (isSoonaverse) {
            const newUrlAndHeaders = await getUrlAndHeadersFromOldSoonaverseStructure(nft, headers)
            downloadUrl = newUrlAndHeaders?.url ?? downloadUrl
            headers = newUrlAndHeaders?.headers ?? headers
        }

        const validation = validateFile(nft, headers)
        if (validation?.error || validation?.warning) {
            downloadMetadata = { ...downloadMetadata, ...validation }
        } else {
            await Platform.downloadFile(nft.composedUrl, nft.filePath)
            downloadMetadata.isLoaded = true
        }
    } catch (err) {
        downloadMetadata.error = { type: DownloadErrorType.Generic, message: err.message }
    }
    nft.downloadMetadata = downloadMetadata
    addOrUpdateNftInAllAccountNfts(accountIndex, nft)
}

function validateFile(nft: INft, headers: Headers): Partial<NftDownloadMetadata> {
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE

    const isValidMediaType = headers.get(HttpHeader.ContentType) !== nft.parsedMetadata?.type
    const hasValidFileSize =
        MAX_FILE_SIZE_IN_BYTES > 0 && Number(headers.get(HttpHeader.ContentLength)) > MAX_FILE_SIZE_IN_BYTES
    if (isValidMediaType) {
        return { error: { type: DownloadErrorType.NotMatchingFileTypes } }
    } else if (hasValidFileSize) {
        return { warning: { type: DownloadWarningType.FileTooLarge } }
    }

    return {}
}

async function getUrlAndHeadersFromOldSoonaverseStructure(
    nft: INft,
    headers: Headers
): Promise<{ url: string; headers: Headers }> {
    const isContentTypeEqualNftType = headers.get(HttpHeader.ContentType) === nft.parsedMetadata?.type
    if (!isContentTypeEqualNftType) {
        const backupUrl = nft.composedUrl + '/' + encodeURIComponent(nft?.parsedMetadata?.name)
        const backupResponse = await fetch(backupUrl, { method: 'HEAD', cache: 'force-cache' })
        return { url: backupUrl, headers: backupResponse.headers }
    }
}

async function isFileAlreadyDownloaded(nft: INft): Promise<boolean> {
    const basePath =
        process.env.NODE_ENV === 'development' ? 'build/__storage__' : await getStorageDirectoryOfProfiles()

    let status: number | undefined
    try {
        const localFile = await fetch(`${basePath}/${nft.filePath}/original`)
        status = localFile.status
    } catch (err) {
        status = undefined
    }

    return status === 200 || status === 304
}
