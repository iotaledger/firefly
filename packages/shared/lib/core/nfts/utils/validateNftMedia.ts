import { activeProfile, getStorageDirectoryOfProfiles } from '@core/profile'
import { get } from 'svelte/store'
import { BYTES_PER_MEGABYTE } from '../constants'
import { DownloadErrorType, DownloadWarningType, HttpHeader } from '../enums'
import { fetchWithTimeout } from './fetchWithTimeout'
import { NftDownloadMetadata, INft } from '../interfaces'

const HEAD_FETCH_TIMEOUT_SECONDS = 3

export async function validateNftMedia(
    nft: INft
): Promise<{ needsDownload: boolean; downloadMetadata?: NftDownloadMetadata; downloadUrl?: string }> {
    let downloadMetadata: NftDownloadMetadata = { isLoaded: false }
    try {
        const alreadyDownloaded = await isFileAlreadyDownloaded(nft)

        if (alreadyDownloaded) {
            downloadMetadata.isLoaded = true
        } else if (!nft.composedUrl) {
            downloadMetadata.isLoaded = true
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
        } else {
            let downloadUrl = nft.composedUrl

            const response = await fetchWithTimeout(downloadUrl, HEAD_FETCH_TIMEOUT_SECONDS, {
                method: 'HEAD',
                cache: 'force-cache',
            })
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
                return { needsDownload: true, downloadUrl, downloadMetadata: { isLoaded: false } }
            }
        }
    } catch (err) {
        if (err?.message === 'The user aborted a request.') {
            downloadMetadata.error = { type: DownloadErrorType.NotReachable }
        } else {
            downloadMetadata.error = { type: DownloadErrorType.Generic, message: err.message }
        }
    }

    return { needsDownload: false, downloadMetadata }
}

function validateFile(nft: INft, headers: Headers): Partial<NftDownloadMetadata> {
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE

    const isValidMediaType =
        headers.get(HttpHeader.ContentType) !== nft.parsedMetadata?.type &&
        headers.get(HttpHeader.ContentType) !== 'video/mp4'
    const hasValidFileSize =
        MAX_FILE_SIZE_IN_BYTES > 0 && Number(headers.get(HttpHeader.ContentLength)) > MAX_FILE_SIZE_IN_BYTES
    if (isValidMediaType) {
        return { error: { type: DownloadErrorType.NotMatchingFileTypes } }
    } else if (hasValidFileSize) {
        return { warning: { type: DownloadWarningType.TooLargeFile } }
    }
}

async function getUrlAndHeadersFromOldSoonaverseStructure(
    nft: INft,
    headers: Headers
): Promise<{ url: string; headers: Headers }> {
    const isContentTypeEqualNftType = headers.get(HttpHeader.ContentType) === nft.parsedMetadata?.type
    if (!isContentTypeEqualNftType) {
        const backupUrl = nft.composedUrl + '/' + encodeURIComponent(nft?.parsedMetadata?.name)
        const backupResponse = await fetchWithTimeout(backupUrl, HEAD_FETCH_TIMEOUT_SECONDS, {
            method: 'HEAD',
            cache: 'force-cache',
        })
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
