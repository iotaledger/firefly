/**
 * The download progress metadata, used
 * when download an application update.
 */
export type IAppUpdateDownloadProgress = {
    total: number
    delta: number
    transferred: number
    percent: number
    bytesPerSecond: number
}
