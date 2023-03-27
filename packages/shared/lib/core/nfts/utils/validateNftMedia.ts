import { activeProfile, getStorageDirectoryOfProfiles } from '@core/profile'
import { get } from 'svelte/store'
import { BYTES_PER_MEGABYTE } from '../constants'
import { DownloadErrorType, DownloadWarningType, HttpHeader } from '../enums'
import { fetchWithTimeout } from './fetchWithTimeout'
import { NftDownloadMetadata, INft } from '../interfaces'
import { addPersistedNftData, persistedNftForActiveProfile } from '../stores'

const HEAD_FETCH_TIMEOUT_SECONDS = 3

export async function validateNftMedia(
    nft: INft
): Promise<{ needsDownload: boolean; downloadMetadata?: NftDownloadMetadata; downloadUrl?: string }> {
    let downloadMetadata: NftDownloadMetadata = { isLoaded: false }
    const persistedNftData = get(persistedNftForActiveProfile)?.[nft.id]

    try {
        // TODO: do we want to trust the persisted store if a file is downloaded or do we check it everytime?
        const alreadyDownloaded = await isFileAlreadyDownloaded(nft)

        if (alreadyDownloaded) {
            downloadMetadata.isLoaded = true
        } else if (!nft.composedUrl) {
            downloadMetadata.isLoaded = true
            downloadMetadata.error = { type: DownloadErrorType.UnsupportedUrl }
        } else {
            let downloadUrl = nft.composedUrl
            let contentLength, contentType

            if (persistedNftData) {
                if (persistedNftData.error) {
                    throw persistedNftData.error
                }
                downloadUrl = persistedNftData.downloadUrl
                contentLength = persistedNftData.contentLength
                contentType = persistedNftData.contentType
            } else {
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
                contentLength = headers.get(HttpHeader.ContentLength)
                contentType = headers.get(HttpHeader.ContentType)

                addPersistedNftData(nft.id, { contentLength, contentType, responseCode: response.status, downloadUrl })
            }

            const validation = validateFile(nft, contentType, contentLength)
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

        addPersistedNftData(nft.id, { error: { message: err?.message } })
    }

    return { needsDownload: false, downloadMetadata }
}

function validateFile(nft: INft, contentType: string, contentLength: string): Partial<NftDownloadMetadata> {
    const MAX_FILE_SIZE_IN_BYTES = (get(activeProfile)?.settings?.maxMediaSizeInMegaBytes ?? 0) * BYTES_PER_MEGABYTE

    const isValidMediaType = contentType !== nft.parsedMetadata?.type
    const hasValidFileSize = MAX_FILE_SIZE_IN_BYTES > 0 && Number(contentLength) > MAX_FILE_SIZE_IN_BYTES
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
